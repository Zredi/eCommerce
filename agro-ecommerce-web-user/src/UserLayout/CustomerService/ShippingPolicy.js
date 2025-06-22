import { DotSquare } from 'lucide-react'
import React from 'react'

function ShippingPolicy() {
  return (
    <div className='mt-20 px-20'>
        <h2>Shipping Policy</h2>
        <p>At [Your Company Name], we are committed to delivering your orders in a timely and efficient manner.</p>
        <h4>Shipping Methods & Delivery Time</h4>
        <ol>
            <li>We offer standard and express shipping options.</li>
            <li>Orders are processed within [X] business days.</li>
            <li>Delivery times vary based on location and shipping method chosen at checkout.</li>
        </ol>
        <h4>Shipping Charges</h4>
        <ol>
            <li>Shipping charges are calculated at checkout based on weight and destination.</li>
            <li>Free shipping is available on orders above [X amount].</li>
        </ol>
        <h4>Order Tracking</h4>
        <p>Once your order is shipped, you will receive a tracking number via email or SMS.</p>
        <h4>International Shipping</h4>
        <p>We currently [do/do not] offer international shipping. Additional customs fees may apply.</p>
        <h4>Lost or Delayed Shipments
        </h4>
        <p>If your order is delayed or lost, please contact our support team at [support@email.com].

</p>

    </div>
  )
}

export default ShippingPolicy