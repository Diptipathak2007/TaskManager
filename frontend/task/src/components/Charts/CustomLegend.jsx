import { PlayCircleIcon } from 'lucide-react'
import React from 'react'

const CustomLegend = () => {
  return (
    <div className="">
        {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.value}</span>
            </div>
        ))}
    </div>
  )
}

export default CustomLegend