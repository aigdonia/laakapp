import Purchases, {
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases'

const API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? ''

let initialized = false

export async function initPurchases() {
  if (initialized || !API_KEY) return
  Purchases.setLogLevel(LOG_LEVEL.DEBUG)
  Purchases.configure({ apiKey: API_KEY })
  initialized = true
}

export async function getOfferings() {
  const offerings = await Purchases.getOfferings()
  return offerings.current?.availablePackages ?? []
}

export async function purchasePackage(pkg: PurchasesPackage) {
  return Purchases.purchasePackage(pkg)
}

export async function restorePurchases() {
  return Purchases.restorePurchases()
}

/** Read LAK virtual currency balance via the dedicated API */
export async function getLakBalance(): Promise<number> {
  const currencies = await Purchases.getVirtualCurrencies()
  return currencies.all['LAK']?.balance ?? 0
}

/** Invalidate cached balance so next getLakBalance fetches fresh data */
export async function invalidateLakCache(): Promise<void> {
  await Purchases.invalidateVirtualCurrenciesCache()
}
