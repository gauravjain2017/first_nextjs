import { supabase } from '@/lib/supabaseClient'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' })
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
      // Ignore "No rows found" error (code: PGRST116)
      console.error('Error checking user:', fetchError)
      return res.status(500).json({ error: 'Error checking existing user.' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const { error: insertError } = await supabase.from('users').insert([
      {
        name,
        email,
        password: hashedPassword
      }
    ])

    if (insertError) {
      console.error('Error inserting user:', insertError)
      return res.status(500).json({ error: 'Error creating user.' })
    }

    return res.status(200).json({ message: 'Registration successful!' })
  } catch (err) {
    console.error('Unexpected error:', err)
    res.status(500).json({ error: 'Something went wrong.' })
  }
}
