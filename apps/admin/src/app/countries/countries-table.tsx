"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Country, Language, Lookup } from "@fin-ai/shared"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { deleteCountry } from "./actions"
import { CountryForm } from "./country-form"
import { toast } from "sonner"

export function CountriesTable({ countries, languages, currencyLookups }: { countries: Country[]; languages: Language[]; currencyLookups: Lookup[] }) {
  const router = useRouter()
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  async function handleDelete(country: Country) {
    try {
      await deleteCountry(country.id)
      router.refresh()
      toast.success(`Deleted ${country.name}`)
    } catch {
      toast.error("Failed to delete country")
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <IconPlus data-icon="inline-start" />
          Add Country
        </Button>
      </div>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-muted-foreground">
              <th className="px-4 py-3 text-start font-medium">Country</th>
              <th className="px-4 py-3 text-start font-medium">Code</th>
              <th className="px-4 py-3 text-start font-medium">Currency</th>
              <th className="px-4 py-3 text-start font-medium">Status</th>
              <th className="px-4 py-3 text-end font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No countries yet. Add your first country.
                </td>
              </tr>
            )}
            {countries.map((country) => (
              <tr key={country.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">
                  <button type="button" className="hover:underline text-start" onClick={() => setEditingCountry(country)}>
                    <span className="me-2">{country.flagEmoji}</span>
                    {country.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {country.code}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {country.currency}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={country.enabled ? "success" : "secondary"}>
                    {country.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon-xs" />}
                    >
                      <IconDots className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingCountry(country)}
                      >
                        <IconPencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDelete(country)}
                      >
                        <IconTrash />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CountryForm
        open={showCreate}
        onOpenChange={setShowCreate}
        languages={languages}
        currencyLookups={currencyLookups}
      />

      <CountryForm
        key={editingCountry?.id}
        open={!!editingCountry}
        onOpenChange={(open) => {
          if (!open) setEditingCountry(null)
        }}
        country={editingCountry ?? undefined}
        languages={languages}
        currencyLookups={currencyLookups}
      />
    </>
  )
}
