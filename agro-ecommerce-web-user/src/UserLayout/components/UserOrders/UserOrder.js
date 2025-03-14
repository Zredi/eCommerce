import React , { useEffect, useState } from 'react'
import "../assets/css/Orders.css";
import { db } from "../firebase";
import { useStateValue } from '../StateProvider';
import Order from './Order';

function Orders() {
    const [{ basket, user }, dispatch] = useStateValue();
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      if(user) {
          db
          .collection('users')
          .doc(user?.uid)
          .collection('orders')
          .orderBy('created', 'desc')
          .onSnapshot(snapshot => (
              setOrders(snapshot.docs.map(doc => ({
                  id: doc.id,
                  data: doc.data()
              })))
          ))
      } else {
          setOrders([])
      }
  
    }, [user])
  
      return (
          <>
          <div> Hiii</div>
          </>
      )
  }
  
  export default Orders