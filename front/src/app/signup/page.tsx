'use client'
import { useState } from 'react'
import { signUp } from 'amazon-cognito-passwordless-auth/cognito-api'
import { usePasswordless } from 'amazon-cognito-passwordless-auth/react'
import { generatePassword } from '@/libs/Utils'
import Link from 'next/link'
import MyButton from '../../components/UI/MyButton'
import Input from '../../components/UI/InputText'
import styles from './signup.module.css'

export default function Home (): JSX.Element {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [sendEmail, setSendEmail] = useState(false)
  const [sendRequest, setSendRequest] = useState(false)
  const { requestSignInLink } = usePasswordless()

  async function signup (): Promise<void> {
    setSendRequest(true)
    try {
      await signUp({ username: email, password: generatePassword() })
      const result = requestSignInLink({ username: email })
      await result.signInLinkRequested
      setSendEmail(true)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        if (e.name === 'UsernameExistsException') {
          setErrorMessage('そのメールアドレスは既に登録されています')
          setSendRequest(false)
        }
      }
    }
  }

  return (
    <div>
        <div className={styles.container}>
          <h1>新規登録</h1>
          <div className={styles.outline}>
            {sendEmail && <p>メールを送信しました。このタブは閉じてください。</p>}
            {!sendEmail && (
              <>
                <h2>メールで新規登録</h2>
                <div>
                  <p>入力したメールアドレスにメッセージが届きます。</p>
                </div>
                {errorMessage !== '' &&
                <div className={styles.errorWindow}>
                  <p>
                    {errorMessage}
                  </p>
                </div>
                }
                <Input
                  inputId='email'
                  value={email}
                  onValueChange={(e) => { setEmail(e.target.value) }}
                  label=''
                  name='email'
                  type='email'
                  placeholder='メールアドレス'
                />
                <MyButton
                  onClickButton={() => {
                    signup().catch((e) => {
                      console.log(e)
                    })
                  }}
                  color='primary'
                  disabled={sendRequest}
                >新規登録</MyButton>

                <div>
                  <hr className={styles.horizonalRule} />
                </div>

                <div className={styles.link}>
                  <span style={{ marginRight: '0.25rem' }}>または</span>
                  <Link href="/signin">
                    ログイン
                  </Link>
                </div>
              </>)
            }
          </div>
        </div>
      </div>
  )
}
