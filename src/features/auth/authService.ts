import client from '../../lib/api/client'
import { saveRefreshToken } from '../../lib/storage/secureStore'

interface RegisterData {
  email: string
  password: string
  username: string
}

interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  data: {
    accessToken: string
    refreshToken: string
    user: {
      _id: string
      email: string
      username: string
      avatar: { url: string } | null
    }
  }
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/api/v1/users/register', data)
  return response.data
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/api/v1/users/login', data)

  // Persist refresh token securely alongside the access token
  const refreshToken = response.data?.data?.refreshToken
  if (refreshToken) {
    await saveRefreshToken(refreshToken)
  }

  return response.data
}