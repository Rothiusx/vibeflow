import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  if (isSignedIn) {
    return <Redirect href="/" />
  }

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false, title: 'Sign in' }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: '',
          headerBackground: () => (
            <View className="bg-secondary-200 size-full" />
          ),
        }}
      />
    </Stack>
  )
}
