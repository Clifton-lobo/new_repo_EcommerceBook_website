import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import UserOrderDetails from './UserOrderDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/user/OrderSlice/OrderSlice';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const UserOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.userOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user?.id]);

  console.log('orderDetaoils', orderDetails);

  const handleFetchDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails(orderId));
    setOpenDetailsDialog(true);
  };

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

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge className="bg-yellow-500">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History <span className='text-gray-600 text-base'>({orderList.length})</span></CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && orderList.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell className="font-medium">
                      {orderItem._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {format(new Date(orderItem.orderDate), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(orderItem.orderStatus)}
                    </TableCell>
                    <TableCell>
                      {getPaymentBadge(orderItem.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{orderItem.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFetchDetails(orderItem._id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        
        <Dialog open={openDetailsDialog} onOpenChange={(open) => {
          if (!open) {
            setOpenDetailsDialog(false);
            dispatch(resetOrderDetails());
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Order Details</DialogTitle>
            {isLoading && !orderDetails ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : orderDetails ? (
              <UserOrderDetails orderDetails={orderDetails} />
            ) : (
              <p>Unable to load order details</p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserOrders;