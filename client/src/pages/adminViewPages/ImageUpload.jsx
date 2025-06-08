import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useRef } from 'react';

const ImageUpload = ({
    ImageFile,
    setImageFile,
    ImageUploadUrl,
    imageLoading,
    SetImageUploadUrl,
    setImageLoading,
    
 }) => {

  const inputRef =useRef(null);
 
  function handleImageFileChange (event){
 console.log(event.target.files);
 const selectedFile = event.target.files?.[0];
  if(selectedFile) {
    setImageFile(selectedFile);
}
  }

  function handleDragOver(event){  
    event.preventDefault()
  }

  function handleOnDrop(event){
    event.preventDefault()
   const droppedFile =  event.dataTransfer.files?.[0];
   if(droppedFile)  setImageFile(droppedFile);

  }

  function handleRemoveImage(){
    setImageFile(null)
    if(inputRef.current){
        inputRef.current.value = '';
    }
  }

async function uploadImageToCloudinary() {
    setImageLoading(true)
    const data = new FormData();
    data.append('my_file',ImageFile)
   const response = await axios.post('http://localhost:5000/api/admin/products/uploadImage',data) 
   console.log(response,'response')
   if(response.data?.success){
       SetImageUploadUrl(response.data.result.url);
       setImageLoading(false)
    }

       
}

 useEffect(()=>{
    if (ImageFile) uploadImageToCloudinary();
},[ImageFile])   


  return (
    <div className='w-full max-w-md mx-auto mt-10'>
      <label className='block mb-2 text-lg font-semibold'> Image upload</label>
      <div onDragOver={handleDragOver} onDrop={handleOnDrop} className='p-4 border border-dashed rounded-lg'>
        <Input type="file"
         id='image_upload' 
         className='hidden' 
         ref={inputRef} 
         onChange={handleImageFileChange}
          />
          {
            !ImageFile ? (<label htmlFor="image_upload" className='flex flex-col items-center justify-center h-32 cursor-pointer'>
                <UploadCloudIcon className='w-10 h-10 mb-2 text-muted-foreground'/>
                <span>Click to upload image</span>
            </label>) :( 
              imageLoading?
              (<Skeleton className='h-10 bg-gray-200 ' />):
             ( <div className='flex items-center justify-between'>
                 <div className='flex items-center'>
                   <FileIcon className='w-8 h-8 text-primary'/>
                 </div>
                 <p className='text-sm font-medium'>{ImageFile.name}</p>
                 <Button variant="ghost" size='icon' className='text-muted-foreground hover:text-foreground' 
                 onClick={handleRemoveImage}>
                    <XIcon className='w-4 h-4'/>
                 <span  className='sr-only'>Remove file</span>
                 </Button>
                 </div>))
          }
      </div>
    </div>
  )
}

export default ImageUpload
