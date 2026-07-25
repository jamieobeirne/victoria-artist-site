export function CharCounter({ value, max }: { value: string; max: number }) {
  const over = value.length > max
  return (
    <span className={over ? 'char-counter char-counter-over' : 'char-counter'}>
      {value.length}/{max}
    </span>
  )
}
