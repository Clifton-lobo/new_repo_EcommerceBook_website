import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { AlignJustify, LogOut, UserRound, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { logoutUser } from '@/store/auth-slice/AuthSlice';
import CartWrapper from './CartWrapper';
import { useEffect, useState } from 'react';
import { fetchCartItems } from '@/store/user/cartSlice/CartSlice';
import { getSearchResults, resetSearchResults } from '@/store/user/SearchSlice/searchSlice';

const category = [
  { id: 'All books', label: 'All books' },
  { id: 'Fiction Book', label: 'Fiction Book' },
  { id: 'Comic Book', label: 'Comic Book' },
  { id: 'NCERT', label: 'NCERT' },
  { id: 'Medical books', label: 'Medical' },
  { id: 'Engineering books', label: 'Engineering books' },
  { id: 'Academic Books(10-12)', label: 'Academic Books(10-12)' },
  { id: 'Government exam', label: 'Government exam' },
  { id: 'CAT', label: 'CAT' },

];

function HeaderContent() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const HandleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex gap-5 lg:flex-row lg:items-center">
      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetTrigger asChild>
          <button 
            onClick={() => setOpenCartSheet(true)} 
            className="relative p-2 rounded-md hover:bg-gray-100"
          >
            <ShoppingCartOutlinedIcon fontSize="large" />
            <span className="sr-only">User Cart</span>
          </button> 
        </SheetTrigger>
        <SheetContent>
          <CartWrapper cartItems={cartItems?.items?.length > 0 ? cartItems.items : []} 
          setOpen={setOpenCartSheet} />
        </SheetContent>
      </Sheet>

      {/* User Dropdown */}
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
          <AvatarFallback className="text-white cursor-pointer bg-black font-extralight">
              {user?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 cursor-pointer">
          <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/user/account')}>
            <UserRound className="w-4 h-4 mr-2" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={HandleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const UserHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  function handleNavigateToListingPage(getCurrentItem) {
    sessionStorage.removeItem('filter');
    
    if (getCurrentItem.id === 'All books') {
      navigate('/user/products'); // Navigate to /products directly
    } else {
      const currentFilters = { category: [getCurrentItem.id] };
      sessionStorage.setItem('filter', JSON.stringify(currentFilters));
  
      if (location.pathname.includes('products')) {
        setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`));
      } else {
        navigate('/user/products');
      }
    }
    
    setIsMenuOpen(false);
  }
  

  function handleSearch(e) {
    if (e.key === 'Enter' && keyword.trim().length > 3) {
      navigate('/user/search');
    }
  }

  useEffect(() => {
    if (keyword?.trim() && keyword.trim().length > 3) {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(getSearchResults(keyword));
    } else {
      setSearchParams(new URLSearchParams(''));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section: Menu Icon + Logo + Search */}
        <div className="flex items-center space-x-4 flex-1">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <AlignJustify className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="px-2 py-6">
                <Link to="/user/home" className="flex items-center mb-6 space-x-2">
                  <MenuBookIcon fontSize="large" />
                  <span className="font-bold">BookBazzar</span>
                </Link>
                {category.map((item) => (
                  <button key={item.id} onClick={() => handleNavigateToListingPage(item)} className="text-sm flex flex-col p-2 font-medium text-left">
                    {item.label}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/user/home" className="flex items-center space-x-2">
            <MenuBookIcon fontSize="large" />
            <span className="font-bold md:block hidden">BookBazzar</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex cursor-pointer relative items-center w-full mx-12 max-w-[700px]">
            <Search className="absolute left-2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search books..." 
              className="p-2 pl-8 outline-none cursor-pointer w-full border-none bg-muted rounded-md"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Center Section: Search Bar for Small Screens */}
        <div className="flex md:hidden w-full items-center justify-center mt-2 px-4">
  <div className="relative w-full max-w-[350px]">
    <Search className="absolute left-3
     mt-3 w-5 h-5 text-gray-500" />
    <input
      type="text"
      placeholder="Search..."
      className="p-2 pl-10 w-full rounded-lg border bg-white shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={handleSearch}
    />
  </div>
</div>

        
        
        {/* Right Section */}
        <div className="flex items-center space-x-5">
          {isAuthenticated && <HeaderContent />}
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
