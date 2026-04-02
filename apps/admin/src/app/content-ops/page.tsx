"use client"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Separator } from "@/components/ui/separator"
import { WeeklyBoard } from "./weekly-board"
import { StreakTracker } from "./streak-tracker"
import { ContentBank } from "./content-bank"
import { PostLog, type PostEntry } from "./post-log"
import { useLocalStorage } from "./use-local-storage"

/** Get Monday of the week containing `date` */
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function ContentOpsPage() {
  const [weeklyData, setWeeklyData] = useLocalStorage<
    Record<string, Record<string, boolean>>
  >("laak-content-ops-weekly", {})

  const [posts, setPosts] = useLocalStorage<PostEntry[]>(
    "laak-content-ops-posts",
    []
  )

  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))

  return (
    <PageLayout
      title="Content Ops"
      description="Social content marketing tracker — Reddit & X"
    >
      {/* Weekly Board */}
      <WeeklyBoard
        weeklyData={weeklyData}
        setWeeklyData={setWeeklyData}
        weekStart={weekStart}
        setWeekStart={setWeekStart}
      />

      {/* Streak Grid */}
      <StreakTracker weeklyData={weeklyData} />

      <Separator />

      {/* Content Bank + Post Log side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ContentBank />
        <PostLog posts={posts} setPosts={setPosts} />
      </div>
    </PageLayout>
  )
}
