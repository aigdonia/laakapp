#!/usr/bin/env node

/**
 * Generate the Apple client_secret JWT for Supabase Apple Sign-In.
 *
 * Apple requires this secret to be rotated every 6 months.
 * Paste the output JWT into Supabase Dashboard → Authentication → Providers → Apple → Secret Key.
 *
 * Usage:
 *   node scripts/generate-apple-secret.mjs
 *
 * Requires: npm install -g jsonwebtoken (or npx)
 */

import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const privateKey = readFileSync(join(__dirname, 'key.p8'))

const teamId = 'G4J4BXKZVA'
const keyId = 'RZAS3873K9'
const clientId = 'tech.olanai.finapp'

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId,
})

const expiryDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

console.log('\n=== Apple Client Secret (JWT) ===\n')
console.log(token)
console.log(`\nExpires: ${expiryDate}`)
console.log('Paste this into Supabase Dashboard → Authentication → Providers → Apple → Secret Key\n')
