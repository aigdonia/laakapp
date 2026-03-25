import { Text, TextInput, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { FieldConfig } from '@fin-ai/shared'
import type { Stock } from '@fin-ai/shared'
import { SegmentControl } from './segment-control'
import { SearchableField } from './searchable-field'

type Props = {
  config: FieldConfig
  value: string
  onChange: (value: string) => void
  onStockSelect?: (stock: Stock) => void
  disabled?: boolean
}

export function FormField({ config, value, onChange, onStockSelect, disabled }: Props) {
  const { t } = useTranslation('add_holding')

  // Lookup types render as segment pills (options resolved by HoldingForm)
  if (config.type.startsWith('lookup:') && config.options) {
    return (
      <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
        <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-text">
          {config.label}
        </Text>
        <SegmentControl
          options={config.options}
          value={value}
          onChange={disabled ? () => {} : onChange}
        />
      </View>
    )
  }

  // Stock/ETF types render as searchable picker
  if (config.type === 'stock' || config.type === 'etf') {
    return (
      <SearchableField
        config={config}
        value={value}
        onChange={onChange}
        onStockSelect={onStockSelect}
        disabled={disabled}
        filterSector={config.type === 'etf' ? 'etf' : undefined}
      />
    )
  }

  // Manual segment with inline options
  if (config.type === 'segment' && config.options) {
    return (
      <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
        <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-text">
          {config.label}
        </Text>
        <SegmentControl
          options={config.options}
          value={value}
          onChange={disabled ? () => {} : onChange}
        />
      </View>
    )
  }

  if (config.type === 'date') {
    return (
      <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
        <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-text">
          {config.label}
        </Text>
        <TextInput
          className="rounded-xl px-3.5 py-3 text-base bg-input text-text"
          placeholderTextColorClassName="text-subtle"
          value={value}
          onChangeText={onChange}
          placeholder={t('date_placeholder')}
          editable={!disabled}
        />
      </View>
    )
  }

  return (
    <View className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
      <Text className="text-xs font-semibold mb-1.5 uppercase tracking-wider text-text">
        {config.label}
      </Text>
      <TextInput
        className="rounded-xl px-3.5 py-3 text-base bg-input text-text"
        placeholderTextColorClassName="text-subtle"
        value={value}
        onChangeText={onChange}
        placeholder={config.placeholder}
        keyboardType={config.type === 'number' ? 'decimal-pad' : 'default'}
        editable={!disabled}
      />
    </View>
  )
}
