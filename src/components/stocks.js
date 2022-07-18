import React from 'react';
import firebase from '../utils/firebase';
import {
  Container,
  Button,
  Header,
  Table,
  Form,
  Modal,
} from 'semantic-ui-react';

function stocks() {
  // 文件集合名稱
  const colName = 'stocks';
  // 文件集合陣列
  const [incomes, setIncomes] = React.useState([]);
  // 
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // 文件欄位
  const [docID, setDocID] = React.useState('');
  const [stockName, setStockName] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [price, setPrice] = React.useState(0);
  // 合計
  const [total, setTotal] = React.useState(0);
  
  React.useEffect(() => {
    firebase
      .firestore()
      .collection(colName)
      // .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setIncomes(data);
        let temp = 0;
        data.forEach((income)=>{
          temp +=  income.qty*income.price
        })
        setTotal(temp)    
      });
  }, []);


  function numFormat(total){
    var formatter = new Intl.NumberFormat("en-US", {
      /* $2,500.00 */ 
      // style: "currency",
      currency: "USD"
    });
  
    return formatter.format(total); 
    // 2,500
  }


  function setDefalut() {
    setIsModalOpen(false);
    setIsLoading(false);
    setDocID('');
    setStockName('');
    setQty('');
    setPrice('');
  }
  function updateCol() {
    setIsLoading(true);
    const db = firebase.firestore();
    // 用 docID 判斷新增或更新
    if (docID) {
      var colRef = db.collection(colName).doc(docID);
      colRef
        .update({ stockName, qty, price })
        .then(() => {
          setDefalut()
          // setIsModalOpen(false);
          // setIsLoading(false);
          // setDocID('');
          // setQty('');
          // setPrice('');
          console.log('Document successfully updated!');
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
        });
    } else {
      // 新增
      db.collection(colName)
        .add({
          stockName,
          qty,
          price,
        })
        .then(() => {
          setDefalut()
          // setIsModalOpen(false);
          // setIsLoading(false);
          console.log('Document successfully created!');
        });
    }
  }

  function deleteDoc() {
    setIsLoading(true);
    const db = firebase.firestore();
    db.collection(colName)
      .doc(docID)
      .delete()
      .then(() => {
        console.log('Document successfully deleted!');
        setDefalut(); // setIsModalOpen(false);
        // setIsLoading(false);
        // setDocID('');
        // setQty('');
        // setPrice('');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  return (
    <Container>
      <Modal open={isModalOpen} closeIcon onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <Header>編輯</Header>
          </Modal.Description>
          <Form>
          <Form.Field>
              <label>名稱</label>
              <input                
                value={stockName}
                placeholder=""
                onChange={(e) => setStockName(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>數量</label>
              <input
                type="number"
                value={qty}
                placeholder=""
                onChange={(e) => setQty(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>單價</label>
              <input
              type="number"
                value={price}
                placeholder=""
                onChange={(e) => setPrice(e.target.value)}
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
              onClick={deleteDoc}
            >
              刪除
            </Button>
          ) : (
            ''
          )}

          <Button color="blue" loading={isLoading} onClick={updateCol}>
            儲存
          </Button>
        </Modal.Actions>
      </Modal>

      <Button
        color="blue"
        onClick={() => {
          setIsModalOpen(true);
          setDocID('');
          setQty('');
          setPrice('');
        }}
      >
        新增
      </Button>
      <Header floated="right">{numFormat(total)}</Header>
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>名稱</Table.HeaderCell>
            <Table.HeaderCell>股數</Table.HeaderCell>
            <Table.HeaderCell>價格</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>小計</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {incomes.map((income) => {
            return (
              <Table.Row
                key={income.id}
                onClick={() => {
                  setStockName(income.stockName);
                  setQty(income.qty);
                  setPrice(income.price);
                  setDocID(income.id);
                  setIsModalOpen(true);
                }}
              >
                {/* <Table.Cell>{income.date.toDate().toLocaleDateString()}</Table.Cell> */}
                <Table.Cell>{income.stockName}</Table.Cell>
                <Table.Cell>{income.qty}</Table.Cell>
                <Table.Cell>{income.price}</Table.Cell>
                <Table.Cell textAlign='right'>{numFormat(income.qty * income.price)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}
export default stocks;
