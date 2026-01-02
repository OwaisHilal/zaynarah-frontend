// src/features/admin/components/order/OrderDetailsModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill } from '../Pill';
import {
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  ExternalLink,
  Printer,
  ChevronRight,
  Clock,
} from 'lucide-react';

export function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus }) {
  const [updating, setUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState(order?.status || 'processing');
  const [localPayment, setLocalPayment] = useState(
    order?.paymentStatus || 'pending'
  );

  if (!order) return null;

  const handleSave = async () => {
    setUpdating(true);
    try {
      await onUpdateStatus(order._id, {
        status: localStatus,
        paymentStatus: localPayment,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update order', error);
    } finally {
      setUpdating(false);
    }
  };

  const createdDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {' '}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none rounded-[32px] shadow-2xl">
        {' '}
        <DialogHeader className="p-8 pb-0">
          {' '}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {' '}
            <div className="space-y-1">
              {' '}
              <div className="flex items-center gap-2">
                {' '}
                <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none rounded-lg font-black text-[10px] tracking-widest px-2">
                  {' '}
                  ORDER #{order._id.slice(-6).toUpperCase()}{' '}
                </Badge>{' '}
                <span className="text-slate-300">•</span>{' '}
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  {' '}
                  <Calendar size={12} /> {createdDate}{' '}
                </div>{' '}
              </div>{' '}
              <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">
                {' '}
                Manage Transaction{' '}
              </DialogTitle>{' '}
            </div>{' '}
            <div className="flex items-center gap-2">
              {' '}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 font-bold"
              >
                {' '}
                <Printer size={14} className="mr-2" /> Print Invoice{' '}
              </Button>{' '}
            </div>{' '}
          </div>{' '}
        </DialogHeader>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Items and Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50/50 rounded-[24px] border border-slate-100 p-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Package size={14} /> Line Items
              </h4>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="h-16 w-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.image || '/placeholder-product.png'}
                        alt={item.product?.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {item.product?.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        SKU:{' '}
                        {item.product?._id?.slice(-8).toUpperCase() || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </p>
                      <p className="text-[10px] font-bold text-slate-500">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/60 space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">
                    ₹{order.totalAmount - (order.shippingFee || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Shipping Fee</span>
                  <span className="text-slate-900">
                    ₹{order.shippingFee || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-black text-slate-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls and Customer */}
          <div className="space-y-6">
            {/* Status Update Card */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm ring-4 ring-slate-50/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Clock size={14} /> Workflow
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                    Order Fulfillment
                  </label>
                  <Select value={localStatus} onValueChange={setLocalStatus}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem
                        value="processing"
                        className="font-bold text-amber-600"
                      >
                        Processing
                      </SelectItem>
                      <SelectItem
                        value="shipped"
                        className="font-bold text-blue-600"
                      >
                        Shipped
                      </SelectItem>
                      <SelectItem
                        value="delivered"
                        className="font-bold text-emerald-600"
                      >
                        Delivered
                      </SelectItem>
                      <SelectItem
                        value="cancelled"
                        className="font-bold text-rose-600"
                      >
                        Cancelled
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                    Payment Status
                  </label>
                  <Select value={localPayment} onValueChange={setLocalPayment}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11 font-bold text-sm">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                      <SelectItem
                        value="pending"
                        className="font-bold text-amber-600"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        value="paid"
                        className="font-bold text-emerald-600"
                      >
                        Paid
                      </SelectItem>
                      <SelectItem
                        value="failed"
                        className="font-bold text-rose-600"
                      >
                        Failed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl shadow-slate-200">
              <h4 className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-4 flex items-center gap-2">
                <User size={14} /> Customer Profile
              </h4>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-indigo-400">
                  {order.user?.name?.charAt(0) || 'G'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black truncate">
                    {order.user?.name || 'Guest Checkout'}
                  </p>
                  <p className="text-xs opacity-60 truncate">
                    {order.user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex gap-3">
                  <MapPin
                    size={16}
                    className="text-indigo-400 mt-0.5 shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-black opacity-50 uppercase tracking-tighter text-[9px]">
                      Shipping Address
                    </p>
                    <p className="leading-relaxed opacity-90 font-medium">
                      {order.shippingAddress || 'No address provided'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CreditCard
                    size={16}
                    className="text-indigo-400 mt-0.5 shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-black opacity-50 uppercase tracking-tighter text-[9px]">
                      Method
                    </p>
                    <p className="opacity-90 font-medium">
                      {order.paymentMethod || 'Online Payment'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100 gap-3 rounded-b-[32px]">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={updating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold px-8 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            {updating ? 'Syncing...' : 'Update Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
