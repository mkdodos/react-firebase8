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

          setRows(data);
        });
    } else {
      firebase
        .firestore()
        .collection('expenses')
        .limit(20)
        .orderBy('spend_date', 'desc')
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          // 紀錄最後一份文件
          lastVisible.current = snapshot.docs[snapshot.docs.length - 1];
          // console.log(lastVisible.data())

          setRows(data);
        });
    }
  }, [currAcc]);
  return (
    <>
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
              <Table.Row key={i}>
                <Table.Cell>{row.spend_date}</Table.Cell>
                <Table.Cell>{row.note}</Table.Cell>
                <Table.Cell>{row.expense}</Table.Cell>
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
