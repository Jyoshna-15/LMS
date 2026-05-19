import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LAST_OPEN_KEY = 'last_app_open'
const REMINDER_ID_KEY = 'reminder_notification_id'
const REMINDER_HOURS = 24
export const BOOKMARK_MILESTONE = 5
export const MILESTONE_NOTIFIED_KEY = 'bookmark_milestone_notified'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

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

// ✅ Now has: permission check + milestone gate + one-time flag
export const sendBookmarkMilestoneNotification = async (
  count: number
): Promise<void> => {
  try {
    // Check if we already sent this milestone notification
    const alreadyNotified = await AsyncStorage.getItem(MILESTONE_NOTIFIED_KEY)
    if (alreadyNotified) return

    const hasPermission = await requestNotificationPermission()
    if (!hasPermission) return

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎉 You're on a roll!",
        body: `You've bookmarked ${count} courses. Keep exploring!`,
        data: { type: 'bookmark_milestone', count },
      },
      trigger: null, // fire immediately
    })

    // Mark as notified so it never fires again
    await AsyncStorage.setItem(MILESTONE_NOTIFIED_KEY, 'true')
  } catch {
    // Silently fail — notifications are non-critical
  }
}

export const scheduleReminderNotification = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_OPEN_KEY, Date.now().toString())

    // Cancel any existing reminder before scheduling a fresh one
    const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY)
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId)
    }

    const hasPermission = await requestNotificationPermission()
    if (!hasPermission) return

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📚 Continue learning',
        body: 'You have bookmarked courses waiting. Pick up where you left off!',
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