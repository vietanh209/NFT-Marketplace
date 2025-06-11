import React from 'react'
import { useTheme } from 'next-themes'
// INTERNAL IMPORT
import Style from './Title.module.css'
const Title = ({heading, paragraph}) => {
  const { theme, setTheme } = useTheme()
  return (
    <div className={Style.title}>
        <div className={Style.title_box}>
            <h2 className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{heading}</h2>
            <p className={`${theme === 'dark' ? 'text-light' : 'text-dark'}`}>{paragraph}</p>
        </div>
    </div>
  )
}

export default Title