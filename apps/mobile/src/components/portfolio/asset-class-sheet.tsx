import { forwardRef, useCallback } from 'react'
import { Text, View } from 'react-native'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet'

import { useThemeColors } from '@/src/theme/colors'
import type { HoldingGroup } from '@/src/hooks/use-holdings'
import { HoldingCard } from './holding-card'

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
}

type Props = {
  group: HoldingGroup | null
  amountsVisible: boolean
}

export const AssetClassSheet = forwardRef<BottomSheetModal, Props>(
  function AssetClassSheet({ group, amountsVisible }, ref) {
    const colors = useThemeColors()

    const handleHoldingPress = useCallback(
      (holdingKey: string) => {
        ;(ref as React.RefObject<BottomSheetModal | null>).current?.dismiss()
        router.push(`/holding/${encodeURIComponent(holdingKey)}`)
      },
      [ref],
    )

    if (!group) return null

    const color = group.assetClass?.color ?? '#636366'
    const name = group.assetClass?.name ?? group.type
    const count = group.holdings.length

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['60%', '90%']}
        backdropComponent={Backdrop}
        backgroundStyle={{ backgroundColor: colors.text === '#ffffff' ? '#1c1c1e' : '#ffffff' }}
        handleIndicatorStyle={{ backgroundColor: colors.muted }}
      >
        <BottomSheetScrollView className="px-4 pb-10 pt-2">
          <View className="flex-row items-center gap-2 px-1 mb-4">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <Text className="text-lg font-semibold text-text">{name}</Text>
            <Text className="text-sm text-muted">({count})</Text>
          </View>

          {group.holdings.map((holding) => (
            <HoldingCard
              key={holding.holdingKey}
              holding={holding}
              typeName={name}
              color={color}
              amountsVisible={amountsVisible}
              onPress={() => handleHoldingPress(holding.holdingKey)}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    )
  },
)
