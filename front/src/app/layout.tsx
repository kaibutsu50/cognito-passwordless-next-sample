'use client'
import './globals.css'
import { Passwordless } from 'amazon-cognito-passwordless-auth'
import { PasswordlessContextProvider } from 'amazon-cognito-passwordless-auth/react'
import AuthRedirector from '@/components/AuthRedirector'
import Header from '@/components/Header'
import styles from './styles.module.css'

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  Passwordless.configure({
    clientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
    cognitoIdpEndpoint: process.env.NEXT_PUBLIC_AWS_REGION!,
    fido2: {
      baseUrl: process.env.NEXT_PUBLIC_FIDO2_API_URL!,
      authenticatorSelection: {
        userVerification: 'required'
      }
    }
  })

  return (
    <html lang="ja">
      <body>
        <PasswordlessContextProvider>
          <AuthRedirector>
            <Header />
            <main className={styles.container}>
              {children}
            </main>
          </AuthRedirector>
        </PasswordlessContextProvider>
      </body>
    </html>
  )
}
