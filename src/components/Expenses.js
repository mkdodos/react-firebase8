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
    } else {
      // firebase
      //   .firestore()
      //   .collection('expenses')
      //   .limit(20)
      //   .orderBy('spend_date', 'desc')
      //   .onSnapshot((snapshot) => {
      //     const data = snapshot.docs.map((doc) => {
      //       return { ...doc.data(), id: doc.id };
      //     });
      //     // 紀錄最後一份文件
      //     lastVisible.current = snapshot.docs[snapshot.docs.length - 1];  
      //     setRows(data);
      //   });
    }
  }, [currAcc]);


  // 新增
  function createRow() {
    const row = {
      account_name:currAcc,
      note:note,
      spend_date:'2022-07-22'
    }
    firebase.firestore().collection('expenses').add(row).then(()=>{
      setDocID('')
      setNote('')
    })    
  }

  function deleteRow() {
    const db = firebase.firestore();
    const docRef= db.collection('expenses').doc(docID);
    docRef.delete().then(()=>{
      setDocID('')
      setNote('')
    })
  }


  return (
    <>
    <Button onClick={createRow}>新增</Button>
    {/* <Button onClick={deleteRow} color='red'>刪除</Button> */}
    <Form>
    <Form.Input value={note} onChange={(e)=>{setNote(e.target.value)}} />
    </Form>
    
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3}>日期</Table.HeaderCell>
            <Table.HeaderCell width={5}>項目</Table.HeaderCell>
            <Table.HeaderCell>金額</Table.HeaderCell>
            {/* <Table.HeaderCell>id</Table.HeaderCell> */}
            <Table.HeaderCell>btn</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows.map((row, i) => {
            return (
              <Table.Row key={i} onClick={()=>{
                setDocID(row.id)
                setNote(row.note)
                }}>
                <Table.Cell>{row.spend_date}</Table.Cell>
                <Table.Cell>{row.note}</Table.Cell>
                <Table.Cell>{row.expense}</Table.Cell>
                {/* <Table.Cell>{row.account_name}</Table.Cell> */}
                <Table.Cell>
                  {docID==row.id?<Button onClick={deleteRow} color='red'>刪除</Button>:''}
                  
                  </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Waypoint
        onEnter={() => {
          if (lastVisible.current) {
            if(currAcc){
              firebase
              .firestore()
              .collection('expenses')
              .where('account_name','==',currAcc)
              .orderBy('spend_date', 'desc')
              .startAfter(lastVisible.current)
              .limit(20)
              .onSnapshot((snapshot) => {
                const data = snapshot.docs.map((doc) => {
                  return { ...doc.data(), id: doc.id };
                });
                // 紀錄最後一份文件
                lastVisible.current = snapshot.docs[snapshot.docs.length - 1];   
                setRows([...rows,...data]);
              });
            }else{
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
                setRows([...rows,...data]);
              });

            }
           
          }
        }}
      />
    </>
  );
}

export default Expenses;
