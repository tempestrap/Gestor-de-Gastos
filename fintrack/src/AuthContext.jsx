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
    try {
      const data = await apiLogin(email, password)
      setUser({ ...data.user, token: data.token })
      return data
    } catch (err) {
      console.error('Auth login error', err)
      // Normalize error so UI can display a message
      const msg = err?.response?.data?.message || err?.message || 'Error al iniciar sesión'
      throw new Error(msg)
    }
  }

  function logout(){
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}
