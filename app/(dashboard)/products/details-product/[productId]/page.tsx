import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import ProductDetails from './components/ProductDetails';

export default async function page({params}: {params: Promise<{ productId: string }>}) {

    const productId = (await params).productId;

    if(!productId){
        toast.error("ProductId is required");
        redirect("/products")
    }

    const session = await auth();

    if(!session){
        redirect("/sign-in")
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });

    if(!product){
        toast.error("Product is not found");
        redirect("/products")
    }

  return <ProductDetails productData={product} session={session}/>
}