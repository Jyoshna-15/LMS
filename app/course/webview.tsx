// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { useEffect, useRef, useState } from 'react'
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native'
// import { WebView } from 'react-native-webview'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { Course } from '../../src/features/courses/courseTypes'
// import { useCourseContext } from '../../src/features/courses/courseContext'

// export default function WebViewScreen() {
//   const { id } = useLocalSearchParams()
//   const router = useRouter()
//   const { courses } = useCourseContext()
//   const webViewRef = useRef<WebView>(null)
//   const [course, setCourse] = useState<Course | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [webViewLoading, setWebViewLoading] = useState(true)
//   const [error, setError] = useState(false)
//   const [savedProgress, setSavedProgress] = useState<number[]>([])
//   const [isCompleted, setIsCompleted] = useState(false)  // ← added

//   useEffect(() => {
//     loadCourseAndProgress()
//   }, [id, courses])

//   useEffect(() => {
//     if (course && !webViewLoading) {
//       sendDataToWebView()
//     }
//   }, [course, webViewLoading, savedProgress, isCompleted])

//   // ← loads both progress AND completed state in one shot
//   const loadCourseAndProgress = async () => {
//     const found = courses.find((c) => c.id === String(id))
//     if (found) setCourse(found)

//     const progressKey = `progress_${id}`
//     const completedKey = `completed_${id}`

//     const [storedProgress, storedCompleted] = await Promise.all([
//       AsyncStorage.getItem(progressKey),
//       AsyncStorage.getItem(completedKey),
//     ])

//     const progress: number[] = storedProgress ? JSON.parse(storedProgress) : []
//     const completed = storedCompleted === 'true'

//     setSavedProgress(progress)
//     setIsCompleted(completed)
//     setLoading(false)
//   }

//   // ← reads from state, not AsyncStorage — no more stale reads
//   const sendDataToWebView = () => {
//     if (!course || !webViewRef.current) return
//     const script = `
//       window.dispatchEvent(new CustomEvent('courseLoaded', {
//         detail: ${JSON.stringify({
//           title: course.title,
//           description: course.description,
//           instructor: course.instructor.name,
//           price: course.price,
//           category: course.category,
//           savedProgress: savedProgress,
//           isCompleted: isCompleted,
//         })}
//       }));
//       true;
//     `
//     webViewRef.current.injectJavaScript(script)
//   }

//   const handleWebViewMessage = async (event: any) => {
//     try {
//       const message = JSON.parse(event.nativeEvent.data)

//       if (message.type === 'PROGRESS_UPDATE') {
//         const progressKey = `progress_${id}`
//         await AsyncStorage.setItem(progressKey, JSON.stringify(message.completed))
//         setSavedProgress(message.completed)
//       }

//       if (message.type === 'MARK_COMPLETE') {
//         const completedKey = `completed_${id}`
//         await AsyncStorage.setItem(completedKey, 'true')
//         setIsCompleted(true)  // ← updates state so re-open shows correct status
//         Alert.alert(
//           'Course Completed! 🎉',
//           `You have completed ${course?.title}`,
//           [
//             {
//               text: 'Back to Courses',
//               onPress: () => router.replace('/(tabs)'),
//             },
//           ]
//         )
//       }
//     } catch {
//       if (event.nativeEvent.data === 'MARK_COMPLETE') {
//         Alert.alert('Course Completed! 🎉', `You have completed ${course?.title}`, [
//           { text: 'Back to Courses', onPress: () => router.replace('/(tabs)') },
//         ])
//       }
//     }
//   }

//   const getHTML = () => `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body {
//           font-family: -apple-system, BlinkMacSystemFont, sans-serif;
//           background: #f5f5f5;
//           padding: 24px 20px;
//           color: #1a1a1a;
//         }
//         .loader { text-align: center; padding: 60px 0; color: #999; font-size: 16px; }
//         .card {
//           background: white;
//           border-radius: 16px;
//           padding: 24px;
//           margin-bottom: 16px;
//           box-shadow: 0 2px 8px rgba(0,0,0,0.06);
//         }
//         .badge {
//           display: inline-block;
//           background: #EEF0FF;
//           color: #6C63FF;
//           padding: 4px 12px;
//           border-radius: 20px;
//           font-size: 12px;
//           font-weight: 600;
//           text-transform: uppercase;
//           margin-bottom: 12px;
//         }
//         h1 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
//         .price { color: #6C63FF; font-size: 20px; font-weight: 700; margin-bottom: 16px; }
//         .instructor { color: #666; font-size: 14px; }
//         h2 { font-size: 16px; font-weight: 600; margin-bottom: 10px; }
//         p { color: #444; line-height: 1.6; font-size: 14px; }
//         .progress-bar {
//           background: #eee;
//           border-radius: 8px;
//           height: 8px;
//           margin: 12px 0;
//           overflow: hidden;
//         }
//         .progress-fill {
//           background: #6C63FF;
//           height: 100%;
//           width: 0%;
//           border-radius: 8px;
//           transition: width 0.5s ease;
//         }
//         .lesson {
//           display: flex;
//           align-items: center;
//           padding: 12px 0;
//           border-bottom: 1px solid #f0f0f0;
//           cursor: pointer;
//         }
//         .lesson:last-child { border-bottom: none; }
//         .lesson-num {
//           width: 32px;
//           height: 32px;
//           background: #EEF0FF;
//           color: #6C63FF;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 700;
//           font-size: 13px;
//           margin-right: 12px;
//           flex-shrink: 0;
//         }
//         .lesson-num.done { background: #2ecc71; color: white; }
//         .lesson-title { font-size: 14px; color: #333; flex: 1; }
//         .complete-btn {
//           background: #ccc;
//           color: white;
//           border: none;
//           padding: 16px;
//           border-radius: 14px;
//           font-size: 16px;
//           font-weight: 700;
//           width: 100%;
//           cursor: not-allowed;
//           margin-top: 8px;
//         }
//         .complete-btn:active { opacity: 0.8; }
//         .complete-btn.ready {
//           background: #6C63FF;
//           cursor: pointer;
//         }
//         .complete-btn.done {
//           background: #2ecc71;
//           cursor: not-allowed;
//         }
//         #content { display: none; }
//       </style>
//     </head>
//     <body>
//       <div class="loader" id="loader">Loading course content...</div>
//       <div id="content">
//         <div class="card">
//           <span class="badge" id="category">General</span>
//           <h1 id="title">Course Title</h1>
//           <div class="price" id="price">$0</div>
//           <div class="instructor" id="instructor">By Instructor</div>
//         </div>

//         <div class="card">
//           <h2>About this Course</h2>
//           <p id="description">Loading...</p>
//         </div>

//         <div class="card">
//           <h2>Your Progress</h2>
//           <div class="progress-bar">
//             <div class="progress-fill" id="progress"></div>
//           </div>
//           <p id="progress-text" style="font-size:13px;color:#666;">0% complete</p>
//         </div>

//         <div class="card">
//           <h2>Course Lessons</h2>
//           <div id="lessons"></div>
//         </div>

//         <div class="card">
//           <button class="complete-btn" id="complete-btn" onclick="markComplete()">
//             Mark as Complete ✓
//           </button>
//           <p id="btn-hint" style="text-align:center;color:#999;font-size:13px;margin-top:10px;">
//             Complete all lessons to mark as done
//           </p>
//         </div>
//       </div>

//       <script>
//         const lessons = [
//           'Introduction & Overview',
//           'Core Concepts Explained',
//           'Hands-on Practice',
//           'Advanced Techniques',
//           'Real World Project',
//           'Final Assessment',
//         ]

//         let completed = []
//         let isCompleted = false

//         function renderLessons() {
//           const container = document.getElementById('lessons')
//           container.innerHTML = lessons.map((l, i) => \`
//             <div class="lesson" onclick="toggleLesson(\${i})">
//               <div class="lesson-num \${completed.includes(i) ? 'done' : ''}">\${completed.includes(i) ? '✓' : i + 1}</div>
//               <div class="lesson-title">\${l}</div>
//             </div>
//           \`).join('')
//         }

//         function toggleLesson(i) {
//           if (isCompleted) return
//           if (completed.includes(i)) {
//             completed = completed.filter(x => x !== i)
//           } else {
//             completed.push(i)
//           }
//           updateProgress()
//           renderLessons()
//           updateButton()
//           window.ReactNativeWebView.postMessage(JSON.stringify({
//             type: 'PROGRESS_UPDATE',
//             completed: completed
//           }))
//         }

//         function updateProgress() {
//           const pct = Math.round((completed.length / lessons.length) * 100)
//           document.getElementById('progress').style.width = pct + '%'
//           document.getElementById('progress-text').textContent = pct + '% complete'
//         }

//         function updateButton() {
//           const btn = document.getElementById('complete-btn')
//           const hint = document.getElementById('btn-hint')
//           const allDone = completed.length === lessons.length

//           if (isCompleted) {
//             btn.textContent = 'Completed ✓'
//             btn.className = 'complete-btn done'
//             btn.disabled = true
//             hint.style.display = 'none'
//           } else if (allDone) {
//             btn.className = 'complete-btn ready'
//             btn.disabled = false
//             btn.textContent = 'Mark as Complete ✓'
//             hint.style.display = 'none'
//           } else {
//             btn.className = 'complete-btn'
//             btn.disabled = true
//             btn.textContent = 'Mark as Complete ✓'
//             hint.textContent = \`Complete \${lessons.length - completed.length} more lesson\${lessons.length - completed.length > 1 ? 's' : ''} to finish\`
//             hint.style.display = 'block'
//           }
//         }

//         function markComplete() {
//           if (completed.length < lessons.length || isCompleted) return
//           isCompleted = true
//           updateButton()
//           window.ReactNativeWebView.postMessage(JSON.stringify({
//             type: 'MARK_COMPLETE'
//           }))
//         }

//         window.addEventListener('courseLoaded', function(e) {
//           const data = e.detail
//           document.getElementById('loader').style.display = 'none'
//           document.getElementById('content').style.display = 'block'
//           document.getElementById('title').textContent = data.title
//           document.getElementById('price').textContent = '$' + data.price
//           document.getElementById('category').textContent = data.category
//           document.getElementById('instructor').textContent = 'By ' + data.instructor
//           document.getElementById('description').textContent = data.description

//           if (data.savedProgress && data.savedProgress.length > 0) {
//             completed = data.savedProgress
//           }

//           if (data.isCompleted) {
//             isCompleted = true
//           }

//           renderLessons()
//           setTimeout(() => {
//             updateProgress()
//             updateButton()
//           }, 300)
//         })
//       </script>
//     </body>
//     </html>
//   `

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#6C63FF" />
//       </View>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle} numberOfLines={1}>
//           {course?.title ?? 'Course Content'}
//         </Text>
//       </View>

//       <WebView
//         ref={webViewRef}
//         source={{ html: getHTML() }}
//         style={styles.webview}
//         onLoadEnd={() => {
//           setWebViewLoading(false)
//           setTimeout(sendDataToWebView, 300)
//         }}
//         onError={() => setError(true)}
//         onMessage={handleWebViewMessage}
//         javaScriptEnabled
//         domStorageEnabled
//       />

//       {webViewLoading && (
//         <View style={styles.webviewLoader}>
//           <ActivityIndicator size="large" color="#6C63FF" />
//         </View>
//       )}

//       {error && (
//         <View style={styles.centered}>
//           <Text style={styles.errorText}>Failed to load content</Text>
//           <TouchableOpacity onPress={() => setError(false)}>
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 52,
//     paddingBottom: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     gap: 12,
//   },
//   backBtn: { paddingVertical: 4 },
//   backText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
//   headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
//   webview: { flex: 1 },
//   webviewLoader: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   errorText: { color: '#e74c3c', fontSize: 15, marginBottom: 12 },
//   retryText: { color: '#6C63FF', fontSize: 15, fontWeight: '600' },
// })


import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Course } from '../../src/features/courses/courseTypes'
import { useCourseContext } from '../../src/features/courses/courseContext'

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44

export default function WebViewScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { courses } = useCourseContext()
  const webViewRef = useRef<WebView>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [webViewLoading, setWebViewLoading] = useState(true)
  const [error, setError] = useState(false)
  const [savedProgress, setSavedProgress] = useState<number[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loadCourseAndProgress()
  }, [id, courses])

  useEffect(() => {
    if (course && !webViewLoading) {
      sendDataToWebView()
    }
  }, [course, webViewLoading, savedProgress, isCompleted])

  const loadCourseAndProgress = async () => {
    const found = courses.find((c) => c.id === String(id))
    if (found) setCourse(found)

    const progressKey = `progress_${id}`
    const completedKey = `completed_${id}`

    const [storedProgress, storedCompleted] = await Promise.all([
      AsyncStorage.getItem(progressKey),
      AsyncStorage.getItem(completedKey),
    ])

    const progress: number[] = storedProgress ? JSON.parse(storedProgress) : []
    const completed = storedCompleted === 'true'

    setSavedProgress(progress)
    setIsCompleted(completed)
    setLoading(false)
  }

  const sendDataToWebView = () => {
    if (!course || !webViewRef.current) return
    const script = `
      window.dispatchEvent(new CustomEvent('courseLoaded', {
        detail: ${JSON.stringify({
          title: course.title,
          description: course.description,
          instructor: course.instructor.name,
          price: course.price,
          category: course.category,
          savedProgress: savedProgress,
          isCompleted: isCompleted,
        })}
      }));
      true;
    `
    webViewRef.current.injectJavaScript(script)
  }

  const handleWebViewMessage = async (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data)

      if (message.type === 'PROGRESS_UPDATE') {
        const progressKey = `progress_${id}`
        await AsyncStorage.setItem(progressKey, JSON.stringify(message.completed))
        setSavedProgress(message.completed)
      }

      if (message.type === 'MARK_COMPLETE') {
        const completedKey = `completed_${id}`
        await AsyncStorage.setItem(completedKey, 'true')
        setIsCompleted(true)
        Alert.alert(
          'Course Completed!',
          `You have completed ${course?.title}`,
          [
            {
              text: 'Back to Courses',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        )
      }
    } catch {
      if (event.nativeEvent.data === 'MARK_COMPLETE') {
        Alert.alert('Course Completed!', `You have completed ${course?.title}`, [
          { text: 'Back to Courses', onPress: () => router.replace('/(tabs)') },
        ])
      }
    }
  }

  const getHTML = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #F4F6FB;
          padding: 20px 16px;
          color: #1a1a1a;
        }
        .loader {
          text-align: center;
          padding: 80px 0;
          color: #888;
          font-size: 15px;
        }
        .spinner {
          display: inline-block;
          width: 32px;
          height: 32px;
          border: 3px solid #EEF0FF;
          border-top-color: #6C63FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 12px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card {
          background: white;
          border-radius: 18px;
          padding: 20px;
          margin-bottom: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #EEF0FF;
          color: #6C63FF;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        h1 {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 10px;
          line-height: 1.3;
          color: #1a1a1a;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .price-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #EEF0FF;
          color: #6C63FF;
          font-size: 14px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }
        .instructor-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #F4F6FB;
        }
        .avatar-sm {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          background: #6C63FF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .instructor-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }
        .instructor-label {
          font-size: 11px;
          color: #999;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .section-icon {
          width: 28px;
          height: 28px;
          background: #EEF0FF;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        p { color: #555; line-height: 1.65; font-size: 14px; }

        /* Progress */
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .progress-pct {
          font-size: 14px;
          font-weight: 700;
          color: #6C63FF;
        }
        .progress-bar {
          background: #EEF0FF;
          border-radius: 8px;
          height: 8px;
          overflow: hidden;
        }
        .progress-fill {
          background: linear-gradient(90deg, #6C63FF, #8B85FF);
          height: 100%;
          width: 0%;
          border-radius: 8px;
          transition: width 0.5s ease;
        }
        .progress-sub {
          font-size: 12px;
          color: #888;
          margin-top: 8px;
        }

        /* Lessons */
        .lesson {
          display: flex;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid #F4F6FB;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .lesson:last-child { border-bottom: none; }
        .lesson:active { opacity: 0.7; }
        .lesson-num {
          width: 34px;
          height: 34px;
          background: #EEF0FF;
          color: #6C63FF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          margin-right: 14px;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .lesson-num.done {
          background: #DCFCE7;
          color: #22C55E;
        }
        .lesson-info { flex: 1 }
        .lesson-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
        }
        .lesson-sub {
          font-size: 12px;
          color: #999;
          margin-top: 2px;
        }
        .lesson-check {
          font-size: 16px;
          color: #22C55E;
          margin-left: 8px;
        }

        /* Button */
        .complete-btn {
          background: #ccc;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          width: 100%;
          cursor: not-allowed;
          transition: background 0.3s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .complete-btn.ready {
          background: linear-gradient(135deg, #6C63FF, #8B85FF);
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(108,99,255,0.35);
        }
        .complete-btn.ready:active { transform: scale(0.98); }
        .complete-btn.done {
          background: #22C55E;
          cursor: not-allowed;
          box-shadow: 0 4px 14px rgba(34,197,94,0.3);
        }
        .btn-hint {
          text-align: center;
          color: #aaa;
          font-size: 12px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        #content { display: none; }
      </style>
    </head>
    <body>
      <div class="loader" id="loader">
        <div class="spinner"></div>
        <div>Loading course content...</div>
      </div>

      <div id="content">
        <!-- Course header card -->
        <div class="card">
          <span class="badge" id="category">General</span>
          <h1 id="title">Course Title</h1>
          <div class="meta-row">
            <span class="price-tag" id="price">$0</span>
          </div>
          <div class="instructor-row">
            <div class="avatar-sm" id="avatar-initial">?</div>
            <div>
              <div class="instructor-label">Instructor</div>
              <div class="instructor-name" id="instructor">—</div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="card">
          <div class="section-title">
            <div class="section-icon">📖</div>
            About this Course
          </div>
          <p id="description">Loading...</p>
        </div>

        <!-- Progress -->
        <div class="card">
          <div class="progress-header">
            <div class="section-title" style="margin-bottom:0">
              <div class="section-icon">📊</div>
              Your Progress
            </div>
            <div class="progress-pct" id="progress-pct">0%</div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
          </div>
          <div class="progress-sub" id="progress-text">0 of 6 lessons completed</div>
        </div>

        <!-- Lessons -->
        <div class="card">
          <div class="section-title">
            <div class="section-icon">🎓</div>
            Course Lessons
          </div>
          <div id="lessons"></div>
        </div>

        <!-- Complete button -->
        <div class="card">
          <button class="complete-btn" id="complete-btn" onclick="markComplete()">
            Mark as Complete
          </button>
          <div class="btn-hint" id="btn-hint">
            ⬆ Complete all lessons to unlock
          </div>
        </div>

        <div style="height: 20px"></div>
      </div>

      <script>
        const lessons = [
          { title: 'Introduction & Overview', sub: '~15 min' },
          { title: 'Core Concepts Explained', sub: '~25 min' },
          { title: 'Hands-on Practice', sub: '~30 min' },
          { title: 'Advanced Techniques', sub: '~35 min' },
          { title: 'Real World Project', sub: '~40 min' },
          { title: 'Final Assessment', sub: '~20 min' },
        ]

        let completed = []
        let isCompleted = false

        function renderLessons() {
          const container = document.getElementById('lessons')
          container.innerHTML = lessons.map((l, i) => {
            const done = completed.includes(i)
            return \`
              <div class="lesson" onclick="toggleLesson(\${i})">
                <div class="lesson-num \${done ? 'done' : ''}">\${done ? '✓' : i + 1}</div>
                <div class="lesson-info">
                  <div class="lesson-title">\${l.title}</div>
                  <div class="lesson-sub">\${l.sub}</div>
                </div>
                \${done ? '<span class="lesson-check">✓</span>' : ''}
              </div>
            \`
          }).join('')
        }

        function toggleLesson(i) {
          if (isCompleted) return
          if (completed.includes(i)) {
            completed = completed.filter(x => x !== i)
          } else {
            completed.push(i)
          }
          updateProgress()
          renderLessons()
          updateButton()
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'PROGRESS_UPDATE',
            completed: completed
          }))
        }

        function updateProgress() {
          const pct = Math.round((completed.length / lessons.length) * 100)
          document.getElementById('progress').style.width = pct + '%'
          document.getElementById('progress-pct').textContent = pct + '%'
          document.getElementById('progress-text').textContent =
            completed.length + ' of ' + lessons.length + ' lessons completed'
        }

        function updateButton() {
          const btn = document.getElementById('complete-btn')
          const hint = document.getElementById('btn-hint')
          const allDone = completed.length === lessons.length

          if (isCompleted) {
            btn.innerHTML = '🎉 Course Completed!'
            btn.className = 'complete-btn done'
            btn.disabled = true
            hint.style.display = 'none'
          } else if (allDone) {
            btn.innerHTML = '🏁 Mark as Complete'
            btn.className = 'complete-btn ready'
            btn.disabled = false
            hint.style.display = 'none'
          } else {
            const remaining = lessons.length - completed.length
            btn.innerHTML = 'Mark as Complete'
            btn.className = 'complete-btn'
            btn.disabled = true
            hint.style.display = 'flex'
            hint.innerHTML = '⬆ Complete ' + remaining + ' more lesson' + (remaining > 1 ? 's' : '') + ' to unlock'
          }
        }

        function markComplete() {
          if (completed.length < lessons.length || isCompleted) return
          isCompleted = true
          updateButton()
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARK_COMPLETE' }))
        }

        window.addEventListener('courseLoaded', function(e) {
          const data = e.detail
          document.getElementById('loader').style.display = 'none'
          document.getElementById('content').style.display = 'block'
          document.getElementById('title').textContent = data.title
          document.getElementById('price').textContent = '\$' + data.price
          document.getElementById('category').textContent = data.category
          document.getElementById('instructor').textContent = data.instructor
          document.getElementById('avatar-initial').textContent = data.instructor.charAt(0).toUpperCase()
          document.getElementById('description').textContent = data.description

          if (data.savedProgress && data.savedProgress.length > 0) {
            completed = data.savedProgress
          }
          if (data.isCompleted) {
            isCompleted = true
          }

          renderLessons()
          setTimeout(() => {
            updateProgress()
            updateButton()
          }, 300)
        })
      </script>
    </body>
    </html>
  `

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <View style={styles.backCircle}>
            <Ionicons name="arrow-back" size={20} color="#6C63FF" />
          </View>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {course?.title ?? 'Course Content'}
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {course?.category ?? ''}
          </Text>
        </View>

        {isCompleted && (
          <View style={styles.completedPill}>
            <Ionicons name="checkmark-circle" size={13} color="#22C55E" />
            <Text style={styles.completedText}>Done</Text>
          </View>
        )}
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: getHTML() }}
        style={styles.webview}
        onLoadEnd={() => {
          setWebViewLoading(false)
          setTimeout(sendDataToWebView, 300)
        }}
        onError={() => setError(true)}
        onMessage={handleWebViewMessage}
        javaScriptEnabled
        domStorageEnabled
      />

      {webViewLoading && (
        <View style={styles.webviewLoader}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.webviewLoaderText}>Loading course...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorCircle}>
            <Ionicons name="wifi-outline" size={40} color="#6C63FF" />
          </View>
          <Text style={styles.errorTitle}>Failed to load content</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setError(false)}
          >
            <Ionicons name="refresh-outline" size={16} color="#fff" />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FB' },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUSBAR_HEIGHT + 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F8',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backBtn: { flexShrink: 0 },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSub: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    marginTop: 1,
  },
  completedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    flexShrink: 0,
  },
  completedText: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '700',
  },

  webview: { flex: 1 },

  webviewLoader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    gap: 12,
  },
  webviewLoaderText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },

  // ── Error state ──
  errorContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    padding: 32,
  },
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
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  retryBtn: {
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
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
})