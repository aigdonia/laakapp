import { useCallback, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { createMMKV } from 'react-native-mmkv'
import { useTranslation } from 'react-i18next'

import { useHoldings } from '@/src/hooks/use-holdings'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { usePortfolioPresets } from '@/src/hooks/use-portfolio-presets'
import { usePortfolioScore } from '@/src/hooks/use-portfolio-score'
import { useHealthFactors } from '@/src/hooks/use-health-factors'
import { usePreferences } from '@/src/store/preferences'
import { useThemeColors } from '@/src/theme/colors'
import type { ComplianceSummary, ConcentrationInsight, LearningNudge } from '@/src/types/insights'

import { PortfolioScoreGauge } from '@/src/components/insights/portfolio-score-gauge'
import { ScoreBreakdownSheet } from '@/src/components/insights/score-breakdown-sheet'
import { ShariaComplianceCard } from '@/src/components/insights/sharia-compliance-card'
import { NarrativeBlock } from '@/src/components/insights/narrative-block'
import { ConcentrationCard } from '@/src/components/insights/concentration-card'
import { LearningNudgeCard } from '@/src/components/insights/learning-nudge-card'
import { InsightsEmptyState } from '@/src/components/insights/insights-empty-state'

// --- MMKV for dismissed nudges ---
const insightsMmkv = createMMKV({ id: 'insights-state' })

// --- Learning nudges catalog ---
const NUDGES: LearningNudge[] = [
  {
    id: 'sukuk-intro',
    titleKey: 'nudge_sukuk_title',
    descriptionKey: 'nudge_sukuk_description',
    triggerWhenMissing: ['sukuk'],
  },
  {
    id: 'gold-hedge',
    titleKey: 'nudge_gold_title',
    descriptionKey: 'nudge_gold_description',
    triggerWhenMissing: ['gold'],
  },
  {
    id: 'etf-basics',
    titleKey: 'nudge_etf_title',
    descriptionKey: 'nudge_etf_description',
    triggerWhenMissing: ['etf'],
  },
  {
    id: 'real-estate-investing',
    titleKey: 'nudge_real_estate_title',
    descriptionKey: 'nudge_real_estate_description',
    triggerWhenMissing: ['real_estate'],
  },
  {
    id: 'crypto-screening',
    titleKey: 'nudge_crypto_title',
    descriptionKey: 'nudge_crypto_description',
    triggerWhenMissing: ['crypto'],
  },
]

export default function InsightsScreen() {
  const { data, isLoading } = useHoldings()
  const { data: assetClasses } = useAssetClasses()
  const amountsVisible = usePreferences((s) => s.amountsVisible)
  const colors = useThemeColors()
  const { t } = useTranslation('insights')

  const presetSlug = usePreferences((s) => s.portfolioPresetSlug)
  const { data: presets } = usePortfolioPresets()
  const selectedPreset = presets?.find((p) => p.slug === presetSlug)

  const groups = data?.groups ?? []
  const allHoldings = useMemo(() => groups.flatMap((g) => g.holdings), [groups])
  const isEmpty = groups.length === 0

  const score = usePortfolioScore(groups, assetClasses, selectedPreset?.allocations ?? null)
  const { data: healthFactors } = useHealthFactors()
  const breakdownRef = useRef<BottomSheetModal>(null)

  // --- Sharia compliance (mock for MVP — no screening data yet) ---
  const compliance = useMemo<ComplianceSummary>(() => {
    // Exclude cash & gold from screening count
    const screenable = allHoldings.filter(
      (h) => h.assetType !== 'cash' && h.assetType !== 'gold',
    )
    // MVP mock: treat all as "not screened"
    return {
      compliant: 0,
      nonCompliant: 0,
      notScreened: screenable.length,
      total: screenable.length,
    }
  }, [allHoldings])

  // --- Concentration insight ---
  const concentration = useMemo<ConcentrationInsight | null>(() => {
    if (allHoldings.length === 0) return null

    const totalValue = groups.reduce((sum, g) => sum + g.totalValue, 0)
    if (totalValue === 0) return null

    // Segments by asset class
    const segments = groups.map((g) => ({
      label: g.assetClass?.name ?? g.type,
      percentage: Math.round((g.totalValue / totalValue) * 100),
      color: g.assetClass?.color ?? '#636366',
    }))

    // Top holding
    const sorted = [...allHoldings].sort((a, b) => b.totalCost - a.totalCost)
    const top = sorted[0]
    const topPct = Math.round((top.totalCost / totalValue) * 100)
    const topHolding = {
      name: top.symbol ?? top.name ?? top.assetType,
      percentage: topPct,
    }

    // Verdict
    const maxGroupPct = Math.max(...segments.map((s) => s.percentage))
    let verdict: string
    if (segments.length >= 4 && maxGroupPct < 40) {
      verdict = t('well_diversified')
    } else if (maxGroupPct >= 70) {
      const dominant = segments.find((s) => s.percentage === maxGroupPct)
      verdict = t('heavily_concentrated', { label: dominant?.label ?? 'one asset class', percentage: maxGroupPct })
    } else if (segments.length === 1) {
      verdict = t('entirely_in', { label: segments[0].label })
    } else {
      verdict = t('moderately_diversified')
    }

    return { topHolding, segments, verdict }
  }, [groups, allHoldings, t])

  // --- Learning nudge ---
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(() => {
    const stored = insightsMmkv.getString('dismissed-nudges')
    return stored ? new Set(JSON.parse(stored)) : new Set()
  })

  const activeNudge = useMemo(() => {
    const holdingTypes = new Set(groups.map((g) => g.type))
    return NUDGES.find(
      (n) =>
        !dismissedNudges.has(n.id) &&
        n.triggerWhenMissing.some((t) => !holdingTypes.has(t)),
    ) ?? null
  }, [groups, dismissedNudges])

  const dismissNudge = useCallback((id: string) => {
    setDismissedNudges((prev) => {
      const next = new Set(prev)
      next.add(id)
      insightsMmkv.set('dismissed-nudges', JSON.stringify([...next]))
      return next
    })
  }, [])

  // --- Loading ---
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-screen">
        <Text className="text-muted">{t('common:loading')}</Text>
      </View>
    )
  }

  // --- Empty state ---
  if (isEmpty) {
    return <InsightsEmptyState />
  }

  // --- Freshness ---
  const lastDates = allHoldings
    .map((h) => h.lastDate)
    .filter((d): d is number => d !== null)
  const lastUpdated = lastDates.length > 0 ? new Date(Math.max(...lastDates)) : null

  return (
    <>
      <ScrollView
        className="flex-1 bg-screen"
        contentContainerClassName="pb-32 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Portfolio Health Score */}
        {score && (
          <View className="mb-3">
            <PortfolioScoreGauge
              score={score}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                breakdownRef.current?.present()
              }}
            />
          </View>
        )}

        {/* 2. Sharia Compliance */}
        {compliance.total > 0 && (
          <View className="mb-3">
            <ShariaComplianceCard
              compliance={compliance}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                // Future: open compliance detail sheet
              }}
            />
          </View>
        )}

        {/* 3. AI Narrative (locked for MVP) */}
        <View className="mb-3">
          <NarrativeBlock
            narrative={null}
            onGenerate={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              // Future: AI call with credit deduction
            }}
          />
        </View>

        {/* 4. Concentration Insight */}
        {concentration && (
          <View className="mb-3">
            <ConcentrationCard concentration={concentration} />
          </View>
        )}

        {/* 5. Learning Nudge */}
        {activeNudge && (
          <View className="mb-3">
            <LearningNudgeCard
              nudge={activeNudge}
              onDismiss={() => dismissNudge(activeNudge.id)}
              onPress={() => router.push('/(tabs)/learn')}
            />
          </View>
        )}

        {/* 6. Freshness Indicator */}
        {lastUpdated && (
          <View className="mx-4 items-center py-3">
            <Text className="text-xs text-subtle">
              {t('data_as_of', {
                date: lastUpdated.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }),
              })}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Score Breakdown Bottom Sheet */}
      <ScoreBreakdownSheet ref={breakdownRef} score={score} factors={healthFactors} />
    </>
  )
}
