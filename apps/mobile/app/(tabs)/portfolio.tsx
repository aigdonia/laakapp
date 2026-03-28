import { useCallback, useRef, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { type HoldingGroup, useHoldings } from '@/src/hooks/use-holdings'
import { PortfolioSummary } from '@/src/components/portfolio/portfolio-summary'
import { HoldingCard } from '@/src/components/portfolio/holding-card'
import { AssetClassSheet } from '@/src/components/portfolio/asset-class-sheet'
import { usePreferences } from '@/src/store/preferences'

const MAX_INLINE_CARDS = 3

export default function PortfolioScreen() {
  const { data, isLoading, error } = useHoldings()
  if (error) console.error('Holdings query failed:', error)
  const amountsVisible = usePreferences((s) => s.amountsVisible)
  const toggleAmountsVisible = usePreferences((s) => s.toggleAmountsVisible)
  const groups = data?.groups ?? []
  const costByCurrency = data?.costByCurrency ?? {}
  const isEmpty = groups.length === 0
  const { t } = useTranslation('portfolio')

  const sheetRef = useRef<BottomSheetModal>(null)
  const [selectedGroup, setSelectedGroup] = useState<HoldingGroup | null>(null)

  const openSheet = useCallback(
    (group: HoldingGroup) => {
      setSelectedGroup(group)
      sheetRef.current?.present()
    },
    [],
  )

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-screen">
        <Text className="text-muted">{t('common:loading')}</Text>
      </View>
    )
  }

  if (isEmpty) {
    return (
      <View className="flex-1 items-center justify-center bg-screen px-6">
        <Text className="text-2xl font-bold text-text text-center">
          {t('empty_title')}
        </Text>
        <Text className="text-base text-muted text-center mt-2">
          {t('empty_subtitle')}
        </Text>
        <Pressable
          className="bg-accent rounded-2xl px-14 py-4 mt-8 active:opacity-70"
          onPress={() => router.push('/add-holding')}
        >
          <Text className="text-[#1c1c1e] text-base font-bold">{t('add_holding')}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-screen"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        <PortfolioSummary
          costByCurrency={costByCurrency}
          groups={groups}
          amountsVisible={amountsVisible}
          onToggleVisibility={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            toggleAmountsVisible()
          }}
        />

        {/* Grouped holdings */}
        <View className="px-4 pt-2">
          {groups.map((group) => {
            const color = group.assetClass?.color ?? '#636366'
            const name = group.assetClass?.name ?? group.type
            const count = group.holdings.length
            const hasMore = count > MAX_INLINE_CARDS
            const visibleHoldings = hasMore
              ? group.holdings.slice(0, MAX_INLINE_CARDS)
              : group.holdings

            return (
              <View key={group.type} className="mb-4">
                {/* Section header */}
                <View className="flex-row items-center justify-between px-1 mb-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <Text className="text-sm font-bold text-text">
                      {name}
                    </Text>
                    <Text className="text-xs text-muted">{count}</Text>
                  </View>
                  {hasMore && (
                    <Pressable
                      className="active:opacity-70"
                      onPress={() => openSheet(group)}
                    >
                      <Text className="text-sm font-medium text-accent">
                        {t('common:more')}
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* Holding cards (max 3 inline) */}
                <View className="gap-1.5">
                {visibleHoldings.map((holding) => (
                  <HoldingCard
                    key={holding.holdingKey}
                    holding={holding}
                    typeName={name}
                    color={color}
                    amountsVisible={amountsVisible}
                    onPress={() =>
                      router.push(
                        `/holding/${encodeURIComponent(holding.holdingKey)}`,
                      )
                    }
                  />
                ))}
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      <AssetClassSheet
        ref={sheetRef}
        group={selectedGroup}
        amountsVisible={amountsVisible}
      />
    </>
  )
}
