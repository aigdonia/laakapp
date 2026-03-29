import { useRef, useEffect } from 'react'
import { Alert, Pressable, ScrollView, Text, View, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { IconPlus, IconTrash } from '@tabler/icons-react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'

import { useHoldingDetail } from '@/src/hooks/use-holding-detail'
import { useDeleteTransaction } from '@/src/hooks/use-delete-transaction'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { useThemeColors } from '@/src/theme/colors'
import { parseHoldingKey } from '@/src/db/aggregation-queries'
import { track } from '@/src/lib/analytics'

function formatDate(date: Date | number | string | null | undefined): string {
  if (date == null) return '—'
  return new Date(typeof date === 'number' ? date : date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === '') return null
  return (
    <View className="flex-row justify-between py-2.5 border-b border-border">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="text-sm font-medium text-text">{value}</Text>
    </View>
  )
}

function SwipeableTransaction({
  txn,
  currency,
  isLast,
  onDelete,
}: {
  txn: { id: string; type: string; quantity: number; pricePerUnit: number; fees: number | null; date: Date | number | null; notes: string | null }
  currency: string
  isLast: boolean
  onDelete: () => void
}) {
  const swipeableRef = useRef<Swipeable>(null)
  const { t } = useTranslation('common')

  const renderRightActions = () => (
    <Pressable
      className="bg-red-500 items-center justify-center px-5"
      onPress={() => {
        swipeableRef.current?.close()
        onDelete()
      }}
    >
      <IconTrash size={20} color="#fff" />
    </Pressable>
  )

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
      <View className={`bg-card px-5 py-3 ${!isLast ? 'border-b border-border' : ''}`}>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">
            {formatDate(txn.date)}
          </Text>
          <Text
            className="text-sm font-semibold text-text"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {currency}{' '}
            {(txn.quantity * txn.pricePerUnit).toLocaleString()}
          </Text>
        </View>
        <Text className="text-sm text-text mt-1">
          <Text className="font-medium capitalize">{txn.type}</Text>
          {' · '}
          {txn.quantity} × {currency} {txn.pricePerUnit.toLocaleString()}
        </Text>
        {txn.fees != null && txn.fees > 0 && (
          <Text className="text-xs text-muted mt-0.5">
            {t('fee')}: {currency} {txn.fees.toLocaleString()}
          </Text>
        )}
      </View>
    </Swipeable>
  )
}

export default function HoldingDetailScreen() {
  const isDark = useColorScheme() === 'dark'
  const { id } = useLocalSearchParams<{ id: string }>()
  const holdingKey = decodeURIComponent(id!)
  const { data, isLoading } = useHoldingDetail(holdingKey)
  const deleteTransaction = useDeleteTransaction()
  const { data: assetClasses } = useAssetClasses()
  const colors = useThemeColors()
  const { t } = useTranslation('portfolio')

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-screen">
        <Text className="text-muted">{t('common:loading')}</Text>
      </View>
    )
  }

  useEffect(() => {
    if (data) {
      track('holding_detail_viewed', {
        asset_type: data.assetType,
        transaction_count: data.transactions.length,
      })
    }
  }, [holdingKey])

  const assetClass = assetClasses?.find((ac) => ac.slug === data.assetType)
  const acColor = assetClass?.color ?? '#636366'
  const { keyValues } = parseHoldingKey(holdingKey)

  const headerTitle =
    data.assetType === 'cash' ? (keyValues.currency ?? data.currency) :
    data.assetType === 'gold' ? (keyValues.purity ?? '24K') :
    (data.symbol ?? data.name)

  const handleDeleteTransaction = (txnId: string) => {
    const isLastTxn = data.transactions.length === 1
    Alert.alert(
      t('delete_transaction_title'),
      isLastTxn
        ? t('delete_last_transaction')
        : t('delete_transaction_confirm'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('common:delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction.mutateAsync(txnId)
            track('transaction_deleted', {
              asset_type: data.assetType,
              is_last_transaction: isLastTxn,
            })
            if (isLastTxn) router.back()
          },
        },
      ],
    )
  }

  const handleAddTransaction = () => {
    router.push({
      pathname: '/add-holding',
      params: {
        holdingKey,
        assetType: data.assetType,
        prefill: JSON.stringify({
          symbol: data.symbol ?? '',
          name: data.name ?? '',
          exchange: data.exchange ?? '',
          currency: data.currency,
          unit: data.unit ?? '',
          purity: data.purity ?? '',
          profitRate: data.profitRate?.toString() ?? '',
          maturityDate: data.maturityDate ?? '',
        }),
      },
    })
  }

  return (
    <>
    <View className="flex-1 bg-screen">
      {/* Header */}
      <View className="flex-row items-center justify-center gap-2 px-5 pt-4 pb-3">
        {assetClass && (
          <View
            className="px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: acColor + '20' }}
          >
            <Text className="text-xs font-bold" style={{ color: acColor }}>
              {assetClass.name}
            </Text>
          </View>
        )}
        <Text className="text-lg font-bold text-text" numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Value Hero Card */}
        <View className="bg-card rounded-2xl p-5 mb-4">
          <Text className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            {t('cost_basis')}
          </Text>
          <Text
            className="text-3xl font-bold text-text"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {data.currency}{' '}
            {data.totalCost.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Text>
          <View className="flex-row gap-6 mt-3">
            <View>
              <Text className="text-xs text-muted">{t('quantity')}</Text>
              <Text className="text-sm font-medium text-text mt-0.5">
                {data.totalQuantity}
                {data.assetType === 'gold' && data.unit ? ` ${data.unit}` : ''}
                {data.assetType === 'stock' || data.assetType === 'etf' ? ` ${t('shares')}` : ''}
              </Text>
            </View>
            {data.assetType !== 'cash' && data.assetType !== 'real_estate' && (
              <View>
                <Text className="text-xs text-muted">{t('avg_cost')}</Text>
                <Text
                  className="text-sm font-medium text-text mt-0.5"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {data.currency} {data.avgCostPerUnit.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Details Section */}
        <View className="bg-card rounded-2xl px-5 py-2 mb-4">
          <DetailRow label={t('currency')} value={data.currency} />
          {(data.assetType === 'stock' || data.assetType === 'etf') && (
            <>
              <DetailRow label={t('symbol')} value={data.symbol} />
              <DetailRow label={t('exchange')} value={data.exchange} />
            </>
          )}
          {data.assetType === 'gold' && (
            <>
              <DetailRow label={t('unit')} value={data.unit} />
              <DetailRow label={t('purity')} value={data.purity} />
            </>
          )}
          {data.assetType === 'sukuk' && (
            <>
              <DetailRow label={t('profit_rate')} value={data.profitRate ? `${data.profitRate}%` : null} />
              <DetailRow label={t('maturity_date')} value={data.maturityDate} />
            </>
          )}
          {data.assetType === 'real_estate' && (
            <DetailRow
              label={t('estimated_value')}
              value={data.estimatedValue ? `${data.currency} ${data.estimatedValue.toLocaleString()}` : null}
            />
          )}
        </View>

        {/* Transactions Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-1 mb-2">
            <Text className="text-sm font-semibold text-text">
              {t('transactions_count', { count: data.transactions.length })}
            </Text>
            <Pressable
              className="flex-row items-center gap-1 active:opacity-70"
              onPress={handleAddTransaction}
            >
              <IconPlus size={16} color={colors.accent} />
              <Text className="text-sm font-medium" style={{ color: colors.accent }}>
                {t('common:add')}
              </Text>
            </Pressable>
          </View>

          {data.transactions.length === 0 ? (
            <View className="bg-card rounded-2xl p-5 items-center">
              <Text className="text-sm text-muted">{t('no_transactions')}</Text>
            </View>
          ) : (
            <View className="bg-card rounded-2xl overflow-hidden">
              {data.transactions.map((txn, i) => (
                <SwipeableTransaction
                  key={txn.id}
                  txn={txn}
                  currency={data.currency}
                  isLast={i === data.transactions.length - 1}
                  onDelete={() => handleDeleteTransaction(txn.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
    <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  )
}
