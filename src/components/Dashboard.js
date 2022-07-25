import { useEffect, useState } from "react"
import {auth} from '../utils/firebase' 
import {Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom"

import { useAuth } from "../contexts/AuthContext"


export default function Dashboard() {
  const history = useHistory()
  // const [currentUser, setCurrentUser] = useState()
  const { currentUser, logout } = useAuth()


  // Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  
  
  // useEffect(()=>{
  //   auth.onAuthStateChanged(user=>{
      
  //     setCurrentUser(user)
  //   })
  //   console.log('d')

  // },[])

  async function handleLogout() {
    // setError("")

    try {
      await auth.signOut()
      history.push("/login-form")
    } catch {
      // setError("Failed to log out")
    }
  }


  return <div>{currentUser && currentUser.email}
  
  <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
  </div>
}