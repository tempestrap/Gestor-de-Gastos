import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  async function onSubmit(e){
    e.preventDefault()
    try{
      await login(email, password)
      nav('/')
    }catch(err){
      setError(err.message || err.response?.data?.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Left Side - Image */}
      <div style={{
        flex: '0 0 45%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #aeccf3ff 0%, #aeccf3ff 100%)'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <img 
            src="/src/assets/login-image.png" 
            alt="Financial growth" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: '0 0 55%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: 'white'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px'
        }}>
          {/* Logo and Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%)',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{flexShrink: 0}}>
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" fill="white"/>
                  <path d="M12 7v5l4 2" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: '0.5px'
                }}>FINTRACK</span>
              </div>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px'
            }}>FINTRACK</h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
              letterSpacing: '0.3px'
            }}>CONTROLA TU DINERO, ALCANZA TUS METAS</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ width: '100%' }}>
            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                color: '#c33',
                fontSize: '14px',
                marginBottom: '24px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>Contraseña</label>
              <input
                type="password"
                placeholder="Minimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              INICIAR SESIÓN
            </button>

            <button
              type="button"
              onClick={() => nav('/register')}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#333',
                background: 'linear-gradient(135deg, #ffd54f 0%, #ffca28 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              REGISTRARSE
            </button>

            <div style={{
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <a href="#" style={{
                fontSize: '13px',
                color: '#666',
                textDecoration: 'underline',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#d4af37'}
              onMouseOut={(e) => e.target.style.color = '#666'}
              >
                Olvidaste la contraseña?
              </a>
            </div>

            {/* Social Login */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button
                type="button"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#333'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>

              <button
                type="button"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#1877f2'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              <button
                type="button"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '1px solid #ddd',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#4285f4'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
