"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"

/* ── Color presets to explore ──────────────────────────────── */
const presets: Record<string, { label: string; accent: string }> = {
  yellow:  { label: "Gold Yellow (current)", accent: "#FFD60A" },
  amber:   { label: "Warm Amber",           accent: "#F59E0B" },
  gold:    { label: "Soft Gold",             accent: "#D4A017" },
  emerald: { label: "Deep Emerald",          accent: "#059669" },
  blue:    { label: "Ocean Blue",            accent: "#2563EB" },
  coral:   { label: "Warm Coral",            accent: "#F87171" },
}

/* ── Default app theme tokens ──────────────────────────────── */
const defaultThemes = {
  light: {
    screen:  "#f2f2f7",
    card:    "#ffffff",
    text:    "#1c1c1e",
    muted:   "#636366",
    subtle:  "#aeaeb2",
    input:   "#f2f2f7",
    border:  "#e5e5ea",
    tabBar:  "#ffffff",
    tabInactive: "#8e8e93",
  },
  dark: {
    screen:  "#1c1c1e",
    card:    "#2c2c2e",
    text:    "#ffffff",
    muted:   "#aeaeb2",
    subtle:  "#636366",
    input:   "#2c2c2e",
    border:  "#3a3a3c",
    tabBar:  "#1c1c1e",
    tabInactive: "#636366",
  },
}

type ThemeTokens = typeof defaultThemes.light

/* ── Status colors (fixed, not theme-dependent) ────────────── */
const status = {
  compliant: "#34c759",
  review:    "#ff9500",
  negative:  "#ff3b30",
}

/* ── Laak logo as inline SVG (from laak-logo.svg) ─────────── */
function LaakLogo({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 450 450"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(1.5003245,0,0,1.5003245,-284.42757,-669.96488)">
        <g transform="translate(2.6660814)">
          <path d="m 397.07486,659.57964 c -4.95896,2.64594 -10.00687,1.6413 -14.88727,1.33283 -3.70969,-0.2345 -1.78088,-4.0246 -3.03638,-6.80609 -5.90573,3.60363 -12.09817,6.49737 -18.99774,7.63519 -23.26599,3.83685 -50.97775,-11.74689 -52.40921,-41.35205 -0.51678,-10.68817 -3.5643,-20.02856 -12.89346,-26.229 -12.15415,-8.07798 -27.92066,-5.03116 -36.81826,6.94171 -8.34239,11.22577 -6.56723,27.60339 3.9675,36.60363 11.53322,9.85328 27.33849,9.21405 37.91372,-1.49847 1.36572,-1.38348 2.23074,-3.35419 4.94647,-4.11529 2.36282,4.76708 4.38284,9.83496 7.56079,14.25622 1.31177,1.82495 -0.37238,3.02887 -1.60547,4.14905 -7.94733,7.21948 -17.37015,11.39593 -28.00143,11.69171 -15.81504,0.44 -31.65543,0.33997 -47.47768,0.0579 -21.84667,-0.38953 -38.22937,-16.67468 -38.45332,-38.54046 -0.3003,-29.31968 -0.0327,-58.64484 -0.17925,-87.9668 -0.0198,-3.95603 1.2863,-5.24408 5.17558,-5.15048 15.0286,0.36157 12.44956,-1.9415 12.53109,12.21432 0.15066,26.15634 -0.0565,52.31479 0.1053,78.47101 0.10164,16.43249 10.76446,25.2868 27.43547,22.9577 0.29608,-2.33215 -1.41571,-3.91125 -2.35439,-5.71258 -13.18828,-25.3078 0.77941,-57.39209 28.30231,-64.92694 29.26855,-8.01273 56.97995,13.1387 57.54691,43.92413 0.255,13.84705 9.84887,24.91821 23.40981,27.01446 12.61289,1.94971 25.284,-5.89215 29.36149,-18.17108 4.2005,-12.64947 -1.05332,-26.72326 -12.42746,-33.29062 -11.3274,-6.54028 -24.66797,-4.1383 -33.96894,6.05844 -1.08108,1.18519 -1.73315,2.88721 -4.26577,3.48981 -1.82376,-4.98578 -4.29468,-9.78866 -7.24274,-14.33792 -1.18598,-1.8302 0.4147,-3.05399 1.58615,-4.23914 14.50903,-14.67822 41.08002,-16.26025 57.39923,-3.5466 12.15024,9.46582 18.03076,21.93909 18.11533,37.18195 0.0767,13.82379 -0.0911,27.64905 -0.33838,41.9035 z" />
          <path d="m 455.13494,593.33337 c -5.86154,5.94903 -11.38486,11.73895 -17.12598,17.30432 -2.57812,2.49914 -2.68438,4.36914 -0.19192,7.06555 11.98572,12.96619 23.81656,26.07568 35.68884,39.14655 0.87488,0.96319 1.64288,2.02343 3.54816,4.38879 -5.70874,0 -10.2518,-0.37952 -14.70481,0.0916 -6.22045,0.65808 -10.55804,-1.43853 -14.62146,-6.2763 -8.11706,-9.66382 -16.89538,-18.77216 -25.38354,-28.09119 -1.80841,1.14954 -1.1189,2.62732 -1.13208,3.81995 -0.09,8.16369 -0.0634,16.32855 -0.10306,24.49292 -0.006,1.32684 0.37991,3.19983 -0.32544,3.88928 -4.11462,4.02197 -9.35342,1.45398 -14.08941,1.90857 -3.0459,0.29223 -3.20899,-2.23047 -3.21009,-4.51587 -0.003,-6.99829 -0.0154,-13.99652 -0.0162,-20.99481 -0.004,-32.82532 0.0912,-65.65125 -0.10929,-98.47538 -0.0303,-4.95373 1.22379,-6.73745 6.40149,-6.53225 13.28281,0.52649 11.2551,-1.68576 11.34052,11.45346 0.1181,18.1615 0.0336,36.32431 0.0358,54.48654 2.1e-4,1.63452 6e-5,3.26904 6e-5,4.94202 2.45858,0.2929 3.20327,-1.50428 4.27496,-2.58161 7.28476,-7.32367 14.57059,-14.64993 21.67935,-22.143 2.50159,-2.63678 5.26215,-3.78275 8.83481,-3.69504 5.58987,0.13727 11.18558,0.0364 18.25247,0.0364 -6.09039,8.21753 -12.92383,13.69122 -19.04318,20.27948 z" />
        </g>
      </g>
    </svg>
  )
}

/* ── Helpers ───────────────────────────────────────────────── */
function hexAlpha(hex: string, alpha: number) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0")
  return hex + a
}

function contrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? "#1c1c1e" : "#ffffff"
}

/* ── iPhone Frame ──────────────────────────────────────────── */
function IPhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      <div
        className="relative rounded-[3rem] p-3 shadow-2xl"
        style={{ backgroundColor: "#0A0A0A", width: 310 }}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-[26px] bg-black rounded-full z-10" />
        <div className="relative rounded-[2.25rem] overflow-hidden" style={{ aspectRatio: "9 / 19.5" }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── App Screen — mirrors real app components ──────────────── */
function AppScreen({ mode, accent, theme }: { mode: "light" | "dark"; accent: string; theme: ThemeTokens }) {
  const t = theme
  const fg = contrastText(accent)

  const holdings = [
    { sym: "CIB",  name: "Commercial Intl Bank", status: "compliant" as const, amount: "EGP 82,400", change: "+5.2%" },
    { sym: "SWDY", name: "Saudi Dairy",          status: "compliant" as const, amount: "EGP 64,120", change: "+8.1%" },
    { sym: "EFIH", name: "EFG Hermes",           status: "review" as const,    amount: "EGP 41,000", change: "-1.3%" },
  ]

  return (
    <div className="h-full flex flex-col text-left" style={{ backgroundColor: t.screen }}>
      {/* ── Status bar ── */}
      <div className="h-12 flex items-end justify-between px-6 pb-1">
        <span className="text-[9px] font-semibold" style={{ color: t.text }}>9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-2 rounded-[1px]" style={{ backgroundColor: t.text }} />
          <div className="w-4 h-2 rounded-[1px]" style={{ backgroundColor: t.text }} />
          <div className="w-5 h-2.5 rounded-[2px] border" style={{ borderColor: t.text }}>
            <div className="w-3 h-full rounded-[1px]" style={{ backgroundColor: t.text }} />
          </div>
        </div>
      </div>

      {/* ── App Header ── */}
      <div className="flex items-center justify-between px-4 py-2">
        <LaakLogo color={t.text} size={40} />
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5"
          style={{ backgroundColor: t.card }}
        >
          <span className="text-[8px]" style={{ color: accent }}>&#9733;</span>
          <span className="text-[9px] font-semibold" style={{ color: accent }}>12</span>
        </div>
      </div>

      {/* ── Portfolio Summary Card ── */}
      <div className="mx-3 rounded-2xl p-3.5" style={{ backgroundColor: t.card }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-medium" style={{ color: t.muted }}>Total Value</span>
          <div
            className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
            style={{ border: `1px solid ${t.border}` }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="text-[8px]" style={{ color: t.muted }}>Hide</span>
          </div>
        </div>
        <p className="text-xl font-bold tabular-nums" style={{ color: t.text }}>EGP 284,520</p>
        <p className="text-[9px] mt-0.5" style={{ color: t.muted }}>Cost basis: EGP 253,100</p>

        {/* Mini allocation bar */}
        <div className="flex gap-0.5 mt-3 h-1.5 rounded-full overflow-hidden">
          <div className="flex-[45]" style={{ backgroundColor: "#4A90D9" }} />
          <div className="flex-[30]" style={{ backgroundColor: "#50C878" }} />
          <div className="flex-[15]" style={{ backgroundColor: "#FFB347" }} />
          <div className="flex-[10]" style={{ backgroundColor: "#C084FC" }} />
        </div>
        <div className="flex gap-3 mt-1.5">
          {[
            { label: "Stocks", color: "#4A90D9" },
            { label: "Sukuk",  color: "#50C878" },
            { label: "Gold",   color: "#FFB347" },
            { label: "REITs",  color: "#C084FC" },
          ].map((a) => (
            <div key={a.label} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.color }} />
              <span className="text-[7px]" style={{ color: t.muted }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Holdings Section ── */}
      <div className="px-4 mt-3 mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4A90D9" }} />
          <span className="text-[10px] font-bold" style={{ color: t.text }}>Stocks</span>
          <span className="text-[9px]" style={{ color: t.muted }}>3</span>
        </div>
        <span className="text-[9px] font-semibold" style={{ color: accent }}>See all</span>
      </div>

      <div className="px-3 flex flex-col gap-1.5">
        {holdings.map((h) => (
          <div
            key={h.sym}
            className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{ backgroundColor: t.card }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: "#4A90D9" }} />
              <div>
                <p className="text-[10px] font-bold" style={{ color: t.text }}>{h.sym}</p>
                <p className="text-[8px]" style={{ color: t.muted }}>{h.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold tabular-nums" style={{ color: t.text }}>{h.amount}</p>
              <div className="flex items-center justify-end gap-1">
                <span
                  className="text-[8px] font-medium"
                  style={{ color: h.status === "compliant" ? status.compliant : status.review }}
                >
                  {h.status === "compliant" ? "Compliant" : "Review"}
                </span>
                <span
                  className="text-[8px]"
                  style={{ color: h.change.startsWith("+") ? status.compliant : status.negative }}
                >
                  {h.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Learning Nudge Card ── */}
      <div
        className="mx-3 mt-3 rounded-xl px-3 py-2 flex items-center gap-2"
        style={{ backgroundColor: hexAlpha(accent, 0.1) }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: hexAlpha(accent, 0.2) }}
        >
          <span className="text-xs" style={{ color: accent }}>&#9733;</span>
        </div>
        <div className="min-w-0">
          <p className="text-[9px] font-bold" style={{ color: t.text }}>Why diversify?</p>
          <p className="text-[8px]" style={{ color: t.muted }}>Learn how allocation affects risk</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* ── Bottom Tab Bar ── */}
      <div className="mx-3 mb-3">
        <div
          className="flex items-center justify-around rounded-2xl px-1 py-2 relative"
          style={{
            backgroundColor: t.tabBar,
            boxShadow: mode === "light"
              ? "0 4px 12px rgba(0,0,0,0.1)"
              : "0 4px 12px rgba(0,0,0,0.4)",
          }}
        >
          {/* Portfolio (active) */}
          <div className="flex flex-col items-center gap-0.5 w-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={accent} stroke="none">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 0 1 7.75 6H12V4z" />
            </svg>
            <span className="text-[7px] font-semibold" style={{ color: accent }}>Portfolio</span>
          </div>
          {/* Insights */}
          <div className="flex flex-col items-center gap-0.5 w-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={t.tabInactive} stroke="none">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-[7px]" style={{ color: t.tabInactive }}>Insights</span>
          </div>
          {/* FAB */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center -mt-6"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 14px ${hexAlpha(accent, 0.4)}`,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" stroke={fg} strokeWidth="3" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          {/* Learn */}
          <div className="flex flex-col items-center gap-0.5 w-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={t.tabInactive} stroke="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
            </svg>
            <span className="text-[7px]" style={{ color: t.tabInactive }}>Learn</span>
          </div>
          {/* Settings */}
          <div className="flex flex-col items-center gap-0.5 w-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={t.tabInactive} stroke="none">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="text-[7px]" style={{ color: t.tabInactive }}>Settings</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Accent Swatch (clickable preset) ──────────────────────── */
function AccentSwatch({ color, label, active, onClick }: {
  color: string; label: string; active?: boolean; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-2 py-1 text-left transition-all w-full ${
        active ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted/50"
      }`}
    >
      <div className="w-4 h-4 rounded shrink-0 border border-white/10" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-medium truncate">{label}</span>
      <span className="text-[8px] text-muted-foreground font-mono ml-auto">{color}</span>
    </button>
  )
}

/* ── Editable color row ────────────────────────────────────── */
function EditableColor({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative w-5 h-5 shrink-0 cursor-pointer">
        <div className="w-5 h-5 rounded border border-white/10" style={{ backgroundColor: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <span className="text-[9px] font-medium truncate flex-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
        }}
        className="text-[8px] text-muted-foreground font-mono bg-transparent border-0 p-0 w-14 outline-none text-right"
      />
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
export default function BrandPage() {
  const [activePreset, setActivePreset] = useState("yellow")
  const [customAccent, setCustomAccent] = useState("#FFD60A")
  const [light, setLight] = useState<ThemeTokens>({ ...defaultThemes.light })
  const [dark, setDark] = useState<ThemeTokens>({ ...defaultThemes.dark })
  const [copied, setCopied] = useState(false)

  const isCustom = !Object.keys(presets).includes(activePreset)
  const accent = isCustom ? customAccent : presets[activePreset].accent

  const updateLight = (key: keyof ThemeTokens, val: string) =>
    setLight((prev) => ({ ...prev, [key]: val }))
  const updateDark = (key: keyof ThemeTokens, val: string) =>
    setDark((prev) => ({ ...prev, [key]: val }))

  const resetTheme = () => {
    setLight({ ...defaultThemes.light })
    setDark({ ...defaultThemes.dark })
    setActivePreset("yellow")
    setCustomAccent("#FFD60A")
  }

  const exportJson = () => {
    return JSON.stringify({ accent, light, dark, status }, null, 2)
  }

  const copyTheme = async () => {
    await navigator.clipboard.writeText(exportJson())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const neutralLabels: Record<keyof ThemeTokens, string> = {
    screen: "Screen",
    card: "Card",
    text: "Text",
    muted: "Muted",
    subtle: "Subtle",
    input: "Input",
    border: "Border",
    tabBar: "Tab Bar",
    tabInactive: "Tab Inactive",
  }

  return (
    <PageLayout
      title="Brand & Theme"
      description="Edit colors live, then copy the full theme JSON to apply"
    >
      <div className="flex gap-4">
        {/* ── LEFT: Devices ── */}
        <div className="flex-1 flex items-start justify-center gap-6">
          <IPhoneFrame label="Light Mode">
            <AppScreen mode="light" accent={accent} theme={light} />
          </IPhoneFrame>
          <IPhoneFrame label="Dark Mode">
            <AppScreen mode="dark" accent={accent} theme={dark} />
          </IPhoneFrame>
        </div>

        {/* ── RIGHT: Color controls ── */}
        <div className="w-56 shrink-0 flex flex-col gap-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Accent */}
          <div className="rounded-lg border border-border p-2">
            <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wide text-muted-foreground">Accent</p>
            <div className="flex flex-col gap-0.5">
              {Object.entries(presets).map(([key, p]) => (
                <AccentSwatch
                  key={key}
                  color={p.accent}
                  label={p.label}
                  active={activePreset === key}
                  onClick={() => { setActivePreset(key); setCustomAccent(p.accent) }}
                />
              ))}
            </div>
            <div className={`mt-1 flex items-center gap-1.5 rounded-md px-2 py-1 ${isCustom ? "ring-2 ring-primary bg-primary/10" : ""}`}>
              <input
                type="color"
                value={customAccent}
                onChange={(e) => { setActivePreset("custom"); setCustomAccent(e.target.value) }}
                className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
              />
              <span className="text-[10px] font-medium">Custom</span>
              <input
                type="text"
                value={customAccent}
                onChange={(e) => {
                  const v = e.target.value
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) { setActivePreset("custom"); setCustomAccent(v) }
                }}
                className="text-[8px] text-muted-foreground font-mono bg-transparent border-0 p-0 w-14 outline-none text-right ml-auto"
              />
            </div>
          </div>

          {/* Light neutrals */}
          <div className="rounded-lg border border-border p-2">
            <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wide text-muted-foreground">Light Mode</p>
            <div className="flex flex-col gap-1">
              {(Object.keys(neutralLabels) as Array<keyof ThemeTokens>).map((key) => (
                <EditableColor
                  key={`light-${key}`}
                  label={neutralLabels[key]}
                  value={light[key]}
                  onChange={(v) => updateLight(key, v)}
                />
              ))}
            </div>
          </div>

          {/* Dark neutrals */}
          <div className="rounded-lg border border-border p-2">
            <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wide text-muted-foreground">Dark Mode</p>
            <div className="flex flex-col gap-1">
              {(Object.keys(neutralLabels) as Array<keyof ThemeTokens>).map((key) => (
                <EditableColor
                  key={`dark-${key}`}
                  label={neutralLabels[key]}
                  value={dark[key]}
                  onChange={(v) => updateDark(key, v)}
                />
              ))}
            </div>
          </div>

          {/* Status (display only) */}
          <div className="rounded-lg border border-border p-2">
            <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wide text-muted-foreground">Status (fixed)</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: status.compliant }} />
                <span className="text-[9px] flex-1">Compliant</span>
                <span className="text-[8px] font-mono text-muted-foreground">#34c759</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: status.review }} />
                <span className="text-[9px] flex-1">Review</span>
                <span className="text-[8px] font-mono text-muted-foreground">#ff9500</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: status.negative }} />
                <span className="text-[9px] flex-1">Negative</span>
                <span className="text-[8px] font-mono text-muted-foreground">#ff3b30</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1.5">
            <button
              onClick={copyTheme}
              className="flex-1 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold py-1.5 hover:bg-primary/90 transition-colors"
            >
              {copied ? "Copied!" : "Copy Theme JSON"}
            </button>
            <button
              onClick={resetTheme}
              className="rounded-md border border-border text-[10px] font-medium px-2 py-1.5 hover:bg-muted/50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
