import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
} from 'react-router-dom';
import Incomes from './components/Incomes';
import Stocks from './components/Stocks';
import Accounts from './components/Accounts';

import MySettings from './components/MySettings';
import { Menu, List, Container, Dropdown } from 'semantic-ui-react';

import firebase from './utils/firebase';
import 'firebase/auth';
import LoginForm from './components/LoginForm';
import AccExpenses from './components/AccExpenses';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function Header() {
  
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((currUser) => {
      setUser(currUser);
      // currUser.updateProfile({displayName:'馬克'})
    });
    // console.log(user)
  },[]);
  const history = useHistory();
  function logout() {
    
    firebase.auth().signOut().then(()=>{
      // Uncaught TypeError: Cannot read properties of undefined (reading 'push')
      // history.push('/login-form');
    });
    
  }
  const [activeItem, setActiveItem] = useState('');
  return (
    <Router>
      <Menu>
        <Menu.Item
          as={Link}
          to="/incomes"
          active={activeItem == 'editor'}
          onClick={() => setActiveItem('editor')}
        >
          外送收入
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/stocks"
          active={activeItem == 'review'}
          onClick={() => setActiveItem('review')}
        >
          股票
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/accounts"
          active={activeItem == 'accounts'}
          onClick={() => setActiveItem('accounts')}
        >
          帳戶
        </Menu.Item>


        <Menu.Item
          as={Link}
          to="/acc-expenses"
          active={activeItem == 'acc-expenses'}
          onClick={() => setActiveItem('acc-expenses')}
        >
          收支
        </Menu.Item>

        <Menu.Menu position="right">
          {user ? (
            // <Menu.Item onClick={() => firebase.auth().signOut()}>

            <Dropdown item text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item text="基本資料" as={Link} to="my-settings" />
                <Dropdown.Item text="登出" onClick={logout} />
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            // </Menu.Item>
            <Menu.Item
              as={Link}
              to="/login-form"
              active={activeItem == 'login-form'}
              onClick={() => setActiveItem('login-form')}
            >
              登入表單
            </Menu.Item>
          )}
        </Menu.Menu>
      </Menu>

      <Switch>
        <Route path="/incomes">
          <Incomes />
        </Route>
        <Route path="/stocks">
          <Stocks />
        </Route>
        <Route path="/accounts">
          <Accounts />
        </Route>
        <Route path="/acc-expenses">
          <AccExpenses />
        </Route>
        <Route path="/login-form">
          <LoginForm />
        </Route>
        <Route path="/my-settings">
          <MySettings />
        </Route>
        <Route path="/signup" component={Signup}/>
        <Route path="/" component={Dashboard}/>
         
      </Switch>
    </Router>
  );
}

export default Header;
