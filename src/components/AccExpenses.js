import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Button,
  Grid,
  List,
  Icon,
  Image,
  Modal,
  Header,
  Form
} from 'semantic-ui-react';
import firebase from '../utils/firebase';
import Expenses from './Expenses';
function AccExpenses() {
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const currAcc = url.get('acc');
  const user = firebase.auth().currentUser;
  // 存放點選帳戶的值,再用此值和帳戶的值做比對,呈現三角圖示
  const [accName, setAccName] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  // const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    // firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase
        .firestore()
        .collection('accounts')
        .where('user_id', '==', user.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return {...doc.data(),id:doc.id};
          });
          setRows(data);
        });
    }
    // });
  }, []);
  

  return (
    <Container>
      <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column width={3}>
            <List selection size="large">
              {rows.map((row, i) => {
                return (
                  <List.Item
                    active={currAcc == row.name}
                    key={i}
                    as={Link}
                    to={`/acc-expenses?acc=${row.id}`}
                  >
                    {currAcc == row.name ? <Icon name="right triangle" /> : ''}
                    <List.Content>
                      {row.name}
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
            
           
          </Grid.Column>
          <Grid.Column width={10}>
            <Expenses />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {/* <Dropdown text="帳戶">
        <Dropdown.Menu>
          {rows.map((row, i) => {
            return <Dropdown.Item key={i} text={row.name} />;
          })}
        </Dropdown.Menu>
      </Dropdown> */}
    </Container>
  );
}
export default AccExpenses;
