import CommonForm from "@/components/common/Form"
import { RegisterFormControl } from "@/Config/Config"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/store/auth-slice/AuthSlice"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const InitialState ={
  username :'', 
  email:'',
  password:''
}
const Register = () => {

const [formData,setFormData] =useState(InitialState)
const dispatch = useDispatch();
const navigate = useNavigate();
const {toast} =useToast();

const onSubmit=(event)=>{
  event.preventDefault();
  dispatch(registerUser(formData)).then((data)=>{
    if (data?.payload?.success) {
      toast({
        description: data?.payload?.message,
      });
      navigate('/auth/login');   
    }else{
      toast({
        description: data?.payload?.message,
         variant: 'destructive',
      });
    } 
    console.log(data);
  })
}
console.log(formData);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="">

      <h1 className="mb-8 text-3xl font-bold tracking-tight text-center text-foreground">
            Create an account
          </h1>

         <CommonForm 
          
          formControls={RegisterFormControl}
          buttonText={"Sign Up"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          
         />
       <div className="mt-10 text-center">
         
          <p>
            Already have an account? 
            <Link className="font-bold hover:underline text-primary " 
            to='/auth/login'>Login</Link>
          </p>
       </div>
      </div>
    </div>
  )
}

export default Register
