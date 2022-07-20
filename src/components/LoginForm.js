import React from 'react'
import { Container, Form, Button, Input } from 'semantic-ui-react';
import firebase from '../utils/firebase';
function LoginForm() {
  const [email, setEmail] = React.useState('mkdodos@gmail.com');
  const [password, setPassword] = React.useState('123456')
  // const [user, setUser] = React.useState(null);
  function login() {
    firebase.auth().signInWithEmailAndPassword(email,password).then((user)=>{
      console.log(user)
      // setUser(currUser)
    })
    
  }
  return (
    <Container>
      <Form onSubmit={login}>
        <Form.Field>
          <label>帳號</label>
          <Input  value={email}
          onChange={e=>setEmail(e.target.value)}
          placeholder="請輸入帳號" />
        </Form.Field>
        <Form.Field>
          <label>密碼</label>
          <input value={password}
          onChange={e=>setPassword(e.target.value)}
          placeholder="請輸入密碼" />
        </Form.Field>  
        <Form.Button>確定</Form.Button>
             
      </Form>
    </Container>
  );
}

export default LoginForm;
