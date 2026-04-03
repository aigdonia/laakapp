import Purchases, {
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases'

const TEST_KEY = 'test_McHHgkqWaUNufOvmHECnMlcIqLr'
const PROD_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? ''
const API_KEY = __DEV__ ? TEST_KEY : PROD_KEY

let initialized = false

export async function initPurchases(userId: string) {
  if (initialized) return
  if (!API_KEY) {
    console.warn('[Purchases] No RevenueCat API key — skipping init')
    return
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO)
  Purchases.configure({ apiKey: API_KEY })
  await Purchases.logIn(userId)
  initialized = true
  console.log('[Purchases] initialized with userId:', userId)
}

export async function getOfferings() {
  if (!initialized) return []
  const offerings = await Purchases.getOfferings()
  const offering = __DEV__
    ? offerings.all['default'] ?? offerings.current
    : offerings.current
  return offering?.availablePackages ?? []
}

export async function purchasePackage(pkg: PurchasesPackage) {
  if (!initialized) throw new Error('Purchases not initialized')
  return Purchases.purchasePackage(pkg)
}

export async function restorePurchases() {
  if (!initialized) throw new Error('Purchases not initialized')
  return Purchases.restorePurchases()
}

/** Read LAK virtual currency balance via the dedicated API */
export async function getLakBalance(): Promise<number> {
  if (!initialized) return 0
  const currencies = await Purchases.getVirtualCurrencies()
  return currencies.all['LAK']?.balance ?? 0
}

/** Invalidate cached balance so next getLakBalance fetches fresh data */
export async function invalidateLakCache(): Promise<void> {
  if (!initialized) return
  await Purchases.invalidateVirtualCurrenciesCache()
}

export async function getAppUserID(): Promise<string> {
  if (!initialized) return ''
  return Purchases.getAppUserID()
}
