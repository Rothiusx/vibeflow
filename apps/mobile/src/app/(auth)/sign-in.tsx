import { Button } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
})

type SignInForm = z.infer<typeof signInSchema>

export default function SignInScreen() {
  const { isLoaded, signIn, setActive } = useSignIn()

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'myemail@gmail.com',
      password: 'passwordx123',
    },
  })

  const onSubmit = async ({ email, password }: SignInForm) => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      if (signInAttempt.status === 'complete') {
        setActive({ session: signInAttempt.createdSessionId })
      } else {
        form.setError('root', { message: 'Sign in could not be completed' })
      }
    } catch (err) {
      console.log('Sign in error: ', JSON.stringify(err, null, 2))

      if (isClerkAPIResponseError(err)) {
        err.errors.forEach((error) => {
          form.setError('root', {
            message: error.longMessage ?? error.message,
          })
        })
      } else {
        form.setError('root', { message: 'Unknown error' })
      }
    }

    console.log('Sign in: ', email, password)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-secondary-200 flex-1 items-center gap-4 p-16"
    >
      <Text className="text-primary-800 mt-12 text-4xl font-bold">Sign in</Text>

      <View className="w-full gap-2">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <>
              <Text className="text-primary-800 text-lg font-medium">
                Email
              </Text>
              <Input isInvalid={!!fieldState.error}>
                <InputField
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Input>
              <Text className="text-red-500">
                {fieldState.error?.message ?? ''}
              </Text>
            </>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <>
              <Text className="text-primary-800 text-lg font-medium">
                Password
              </Text>
              <Input isInvalid={!!fieldState.error}>
                <InputField
                  type="password"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              </Input>
              <Text className="text-red-500">
                {fieldState.error?.message ?? ''}
              </Text>
            </>
          )}
        />
      </View>

      <Button
        isDisabled={form.formState.isSubmitting}
        onPress={form.handleSubmit(onSubmit)}
        className="min-w-64"
      >
        {form.formState.isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <Text>Sign in</Text>
        )}
      </Button>

      <Text className="text-red-500">
        {form.formState.errors.root?.message ?? ''}
      </Text>

      <Link
        href="/sign-up"
        className="text-info-600 px-4 py-8 text-lg font-medium"
      >
        Don't have an account? Sign up
      </Link>
    </KeyboardAvoidingView>
  )
}
