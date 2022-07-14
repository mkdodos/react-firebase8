import React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import firebase from '../utils/firebase';
import 'firebase/firestore';

function NewIncome() {
  const [amt, setAmt] = React.useState('');
  const [note, setNote] = React.useState('');
  React.useEffect(() => {
    
  },[]);

  function addIncome() {
    const db = firebase.firestore();
    // 新增
    db.collection('incomes').add({
      date: new Date().toLocaleDateString(),
      amt: amt,
      note: note
    });
  }

  //
  return (
    <Form onSubmit={addIncome}>
      <Form.Field>
        <label>金額</label>
        <input placeholder="First Name" onChange={(e)=>setAmt(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <label>備註</label>
        <input placeholder="Last Name" onChange={(e)=>setNote(e.target.value)} />
      </Form.Field>
      {/* 用 submit 送出造成用量超額 */}
      {/* <Button type='submit' onClick={addIncome}>Submit</Button> */}
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}

export default NewIncome;
