import Address from '@/components/User-view/Address'
import library from '../../assets/library.jpg'
import { useDispatch, useSelector } from 'react-redux'
import CartContent from '@/components/User-view/CartContent'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { createRazorpayOrder, confirmFinalOrder } from '@/store/user/OrderSlice/OrderSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Checkout = () => {
  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector(state => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Calculate total amount
  const totalCartAmount = cartItems?.items?.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),  0
 ) || 0

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayPayment = async () => {
    if (!currentSelectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
  
    // Validate address has required fields
    if (!currentSelectedAddress.address || !currentSelectedAddress.city || 
        !currentSelectedAddress.pincode || !currentSelectedAddress.phone) {
      toast.error('Please complete all address fields');
      return;
    }
  
    setIsProcessing(true);
  
    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Failed to load payment gateway');
      }
  
      // 2. Create order on backend
      const razorRes = await dispatch(createRazorpayOrder({
        totalAmount: totalCartAmount,
        cartItems: cartItems.items.map(item => ({
          productId: item?.productId,
          title: item?.title,
          image: item?.image,
          price: item?.price,
          quantity: item?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?.id,
          address: currentSelectedAddress.address,
          city: currentSelectedAddress.city,
          pincode: currentSelectedAddress.pincode,
          phone: currentSelectedAddress.phone,
          notes: currentSelectedAddress?.notes || ''
        },
        userId: user?.id
      }));
  
      // Handle rejected action
      if (createRazorpayOrder.rejected.match(razorRes)) {
        throw new Error(razorRes.payload?.message || 'Order creation failed');
      }
  
      const { razorpayOrderId, currency } = razorRes.payload;
  
      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(totalCartAmount * 100), // Amount in paise
        currency: currency || 'INR',
        name: "BookBazzar",
        description: "Order Payment",
        order_id: razorpayOrderId,
        // Checkout.jsx
handler: async function (response) {
  try {
    const result = await dispatch(confirmFinalOrder({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      userId: user?.id
    }));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success('Payment verified successfully!');
      navigate('/user/success');
    } else {
      throw new Error(result.payload?.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification error:', {
      error: error.message,
      response
    });
    toast.error(error.message || 'Payment verification failed');
  }
},
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: currentSelectedAddress.phone
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            toast('You can complete payment later', { icon: 'ℹ️' });
          }
        }
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();
  
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img 
          src={library} 
          className='h-full w-full object-cover object-center' 
          alt="Library background" 
        />
      </div>
      
      <div className='grid grid-cols-1 flex-1 sm:grid-cols-2 gap-3 mt-5 p-5'>
        <Address 
          setCurrentSelectedAddress={setCurrentSelectedAddress} 
          selectedAddress={currentSelectedAddress}
        />
        
        <div className='flex flex-col gap-4'>
          {cartItems?.items?.map((item, index) => (
            <CartContent key={`${item.productId}-${index}`} cartItems={item} />
          ))}
          
          <div className="bg-white p-2">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold bg-slate-200 p-2 rounded">
                ₹{totalCartAmount.toFixed(2)}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleRazorpayPayment} 
            className="w-full"
            disabled={!currentSelectedAddress || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Checkout