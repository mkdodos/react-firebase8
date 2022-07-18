import React from 'react';
import { Container, Button, Header, Table, Form, Modal } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import 'firebase/firestore';

function Incomes() {
  // const data = [
  //   { date: 'dd', amt: 100, note: 'reain' },
  //   { date: 'd45d', amt: 1500, note: 'rea45in' },
  // ];

  const [incomes, setIncomes] = React.useState([]);
  // const [income, setIncome] = React.useState({});

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [incomeDate, setIncomeDate] = React.useState(
    new Date().toLocaleDateString()
  );
  const [amt, setAmt] = React.useState('');

  const [total, setTotal] = React.useState(0);

  const [note, setNote] = React.useState('');
  const [docID, setDocID] = React.useState('');

  // onSnapshot 監聽資料有變動時執行,在新增後,資料即時更新
  React.useEffect(() => {
    firebase
      .firestore()
      .collection('incomes')
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          
          return { ...doc.data(), id: doc.id };
        });
        let temp = 0;
        data.forEach((income)=>{
          temp +=  income.amt*1
        })
        setTotal(temp)       
        setIncomes(data);        
      })     
  
  }, []);

  

  function deleteIncome() {
    setIsLoading(true);
    const db = firebase.firestore();
    db.collection('incomes')
      .doc(docID)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
        setIsModalOpen(false);
        setIsLoading(false);
        setDocID('');
        setAmt('');
        setNote('');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  function updateIncome() {
    setIsLoading(true);
    const db = firebase.firestore();

    // 用 docID 判斷新增或更新
    if (docID) {
      var washingtonRef = db.collection('incomes').doc(docID);
      washingtonRef
        .update({ date: incomeDate, amt: amt, note: note })
        .then(() => {
          setIsModalOpen(false);
          setIsLoading(false);
          setDocID('');
          setAmt('');
          setNote('');
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error('Error updating document: ', error);
        });
    } else {
      // 新增
      db.collection('incomes')
        .add({
          date: incomeDate,
          amt: amt,
          note: note,
        })
        .then(() => {
          setIsModalOpen(false);
          setIsLoading(false);
          console.log('Document successfully created!');
        });
    }
  }

  return (
    <>
      <Modal open={isModalOpen} closeIcon onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>編輯</Header>
          </Modal.Description>
          <Form>
            <Form.Field>
              <label>日期</label>
              <input
                value={incomeDate}
                placeholder=""
                onChange={(e) => setIncomeDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>金額</label>
              <input type="number"
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
          {docID ? (
            <Button
              color="red"
              floated="left"
              loading={isLoading}
              onClick={deleteIncome}
            >
              刪除
            </Button>
          ) : (
            ''
          )}

          <Button color="blue" loading={isLoading} onClick={updateIncome}>
            儲存
          </Button>
        </Modal.Actions>
      </Modal>

      {/* 用 submit 送出造成用量超額 */}
      {/* <Button type='submit' onClick={addIncome}>Submit</Button> */}
  
  
      <Container>
        
       
  
      <Button
        color="blue"
        onClick={() => {
          setIsModalOpen(true);
          setDocID('');
          setAmt('');
          setNote('');
          setIncomeDate(new Date().toLocaleDateString())
        }}
      >
        新增
      </Button>
      <Header>{total}</Header>
      
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
              <Table.Row
                onClick={() => {
                  setIncomeDate(income.date);
                  setNote(income.note);
                  setAmt(income.amt);
                  setDocID(income.id);

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
         
        </Table.Body>
      </Table>
      </Container>
    </>
  );
}

export default Incomes;
