import React from "react";
import firebase from "./utils/firebase";
import "firebase/auth";
function App() {
  React.useEffect(()=>{
    const email = 'abc@gmail.com'
    const password = '123456'
    firebase.auth().createUserWithEmailAndPassword(email,password).then(()=>{
      console.log('abc') 
    })
    
  })
  return "大功告成"
}
export default App;