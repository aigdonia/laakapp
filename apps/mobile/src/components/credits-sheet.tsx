import { createRef, forwardRef, useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import {
  IconCheck,
  IconDiamond,
  IconRefresh,
} from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { CreditIcon } from '@/src/components/credit-icon'
import type { PurchasesPackage } from 'react-native-purchases'
import { useTranslation } from 'react-i18next'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { useThemeColors } from '@/src/theme/colors'
import { useCredits } from '@/src/store/credits'
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  getLakBalance,
  invalidateLakCache,
} from '@/src/lib/purchases'
import { useEffect } from 'react'

/** Module-level ref — import and call .present() from anywhere */
export const creditsSheetRef = createRef<BottomSheetModal>()

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

/** Credit amounts per store identifier for display when price isn't loaded */
const CREDIT_AMOUNTS: Record<string, number> = {
  credits_micro: 10,
  credits_starter: 50,
  credits_value: 150,
  credits_power: 400,
}

const BEST_VALUE_ID = 'credits_value'

function isLifetimePackage(pkg: PurchasesPackage) {
  return pkg.product.identifier === 'unlock_all_lifetime'
}

export const CreditsSheet = forwardRef<BottomSheetModal>(function CreditsSheet(_, ref) {
  const colors = useThemeColors()
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

  const loadPackages = useCallback(async () => {
    try {
      const pkgs = await getOfferings()
      setPackages(pkgs)
    } catch {
      // offerings will be empty — cards won't render
    }
  }, [])

  useEffect(() => {
    // Re-fetch offerings every time sheet renders
    loadPackages()
  }, [loadPackages])

  const handlePurchase = useCallback(async (pkg: PurchasesPackage) => {
    setLoadingPkgId(pkg.identifier)
    try {
      await purchasePackage(pkg)
      await invalidateLakCache()
      const newBalance = await getLakBalance()
      setBalance(newBalance)

      // Celebration
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      balanceScale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withSpring(1, { damping: 12 }),
      )
      setShowCheck(true)
      setTimeout(() => setShowCheck(false), 1500)
    } catch (e: any) {
      // RevenueCat errors have userCancelled; test store may throw plain errors
      if (e?.userCancelled !== true) {
        Alert.alert(t('purchase_failed'), e?.message ?? '')
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
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
      handleIndicatorStyle={{ backgroundColor: colors.muted }}
    >
      <BottomSheetScrollView className="px-5 pb-10 pt-2">
        {/* Title */}
        <Text className="text-lg font-semibold text-text mb-4">{t('title')}</Text>

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
            const storeId = pkg.product.identifier
            const credits = CREDIT_AMOUNTS[storeId] ?? 0
            const isBestValue = storeId === BEST_VALUE_ID
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
                      {credits} {t('credits_label')}
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
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
})
