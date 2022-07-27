import { useEffect, useState, useRef } from 'react';
import {
  Container,
  List,
  Icon,
  Button,
  Grid,
  Segment,
  Item,
  Header,
  Form,
  Modal,
  Table,
  Label,
} from 'semantic-ui-react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import firebase, { auth } from '../utils/firebase';
function Balances() {
  const db = firebase.firestore();
  const dateRef = useRef();
  const titleRef = useRef();
  const amtRef = useRef();
  const [amt, setAmt] = useState('');
  const [title, setTitle] = useState('');
  const [oldAmt, setOldAmt] = useState('');
  const [row, setRow] = useState({});
  const [rows, setRows] = useState([]);
  const [docID, setDocID] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [rows2, setRows2] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  // 帳戶餘額
  const [balance, setBalance] = useState(0);

  // const [currAcc, setCurrAcc] = useState();
  const [open, setOpen] = useState(false);
  const user = auth.currentUser || null;
  const location = useLocation();
  const history = useHistory();

  const url = new URLSearchParams(location.search);
  const currAcc = url.get('account_id') || null;
  useEffect(() => {
    if (user) {
      db.collection('accounts')
        .where('user_id', '==', user.uid)
        .limit(3)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setRows(data);
          if (currAcc) {
            const temp = data.filter((row) => row.id.includes(currAcc));
            setBalance(temp[0].balance);
          }

          // console.log(temp)
          // console.log(data.filter((row)=>{row.id==currAcc}));
        });
    }

    // total 本月支出
    db.collection('balances')
      .where('user_id', '==', user.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        let temp = 0;
        data.forEach((row) => {
          temp += row.expense * 1;
        });
        setTotal(temp);
      });

    // 帳戶餘額

    db.collection('balances')
      .where('account_id', '==', currAcc)
      // .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });

        setRows2(data);
      });
  }, [currAcc]);

  function setDefault() {
    setOpen(false);
    setDocID('');
    setAmt('');
  }

  function saveRow() {
    if (docID) {
      const row = {
        date: dateRef.current.value,
        title: titleRef.current.value,
        expense: amtRef.current.value,
        // income: amtRef.current.value,
      };
      db.collection('balances')
        .doc(docID)
        .update(row)
        .then((doc) => {
          setDefault();
          // 更新帳戶餘額
          let temp = balance * 1 + oldAmt * 1 - amt * 1; //支出減少
          db.collection('accounts')
            .doc(currAcc)
            .update({
              balance: temp,
            })
            .then(() => {
              setBalance(temp);
            });
        });
    } else {
      const row = {
        date: dateRef.current.value,
        title: titleRef.current.value,
        expense: amtRef.current.value,
        // income: amtRef.current.value,
        account_id: currAcc,
        user_id: user.uid,
        createdAt: firebase.firestore.Timestamp.now(),
      };
      db.collection('balances')
        .add(row)
        .then((doc) => {
          setDefault();
          // 更新帳戶餘額
          let temp = balance * 1 - amt * 1; //支出減少
          db.collection('accounts')
            .doc(currAcc)
            .update({
              balance: temp,
            })
            .then(() => {
              setBalance(temp);
            });
        });
    }
  }

  function deleteRow() {
    db.collection('balances')
      .doc(docID)
      .delete()
      .then(() => {
        setDefault();
        // 更新帳戶餘額
        let temp = balance * 1 + oldAmt * 1;
        db.collection('accounts')
          .doc(currAcc)
          .update({
            balance: temp,
          })
          .then(() => {
            setBalance(temp);
          });
      });
  }
  // 這個函數給帳戶的 onClick,要按二次才能更新資料
  // setCurrAcc(row.id);  無法馬上取得 currAcc
  function filterRow() {
    if (currAcc)
      db.collection('balances')
        .where('account_id', '==', currAcc)
        .get()
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setRows2(data);
          // console.log(data);
        });
  }
  return (
    <Container>
      <Grid columns="equal">
        {/* 帳戶 */}
        <Grid.Row>
          {rows.map((row, i) => {
            return (
              <Grid.Column key={i}>
                <Segment
                  color="teal"
                  onClick={() => {
                    history.push(`/balances?account_id=${row.id}`);
                    setBalance(row.balance);
                    // setCurrAcc(row.id);
                    // 無法馬上取得 currAcc,要按第二下
                    // console.log(currAcc);
                    // 將參數直接改成 row.id
                    // db.collection('balances')
                    //   .where('account_id', '==', row.id)
                    //   .get()
                    //   .then((snapshot) => {
                    //     const data = snapshot.docs.map((doc) => {
                    //       return { ...doc.data(), id: doc.id };
                    //     });
                    //     setRows2(data);
                    //     // console.log(data);
                    //   });
                  }}
                  inverted={currAcc == row.id}
                  textAlign="center"
                >
                  {row.name}
                </Segment>
              </Grid.Column>
            );
          })}
        </Grid.Row>
        {/* 本月支出,帳戶餘額 */}
        <Grid.Row>
          <Grid.Column>
            {/* <Label>
              <Icon name="mail" /> 本月支出 {total}
            </Label> */}
            <Segment color="pink" textAlign="right">
              <Header sub>本月支出</Header>
              <span>${total}</span>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            {/* <Label>
              <Icon name="mail" /> 帳戶餘額 {total}
            </Label> */}
            <Segment color="teal" textAlign="right">
              <Header sub>帳戶餘額</Header>
              <span>${balance}</span>
              {/* <Header>${balance}</Header> */}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            {currAcc && (
              <Segment
                color="blue"
                onClick={() => {
                  setOpen(true);
                }}
                inverted
                textAlign="center"
              >
                新增
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Modal
        closeIcon
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Header icon="archive" content="Archive Old Messages" />
        <Modal.Content>
          {/* 表單 */}
          <Form size="large">
            <Form.Field>
              <label>日期</label>
              <input
                ref={dateRef}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>項目</label>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <label>金額</label>
              <input
                ref={amtRef}
                value={amt}
                onChange={(e) => setAmt(e.target.value)}
                type="number"
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" floated="left" onClick={deleteRow}>
            <Icon name="remove" /> No
          </Button>
          <Button color="green" onClick={saveRow}>
            <Icon name="checkmark" />
          </Button>
        </Modal.Actions>
      </Modal>

      {/* 表格 */}

      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>日期</Table.HeaderCell>
            <Table.HeaderCell>項目</Table.HeaderCell>
            <Table.HeaderCell>支出</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {rows2.map((row) => {
            return (
              <Table.Row
                onClick={() => {
                  setOpen(true);
                  setRow(row);
                  setTitle(row.title);
                  setAmt(row.expense);
                  setDocID(row.id);
                  // 記錄原金額
                  setOldAmt(row.expense);
                }}
                key={row.id}
              >
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.title}</Table.Cell>
                <Table.Cell>{row.expense}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {/* <List horizontal divided>
        {rows.map((row, i) => {
          return (
            <List.Item key={i} as={Link} to={`/balances?account_id=${row.id}`}>
              <List.Content>
               
                <Button>{row.name}</Button>
              </List.Content>
            </List.Item>
          );
        })}
      </List> */}
    </Container>
  );
}

export default Balances;
