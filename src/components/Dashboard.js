import { useEffect, useState } from "react"
import {auth} from '../utils/firebase' 
import {Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom"
export default function Dashboard() {
  const history = useHistory()
  const [currentUser, setCurrentUser] = useState()
  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      
      setCurrentUser(user)
    })
    console.log('d')

  },[])

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