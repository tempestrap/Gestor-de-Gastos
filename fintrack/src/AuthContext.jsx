import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin } from './api'

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(()=>{
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  async function login(email, password){
    const data = await apiLogin(email, password)
    setUser({ ...data.user, token: data.token })
    return data
  }

  function logout(){
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}
