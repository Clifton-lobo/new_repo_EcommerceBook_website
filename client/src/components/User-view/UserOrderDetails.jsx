import React from 'react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const UserOrderDetails = ({ orderDetails }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case 'shipped':
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4 p-4 h-[calc(100vh-100px)] overflow-y-auto">
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="truncate">{orderDetails._id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{format(new Date(orderDetails.orderDate), 'dd MMM yyyy, hh:mm a')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {getStatusBadge(orderDetails.orderStatus)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment</p>
              <p>{orderDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-medium">₹{orderDetails.totalAmount.toFixed(2)}</p>
            </div>
            {orderDetails.paymentId && (
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="truncate">{orderDetails.paymentId}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items Card */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.cartItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="line-clamp-2">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="break-words">{orderDetails.addressInfo.address}</p>
              <p>{orderDetails.addressInfo.city}, {orderDetails.addressInfo.pincode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p>{orderDetails.addressInfo.phone}</p>
            </div>
            {orderDetails.addressInfo.notes && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Delivery Notes</p>
                <p className="break-words">{orderDetails.addressInfo.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrderDetails;