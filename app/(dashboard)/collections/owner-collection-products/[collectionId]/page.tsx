import { auth } from "@/auth";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DataTable } from "@/components/coustemUi/DataTable";
import toast from "react-hot-toast";
import ProductsTable from "@/app/(dashboard)/products/components/ProductsTable";

export default async function page({params}:{params: Promise<{CollectionId: string}>}) {

    const collectionId = (await params).CollectionId

    if(!collectionId){
        toast.success("Collection not found")
        window.location.replace("/collections");
    }
  // Authenticate the user
  const session = await auth();

  // Redirect if the user is not logged in
  if (!session) {
    window.location.replace("/sign-in");
  }

  // Redirect if the user is a regular user (not authorized to view this page)
  if (session && session.role !== "OWNER") {
    window.location.replace("/collections");
  }

  // Redirect if the user does not have a collection

  // Fetch products associated with the user's collection
  const res = await fetch(`/api/collections/products/${collectionId}`, {
    method: "GET",
    cache: "no-cache"
  });

  const data = await res.json()

  if(data.error){
    toast.error(data.message);
    window.location.replace("/collections")
  }
  // Redirect if no products are found
  if (!data.products || data.products.length === 0) {
    window.location.replace("/products/create-product");
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
        !data.products || data.products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
        ) 
        :
        (
          <div className='flex flex-col'>
            <DataTable columns={ProductsTable} data={data.products} searchKey="title"/>
          </div>
        )
      }
    </div>
  )
}
