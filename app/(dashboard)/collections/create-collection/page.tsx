import React from 'react'
import { CollectionForm } from '../components/CollectionForm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await auth()
  if(!session){
    redirect("/sign-in");
  }

  if(session &&(session.collectionId)){
    redirect("/collections/collection-dashboard");
  }

  if(session &&(session.role === "USER")){
    redirect("/collections");
  }
  return (
    <div>
        <CollectionForm />
    </div>
  )
}
