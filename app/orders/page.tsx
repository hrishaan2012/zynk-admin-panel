'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShoppingCart, User, MapPin, Phone, Mail, Truck } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    fetchOrders()
    fetchDrivers()
  }, [statusFilter])

  const fetchOrders = async () => {
    let query = supabase
      .from('orders')
      .select(`
        *,
        users!orders_user_id_fkey(full_name, email, phone),
        driver:users!orders_driver_id_fkey(full_name, phone),
        addresses(*),
        order_items(*, products(name, image_url))
      `)
      .order('created_at', { ascending: false })

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    setOrders(data || [])
  }

  const fetchDrivers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*, driver_details(*)')
      .eq('role', 'driver')
      .eq('driver_details.is_available', true)

    setDrivers(data || [])
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update order status')
    } else {
      toast.success('Order status updated')
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    }
  }

  const assignDriver = async (orderId: string, driverId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({
        driver_id: driverId,
        status: 'assigned'
      })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to assign driver')
    } else {
      toast.success('Driver assigned successfully')
      fetchOrders()
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-indigo-100 text-indigo-800',
      assigned: 'bg-cyan-100 text-cyan-800',
      picked_up: 'bg-orange-100 text-orange-800',
      in_transit: 'bg-teal-100 text-teal-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const statusOptions = [
    'pending', 'confirmed', 'preparing', 'ready', 
    'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                !statusFilter ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All Orders
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize ${
                  statusFilter === status ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer transition ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-green-500' : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{order.order_number}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{order.users?.full_name || 'Guest'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">
                      {order.addresses?.address_line1}, {order.addresses?.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                    <span>{order.order_items?.length || 0} items</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="font-bold text-green-600">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  {order.driver && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Truck className="w-3 h-3" />
                      {order.driver.full_name}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:sticky lg:top-4 h-fit">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Order Details</h2>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{selectedOrder.users?.full_name || 'Guest'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedOrder.users?.email}</span>
                    </div>
                    {selectedOrder.users?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedOrder.users.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.addresses?.address_line1}</p>
                    {selectedOrder.addresses?.address_line2 && (
                      <p>{selectedOrder.addresses.address_line2}</p>
                    )}
                    <p>
                      {selectedOrder.addresses?.city}, {selectedOrder.addresses?.state}{' '}
                      {selectedOrder.addresses?.postal_code}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            {item.products?.image_url ? (
                              <img
                                src={item.products.image_url}
                                alt={item.product_name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ShoppingCart className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.product_name}</p>
                            <p className="text-xs text-gray-500">
                              ${Number(item.unit_price).toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          ${Number(item.total_price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6 pt-4 border-t">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${Number(selectedOrder.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${Number(selectedOrder.delivery_fee).toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${Number(selectedOrder.discount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-green-600">
                        ${Number(selectedOrder.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Update Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status} className="capitalize">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assign Driver */}
                {!selectedOrder.driver_id && selectedOrder.status === 'ready' && (
                  <div>
                    <h3 className="font-semibold mb-3">Assign Driver</h3>
                    <select
                      onChange={(e) => assignDriver(selectedOrder.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.full_name} - {driver.driver_details?.vehicle_type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Driver Info */}
                {selectedOrder.driver && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Assigned Driver</h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedOrder.driver.full_name}</p>
                      {selectedOrder.driver.phone && (
                        <p className="text-gray-600">{selectedOrder.driver.phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
