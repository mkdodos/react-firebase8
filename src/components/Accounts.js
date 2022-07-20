import React from 'react';
import { Container, Table } from 'semantic-ui-react';
import firebase from '../utils/firebase';
function Accounts() {
  const [accounts, setAccounts] = React.useState([]);
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('accounts')
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setAccounts(data);
      });
  }, []);

  return (
    <Container>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名稱</Table.HeaderCell>
            <Table.HeaderCell>使用者</Table.HeaderCell>
            <Table.HeaderCell>備註</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {accounts.map((row,i) => {
            return (<Table.Row key={i}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.user_id}</Table.Cell>               
            </Table.Row>);
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}
export default Accounts;
