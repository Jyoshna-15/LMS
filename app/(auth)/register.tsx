
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
import { registerUser, loginUser } from '../../src/features/auth/authService'
import { registerSchema, getZodErrors } from '../../src/features/auth/authSchemas'

type FieldErrors = Partial<Record<'username' | 'email' | 'password', string>>

export default function RegisterScreen() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()

  const handleUsernameChange = (val: string) => {
    setUsername(val)
    if (fieldErrors.username) setFieldErrors((e) => ({ ...e, username: undefined }))
    setApiError(null)
  }

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

  const handleRegister = async () => {
    const result = registerSchema.safeParse({ username, email, password })
    if (!result.success) {
      setFieldErrors(getZodErrors(result.error) as FieldErrors)
      return
    }
    try {
      setLoading(true)
      setFieldErrors({})
      setApiError(null)
      await registerUser(result.data)
      const loginResponse = await loginUser({
        email: result.data.email,
        password: result.data.password,
      })
      const token = loginResponse.data.accessToken
      const user = loginResponse.data.user
      await login(token, user)
    } catch (error: unknown) {
      const msg =
        error instanceof Error &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Registration failed. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Password strength helpers
  const hasLength = password.length >= 6
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const strengthScore = [hasLength, hasUpper, hasNumber].filter(Boolean).length
  const strengthLabel =
    strengthScore === 0 ? '' :
    strengthScore === 1 ? 'Weak' :
    strengthScore === 2 ? 'Fair' : 'Strong'
  const strengthColor =
    strengthScore === 1 ? '#e74c3c' :
    strengthScore === 2 ? '#F59E0B' : '#22C55E'

  return (
   <KeyboardAvoidingView
  style={styles.flex}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
       
        <View style={styles.topSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={38} color="#fff" />
          </View>
          <Text style={styles.appName}>LMS</Text>
          <Text style={styles.tagline}>Start your learning journey</Text>
        </View>

      
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join thousands of learners today</Text>

          
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Username</Text>
            <View style={[styles.inputWrapper, fieldErrors.username ? styles.inputWrapperError : null]}>
              <Ionicons
                name="person-outline"
                size={18}
                color={fieldErrors.username ? '#e74c3c' : '#B0B3C6'}
              />
              <TextInput
                style={styles.input}
                placeholder="johndoe"
                placeholderTextColor="#C4C9E2"
                value={username}
                onChangeText={handleUsernameChange}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {username.length >= 3 && !fieldErrors.username ? (
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
              ) : null}
            </View>
            {fieldErrors.username ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color="#e74c3c" />
                <Text style={styles.errorText}>{fieldErrors.username}</Text>
              </View>
            ) : null}
          </View>

          {/* Email */}
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

          {/* Password */}
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
                placeholder="Min 6 chars, 1 uppercase, 1 number"
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

            {/* Password strength bar */}
            {!fieldErrors.password && password.length > 0 ? (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[1, 2, 3].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        strengthScore >= level
                          ? { backgroundColor: strengthColor }
                          : { backgroundColor: '#E8ECF4' },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                  {strengthLabel}
                </Text>
              </View>
            ) : null}

            {/* Strength checklist */}
            {!fieldErrors.password && password.length > 0 ? (
              <View style={styles.checklistCard}>
                {[
                  { label: 'At least 6 characters', met: hasLength },
                  { label: 'One uppercase letter', met: hasUpper },
                  { label: 'One number', met: hasNumber },
                ].map((rule, i) => (
                  <View key={i} style={styles.checklistRow}>
                    <Ionicons
                      name={rule.met ? 'checkmark-circle' : 'ellipse-outline'}
                      size={15}
                      color={rule.met ? '#22C55E' : '#C4C9E2'}
                    />
                    <Text style={[styles.checklistText, rule.met && styles.checklistTextMet]}>
                      {rule.label}
                    </Text>
                  </View>
                ))}
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

          {/* Register button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Create Account</Text>
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

          {/* Login link */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerRow}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#C4C9E2" />
          <Text style={styles.footer}>
            By creating an account, you agree to our Terms & Privacy Policy
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

  // ── Password strength ──
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 5,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },

  // ── Checklist ──
  checklistCard: {
    backgroundColor: '#F4F6FB',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    gap: 8,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checklistText: {
    fontSize: 12,
    color: '#B0B3C6',
    fontWeight: '500',
  },
  checklistTextMet: {
    color: '#22C55E',
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

  // ── Login link ──
  loginBtn: { alignItems: 'center' },
  loginText: { fontSize: 14, color: '#888' },
  loginLink: { color: '#6C63FF', fontWeight: '700' },

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