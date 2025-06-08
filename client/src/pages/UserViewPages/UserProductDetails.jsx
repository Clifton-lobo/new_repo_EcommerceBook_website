import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/store/user/cartSlice/CartSlice';
import { ShoppingBag, Shield, Truck, Award, ThumbsUp, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserProductDetails = ({ open, setOpen, productDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch =useDispatch();
   const {toast} =useToast();
    const {user} = useSelector(state=>state.auth)

    function handleAddToCart(getCurrentProductId) {
      console.log(getCurrentProductId)
      dispatch(addToCart( 
        {userId: user?.id, productId: getCurrentProductId, quantity: quantity}
      )).then(data => { 
        if(data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: 'Product added to cart' })
        } 
      })
    }

  // Increment/decrement handlers
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  // Check screen size on mount and when window resizes
  useEffect(() => {
    // Function to update state based on window width
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Content component shared between Dialog and Sheet
  const ProductContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Image Section - same for both mobile and desktop */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8 flex items-center justify-center relative">
        {/* Badge - adjusted padding for mobile */}
        {productDetails?.badge && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-indigo-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
            {productDetails?.badge}
          </div>
        )}
        {/* Image - adjusted max height for better mobile fit */}
        <img 
          src={productDetails?.image}
          alt={productDetails?.title}
          className="w-full h-auto object-contain max-h-64 md:max-h-80"
        />
      </div>
      
      {/* Content Section - adjusted padding and spacing for mobile */}
      <div className="p-4 md:p-8 bg-white">
        {/* Product title and author - reduced margins on mobile */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1">{productDetails?.title} ✨</h1>
          <h2 className="text-gray-600 text-xs md:text-sm">by {productDetails?.author} 🏆</h2>
        </div>
        
        {/* Price and description - adjusted text size */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <span className="text-xl md:text-2xl font-bold">${productDetails?.price}</span>
            {productDetails?.discount && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                SAVE {productDetails?.discount}% 🔥
              </span>
            )}
          </div>
          
          {/* Description - smaller text on mobile */}
          <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{productDetails?.description}</p>
          
          {/* Trust indicators - changed to flex-wrap on mobile */}
          <div className="flex flex-wrap md:grid md:grid-cols-2 gap-2 md:gap-4 my-4 md:my-6">
            <div className="flex items-center gap-1 md:gap-2">
              <Shield className="text-green-600 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Truck className="text-blue-600 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Award className="text-amber-600 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Quality Guarantee</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <ThumbsUp className="text-indigo-600 h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">24/7 Support</span>
            </div>
          </div>
        </div>
        
        {/* Quantity selector - smaller on mobile */}
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
         
          <div className="text-green-600 text-xs md:text-sm flex items-center">
            <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full mr-1 md:mr-2"></span>
            In Stock 👍
          </div>
        </div>
        
        {/* Add to cart button - same for both views */}
      <Button onClick={()=>handleAddToCart(productDetails?._id)} className="w-full text-white py-4 md:py-6 rounded-xl">
          <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          Add to Cart 
        </Button>
        
        {/* Customer social proof - smaller on mobile */}
        <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-500">
          <span className="inline-block animate-pulse">❤️</span> Loved by 2000+ happy customers
        </div>
      </div>
    </div>
  );

  // Return different components based on screen size
  return isMobile ? (
    // Mobile: Use Sheet component for bottom sheet behavior
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="p-0 rounded-t-xl h-[90vh] overflow-auto">
        {/* Close button for sheet */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 z-50 rounded-full h-8 w-8" 
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <ProductContent />
      </SheetContent>
    </Sheet>
  ) : (
    // Desktop: Use Dialog component
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden rounded-2xl max-w-4xl border-none">
        <ProductContent />
      </DialogContent>
    </Dialog>
  );
};

export default UserProductDetails;