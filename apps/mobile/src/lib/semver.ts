/** Returns true if `version` >= `minimum`. Simple major.minor.patch compare. */
export function semverGte(version: string, minimum: string): boolean {
  const v = version.split('.').map(Number)
  const m = minimum.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((v[i] ?? 0) > (m[i] ?? 0)) return true
    if ((v[i] ?? 0) < (m[i] ?? 0)) return false
  }
  return true
}
