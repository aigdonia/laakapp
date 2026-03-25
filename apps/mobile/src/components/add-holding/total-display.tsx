import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { TransactionDraft } from '@/src/types/holdings'

type Props = {
  draft: TransactionDraft
}

function computeTotal(draft: TransactionDraft): number {
  const qty = parseFloat(draft.quantity) || 0
  const cpu = parseFloat(draft.costPerUnit) || 0
  const est = parseFloat(draft.estimatedValue) || 0

  switch (draft.assetType) {
    case 'cash':
      return qty
    case 'real_estate':
      return est
    default:
      return qty * cpu
  }
}

function formatNumber(n: number): string {
  if (n === 0) return '—'
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function TotalDisplay({ draft }: Props) {
  const total = computeTotal(draft)
  const { t } = useTranslation('add_holding')

  return (
    <View className="rounded-xl p-4 mb-4 border border-[#ffd60a33] bg-card">
      <Text className="text-xs font-medium mb-1 text-muted">
        {t('total_cost')}
      </Text>
      <Text className="text-3xl font-bold text-accent">
        {formatNumber(total)}{' '}
        <Text className="text-base font-medium">{draft.currency}</Text>
      </Text>
    </View>
  )
}
