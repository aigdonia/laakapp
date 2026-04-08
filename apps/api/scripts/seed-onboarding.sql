-- Disable old onboarding screens
UPDATE onboarding_screens SET enabled = 0;

-- Screen 1: Welcome
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-001',
  'informative',
  'welcome',
  'https://raw.githubusercontent.com/pshah123/undraw-illustrations/master/svg/real-time_sync_o57k.svg',
  '[]',
  0,
  1,
  1,
  '{"en":{"title":"Your investments. Your phone. Your eyes only.","description":"Track every holding across every broker — all in one place, entirely on your device. No cloud. No logins. No one watching."},"ar":{"title":"استثماراتك. هاتفك. عيونك فقط.","description":"تابع كل استثماراتك من كل وسيط — في مكان واحد على جهازك بالكامل. بدون سحابة. بدون تسجيل دخول. بدون أي رقابة."}}'
);

-- Screen 2: Goal Question
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-002',
  'single_choice',
  'goal',
  '',
  '[{"value":"track_privately"},{"value":"understand_performance"},{"value":"ai_insights"},{"value":"learn_investing"},{"value":"check_compliance"},{"value":"all_of_above"}]',
  1,
  1,
  1,
  '{"en":{"title":"What matters most to you?","description":"This helps us tailor your experience.","choice:track_privately":"📊 Track my portfolio privately","choice:understand_performance":"📈 Understand how my investments are doing","choice:ai_insights":"🤖 Get AI-powered insights on my holdings","choice:learn_investing":"📚 Learn the basics of investing","choice:check_compliance":"✅ Check if my investments are Sharia-compliant","choice:all_of_above":"🎯 All of the above"},"ar":{"title":"ما الأهم بالنسبة لك؟","description":"هذا يساعدنا في تخصيص تجربتك.","choice:track_privately":"📊 تتبع محفظتي بخصوصية","choice:understand_performance":"📈 فهم أداء استثماراتي","choice:ai_insights":"🤖 الحصول على تحليلات ذكية لاستثماراتي","choice:learn_investing":"📚 تعلم أساسيات الاستثمار","choice:check_compliance":"✅ التحقق من توافق استثماراتي مع الشريعة","choice:all_of_above":"🎯 كل ما سبق"}}'
);

-- Screen 3: Pain Points
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-003',
  'multiple_choice',
  'pain_points',
  '',
  '[{"value":"spreadsheets"},{"value":"scattered_apps"},{"value":"privacy_concerns"},{"value":"compliance_unclear"},{"value":"jargon"},{"value":"no_unified_view"},{"value":"dont_know_start"}]',
  2,
  1,
  1,
  '{"en":{"title":"What frustrates you about managing investments?","description":"Pick as many as you like — no wrong answers.","choice:spreadsheets":"📝 Tracking in spreadsheets or notes","choice:scattered_apps":"📱 Data scattered across broker apps","choice:privacy_concerns":"🔒 Other apps want too much access to my data","choice:compliance_unclear":"❓ Not sure which holdings are compliant","choice:jargon":"😵 Financial reports are full of jargon","choice:no_unified_view":"🧩 No single view of everything I own","choice:dont_know_start":"🌱 I''m new and don''t know where to start"},"ar":{"title":"ما الذي يحبطك في إدارة استثماراتك؟","description":"اختر ما ينطبق عليك — لا توجد إجابات خاطئة.","choice:spreadsheets":"📝 التتبع عبر جداول البيانات أو الملاحظات","choice:scattered_apps":"📱 بياناتي متفرقة بين تطبيقات الوسطاء","choice:privacy_concerns":"🔒 التطبيقات الأخرى تطلب صلاحيات كثيرة لبياناتي","choice:compliance_unclear":"❓ غير متأكد أي استثماراتي متوافقة مع الشريعة","choice:jargon":"😵 التقارير المالية مليئة بمصطلحات معقدة","choice:no_unified_view":"🧩 لا يوجد عرض موحد لكل ما أملكه","choice:dont_know_start":"🌱 أنا مبتدئ ولا أعرف من أين أبدأ"}}'
);

-- Screen 4: Personalised Solution
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-004',
  'informative',
  'solution',
  'https://raw.githubusercontent.com/pshah123/undraw-illustrations/master/svg/security_on_6e8f.svg',
  '[]',
  3,
  1,
  1,
  '{"en":{"title":"Laak was built for exactly this","description":"→ One private place for all your holdings; across every broker, every asset class\n\n→ AI that explains your portfolio in plain language; no jargon, no confusion\n\n→ Your data stays on your phone; no cloud accounts, no bank logins, no tracking\n\n→ Compliance screening built in; tap any holding to see its status instantly"},"ar":{"title":"لاك صُمم لهذا بالضبط","description":"→ مكان واحد خاص لكل استثماراتك; عبر كل وسيط وكل نوع أصول\n\n→ ذكاء اصطناعي يشرح محفظتك بلغة بسيطة; بدون مصطلحات معقدة\n\n→ بياناتك تبقى على هاتفك; بدون حسابات سحابية أو ربط بنكي أو تتبع\n\n→ فحص التوافق الشرعي مدمج; اضغط على أي سهم لترى حالته فوراً"}}'
);

-- Screen 5: Country Selection
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-005',
  'single_choice',
  'country',
  '',
  '[{"value":"EG"},{"value":"SA"},{"value":"US"},{"value":"OTHER"}]',
  4,
  1,
  0,
  '{"en":{"title":"Where do you invest?","description":"We''ll set your currency and available markets.","choice:EG":"🇪🇬 Egypt (EGP)","choice:SA":"🇸🇦 Saudi Arabia (SAR)","choice:US":"🇺🇸 United States (USD)","choice:OTHER":"🌍 Other"},"ar":{"title":"أين تستثمر؟","description":"سنضبط العملة والأسواق المتاحة لك.","choice:EG":"🇪🇬 مصر (جنيه مصري)","choice:SA":"🇸🇦 السعودية (ريال سعودي)","choice:US":"🇺🇸 الولايات المتحدة (دولار أمريكي)","choice:OTHER":"🌍 أخرى"}}'
);

-- Screen 6: Experience Level
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-006',
  'single_choice',
  'experience',
  '',
  '[{"value":"beginner"},{"value":"intermediate"},{"value":"advanced"}]',
  5,
  1,
  0,
  '{"en":{"title":"How would you describe your investing experience?","description":"No judgment — this helps us show you the right content.","choice:beginner":"🌱 Just getting started","choice:intermediate":"📊 I have some experience","choice:advanced":"🎯 Experienced investor"},"ar":{"title":"كيف تصف خبرتك في الاستثمار؟","description":"بدون أحكام — هذا يساعدنا في عرض المحتوى المناسب لك.","choice:beginner":"🌱 بدأت للتو","choice:intermediate":"📊 لدي بعض الخبرة","choice:advanced":"🎯 مستثمر ذو خبرة"}}'
);

-- Screen 7: Investment Style
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-007',
  'single_choice',
  'investment_style',
  '',
  '[{"value":"conservative"},{"value":"balanced"},{"value":"growth"}]',
  6,
  1,
  0,
  '{"en":{"title":"Which best describes your approach?","description":"We''ll suggest a portfolio allocation to get you started.","choice:conservative":"🛡️ Play it safe — protect what I have","choice:balanced":"⚖️ Balance between safety and growth","choice:growth":"🚀 Go for growth — I can handle the ups and downs"},"ar":{"title":"أيهما يصف أسلوبك الأفضل؟","description":"سنقترح توزيع محفظة ليساعدك في البداية.","choice:conservative":"🛡️ الأمان أولاً — حماية ما أملك","choice:balanced":"⚖️ توازن بين الأمان والنمو","choice:growth":"🚀 أريد النمو — أتحمل التقلبات"}}'
);

-- Screen 8: Check Frequency
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-008',
  'single_choice',
  'check_frequency',
  '',
  '[{"value":"daily"},{"value":"weekly"},{"value":"biweekly"},{"value":"monthly"}]',
  7,
  1,
  0,
  '{"en":{"title":"How often do you check your investments?","description":"We''ll tune alerts so they''re helpful, not noisy.","choice:daily":"📅 Every day","choice:weekly":"📆 A few times a week","choice:biweekly":"🗓️ Every couple of weeks","choice:monthly":"📋 Once a month or less"},"ar":{"title":"كم مرة تتابع استثماراتك؟","description":"سنضبط التنبيهات لتكون مفيدة وليست مزعجة.","choice:daily":"📅 كل يوم","choice:weekly":"📆 عدة مرات في الأسبوع","choice:biweekly":"🗓️ كل أسبوعين","choice:monthly":"📋 مرة في الشهر أو أقل"}}'
);

-- Screen 9: Ready
INSERT INTO onboarding_screens (id, type, slug, image_url, choices, "order", enabled, skippable, translations)
VALUES (
  'ob-009',
  'informative',
  'ready',
  'https://raw.githubusercontent.com/pshah123/undraw-illustrations/master/svg/savings_hjfl.svg',
  '[]',
  8,
  1,
  1,
  '{"en":{"title":"You''re all set","description":"Start by adding your first holding — just a name and how many shares you own. That''s it.\n\nYour portfolio is private, on-device, and yours alone."},"ar":{"title":"أنت جاهز","description":"ابدأ بإضافة أول استثمار — فقط الاسم وعدد الأسهم. هذا كل شيء.\n\nمحفظتك خاصة، على جهازك، وملكك وحدك."}}'
);
