import React from 'react'
import {Link, useParams} from "react-router-dom";
import Loader from '../component/Loader';
import Message from "../component/Message";
import  Header  from '../component/Header';
import { useGetProductsQuery } from '../redux/api/productApiSlice';
import Product from "./Products/Product"



const Home = () => {
    const {keyword} = useParams();
    const { data, isLoading, isError } = useGetProductsQuery( { keyword })
  return (
    <>
    {!keyword ?<Header/> : null }
    {isLoading ? (< Loader/>) : isError ? (<Message variant="danger">
    {isError?.data.Message || isError.error}
    </Message>
 ) : (
    <>
    <div className='flex justify-between items-center'>
        <h1 className='ml-[20rem] mt-[2rem] text-[2rem]'>
            Special Products
        </h1>

        <Link to="/shop" className='bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[2rem]'>
        Shop
        </Link>
    </div>

    <div>
        <div className='flex justify-center flex-wrap mt-[2rem]'>
            {data.products.map((product) => (
                <div key={product._id}>
                    <Product product = {product} />
                </div>
            ))}
        </div>
    </div> 
    </>

 )}
    </>
  )
}

export default Home
