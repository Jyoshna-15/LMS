import { View, Text, StyleSheet } from 'react-native'

export default function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>⚠️ No internet connection</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
})