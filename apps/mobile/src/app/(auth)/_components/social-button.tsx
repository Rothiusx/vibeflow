import { Button } from '@/components/ui/button'
import { useSSO, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'
import { Text } from 'react-native'

const PROVIDERS = {
  google: {
    name: 'Google',
    description: 'Sign in with Google',
    icon: 'logo-google',
    strategy: 'oauth_google',
  },
  apple: {
    name: 'Apple',
    description: 'Sign in with Apple',
    icon: 'logo-apple',
    strategy: 'oauth_apple',
  },
  discord: {
    name: 'Discord',
    description: 'Sign in with Discord',
    icon: 'logo-discord',
    strategy: 'oauth_discord',
  },
} as const

function useWarmUpBrowser() {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export function SocialButton({
  provider,
}: {
  provider: keyof typeof PROVIDERS
}) {
  useWarmUpBrowser()

  const { startSSOFlow } = useSSO()

  const handleSSOFlow = async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: PROVIDERS[provider].strategy,
          redirectUrl: AuthSession.makeRedirectUri(),
        })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      className="bg-primary-400 flex h-20 gap-4 rounded-lg"
      onPress={handleSSOFlow}
    >
      <Ionicons name={PROVIDERS[provider].icon} className="h-16" />
      <Text>{PROVIDERS[provider].name}</Text>
    </Button>
  )
}
