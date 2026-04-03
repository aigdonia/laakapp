import { createRef, forwardRef, useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { IconSchool } from '@tabler/icons-react-native'

import { useThemeColors } from '@/src/theme/colors'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

type LessonData = {
  title: string
  body: string
}

let pendingLesson: LessonData | null = null

/** Show micro lesson bottom sheet from anywhere */
export function showMicroLesson(data: LessonData) {
  pendingLesson = data
  microLessonSheetRef.current?.present()
}

export const microLessonSheetRef = createRef<BottomSheetModal>()

export const MicroLessonSheet = forwardRef<BottomSheetModal>(
  function MicroLessonSheet(_, ref) {
    const colors = useThemeColors()
    const [lesson, setLesson] = useState<LessonData | null>(null)

    useEffect(() => {
      // Pick up pending lesson when sheet mounts/presents
      if (pendingLesson) {
        setLesson(pendingLesson)
        pendingLesson = null
      }
    })

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['90%']}
        backdropComponent={Backdrop}
        backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
        onChange={(index) => {
          if (index === 0 && pendingLesson) {
            setLesson(pendingLesson)
            pendingLesson = null
          }
        }}
      >
        <BottomSheetScrollView className="px-5 pb-10 pt-2">
          <View className="flex-row items-center gap-2 mb-5">
            <IconSchool size={24} color={colors.accent} />
            <Text className="text-xl font-bold text-text">
              {lesson?.title ?? 'Quick Lesson'}
            </Text>
          </View>
          <Text className="text-lg text-text leading-8 text-justify">
            {lesson?.body ?? ''}
          </Text>
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)
