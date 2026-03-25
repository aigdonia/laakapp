"use client"

import type { Language, Translations } from "@fin-ai/shared"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LocaleInput({
  field,
  label,
  languages,
  defaultValue,
  translations,
  required,
  placeholder,
  onChange,
}: {
  field: string
  label: string
  languages: Language[]
  defaultValue?: string
  translations?: Translations
  required?: boolean
  placeholder?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field}>{label}</Label>
      <div className="flex flex-col gap-1.5">
        {languages.map((lang) => {
          const isDefault = lang.code === "en"
          const name = isDefault ? field : `${field}__${lang.code}`
          const value = isDefault
            ? defaultValue
            : translations?.[lang.code]?.[field]

          return (
            <div key={lang.code} className="relative">
              <Input
                id={isDefault ? field : undefined}
                name={name}
                placeholder={placeholder}
                defaultValue={value}
                required={isDefault && required}
                dir={lang.direction === "rtl" ? "rtl" : undefined}
                className="pe-12"
                onChange={isDefault ? onChange : undefined}
              />
              <span className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground uppercase">
                {lang.code}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
