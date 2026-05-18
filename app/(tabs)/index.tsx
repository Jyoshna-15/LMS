

// import { useState, useCallback, useMemo, memo } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   RefreshControl,
//   StyleSheet,
// } from 'react-native'
// import { LegendList } from '@legendapp/list'
// import { useRouter } from 'expo-router'
// import { useCourseContext } from '../../src/features/courses/courseContext'
// import { Course } from '../../src/features/courses/courseTypes'
// import { useNetworkStatus } from '../../src/shared/hooks/useNetworkStatus'
// import OfflineBanner from '../../src/shared/components/OfflineBanner'

// // ─── Memoized course card ─────────────────────────────────────────────────────
// // Wrapped in memo() so it only re-renders when its own props change,
// // not when other cards in the list toggle their bookmark state.

// interface CourseCardProps {
//   item: Course
//   onPress: (id: string) => void
//   onBookmark: (id: string) => void
// }

// const CourseCard = memo(({ item, onPress, onBookmark }: CourseCardProps) => (
//   <TouchableOpacity
//     style={styles.card}
//     onPress={() => onPress(item.id)}
//     activeOpacity={0.85}
//   >
//     {item.thumbnail ? (
//       <Image
//         source={{ uri: item.thumbnail }}
//         style={styles.thumbnail}
//         resizeMode="cover"
//       />
//     ) : (
//       <View style={styles.thumbnailPlaceholder}>
//         <Text style={styles.placeholderText}>No Image</Text>
//       </View>
//     )}

//     <View style={styles.cardBody}>
//       <View style={styles.cardHeader}>
//         <Text style={styles.category}>{item.category}</Text>
//         <TouchableOpacity
//           onPress={() => onBookmark(item.id)}
//           hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//         >
//           <Text style={styles.bookmark}>
//             {item.isBookmarked ? '❤️' : '🤍'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title} numberOfLines={2}>
//         {item.title}
//       </Text>
//       <Text style={styles.description} numberOfLines={2}>
//         {item.description}
//       </Text>

//       <View style={styles.instructorRow}>
//         {item.instructor.picture ? (
//           <Image
//             source={{ uri: item.instructor.picture }}
//             style={styles.avatar}
//           />
//         ) : null}
//         <Text style={styles.instructorName}>{item.instructor.name}</Text>
//         <Text style={styles.price}>${item.price}</Text>
//       </View>
//     </View>
//   </TouchableOpacity>
// ))

// // ─── Home screen ──────────────────────────────────────────────────────────────

// export default function HomeScreen() {
//   const router = useRouter()
//   const { isConnected } = useNetworkStatus()
//   const { courses, loading, error, refreshing, onRefresh, toggleBookmark } =
//     useCourseContext()
//   const [searchQuery, setSearchQuery] = useState('')

//   // useMemo — only recomputes when courses or searchQuery changes
//   const filteredCourses = useMemo(() => {
//     const q = searchQuery.toLowerCase()
//     if (!q) return courses
//     return courses.filter(
//       (c) =>
//         (c.title ?? '').toLowerCase().includes(q) ||
//         (c.description ?? '').toLowerCase().includes(q)
//     )
//   }, [courses, searchQuery])

//   // useCallback — stable references so CourseCard memo() works correctly
//   const handlePress = useCallback(
//     (id: string) => router.push(`/course/${id}`),
//     [router]
//   )

//   const handleBookmark = useCallback(
//     (id: string) => toggleBookmark(id),
//     [toggleBookmark]
//   )

//   const renderItem = useCallback(
//     ({ item }: { item: Course }) => (
//       <CourseCard
//         item={item}
//         onPress={handlePress}
//         onBookmark={handleBookmark}
//       />
//     ),
//     [handlePress, handleBookmark]
//   )

//   const keyExtractor = useCallback((item: Course) => item.id, [])

//   if (loading && courses.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//         <Text style={styles.loadingText}>Loading courses...</Text>
//       </View>
//     )
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
//           <Text style={styles.retryText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       {!isConnected && <OfflineBanner />}

//       <LegendList
//         data={filteredCourses}
//         keyExtractor={keyExtractor}
//         renderItem={renderItem}
//         estimatedItemSize={260}
//         recycleItems
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#6C63FF"
//           />
//         }
//         ListHeaderComponent={
//           <View>
//             <Text style={styles.heading}>Courses</Text>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search courses..."
//               placeholderTextColor="#aaa"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//         }
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No courses found</Text>
//         }
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 56,
//     paddingBottom: 24,
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 15,
//     borderWidth: 1,
//     borderColor: '#eee',
//     marginBottom: 16,
//     color: '#1a1a1a',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   thumbnail: {
//     width: '100%',
//     height: 160,
//     backgroundColor: '#eee',
//   },
//   thumbnailPlaceholder: {
//     width: '100%',
//     height: 160,
//     backgroundColor: '#eee',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: '#999',
//   },
//   cardBody: {
//     padding: 14,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   category: {
//     fontSize: 12,
//     color: '#6C63FF',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
//   bookmark: {
//     fontSize: 20,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 13,
//     color: '#666',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   instructorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   avatar: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: '#eee',
//   },
//   instructorName: {
//     fontSize: 13,
//     color: '#444',
//     flex: 1,
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#6C63FF',
//   },
//   loadingText: {
//     marginTop: 12,
//     color: '#666',
//   },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 15,
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   retryButton: {
//     backgroundColor: '#6C63FF',
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   emptyText: {
//     textAlign: 'center',
//     color: '#999',
//     marginTop: 40,
//   },
// })



import { useState, useCallback, useMemo, memo } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LegendList } from '@legendapp/list'
import { useRouter } from 'expo-router'
import { useCourseContext } from '../../src/features/courses/courseContext'
import { Course } from '../../src/features/courses/courseTypes'
import { useNetworkStatus } from '../../src/shared/hooks/useNetworkStatus'
import OfflineBanner from '../../src/shared/components/OfflineBanner'

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44

// ─── Memoized course card ─────────────────────────────────────────────────────

interface CourseCardProps {
  item: Course
  onPress: (id: string) => void
  onBookmark: (id: string) => void
}

const CourseCard = memo(({ item, onPress, onBookmark }: CourseCardProps) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(item.id)}
    activeOpacity={0.88}
  >
    {/* Thumbnail */}
    {item.thumbnail ? (
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.thumbnailPlaceholder}>
        <Ionicons name="image-outline" size={32} color="#C4C9E2" />
      </View>
    )}

    {/* Category badge overlay on image */}
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryText}>{item.category}</Text>
    </View>

    {/* Card body */}
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <TouchableOpacity
          onPress={() => onBookmark(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.bookmarkBtn, item.isBookmarked && styles.bookmarkBtnActive]}
        >
          <Ionicons
            name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={item.isBookmarked ? '#6C63FF' : '#B0B3C6'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Footer row */}
      <View style={styles.cardFooter}>
        <View style={styles.instructorRow}>
          {item.instructor.picture ? (
            <Image
              source={{ uri: item.instructor.picture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {item.instructor.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.instructorName} numberOfLines={1}>
            {item.instructor.name}
          </Text>
        </View>

        <View style={styles.priceBadge}>
          <Ionicons name="pricetag" size={12} color="#6C63FF" />
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
))

// ─── Home screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter()
  const { isConnected } = useNetworkStatus()
  const { courses, loading, error, refreshing, onRefresh, toggleBookmark } =
    useCourseContext()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase()
    if (!q) return courses
    return courses.filter(
      (c) =>
        (c.title ?? '').toLowerCase().includes(q) ||
        (c.description ?? '').toLowerCase().includes(q)
    )
  }, [courses, searchQuery])

  const handlePress = useCallback(
    (id: string) => router.push(`/course/${id}`),
    [router]
  )

  const handleBookmark = useCallback(
    (id: string) => toggleBookmark(id),
    [toggleBookmark]
  )

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <CourseCard item={item} onPress={handlePress} onBookmark={handleBookmark} />
    ),
    [handlePress, handleBookmark]
  )

  const keyExtractor = useCallback((item: Course) => item.id, [])

  if (loading && courses.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorCircle}>
          <Ionicons name="alert-circle-outline" size={44} color="#6C63FF" />
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={16} color="#fff" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      {!isConnected && <OfflineBanner />}

      <LegendList
        data={filteredCourses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={280}
        recycleItems
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C63FF"
            colors={['#6C63FF']}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Greeting row */}
            <View style={styles.greetingRow}>
              <View>
                <Text style={styles.greetingLabel}>Welcome back 👋</Text>
                <Text style={styles.heading}>Explore Courses</Text>
              </View>
              <View style={styles.headerIconBtn}>
                <Ionicons name="options-outline" size={22} color="#6C63FF" />
              </View>
            </View>

            {/* Stats strip */}
            {/* <View style={styles.statsStrip}>
              <View style={styles.stripItem}>
                <Ionicons name="book-outline" size={15} color="#6C63FF" />
                <Text style={styles.stripValue}>{courses.length}</Text>
                <Text style={styles.stripLabel}>Courses</Text>
              </View>
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Ionicons name="bookmark-outline" size={15} color="#F59E0B" />
                <Text style={styles.stripValue}>
                  {courses.filter((c) => c.isBookmarked).length}
                </Text>
                <Text style={styles.stripLabel}>Saved</Text>
              </View>
              <View style={styles.stripDivider} />
              <View style={styles.stripItem}>
                <Ionicons name="search-outline" size={15} color="#22C55E" />
                <Text style={styles.stripValue}>{filteredCourses.length}</Text>
                <Text style={styles.stripLabel}>Results</Text>
              </View>
            </View> */}

            {/* Search input */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={18} color="#B0B3C6" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                placeholderTextColor="#B0B3C6"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color="#B0B3C6" />
                </TouchableOpacity>
              )}
            </View>

            {/* Section label */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>
                {searchQuery ? `Results for "${searchQuery}"` : 'All Courses'}
              </Text>
              <Text style={styles.sectionCount}>{filteredCourses.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCircle}>
              <Ionicons name="search-outline" size={36} color="#C4C9E2" />
            </View>
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptyText}>
              Try a different search term or clear the filter.
            </Text>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearBtnText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F4F6FB',
  },

  // ── Error ──
  errorCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  errorText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },

  // ── List ──
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // ── Header ──
  header: {
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Stats strip ──
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stripItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  stripDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F8',
  },
  stripValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  stripLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  // ── Search ──
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 0,
  },

  // ── Section label ──
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  // ── Course card ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 168,
    backgroundColor: '#EEF0FF',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 168,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Category badge overlaid on thumbnail
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(108,99,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  cardBody: { padding: 14 },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  bookmarkBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F4F6FB',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  bookmarkBtnActive: {
    backgroundColor: '#EEF0FF',
  },

  description: {
    fontSize: 13,
    color: '#777',
    lineHeight: 19,
    marginBottom: 14,
  },

  // ── Card footer ──
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F4F6FB',
    paddingTop: 12,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  instructorName: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
    flex: 1,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6C63FF',
  },

  // ── Empty state ──
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  clearBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  clearBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
})