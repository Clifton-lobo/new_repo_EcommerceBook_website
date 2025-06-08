// Your existing imports
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import banner4 from '../../assets/banner4.jpg';
import banner8 from '../../assets/banner8.jpg';
import banner6 from '../../assets/banner6.jpg';
import MiniSlider1 from '../../assets/banner8.jpg';
import MiniSlider2 from '../../assets/banner4.jpg';
import MiniSlider3 from '../../assets/MiniSlider3.jpeg';
import {
  BookOpen, BookText, GraduationCap, Stethoscope, Rocket,
  School, Building2, BarChart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllListedProduct, fetchProductDetails } from '@/store/user/productSlice/UserProductSlice';
import ProductTile from './ProductTile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/user/cartSlice/CartSlice';
import { useToast } from '@/hooks/use-toast';
import UserProductDetails from './UserProductDetails';

const UserHome = () => {
  const slides = [banner4, banner8, banner6];
  const MiniSlides = [MiniSlider1, MiniSlider2, MiniSlider3];
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector(state => state.UserProductSlice);
  const { user } = useSelector((state) => state.auth);
  const [openProductDialogue, SetOpenProductDialogue] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filter');
    const currentFilters = {
      category: [getCurrentItem.id]
    };
    sessionStorage.setItem('filter', JSON.stringify(currentFilters));
    navigate(`/user/products`);
  }

  function handleProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    dispatch(addToCart(
      { userId: user?.id, productId: getCurrentProductId, quantity: 1 }
    )).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: 'Product added to cart'
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) SetOpenProductDialogue(true);
  }, [productDetails]);

  useEffect(() => {
    dispatch(fetchAllListedProduct({ filterParams: {}, sortParams: 'price-lowtohigh' }));
  }, [dispatch]);

  const category = [
    { id: 'Fiction Book', label: 'Fiction Book', icon: BookOpen },
    { id: 'Comic Book', label: 'Comic Book', icon: BookText },
    { id: 'NCERT', label: 'NCERT', icon: GraduationCap },
    { id: 'Medical books', label: 'Medical', icon: Stethoscope },
    { id: 'Engineering books', label: 'Engineering books', icon: Rocket },
    { id: 'Academic Books(10-12)', label: 'Academic Books(10-12)', icon: School },
    { id: 'Government exam', label: 'Government exam', icon: Building2 },
    { id: 'CAT', label: 'CAT', icon: BarChart },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Carousel Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        {MiniSlides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}

        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white shadow-md hover:bg-gray-100"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      {/* Top Images Section */}
      <div className="flex p-5 gap-5 items-center justify-center flex-wrap w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[420px] w-full p-4 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <img src={slide} className="w-[420px] h-[250px] object-contain rounded-lg" />
          </div>
        ))}
      </div>

     

      {/* Shop by Category */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">Shop by Category</h2>
        </div>
        <div className="grid px-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {category.map((cat) => (
            <Card
              key={cat.id}
              onClick={() => handleNavigateToListingPage(cat, 'category')}
              className="cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-2 rounded-lg bg-white p-8 flex flex-col items-center justify-center text-center border border-gray-300"
            >
              <CardContent className="flex flex-col items-center justify-center">
                <cat.icon className="w-12 h-12 mb-3 text-blue-600" />
                <span className="text-lg font-semibold text-gray-800">{cat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="py-15 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">All Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productList && productList.length > 0 ? (
              productList.map(product => (
                <ProductTile
                  key={product.id}
                  product={product}
                  handleProductDetails={handleProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-gray-600 text-lg col-span-full">No books available</p>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <UserProductDetails
        open={openProductDialogue}
        setOpen={SetOpenProductDialogue}
        productDetails={productDetails}
      />

       {/* Quote Section */}
       <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-10 py-20 bg-gray-100">
        <img
          src={MiniSlider2}
          alt="Reuse Books"
          className="w-full md:w-1/2 h-auto rounded-lg shadow-md object-cover"
        />
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            “A book reused is a story retold.”
          </h2>
          <p className="text-gray-600 text-lg">
            Support sustainability by giving pre-loved books a second chance. Every reused book helps the planet and another curious mind.
          </p>
          <p className="text-gray-500 italic">— BookBazzar</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">BookBazzar</h3>
            <p className="text-gray-400">Empowering readers. Enabling reuse.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-gray-400">
              <li><a href="/user/products" className="hover:underline">Browse Books</a></li>
              <li><a href="/cart" className="hover:underline">Cart</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <p className="text-gray-400">Email: support@bookbazzar.com</p>
            <p className="text-gray-400">Phone: +91-9876543210</p>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-8 text-sm">
          © {new Date().getFullYear()} BookBazzar. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserHome;
