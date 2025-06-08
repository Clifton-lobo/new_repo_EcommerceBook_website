import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'

const ProductTile = ({ product, setFormData, handleDelete, setCreateProductsDialogue, setCurrentEditedId }) => {
  return (
    <Card className='w-full max-w-sm mx-auto flex flex-col h-full'>
        {/* Image Container */}
       <div className='relative flex items-center justify-center h-[250px] bg-gray-100 rounded-t-lg'>
                   <img 
                       src={product?.image} 
                       alt={product?.title} 
                       className='max-w-full max-h-full object-contain'
                   />
               </div>
       
             {/* Product Details */}
             <CardContent className='p-4 flex-1'>
               <h2 className='text-base font-bold text-gray-900'>{product.title}</h2>
       
               <div className='flex items-center justify-between mt-1 text-xs text-gray-600'>
                 <span className='font-semibold text-gray-700'>{product.author}</span>
                 <span className='px-2 py-1 text-[10px] text-gray-700 bg-gray-100 rounded-full'>
                 Condition :  {product.bookcondition}
                 </span>
               </div>
       
               <div className='flex items-center justify-between mt-3'>
                 <span className='text-base font-semibold text-gray-900'>${product.price}</span>
               </div>
             </CardContent>
        {/* Buttons */}
        <CardFooter className='flex items-center justify-between mt-auto'>
            <Button 
                onClick={() => {
                    setCreateProductsDialogue(true);
                    setCurrentEditedId(product?._id);
                    setFormData(product);
                }}
            >
                Edit
            </Button>
            <Button onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
    </Card>
  )
}

export default ProductTile
