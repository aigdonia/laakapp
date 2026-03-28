"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { ApiEnv } from "@/lib/api";

export async function switchApiEnv(env: ApiEnv) {
  const cookieStore = await cookies();
  cookieStore.set("api_env", env, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/", "layout");
}
