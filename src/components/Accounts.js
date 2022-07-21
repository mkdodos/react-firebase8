import React from 'react';
import {Link, useLocation} from 'react-router-dom'
import { Container, Table, Grid, List, Icon, Image } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import Expenses from './Expenses';
function Accounts() {
  const location = useLocation();
  const url = new URLSearchParams(location.search)
  const currAcc = url.get('acc')
  // const user = firebase.auth().currentUser;
  // 存放點選帳戶的值,再用此值和帳戶的值做比對,呈現三角圖示
  const [accName, setAccName] = React.useState('');
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    // firebase.auth().onAuthStateChanged((user) => {
    firebase
      .firestore()
      .collection('accounts')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setRows(data);
      });

    // if (user) {
    //   firebase
    //     .firestore()
    //     .collection('accounts')
    //     .where('user_id', '==', user.uid)

    //     .onSnapshot((snapshot) => {
    //       const data = snapshot.docs.map((doc) => {
    //         return doc.data();
    //       });
    //       setRows(data);
    //     });

    // } else {

    //   firebase
    //     .firestore()
    //     .collection('accounts')
    //     .onSnapshot((snapshot) => {
    //       const data = snapshot.docs.map((doc) => {
    //         return doc.data();
    //       });
    //       setRows([]);
    //     });
    // }
  }, []);

  return (
    <Container>
      
      <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column width={3}>
            <List selection  size="large" >
              {rows.map((row, i) => {
                return (
                  <List.Item active={currAcc==row.name} key={i} as={Link} to={`/accounts?acc=${row.name}`}>
                    {currAcc == row.name ? <Icon name="right triangle" /> : ''}
                    <List.Content onClick={(e) => setAccName(row.name)}>
                      {row.name}
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Grid.Column>
          <Grid.Column width={10}>
            <Expenses/>
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
export default Accounts;
