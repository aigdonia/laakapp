import { Pressable, Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import type { EnrichedHolding } from '@/src/types/holdings'
import { parseHoldingKey } from '@/src/db/aggregation-queries'
import { Redacted } from './redacted'

type Props = {
  holding: EnrichedHolding
  typeName: string
  color: string
  amountsVisible?: boolean
  onPress: () => void
}

function deriveDisplay(holding: EnrichedHolding): { title: string; subtitle: string } {
  const { assetType, keyValues } = parseHoldingKey(holding.holdingKey)

  if (assetType === 'cash') {
    const currency = keyValues.currency ?? holding.currency
    const txnPart = holding.transactionCount > 1 ? ` · ${holding.transactionCount} txns` : ''
    return { title: currency, subtitle: txnPart.trim() }
  }

  if (assetType === 'gold') {
    const purity = keyValues.purity ?? '24K'
    const unit = keyValues.unit ?? 'g'
    const currency = keyValues.currency ?? holding.currency
    const parts = [`${holding.totalQuantity}${unit}`, currency].filter(Boolean)
    return { title: purity, subtitle: parts.join(' · ') }
  }

  // Default: stock, etf, crypto, etc.
  const hasSymbol = !!holding.symbol
  const title = hasSymbol ? holding.symbol! : (holding.name ?? '')
  const subtitle = hasSymbol && holding.name !== holding.symbol
    ? [holding.name, holding.exchange].filter(Boolean).join(' · ')
    : [holding.exchange].filter(Boolean).join(' · ')

  return { title, subtitle }
}

export function HoldingCard({ holding, typeName, color, amountsVisible = true, onPress }: Props) {
  const { title, subtitle } = deriveDisplay(holding)
  const { t } = useTranslation('portfolio')

  const displayValue = holding.marketValue ?? holding.totalCost
  const formattedValue = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  // For cash & gold, the currency is already in the title or subtitle
  const { assetType } = parseHoldingKey(holding.holdingKey)
  const showCurrencyUnderAmount = assetType !== 'cash' && assetType !== 'gold'

  return (
    <Pressable
      className="flex-row items-center bg-card rounded-xl px-3 py-2.5 active:opacity-70"
      onPress={onPress}
    >
      {/* Color accent bar */}
      <View
        className="w-1 h-8 rounded-full mr-3"
        style={{ backgroundColor: color }}
      />

      {/* Left: name + meta */}
      <View className="flex-1 mr-3">
        <Text className="text-base font-semibold text-text" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right: value + gain/loss */}
      <View className="items-end">
        <Redacted visible={amountsVisible}>
          <Text
            className="text-base font-semibold text-text"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formattedValue}
          </Text>
        </Redacted>
        {holding.gainLossPct != null && (
          <Redacted visible={amountsVisible}>
            <Text
              className="text-xs font-medium mt-0.5"
              style={{
                fontVariant: ['tabular-nums'],
                color: holding.gainLossPct >= 0 ? '#34c759' : '#ff3b30',
              }}
            >
              {holding.gainLossPct >= 0 ? '+' : ''}{holding.gainLossPct.toFixed(1)}%
            </Text>
          </Redacted>
        )}
        {showCurrencyUnderAmount && (
          <Text className="text-xs text-muted mt-0.5">
            {holding.currency}
            {holding.transactionCount > 1 ? ` · ${t('txns', { count: holding.transactionCount })}` : ''}
          </Text>
        )}
      </View>
    </Pressable>
  )
}
