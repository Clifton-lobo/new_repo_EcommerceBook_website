import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import React from 'react'

const ProductTile = ({ product ,handleProductDetails,handleAddToCart}) => {
  return (
    <Card  className='w-full max-w-xs mx-auto overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg flex flex-col h-auto'>
      {/* Product Image */}
      <div onClick={()=>handleProductDetails(product?._id)}>

      <div   className='relative flex items-center justify-center h-[180px] bg-gray-100 rounded-t-lg'>
        <img 
          src={product?.image} 
          alt={product?.title} 
          className='max-w-full max-h-full object-contain'
          />
      </div>

      {/* Product Details */}
      <CardContent className='p-3 flex-1'>
        <h2 className='text-sm font-semibold text-gray-900'>{product?.title}</h2>

        <div className='flex items-center justify-between mt-1 text-xs text-gray-600'>
          <span className='font-medium text-gray-700'>By {product?.author}</span>
        </div>

        <div className='flex items-center justify-between mt-2'>
          <span className='text-sm font-semibold text-gray-900'>${product?.price}</span>
        </div> 
      </CardContent>
      </div>

      {/* Footer */}
      <CardFooter className='p-3 mt-auto flex flex-col space-y-1'>
        <div className='w-full text-left mb-1'>
          <span className='px-2 py-1 text-[10px] font-medium text-gray-700 bg-gray-200 rounded-md'>
            Condition: <span className="text-gray-900">{product?.bookcondition}</span>
          </span>
        </div>
        <Button onClick={()=>handleAddToCart(product?._id)} className="w-full py-2 text-xs font-medium text-white bg-blue-600 transition-all duration-200 rounded-md  flex items-center justify-center space-x-2">
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductTile