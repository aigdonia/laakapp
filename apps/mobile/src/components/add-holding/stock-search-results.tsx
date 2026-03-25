import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import type { Stock } from '@fin-ai/shared'

type Props = {
  results: Stock[]
  onSelect: (stock: Stock) => void
}

export function StockSearchResults({ results, onSelect }: Props) {
  if (results.length === 0) return null

  return (
    <View className="rounded-xl border border-border max-h-60 overflow-hidden mb-3 bg-card">
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable
            className="flex-row items-center px-3.5 py-3 gap-3 border-b border-border active:opacity-70"
            style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              onSelect(item)
            }}
          >
            <Text className="text-base font-bold w-[60px] text-accent">{item.symbol}</Text>
            <View className="flex-1">
              <Text className="text-sm font-medium text-text" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-xs mt-0.5 text-muted">
                {item.exchange}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}
