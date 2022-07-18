import React from 'react';
import firebase from '../utils/firebase';
import {
  Container,
  Button,
  Header,
  Table,
  Form,
  Modal,
  List,
  Input,
  Label,
  Icon,
} from 'semantic-ui-react';
// import {FieldValue} from 'firebase/firestore'

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
  const [currPrices, setCurrPrices] = React.useState([]);

  //
  // 文件欄位現價明細
  const [currDate, setCurrDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );
  const [currPrice, setCurrPrice] = React.useState('');

  // const [selectedItem, setSelectedItem]= React.useState({});

  // 合計
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    firebase
      .firestore()
      .collection(colName)
      // .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          doc.data().currPrices = [{ date: '2022-07-18', price: '123' }];
          return { ...doc.data(), id: doc.id };
        });
        setIncomes(data);
        // console.log(data[0].currPrices)
        // const tempdata = data[0].currPrices
        // const result = tempdata.sort((a, b) => {
        //   return a.date > b.date
        //     ? 1
        //     : -1;
        // });
        // console.log(result)
        let temp = 0;
        data.forEach((income) => {
          temp += income.qty * income.price;
        });
        setTotal(temp);
      });

    // updateCurrPrices('89ru4gSP1QMShWfESBvP');
  }, []);
  // 排序
  function sortArray(arr) {
    const result = arr.sort((a, b) => {
      return a.date < b.date ? 1 : -1;
    });
    return result;
  }
  // 更新現價
  function updateCurrPrices(id, obj) {
    const db = firebase.firestore();
    var colRef = db.collection(colName).doc(id);
    
    const editedIndex = currPrices.findIndex(fobj=>{
      return fobj.date === obj.date
    })

    console.log(editedIndex); // 👉️ 1

   
    // firebase.firestore.FieldValue.arrayUnion("greater_virginia")
    // firebase.firestore.FieldValue.arrayRemove("east_coast")
    // const obj = { date: '0719', price: '456' };
    // const editedIndex = currPrices.indexOf(obj);
    // console.log(editedIndex)
    colRef.update({
      // currPrices: firebase.firestore.FieldValue.arrayUnion(data),
      currPrices: firebase.firestore.FieldValue.arrayRemove(obj),
    });
    // console.log(obj.date)
    // console.log(currPrices)
    // console.log(obj)

    currPrices.splice(editedIndex,1)
  }

  // 更新現價
  function insertCurrPrices() {
    // console.log(docID);
    // console.log(currDate);

    const db = firebase.firestore();
    var colRef = db.collection(colName).doc(docID);
    const obj = { date: currDate, price: currPrice };
    // console.log(obj);
    colRef.update({
      currPrices: firebase.firestore.FieldValue.arrayUnion(obj),
    });
    setIsModalOpen(false);
  }

  function numFormat(total) {
    var formatter = new Intl.NumberFormat('en-US', {
      /* $2,500.00 */
      // style: "currency",
      currency: 'USD',
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
          setDefalut();
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
          setDefalut();
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

            <Form.Field>
              <Button color="grey" onClick={insertCurrPrices}>
                新增明細
              </Button>
            </Form.Field>
            <Form.Field>
              <Input
                placeholder="date"
                label="日期"
                type="date"
                value={currDate}
                onChange={(e) => setCurrDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="number"
                placeholder="price"
                label="價格"
                onChange={(e) => setCurrPrice(e.target.value)}
              />
            </Form.Field>
          </Form>

          <List>
            {currPrices
              ? currPrices.map((obj) => {
                  return (
                    <List.Item key={obj.date}>
                      <List.Icon
                        onClick={() =>
                          updateCurrPrices(docID, {
                            date: obj.date,
                            price: obj.price,
                          })
                        }
                        name="close"
                      />
                      <List.Content>
                        {obj.date}-{obj.price}
                      </List.Content>
                    </List.Item>
                  );
                })
              : ''}
          </List>
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
            <Table.HeaderCell textAlign="right">小計</Table.HeaderCell>
            <Table.HeaderCell>現價</Table.HeaderCell>
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
                  setCurrPrices(income.currPrices);
                  setIsModalOpen(true);
                }}
              >
                {/* <Table.Cell>{income.date.toDate().toLocaleDateString()}</Table.Cell> */}
                <Table.Cell>{income.stockName}</Table.Cell>
                <Table.Cell>{income.qty}</Table.Cell>
                <Table.Cell>{income.price}</Table.Cell>
                <Table.Cell textAlign="right">
                  {numFormat(income.qty * income.price)}
                </Table.Cell>
                <Table.Cell>
                  <List>
                    {/* {income.currPrices?<List.Item>{income.currPrices[0].price}</List.Item>:''} */}
                    {income.currPrices ? (
                      <List.Item>
                        {sortArray(income.currPrices)[0]?.price}
                      </List.Item>
                    ) : (
                      ''
                    )}

                    {/* {income.currPrices
                      ? income.currPrices.map((obj) => {
                          return (
                            <List.Item key={obj.date}>
                              {obj.date.slice(5,10)}-{obj.price}
                            </List.Item>
                          );
                        })
                      : ''} */}
                    {/* <List.Item>
                      {income.currPrices
                        ? income.currPrices[0].date +
                          ' $' +
                          income.currPrices[0].price
                        : ''}
                    </List.Item> */}
                  </List>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}
export default stocks;
