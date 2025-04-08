import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { ProductForm } from '../../components/ProductForm';

export default async function page({params}:{params: Promise<{productId: string}>}) {
  const productId = (await params).productId

  const session = await auth();

  if(!productId){
    redirect("/products")
  }

  if(!session){
    redirect("/sign-in")
  }

  if(session && (session.role === "USER")){
    redirect("/products")
  }

  if(session && (!session.collectionId)){
    redirect("/collections/create-collection")
  }

  const findProduct = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if(!findProduct.ok){
    redirect("/products")
  }

  const data = await findProduct.json()

  if(!data.product || data.product.length === 0){
    redirect("/products")
  }

  if(data.product.collectionId !== session.collectionId){
    redirect("/products")
  }

  return <ProductForm initialData={data.product}/>
}