"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconCopy, IconCheck } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  REDDIT_TEMPLATES,
  X_TEMPLATES,
  type ContentTemplate,
} from "./content-ops-data"

export function ContentBank() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Content Bank
      </h3>
      <Tabs defaultValue="reddit">
        <TabsList>
          <TabsTrigger value="reddit">Reddit Templates</TabsTrigger>
          <TabsTrigger value="x">X Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="reddit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REDDIT_TEMPLATES.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="x">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {X_TEMPLATES.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateCard({ template }: { template: ContentTemplate }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.copyText)
    setCopied(true)
    toast.success("Template copied to clipboard")
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm">{template.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <IconCheck className="size-3.5 text-green-500" />
            ) : (
              <IconCopy className="size-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground flex-1">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
