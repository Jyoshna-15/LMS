import { createContext, useContext } from 'react'

export interface AuthUser {
  _id: string
  email: string
  username: string
  avatar: { url: string } | null
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  login: (token: string, user: AuthUser) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)