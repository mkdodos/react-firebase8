import { Button, Container, Header, Input, Form } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import React from 'react';
function MySettings({user}) {
  // const user = firebase.auth().currentUser || {};
  const [displayName, setDisplayName] = React.useState('');
  React.useEffect(() => {
    // setDisplayName(user.displayName)
  });
  function updateUserProfile() {
    user
      .updateProfile({
        displayName: displayName,
      })
      .then(() => {
        setDisplayName('');
      });
  }
  return (
    <Container>
      <Header>{user.displayName}</Header>
      {/* <Input
        value={displayName}
        onChange={(e) => {
          setDisplayName(e.target.value);
        }}
      />
      <Button onClick={updateUserProfile}>更新</Button> */}

     
      <Form onSubmit={updateUserProfile}>
          <Form.Group>
            <Form.Input
              placeholder='Name'
              name='name'
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
          
            <Form.Button color='teal' content='更新' />
          </Form.Group>
        </Form>



      
      
    </Container>
  );
}
export default MySettings;
