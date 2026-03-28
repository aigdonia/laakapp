import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { IconSearch } from '@tabler/icons-react-native'
import { useTranslation } from 'react-i18next'
import type { FieldConfig } from '@fin-ai/shared'
import type { Stock } from '@fin-ai/shared'

import { useStockSearch } from '@/src/hooks/use-stocks'
import { useThemeColors } from '@/src/theme/colors'

type Props = {
  config: FieldConfig
  value: string
  onChange: (value: string) => void
  onStockSelect?: (stock: Stock) => void
  disabled?: boolean
  filterSector?: string
}

export function SearchableField({
  config,
  value,
  onChange,
  onStockSelect,
  disabled,
  filterSector,
}: Props) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { results: rawResults } = useStockSearch(query)
  const colors = useThemeColors()
  const { t } = useTranslation('add_holding')

  const results = filterSector
    ? rawResults.filter((s) => s.sector?.toLowerCase().includes(filterSector))
    : rawResults

  const showResults = focused && query.trim().length > 0 && results.length > 0

  return (
    <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
      <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-text">
        {config.label}
      </Text>

      {value && !focused ? (
        <Pressable
          className="rounded-xl px-3.5 py-3 bg-input flex-row items-center justify-between"
          onPress={() => {
            if (!disabled) {
              setFocused(true)
              setQuery(value)
            }
          }}
        >
          <Text className="text-base font-semibold text-accent">{value}</Text>
          <Text className="text-xs text-muted">{t('tap_to_change')}</Text>
        </Pressable>
      ) : (
        <View className="flex-row items-center rounded-xl px-3.5 py-2.5 gap-2.5 bg-input">
          <IconSearch size={16} color={colors.subtle} />
          <TextInput
            className="flex-1 text-base p-0 text-text"
            placeholderTextColorClassName="text-subtle"
            placeholder={config.placeholder ?? `Search ${config.label.toLowerCase()}...`}
            value={query}
            onChangeText={(text) => {
              setQuery(text)
              if (!focused) setFocused(true)
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              // Delay to allow press on results
              setTimeout(() => setFocused(false), 200)
            }}
            autoCorrect={false}
            autoCapitalize="characters"
            editable={!disabled}
          />
        </View>
      )}

      {showResults && (
        <View className="rounded-xl border border-border max-h-48 overflow-hidden mt-1.5 bg-card">
          {results.map((item) => (
            <Pressable
              key={item.id}
              className="flex-row items-center px-3.5 py-2.5 gap-3 border-b border-border active:opacity-70"
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                onChange(item.symbol)
                onStockSelect?.(item)
                setQuery('')
                setFocused(false)
              }}
            >
              <Text className="text-sm font-bold w-[60px] text-accent">{item.symbol}</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-text" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-xs mt-0.5 text-muted">{item.exchange}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  )
}
