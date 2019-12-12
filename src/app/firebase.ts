import firebase from "firebase/app"

import "firebase/auth"
import "firebase/functions"
import "firebase/analytics"
import "firebase/firestore"

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
})

export const auth = firebase.auth()
export const functions = firebase.app().functions("europe-west1")
export const analytics = firebase.analytics()

export function firestore(): firebase.firestore.Firestore
export function firestore(coll: string): firebase.firestore.CollectionReference
export function firestore(coll: string, doc: string): firebase.firestore.DocumentReference
export function firestore(coll?: string, doc?: string) {
  const firestore = firebase.firestore()
  if (!coll) return firestore
  const db = firestore.collection(coll)
  return doc ? db.doc(doc) : db
}

export default firebase
