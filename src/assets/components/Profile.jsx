import React, { useState } from 'react'
import UserProfileCard from './UserProfileCard'
import { Popover, Button, Card, IconButton, Tooltip, Typography, ButtonGroup } from '@material-tailwind/react'
import { BellNotification, Edit } from 'iconoir-react'
import { Col, Row, Tag } from 'antd'

const Skills = [
    {
        skill:'React.js'
    },
    {
        skill:'Tailwindcss'
    },
    {
        skill:'NodeJS'
    },
    {
        skill:'MongoDB'
    },
]

const notifications = [
    {
        msg:'Your application at Securiti.ai was viewed'
    },
    {
        msg:'Your CV at Systems was downloaded'
    },
    {
        msg:'Your application at Google Inc was declined'
    },

]
export default function Profile() {
   const [open,setOpen] = useState(false)
    return (
    <>
    <div className='flex justify-between mb-2'>
    <Typography type='h3' className="text-white">Profile</Typography>
    <Popover open={open} onOpenChange={setOpen}>
        <Popover.Trigger as={IconButton} onClick={() => setOpen((cur) => !cur)}>
          <BellNotification/>
        </Popover.Trigger>
        <Popover.Content className="max-w-sm bg-slate-800 text-white border-slate-700">
            <Typography className="font-bold mb-3">
                Recent
            </Typography>
            <ButtonGroup variant='ghost'>More</ButtonGroup>
            {notifications.map((noti,idx)=><>
                <Typography type="small" key={idx}>
            {noti.msg}
          </Typography>
          <hr className="-mx-3 my-3 border-secondary border-slate-600" />
            </>)}

          <Popover.Arrow />
        </Popover.Content>
      </Popover>
    </div>
    <div className='flex flex-col items-center md:flex-row gap-2 md:items-start'>
    <UserProfileCard/>
    <div className='flex flex-col gap-2'>   
    <Row gutter={[5,8]}>
        <Col xs={24}>
    <Card className="max-w-full text-white bg-black border-slate-700">
      <Card.Body>
        <div className='flex justify-between'>
        <Typography type="h6">About</Typography>
        <Tooltip placement='left'>
            <Tooltip.Trigger as={IconButton} size="sm" variant="ghost">
              <Edit className="h-3.5 w-3.5" color="white" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              Edit
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
        </div>
        <Typography className="my-1">
          The place is close to Barceloneta Beach and bus stop just 2 min by
          walk and near to "Naviglio" where you can enjoy the main night life in
          Barcelona.
        </Typography>
      </Card.Body>
    </Card>
        </Col>
        <Col xs={24}>
    <Card className="max-w-full text-white bg-black border-slate-700">
      <Card.Body>
        <div className='flex justify-between'>
        <Typography type="h6">Education</Typography>
        <Tooltip placement='left'>
            <Tooltip.Trigger as={IconButton} size="sm" variant="ghost">
              <Edit className="h-3.5 w-3.5" color="white" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              Edit
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip>
        </div>
        <div className='flex items-center justify-between'>
        <Typography className="my-1">
          Institute Of Business Administration, Karachi
        </Typography>
        <Typography>
            2025
        </Typography>
        </div>
        <Typography className="text-slate-500">
            Bachelors In Computer Science
        </Typography>
      </Card.Body>
    </Card>
        
        </Col>
    <Col xs={24}>
        <Card className="max-w-full border-slate-700 bg-black text-white">
      <Card.Body>
        <Typography type="h6">Skills</Typography>
        {Skills.map((skill,idx)=><Tag key={idx}>{skill.skill}</Tag>)}
      </Card.Body>
    </Card>
        </Col>
        <Col xs={24} md={8}>
        <Card className="max-w-full border-slate-700 bg-black text-white">
      <Card.Body>
        <Typography type="h6" className="text-center">Upcoming Assessments</Typography>
        <Typography className="my-3 text-7xl text-center">
            1
        </Typography>
      </Card.Body>
    </Card>
        </Col>
        <Col xs={24} md={8}>
        <Card className="max-w-full border-slate-700 bg-black text-white">
      <Card.Body>
        <Typography type="h6" className="text-center"> Jobs Applied</Typography>
        <Typography className="my-3 text-7xl text-center">
            3
        </Typography>
      </Card.Body>
    </Card>
        </Col>
        <Col xs={24} md={8}>
        <Card className="max-w-full border-slate-700 bg-black text-white">
      <Card.Body>
        <Typography type="h6" className="text-center">Saved Jobs</Typography>
        <Typography className="my-3 text-7xl text-center">
            10
        </Typography>
      </Card.Body>
    </Card>
        </Col>

    </Row>
    </div>
    </div>
    </>
  )
}
