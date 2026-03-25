import { Redirect } from 'expo-router'

// This screen is never shown — the tab button navigates to the add-holding modal.
// This file exists only because expo-router tabs require a file per tab.
export default function AddPlaceholder() {
  return <Redirect href="/" />
}
