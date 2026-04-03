import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import { SvgUri } from 'react-native-svg'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconChevronRight } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'
import { useOnboardingScreens } from '@/src/hooks/use-onboarding-screens'
import { useOnboarding } from '@/src/store/onboarding'
import { t } from '@/src/lib/translate'
import type { OnboardingScreen, OnboardingScreenType } from '@fin-ai/shared'
import { track } from '@/src/lib/analytics'
import { reportEvent } from '@/src/lib/activity'
import { api } from '@/src/lib/api'
import { usePreferences } from '@/src/store/preferences'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

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
        const { setCountryCode, setBaseCurrency } = usePreferences.getState()
        if (res.preferences.countryCode) setCountryCode(res.preferences.countryCode)
        if (res.preferences.baseCurrency) setBaseCurrency(res.preferences.baseCurrency)
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
      <View className="flex-1 justify-center px-6">
        {screen.type === 'informative' && screen.imageUrl ? (
          screen.imageUrl.endsWith('.svg') ? (
            <View className="mb-8 h-56 w-full items-center justify-center">
              <SvgUri
                uri={screen.imageUrl}
                width={SCREEN_WIDTH * 0.65}
                height={224}
              />
            </View>
          ) : (
            <Image
              source={{ uri: screen.imageUrl }}
              className="mb-8 h-56 w-full self-center"
              resizeMode="contain"
            />
          )
        ) : null}

        <Text
          className="mb-3 text-center text-2xl font-bold"
          style={{ color: colors.text }}
        >
          {title}
        </Text>

        {description ? (
          <Text
            className="mb-8 text-center text-base leading-6"
            style={{ color: colors.muted }}
          >
            {description}
          </Text>
        ) : null}

        <ScreenInput
          screen={screen}
          value={answers[screen.slug]}
          onChange={(v) => {
            track('onboarding_answer_provided', { screen_slug: screen.slug, screen_type: screen.type })
            setAnswer(screen.slug, v)
          }}
          colors={colors}
        />
      </View>

      {/* Footer */}
      <View
        className="px-6 pb-2"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
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
          onPress={next}
          className="flex-row items-center justify-center rounded-xl py-4"
          style={{ backgroundColor: colors.accent }}
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
      <View className="gap-3">
        {screen.choices.map((choice) => {
          const selected = value === choice.value
          const label = t(
            screen.translations?.en?.[`choice:${choice.value}`] ?? choice.value,
            screen.translations,
            `choice:${choice.value}`,
          )
          return (
            <Pressable
              key={choice.value}
              onPress={() => onChange(choice.value)}
              className="flex-row items-center rounded-xl px-4 py-3.5"
              style={{
                backgroundColor: selected ? colors.accent : colors.card,
                borderWidth: 1.5,
                borderColor: selected ? colors.accent : colors.border,
              }}
            >
              <Text
                className="text-base font-medium"
                style={{ color: selected ? '#1c1c1e' : colors.text }}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    )
  }

  if (screen.type === 'multiple_choice') {
    const selected = Array.isArray(value) ? value : []
    return (
      <View className="gap-3">
        {screen.choices.map((choice) => {
          const isSelected = selected.includes(choice.value)
          const label = t(
            screen.translations?.en?.[`choice:${choice.value}`] ?? choice.value,
            screen.translations,
            `choice:${choice.value}`,
          )
          return (
            <Pressable
              key={choice.value}
              onPress={() => {
                if (isSelected) {
                  onChange(selected.filter((v) => v !== choice.value))
                } else {
                  onChange([...selected, choice.value])
                }
              }}
              className="flex-row items-center rounded-xl px-4 py-3.5"
              style={{
                backgroundColor: isSelected ? colors.accent : colors.card,
                borderWidth: 1.5,
                borderColor: isSelected ? colors.accent : colors.border,
              }}
            >
              <Text
                className="text-base font-medium"
                style={{ color: isSelected ? '#1c1c1e' : colors.text }}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    )
  }

  return null
}
