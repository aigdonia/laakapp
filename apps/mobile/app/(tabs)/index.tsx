import { useCallback, useMemo, useRef } from 'react'
import { ScrollView, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'

import { SwipeAnimatedScreen } from '@/src/components/swipe-animated-screen'
import { useHoldings } from '@/src/hooks/use-holdings'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { usePortfolioPresets } from '@/src/hooks/use-portfolio-presets'
import { usePortfolioScore } from '@/src/hooks/use-portfolio-score'
import { useHealthFactors } from '@/src/hooks/use-health-factors'
import { useStockCompliance } from '@/src/hooks/use-stock-compliance'
import { usePreferences } from '@/src/store/preferences'
import { useExchangeRates } from '@/src/hooks/use-exchange-rates'
import { usePortfolioHash } from '@/src/hooks/use-portfolio-hash'
import { useNarrative } from '@/src/hooks/use-narrative'
import { useDeepAnalysis } from '@/src/hooks/use-deep-analysis'
import { useAiFeatures, getFeatureConfig } from '@/src/hooks/use-ai-features'
import { buildRateMap, convertCurrency } from '@/src/lib/currency'
import { useCredits } from '@/src/store/credits'
import { showCreditsAlert } from '@/src/components/credits-alert'
import type { ComplianceSummary, ConcentrationInsight } from '@/src/types/insights'

import { PortfolioScoreGauge } from '@/src/components/insights/portfolio-score-gauge'
import { ScoreBreakdownSheet } from '@/src/components/insights/score-breakdown-sheet'
import { ComplianceBreakdownSheet } from '@/src/components/insights/compliance-breakdown-sheet'
import { ShariaComplianceCard } from '@/src/components/insights/sharia-compliance-card'
import { NarrativeBlock } from '@/src/components/insights/narrative-block'
import { DeepAnalysisBlock } from '@/src/components/insights/deep-analysis-block'
import { ConcentrationCard } from '@/src/components/insights/concentration-card'
import { InsightsEmptyState } from '@/src/components/insights/insights-empty-state'

export default function InsightsScreen() {
  const { data, isLoading } = useHoldings()
  const { data: assetClasses } = useAssetClasses()
  const { t, i18n } = useTranslation('insights')

  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const presetSlug = usePreferences((s) => s.portfolioPresetSlug)
  const shariaAuthority = usePreferences((s) => s.shariaAuthority)
  const { data: exchangeRates } = useExchangeRates()
  const rates = useMemo(() => buildRateMap(exchangeRates ?? []), [exchangeRates])
  const { data: presets } = usePortfolioPresets()
  const selectedPreset = presets?.find((p) => p.slug === presetSlug)

  const groups = data?.groups ?? []
  const allHoldings = useMemo(() => groups.flatMap((g) => g.holdings), [groups])
  const isEmpty = groups.length === 0

  const score = usePortfolioScore(groups, assetClasses, selectedPreset?.allocations ?? null)
  const breakdownRef = useRef<BottomSheetModal>(null)
  const complianceRef = useRef<BottomSheetModal>(null)

  // --- Sharia compliance ---
  const screenableHoldings = useMemo(
    () => allHoldings.filter((h) => h.assetType !== 'cash' && h.assetType !== 'gold'),
    [allHoldings],
  )
  const screenableSymbols = useMemo(
    () => screenableHoldings.map((h) => h.symbol).filter((s): s is string => !!s),
    [screenableHoldings],
  )
  const { data: complianceMap } = useStockCompliance(screenableSymbols, shariaAuthority)
  const { data: healthFactors } = useHealthFactors(complianceMap, screenableHoldings)

  const compliance = useMemo<ComplianceSummary>(() => {
    const total = screenableHoldings.length
    if (!complianceMap || Object.keys(complianceMap).length === 0) {
      return { compliant: 0, nonCompliant: 0, notScreened: total, total }
    }

    let compliant = 0
    let nonCompliant = 0
    let notScreened = 0

    for (const h of screenableHoldings) {
      const c = h.symbol ? complianceMap[h.symbol] : undefined
      if (!c || c.status === 'not_screened') notScreened++
      else if (c.status === 'compliant') compliant++
      else nonCompliant++ // non_compliant + doubtful
    }

    return { compliant, nonCompliant, notScreened, total }
  }, [screenableHoldings, complianceMap])

  // --- Concentration insight ---
  const concentration = useMemo<ConcentrationInsight | null>(() => {
    if (allHoldings.length === 0) return null

    const totalCost = groups.reduce((sum, g) => sum + g.totalCostInBase, 0)
    if (totalCost === 0) return null

    // Segments by asset class (based on cost basis)
    const segments = groups.map((g) => ({
      label: g.assetClass?.name ?? g.type,
      percentage: Math.round((g.totalCostInBase / totalCost) * 100),
      color: g.assetClass?.color ?? '#636366',
    }))

    // Top holding (convert to base currency for fair comparison)
    const sorted = [...allHoldings].sort(
      (a, b) =>
        convertCurrency(b.totalCost, b.currency, baseCurrency, rates) -
        convertCurrency(a.totalCost, a.currency, baseCurrency, rates),
    )
    const top = sorted[0]
    const topValueInBase = convertCurrency(top.totalCost, top.currency, baseCurrency, rates)
    const topPct = Math.round((topValueInBase / totalCost) * 100)
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
  }, [groups, allHoldings, baseCurrency, rates, t])

  // --- AI Features ---
  const { data: aiFeatures } = useAiFeatures()
  const creditBalance = useCredits((s) => s.balance)
  const narrativeConfig = getFeatureConfig(aiFeatures, 'narrative')
  const deepAnalysisConfig = getFeatureConfig(aiFeatures, 'deep_analysis')

  const guardCredits = useCallback((cost: number, onProceed: () => void) => {
    if (cost > 0 && creditBalance < cost) {
      showCreditsAlert({
        title: t('insufficient_credits'),
        message: t('insufficient_credits_message', { count: cost }),
        actionLabel: t('buy_credits'),
      })
      return
    }
    onProceed()
  }, [creditBalance, t])

  const portfolioHash = usePortfolioHash(allHoldings)
  const narrativeState = useNarrative(
    allHoldings, compliance, portfolioHash, i18n.language, narrativeConfig,
  )
  const deepAnalysisState = useDeepAnalysis(
    allHoldings, compliance, complianceMap, portfolioHash, score, i18n.language, deepAnalysisConfig,
  )

  // --- Loading ---
  if (isLoading) {
    return (
      <SwipeAnimatedScreen>
        <View className="flex-1 items-center justify-center bg-screen">
          <Text className="text-muted">{t('common:loading')}</Text>
        </View>
      </SwipeAnimatedScreen>
    )
  }

  // --- Empty state ---
  if (isEmpty) {
    return <SwipeAnimatedScreen><InsightsEmptyState /></SwipeAnimatedScreen>
  }

  // --- Freshness ---
  const lastDates = allHoldings
    .map((h) => h.lastDate)
    .filter((d): d is number => d !== null)
  const lastUpdated = lastDates.length > 0 ? new Date(Math.max(...lastDates) * 1000) : null

  return (
    <SwipeAnimatedScreen>
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
                complianceRef.current?.present()
              }}
            />
          </View>
        )}

        {/* 3. AI Narrative — show if already generated or has credits */}
        {(narrativeState.narrative || creditBalance >= 1) && <View className="mb-3">
          <NarrativeBlock
            narrative={narrativeState.narrative}
            isStale={narrativeState.isStale}
            isLoading={narrativeState.isLoading}
            creditCost={narrativeState.creditCost}
            onGenerate={() => guardCredits(narrativeState.creditCost, () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              narrativeState.generate()
            })}
          />
        </View>}

        {/* 4. Deep Portfolio Analysis — appears after narrative is generated */}
        {narrativeState.narrative && <View className="mb-3">
          <DeepAnalysisBlock
            analysis={deepAnalysisState.analysis}
            isStale={deepAnalysisState.isStale}
            isLoading={deepAnalysisState.isLoading}
            creditCost={deepAnalysisConfig.creditCost}
            onGenerate={() => guardCredits(deepAnalysisConfig.creditCost, () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              deepAnalysisState.generate()
            })}
          />
        </View>}

        {/* 5. Concentration Insight */}
        {concentration && (
          <View className="mb-3">
            <ConcentrationCard concentration={concentration} />
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
      <ComplianceBreakdownSheet
        ref={complianceRef}
        holdings={screenableHoldings}
        complianceMap={complianceMap}
      />
    </SwipeAnimatedScreen>
  )
}
