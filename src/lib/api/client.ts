import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import {
  getToken,
  saveToken,
  getRefreshToken,
  clearAllTokens,
} from '../storage/secureStore'

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.freeapi.app'
const TIMEOUT_MS = 10_000
const MAX_RETRIES = 3
const RETRY_BASE_DELAY_MS = 500

// ─── Extend AxiosRequestConfig to track retry state ──────────────────────────

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retryCount?: number
  _isRetry?: boolean
}

// ─── Client ──────────────────────────────────────────────────────────────────

const client = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
})

// ─── Request interceptor — attach auth token ─────────────────────────────────

client.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// ─── Response interceptor — retry + token refresh ────────────────────────────

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const processRefreshQueue = (newToken: string) => {
  refreshQueue.forEach((resolve) => resolve(newToken))
  refreshQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig

    if (!originalRequest) return Promise.reject(error)

    const status = error.response?.status

    // ── 401: token expired — attempt refresh ─────────────────────────────────
    if (status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          refreshQueue.push((newToken: string) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            }
            resolve(client(originalRequest))
          })
        })
      }

      isRefreshing = true

      try {
        const refreshToken = await getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token available')

        const { data } = await axios.post(
          `${BASE_URL}/api/v1/users/refresh-token`,
          { refreshToken },
          { timeout: TIMEOUT_MS }
        )

        const newAccessToken: string = data.data.accessToken
        await saveToken(newAccessToken)
        processRefreshQueue(newAccessToken)

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        }

        return client(originalRequest)
      } catch {
        // Refresh failed — force logout by clearing all tokens
        refreshQueue = []
        await clearAllTokens()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // ── Retry on network errors or 5xx with exponential backoff ───────────────
    const retryCount = originalRequest._retryCount ?? 0
    const isNetworkError = !error.response
    const isServerError = status !== undefined && status >= 500

    if ((isNetworkError || isServerError) && retryCount < MAX_RETRIES) {
      originalRequest._retryCount = retryCount + 1

      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount)
      await new Promise((resolve) => setTimeout(resolve, delay))

      return client(originalRequest)
    }

    return Promise.reject(error)
  }
)

export default client