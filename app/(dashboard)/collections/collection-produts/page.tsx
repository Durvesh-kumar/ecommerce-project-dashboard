import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import React from "react";
import ProductsTable from "../../products/components/ProductsTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/coustemUi/DataTable";

export default async function page() {
  // Authenticate the user
  const session = await auth();

  // Redirect if the user is not logged in
  if (!session) {
    redirect("/sign-in");
  }

  // Redirect if the user is a regular user (not authorized to view this page)
  if (session && session.role === "USER") {
    redirect("/collections");
  }

  // Redirect if the user does not have a collection
  if (session && !session.collectionId) {
    redirect("/collections/create-collection");
  }

  // Fetch products associated with the user's collection
  const products = await prisma.product.findMany({
    where: {
      collectionId: session.collectionId,
    },
    orderBy: {
      createdAt: "desc", // Sort products by creation date in descending order
    },
    include:{
      collection:{
        select: {
          title: true,
          id: true
        }
      }
    }
  });

  // Redirect if no products are found
  if (!products || products.length === 0) {
    redirect("/products/create-product");
  }
  
  return (
    <div className='flex flex-col'>
      <h1 className='font-bold text-3xl m-3'>Products list</h1>
      <hr className='h-1 shadow-md bg-blue-400' />
      {
        session && (session.role !== "USER") ? (
          <div className='flex justify-end mr-7 mt-4'>
            <Link href="/products/create-product" className={`${buttonVariants({ variant: 'default' })} my-4`}>Create Producut <PlusIcon className='w-6 h-6'/></Link>
          </div>
        ): null 
      }

      {
        !products || products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
        ) 
        :
        (
          <div className='flex flex-col'>
            <DataTable columns={ProductsTable} data={products as ProductType[]} searchKey="title"/>
          </div>
        )
      }
    </div>
  )
}
