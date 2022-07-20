import { Button, Container, Header } from "semantic-ui-react"
import firebase from "../utils/firebase"
import React from "react"
function MySettings() {
  const user=firebase.auth().currentUser || {}
  const [displayName, setDisplayName] = React.useState('')
  React.useEffect(()=>{
    // setDisplayName(user.displayName)
  })
  function updateUserProfile() {
    user.updateProfile({
      displayName:displayName
    }).then(()=>{
      setDisplayName('')
    })
  }
  return  (
  <Container>
  <Header>{user.displayName}</Header>
  <input value={displayName}
  onChange={(e)=>{setDisplayName(e.target.value)}}
  />
  <Button onClick={updateUserProfile}>更新</Button>
  </Container>
  )
  
}
export default MySettings