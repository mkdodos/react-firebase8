import React from 'react';
import {
  Container,
  Form,
  Button,
  Icon,
  Input,
  Card,
  Grid,
  Image,
  Segment,
} from 'semantic-ui-react';
import firebase from '../utils/firebase';
import { useHistory } from 'react-router-dom';
function LoginForm() {
  const history = useHistory();
  const [email, setEmail] = React.useState('mkdodos@gmail.com');
  const [password, setPassword] = React.useState('123456');
  // const [user, setUser] = React.useState(null);
  function login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        // console.log(user)
        history.push('/balances');
        // setUser(currUser)
      });
  }
  return (
    <Container>
      <div>
        <Grid>
          <Grid.Column mobile={16} tablet={3} computer={5}>
            {/* <Segment>2</Segment> */}
          </Grid.Column>
          <Grid.Column mobile={16} tablet={10} computer={6}>
            <Segment>
            <Form onSubmit={login}>
              <Form.Field>
                <label>帳號</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="請輸入帳號"
                />
              </Form.Field>
              <Form.Field>
                <label>密碼</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入密碼"
                />
              </Form.Field>
              <Form.Button primary>確定</Form.Button>
            </Form>
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={3} computer={5}>
            {/* <Segment>2</Segment> */}
          </Grid.Column>
        </Grid>
      </div>
    </Container>
  );
}

export default LoginForm;
