import styles from './MyButton.module.css'

interface Props {
  children: React.ReactNode
  onClickButton?: (e: React.MouseEvent<HTMLButtonElement>) => void
  color?: 'primary' | 'secondary'
  disabled?: boolean
}

export default function MyButton (
  {
    children,
    onClickButton,
    color,
    disabled = false
  }: Props): JSX.Element {
  const colorStyle = (color ?? 'primary') === 'primary' ? styles.primary : styles.secondary

  return (
    <div>
      <button className={`${styles.button} ${colorStyle}`} onClick={onClickButton} disabled={disabled}>
        <span className={styles.buttonText}>{children}</span>
      </button>
    </div>
  )
}
