'use client'
import { useState } from 'react'
import { usePasswordless } from 'amazon-cognito-passwordless-auth/react'
import Input from '@/components/UI/InputText'
import MyButton from '@/components/UI/MyButton'
import Link from 'next/link'
import styles from './createCredential.module.css'

export default function CreateCredentual (): JSX.Element {
  const { fido2CreateCredential } = usePasswordless()
  const [deviceName, setDeviceName] = useState('')
  const [suceeded, setSuceeded] = useState(false)
  const [sendRequest, setSendRequest] = useState(false)

  async function createCredential (): Promise<void> {
    setSendRequest(true)
    try {
      await fido2CreateCredential({ friendlyName: deviceName })
      setSuceeded(true)
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
      }
    }
  }

  return (
    <div className={styles.container}>
        <h1>登録が完了しました</h1>
        <div className={styles.outline}>
          {suceeded && (
            <>
              <p>次からはこのデバイスではパスワードなしでログインできます。</p>
              <Link href='/'>
                シミュレーターに戻る
              </Link>
            </>
          )
          }
          {!suceeded && (
          <>
          <h2>生体認証の設定</h2>
          <p>デバイスの生体認証でログインできるようにします。</p>
          {new URL(window.location.origin).protocol === 'http:' && <div className={styles.errorWindow}>
            <p>
              パスキーの登録はHTTPSでのみ行えます。
            </p>
          </div>}
          <Input
            inputId='デバイス名'
            value={deviceName}
            onValueChange={(e) => { setDeviceName(e.target.value) }}
            label=''
            name='deviceName'
            type='text'
            placeholder='デバイス名'
          />
          <MyButton
            color='primary'
            onClickButton={() => {
              createCredential().catch((e) => {
                console.log(e)
              })
            }}
            disabled={sendRequest}
          >
            登録
          </MyButton>
          </>)}
        </div>
      </div>
  )
}
