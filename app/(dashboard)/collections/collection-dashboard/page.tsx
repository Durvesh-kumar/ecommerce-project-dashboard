import { auth } from '@/auth'
import React from 'react'

export default async function page() {
  const session = await auth()
  if(!session){
    window.location.replace("/sign-in")
  }

  if(session && (!session.collectionId)){
    window.location.replace("/collections/create-collection")
  }
  return (
    <div>page</div>
  )
}