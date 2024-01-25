import styles from './Header.module.css'
import { usePasswordless } from 'amazon-cognito-passwordless-auth/react'
import Link from 'next/link'

export default function Header (): JSX.Element {
  const { signOut, signInStatus, tokensParsed } = usePasswordless()
  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>Cognito Passwordless Sample</h1>
      </div>
      <div className={styles.buttons}>
        {signInStatus === 'SIGNED_IN' && (
          <div>
            <Link style={{ marginRight: "2rem" }} href="/createCredential">Credentialの作成</Link>
            <Link href='#' onClick={signOut}>ログアウト</Link>
        </div>
        )}
      </div>
    </header>
  )
}
