import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Button,
  Header,
  Table,
  Form,
  Modal,
} from 'semantic-ui-react';
import firebase from '../utils/firebase';
import { Waypoint } from 'react-waypoint';

function Expenses() {
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  const currAcc = url.get('acc');

  const lastVisible = React.useRef();

  const [rows, setRows] = React.useState([]);
  const [docID, setDocID] = React.useState('');
  const [note, setNote] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [amt, setAmt] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (currAcc) {
      firebase
        .firestore()
        .collection('expenses')
        .where('account_name', '==', currAcc)
        .orderBy('spend_date', 'desc')
        .limit(20)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });

          // 紀錄最後一份文件
          lastVisible.current = snapshot.docs[snapshot.docs.length - 1];
          setRows(data);
        });
    }else{
      setRows([])
    } 
  }, [currAcc]);

  // 新增
  function createRow() {
    const row = {
      account_name: currAcc,
      note: note,
      expense: amt,
      spend_date: '2022-07-22',
    };
    setIsLoading(true);
    firebase
      .firestore()
      .collection('expenses')
      .add(row)
      .then(() => {
        setDefault();
        setIsLoading(false);
      });
  }

  function updateRow() {
    const db = firebase.firestore();
    var docRef = db.collection('expenses').doc(docID);
    const row = {
      account_name: currAcc,
      note: note,
      expense: amt,
      spend_date: '2022-07-22',
    };
    setIsLoading(true);
    docRef.update(row).then(() => {
      setDefault()
      setIsLoading(false);
    });
  }

  function setDefault() {
    setDocID('');
    setNote('');
    setOpen(false);
    setAmt('');
  }
  function deleteRow() {
    const db = firebase.firestore();
    const docRef = db.collection('expenses').doc(docID);
    setIsLoading(true);
    docRef.delete().then(() => {
      setDefault();
      setIsLoading(false);
    });
  }

  function saveRow() {
    if (docID) {
      updateRow();
    } else {
      createRow();
    }
  }

  return (
    <>
    { 
    
    currAcc &&
    <Button
        onClick={() => {
          setOpen(true);          
        }}
      >
        新增
      </Button>
}
      {/* <Button onClick={deleteRow} color='red'>刪除</Button> */}
      <Modal open={open} closeIcon onClose={setDefault}>
        <Modal.Header>編輯支出</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>項目</label>
              <input
                placeholder="項目"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
              </Form.Field>
              <Form.Field>
              <label>金額</label>
              <input
              type="number"
                placeholder="金額"
                value={amt}
                onChange={(e) => {
                  setAmt(e.target.value);
                }}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
        {docID ? (
            <Button color="red" floated="left" loading={isLoading} onClick={deleteRow}>
              刪除
            </Button>
          ) : (
            ''
          )}
          <Button onClick={saveRow} loading={isLoading}>儲存</Button>
        </Modal.Actions>
      </Modal>

      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3}>日期</Table.HeaderCell>
            <Table.HeaderCell width={5}>項目</Table.HeaderCell>
            <Table.HeaderCell>金額</Table.HeaderCell>
           
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((row, i) => {
            return (
              <Table.Row
                key={i}
                onClick={() => {
                  setDocID(row.id);
                  setNote(row.note);
                  setAmt(row.expense);
                  setOpen(true);
                }}
              >
                <Table.Cell>{row.spend_date}</Table.Cell>
                <Table.Cell>{row.note}</Table.Cell>
                <Table.Cell>{row.expense}</Table.Cell>
                {/* <Table.Cell>{row.account_name}</Table.Cell> */}
               
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Waypoint
        onEnter={() => {
          if (lastVisible.current) {
            if (currAcc) {
              firebase
                .firestore()
                .collection('expenses')
                .where('account_name', '==', currAcc)
                .orderBy('spend_date', 'desc')
                .startAfter(lastVisible.current)
                .limit(20)
                .onSnapshot((snapshot) => {
                  const data = snapshot.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id };
                  });
                  // 紀錄最後一份文件
                  lastVisible.current = snapshot.docs[snapshot.docs.length - 1];
                  setRows([...rows, ...data]);
                });
            } else {
              firebase
                .firestore()
                .collection('expenses')

                .orderBy('spend_date', 'desc')
                .startAfter(lastVisible.current)
                .limit(20)
                .onSnapshot((snapshot) => {
                  const data = snapshot.docs.map((doc) => {
                    return { ...doc.data(), id: doc.id };
                  });
                  // 紀錄最後一份文件
                  lastVisible.current = snapshot.docs[snapshot.docs.length - 1];
                  setRows([...rows, ...data]);
                });
            }
          }
        }}
      />
    </>
  );
}

export default Expenses;
