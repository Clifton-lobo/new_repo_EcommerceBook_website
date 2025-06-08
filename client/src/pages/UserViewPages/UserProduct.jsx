import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Filter from "@/components/User-view/Filter"
import { ArrowUpDown } from "lucide-react"
import { sortoptions } from '@/Config/Config'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllListedProduct, fetchProductDetails} from "@/store/user/productSlice/UserProductSlice"
import ProductTile from "./ProductTile"
import { createSearchParams, useSearchParams } from "react-router-dom"
import UserProductDetails from "./UserProductDetails"
import { addToCart, fetchCartItems } from "@/store/user/cartSlice/CartSlice"
import { useToast } from "@/hooks/use-toast"  

const UserProduct = () => {
  
  const dispatch = useDispatch();
  const {productList,productDetails}=useSelector(state=>state.UserProductSlice)
  const {user}=useSelector((state)=>state.auth)
  const [filter,setFilter]=useState({});
  const [sort,setSort]=useState(null);
  const [searchParams,setSearchParams]=useSearchParams();
  const [openProductDialogue,SetOpenProductDialogue]=useState(false);
  const {toast} =useToast();
  const categorySearchParam =searchParams.get('category')

 function handleSort(value){
  console.log(value);
  setSort(value); 
 }

 function handleFilter(getSectionId, getCurrentOption) {
  let productFilters = { ...filter };
  const indexOfCurrentSection = Object.keys(productFilters).indexOf(getSectionId);

  if (indexOfCurrentSection === -1) {
    productFilters = {
      ...productFilters,
      [getSectionId]: [getCurrentOption]
    };
  } else {
    const indexOfCurrentOption = productFilters[getSectionId].indexOf(getCurrentOption);

    if (indexOfCurrentOption === -1) {
      productFilters[getSectionId].push(getCurrentOption);
    } else {
      productFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
  }
  // console.log(productFilters); // Log the filter state
  setFilter(productFilters);
  sessionStorage.setItem('filter', JSON.stringify(productFilters));
}

function handleProductDetails(getCurrentProductId){
console.log(getCurrentProductId)
dispatch(fetchProductDetails(getCurrentProductId))
}

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',');
      let queryKey = key.toLowerCase();  // Convert keys to lowercase for backend consistency

      queryParams.push(`${queryKey}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join('&');
}
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

 useEffect(() => {
  if (filter && Object.keys(filter).length > 0) {
    const createQueryString = createSearchParamsHelper(filter);
    // console.log(); // Log the query string
    setSearchParams(new URLSearchParams(createQueryString));
  }
}, [filter]);

 useEffect(()=>{
  setSort("price-lowtohigh")
  setFilter(JSON.parse(sessionStorage.getItem('filter')) || {})
 },[categorySearchParam])

  useEffect(()=>{
    if(filter !== null && sort !== null)
    dispatch(fetchAllListedProduct({filterParams : filter,sortParams : sort}))
  },[dispatch,sort,filter])
   
 useEffect(()=>{
 if(productDetails !== null) SetOpenProductDialogue(true)
 },[productDetails])


  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-1 p-4 md:p-6">
      <Filter filter={filter} handleFilter={handleFilter}/>
      <div className="w-full p-4 rounded-lg shadow-sm bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-extrabold "> All products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{productList?.length} products</span>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button  className='' variant="outline" size='sm'>
                <ArrowUpDown className="w-4 h-4"/>
                <span>Sort by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-48">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {
                  sortoptions.map(sortItem=>
                  <DropdownMenuRadioItem 
                  value={sortItem.id }
                   key={sortItem.id}
                   >
                    {sortItem.label}
                  </DropdownMenuRadioItem> 
                  )
                }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {
            productList &&  productList.length > 0 
            ? productList.map(productItem=>
              (<ProductTile 
                handleProductDetails={handleProductDetails}
                key={productItem._id} 
                handleAddToCart={handleAddToCart}
                product={productItem}/>))
              :null   
          }
        </div>
      </div>
      <UserProductDetails 
      open={openProductDialogue}
       setOpen={SetOpenProductDialogue}
       productDetails={productDetails}
       />
    </div>
  )
}

export default UserProduct