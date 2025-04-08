import { auth } from '@/auth'

import React from 'react'
import NoCreateCollection from './components/NoCreateCollection'

export default async function page() {
  
const session = await auth()

if (!session) {
  window.location.replace('/collections/all-collections');
}

if(session && (session.role === "USER")){
  window.location.replace("/collections/all-collections")
}

if (session && (session.collectionId || session.role !== "USER")) {
  window.location.replace("/collections/collection-dashboard")
} else if(session && (!session.collectionId)) {
  return <NoCreateCollection/>
}
  
}