import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Word from './word'


export default function ScrollBlurText({ text }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.55'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 22,
    mass: 0.6,
    restDelta: 0.001,
  })

  const words = text.split(' ')

  return (
    <div
      ref={containerRef}
      className='relative font-inter max-w-4xl text-[8vw] font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]'
    >
      <h2 className='text-black opacity-8'>
        {words.map((word, i) => (
          <span key={i} className='inline-block mr-[0.3em]'>
            {word}
          </span>
        ))}
      </h2>

      <h2 className='absolute inset-0 text-black '>
        {words.map((word, i) => {
          const start = (i / words.length) * 0.75
          const end = start + 2.2 / words.length
          return (
            <Word key={i} progress={smoothProgress} range={[start, end]}>
              {word}
            </Word>
          )
        })}
      </h2>
    </div>
  )
}