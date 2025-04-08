import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page() {
  const session = await auth()
  if(!session){
    redirect("/sign-in")
  }

  if(session && (!session.collectionId)){
    redirect("/collections/create-collection")
  }
  return (
    <div>page</div>
  )
}