import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { api } from './api'

/** Register for push notifications and send token to server */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device')
    return null
  }

  // Check/request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted')
    return null
  }

  // Get Expo push token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  })
  const expoToken = tokenData.data

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  // Send token to server
  await sendTokenToServer(userId, expoToken)

  return expoToken
}

/** Send push token to API — userId comes from JWT, not body */
async function sendTokenToServer(_userId: string, expoToken: string) {
  try {
    await api.post('/push-tokens', {
      expoToken,
      platform: Platform.OS as 'ios' | 'android',
    })
  } catch (error) {
    console.error('Failed to register push token:', error)
  }
}

/** Unregister push token from server */
export async function unregisterPushToken(expoToken: string) {
  try {
    const { getAccessToken } = await import('./supabase')
    const token = await getAccessToken()
    const baseUrl = __DEV__
      ? 'http://localhost:12003'
      : 'https://laak-api.ahmedgaber-1988-masterai.workers.dev'
    await fetch(`${baseUrl}/push-tokens`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ expoToken }),
    })
  } catch (error) {
    console.error('Failed to unregister push token:', error)
  }
}

/** Update notification preferences on server */
export async function updateNotificationPrefs(
  expoToken: string,
  prefs: { marketing: boolean; content: boolean; onboarding: boolean }
) {
  try {
    await api.put('/push-tokens/prefs', { expoToken, prefs })
  } catch (error) {
    console.error('Failed to update notification prefs:', error)
  }
}

/** Schedule a local notification (for portfolio alerts) */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  trigger?: Notifications.NotificationTriggerInput
) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: trigger ?? null,
  })
}

/** Set up notification response handler (tap to open) */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification)
    }
  )

  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onNotificationResponse?.(response)
    }
  )

  return () => {
    receivedSubscription.remove()
    responseSubscription.remove()
  }
}
