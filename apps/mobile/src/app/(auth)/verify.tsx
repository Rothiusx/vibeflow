import { Button } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { useSignUp } from '@clerk/clerk-expo'
import { useForm } from '@tanstack/react-form'
import React from 'react'
import { KeyboardAvoidingView, Platform, Text } from 'react-native'
import { z } from 'zod'

const verifySchema = z.object({
  code: z.string({ message: 'Code is required' }).length(6, 'Invalid code'),
})

export default function VerifyScreen() {
  const { signUp, isLoaded, setActive } = useSignUp()

  const form = useForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onChange: verifySchema,
    },
    onSubmit: async (data) => {
      if (!isLoaded) {
        return
      }

      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: data.value.code,
        })

        if (signUpAttempt.status === 'complete') {
          setActive({ session: signUpAttempt.createdSessionId })
        } else {
          console.log('Verification failed')
          console.log(signUpAttempt)
        }
      } catch (err) {
        console.log('Verification error: ', err)
      }
    },
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 items-center justify-center gap-16 p-16"
    >
      <Text className="text-2xl font-bold">Verify your email</Text>

      <form.Field name="code">
        {(field) => (
          <>
            <Text>Email</Text>
            <Input>
              <InputField
                inputMode="numeric"
                value={field.state.value}
                onChangeText={field.handleChange}
              />
            </Input>
            {!!field.state.meta.errors && (
              <Text>{field.state.meta.errors.join(', ')}</Text>
            )}
          </>
        )}
      </form.Field>

      <Button onPress={async () => form.handleSubmit()}>
        <Text>Verify</Text>
      </Button>
    </KeyboardAvoidingView>
  )
}
