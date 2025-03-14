import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function PendingAssessments() {
  const uniqueToken = uuidv4();
  const navigate = useNavigate()
  return (
    <>
    <Button onClick={()=> navigate(`/room/${uniqueToken}`)}>Give Interview</Button>
    </>
  )
}
