import React from 'react';
import { Icon, Button, Header, Table, Form, Modal } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import 'firebase/firestore';

function Incomes() {
  // const data = [
  //   { date: 'dd', amt: 100, note: 'reain' },
  //   { date: 'd45d', amt: 1500, note: 'rea45in' },
  // ];

  const [incomes, setIncomes] = React.useState([]);
  const [income, setIncome] = React.useState({});

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [amt, setAmt] = React.useState('');
  const [note, setNote] = React.useState('');
  const [docID, setDocID] = React.useState('');

  // onSnapshot 監聽資料有變動時執行,在新增後,資料即時更新
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('incomes')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setIncomes(data);
      });
    // .get()
    // .then((snapshot) => {
    //   const data = snapshot.docs.map((doc) => {
    //     return {...doc.data(), id:doc.id}
    //   });
    //   setIncomes(data);
    // });
  }, []);

  function addIncome() {
    const db = firebase.firestore();
    // 新增
    db.collection('incomes').add({
      date: new Date().toLocaleDateString(),
      amt: amt,
      note: note,
    });
  }

  function deleteIncome() {
    setIsLoading(true);
    const db = firebase.firestore();
    db.collection('incomes')
      .doc(income.id)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
        setIsModalOpen(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  function updateIncome() {
    setIsLoading(true);
    const db = firebase.firestore();
    var washingtonRef = db.collection('incomes').doc(docID);

    // Set the "capital" field of the city 'DC'
    return washingtonRef
      .update({amt:amt,note:note})
      .then(() => {
        setIsModalOpen(false);
        setIsLoading(false);
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });
  }

  return (
    <>
      <Modal open={isModalOpen}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>編輯</Header>
          </Modal.Description>
          <Form>
            <Form.Field>
              <label>金額</label>
              <input
                value={amt}
                placeholder=""
                onChange={(e) => setAmt(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>備註</label>
              <input
                value={note}
                placeholder=""
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="grey" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>

          <Button color="blue" loading={isLoading} onClick={updateIncome}>
            確定
          </Button>
        </Modal.Actions>
      </Modal>

      <Form onSubmit={addIncome}>
        <Form.Field>
          <label>金額</label>
          <input
            placeholder="First Name"
            onChange={(e) => setAmt(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>備註</label>
          <input
            placeholder="Last Name"
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Field>
        {/* 用 submit 送出造成用量超額 */}
        {/* <Button type='submit' onClick={addIncome}>Submit</Button> */}
        <Form.Button>Submit</Form.Button>
      </Form>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>日期{income.id}</Table.HeaderCell>
            <Table.HeaderCell>收入</Table.HeaderCell>
            <Table.HeaderCell>備註</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {incomes.map((income) => {
            return (
              <Table.Row
                onClick={() => {
                  setNote(income.note);
                  setAmt(income.amt)
                  setDocID(income.id)
                
                  setIsModalOpen(true);
                }}
                key={income.id}
              >
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
    </>
  );
}

export default Incomes;
