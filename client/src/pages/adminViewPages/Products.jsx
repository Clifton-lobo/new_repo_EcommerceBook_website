import CommonForm from "@/components/common/Form";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/Config/Config";
import { useEffect, useState } from "react"
import ImageUpload from "./ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProduct } from "@/store/admin/productSlice/productSlice";
import { useToast } from "@/hooks/use-toast";
import ProductTile from '../../components/admin-view/ProductTile';

const initalFormData={
  image:null,
  title:'',
  description:'',
  category:'',
  language:'',
  bookcondition:'',
  author:'',
  price:0,
  totalStock:'',
  
}

const Products = () => {
  const [currentEditedId,setCurrentEditedId]=useState(null);
  const dispatch =useDispatch();
  const {productList}=useSelector(state=>state.adminProducts)
  const [createProductsDialogue,setCreateProductsDialogue]=useState(false);
  const [formData,setFormData]=useState(initalFormData);
  const[ImageFile,setImageFile] = useState(false);
  const[ImageUploadUrl,SetImageUploadUrl]=useState('');
const [imageLoading,setImageLoading] =useState(false)
  const {toast}=useToast();
  
  function onSubmit(event){
    event.preventDefault();
    
     currentEditedId !==null?
     dispatch(editProduct({
      id : currentEditedId,
      formData : formData, 
      // image: ImageUploadUrl
     })).then((data)=>{
      console.log(data,'edit');

      if(data?.payload?.success){
        dispatch(fetchAllProduct())
        setCreateProductsDialogue(false);
        setImageFile(null);
        setFormData(initalFormData)
      }
     }):

    dispatch( addNewProduct({
      ...formData,
      image:ImageUploadUrl
    })).then((data)=>{
      console.log(data,'data');
      if(data?.payload?.success){
        dispatch(fetchAllProduct())
        setCreateProductsDialogue(false);
        setImageFile(null);
        setFormData(initalFormData)
        toast({
          title:'Product added successfully',
          
        })
      }
    })
  }

 
  function handleDelete(getCurrentProductId){
    dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
      if(data?.payload?.success){
        dispatch(fetchAllProduct());
      }
    })
    console.log(getCurrentProductId,'getCurrentProductId');
  }
  
  function isFormValid(){
    return Object.keys(formData)
    .map((key)=>formData[key] !== '')
    .every((item)=>item)
  }
 
 useEffect(()=>{
   dispatch(fetchAllProduct())
},[dispatch])
  
 console.log(productList,'productList')

  return (
    <>
    <div className="flex justify-end w-full mb-5">
      <Button onClick={()=>setCreateProductsDialogue(true)}>Add new product</Button>
    </div>
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
     {
      productList && productList.length > 0 ?
      productList.map((productItems)=>
      <ProductTile 
      setCurrentEditedId={setCurrentEditedId}  
      setCreateProductsDialogue={setCreateProductsDialogue}
      setFormData={setFormData}
      product={productItems}
      handleDelete={handleDelete}
      />)
       : null
     }
      
    </div>
    <Sheet open={ createProductsDialogue} 
    onOpenChange={()=>{
      setCreateProductsDialogue(false);
      setCurrentEditedId(null);
      setFormData(initalFormData);
      
    }}>
      <SheetContent side="right" className='overflow-auto'>
        <SheetHeader>
          <SheetTitle className='text-2xl'>{
            currentEditedId ? 'Edit Product' : 'Add new Product'  
            }
            
          </SheetTitle>
        </SheetHeader>
        <ImageUpload 
        ImageFile={ImageFile} 
        setImageFile={setImageFile}
        ImageUploadUrl={ImageUploadUrl} 
        SetImageUploadUrl={SetImageUploadUrl} 
        imageLoading={imageLoading}
        currentEditedId={currentEditedId}
        setImageLoading={setImageLoading}
        />
        <div className="py-6">
          <CommonForm 
          formControls={addProductFormElements}
          formData={formData}
          setFormData={setFormData}
          buttonText={ currentEditedId ? 'Edit' : 'Add'}
          isBtnDisabled={!isFormValid()}
          onSubmit={onSubmit}/>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}

export default Products
