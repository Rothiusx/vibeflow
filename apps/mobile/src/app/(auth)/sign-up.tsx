import { Button } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { useSignUp } from '@clerk/clerk-expo'
import { useForm } from '@tanstack/react-form'
import { Link, router } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string({ message: 'Email is required' }).email('Invalid email'),
  password: z
    .string({ message: 'Password is required' })
    .min(8, 'Password should be at least 8 characters long'),
})

export default function SignUpScreen() {
  const { signUp, isLoaded } = useSignUp()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async (data) => {
      if (!isLoaded) {
        return
      }

      console.log('data', data.value)

      try {
        await signUp.create({
          emailAddress: data.value.email,
          password: data.value.password,
        })

        await signUp.prepareVerification({ strategy: 'email_code' })
        router.push('/verify')
      } catch (err) {
        console.log('Sign up error: ', err)
      }
    },
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-secondary-200 flex-1 items-center gap-4 p-16"
    >
      <Text className="text-primary-800 mt-12 text-4xl font-bold">Sign up</Text>

      <View className="w-full gap-2">
        <form.Field name="email">
          {(field) => (
            <>
              <Text className="text-primary-800 text-lg font-medium">
                Email
              </Text>
              <Input isInvalid={field.state.meta.errors.length > 0}>
                <InputField
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              </Input>
              {field.state.meta.errors.length > 0 && (
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
              {field.state.meta.errors.length > 0 && (
                <Text className="text-red-500">
                  {field.state.meta.errors[0]?.message}
                </Text>
              )}
            </>
          )}
        </form.Field>
      </View>

      <Button onPress={async () => form.handleSubmit()}>
        <Text>Sign up</Text>
      </Button>

      <Link
        href="/sign-in"
        className="text-info-600 px-4 py-8 text-lg font-medium"
      >
        Already have an account? Sign in
      </Link>
    </KeyboardAvoidingView>
  )
}
