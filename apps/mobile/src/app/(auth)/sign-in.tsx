import { Button } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { useSignIn } from '@clerk/clerk-expo'
import { useForm } from '@tanstack/react-form'
import { Link } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
})

export default function SignInScreen() {
  const { signIn, isLoaded, setActive } = useSignIn()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async (data) => {
      if (!isLoaded) {
        return
      }

      try {
        const signInAttempt = await signIn.create({
          identifier: data.value.email,
          password: data.value.password,
        })

        if (signInAttempt.status === 'complete') {
          setActive({ session: signInAttempt.createdSessionId })
        } else {
          console.log('Sign in failed')
        }
      } catch (err) {
        console.log('Sign in error: ', JSON.stringify(err, null, 2))
      }
    },
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-secondary-200 flex-1 items-center gap-4 p-16"
    >
      <Text className="text-primary-800 mt-12 text-4xl font-bold">Sign in</Text>

      <View className="w-full gap-2">
        <form.Field name="email">
          {(field) => (
            <>
              <Text className="text-primary-800 text-lg font-medium">
                Email
              </Text>
              <Input isInvalid={field.state.meta.errors.length > 0}>
                <InputField
                  keyboardType="email-address"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              </Input>
              {!!field.state.meta.errors && (
                <Text className="text-red-500">
                  {field.state.meta.errors[0]?.message}
                </Text>
              )}
            </>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <>
              <Text className="text-primary-800 text-lg font-medium">
                Password
              </Text>
              <Input isInvalid={field.state.meta.errors.length > 0}>
                <InputField
                  type="password"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              </Input>
              {!!field.state.meta.errors && (
                <Text className="text-red-500">
                  {field.state.meta.errors[0]?.message}
                </Text>
              )}
            </>
          )}
        </form.Field>
      </View>

      <Button onPress={async () => form.handleSubmit()}>
        <Text>Sign in</Text>
      </Button>

      <Link
        href="/sign-up"
        className="text-info-600 px-4 py-8 text-lg font-medium"
      >
        Don't have an account? Sign up
      </Link>
    </KeyboardAvoidingView>
  )
}
