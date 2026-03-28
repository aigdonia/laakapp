import { useMemo, useState } from 'react'
import { ActivityIndicator, Keyboard, Pressable, ScrollView, Text, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { IconChevronLeft, IconChevronDown } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'

import type { Stock } from '@fin-ai/shared'
import type { TransactionDraft } from '@/src/types/holdings'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { useLookups, buildLookupOptionsMap } from '@/src/hooks/use-lookups'
import { useThemeColors } from '@/src/theme/colors'
import { FormField } from './form-field'
import { TotalDisplay } from './total-display'

/** Identity field keys — locked when adding to existing holding */
const IDENTITY_KEYS = new Set([
  'name', 'symbol', 'exchange', 'currency', 'unit', 'purity',
  'profitRate', 'maturityDate',
])

/** Transaction-specific fields — always editable */
const TRANSACTION_KEYS = new Set([
  'quantity', 'costPerUnit', 'date', 'fees', 'notes', 'estimatedValue',
])

function getDraftValue(draft: TransactionDraft, key: string): string {
  return (draft as unknown as Record<string, string>)[key] ?? ''
}

type Props = {
  draft: TransactionDraft
  onChange: (draft: TransactionDraft) => void
  onBack: () => void
  onSave: () => void
  saving: boolean
  lockedFields?: boolean
}

export function HoldingForm({ draft, onChange, onBack, onSave, saving, lockedFields }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const advancedHeight = useSharedValue(0)
  const advancedOpacity = useSharedValue(0)
  const colors = useThemeColors()
  const { data: assetClasses } = useAssetClasses()
  const { data: lookups } = useLookups()
  const { t } = useTranslation('add_holding')

  const lookupOptionsMap = useMemo(() => buildLookupOptionsMap(lookups), [lookups])

  const typeConfig = useMemo(
    () => assetClasses?.find((ac) => ac.slug === draft.assetType),
    [draft.assetType, assetClasses],
  )

  const fields = useMemo(() => {
    const raw = typeConfig?.fields ?? []
    return raw.map((f) => {
      if (f.type.startsWith('lookup:')) {
        const category = f.type.replace('lookup:', '')
        const options = lookupOptionsMap[category]
        if (options) return { ...f, options }
      }
      return f
    })
  }, [typeConfig?.fields, lookupOptionsMap])
  const essentialFields = fields.filter((f) => !f.advanced)
  const advancedFields = fields.filter((f) => f.advanced)

  const updateField = (key: string, value: string) => {
    onChange({ ...draft, [key]: value })
  }

  const handleStockSelect = (stock: Stock) => {
    onChange({
      ...draft,
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
    })
  }

  const toggleAdvanced = () => {
    const opening = !advancedOpen
    setAdvancedOpen(opening)
    Haptics.selectionAsync()
    advancedHeight.value = withTiming(opening ? 1 : 0, { duration: 300 })
    advancedOpacity.value = withTiming(opening ? 1 : 0, { duration: 250 })
  }

  const animatedAdvancedStyle = useAnimatedStyle(() => ({
    maxHeight: advancedHeight.value * 500,
    opacity: advancedOpacity.value,
    overflow: 'hidden' as const,
  }))

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${advancedHeight.value * 180}deg` }],
  }))

  const hasRequiredFields = useMemo(() => {
    return fields
      .filter((f) => f.required)
      .every((f) => {
        const val = getDraftValue(draft, f.key)
        return val && val.trim().length > 0
      })
  }, [draft, fields])

  const isFieldLocked = (key: string) =>
    lockedFields && IDENTITY_KEYS.has(key) && !TRANSACTION_KEYS.has(key)

  const buyLabel = draft.assetType === 'cash' ? t('add') : t('buy')
  const sellLabel = draft.assetType === 'cash' ? t('spend') : t('sell')

  return (
    <View className="flex-1 bg-screen">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Pressable onPress={onBack} hitSlop={12}>
          <IconChevronLeft size={24} color={colors.text} />
        </Pressable>
        <View className="flex-row items-center gap-2">
          {typeConfig && (
            <View
              className="px-2.5 py-1 rounded-lg"
              style={{ backgroundColor: typeConfig.color + '20' }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: typeConfig.color }}
              >
                {typeConfig.name}
              </Text>
            </View>
          )}
          {draft.symbol ? (
            <Text className="text-lg font-bold text-text">
              {draft.symbol}
            </Text>
          ) : null}
        </View>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2 pb-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {/* Essential Fields */}
        {essentialFields.map((field) => (
          <FormField
            key={field.key}
            config={field}
            value={getDraftValue(draft, field.key)}
            onChange={(val) => updateField(field.key, val)}
            onStockSelect={handleStockSelect}
            disabled={isFieldLocked(field.key)}
          />
        ))}

        {/* Total */}
        <TotalDisplay draft={draft} />

        {/* Advanced Fields Accordion */}
        {advancedFields.length > 0 && (
          <>
            <Pressable className="flex-row items-center justify-center py-3 gap-1.5" onPress={toggleAdvanced}>
              <Text className="text-sm font-medium text-muted">
                {t('more_details')}
              </Text>
              <Animated.View style={chevronStyle}>
                <IconChevronDown size={18} color={colors.muted} />
              </Animated.View>
            </Pressable>

            <Animated.View style={animatedAdvancedStyle}>
              {advancedFields.map((field) => (
                <FormField
                  key={field.key}
                  config={field}
                  value={getDraftValue(draft, field.key)}
                  onChange={(val) => updateField(field.key, val)}
                  onStockSelect={handleStockSelect}
                  disabled={isFieldLocked(field.key)}
                />
              ))}
            </Animated.View>
          </>
        )}

        {/* Buy/Sell Toggle + Save Button */}
        <View className="pt-3 pb-2">
          <View className="flex-row bg-card rounded-xl p-1 mb-3">
            <Pressable
              className={`flex-1 py-2.5 rounded-lg items-center ${draft.transactionType === 'buy' ? 'bg-accent' : ''}`}
              onPress={() => {
                Haptics.selectionAsync()
                updateField('transactionType', 'buy')
              }}
            >
              <Text
                className={`text-sm font-semibold ${draft.transactionType === 'buy' ? 'text-[#1c1c1e]' : 'text-muted'}`}
              >
                {buyLabel}
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-2.5 rounded-lg items-center ${draft.transactionType === 'sell' ? 'bg-red-500' : ''}`}
              onPress={() => {
                Haptics.selectionAsync()
                updateField('transactionType', 'sell')
              }}
            >
              <Text
                className={`text-sm font-semibold ${draft.transactionType === 'sell' ? 'text-white' : 'text-muted'}`}
              >
                {sellLabel}
              </Text>
            </Pressable>
          </View>

          <Pressable
            className={`bg-accent rounded-2xl py-4 items-center ${!hasRequiredFields ? 'opacity-40' : ''}`}
            onPress={() => {
              if (!hasRequiredFields || saving) return
              Keyboard.dismiss()
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              onSave()
            }}
            disabled={!hasRequiredFields || saving}
          >
            {saving ? (
              <ActivityIndicator color="#1c1c1e" />
            ) : (
              <Text className="text-[#1c1c1e] text-base font-bold">
                {t('add_transaction')}
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
