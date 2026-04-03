import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { IconPin, IconPinFilled, IconPlus, IconSparkles, IconTrash } from '@tabler/icons-react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import { createMMKV } from 'react-native-mmkv'

import { useHoldingDetail } from '@/src/hooks/use-holding-detail'
import { useDeleteTransaction } from '@/src/hooks/use-delete-transaction'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { useStocks } from '@/src/hooks/use-stocks'
import { useThemeColors } from '@/src/theme/colors'
import { parseHoldingKey } from '@/src/db/aggregation-queries'
import { track } from '@/src/lib/analytics'
import { StockDeepDiveBlock } from '@/src/components/insights/stock-deepdive-block'
import { CreditsAlertOverlay } from '@/src/components/credits-alert'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const pinStore = createMMKV({ id: 'holding-pin' })

// ─── Helpers ──────────────────────────────────────────────

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

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => (
        <Pressable
          className="bg-red-500 items-center justify-center px-5"
          onPress={() => {
            swipeableRef.current?.close()
            onDelete()
          }}
        >
          <IconTrash size={20} color="#fff" />
        </Pressable>
      )}
      overshootRight={false}
    >
      <View className={`bg-card px-5 py-3 ${!isLast ? 'border-b border-border' : ''}`}>
        <View className="flex-row justify-between">
          <Text className="text-xs text-muted">{formatDate(txn.date)}</Text>
          <Text className="text-sm font-semibold text-text" style={{ fontVariant: ['tabular-nums'] }}>
            {currency} {(txn.quantity * txn.pricePerUnit).toLocaleString()}
          </Text>
        </View>
        <Text className="text-sm text-text mt-1">
          <Text className="font-medium capitalize">{txn.type}</Text>
          {' · '}{txn.quantity} × {currency} {txn.pricePerUnit.toLocaleString()}
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

// ─── Main Screen ──────────────────────────────────────────

export default function HoldingDetailScreen() {
  const isDark = useColorScheme() === 'dark'
  const { id } = useLocalSearchParams<{ id: string }>()
  const holdingKey = decodeURIComponent(id!)
  const { data, isLoading } = useHoldingDetail(holdingKey)
  const deleteTransaction = useDeleteTransaction()
  const { data: assetClasses } = useAssetClasses()
  const { data: stocks } = useStocks()
  const colors = useThemeColors()
  const { t } = useTranslation('portfolio')

  // Price lookup for stocks/ETFs
  const isEquity = data?.assetType === 'stock' || data?.assetType === 'etf'
  const stockMatch = isEquity && data?.symbol && stocks
    ? stocks.find((s) => s.symbol === data.symbol)
    : null
  const lastPrice = stockMatch?.lastPrice ?? null
  const marketValue = lastPrice != null && data ? data.totalQuantity * lastPrice : null
  const gainLoss = marketValue != null && data ? marketValue - data.totalCost : null
  const gainLossPct = gainLoss != null && data && data.totalCost > 0
    ? (gainLoss / data.totalCost) * 100
    : null

  // Carousel pin
  const [pinnedPage, setPinnedPage] = useState(() => {
    const stored = pinStore.getNumber(`pin:${holdingKey}`)
    return stored ?? 0
  })
  const [carouselPage, setCarouselPage] = useState(pinnedPage)
  const carouselRef = useRef<ScrollView>(null)

  const onCarouselScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setCarouselPage(idx)
  }, [])

  const togglePin = useCallback(() => {
    const newPin = carouselPage === pinnedPage ? 0 : carouselPage
    setPinnedPage(newPin)
    pinStore.set(`pin:${holdingKey}`, newPin)
  }, [carouselPage, pinnedPage, holdingKey])

  // Scroll to pinned page on mount
  useEffect(() => {
    if (pinnedPage > 0) {
      setTimeout(() => {
        carouselRef.current?.scrollTo({ x: pinnedPage * SCREEN_WIDTH, animated: false })
      }, 50)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Tabs
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (data) {
      track('holding_detail_viewed', {
        asset_type: data.assetType,
        transaction_count: data.transactions.length,
      })
    }
  }, [holdingKey, data])

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-screen">
        <Text className="text-muted">{t('common:loading')}</Text>
      </View>
    )
  }

  const assetClass = assetClasses?.find((ac) => ac.slug === data.assetType)
  const acColor = assetClass?.color ?? '#636366'
  const { keyValues } = parseHoldingKey(holdingKey)

  const tabs = [
    { key: 'details', label: t('details_tab'), hasAi: false },
    ...(isEquity
      ? [{ key: 'analysis', label: t('insights:stock_analysis'), hasAi: true }]
      : []),
    { key: 'transactions', label: t('transactions_tab'), hasAi: false },
  ]

  const handleDeleteTransaction = (txnId: string) => {
    const isLastTxn = data.transactions.length === 1
    Alert.alert(
      t('delete_transaction_title'),
      isLastTxn ? t('delete_last_transaction') : t('delete_transaction_confirm'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('common:delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction.mutateAsync(txnId)
            track('transaction_deleted', { asset_type: data.assetType, is_last_transaction: isLastTxn })
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
        {/* ── Header ── */}
        <View className="items-center px-5 pt-4 pb-2">
          {isEquity ? (
            <>
              <View className="flex-row items-center gap-2 mb-1">
                {assetClass && (
                  <View className="px-2 py-0.5 rounded-md" style={{ backgroundColor: acColor + '20' }}>
                    <Text className="text-[10px] font-bold" style={{ color: acColor }}>
                      {assetClass.name}
                    </Text>
                  </View>
                )}
                <Text className="text-xs text-muted">{data.exchange}</Text>
              </View>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-lg font-bold text-text" numberOfLines={1}>
                  {data.name ?? data.symbol}
                </Text>
                {data.name && data.symbol && data.name !== data.symbol && (
                  <Text className="text-sm text-muted">{data.symbol}</Text>
                )}
              </View>
            </>
          ) : (
            <View className="flex-row items-center gap-2">
              {assetClass && (
                <View className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: acColor + '20' }}>
                  <Text className="text-xs font-bold" style={{ color: acColor }}>
                    {assetClass.name}
                  </Text>
                </View>
              )}
              <Text className="text-lg font-bold text-text" numberOfLines={1}>
                {data.assetType === 'cash'
                  ? (keyValues.currency ?? data.currency)
                  : data.assetType === 'gold'
                    ? (keyValues.purity ?? '24K')
                    : (data.symbol ?? data.name)}
              </Text>
            </View>
          )}
        </View>

        {/* ── Value Carousel ── */}
        <View className="pb-4">
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
          >
            {/* Page 1: Market Value (equity) or Cost Basis (other) */}
            <View style={{ width: SCREEN_WIDTH }} className="px-5">
              <View className="bg-card rounded-2xl p-5" style={{ minHeight: 140 }}>
                {isEquity && marketValue != null ? (
                  <>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-xs font-semibold uppercase tracking-wider text-muted">
                        {t('market_value')}
                      </Text>
                      {gainLossPct != null && (
                        <Text
                          className="text-sm font-bold"
                          style={{
                            fontVariant: ['tabular-nums'],
                            color: gainLossPct >= 0 ? '#34c759' : '#ff3b30',
                          }}
                        >
                          {gainLossPct >= 0 ? '+' : ''}{gainLossPct.toFixed(1)}%
                        </Text>
                      )}
                    </View>
                    <Text
                      className="text-3xl font-bold text-text"
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {data.currency}{' '}
                      {marketValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </Text>
                    <Text className="text-xs text-muted mt-1" style={{ fontVariant: ['tabular-nums'] }}>
                      {data.totalQuantity} {t('shares')} × {data.currency} {lastPrice!.toLocaleString()}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                      {t('cost_basis')}
                    </Text>
                    <Text
                      className="text-3xl font-bold text-text"
                      style={{ fontVariant: ['tabular-nums'] }}
                    >
                      {data.currency}{' '}
                      {data.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </Text>
                    <Text className="text-xs text-muted mt-1" style={{ fontVariant: ['tabular-nums'] }}>
                      {data.totalQuantity}
                      {data.assetType === 'gold' && data.unit ? ` ${data.unit}` : ''}
                      {' × '}{data.currency} {data.avgCostPerUnit.toLocaleString()}
                    </Text>
                  </>
                )}
                {/* Pin on page */}
                <Pressable onPress={togglePin} className="absolute bottom-4 right-4 active:opacity-70">
                  {carouselPage === 0 && pinnedPage === 0 ? (
                    <IconPinFilled size={14} color={colors.accent} />
                  ) : (
                    <IconPin size={14} color={colors.muted} />
                  )}
                </Pressable>
              </View>
            </View>

            {/* Page 2: Cost Basis */}
            <View style={{ width: SCREEN_WIDTH }} className="px-5">
              <View className="bg-card rounded-2xl p-5" style={{ minHeight: 140 }}>
                <Text className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  {t('cost_basis')}
                </Text>
                <Text
                  className="text-3xl font-bold text-text"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {data.currency}{' '}
                  {data.totalCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </Text>
                <Text className="text-xs text-muted mt-1" style={{ fontVariant: ['tabular-nums'] }}>
                  {data.totalQuantity}
                  {data.assetType === 'gold' && data.unit ? ` ${data.unit}` : ''}
                  {isEquity ? ` ${t('shares')}` : ''}
                  {' × '}{data.currency} {data.avgCostPerUnit.toLocaleString()}
                </Text>
                {/* Pin on page */}
                <Pressable onPress={togglePin} className="absolute bottom-4 right-4 active:opacity-70">
                  {carouselPage === 1 && pinnedPage === 1 ? (
                    <IconPinFilled size={14} color={colors.accent} />
                  ) : (
                    <IconPin size={14} color={colors.muted} />
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Dots */}
          <View className="flex-row items-center justify-center gap-2 mt-3">
            {[0, 1].map((i) => (
              <View
                key={i}
                className="rounded-full"
                style={{
                  width: carouselPage === i ? 16 : 6,
                  height: 6,
                  backgroundColor: carouselPage === i ? colors.text : colors.subtle,
                }}
              />
            ))}
          </View>
        </View>

        {/* ── Tab Bar ── */}
        <View className="flex-row border-b border-border mx-4 mt-2">
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              className="flex-1 items-center py-3"
              onPress={() => setActiveTab(tab.key)}
            >
              <View className="flex-row items-center gap-1">
                {tab.hasAi && (
                  <IconSparkles
                    size={13}
                    color={activeTab === tab.key ? colors.accent : colors.muted}
                  />
                )}
                <Text
                  className={`text-sm font-medium ${activeTab === tab.key ? 'text-text' : 'text-muted'}`}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </View>
              {activeTab === tab.key && (
                <View
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ backgroundColor: colors.accent }}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-32 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'details' && (
            <View>
              {/* Equity: name + ticker header */}
              {isEquity && (
                <View className="mb-4">
                  <Text className="text-base font-semibold text-text">
                    {data.name ?? data.symbol}
                  </Text>
                  {data.symbol && data.name !== data.symbol && (
                    <Text className="text-sm text-muted">{data.symbol} · {data.exchange}</Text>
                  )}
                </View>
              )}

              {/* About */}
              {stockMatch?.about ? (
                <View className="mb-4">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                    {t('about')}
                  </Text>
                  <Text className="text-sm text-muted leading-5">
                    {stockMatch.about}
                  </Text>
                </View>
              ) : null}

              {/* Non-equity details */}
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
          )}

          {activeTab === 'analysis' && isEquity && (
            <StockDeepDiveBlock
              holdingKey={holdingKey}
              symbol={data.symbol}
              assetType={data.assetType}
              userContext={{
                quantity: data.totalQuantity,
                totalCost: data.totalCost,
                avgCost: data.avgCostPerUnit,
                gainLoss,
                gainLossPct,
                currency: data.currency,
              }}
            />
          )}

          {activeTab === 'transactions' && (
            <View>
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
          )}
        </ScrollView>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <CreditsAlertOverlay />
    </>
  )
}
