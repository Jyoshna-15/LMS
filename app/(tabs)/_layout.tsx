// import { Tabs } from 'expo-router'
// import { Text } from 'react-native'

// export default function TabsLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#6C63FF',
//         tabBarInactiveTintColor: '#999',
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: '#fff',
//           borderTopWidth: 1,
//           borderTopColor: '#eee',
//           height: 60,
//           paddingBottom: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: '600',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarLabel: 'Courses',
//           tabBarIcon: ({ focused }) => (
//             <Text style={{ fontSize: 22 }}>{focused ? '📚' : '📖'}</Text>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="bookmarks"
//         options={{
//           tabBarLabel: 'Bookmarks',
//           tabBarIcon: ({ focused }) => (
//             <Text style={{ fontSize: 22 }}>{focused ? '❤️' : '🤍'}</Text>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarLabel: 'Profile',
//           tabBarIcon: ({ focused }) => (
//             <Text style={{ fontSize: 22 }}>{focused ? '👤' : '👥'}</Text>
//           ),
//         }}
//       />
//     </Tabs>
//   )
// }


import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { View, StyleSheet } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#B0B3C6',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F8',
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={focused ? 'book' : 'book-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarLabel: 'Bookmarks',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconWrapActive: {
    backgroundColor: '#EEF0FF',
  },
})