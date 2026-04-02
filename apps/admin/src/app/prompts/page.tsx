import { listPrompts } from "./actions"
import { PromptsPlayground } from "./prompts-playground"

export default async function PromptsPage() {
  const prompts = await listPrompts()

  return <PromptsPlayground initialPrompts={prompts} />
}
