import CommonForm from "@/components/common/Form"
import { useToast } from "@/hooks/use-toast";
import {LoginFormControl} from '../../Config/Config'
import { loginUser } from "../../store/auth-slice/AuthSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Links, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate= useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        // if(data.payload.user.role === 'user'){
        //   navigate('/user/home');

        // }else if(data.payload.user.role=== 'admin'){
        //   navigate('/admin/dashboard');
        // }
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="ml-2 font-medium text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={LoginFormControl}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;