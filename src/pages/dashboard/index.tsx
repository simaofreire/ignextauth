import useAuth from '@/context/AuthContext'
import React from 'react'

function Dashboard() {
  const { user } = useAuth()
  return (
    <div>Dashboard {user?.email}</div>
  )
}

export default Dashboard