import { FilterOptions } from '@/Config/Config'
import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { SelectSeparator } from '../ui/select'

const Filter = ({filter,handleFilter}) => {
  return (
    <div className='p-4 rounded-lg shadow-sm bg-background'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-extrabold'>Filters</h2>
      </div>
      <div className='p-4 space-y-4'>
            {
                Object.keys(FilterOptions).map((keyItems)=>
                    <>
                    <div key={keyItems}>
                        <h3 className='text-base font-medium'>{keyItems}</h3>
                        <div>
                            {
                                FilterOptions[keyItems].map(options=>
                                    <label className='flex items-center gap-4 font-normal text-gray-600' key={options.id}>
                                    <Checkbox
  className='border-gray-600'
  checked={
    filter && Object.keys(filter).length > 0 &&
    filter[keyItems] &&
    filter[keyItems].indexOf(options.id) > -1
  }
  onCheckedChange={() => handleFilter(keyItems, options.id)}
/>
                                     <span className='text-sm'>{options.label}</span>   
                                     </label>
                                )
                            }
                        </div>
                    </div>
                    <SelectSeparator className="border-gray-200 border-t-[2px]" /> 
                    </>
                )
            }
      </div>
    </div>
  )
}

export default Filter

