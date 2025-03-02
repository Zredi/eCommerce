import React, { Component } from "react";

//components
import DashCard from "./admin-dash-card/DashCard";
import OrdersTable from "./admin-dash-table/OrdersTable";
import ProductsTable from "./admin-dash-table/ProductsTable";

function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-5">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#5A9A7A] to-[#2DD4BF] bg-clip-text text-transparent mb-8">Dashboard</h2>
      <DashCard/>
      <div className='mt-12'>
      <OrdersTable/>
      </div>
      <div className='mt-12 mb-10'>
      <ProductsTable/>
      </div>
    </div>
  )
}

export default Dashboard
