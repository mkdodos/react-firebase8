import React from 'react';
import { Menu, List, Container } from 'semantic-ui-react';
// import firebase from "./utils/firebase";
// import "firebase/auth";
import Incomes from './components/Incomes';
import NewIncome from './components/NewIncome';
function App() {
  const [activeItem, setActiveItem] = React.useState('');
  React.useEffect(() => {});

  return (
    <>
   
      <Menu>
        <Menu.Item
          name="editorials"
          active={activeItem == 'editor'}
          onClick={() => setActiveItem('editor')}
        >
          外送收入
        </Menu.Item>

        <Menu.Item
          name="reviews"
          active={activeItem == 'review'}
          onClick={() => setActiveItem('review')}
        >
          Reviews
        </Menu.Item>
      </Menu>
      <Container>
      <NewIncome/>
      <Incomes/>
     
      {/* <List>
        <List.Item>Apples</List.Item>
        <List.Item>Pears</List.Item>
        <List.Item>Oranges</List.Item>
      </List> */}
      </Container>
    </>
  );
}
export default App;
