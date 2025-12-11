export default function CheckoutReview({ checkout }) {
  const {
    cart,
    cartTotal,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    paymentDetails,
  } = checkout.orderDraft; // Phase 2: all data stored in orderDraft

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------- */}
      {/* SHIPPING ADDRESS */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && (
            <p>{shippingAddress.addressLine2}</p>
          )}
          <p>
            {shippingAddress.city}, {shippingAddress.state}{' '}
            {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p>Phone: {shippingAddress.phone}</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* BILLING ADDRESS */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>{billingAddress.fullName}</p>
          <p>{billingAddress.addressLine1}</p>
          {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
          <p>
            {billingAddress.city}, {billingAddress.state}{' '}
            {billingAddress.postalCode}
          </p>
          <p>{billingAddress.country}</p>
          <p>Phone: {billingAddress.phone}</p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SHIPPING METHOD */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Shipping Method</h2>
        <p className="text-sm text-gray-700">
          {shippingMethod?.label} — {shippingMethod?.eta}
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* PAYMENT METHOD SUMMARY */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <p className="capitalize text-sm text-gray-700">{paymentMethod}</p>

        {/* Show minimal details depending on gateway */}
        {paymentMethod === 'stripe' && (
          <p className="text-xs mt-1 text-gray-500">
            Paying via Stripe Checkout — Email: <b>{paymentDetails.email}</b>
          </p>
        )}

        {paymentMethod === 'razorpay' && (
          <p className="text-xs mt-1 text-gray-500">
            Razorpay — {paymentDetails.name}, {paymentDetails.phone}
          </p>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* ORDER SUMMARY (Cart total) */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Items total:</span>
            <span>₹{cartTotal.items}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{cartTotal.shipping}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{cartTotal.tax}</span>
          </div>

          <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t">
            <span>Grand Total:</span>
            <span>₹{cartTotal.grand}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
