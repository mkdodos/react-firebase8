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
        history.push('/accounts');
        // setUser(currUser)
      });
  }
  return (
    <Container style={{ height: '100vh' }}>
      <Grid columns="equal">
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Segment>1</Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={4}>
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
              <Form.Button>確定</Form.Button>
            </Form>

            <Card>
              <Card.Content></Card.Content>
            </Card>
          </Segment>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <Segment>3</Segment>
        </Grid.Column>
      </Grid>

      <Grid centered columns={2}>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>
            <Card>
              <Card.Content>
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
                  <Form.Button>確定</Form.Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default LoginForm;
