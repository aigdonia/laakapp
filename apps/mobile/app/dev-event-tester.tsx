import { useCallback, useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useRouter } from 'expo-router'
import { IconChevronLeft, IconPlayerPlay, IconTrash } from '@tabler/icons-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useThemeColors } from '@/src/theme/colors'
import { reportEvent } from '@/src/lib/activity'
import { api } from '@/src/lib/api'

type EventTypeDef = {
  slug: string
  label: string
  metadataSchema: Array<{ key: string; label: string; type: string }>
  enabled: boolean
}

export default function DevEventTesterScreen() {
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [eventTypes, setEventTypes] = useState<EventTypeDef[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Record<string, string>>({})
  const [firing, setFiring] = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  useEffect(() => {
    api.get<EventTypeDef[]>('/event-types').then((types) => {
      setEventTypes(types.filter((t) => t.enabled))
    }).catch(() => {})
  }, [])

  const selected = eventTypes.find((t) => t.slug === selectedSlug)

  const handleFire = useCallback(async () => {
    if (!selectedSlug) return
    setFiring(true)
    setLastResult(null)
    try {
      // Build typed metadata
      const typedMeta: Record<string, unknown> = {}
      if (selected?.metadataSchema) {
        for (const field of selected.metadataSchema) {
          const val = metadata[field.key]
          if (val !== undefined && val !== '') {
            typedMeta[field.key] = field.type === 'number' ? Number(val) : val
          }
        }
      }

      const response = await reportEvent(selectedSlug, typedMeta)
      const triggered = response.triggered.length
      const actions = response.triggered.map((a) => a.actionType).join(', ')
      setLastResult(
        triggered > 0
          ? `${triggered} action(s) triggered: ${actions}`
          : 'No rules triggered'
      )
    } catch (err) {
      setLastResult(`Error: ${err instanceof Error ? err.message : 'unknown'}`)
    } finally {
      setFiring(false)
    }
  }, [selectedSlug, metadata, selected])

  return (
    <View className="flex-1 bg-screen" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border">
        <Pressable onPress={() => router.back()} hitSlop={12} className="mr-3">
          <IconChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text className="text-lg font-semibold text-text">Event Tester</Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-4 gap-4">
        {/* Event Type Picker */}
        <View className="gap-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-wider">
            Event Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {eventTypes.map((et) => (
              <Pressable
                key={et.slug}
                className="rounded-lg px-3 py-2 border"
                style={{
                  borderColor: selectedSlug === et.slug ? colors.accent : colors.border,
                  backgroundColor: selectedSlug === et.slug ? `${colors.accent}15` : colors.card,
                }}
                onPress={() => {
                  setSelectedSlug(et.slug)
                  setMetadata({})
                  setLastResult(null)
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: selectedSlug === et.slug ? colors.accent : colors.text }}
                >
                  {et.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Metadata Fields */}
        {selected && selected.metadataSchema.length > 0 && (
          <View className="gap-3">
            <Text className="text-xs font-semibold text-muted uppercase tracking-wider">
              Metadata
            </Text>
            {selected.metadataSchema.map((field) => (
              <View key={field.key} className="gap-1">
                <Text className="text-xs text-muted">
                  {field.label || field.key} ({field.type})
                </Text>
                <TextInput
                  className="rounded-xl px-4 py-3 text-sm border border-border"
                  style={{ backgroundColor: colors.card, color: colors.text }}
                  placeholderTextColor={colors.subtle}
                  placeholder={field.key}
                  value={metadata[field.key] ?? ''}
                  onChangeText={(val) =>
                    setMetadata((prev) => ({ ...prev, [field.key]: val }))
                  }
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                />
              </View>
            ))}
          </View>
        )}

        {/* Fire Button */}
        {selectedSlug && (
          <Pressable
            className="flex-row items-center justify-center gap-2 rounded-xl py-4 active:opacity-80"
            style={{ backgroundColor: colors.accent }}
            onPress={handleFire}
            disabled={firing}
          >
            <IconPlayerPlay size={18} color="#1c1c1e" />
            <Text className="text-base font-semibold" style={{ color: '#1c1c1e' }}>
              {firing ? 'Firing...' : `Fire ${selectedSlug}`}
            </Text>
          </Pressable>
        )}

        {/* Result */}
        {lastResult && (
          <View className="rounded-xl bg-card border border-border px-4 py-3">
            <Text className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
              Result
            </Text>
            <Text className="text-sm text-text">{lastResult}</Text>
          </View>
        )}

        {/* Quick presets */}
        {selectedSlug && (
          <View className="gap-2">
            <Text className="text-xs font-semibold text-muted uppercase tracking-wider">
              Quick Fill
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedSlug === 'holding_added' && (
                <>
                  <QuickFill label="Stock" onPress={() => setMetadata({ assetType: 'stock', symbol: 'AAPL' })} colors={colors} />
                  <QuickFill label="ETF" onPress={() => setMetadata({ assetType: 'etf', symbol: 'VTI' })} colors={colors} />
                  <QuickFill label="Gold" onPress={() => setMetadata({ assetType: 'gold', symbol: '' })} colors={colors} />
                  <QuickFill label="Cash" onPress={() => setMetadata({ assetType: 'cash', symbol: '' })} colors={colors} />
                </>
              )}
              {selectedSlug === 'transaction_added' && (
                <>
                  <QuickFill label="Stock" onPress={() => setMetadata({ assetType: 'stock', symbol: 'MSFT' })} colors={colors} />
                  <QuickFill label="ETF" onPress={() => setMetadata({ assetType: 'etf', symbol: 'SPY' })} colors={colors} />
                </>
              )}
              <QuickFill
                label="Clear"
                onPress={() => setMetadata({})}
                colors={colors}
                destructive
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function QuickFill({
  label,
  onPress,
  colors,
  destructive,
}: {
  label: string
  onPress: () => void
  colors: ReturnType<typeof useThemeColors>
  destructive?: boolean
}) {
  return (
    <Pressable
      className="rounded-lg px-3 py-2 border border-border active:opacity-70"
      style={{ backgroundColor: colors.card }}
      onPress={onPress}
    >
      <Text
        className="text-xs font-medium"
        style={{ color: destructive ? '#ef4444' : colors.muted }}
      >
        {label}
      </Text>
    </Pressable>
  )
}
