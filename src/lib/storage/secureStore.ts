import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY)
}

export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export const saveRefreshToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)
}

export const getRefreshToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export const deleteRefreshToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}

export const saveUser = async (user: object): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user))
}

export const getUser = async (): Promise<object | null> => {
  const data = await SecureStore.getItemAsync(USER_KEY)
  return data ? JSON.parse(data) : null
}

export const clearAllTokens = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ])
}