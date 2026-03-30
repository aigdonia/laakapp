import { forwardRef, useMemo } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { useTranslation } from 'react-i18next'
import type { StockComplianceLean } from '@fin-ai/shared'

import { useThemeColors } from '@/src/theme/colors'
import type { AggregatedHolding } from '@/src/types/holdings'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

type ComplianceMap = Record<string, StockComplianceLean>

type Props = {
  holdings: AggregatedHolding[]
  complianceMap: ComplianceMap | undefined
}

type HoldingWithStatus = {
  holding: AggregatedHolding
  status: 'compliant' | 'non_compliant' | 'not_screened'
}

const STATUS_COLORS = {
  compliant: '#34c759',
  non_compliant: '#ff3b30',
  not_screened: undefined, // uses colors.subtle
} as const

export const ComplianceBreakdownSheet = forwardRef<BottomSheetModal, Props>(
  function ComplianceBreakdownSheet({ holdings, complianceMap }, ref) {
    const colors = useThemeColors()
    const { t } = useTranslation('insights')

    const groups = useMemo(() => {
      const items: HoldingWithStatus[] = holdings.map((h) => {
        const c = h.symbol ? complianceMap?.[h.symbol] : undefined
        let status: HoldingWithStatus['status'] = 'not_screened'
        if (c?.status === 'compliant') status = 'compliant'
        else if (c?.status === 'non_compliant' || c?.status === 'doubtful') status = 'non_compliant'
        return { holding: h, status }
      })

      return {
        compliant: items.filter((i) => i.status === 'compliant'),
        non_compliant: items.filter((i) => i.status === 'non_compliant'),
        not_screened: items.filter((i) => i.status === 'not_screened'),
      }
    }, [holdings, complianceMap])

    const sections = [
      { key: 'compliant' as const, label: t('compliant'), items: groups.compliant },
      { key: 'non_compliant' as const, label: t('non_compliant'), items: groups.non_compliant },
      { key: 'not_screened' as const, label: t('not_screened'), items: groups.not_screened },
    ].filter((s) => s.items.length > 0)

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['55%', '90%']}
        backdropComponent={Backdrop}
        backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetScrollView className="px-5 pb-10 pt-2">
          <Text className="text-lg font-semibold text-text mb-1">
            {t('compliance_breakdown')}
          </Text>
          <Text className="text-sm text-muted mb-5">
            {t('compliance_breakdown_description')}
          </Text>

          {sections.map((section) => (
            <View key={section.key} className="mb-5">
              <View className="flex-row items-center gap-2 mb-2.5">
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: STATUS_COLORS[section.key] ?? colors.subtle,
                    opacity: section.key === 'not_screened' ? 0.4 : 1,
                  }}
                />
                <Text className="text-sm font-semibold text-text">
                  {section.label} ({section.items.length})
                </Text>
              </View>

              {section.items.map(({ holding }) => (
                <View
                  key={holding.holdingKey}
                  className="flex-row items-center py-2.5 px-1 border-b border-border/30"
                >
                  <Text className="text-sm font-bold w-[70px] text-accent">
                    {holding.symbol ?? '—'}
                  </Text>
                  <Text className="flex-1 text-sm text-text" numberOfLines={1}>
                    {holding.name ?? holding.symbol ?? holding.assetType}
                  </Text>
                  {holding.exchange && (
                    <Text className="text-xs text-muted ml-2">{holding.exchange}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)
