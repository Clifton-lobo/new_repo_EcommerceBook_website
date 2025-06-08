import { Minus, Plus, Trash } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartItem } from '@/store/user/cartSlice/CartSlice';
import { useToast } from '@/hooks/use-toast';
 
const CartContent = ({ cartItems }) => {

 const dispatch = useDispatch();
  const {user}=useSelector(state=>state.auth);
  const {toast} =useToast();

  function handleCartItemDelete(getCartItem){
  dispatch(deleteCartItem({userId : user?.id ,productId :getCartItem?.productId}))
  .then(data =>{
    if(data?.payload?.success)
      toast({
     title:'cart updated'
      })
   })
  }
  function handleUpdateQuantity(typeOfAction) {
    // Make sure we consistently use 'plus' and 'minus' as the action types
    const newQuantity = typeOfAction === 'plus' 
      ? cartItems?.quantity + 1 
      : cartItems?.quantity - 1;
    
    // Don't dispatch if quantity would be less than 1
    if (newQuantity < 1) return;
    
    console.log("Updating quantity:", {
      userId: user?.id,
      productId: cartItems?.productId,
      quantity: newQuantity,
      action: typeOfAction // Log the action to verify
    });
    
    dispatch(updateCartItem({
      userId: user?.id,
      productId: cartItems?.productId,
      quantity: newQuantity
    }))
    .then(data => {
      if(data?.payload?.success) {
        toast({
          title: 'Cart updated'
        });
      }
    })
    .catch(error => {
      console.error("Update error:", error);
    });
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-xl border border-gray-200">
      <img 
        src={cartItems?.image} 
        className="w-12 h-15 rounded-lg object-cover border border-gray-300" 
        alt={cartItems?.title} 
      />

      <div className="flex-1 mx-4 space-y-2">
        <h3 className="text-md font-semibold text-gray-800 leading-tight">{cartItems?.title}</h3>

        <div className="flex items-center gap-3">
          <Button variant="outline"
           className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-200 transition"
           onClick={()=>handleUpdateQuantity('minus')}
           disabled={cartItems?.quantity == 1}
           >
            <Minus  className="w-4 h-4 text-gray-700" />
          </Button>

          <span className="text-md font-medium text-gray-800">{cartItems?.quantity}</span>

          <Button onClick={()=>handleUpdateQuantity('plus')} variant="outline" className="h-8 w-8 rounded-full border-gray-300 hover:bg-gray-200 transition">
            <Plus className="w-4 h-4 text-gray-700" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <p className="text-lg font-semibold text-gray-900">
          ₹{((cartItems?.price) * cartItems?.quantity).toFixed(2)}
        </p>

        <button onClick={()=>handleCartItemDelete(cartItems)} className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition">
          <Trash  className="h-5 w-5 text-red-500 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default CartContent;
