import * as LocalAuthentication from 'expo-local-authentication'

export interface BiometricStatus {
  available: boolean
  enrolled: boolean
  types: LocalAuthentication.AuthenticationType[]
}

export async function getBiometricStatus(): Promise<BiometricStatus> {
  const available = await LocalAuthentication.hasHardwareAsync()
  const enrolled = await LocalAuthentication.isEnrolledAsync()
  const types = available
    ? await LocalAuthentication.supportedAuthenticationTypesAsync()
    : []
  return { available, enrolled, types }
}

export async function authenticateBiometric(
  promptMessage = 'Unlock Laak',
): Promise<{ success: boolean; error?: string }> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    disableDeviceFallback: true,
    cancelLabel: 'Use PIN',
  })
  return {
    success: result.success,
    error: result.success ? undefined : result.error,
  }
}

export function getBiometricLabel(
  types: LocalAuthentication.AuthenticationType[],
): string {
  const { AuthenticationType } = LocalAuthentication
  if (types.includes(AuthenticationType.FACIAL_RECOGNITION)) return 'Face ID'
  if (types.includes(AuthenticationType.FINGERPRINT)) return 'Fingerprint'
  if (types.includes(AuthenticationType.IRIS)) return 'Iris'
  return 'Biometrics'
}
