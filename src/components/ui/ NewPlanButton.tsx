import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const  NewPlanButton: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Button variant="contained" onClick={() => navigate('/new-plan')} color='primary'>新規プラン作成</Button>
  )
}
