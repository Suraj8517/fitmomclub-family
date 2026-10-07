
import { motion, useTransform } from 'framer-motion'
export default function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0, 1], { clamp: true })
  const blur = useTransform(progress, range, [12, 0], { clamp: true })
  const y = useTransform(progress, range, [8, 0], { clamp: true })
  const scale = useTransform(progress, range, [0.97, 1], { clamp: true })
  const filter = useTransform(blur, (v) => `blur(${v}px)`)

  return (
    <motion.span
      style={{ opacity, filter, y, scale }}
      className='inline-block mr-[0.3em] will-change-[filter,opacity,transform]'
    >
      {children}
    </motion.span>
  )
}