import firebase from "../utils/firebase";
import React from "react";
import { Table, Container, Tab } from "semantic-ui-react";
export default function IncomesTotal() {
  const db = firebase.firestore();
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    db.collection("incomes")
      .get()
      .then((snapshot) => {
        let rows = snapshot.docs;
        const data = rows.map((row) => {
          return row.data();
        });
        setRows(getGroupData(data));
      });
  }, []);

  function getGroupData(data) {
    const y = "2022";
    const newData = [];
    // 計算加總
    for (let i = 1; i <= 12; i++) {
      let total = 0;
      let total2 = 0;
      let m = i;
      if (i < 10) m = "0" + i;
      // 用年月和日進行篩選,資料分為 01-15 , 16-31 二個部份
      // 上半月
      let part1 = data.filter(
        (obj) => obj.date.startsWith(`${y}-${m}`) && obj.date.substring(8) <= 15
      );

      // 下半月
      let part2 = data.filter(
        (obj) => obj.date.startsWith(`${y}-${m}`) && obj.date.substring(8) > 15
      );
      let row = {};
      part1.forEach((obj) => (total += obj.amt * 1));
      part2.forEach((obj) => (total2 += obj.amt * 1));
      row.y = y;
      row.m = m;
      row.part1 = total;
      row.part2 = total2;
      // {y: '2022', m: '01', part1: 33, part2: 204}
      newData.push(row);
    }
    return newData;
  }

  return (
    <Container>
      <Table unstackable>
        <Table.Header>
          <Table.HeaderCell>年</Table.HeaderCell>
          <Table.HeaderCell>月</Table.HeaderCell>
          <Table.HeaderCell>上半</Table.HeaderCell>
          <Table.HeaderCell>下半</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {rows.map((row, i) => (
            <Table.Row key={i}>
              <Table.Cell>{row.y}</Table.Cell>
              <Table.Cell>{row.m}</Table.Cell>
              <Table.Cell>{row.part1}</Table.Cell>
              <Table.Cell>{row.part2}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}
