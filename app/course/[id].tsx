
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Course } from '../../src/features/courses/courseTypes'
import { useCourseContext } from '../../src/features/courses/courseContext'

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { courses, toggleBookmark, enroll, enrolledIds } = useCourseContext()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    const found = courses.find((c) => c.id === String(id))
    if (found) {
      setCourse(found)
      setIsBookmarked(found.isBookmarked)
    }
    setIsEnrolled(enrolledIds.includes(String(id)))
    setLoading(false)
  }, [courses, enrolledIds, id])

  const handleBookmark = async () => {
    if (!course) return
    setIsBookmarked(!isBookmarked)
    await toggleBookmark(course.id)
  }

  const handleEnroll = async () => {
    if (!course) return
    if (isEnrolled) {
      router.push(`/course/webview?id=${course.id}`)
      return
    }
    try {
      setEnrolling(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await enroll(course.id)
      setIsEnrolled(true)
      Alert.alert(
        'Enrolled Successfully!',
        `You are now enrolled in ${course.title}`,
        [
          {
            text: 'Start Learning',
            onPress: () => router.push(`/course/webview?id=${course.id}`),
          },
          { text: 'Later' },
        ]
      )
    } catch {
      Alert.alert('Error', 'Enrollment failed. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    )
  }

  if (!course) {
    return (
      <View style={styles.centered}>
        <View style={styles.notFoundCircle}>
          <Ionicons name="alert-circle-outline" size={48} color="#6C63FF" />
        </View>
        <Text style={styles.errorTitle}>Course not found</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => router.back()}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        
        <View style={styles.heroWrapper}>
          <Image
            source={{ uri: course.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.heroBtn, isBookmarked && styles.heroBtnActive]}
              onPress={handleBookmark}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? '#6C63FF' : '#fff'}
              />
            </TouchableOpacity>
          </View>

         
          <View style={styles.heroCategoryBadge}>
            <Text style={styles.heroCategoryText}>{course.category}</Text>
          </View>
        </View>

       
        <View style={styles.content}>

          {/* Title + price */}
          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceBadge}>
              <Ionicons name="pricetag" size={14} color="#6C63FF" />
              <Text style={styles.priceText}>${course.price}</Text>
            </View>
            <View style={styles.freeBadge}>
              <Ionicons name="checkmark-circle" size={13} color="#22C55E" />
              <Text style={styles.freeText}>FREE ACCESS</Text>
            </View>
          </View>

         
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color="#6C63FF" />
              <Text style={styles.statValue}>1,240</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color="#22C55E" />
              <Text style={styles.statValue}>12h</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="play-circle-outline" size={18} color="#F59E0B" />
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>

          {/* Instructor card */}
          <View style={styles.instructorCard}>
            <View style={styles.instructorLeft}>
              {course.instructor.picture ? (
                <Image
                  source={{ uri: course.instructor.picture }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {course.instructor.name.charAt(0)}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.instructorLabel}>Your Instructor</Text>
                <Text style={styles.instructorName}>{course.instructor.name}</Text>
                <Text style={styles.instructorEmail}>{course.instructor.email}</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#22C55E" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#6C63FF" />
              <Text style={styles.sectionTitle}>About this Course</Text>
            </View>
            <Text style={styles.description}>{course.description}</Text>
          </View>

          {/* What you'll learn */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb-outline" size={20} color="#6C63FF" />
              <Text style={styles.sectionTitle}>What you'll learn</Text>
            </View>
            <View style={styles.learnCard}>
              {[
                'Understand core concepts deeply',
                'Build real world projects',
                'Industry best practices',
                'Hands-on exercises and quizzes',
                'Certificate upon completion',
                'Lifetime access to content',
              ].map((item, i) => (
                <View key={i} style={styles.learnItem}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                  <Text style={styles.learnText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={20} color="#6C63FF" />
              <Text style={styles.sectionTitle}>Requirements</Text>
            </View>
            <View style={styles.requireCard}>
              {[
                'Basic understanding of the subject',
                'A device with internet connection',
                'Willingness to learn',
              ].map((item, i) => (
                <View key={i} style={styles.requireItem}>
                  <View style={styles.requireDot} />
                  <Text style={styles.requireText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>

      {/* ── Sticky bottom enroll button ── */}
      <View style={styles.stickyBottom}>
        <View style={styles.stickyLeft}>
          <Text style={styles.stickyPrice}>${course.price}</Text>
          <Text style={styles.stickyFree}>Free access</Text>
        </View>
        <TouchableOpacity
          style={[styles.enrollButton, isEnrolled && styles.enrolledButton]}
          onPress={handleEnroll}
          disabled={enrolling}
          activeOpacity={0.85}
        >
          {enrolling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.enrollInner}>
              <Ionicons
                name={isEnrolled ? 'play-circle' : 'school-outline'}
                size={20}
                color="#fff"
              />
              <Text style={styles.enrollText}>
                {isEnrolled ? 'Continue Learning' : 'Enroll Now — Free'}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F6FB',
  },
  notFoundCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  goBackBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackText: { color: '#fff', fontWeight: '700' },

 
  heroWrapper: {
    position: 'relative',
    height: 280,
  },
  thumbnail: {
    width: '100%',
    height: 280,
    backgroundColor: '#EEF0FF',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  heroActions: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBtnActive: {
    backgroundColor: '#fff',
  },
  heroCategoryBadge: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    backgroundColor: 'rgba(108,99,255,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroCategoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  content: {
    padding: 20,
    paddingBottom: 130,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 30,
    marginBottom: 12,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: '#6C63FF',
    fontWeight: '700',
    fontSize: 15,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

 
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0F0F8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

 
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  instructorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  instructorLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
    fontWeight: '500',
  },
  instructorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  instructorEmail: {
    fontSize: 12,
    color: '#888',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  verifiedText: {
    fontSize: 11,
    color: '#22C55E',
    fontWeight: '700',
  },

 
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },

  // ── Learn card ──
  learnCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  learnText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },


  requireCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  requireItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requireDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
    flexShrink: 0,
  },
  requireText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    fontWeight: '500',
  },

  
  stickyBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F8',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  stickyLeft: { flex: 1 },
  stickyPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6C63FF',
  },
  stickyFree: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  enrollButton: {
    flex: 2,
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enrolledButton: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
  },
  enrollInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enrollText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
})