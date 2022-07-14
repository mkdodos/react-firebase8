import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import 'firebase/firestore';

function Incomes() {
  // const data = [
  //   { date: 'dd', amt: 100, note: 'reain' },
  //   { date: 'd45d', amt: 1500, note: 'rea45in' },
  // ];

  const [incomes, setIncomes] = React.useState([]);
  // onSnapshot 監聽資料有變動時執行,在新增後,資料即時更新
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('incomes')
      .onSnapshot(snapshot=>{
           const data = snapshot.docs.map((doc) => {
          return {...doc.data(), id:doc.id}         
        });
        setIncomes(data);

      })
      // .get()
      // .then((snapshot) => {       
      //   const data = snapshot.docs.map((doc) => {
      //     return {...doc.data(), id:doc.id}         
      //   });
      //   setIncomes(data);
      // });
  },[]);
  return (

    <Table unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>日期</Table.HeaderCell>
          <Table.HeaderCell>收入</Table.HeaderCell>
          <Table.HeaderCell>備註</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {incomes.map((income) => {
          return (
            <Table.Row key={income.id}>
              <Table.Cell>{income.date}</Table.Cell>
              <Table.Cell>{income.amt}</Table.Cell>
              <Table.Cell>{income.note}</Table.Cell>
            </Table.Row>
          );
        })}
        {/* <Table.Row>
          <Table.Cell>07-14</Table.Cell>
          <Table.Cell>300</Table.Cell>
          <Table.Cell>下雨</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>07-13</Table.Cell>
          <Table.Cell>699</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row> */}
      </Table.Body>
    </Table>
  );
}

export default Incomes;
