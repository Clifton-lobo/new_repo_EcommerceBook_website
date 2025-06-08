import React, { useState } from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import CartContent from './CartContent';
import { useNavigate } from 'react-router-dom';


const CartWrapper = ({ cartItems,setOpen}) => {

  const navigate =useNavigate();

 function handleCheckout(){
   setOpen(false)
   navigate('/user/checkout')
 }

 const totalCartAmount =  cartItems && cartItems.length > 0 
  ? cartItems.reduce( (sum,currentItem)=>
      sum + 
    (currentItem?.price)*currentItem?.quantity,0
  ) : 0 ;
  return (
    <SheetContent  onOpenChange={setOpen} className="sm:max-w-md max-h-screen flex flex-col">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* Scrollable Cart Items */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-4 px-2">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <CartContent key={item.id} cartItems={item} />)
        ) : (
          <p className="text-center text-gray-500">Your cart is empty</p>
        )}
      </div>

      {/* Fixed Checkout Section */}
      <div className="bg-white p-4 border-t shadow-md">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
        <Button onClick={handleCheckout} className="w-full mt-4">CheckOut</Button>
      </div>
    </SheetContent>
  );
};

export default CartWrapper;
