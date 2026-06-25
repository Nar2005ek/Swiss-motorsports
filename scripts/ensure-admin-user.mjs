/**
 * Ensures an admin Supabase Auth user exists, is email-confirmed, and has admin metadata.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/ensure-admin-user.mjs [email] [password]
 *
 * Defaults: swiss.motorsports@gmail.com
 */

import { createClient } from "@supabase/supabase-js"

const email = (process.argv[2] ?? "swiss.motorsports@gmail.com").trim().toLowerCase()
const password = process.argv[3]

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
  )
  process.exit(1)
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function findUserByEmail(targetEmail) {
  let page = 1
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail)
    if (match) return match
    if (data.users.length < 200) return null
    page += 1
  }
}

try {
  const existing = await findUserByEmail(email)

  if (existing) {
    const updates = {
      email_confirm: true,
      user_metadata: { ...existing.user_metadata, role: "admin" },
    }
    if (password) updates.password = password

    const { data, error } = await admin.auth.admin.updateUserById(existing.id, updates)
    if (error) throw error
    console.log(`Updated admin user: ${data.user.email} (confirmed, role=admin)`)
  } else {
    if (!password) {
      console.error("User not found. Pass a password as the second argument to create the account.")
      process.exit(1)
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    })
    if (error) throw error
    console.log(`Created admin user: ${data.user.email} (confirmed, role=admin)`)
  }
} catch (err) {
  console.error("Failed to ensure admin user:", err.message ?? err)
  process.exit(1)
}
