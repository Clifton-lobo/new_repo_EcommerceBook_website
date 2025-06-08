import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import AdminOrderDetails from '../admin-view/OrderDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersForAdmin, resetOrderDetails, debugOrders, clearError } from '@/store/admin/adminOrderSlice';
import { Badge } from '../ui/badge';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { AlertCircle, RefreshCw, Bug } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const AdminOrders = () => {
  const { orderList, isLoading, error, pagination } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(getAllOrdersForAdmin());
  };

  const handleDebug = () => {
    dispatch(debugOrders());
    setIsDebugMode(true);
  };

  const handleOpenDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrderId(null);
    dispatch(resetOrderDetails());
  };

  const handleExportToExcel = () => {
    try {
      const formattedData = orderList?.map((order) => ({
        'Order ID': order?._id || 'N/A',
        'User ID': order?.userId || 'N/A',
        'Date': order?.orderDate ? format(new Date(order.orderDate), 'dd MMM yyyy HH:mm') : 
               order?.createdAt ? format(new Date(order.createdAt), 'dd MMM yyyy HH:mm') : 'N/A',
        'Status': order?.orderStatus || 'N/A',
        'Payment Status': order?.paymentStatus || 'N/A',
        'Amount': order?.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : 'N/A',
        'Payment Method': order?.paymentMethod || 'N/A',
        'Razorpay Order ID': order?.razorpayOrderId || 'N/A',
        'Payment ID': order?.paymentId || 'N/A',
      })) || [];

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
      XLSX.writeFile(workbook, `OrdersHistory_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'cancelled':
      case 'rejected':
        return 'destructive';
      case 'processing':
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-semibold">
            Order Management
            {pagination.totalOrders > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({pagination.totalOrders} total orders)
              </span>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={handleDebug} 
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </Button>
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleExportToExcel} 
              disabled={isLoading || !orderList?.length}
            >
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isDebugMode && (
            <Alert className="mb-4">
              <AlertDescription>
                Debug mode active. Check console for detailed information about order fetching.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Loading orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : orderList?.length > 0 ? (
                  orderList.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs truncate max-w-[100px]" title={order._id}>
                        {order._id?.slice(-8) || 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs truncate max-w-[100px]" title={order.userId}>
                        {order.userId?.slice(-8) || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.orderDate ? format(new Date(order.orderDate), 'dd MMM yy HH:mm') : 
                         order.createdAt ? format(new Date(order.createdAt), 'dd MMM yy HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.orderStatus)}>
                          {order.orderStatus || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {order.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenDialog(order._id)}
                          disabled={isLoading}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No orders found</p>
                        <p className="text-sm">Orders will appear here once customers place them</p>
                        <Button 
                          onClick={handleRefresh} 
                          variant="outline" 
                          className="mt-2"
                          disabled={isLoading}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!pagination.hasPrevPage || isLoading}
                  onClick={() => dispatch(getAllOrdersForAdmin({ page: pagination.currentPage - 1 }))}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!pagination.hasNextPage || isLoading}
                  onClick={() => dispatch(getAllOrdersForAdmin({ page: pagination.currentPage + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrderId && (
            <AdminOrderDetails 
              orderId={selectedOrderId} 
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;