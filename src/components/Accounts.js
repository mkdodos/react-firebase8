import React from 'react';
import { Container, Table, Dropdown, List, Icon } from 'semantic-ui-react';
import firebase from '../utils/firebase';
function Accounts() {
  const user = firebase.auth().currentUser;
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
     

      <List  selection animated size='large' divided>
        {rows.map((row, i) => {
          return (
            
            <List.Item key={i} >
             {accName==row.name?<Icon name='right triangle' />:''} 
              <List.Content onClick={(e)=>setAccName(row.name)}>
                 {row.name}
              </List.Content>
            </List.Item>
          );
        })}
      </List>

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
