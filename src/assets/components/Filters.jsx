import { Checkbox, Divider, Drawer, Dropdown } from 'antd'
import React from 'react'

export default function Filters({open,onClose,selectedTime,setSelectedTime}) {
    function handleSelect(selected) {
        setSelectedTime(selected.key)
    }
    function handleDeselect() {
        setSelectedTime('Anytime')
    }
return (
<Drawer title="Filters" placement="right" closable onClose={onClose} open={open}>
    <div className='space-y-3'>
        <h3>Job Type</h3>
        <div className='flex flex-wrap gap-2'>
        <Checkbox>Full-time</Checkbox>
            <Checkbox>Part-time</Checkbox>
            <Checkbox>Internship</Checkbox>
            <Checkbox>Contract</Checkbox>
            <Checkbox>Temporary</Checkbox>

            </div>
    </div>
    <Divider/>
    <div className='space-y-3'>
        <h3>Employment Type</h3>
        <div className='flex flex-wrap gap-2'>
            <Checkbox>On Site</Checkbox>
            <Checkbox>Hybrid</Checkbox>
            <Checkbox>Remote</Checkbox>
            </div>
    </div>
    <Divider/>
    <div className='space-y-3'>
        <h3>Time Posted</h3>
        <Dropdown.Button menu={{items:[{key:'Anytime',label:'Anytime'},{key:'Last 24 hours',label:'Last 24 hours'},{key:'Last & days',label:'Last 7 days'},{key:'Last 30 days',label:'Last 30 days'}],selectable:true,onSelect:handleSelect,onDeselect:handleDeselect,selectedKeys:selectedTime,defaultSelectedKeys:'Anytime'}}>{selectedTime}</Dropdown.Button>
    </div>
</Drawer>
  )
}
