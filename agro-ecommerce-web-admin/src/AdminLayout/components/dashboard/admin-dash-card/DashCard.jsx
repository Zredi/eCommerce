import React, { useEffect } from 'react'
import { AiFillProduct } from 'react-icons/ai';
import { FaRupeeSign, FaUsers } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../../features/OrderReducer';
import { fetchProducts } from '../../../../features/ProductReducer';
import { fetchUsers } from '../../../../features/userReducer';


function DashCard() {

    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);
    const { products } = useSelector((state) => state.product);
    const { users } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchProducts());
        dispatch(fetchUsers());
    }, [dispatch]);

    const totalSales = orders?.reduce((total, order) => total + order.totalAmount, 0) || 0;

    const cards = [
        { title: 'Sales', value: `₹${totalSales.toLocaleString()}`, icon: <FaRupeeSign />, bgColor: 'bg-green-500' },
        { title: 'Orders', value: orders?.length || 0, icon: <FaCartShopping />, bgColor: 'bg-purple-500' },
        { title: 'Users', value: users?.length || 0, icon: <FaUsers />, bgColor: 'bg-blue-500' },
        { title: 'Products', value: products?.length || 0, icon: <AiFillProduct />, bgColor: 'bg-pink-500' },
      ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <div className={`w-16 h-16 rounded-full ${card.bgColor} flex items-center justify-center mb-4`}>
            {React.cloneElement(card.icon, { color: 'white', size: 24 })}
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-1">{card.title}</p>
          <p className="text-xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
    )
}

export default DashCard;
