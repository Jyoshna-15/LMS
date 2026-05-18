import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Course } from './courseTypes'
import { fetchCourses } from './courseService'

const BOOKMARKS_KEY = 'bookmarked_courses'

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)

      // try loading from cache first
      const cached = await AsyncStorage.getItem('courses_cache')
      if (cached) {
        setCourses(JSON.parse(cached))
      }

      // fetch fresh data
      const data = await fetchCourses()

      // load saved bookmarks
      const savedBookmarks = await AsyncStorage.getItem(BOOKMARKS_KEY)
      const bookmarkIds: string[] = savedBookmarks
        ? JSON.parse(savedBookmarks)
        : []

      // merge bookmark state into courses
      const merged = data.map((course: Course) => ({
        ...course,
        isBookmarked: bookmarkIds.includes(course.id),
      }))

      setCourses(merged)
      await AsyncStorage.setItem('courses_cache', JSON.stringify(merged))
    } catch (err) {
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
    const updated = courses.map((course) =>
      course.id === courseId
        ? { ...course, isBookmarked: !course.isBookmarked }
        : course
    )
    setCourses(updated)

    // save bookmark ids to AsyncStorage
   const bookmarkedIds = updated
  .filter((c) => c.isBookmarked)
  .map((c) => c.id)
await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkedIds))

// trigger notification when 5+ courses bookmarked
if (bookmarkedIds.length >= 5) {
  const { sendBookmarkNotification } = await import(
    '../notifications/notificationService'
  )
  await sendBookmarkNotification(bookmarkedIds.length)
}
  }

  const filteredCourses = courses.filter(
  (course) =>
    (course.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description ?? '').toLowerCase().includes(searchQuery.toLowerCase())
)

  return {
    courses: filteredCourses,
    loading,
    error,
    refreshing,
    searchQuery,
    setSearchQuery,
    onRefresh,
    toggleBookmark,
  }
}