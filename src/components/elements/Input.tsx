import type {FC} from "react";

interface Props {
  type: 'number' | 'password' | 'email'
  value: number,
  className?: string
  placeholder?: string

  handleValue: (value: number) => void
}

export const Input: FC<Props> = ({
  type,
  value,
  className = 'bet-input',
  placeholder = 'Enter value: ',
  handleValue,
})=> {
  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) => handleValue(+e.target.value)}
    />
  )
}