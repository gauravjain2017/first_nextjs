// pages/index.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('cars')
        .select('*')

      if (error) console.error('Supabase error:', error)
      else setData(data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Data from Supabase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
