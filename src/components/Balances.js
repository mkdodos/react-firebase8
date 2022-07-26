import { useEffect, useState } from 'react';
import {
  Container,
  List,
  Icon,
  Button,
  Grid,
  Segment,
  Item,
} from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import firebase, { auth } from '../utils/firebase';
function Balances() {
  const db = firebase.firestore();
  const [rows, setRows] = useState([]);
  const [currAcc, setCurrAcc] = useState('');
  const user = auth.currentUser || null;
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  // const currAcc = url.get('account_id');
  useEffect(() => {
    if (user) {
      db.collection('accounts')
        .where('user_id', '==', user.uid)
        .limit(3)
        .get()

        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setRows(data);
          console.log(data);
        });
    }
  }, []);
  return (
    <Container>
      <Grid columns="equal">
        <Grid.Row>
          {rows.map((row, i) => {
            return (
              <Grid.Column key={i}>
                <Segment
                  color="teal"
                  onClick={()=>{
                    setCurrAcc(row.id)
                  }}
                  inverted={currAcc == row.id}
                  textAlign="center"
                >
                  {row.name}
                </Segment>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>

      {/* <List horizontal divided>
        {rows.map((row, i) => {
          return (
            <List.Item key={i} as={Link} to={`/balances?account_id=${row.id}`}>
              <List.Content>
               
                <Button>{row.name}</Button>
              </List.Content>
            </List.Item>
          );
        })}
      </List> */}
    </Container>
  );
}

export default Balances;
