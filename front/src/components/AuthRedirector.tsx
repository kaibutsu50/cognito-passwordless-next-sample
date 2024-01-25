'use client'
import { redirect, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { usePasswordless } from 'amazon-cognito-passwordless-auth/react'

export default function AuthRedirector (props: {
  children: React.ReactNode
}): JSX.Element {
  const { signInStatus } = usePasswordless()
  const notLoggedInPaths = ['/signin', '/signup']
  const pathname = usePathname()
  useEffect(() => {
    if (notNeedsToSigninButSignInPage(pathname, signInStatus)) {
      redirect('/')
    } else if (needsToSignin(pathname, signInStatus)) {
      redirect('/signin')
    }
  }, [signInStatus, pathname])

  function notNeedsToSigninButSignInPage (path: string, status: string): boolean {
    return notLoggedInPaths.includes(path) && status === 'SIGNED_IN'
  }

  function needsToSignin (path: string, status: string): boolean {
    return !notLoggedInPaths.includes(path) && status === 'NOT_SIGNED_IN'
  }

  function needsRedirect (path: string, status: string): boolean {
    console.log(path, status)
    return needsToSignin(path, status) ||
    notNeedsToSigninButSignInPage(path, status)
  }

  return (
    <>
    {!needsRedirect(pathname, signInStatus) &&
      signInStatus !== 'CHECKING' &&
     (props.children)}
    </>
  )
}
