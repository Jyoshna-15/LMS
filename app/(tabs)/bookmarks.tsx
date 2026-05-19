



import { useCallback, useMemo, memo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native'
import { LegendList } from '@legendapp/list'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCourseContext } from '../../src/features/courses/courseContext'
import { Course } from '../../src/features/courses/courseTypes'



interface BookmarkCardProps {
  item: Course
  onPress: (id: string) => void
  onRemove: (id: string) => void
}

const BookmarkCard = memo(({ item, onPress, onRemove }: BookmarkCardProps) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(item.id)}
    activeOpacity={0.92}
  >
    {/* Thumbnail */}
    <View style={styles.thumbnailWrapper}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
    </View>

    {/* Body */}
    <View style={styles.cardBody}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => onRemove(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.removeBtn}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.instructorRow}>
        <Ionicons name="person-outline" size={12} color="#888" />
        <Text style={styles.instructor} numberOfLines={1}>
          {item.instructor.name}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
        <View style={styles.viewRow}>
          <Text style={styles.continueText}>View</Text>
          <Ionicons name="arrow-forward" size={13} color="#6C63FF" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
))



export default function BookmarksScreen() {
  const router = useRouter()
  const { courses, toggleBookmark } = useCourseContext()

  const bookmarked = useMemo(
    () => courses.filter((c) => c.isBookmarked),
    [courses]
  )

  const handlePress = useCallback(
    (id: string) => router.push(`/course/${id}`),
    [router]
  )

  const handleRemove = useCallback(
    (id: string) => toggleBookmark(id),
    [toggleBookmark]
  )

  const renderItem = useCallback(
    ({ item }: { item: Course }) => (
      <BookmarkCard item={item} onPress={handlePress} onRemove={handleRemove} />
    ),
    [handlePress, handleRemove]
  )

  const keyExtractor = useCallback((item: Course) => item.id, [])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      {bookmarked.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={44} color="#6C63FF" />
          </View>
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the bookmark icon on any course to save it here for later
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.85}
          >
            <Text style={styles.browseBtnText}>Browse Courses</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <LegendList
          data={bookmarked}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={130}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <View>
                <Text style={styles.heading}>Bookmarks</Text>
                <Text style={styles.subHeading}>{bookmarked.length} saved course{bookmarked.length !== 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.countBadge}>
                <Ionicons name="bookmark" size={14} color="#fff" />
                <Text style={styles.countText}>{bookmarked.length}</Text>
              </View>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  )
}

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 32,
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  subHeading: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
  countBadge: {
    backgroundColor: '#6C63FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailWrapper: {
    position: 'relative',
    width: 120,
  },
  thumbnail: {
    width: 120,
    height: 130,
    backgroundColor: '#EEF0FF',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(108,99,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 20,
  },
  removeBtn: { padding: 2 },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  instructor: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBadge: {
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceText: {
    color: '#6C63FF',
    fontWeight: '700',
    fontSize: 13,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  continueText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
  },


  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
})