import React from 'react'
import toast from 'react-hot-toast'
import DetailsCollections from './components/DetailsCollections';

export default async function page({params}:{params: Promise<{collectionId: string}>}) {

  const collectionId = (await params).collectionId

    const res = await fetch( `${process.env.NEXT_PUBLIC_BASE_URL}/api/collections/${collectionId}`, {
      method: "GET",
    })

    if(!res.ok){
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error fetching collection. Please try again later.</p>
        </div>
      );
    }

    const data = await res.json()

    if(data.error || !data.collection){
      toast.error(data.message);
      window.location.href="/collections"
    }
    
  return <DetailsCollections collection={data.collection} />
}