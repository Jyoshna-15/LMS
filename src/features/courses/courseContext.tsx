import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Course } from './courseTypes'
import { fetchCourses } from './courseService'

const BOOKMARKS_KEY = 'bookmarked_courses'
const ENROLLED_KEY = 'enrolled_courses'
const BOOKMARK_MILESTONE = 5
const MILESTONE_NOTIFIED_KEY = 'bookmark_milestone_notified'

interface CourseContextType {
  courses: Course[]
  loading: boolean
  error: string | null
  refreshing: boolean
  enrolledIds: string[]
  toggleBookmark: (id: string) => Promise<void>
  enroll: (id: string) => Promise<void>
  onRefresh: () => Promise<void>
  clearUserData: () => Promise<void>
}

const CourseContext = createContext<CourseContextType>({
  courses: [],
  loading: true,
  error: null,
  refreshing: false,
  enrolledIds: [],
  toggleBookmark: async () => {},
  enroll: async () => {},
  onRefresh: async () => {},
  clearUserData: async () => {},
})

export const useCourseContext = () => useContext(CourseContext)

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])

  useEffect(() => {
    loadCourses()
    loadEnrolled()
  }, [])

  const loadEnrolled = async () => {
    const stored = await AsyncStorage.getItem(ENROLLED_KEY)
    if (stored) setEnrolledIds(JSON.parse(stored))
  }

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      const cached = await AsyncStorage.getItem('courses_cache')
      if (cached) setCourses(JSON.parse(cached))

      const data = await fetchCourses()
      const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY)
      const bookmarkIds: string[] = savedBookmarks
        ? JSON.parse(savedBookmarks)
        : []

      const merged = data.map((course: Course) => ({
        ...course,
        isBookmarked: bookmarkIds.includes(course.id),
      }))

      setCourses(merged)
      await AsyncStorage.setItem('courses_cache', JSON.stringify(merged))
    } catch {
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadCourses()
    setRefreshing(false)
  }

  const toggleBookmark = async (courseId: string) => {
    const updated = courses.map((c) =>
      c.id === courseId ? { ...c, isBookmarked: !c.isBookmarked } : c
    )
    setCourses(updated)

    const bookmarkedIds = updated.filter((c) => c.isBookmarked).map((c) => c.id)
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds))
    await AsyncStorage.setItem('courses_cache', JSON.stringify(updated))

    // ✅ Fixed: correct function name + fires at exactly BOOKMARK_MILESTONE
    const bookmarkCount = bookmarkedIds.length
    if (bookmarkCount === BOOKMARK_MILESTONE) {
      const { sendBookmarkMilestoneNotification } = await import('../notifications/notificationService')
      await sendBookmarkMilestoneNotification(bookmarkCount)
    }
  }

  const enroll = async (courseId: string) => {
    const updated = [...enrolledIds, courseId]
    setEnrolledIds(updated)
    await AsyncStorage.setItem(ENROLLED_KEY, JSON.stringify(updated))
  }

  // ✅ Fixed: also clears milestone notification flag on logout
  const clearUserData = async () => {
    const allKeys = await AsyncStorage.getAllKeys()
    const userKeys = allKeys.filter(
      (k) => k.startsWith('progress_') || k.startsWith('completed_')
    )
    await AsyncStorage.multiRemove([
      BOOKMARKS_KEY,
      ENROLLED_KEY,
      'courses_cache',
      MILESTONE_NOTIFIED_KEY,
      ...userKeys,
    ])
    setEnrolledIds([])
    setCourses((prev) => prev.map((c) => ({ ...c, isBookmarked: false })))
  }

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        refreshing,
        enrolledIds,
        toggleBookmark,
        enroll,
        onRefresh,
        clearUserData,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}