"use client"

import { useState } from "react"
import type { Language, Translations } from "@fin-ai/shared"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconLanguage, IconChevronDown } from "@tabler/icons-react"

export function LocaleInput({
  field,
  label,
  languages,
  defaultValue,
  translations,
  required,
  placeholder,
  onChange,
  multiline,
}: {
  field: string
  label: string
  languages: Language[]
  defaultValue?: string
  translations?: Translations
  required?: boolean
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  multiline?: boolean
}) {
  const otherLanguages = languages.filter((l) => l.code !== "en")
  const [showTranslations, setShowTranslations] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field}>{label}</Label>

      {/* Primary (English) input */}
      {multiline ? (
        <textarea
          id={field}
          name={field}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
        />
      ) : (
        <Input
          id={field}
          name={field}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          onChange={onChange}
        />
      )}

      {/* Translations toggle */}
      {otherLanguages.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowTranslations(!showTranslations)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconLanguage className="size-3.5" />
            <span>{otherLanguages.length} translation{otherLanguages.length > 1 ? "s" : ""}</span>
            <IconChevronDown className={`size-3 transition-transform ${showTranslations ? "rotate-180" : ""}`} />
          </button>

          {showTranslations && (
            <div className="flex flex-col gap-2 mt-2 pl-3 border-l-2 border-muted">
              {otherLanguages.map((lang) => {
                const name = `${field}__${lang.code}`
                const value = translations?.[lang.code]?.[field]

                return (
                  <div key={lang.code}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-medium text-muted-foreground uppercase">{lang.code}</span>
                      <span className="text-[11px] text-muted-foreground">— {lang.nativeName}</span>
                    </div>
                    {multiline ? (
                      <textarea
                        name={name}
                        placeholder={placeholder}
                        defaultValue={value}
                        dir={lang.direction === "rtl" ? "rtl" : undefined}
                        rows={3}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                    ) : (
                      <Input
                        name={name}
                        placeholder={placeholder}
                        defaultValue={value}
                        dir={lang.direction === "rtl" ? "rtl" : undefined}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
