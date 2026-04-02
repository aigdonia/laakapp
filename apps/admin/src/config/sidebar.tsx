"use client"

import {
  IconArticle,
  IconBell,
  IconBuildingBank,
  IconCategory,
  IconChartBar,
  IconChartPie,
  IconCoin,
  IconDashboard,
  IconDatabase,
  IconFileText,
  IconFilter,
  IconLanguage,
  IconFlag,
  IconPalette,
  IconScreenshot,
  IconPlayerPlay,
  IconQuestionMark,
  IconRefresh,
  IconReportMoney,
  IconRobot,
  IconSettings2,
  IconShieldCheck,
  IconSpeakerphone,
  IconStack2,
  IconTags,
  IconUsers,
  IconWorldWww,
  IconCurrencyDollar,
  IconBolt,
  IconTag,
  IconSparkles,
} from "@tabler/icons-react"

export type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
}

export type NavGroup = {
  label?: string
  items: Array<NavItem>
}

export const sidebarConfig = {
  user: {
    name: "Admin",
    email: "admin@fin-ai.app",
    avatar: "",
  },
  nav: [
    {
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: <IconDashboard />,
        },
      ],
    },
    {
      label: "Users",
      items: [
        {
          title: "Users",
          url: "#",
          icon: <IconUsers />,
        },
      ],
    },
    {
      label: "Markets",
      items: [
        {
          title: "Countries",
          url: "/countries",
          icon: <IconFlag />,
        },
        {
          title: "Asset Classes",
          url: "/asset-classes",
          icon: <IconStack2 />,
        },
        {
          title: "Lookups",
          url: "/lookups",
          icon: <IconTags />,
        },
        {
          title: "Currencies",
          url: "/exchange-rates",
          icon: <IconCurrencyDollar />,
        },
        {
          title: "Portfolio Presets",
          url: "/portfolio-presets",
          icon: <IconChartPie />,
        },
      ],
    },
    {
      label: "Screening",
      items: [
        {
          title: "Stocks",
          url: "/stocks",
          icon: <IconBuildingBank />,
        },
        {
          title: "Screening Rules",
          url: "/screening-rules",
          icon: <IconShieldCheck />,
        },
        {
          title: "Data Sources",
          url: "/data-sources",
          icon: <IconDatabase />,
        },
        {
          title: "Scrape Jobs",
          url: "/scrape-jobs",
          icon: <IconRefresh />,
        },
        {
          title: "Financials",
          url: "/stock-financials",
          icon: <IconReportMoney />,
        },
      ],
    },
    {
      label: "Engagement",
      items: [
        {
          title: "Notifications",
          url: "/notifications",
          icon: <IconBell />,
        },
        {
          title: "Event Types",
          url: "/event-types",
          icon: <IconTag />,
        },
        {
          title: "Activity Rules",
          url: "/activity-rules",
          icon: <IconBolt />,
        },
      ],
    },
    {
      label: "Content",
      items: [
        {
          title: "Onboarding",
          url: "/onboarding",
          icon: <IconPlayerPlay />,
        },
        {
          title: "Categories",
          url: "/article-categories",
          icon: <IconCategory />,
        },
        {
          title: "Articles",
          url: "/articles",
          icon: <IconArticle />,
        },
        {
          title: "Micro-lessons",
          url: "/micro-lessons",
          icon: <IconQuestionMark />,
        },
        {
          title: "Learning Cards",
          url: "/learning-cards",
          icon: <IconFileText />,
        },
        {
          title: "Languages",
          url: "/languages",
          icon: <IconLanguage />,
        },
        {
          title: "Translations",
          url: "/translations",
          icon: <IconLanguage />,
        },
      ],
    },
    {
      label: "Monetization",
      items: [
        {
          title: "Credit Packages",
          url: "#",
          icon: <IconCoin />,
        },
        {
          title: "Affiliates",
          url: "#",
          icon: <IconTags />,
        },
      ],
    },
    {
      label: "AI",
      items: [
        {
          title: "AI Features",
          url: "/ai-features",
          icon: <IconSparkles />,
        },
        {
          title: "Prompts",
          url: "/prompts",
          icon: <IconRobot />,
        },
      ],
    },
    {
      label: "Brand & Growth",
      items: [
        {
          title: "Brand & Theme",
          url: "/brand",
          icon: <IconPalette />,
        },
        {
          title: "Screenshots",
          url: "/screenshots",
          icon: <IconScreenshot />,
        },
        {
          title: "Content Ops",
          url: "/content-ops",
          icon: <IconSpeakerphone />,
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          title: "General",
          url: "/settings",
          icon: <IconSettings2 />,
        },
        {
          title: "App Config",
          url: "#",
          icon: <IconFilter />,
        },
        {
          title: "Marketing Site",
          url: "#",
          icon: <IconWorldWww />,
        },
        {
          title: "Analytics",
          url: "#",
          icon: <IconChartBar />,
        },
      ],
    },
  ] satisfies Array<NavGroup>,
}
