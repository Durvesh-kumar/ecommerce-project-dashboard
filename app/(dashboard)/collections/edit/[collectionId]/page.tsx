import {  buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { CollectionForm } from '../../components/CollectionForm';
import { auth } from '@/auth';

export default async function page({params}:{params: Promise<{collectionId: string}>}) {
    const session = await auth();
    if(!session){
        redirect("/collections");
    }
    const collectionId = (await params).collectionId

    if(!collectionId){
        redirect("/collections");
    }

    if(session && (session.collectionId !== collectionId && session.role !== "OWNER")){
      redirect("/collections");
    }

    if(session && (session.role === "USER")){
      redirect("/collections");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collections/${collectionId}`,{
        method: "GET",
        cache: "no-store"
    });

    if(!res.ok){
        return (
            <div className='flex items-center justify-center h-screen'>
            <div className="flex items-center justify-center h-full flex-col space-3">
              <p className="text-red-500">Error fetching collection. Please try again later.</p>
              <div className='flex items-center space-y-3'>
              <Link href="/collections" className={buttonVariants({ variant: 'default' })}>Back</Link>
              </div>
              
            </div>
            </div>
          );
    }

    const data = await res.json();
    if(data.error || data.collection.length === 0){
        toast.error(data.message)
        redirect("/collections")
    }

    if(!data.collection || data.collection.length === 0){
        redirect("/collections")
    }

    if(data.collection.id !== session.collectionId){
      redirect("/collections")
    }



  return (
    <div>
        <CollectionForm initialData={data.collection}/>
    </div>
  )
}
