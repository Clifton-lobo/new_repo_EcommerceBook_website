import { Input } from '@/components/ui/input'
import { getSearchResults, resetSearchResults } from '@/store/user/SearchSlice/searchSlice';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductTile from './ProductTile';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/store/user/cartSlice/CartSlice';
import UserProductDetails from './UserProductDetails';
import { fetchProductDetails } from '@/store/user/productSlice/UserProductSlice';

const Search = () => {

    const [keyword,setKeyword]=useState();
    const[openProductDialogue,SetOpenProductDialogue]=useState(false)
    const [searchParams,setSearchParams]=useSearchParams()
    const {searchResult} =useSelector(state=>state.shopSearch)
    const {productDetails} =useSelector(state=>state.UserProductSlice)
    const {user} =useSelector(state=>state.auth)
    const {cartItems} =useSelector(state=>state.shopCart)
    const {toast}=useToast()
    const dispatch =useDispatch()

    useEffect(()=>{
        if(keyword && keyword.trim() !=='' && keyword.trim().length > 3){ 
          setTimeout(()=>{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(getSearchResults(keyword))
          },1000)
        }else{
            setSearchParams(new URLSearchParams(`?keyword =${keyword}`))
            dispatch(resetSearchResults())
        }
    },[keyword,dispatch])

     function handleProductDetails(getCurrentProductId){
     console.log(getCurrentProductId)
     dispatch(fetchProductDetails(getCurrentProductId))
     }
     

     useEffect(()=>{
     if(productDetails !== null) SetOpenProductDialogue(true)
     },[productDetails])
    

    function handleAddToCart(getCurrentProductId){
    console.log(getCurrentProductId )
    dispatch(addToCart(
      {userId :user?.id,productId : getCurrentProductId ,quantity :1}
    )).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchCartItems(user?.id));
        toast({
          title:'product added to cart'
        })
      }
    })
    }


    console.log(searchResult,'searchResult')
  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
       <div className="container mx-auto md:px-6 px-4 py-8 md:hidden"> 
          <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
              <Input
                className="py-3 w-full"  
                placeholder="Search products..."
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {
                searchResult && searchResult.length ?
                searchResult.map(item=>
                <ProductTile 
                handleAddToCart={handleAddToCart}
                    product={item}
                    handleProductDetails={handleProductDetails}
                    />) :
                <h1>No result found</h1>
            }
        </div>
         <UserProductDetails 
              open={openProductDialogue}
               setOpen={SetOpenProductDialogue}
               productDetails={productDetails}
               />
    </div>
  )
}


export default Search
