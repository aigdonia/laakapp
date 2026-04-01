import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native'
import {
  IconCheck,
  IconDiamond,
  IconRefresh,
  IconX,
} from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import { useRouter } from 'expo-router'
import { CreditIcon } from '@/src/components/credit-icon'
import type { PurchasesPackage } from 'react-native-purchases'
import { useTranslation } from 'react-i18next'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

import { useThemeColors } from '@/src/theme/colors'
import { track } from '@/src/lib/analytics'
import { reportEvent } from '@/src/lib/activity'
import { useCredits } from '@/src/store/credits'
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getLakBalance,
  invalidateLakCache,
} from '@/src/lib/purchases'

const BEST_VALUE_ID = 'credits_value'

function isLifetimePackage(pkg: PurchasesPackage) {
  return pkg.product.identifier === 'unlock_all_lifetime'
}

export default function CreditsScreen() {
  const colors = useThemeColors()
  const router = useRouter()
  const balance = useCredits((s) => s.balance)
  const setBalance = useCredits((s) => s.setBalance)
  const { t } = useTranslation('credits')

  const [packages, setPackages] = useState<PurchasesPackage[]>([])
  const [loadingPkgId, setLoadingPkgId] = useState<string | null>(null)
  const [showCheck, setShowCheck] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const balanceScale = useSharedValue(1)
  const balanceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: balanceScale.value }],
  }))

  useEffect(() => {
    track('credits_screen_viewed', { balance })
    getOfferings()
      .then(setPackages)
      .catch(() => {})
  }, [])

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    const isLifetime = isLifetimePackage(pkg)
    track('purchase_initiated', {
      package_id: pkg.identifier,
      price: pkg.product.priceString,
      is_lifetime: isLifetime,
    })
    setLoadingPkgId(pkg.identifier)
    try {
      await purchasePackage(pkg)
      await invalidateLakCache()
      const newBalance = await getLakBalance()
      setBalance(newBalance)
      track('purchase_completed', { package_id: pkg.identifier, new_balance: newBalance })
      reportEvent('credit_purchased', { packageId: pkg.identifier })

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      balanceScale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 12 }),
      )
      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 1500)
    } catch (e: any) {
      track('purchase_failed', { package_id: pkg.identifier, user_cancelled: !!e.userCancelled })
      if (!e.userCancelled) {
        Alert.alert(t('purchase_failed'))
      }
    } finally {
      setLoadingPkgId(null)
    }
  }, [setBalance, balanceScale, t])

  const handleRestore = useCallback(async () => {
    setRestoring(true)
    try {
      await restorePurchases()
      await invalidateLakCache()
      const newBalance = await getLakBalance()
      setBalance(newBalance)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Alert.alert(newBalance > 0 ? t('restore_success') : t('restore_empty'))
    } catch {
      Alert.alert(t('purchase_failed'))
    } finally {
      setRestoring(false)
    }
  }, [setBalance, t])

  const creditPackages = packages.filter((p) => !isLifetimePackage(p))
  const lifetimePackage = packages.find(isLifetimePackage)

  return (
    <View className="flex-1 bg-screen">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Text className="text-lg font-semibold text-text">{t('title')}</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <IconX size={24} color={colors.muted} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-10">
        {/* Balance display */}
        <View className="items-center py-5 mb-4 bg-card rounded-2xl border border-border">
          <Text className="text-xs uppercase tracking-wider text-muted mb-1">
            {t('current_balance')}
          </Text>
          <View className="flex-row items-center gap-2">
            <CreditIcon size={28} color={colors.accent} />
            <Animated.Text
              className="text-4xl font-bold text-accent"
              style={balanceStyle}
            >
              {balance}
            </Animated.Text>
            {showCheck && <IconCheck size={24} color="#22c55e" />}
          </View>
        </View>

        {/* Credit pack cards */}
        <View className="gap-2 mb-3">
          {creditPackages.map((pkg) => {
            const isBestValue = pkg.product.identifier === BEST_VALUE_ID
            const isLoading = loadingPkgId === pkg.identifier

            return (
              <Pressable
                key={pkg.identifier}
                className={`flex-row items-center rounded-xl px-4 py-3.5 border active:opacity-70 ${
                  isBestValue
                    ? 'bg-accent/10 border-accent'
                    : 'bg-card border-border'
                }`}
                onPress={() => handlePurchase(pkg)}
                disabled={!!loadingPkgId}
              >
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-bold text-text">
                      {pkg.product.title}
                    </Text>
                    {isBestValue && (
                      <View className="bg-accent px-2 py-0.5 rounded-full">
                        <Text className="text-[10px] font-bold text-white">
                          {t('best_value')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Text className="text-base font-semibold text-accent">
                    {pkg.product.priceString}
                  </Text>
                )}
              </Pressable>
            )
          })}
        </View>

        {/* Lifetime unlock */}
        {lifetimePackage && (
          <Pressable
            className="flex-row items-center rounded-xl px-4 py-4 mb-4 bg-card border border-border active:opacity-70"
            onPress={() => handlePurchase(lifetimePackage)}
            disabled={!!loadingPkgId}
          >
            <IconDiamond size={22} color={colors.accent} />
            <View className="flex-1 ml-3">
              <Text className="text-base font-bold text-text">
                {lifetimePackage.product.title}
              </Text>
            </View>
            {loadingPkgId === lifetimePackage.identifier ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Text className="text-base font-semibold text-accent">
                {lifetimePackage.product.priceString}
              </Text>
            )}
          </Pressable>
        )}

        {/* Restore */}
        <Pressable
          className="flex-row items-center justify-center py-3 active:opacity-70"
          onPress={handleRestore}
          disabled={restoring}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={colors.muted} />
          ) : (
            <>
              <IconRefresh size={16} color={colors.muted} />
              <Text className="text-sm text-muted ml-1.5">
                {t('restore_purchases')}
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  )
}
