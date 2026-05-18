



// import { useState } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
// } from 'react-native'
// import { useRouter } from 'expo-router'
// import { useAuth } from '../../src/features/auth/authStore'
// import { loginUser } from '../../src/features/auth/authService'
// import { loginSchema, getZodErrors } from '../../src/features/auth/authSchemas'

// type FieldErrors = Partial<Record<'email' | 'password', string>>

// export default function LoginScreen() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
//   const [apiError, setApiError] = useState<string | null>(null)
//   const { login } = useAuth()
//   const router = useRouter()

//   const handleEmailChange = (val: string) => {
//     setEmail(val)
//     if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }))
//     setApiError(null)
//   }

//   const handlePasswordChange = (val: string) => {
//     setPassword(val)
//     if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }))
//     setApiError(null)
//   }

//   const handleLogin = async () => {
//     const result = loginSchema.safeParse({ email, password })
//     if (!result.success) {
//       setFieldErrors(getZodErrors(result.error) as FieldErrors)
//       return
//     }
//     try {
//       setLoading(true)
//       setFieldErrors({})
//       setApiError(null)
//       const response = await loginUser(result.data)
//       const token = response.data.accessToken
//       const user = response.data.user
//       await login(token, user)
//     } catch (error: unknown) {
//       const msg =
//         error instanceof Error &&
//         'response' in error &&
//         (error as { response?: { data?: { message?: string } } }).response?.data?.message
//           ? (error as { response: { data: { message: string } } }).response.data.message
//           : 'Login failed. Please try again.'
//       setApiError(msg)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <KeyboardAvoidingView
//       style={styles.flex}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
//       <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Top illustration area */}
//         <View style={styles.topSection}>
//           <View style={styles.logoCircle}>
//             <Text style={styles.logoEmoji}>🎓</Text>
//           </View>
//           <Text style={styles.appName}>MiniLMS</Text>
//           <Text style={styles.tagline}>Learn anything, anytime</Text>
//         </View>

//         {/* Card */}
//         <View style={styles.card}>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to continue learning</Text>

//           {/* Email field */}
//           <View style={styles.fieldWrap}>
//             <Text style={styles.fieldLabel}>Email</Text>
//             <View style={[styles.inputWrapper, fieldErrors.email ? styles.inputWrapperError : null]}>
//               <Text style={styles.fieldIcon}>✉️</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="you@example.com"
//                 placeholderTextColor="#bbb"
//                 value={email}
//                 onChangeText={handleEmailChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </View>
//             {fieldErrors.email ? (
//               <Text style={styles.errorText}>⚠ {fieldErrors.email}</Text>
//             ) : null}
//           </View>

//           {/* Password field */}
//           <View style={styles.fieldWrap}>
//             <Text style={styles.fieldLabel}>Password</Text>
//             <View style={[styles.inputWrapper, fieldErrors.password ? styles.inputWrapperError : null]}>
//               <Text style={styles.fieldIcon}>🔒</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Your password"
//                 placeholderTextColor="#bbb"
//                 value={password}
//                 onChangeText={handlePasswordChange}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
//               </TouchableOpacity>
//             </View>
//             {fieldErrors.password ? (
//               <Text style={styles.errorText}>⚠ {fieldErrors.password}</Text>
//             ) : null}
//           </View>

//           {/* API error */}
//           {apiError ? (
//             <View style={styles.apiBanner}>
//               <Text style={styles.apiBannerIcon}>⚠️</Text>
//               <Text style={styles.apiBannerText}>{apiError}</Text>
//             </View>
//           ) : null}

//           {/* Login button */}
//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//             activeOpacity={0.85}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Sign In →</Text>
//             )}
//           </TouchableOpacity>

//           {/* Divider */}
//           <View style={styles.divider}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>or</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           {/* Register link */}
//           <TouchableOpacity
//             style={styles.registerBtn}
//             onPress={() => router.push('/(auth)/register')}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.registerText}>
//               Don't have an account?{' '}
//               <Text style={styles.registerLink}>Create one</Text>
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Footer */}
//         <Text style={styles.footer}>
//           By signing in, you agree to our Terms & Privacy Policy
//         </Text>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   flex: { flex: 1, backgroundColor: '#F4F6FB' },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     paddingBottom: 32,
//   },

//   // ── Top section ──
//   topSection: {
//     alignItems: 'center',
//     marginBottom: 32,
//   },
//   logoCircle: {
//     width: 80,
//     height: 80,
//     borderRadius: 24,
//     backgroundColor: '#6C63FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.35,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   logoEmoji: { fontSize: 36 },
//   appName: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: '#1a1a1a',
//     letterSpacing: 0.5,
//     marginBottom: 4,
//   },
//   tagline: { fontSize: 14, color: '#888' },

//   // ── Card ──
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 24,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 16,
//     elevation: 4,
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#888',
//     marginBottom: 24,
//   },

//   // ── Fields ──
//   fieldWrap: { marginBottom: 16 },
//   fieldLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#444',
//     marginBottom: 8,
//     marginLeft: 2,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F4F6FB',
//     borderRadius: 14,
//     borderWidth: 1.5,
//     borderColor: '#E8ECF4',
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     gap: 10,
//   },
//   inputWrapperError: {
//     borderColor: '#e74c3c',
//     backgroundColor: '#fff5f5',
//   },
//   fieldIcon: { fontSize: 16 },
//   input: {
//     flex: 1,
//     fontSize: 15,
//     color: '#1a1a1a',
//     padding: 0,
//   },
//   eyeIcon: { fontSize: 16 },
//   errorText: {
//     color: '#e74c3c',
//     fontSize: 12,
//     marginTop: 6,
//     marginLeft: 4,
//   },

//   // ── API error ──
//   apiBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff5f5',
//     borderWidth: 1,
//     borderColor: '#e74c3c',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//     gap: 8,
//   },
//   apiBannerIcon: { fontSize: 16 },
//   apiBannerText: { color: '#e74c3c', fontSize: 13, flex: 1 },

//   // ── Button ──
//   button: {
//     backgroundColor: '#6C63FF',
//     padding: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginBottom: 20,
//     shadowColor: '#6C63FF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonDisabled: { opacity: 0.7 },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: 0.3,
//   },

//   // ── Divider ──
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     gap: 12,
//   },
//   dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
//   dividerText: { fontSize: 13, color: '#bbb', fontWeight: '500' },

//   // ── Register ──
//   registerBtn: { alignItems: 'center' },
//   registerText: { fontSize: 14, color: '#888' },
//   registerLink: { color: '#6C63FF', fontWeight: '700' },

//   // ── Footer ──
//   footer: {
//     textAlign: 'center',
//     fontSize: 11,
//     color: '#bbb',
//     lineHeight: 18,
//   },
// })


import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/features/auth/authStore'
import { loginUser } from '../../src/features/auth/authService'
import { loginSchema, getZodErrors } from '../../src/features/auth/authSchemas'

type FieldErrors = Partial<Record<'email' | 'password', string>>

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleEmailChange = (val: string) => {
    setEmail(val)
    if (fieldErrors.email) setFieldErrors((e) => ({ ...e, email: undefined }))
    setApiError(null)
  }

  const handlePasswordChange = (val: string) => {
    setPassword(val)
    if (fieldErrors.password) setFieldErrors((e) => ({ ...e, password: undefined }))
    setApiError(null)
  }

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      setFieldErrors(getZodErrors(result.error) as FieldErrors)
      return
    }
    try {
      setLoading(true)
      setFieldErrors({})
      setApiError(null)
      const response = await loginUser(result.data)
      const token = response.data.accessToken
      const user = response.data.user
      await login(token, user)
    } catch (error: unknown) {
      const msg =
        error instanceof Error &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Login failed. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top section ── */}
        <View style={styles.topSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={38} color="#fff" />
          </View>
          <Text style={styles.appName}>MiniLMS</Text>
          <Text style={styles.tagline}>Learn anything, anytime</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue learning</Text>

          {/* Email field */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputWrapper, fieldErrors.email ? styles.inputWrapperError : null]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={fieldErrors.email ? '#e74c3c' : '#B0B3C6'}
              />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#C4C9E2"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {email.includes('@') && !fieldErrors.email ? (
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
              ) : null}
            </View>
            {fieldErrors.email ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color="#e74c3c" />
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              </View>
            ) : null}
          </View>

          {/* Password field */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={[styles.inputWrapper, fieldErrors.password ? styles.inputWrapperError : null]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={fieldErrors.password ? '#e74c3c' : '#B0B3C6'}
              />
              <TextInput
                style={styles.input}
                placeholder="Your password"
                placeholderTextColor="#C4C9E2"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#B0B3C6"
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color="#e74c3c" />
                <Text style={styles.errorText}>{fieldErrors.password}</Text>
              </View>
            ) : null}
          </View>

          {/* API error banner */}
          {apiError ? (
            <View style={styles.apiBanner}>
              <Ionicons name="warning-outline" size={18} color="#e74c3c" />
              <Text style={styles.apiBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Login button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register link */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerLink}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#C4C9E2" />
          <Text style={styles.footer}>
            By signing in, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F4F6FB' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },

  // ── Top section ──
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: { fontSize: 14, color: '#888', fontWeight: '500' },

  // ── Card ──
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    fontWeight: '500',
  },

  // ── Fields ──
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6FB',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8ECF4',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  inputWrapperError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: '500',
  },

  // ── API error ──
  apiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  apiBannerText: { color: '#e74c3c', fontSize: 13, flex: 1, fontWeight: '500' },

  // ── Button ──
  button: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Divider ──
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F0F8' },
  dividerText: { fontSize: 13, color: '#C4C9E2', fontWeight: '600' },

  // ── Register link ──
  registerBtn: { alignItems: 'center' },
  registerText: { fontSize: 14, color: '#888' },
  registerLink: { color: '#6C63FF', fontWeight: '700' },

  // ── Footer ──
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  footer: {
    fontSize: 11,
    color: '#C4C9E2',
    lineHeight: 18,
  },
})