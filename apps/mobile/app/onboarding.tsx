import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SvgUri } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  IconChevronRight,
  IconCheck,
  IconCircleCheckFilled,
} from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'
import { useOnboardingScreens } from '@/src/hooks/use-onboarding-screens'
import { useOnboarding } from '@/src/store/onboarding'
import { t } from '@/src/lib/translate'
import type { OnboardingScreen, OnboardingScreenType } from '@fin-ai/shared'
import { track } from '@/src/lib/analytics'
import { reportEvent } from '@/src/lib/activity'
import { api } from '@/src/lib/api'
import { usePreferences, pauseProfileSync, resumeProfileSync } from '@/src/store/preferences'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

function hasAnswer(
  type: OnboardingScreenType,
  value: string | string[] | undefined,
): boolean {
  if (type === 'informative') return true
  if (type === 'single_choice') return !!value
  if (type === 'multiple_choice') return Array.isArray(value) && value.length > 0
  if (type === 'text_input') return typeof value === 'string' && value.trim().length > 0
  return true
}

export default function OnboardingRoute() {
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { data: screens = [] } = useOnboardingScreens()
  const { answers, setAnswer, markCompleted } = useOnboarding()
  const [index, setIndex] = useState(0)
  const tracked = useRef(false)

  const screen = screens[index]
  const isLast = index === screens.length - 1

  const canContinue =
    !screen || screen.skippable || hasAnswer(screen.type, answers[screen.slug])

  // Track onboarding start (once)
  useEffect(() => {
    if (screens.length > 0 && !tracked.current) {
      tracked.current = true
      track('onboarding_started', { total_screens: screens.length })
    }
  }, [screens.length])

  // Track each screen view
  useEffect(() => {
    if (screen) {
      track('onboarding_screen_viewed', {
        screen_slug: screen.slug,
        screen_type: screen.type,
        screen_index: index,
      })
    }
  }, [index, screen?.slug])

  const finish = useCallback(async () => {
    // Send answers to API, apply derived preferences
    try {
      const res = await api.post<{ preferences: Record<string, string> }>('/profile', { answers })
      if (res.preferences) {
        pauseProfileSync()
        const { setCountryCode, setBaseCurrency, setPortfolioPresetSlug, setActivityRhythm } = usePreferences.getState()
        if (res.preferences.countryCode) setCountryCode(res.preferences.countryCode)
        if (res.preferences.baseCurrency) setBaseCurrency(res.preferences.baseCurrency)
        if (res.preferences.portfolioPresetSlug) setPortfolioPresetSlug(res.preferences.portfolioPresetSlug)
        if (res.preferences.activityRhythm) setActivityRhythm(res.preferences.activityRhythm as 'daily' | 'weekly' | 'biweekly' | 'monthly')
        resumeProfileSync()
      }
    } catch {
      // Non-blocking — answers are in MMKV, can retry later
    }
    markCompleted()
    router.replace('/(tabs)')
  }, [markCompleted, router, answers])

  const next = useCallback(() => {
    if (isLast) {
      track('onboarding_completed', { screens_viewed: index + 1 })
      reportEvent('onboarding_completed')
      finish()
    } else {
      setIndex((i) => i + 1)
    }
  }, [isLast, finish, index])

  if (!screen) return null

  const title = t(
    screen.translations?.en?.title ?? '',
    screen.translations,
    'title',
  )
  const description = t(
    screen.translations?.en?.description ?? '',
    screen.translations,
    'description',
  )

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.screen, paddingTop: insets.top }}
    >
      {/* Skip button */}
      <View className="flex-row justify-end px-5 pt-2">
        <Pressable onPress={() => {
          track('onboarding_skipped', { at_screen_index: index, at_screen_slug: screen?.slug })
          finish()
        }} hitSlop={12}>
          <Text className="text-sm font-medium" style={{ color: colors.muted }}>
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Fixed header: image, title, description */}
        {screen.imageUrl ? (
          screen.imageUrl.endsWith('.svg') ? (
            <View className="mb-8 h-56 w-full items-center justify-center">
              <SvgUri
                uri={screen.imageUrl}
                width={SCREEN_WIDTH * 0.65}
                height={224}
              />
            </View>
          ) : (
            <View
              className="mb-8 items-center justify-center self-center overflow-hidden"
              style={{
                width: SCREEN_WIDTH * 0.5,
                height: SCREEN_WIDTH * 0.5,
                borderRadius: SCREEN_WIDTH * 0.12,
                backgroundColor: '#000000',
              }}
            >
              <Image
                source={{ uri: screen.imageUrl }}
                style={{
                  width: SCREEN_WIDTH * 0.5,
                  height: SCREEN_WIDTH * 0.5,
                }}
                resizeMode="cover"
              />
            </View>
          )
        ) : null}

        <Text
          className="mb-3 text-left text-3xl font-bold"
          style={{ color: colors.text }}
        >
          {title}
        </Text>

        {description ? (
          screen.type === 'informative' && description.includes('\n\n') ? (
            <BenefitList description={description} colors={colors} />
          ) : (
            <Text
              className="mb-4 text-lg leading-7"
              style={{ color: colors.muted, textAlign: 'justify' }}
            >
              {description}
            </Text>
          )
        ) : null}

        {/* Scrollable options */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScreenInput
            screen={screen}
            value={answers[screen.slug]}
            onChange={(v) => {
              track('onboarding_answer_provided', { screen_slug: screen.slug, screen_type: screen.type })
              setAnswer(screen.slug, v)
            }}
            colors={colors}
          />
        </ScrollView>
      </View>

      {/* Footer */}
      <View
        className="px-6 pb-2"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + (Platform.OS === 'android' ? 24 : 0) }}
      >
        {/* Progress dots */}
        <View className="mb-6 flex-row items-center justify-center gap-2">
          {screens.map((_, i) => (
            <View
              key={i}
              className="rounded-full"
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                backgroundColor:
                  i === index ? colors.accent : colors.border,
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={canContinue ? next : undefined}
          className="flex-row items-center justify-center rounded-xl py-4"
          style={{
            backgroundColor: colors.accent,
            opacity: canContinue ? 1 : 0.4,
          }}
          disabled={!canContinue}
        >
          <Text className="text-base font-semibold" style={{ color: '#1c1c1e' }}>
            {isLast ? 'Get Started' : 'Continue'}
          </Text>
          {!isLast && (
            <IconChevronRight size={18} color="#1c1c1e" style={{ marginLeft: 4 }} />
          )}
        </Pressable>
      </View>
    </View>
  )
}

function BenefitList({
  description,
  colors,
}: {
  description: string
  colors: ReturnType<typeof useThemeColors>
}) {
  const items = description
    .split('\n\n')
    .map((line) => line.replace(/^→\s*/, '').trim())
    .filter(Boolean)

  return (
    <View className="mb-8 gap-4">
      {items.map((item, i) => {
        // Split on " — " to separate headline from detail
        const semiIdx = item.indexOf(';')
        const headline = semiIdx > -1 ? item.slice(0, semiIdx).trim() : item
        const detail = semiIdx > -1 ? item.slice(semiIdx + 1).trim() : null

        return (
          <View
            key={i}
            className="flex-row items-start gap-3 rounded-xl px-4 py-3.5"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <IconCircleCheckFilled
              size={22}
              color={colors.accent}
              style={{ marginTop: 2 }}
            />
            <View className="flex-1">
              <Text
                className="text-base font-semibold"
                style={{ color: colors.text }}
              >
                {headline}
              </Text>
              {detail ? (
                <Text
                  className="mt-1 text-sm leading-5"
                  style={{ color: colors.muted }}
                >
                  {detail}
                </Text>
              ) : null}
            </View>
          </View>
        )
      })}
    </View>
  )
}

function ScreenInput({
  screen,
  value,
  onChange,
  colors,
}: {
  screen: OnboardingScreen
  value: string | string[] | undefined
  onChange: (v: string | string[]) => void
  colors: ReturnType<typeof useThemeColors>
}) {
  if (screen.type === 'text_input') {
    return (
      <TextInput
        className="rounded-xl px-4 py-3.5 text-base"
        style={{
          backgroundColor: colors.input,
          color: colors.text,
        }}
        placeholderTextColor={colors.subtle}
        placeholder={
          t(
            screen.translations?.en?.placeholder ?? '',
            screen.translations,
            'placeholder',
          ) || undefined
        }
        value={(value as string) ?? ''}
        onChangeText={onChange}
      />
    )
  }

  if (screen.type === 'single_choice') {
    return (
      <View className="gap-3.5">
        {screen.choices.map((choice) => {
          const selected = value === choice.value
          const label = t(
            screen.translations?.en?.[`choice:${choice.value}`] ?? choice.value,
            screen.translations,
            `choice:${choice.value}`,
          )
          return (
            <View
              key={choice.value}
              style={selected ? {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 8,
              } : undefined}
            >
              <Pressable
                onPress={() => onChange(choice.value)}
                className="flex-row items-center rounded-2xl px-5 py-4.5"
                style={{
                  backgroundColor: selected
                    ? `${colors.accent}15`
                    : 'transparent',
                  borderWidth: 2,
                  borderColor: selected ? colors.accent : colors.border,
                }}
              >
                {/* Radio indicator */}
                <View
                  className="mr-3.5 items-center justify-center rounded-full"
                  style={{
                    width: 26,
                    height: 26,
                    borderWidth: 2,
                    borderColor: selected ? colors.accent : colors.subtle,
                    backgroundColor: selected ? `${colors.accent}20` : 'transparent',
                  }}
                >
                  {selected && (
                    <View
                      className="rounded-full"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: colors.accent,
                        shadowColor: colors.accent,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  )}
                </View>
                <Text
                  className="flex-1 text-base font-medium"
                  style={{ color: colors.text }}
                >
                  {label}
                </Text>
              </Pressable>
            </View>
          )
        })}
      </View>
    )
  }

  if (screen.type === 'multiple_choice') {
    const selected = Array.isArray(value) ? value : []
    return (
      <View className="gap-3.5">
        {screen.choices.map((choice) => {
          const isSelected = selected.includes(choice.value)
          const label = t(
            screen.translations?.en?.[`choice:${choice.value}`] ?? choice.value,
            screen.translations,
            `choice:${choice.value}`,
          )
          return (
            <View
              key={choice.value}
              style={isSelected ? {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 8,
              } : undefined}
            >
              <Pressable
                onPress={() => {
                  if (isSelected) {
                    onChange(selected.filter((v) => v !== choice.value))
                  } else {
                    onChange([...selected, choice.value])
                  }
                }}
                className="flex-row items-center rounded-2xl px-5 py-4.5"
                style={{
                  backgroundColor: isSelected
                    ? `${colors.accent}15`
                    : 'transparent',
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? colors.accent : colors.border,
                }}
              >
                {/* Checkbox indicator */}
                <View
                  className="mr-3.5 items-center justify-center rounded-md"
                  style={{
                    width: 26,
                    height: 26,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.accent : colors.subtle,
                    backgroundColor: isSelected ? `${colors.accent}20` : 'transparent',
                  }}
                >
                  {isSelected && (
                    <IconCheck
                      size={16}
                      color={colors.accent}
                      strokeWidth={3}
                      style={{
                        shadowColor: colors.accent,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    />
                  )}
                </View>
                <Text
                  className="flex-1 text-base font-medium"
                  style={{ color: colors.text }}
                >
                  {label}
                </Text>
              </Pressable>
            </View>
          )
        })}
      </View>
    )
  }

  return null
}
