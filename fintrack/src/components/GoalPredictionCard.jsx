import React, { useEffect, useState } from 'react'
import { getGoalPrediction } from '../api'
import Tippy from '@tippyjs/react'
import { FiClock, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

export default function GoalPredictionCard({ goal }){
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getGoalPrediction(goal.id)
      .then(p => { if (mounted) setPrediction(p) })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [goal.id])

  if (loading) return <div className="muted" style={{fontSize:13}}>Analizando meta "{goal.title}"...</div>

  if (!prediction) return null

  const { currentMonthlySaving, monthsToGoal, suggestedMonthlySaving, analysis } = prediction

  return (
    <div className="prediction-card" style={{marginBottom:16,fontSize:13}}>
      <div style={{fontWeight:600,marginBottom:4}}>{goal.title}</div>
      
      {/* Current status */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <FiClock style={{flexShrink:0}} />
        <div>
          {monthsToGoal ? (
            <>Al ritmo actual llegarás en <strong>{monthsToGoal} meses</strong></>
          ) : (
            <>No hay suficiente historial de ahorro</>
          )}
        </div>
      </div>

      {/* Saving rate */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
        <FiTrendingUp style={{flexShrink:0}} />
        <div>
          Ahorro mensual actual: <strong>${Math.round(currentMonthlySaving)}</strong>
          {suggestedMonthlySaving > currentMonthlySaving && (
            <Tippy content="Para llegar a tiempo necesitas aumentar tu ahorro mensual">
              <span style={{color:'var(--error)',marginLeft:8}}>
                <FiAlertCircle style={{verticalAlign:'middle'}} />
              </span>
            </Tippy>
          )}
        </div>
      </div>

      {/* Tips */}
      {analysis?.suggestions?.length > 0 && (
        <div style={{background:'var(--accent)',padding:12,borderRadius:8,marginTop:8}}>
          <div style={{fontWeight:600,marginBottom:4}}>Sugerencias</div>
          <ul style={{margin:0,paddingLeft:16}}>
            {analysis.suggestions.map((s,i) => (
              <li key={i} style={{marginBottom:4}}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}