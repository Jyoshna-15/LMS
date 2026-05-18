

import { useEffect, useState } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { AuthContext, AuthUser } from '../src/features/auth/authStore'
import { getToken, saveToken, saveUser, getUser, clearAllTokens } from '../src/lib/storage/secureStore'
import { CourseProvider } from '../src/features/courses/courseContext'
import { ErrorBoundary } from '../src/shared/components/ErrorBoundary'

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    checkToken()
    setupNotifications()
  }, [])

  const checkToken = async () => {
    try {
      const token = await getToken()
      if (token) {
        const savedUser = await getUser()
        if (savedUser) setUser(savedUser as AuthUser)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const setupNotifications = async () => {
    try {
      const {
        requestNotificationPermission,
        cancelReminderNotification,
        scheduleReminderNotification,
      } = await import('../src/features/notifications/notificationService')

      const granted = await requestNotificationPermission()
      if (granted) {
        // Cancel old reminder and start a fresh 24hr countdown
        await cancelReminderNotification()
        await scheduleReminderNotification()
      }
    } catch {
      // Notifications not available in Expo Go — silently skip
    }
  }

  useEffect(() => {
    if (isLoading) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, isLoading])

  const login = async (token: string, authUser: AuthUser) => {
    await saveToken(token)
    await saveUser(authUser)
    setUser(authUser)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await clearAllTokens()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <ErrorBoundary fallbackTitle="App Error">
      <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
        <CourseProvider>
          <ErrorBoundary fallbackTitle="Screen Error">
            <Slot />
          </ErrorBoundary>
        </CourseProvider>
      </AuthContext.Provider>
    </ErrorBoundary>
  )
}