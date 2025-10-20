import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

function useAnimatedNumber(target, duration = 600){
  const [value, setValue] = useState(0)
  const raf = useRef(null)
  useEffect(()=>{
    const start = performance.now()
    const from = Number(value) || 0
    const to = Number(target) || 0
    if (raf.current) cancelAnimationFrame(raf.current)
    function tick(now){
      const t = Math.min(1, (now - start) / duration)
      const cur = Math.round(from + (to - from) * t)
      setValue(cur)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return ()=> cancelAnimationFrame(raf.current)
  }, [target])
  return value
}

export default function KpiCard({ title, value, small, icon }){
  // value may be a string like "$4200" or number
  const numeric = Number(String(value).replace(/[^0-9.-]+/g, '')) || 0
  const animated = useAnimatedNumber(numeric, 1200)
  return (
    <motion.div initial={{opacity:0, y:6}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className={`kpi-card ${small? 'small':''}`} style={{borderRadius:16}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}>
        <Tippy content={title}>
          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:0.45}} style={{width:56,height:56,display:'grid',placeItems:'center',borderRadius:14,background:'rgba(255,255,255,0.72)',boxShadow:'var(--shadow-2)'}}>
            {icon ? icon : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#07303a" strokeOpacity="0.12"/></svg>}
          </motion.div>
        </Tippy>
        <div>
          <div className="kpi-title">{title}</div>
          <motion.div animate={{scale:[1,1.01,1]}} transition={{repeat:Infinity,duration:6,repeatDelay:2}} className="kpi-value">${animated}</motion.div>
        </div>
      </div>
    </motion.div>
  )
}
