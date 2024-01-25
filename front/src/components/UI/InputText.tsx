import styles from './InputText.module.css'

interface InputProps {
  inputId: string
  value: string | number
  onValueChange: React.ChangeEventHandler<HTMLInputElement>
  label: string
  name: string
  type: string
  placeholder?: string
}

export default function Input ({
  inputId,
  value,
  onValueChange,
  label,
  name,
  type,
  placeholder
}: InputProps): JSX.Element {
  return (
    <>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      <div>
        {
          <input
            id={inputId}
            className={styles.input}
            value={value}
            name={name}
            onChange={onValueChange}
            type={type}
            placeholder={placeholder}
          />
        }
      </div>
    </>
  )
}
