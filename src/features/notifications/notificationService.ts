import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ─── Constants ────────────────────────────────────────────────────────────────

const LAST_OPEN_KEY = 'last_app_open'
const REMINDER_ID_KEY = 'reminder_notification_id'
const REMINDER_HOURS = 24
const BOOKMARK_MILESTONE = 5

// ─── Configure how notifications appear when app is foregrounded ──────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

// ─── Permission ───────────────────────────────────────────────────────────────

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true

    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  } catch {
    return false
  }
}

// ─── Bookmark milestone notification ─────────────────────────────────────────
// Fires immediately when user hits BOOKMARK_MILESTONE bookmarks

export const sendBookmarkNotification = async (count: number): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 You\'re on a roll!',
        body: `You've bookmarked ${count} courses. Keep exploring!`,
        data: { type: 'bookmark_milestone', count },
      },
      trigger: null, // null = fire immediately
    })
  } catch {
    // Silently fail — notifications are non-critical
  }
}

// ─── 24hr reminder notification ──────────────────────────────────────────────
// Cancels any existing reminder, records app open time,
// then schedules a new reminder 24hrs from now.

export const scheduleReminderNotification = async (): Promise<void> => {
  try {
    // Record this open time
    await AsyncStorage.setItem(LAST_OPEN_KEY, Date.now().toString())

    // Cancel existing reminder so we don't stack them
    const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY)
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId)
    }

    // Schedule a fresh reminder 24hrs from now
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Continue learning',
        body: 'You have bookmarked courses waiting for you. Pick up where you left off!',
        data: { type: 'reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: REMINDER_HOURS * 60 * 60,
        repeats: false,
      },
    })

    await AsyncStorage.setItem(REMINDER_ID_KEY, id)
  } catch {
    // Silently fail — notifications are non-critical
  }
}

// ─── Cancel reminder (call on app open to reset the 24hr window) ──────────────

export const cancelReminderNotification = async (): Promise<void> => {
  try {
    const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY)
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId)
      await AsyncStorage.removeItem(REMINDER_ID_KEY)
    }
  } catch {
    // Silently fail
  }
}