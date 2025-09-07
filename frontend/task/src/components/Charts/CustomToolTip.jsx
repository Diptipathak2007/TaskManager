import React from 'react'

const CustomToolTip = ({active,payload}) => {
    if(active && payload && payload.length){
        return(
            <div className='bg-white p-3 border border-gray-300 rounded-md shadow-lg'>
                <p className='font-semibold text-gray-800'>{`Date: ${payload[0].payload.date}`}</p>
                <p className='font-semibold text-gray-800'>{`Tasks Created: ${payload[0].payload.tasksCreated}`}</p>
                <p className='font-semibold text-gray-800'>{`Tasks Completed: ${payload[0].payload.tasksCompleted}`}</p>
            </div>
        )
    }
    return null;

  return (
    <div>CustomToolTip</div>
  )
}

export default CustomToolTip