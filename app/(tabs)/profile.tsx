



// import { useEffect, useState } from 'react'
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from 'react-native'
// import * as ImagePicker from 'expo-image-picker'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { useAuth } from '../../src/features/auth/authStore'
// import { useCourseContext } from '../../src/features/courses/courseContext'

// const AVATAR_KEY = 'user_avatar'

// export default function ProfileScreen() {
//   const { logout, user } = useAuth()
//   const { courses, enrolledIds, clearUserData } = useCourseContext()
//   const [avatarUri, setAvatarUri] = useState<string | null>(null)
//   const [uploadingAvatar, setUploadingAvatar] = useState(false)

//   const displayName = user?.username ?? user?.email ?? 'Student'
//   const avatarInitial = displayName.charAt(0).toUpperCase()
//   const bookmarkedCount = courses.filter((c) => c.isBookmarked).length
//   const enrolledCount = enrolledIds.length
//   const totalCourses = courses.length

//   useEffect(() => {
//     AsyncStorage.getItem(AVATAR_KEY).then((uri) => {
//       if (uri) setAvatarUri(uri)
//     })
//   }, [])

//   const handlePickAvatar = async () => {
//     Alert.alert('Update Profile Picture', 'Choose a source', [
//       { text: 'Camera', onPress: () => pickImage('camera') },
//       { text: 'Photo Library', onPress: () => pickImage('library') },
//       { text: 'Cancel', style: 'cancel' },
//     ])
//   }

//   const pickImage = async (source: 'camera' | 'library') => {
//     try {
//       setUploadingAvatar(true)

//       if (source === 'camera') {
//         const { status } = await ImagePicker.requestCameraPermissionsAsync()
//         if (status !== 'granted') {
//           Alert.alert('Permission needed', 'Camera permission is required to take a photo.')
//           return
//         }
//       } else {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
//         if (status !== 'granted') {
//           Alert.alert('Permission needed', 'Photo library permission is required.')
//           return
//         }
//       }

//       const result = source === 'camera'
//         ? await ImagePicker.launchCameraAsync({
//             mediaTypes: ['images'],
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//           })
//         : await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'],
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//           })

//       if (!result.canceled && result.assets[0]) {
//         const uri = result.assets[0].uri
//         setAvatarUri(uri)
//         await AsyncStorage.setItem(AVATAR_KEY, uri)
//       }
//     } catch {
//       Alert.alert('Error', 'Failed to update profile picture.')
//     } finally {
//       setUploadingAvatar(false)
//     }
//   }

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to logout?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout',
//         style: 'destructive',
//         onPress: async () => {
//           await AsyncStorage.removeItem(AVATAR_KEY)
//           await clearUserData()
//           await logout()
//         },
//       },
//     ])
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.avatarSection}>
//         <TouchableOpacity
//           onPress={handlePickAvatar}
//           style={styles.avatarWrapper}
//           activeOpacity={0.8}
//         >
//           {uploadingAvatar ? (
//             <View style={styles.avatar}>
//               <ActivityIndicator color="#fff" />
//             </View>
//           ) : avatarUri ? (
//             <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
//           ) : (
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>{avatarInitial}</Text>
//             </View>
//           )}
//           <View style={styles.cameraIcon}>
//             <Text style={styles.cameraEmoji}>📷</Text>
//           </View>
//         </TouchableOpacity>

//         <Text style={styles.name}>{displayName}</Text>
//         <Text style={styles.subtitle}>{user?.email ?? 'MiniLMS Student'}</Text>
//         <Text style={styles.editHint}>Tap avatar to change photo</Text>
//       </View>

//       <View style={styles.statsRow}>
//         <View style={styles.statBox}>
//           <Text style={styles.statValue}>{totalCourses}</Text>
//           <Text style={styles.statLabel}>Available</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statBox}>
//           <Text style={styles.statValue}>{bookmarkedCount}</Text>
//           <Text style={styles.statLabel}>Bookmarked</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statBox}>
//           <Text style={styles.statValue}>{enrolledCount}</Text>
//           <Text style={styles.statLabel}>Enrolled</Text>
//         </View>
//       </View>

//       <View style={styles.menu}>
//         <View style={styles.menuItem}>
//           <Text style={styles.menuIcon}>📚</Text>
//           <Text style={styles.menuLabel}>My Courses</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </View>
//         <View style={styles.menuItem}>
//           <Text style={styles.menuIcon}>🔖</Text>
//           <Text style={styles.menuLabel}>Bookmarks</Text>
//           <Text style={styles.menuValue}>{bookmarkedCount}</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </View>
//         <View style={styles.menuItem}>
//           <Text style={styles.menuIcon}>🎓</Text>
//           <Text style={styles.menuLabel}>Enrolled</Text>
//           <Text style={styles.menuValue}>{enrolledCount}</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </View>
//         <View style={styles.menuItem}>
//           <Text style={styles.menuIcon}>⚙️</Text>
//           <Text style={styles.menuLabel}>Settings</Text>
//           <Text style={styles.menuArrow}>›</Text>
//         </View>
//       </View>

//       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingTop: 56,
//   },
//   avatarSection: {
//     alignItems: 'center',
//     paddingVertical: 24,
//     backgroundColor: '#fff',
//     marginBottom: 16,
//   },
//   avatarWrapper: {
//     position: 'relative',
//     marginBottom: 12,
//   },
//   avatar: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: '#6C63FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarImage: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 32,
//     fontWeight: '700',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     width: 26,
//     height: 26,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   cameraEmoji: {
//     fontSize: 14,
//   },
//   name: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   editHint: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   statsRow: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 20,
//     alignItems: 'center',
//   },
//   statBox: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statDivider: {
//     width: 1,
//     height: 40,
//     backgroundColor: '#eee',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#6C63FF',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#666',
//   },
//   menu: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     overflow: 'hidden',
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f5f5f5',
//     gap: 12,
//   },
//   menuIcon: { fontSize: 20 },
//   menuLabel: {
//     flex: 1,
//     fontSize: 15,
//     color: '#1a1a1a',
//   },
//   menuValue: {
//     fontSize: 14,
//     color: '#6C63FF',
//     fontWeight: '600',
//   },
//   menuArrow: {
//     fontSize: 20,
//     color: '#ccc',
//   },
//   logoutBtn: {
//     marginHorizontal: 16,
//     backgroundColor: '#fff',
//     borderRadius: 14,
//     padding: 16,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e74c3c',
//   },
//   logoutText: {
//     color: '#e74c3c',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// })




import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../src/features/auth/authStore'
import { useCourseContext } from '../../src/features/courses/courseContext'

const AVATAR_KEY = 'user_avatar'

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44

export default function ProfileScreen() {
  const { logout, user } = useAuth()
  const { courses, enrolledIds, clearUserData } = useCourseContext()
  const [avatarUri, setAvatarUri] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const displayName = user?.username ?? user?.email ?? 'Student'
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const bookmarkedCount = courses.filter((c) => c.isBookmarked).length
  const enrolledCount = enrolledIds.length
  const totalCourses = courses.length
  const progressPct = totalCourses > 0 ? Math.round((enrolledCount / totalCourses) * 100) : 0

  useEffect(() => {
    AsyncStorage.getItem(AVATAR_KEY).then((uri) => {
      if (uri) setAvatarUri(uri)
    })
  }, [])

  const handlePickAvatar = async () => {
    Alert.alert('Update Profile Picture', 'Choose a source', [
      { text: 'Camera', onPress: () => pickImage('camera') },
      { text: 'Photo Library', onPress: () => pickImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      setUploadingAvatar(true)
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required.')
          return
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required.')
          return
        }
      }
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri
        setAvatarUri(uri)
        await AsyncStorage.setItem(AVATAR_KEY, uri)
      }
    } catch {
      Alert.alert('Error', 'Failed to update profile picture.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(AVATAR_KEY)
          await clearUserData()
          await logout()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Purple header banner ── */}
        <View style={styles.headerBanner}>
          <Text style={styles.headerTitle}>My Profile</Text>

          {/* Avatar */}
          <TouchableOpacity
            onPress={handlePickAvatar}
            style={styles.avatarWrapper}
            activeOpacity={0.8}
          >
            {uploadingAvatar ? (
              <View style={styles.avatar}>
                <ActivityIndicator color="#fff" size="large" />
              </View>
            ) : avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarInitial}</Text>
              </View>
            )}
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={14} color="#6C63FF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.email ?? 'MiniLMS Student'}</Text>

          {/* Member badge */}
          <View style={styles.memberBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#6C63FF" />
            <Text style={styles.memberText}>MiniLMS Member</Text>
          </View>
        </View>

        {/* ── Stats cards ── */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#EEF0FF' }]}>
              <Ionicons name="book-outline" size={20} color="#6C63FF" />
            </View>
            <Text style={styles.statValue}>{totalCourses}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3E2' }]}>
              <Ionicons name="bookmark-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{bookmarkedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="school-outline" size={20} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{enrolledCount}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Learning Progress</Text>
            <Text style={styles.progressPct}>{progressPct}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {enrolledCount} of {totalCourses} courses enrolled
          </Text>
        </View>

        {/* ── Menu ── */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionLabel}>Account</Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#EEF0FF' }]}>
              <Ionicons name="person-outline" size={18} color="#6C63FF" />
            </View>
            <Text style={styles.menuLabel}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEF3E2' }]}>
              <Ionicons name="bookmark-outline" size={18} color="#F59E0B" />
            </View>
            <View style={styles.menuLabelWrap}>
              <Text style={styles.menuLabel}>Bookmarks</Text>
            </View>
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{bookmarkedCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="school-outline" size={18} color="#22C55E" />
            </View>
            <View style={styles.menuLabelWrap}>
              <Text style={styles.menuLabel}>My Courses</Text>
            </View>
            <View style={styles.menuBadge}>
              <Text style={styles.menuBadgeText}>{enrolledCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="notifications-outline" size={18} color="#6B7280" />
            </View>
            <Text style={styles.menuLabel}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="settings-outline" size={18} color="#6B7280" />
            </View>
            <Text style={styles.menuLabel}>Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* ── App info ── */}
        <View style={styles.menuCard}>
          <Text style={styles.menuSectionLabel}>About</Text>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={[styles.menuIconCircle, { backgroundColor: '#EEF0FF' }]}>
              <Ionicons name="information-circle-outline" size={18} color="#6C63FF" />
            </View>
            <Text style={styles.menuLabel}>App Version</Text>
            <Text style={styles.menuValueText}>1.0.0</Text>
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },

  // ── Header banner ──
  headerBanner: {
    backgroundColor: '#6C63FF',
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  memberText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
  },

  // ── Stats ──
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: -20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  // ── Progress ──
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  progressPct: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6C63FF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EEF0FF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#6C63FF',
    borderRadius: 4,
  },
  progressSub: {
    fontSize: 12,
    color: '#888',
  },

  // ── Menu ──
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  menuSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabelWrap: { flex: 1 },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  menuBadge: {
    backgroundColor: '#EEF0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
  },
  menuBadgeText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '700',
  },
  menuValueText: {
    fontSize: 13,
    color: '#888',
    marginRight: 4,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F4F6FB',
    marginLeft: 48,
  },

  // ── Logout ──
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '700',
  },
})