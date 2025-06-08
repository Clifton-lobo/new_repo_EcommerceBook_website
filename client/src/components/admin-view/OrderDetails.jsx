// AdminOrderDetails.jsx
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/adminOrderSlice';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AdminOrderDetails = ({ orderId, onClose }) => {
  const dispatch = useDispatch();
  const { orderDetails } = useSelector((state) => state.adminOrder);
  const [status, setStatus] = React.useState('');

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailsForAdmin(orderId));
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    if (orderDetails) {
      setStatus(orderDetails.orderStatus);
    }
  }, [orderDetails]);

  const handleStatusUpdate = () => {
    dispatch(updateOrderStatus({ id: orderId, orderStatus: status }))
      .then(() => {
        dispatch(getOrderDetailsForAdmin(orderId));
      });
  };

  if (!orderDetails) return <div className="p-4">Loading order details...</div>;

  return (
    <div className="grid gap-4 p-6 max-w-4xl mx-auto bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order #{orderDetails._id.slice(-8)}</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span>{format(new Date(orderDetails.orderDate), 'dd MMM yyyy, hh:mm a')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={
                orderDetails.orderStatus === 'delivered' ? 'success' :
                orderDetails.orderStatus === 'cancelled' ? 'destructive' :
                'default'
              }>
                {orderDetails.orderStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment</span>
              <Badge variant={orderDetails.paymentStatus === 'paid' ? 'success' : 'destructive'}>
                {orderDetails.paymentStatus}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="font-medium">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span>{orderDetails.user?.username || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Contact</span>
              <span>{orderDetails.addressInfo?.phone || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.cartItems?.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-10 h-10 object-cover rounded"
                      />
                      <span>{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p>{orderDetails.addressInfo?.address}</p>
              <p>{orderDetails.addressInfo?.city}, {orderDetails.addressInfo?.pincode}</p>
            </div>
            {orderDetails.addressInfo?.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p>{orderDetails.addressInfo.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusUpdate}>Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrderDetails;