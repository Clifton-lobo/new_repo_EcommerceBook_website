import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import bookshelf from '../../assets/bookshelf.jpg'
import Address from '@/components/User-view/Address'
import UserOrders from '@/components/User-view/Orders'

const Account = () => {
  return (
    <div className='flex flex-col'>
      <div className="relative h-[300px] object-cover w-full overflow-hidden">
        <img 
          src={bookshelf}
          className='h-full w-full object-cover'
        />
      </div>
      <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
        <div className='flex flex-col rounded bg-background p-6 shadow-sm'>
          <Tabs defaultValue='orders'>
                <TabsList>
                  <TabsTrigger value='orders'> Orders</TabsTrigger>
                <TabsTrigger value='address'>Address</TabsTrigger>
                </TabsList>
                <TabsContent value='orders'>
                  <UserOrders/>
                </TabsContent>
                <TabsContent value='address'>
                  <Address/>
                </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Account
