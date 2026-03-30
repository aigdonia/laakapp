import { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import Constants from 'expo-constants'
import {
  IconBrandApple,
  IconLogin,
  IconLogout,
  IconCurrencyDollar,
  IconShieldCheck,
  IconPalette,
  IconLanguage,
  IconDownload,
  IconLock,
  IconInfoCircle,
  IconAlertTriangle,
  IconWorld,
  IconFileText,
  IconFingerprint,
  IconShieldLock,
  IconClock,
  IconKey,
  IconRefresh,
  IconChartPie,
  IconArrowsLeftRight,
  IconCloudUpload,
  IconCloudDownload,
} from '@tabler/icons-react-native'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'

import { CreditIcon } from '@/src/components/credit-icon'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  SettingsSection,
  SettingsMenuCard,
  SettingsToggleCard,
} from '@/src/components/settings-menu'
import { ThemePickerSheet } from '@/src/components/theme-picker-sheet'
import { LanguagePickerSheet } from '@/src/components/language-picker-sheet'
import { CountryPickerSheet } from '@/src/components/country-picker-sheet'
import { PresetPickerSheet } from '@/src/components/preset-picker-sheet'
import { CurrencyPickerSheet } from '@/src/components/currency-picker-sheet'
import { ScreeningRulePickerSheet } from '@/src/components/screening-rule-picker-sheet'
import { PinSetupSheet } from '@/src/components/app-lock/pin-setup-sheet'
import { ChangePinSheet } from '@/src/components/app-lock/change-pin-sheet'
import { LockMethodSheet } from '@/src/components/app-lock/lock-method-sheet'
import { LockTimeoutSheet } from '@/src/components/app-lock/lock-timeout-sheet'
import { SwipeAnimatedScreen } from '@/src/components/swipe-animated-screen'
import { resetUserDb, clearAppCache } from '@/src/db'
import { useThemeColors } from '@/src/theme/colors'
import { usePreferences } from '@/src/store/preferences'
import { useCredits } from '@/src/store/credits'
import { restorePurchases, getLakBalance, invalidateLakCache } from '@/src/lib/purchases'
import { verifyPin, clearPin } from '@/src/lib/pin'
import { useDisplayLanguages } from '@/src/hooks/use-languages'
import { useCountries } from '@/src/hooks/use-countries'
import { usePortfolioPresets } from '@/src/hooks/use-portfolio-presets'
import { useScreeningRules } from '@/src/hooks/use-screening-rules'
import { useAssetClasses } from '@/src/hooks/use-asset-classes'
import { useExchangeRates } from '@/src/hooks/use-exchange-rates'
import { exportPortfolioCsv } from '@/src/lib/export-portfolio'
import { track } from '@/src/lib/analytics'
import { reportEvent } from '@/src/lib/activity'
import { useAuth } from '@/src/hooks/use-auth'
import { useBackupMeta, useBackup, useRestore } from '@/src/hooks/use-backup'
import { signInWithApple, signOut } from '@/src/lib/apple-auth'

export default function SettingsScreen() {
  const colors = useThemeColors()
  const queryClient = useQueryClient()
  const themePreference = usePreferences((s) => s.theme)
  const language = usePreferences((s) => s.language)
  const countryCode = usePreferences((s) => s.countryCode)
  const appLockEnabled = usePreferences((s) => s.appLockEnabled)
  const lockMethod = usePreferences((s) => s.lockMethod)
  const lockTimeout = usePreferences((s) => s.lockTimeout)
  const setAppLockEnabled = usePreferences((s) => s.setAppLockEnabled)
  const swipeNavigation = usePreferences((s) => s.swipeNavigation)
  const toggleSwipeNavigation = usePreferences((s) => s.toggleSwipeNavigation)
  const creditBalance = useCredits((s) => s.balance)
  const setBalance = useCredits((s) => s.setBalance)
  const { t } = useTranslation('settings')
  const router = useRouter()

  const baseCurrency = usePreferences((s) => s.baseCurrency)
  const shariaAuthority = usePreferences((s) => s.shariaAuthority)
  const presetSlug = usePreferences((s) => s.portfolioPresetSlug)
  const { data: presets } = usePortfolioPresets()
  const selectedPreset = presets?.find((p) => p.slug === presetSlug)
  const { data: screeningRules } = useScreeningRules()
  const selectedRule = screeningRules?.find((r) => r.slug === shariaAuthority)
  const { data: assetClasses } = useAssetClasses()
  const { data: exchangeRates } = useExchangeRates()

  const themeSheetRef = useRef<BottomSheetModal>(null)
  const languageSheetRef = useRef<BottomSheetModal>(null)
  const countrySheetRef = useRef<BottomSheetModal>(null)
  const presetSheetRef = useRef<BottomSheetModal>(null)
  const currencySheetRef = useRef<BottomSheetModal>(null)
  const screeningRuleSheetRef = useRef<BottomSheetModal>(null)
  const pinSetupSheetRef = useRef<BottomSheetModal>(null)
  const changePinSheetRef = useRef<BottomSheetModal>(null)
  const lockMethodSheetRef = useRef<BottomSheetModal>(null)
  const lockTimeoutSheetRef = useRef<BottomSheetModal>(null)

  const { data: displayLanguages = [] } = useDisplayLanguages()
  const currentLanguage = displayLanguages.find((l) => l.code === language)
  const { data: enabledCountries = [] } = useCountries()
  const currentCountry = enabledCountries.find((c) => c.code === countryCode)

  const themeLabel = themePreference === 'light' ? t('light')
    : themePreference === 'dark' ? t('dark')
    : t('system')

  const timeoutLabel = lockTimeout === 0 ? t('lock_immediately')
    : lockTimeout === 30 ? t('lock_after_30s')
    : lockTimeout === 60 ? t('lock_after_1m')
    : t('lock_after_5m')

  const handleAppLockToggle = useCallback(() => {
    if (!appLockEnabled) {
      pinSetupSheetRef.current?.present()
    } else {
      Alert.prompt(
        t('lock_disable_title'),
        t('lock_disable_message'),
        async (input) => {
          const valid = await verifyPin(input)
          if (valid) {
            setAppLockEnabled(false)
            await clearPin()
            track('app_lock_disabled')
          } else {
            Alert.alert(t('lock_wrong_pin'))
          }
        },
        'secure-text',
        '',
        'number-pad',
      )
    }
  }, [appLockEnabled, setAppLockEnabled, t])

  const handleResetData = () => {
    Alert.alert(
      t('reset_dialog_title'),
      t('reset_dialog_message'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('reset_dialog_confirm'),
          style: 'destructive',
          onPress: () => {
            resetUserDb()
            queryClient.invalidateQueries({ queryKey: ['holdings'] })
            track('data_reset_confirmed')
            Alert.alert(t('reset_done_title'), t('reset_done_message'))
          },
        },
      ],
    )
  }

  const handleRestore = useCallback(async () => {
    try {
      const prevBalance = creditBalance
      await restorePurchases()
      await invalidateLakCache()
      const newBalance = await getLakBalance()
      setBalance(newBalance)
      track('restore_purchases', { had_balance: prevBalance > 0, new_balance: newBalance })
      Alert.alert(newBalance > 0 ? t('restore_success') : t('restore_empty'))
    } catch {
      Alert.alert(t('restore_failed'))
    }
  }, [setBalance, creditBalance, t])

  const handleRefreshAppData = useCallback(() => {
    Alert.alert(
      t('refresh_app_data'),
      t('refresh_app_data_message'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('refresh_app_data_confirm'),
          onPress: () => {
            clearAppCache()
            queryClient.invalidateQueries()
            Alert.alert(t('refresh_app_data_done'))
          },
        },
      ],
    )
  }, [queryClient, t])

  const handleExportPortfolio = useCallback(async () => {
    if (!assetClasses?.length) {
      Alert.alert(t('common:error'))
      return
    }
    track('export_started', { base_currency: baseCurrency })
    try {
      await exportPortfolioCsv(assetClasses, exchangeRates ?? [], baseCurrency)
      track('export_completed', { base_currency: baseCurrency })
      reportEvent('export_completed', { baseCurrency })
    } catch {
      track('export_failed', { base_currency: baseCurrency })
      Alert.alert(t('export_failed'))
    }
  }, [assetClasses, exchangeRates, baseCurrency, t])

  const { isAnonymous, email } = useAuth()
  const { data: backupMeta } = useBackupMeta()
  const backupMutation = useBackup()
  const restoreMutation = useRestore()
  const [authLoading, setAuthLoading] = useState(false)

  const handleAppleSignIn = useCallback(async () => {
    setAuthLoading(true)
    try {
      await signInWithApple()
    } catch (e: any) {
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert(t('sign_in_failed'))
      }
    } finally {
      setAuthLoading(false)
    }
  }, [t])

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('sign_out_title'),
      t('sign_out_message'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('sign_out'),
          style: 'destructive',
          onPress: async () => {
            setAuthLoading(true)
            try {
              await signOut()
            } finally {
              setAuthLoading(false)
            }
          },
        },
      ],
    )
  }, [t])

  const handleBackup = useCallback(async () => {
    try {
      const result = await backupMutation.mutateAsync()
      track('backup_created', { transaction_count: result.transactionCount })
      reportEvent('backup_created', { transactionCount: result.transactionCount })
      Alert.alert(t('backup_success', { count: result.transactionCount }))
    } catch {
      Alert.alert(t('backup_failed'))
    }
  }, [backupMutation, t])

  const handleRestoreBackup = useCallback(() => {
    if (!backupMeta?.snapshot) return

    Alert.alert(
      t('restore_confirm_title'),
      t('restore_confirm_message', { count: backupMeta.snapshot.transactionCount }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('restore_confirm_button'),
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await restoreMutation.mutateAsync()
              track('backup_restored', { transaction_count: result.transactionCount })
              reportEvent('backup_restored', { transactionCount: result.transactionCount })
              Alert.alert(t('restore_success_backup', { count: result.transactionCount }))
            } catch (e: any) {
              if (e?.message === 'schema_version_newer') {
                Alert.alert(t('restore_version_mismatch'))
              } else {
                Alert.alert(t('restore_failed_backup'))
              }
            }
          },
        },
      ],
    )
  }, [backupMeta, restoreMutation, t])

  const comingSoon = () => Alert.alert(t('common:coming_soon'))

  return (
    <SwipeAnimatedScreen>
      <ScrollView
        className="flex-1 bg-screen"
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title={t('credits_section')}>
          <SettingsMenuCard
            icon={<CreditIcon size={22} color={colors.accent} />}
            label={t('credits')}
            subtitle={t('credits_balance', { count: creditBalance })}
            onPress={() => router.push('/credits')}
          />
          <SettingsMenuCard
            icon={<IconRefresh size={22} color={colors.muted} />}
            label={t('restore_purchases')}
            onPress={handleRestore}
          />
        </SettingsSection>

        <SettingsSection title={t('account')}>
          {isAnonymous ? (
            Platform.OS === 'ios' && (
              <SettingsMenuCard
                icon={authLoading
                  ? <ActivityIndicator size="small" />
                  : <IconBrandApple size={22} color={colors.muted} />}
                label={t('sign_in_apple')}
                subtitle={t('sign_in_subtitle')}
                onPress={authLoading ? undefined : handleAppleSignIn}
              />
            )
          ) : (
            <>
              <SettingsMenuCard
                icon={<IconLogin size={22} color={colors.muted} />}
                label={t('signed_in_as')}
                subtitle={email ?? ''}
                showChevron={false}
              />
              <SettingsMenuCard
                icon={backupMutation.isPending
                  ? <ActivityIndicator size="small" />
                  : <IconCloudUpload size={22} color={colors.muted} />}
                label={t('backup_to_cloud')}
                subtitle={backupMeta?.exists
                  ? t('last_backup', { date: new Date(backupMeta.snapshot!.createdAt).toLocaleDateString() })
                  : t('no_backup_yet')}
                onPress={backupMutation.isPending ? undefined : handleBackup}
              />
              {backupMeta?.exists && (
                <SettingsMenuCard
                  icon={restoreMutation.isPending
                    ? <ActivityIndicator size="small" />
                    : <IconCloudDownload size={22} color={colors.muted} />}
                  label={t('restore_from_cloud')}
                  subtitle={t('restore_subtitle', { count: backupMeta.snapshot!.transactionCount })}
                  onPress={restoreMutation.isPending ? undefined : handleRestoreBackup}
                />
              )}
              <SettingsMenuCard
                icon={authLoading
                  ? <ActivityIndicator size="small" />
                  : <IconLogout size={22} color="#ef4444" />}
                label={t('sign_out')}
                onPress={authLoading ? undefined : handleSignOut}
                destructive
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection title={t('screening')}>
          <SettingsMenuCard
            icon={<IconShieldCheck size={22} color={colors.muted} />}
            label={t('sharia_authority')}
            subtitle={selectedRule?.name ?? shariaAuthority}
            onPress={() => screeningRuleSheetRef.current?.present()}
          />
        </SettingsSection>

        <SettingsSection title={t('market')}>
          <SettingsMenuCard
            icon={<IconWorld size={22} color={colors.muted} />}
            label={t('country')}
            subtitle={currentCountry ? `${currentCountry.flagEmoji} ${currentCountry.name}` : countryCode}
            onPress={() => countrySheetRef.current?.present()}
          />
          <SettingsMenuCard
            icon={<IconCurrencyDollar size={22} color={colors.muted} />}
            label={t('base_currency')}
            subtitle={baseCurrency}
            onPress={() => currencySheetRef.current?.present()}
          />
          <SettingsMenuCard
            icon={<IconChartPie size={22} color={colors.muted} />}
            label={t('portfolio_preset')}
            subtitle={selectedPreset?.name ?? t('equal_weight')}
            onPress={() => presetSheetRef.current?.present()}
          />
        </SettingsSection>

        <SettingsSection title={t('appearance')}>
          <SettingsMenuCard
            icon={<IconPalette size={22} color={colors.muted} />}
            label={t('theme')}
            subtitle={themeLabel}
            onPress={() => themeSheetRef.current?.present()}
          />
          <SettingsMenuCard
            icon={<IconLanguage size={22} color={colors.muted} />}
            label={t('language')}
            subtitle={currentLanguage?.nativeName ?? language}
            onPress={() => languageSheetRef.current?.present()}
          />
          <SettingsToggleCard
            icon={<IconArrowsLeftRight size={22} color={colors.muted} />}
            label={t('swipe_tabs')}
            value={swipeNavigation}
            onToggle={() => {
              track('setting_changed', { setting: 'swipe_navigation', value: !swipeNavigation })
              toggleSwipeNavigation()
            }}
          />
        </SettingsSection>

        <SettingsSection title={t('security')}>
          <SettingsMenuCard
            icon={<IconShieldLock size={22} color={colors.muted} />}
            label={t('lock_app_lock')}
            subtitle={appLockEnabled ? t('common:done') : undefined}
            onPress={handleAppLockToggle}
          />
          {appLockEnabled && (
            <>
              <SettingsMenuCard
                icon={<IconFingerprint size={22} color={colors.muted} />}
                label={t('lock_method')}
                subtitle={lockMethod === 'biometric' ? 'Biometric' : 'PIN'}
                onPress={() => lockMethodSheetRef.current?.present()}
              />
              <SettingsMenuCard
                icon={<IconClock size={22} color={colors.muted} />}
                label={t('lock_auto_lock')}
                subtitle={timeoutLabel}
                onPress={() => lockTimeoutSheetRef.current?.present()}
              />
              <SettingsMenuCard
                icon={<IconKey size={22} color={colors.muted} />}
                label={t('lock_change_pin')}
                onPress={() => changePinSheetRef.current?.present()}
              />
            </>
          )}
        </SettingsSection>

        <SettingsSection title={t('data_privacy')}>
          <SettingsMenuCard
            icon={<IconDownload size={22} color={colors.muted} />}
            label={t('export_portfolio')}
            subtitle="CSV"
            onPress={handleExportPortfolio}
          />
          <SettingsMenuCard
            icon={<IconRefresh size={22} color={colors.muted} />}
            label={t('refresh_app_data')}
            onPress={handleRefreshAppData}
          />
          <SettingsMenuCard
            icon={<IconLock size={22} color={colors.muted} />}
            label={t('privacy_policy')}
            onPress={() => router.push('/privacy')}
          />
          <SettingsMenuCard
            icon={<IconFileText size={22} color={colors.muted} />}
            label={t('terms_of_service')}
            onPress={() => router.push('/terms')}
          />
          <SettingsMenuCard
            icon={<IconAlertTriangle size={22} color="#ef4444" />}
            label={t('reset_all_data')}
            destructive
            onPress={handleResetData}
          />
        </SettingsSection>

        <SettingsSection title={t('about_support')}>
          <SettingsMenuCard
            icon={<IconInfoCircle size={22} color={colors.muted} />}
            label={t('version')}
            subtitle={Constants.expoConfig?.version ?? '0.0.0'}
            showChevron={false}
          />
        </SettingsSection>
      </ScrollView>

      <ScreeningRulePickerSheet ref={screeningRuleSheetRef} />
      <ThemePickerSheet ref={themeSheetRef} />
      <LanguagePickerSheet ref={languageSheetRef} />
      <CountryPickerSheet ref={countrySheetRef} />
      <PresetPickerSheet ref={presetSheetRef} />
      <CurrencyPickerSheet ref={currencySheetRef} />
      <PinSetupSheet ref={pinSetupSheetRef} />
      <ChangePinSheet ref={changePinSheetRef} />
      <LockMethodSheet ref={lockMethodSheetRef} />
      <LockTimeoutSheet ref={lockTimeoutSheetRef} />
    </SwipeAnimatedScreen>
  )
}
