import { useRef } from 'react'
import { Alert, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import {
  IconUser,
  IconLogin,
  IconBuildingBank,
  IconCurrencyDollar,
  IconShieldCheck,
  IconBell,
  IconPalette,
  IconLanguage,
  IconDownload,
  IconTrash,
  IconLock,
  IconHelp,
  IconStar,
  IconInfoCircle,
  IconAlertTriangle,
  IconWorld,
  IconFileText,
} from '@tabler/icons-react-native'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  SettingsSection,
  SettingsMenuCard,
} from '@/src/components/settings-menu'
import { ThemePickerSheet } from '@/src/components/theme-picker-sheet'
import { LanguagePickerSheet } from '@/src/components/language-picker-sheet'
import { CountryPickerSheet } from '@/src/components/country-picker-sheet'
import { resetUserDb } from '@/src/db'
import { useThemeColors } from '@/src/theme/colors'
import { usePreferences } from '@/src/store/preferences'
import { SUPPORTED_LANGUAGES, SUPPORTED_COUNTRIES } from '@/src/i18n/locale'

export default function SettingsScreen() {
  const colors = useThemeColors()
  const queryClient = useQueryClient()
  const themePreference = usePreferences((s) => s.theme)
  const language = usePreferences((s) => s.language)
  const countryCode = usePreferences((s) => s.countryCode)
  const { t } = useTranslation('settings')
  const router = useRouter()

  const themeSheetRef = useRef<BottomSheetModal>(null)
  const languageSheetRef = useRef<BottomSheetModal>(null)
  const countrySheetRef = useRef<BottomSheetModal>(null)

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language)
  const currentCountry = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode)

  const themeLabel = themePreference === 'light' ? t('light')
    : themePreference === 'dark' ? t('dark')
    : t('system')

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
            Alert.alert(t('reset_done_title'), t('reset_done_message'))
          },
        },
      ],
    )
  }

  const comingSoon = () => Alert.alert(t('common:coming_soon'))

  return (
    <>
      <ScrollView
        className="flex-1 bg-screen"
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title={t('account')}>
          <SettingsMenuCard
            icon={<IconUser size={22} color={colors.muted} />}
            label={t('profile')}
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconLogin size={22} color={colors.muted} />}
            label={t('sign_in')}
            onPress={comingSoon}
          />
        </SettingsSection>

        <SettingsSection title={t('market')}>
          <SettingsMenuCard
            icon={<IconBuildingBank size={22} color={colors.muted} />}
            label={t('default_market')}
            subtitle="Egypt / EGX"
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconCurrencyDollar size={22} color={colors.muted} />}
            label={t('base_currency')}
            subtitle="EGP"
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconWorld size={22} color={colors.muted} />}
            label={t('country')}
            subtitle={currentCountry ? `${currentCountry.flag} ${currentCountry.name}` : countryCode}
            onPress={() => countrySheetRef.current?.present()}
          />
        </SettingsSection>

        <SettingsSection title={t('screening')}>
          <SettingsMenuCard
            icon={<IconShieldCheck size={22} color={colors.muted} />}
            label={t('sharia_authority')}
            subtitle="AAOIFI"
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconBell size={22} color={colors.muted} />}
            label={t('compliance_alerts')}
            onPress={comingSoon}
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
        </SettingsSection>

        <SettingsSection title={t('data_privacy')}>
          <SettingsMenuCard
            icon={<IconDownload size={22} color={colors.muted} />}
            label={t('export_portfolio')}
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconTrash size={22} color={colors.muted} />}
            label={t('clear_cache')}
            onPress={comingSoon}
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
            icon={<IconHelp size={22} color={colors.muted} />}
            label={t('help_center')}
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconStar size={22} color={colors.muted} />}
            label={t('rate_app')}
            onPress={comingSoon}
          />
          <SettingsMenuCard
            icon={<IconInfoCircle size={22} color={colors.muted} />}
            label={t('version')}
            subtitle="1.0.0"
            showChevron={false}
          />
        </SettingsSection>
      </ScrollView>

      <ThemePickerSheet ref={themeSheetRef} />
      <LanguagePickerSheet ref={languageSheetRef} />
      <CountryPickerSheet ref={countrySheetRef} />
    </>
  )
}
