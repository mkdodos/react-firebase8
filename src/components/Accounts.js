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
  Form,
  Table,
} from 'semantic-ui-react';
import firebase from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
// import Expenses from './AccExpenses';
function Accounts() {
  const [rows, setRows] = React.useState([]);
  const [accName, setAccName] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [docID, setDocID] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { currentUser } = useAuth();
  // const user = firebase.auth().currentUser;

  React.useEffect(() => {
    if (currentUser) {
      firebase
        .firestore()
        .collection('accounts')
        .where('user_id', '==', currentUser.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setRows(data);
        });
    }
  }, []);

  // 新增帳戶
  function createAcc() {
    // console.log(accName)
    setOpen(false);
    setAccName('');
    const row = {
      name: accName,
      user_id: currentUser.uid,
      createdAt: firebase.firestore.Timestamp.now(),
    };
    firebase
      .firestore()
      .collection('accounts')
      .add(row)
      .then(() => {
        console.log('create');
      });
  }

  function updateAcc() {
    setIsLoading(true);
    const db = firebase.firestore();
    var docRef = db.collection('accounts').doc(docID);
    const row = {
      name: accName,
      balance,
      // user_id: user.uid,
    };
    docRef.update(row).then(() => {
      setOpen(false);
      setAccName('');
      setDocID('');
      setIsLoading(false);
    });
  }

  function saveRow() {
    if (docID) {
      updateAcc();
    } else {
      createAcc();
    }
  }

  function deleteRow() {
    setIsLoading(true);
    const db = firebase.firestore();
    db.collection('accounts')
      .doc(docID)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
        setOpen(false);
        setIsLoading(false);
        setDocID('');
        setAccName('');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  return (
    <Container>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名稱</Table.HeaderCell>
            <Table.HeaderCell>餘額</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((row, i) => {
            return (
              <Table.Row
                onClick={() => {
                  setBalance(row.balance);
                  setAccName(row.name);
                  setDocID(row.id);
                  setOpen(true);
                }}
                key={i}
              >
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.balance}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        onOpen={() => {
          setOpen(true);
          // setBalance('')
          // setAccName('')
        }}
        open={open}
        trigger={<Button>新增</Button>}
      >
        <Modal.Header>新增帳戶</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>名稱</label>
              <input
                value={accName}
                onChange={(e) => {
                  setAccName(e.target.value);
                }}
                placeholder="請輸入帳戶名稱"
              />
            </Form.Field>
            <Form.Field>
              <label>餘額</label>
              <input
                type="number"
                value={balance}
                onChange={(e) => {
                  setBalance(e.target.value);
                }}
                placeholder="請輸入餘額"
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {docID ? (
            <Button
              color="red"
              loading={isLoading}
              floated="left"
              onClick={deleteRow}
            >
              刪除
            </Button>
          ) : (
            ''
          )}

          <Button color="blue" 
          loading={isLoading} 
          onClick={saveRow}>
            儲存
          </Button>

          {/* <Button color="red" onClick={() => setOpen(false)}>
                  刪除
                </Button>
                <Button color="black" onClick={() => setOpen(false)}>
                  新增
                </Button> */}
        </Modal.Actions>
      </Modal>
    </Container>
  );
}
export default Accounts;
