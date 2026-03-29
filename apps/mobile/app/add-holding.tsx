import { useState, useEffect, useRef } from 'react'
import { Alert, useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import type { Stock } from '@fin-ai/shared'

import { TypeSelector, HoldingForm } from '@/src/components/add-holding'
import { useAddTransaction } from '@/src/hooks/use-add-transaction'
import type { AssetType, TransactionDraft } from '@/src/types/holdings'
import { createEmptyDraft } from '@/src/types/holdings'
import { track } from '@/src/lib/analytics'

type Step = 'select' | 'form'

export default function AddHoldingModal() {
  const isDark = useColorScheme() === 'dark'
  const { t } = useTranslation('errors')
  const params = useLocalSearchParams<{
    holdingKey?: string
    assetType?: string
    prefill?: string
  }>()

  // When coming from holding detail ("Add Transaction" mode)
  const isAddToExisting = !!params.holdingKey
  const prefillData = params.prefill ? JSON.parse(params.prefill) : null

  const [step, setStep] = useState<Step>(isAddToExisting ? 'form' : 'select')
  const [draft, setDraft] = useState<TransactionDraft>(() => {
    if (isAddToExisting && params.assetType && prefillData) {
      return {
        ...createEmptyDraft(params.assetType as AssetType),
        ...prefillData,
      }
    }
    return createEmptyDraft('stock')
  })
  const addTransaction = useAddTransaction()

  // Track modal open
  const tracked = useRef(false)
  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      track('holding_add_started', {
        is_existing_holding: isAddToExisting,
        asset_type: isAddToExisting ? params.assetType : undefined,
      })
    }
  }, [])

  const handleSelectType = (type: AssetType, stock?: Stock) => {
    track('asset_type_selected', { asset_type: type, has_stock: !!stock })
    const newDraft = createEmptyDraft(type)
    if (stock) {
      newDraft.symbol = stock.symbol
      newDraft.name = stock.name
      newDraft.exchange = stock.exchange
    }
    setDraft(newDraft)
    setStep('form')
  }

  const handleBack = () => {
    if (isAddToExisting) {
      router.back()
      return
    }
    setStep('select')
    setDraft(createEmptyDraft('stock'))
  }

  const handleSave = async () => {
    try {
      await addTransaction.mutateAsync(draft)
      track('transaction_saved', {
        asset_type: draft.assetType,
        transaction_type: draft.transactionType,
        currency: draft.currency,
        is_new_holding: !isAddToExisting,
      })
      router.back()
    } catch {
      Alert.alert(t('common:error'), t('save_failed'))
    }
  }

  return (
    <>
      {step === 'select' ? (
        <TypeSelector onSelect={handleSelectType} />
      ) : (
        <HoldingForm
          draft={draft}
          onChange={setDraft}
          onBack={handleBack}
          onSave={handleSave}
          saving={addTransaction.isPending}
          lockedFields={isAddToExisting}
        />
      )}
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  )
}
