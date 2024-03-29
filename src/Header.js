import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
  Redirect
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
import Balances from './components/Balances';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import incomesTotal from './components/IncomesTotal';

function Header() {
  // const {  currentUser } = useAuth()

  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState('');
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((currUser) => {
      setUser(currUser);
      if (currUser) {
        setEmail(currUser.email);
      }
      // currUser.updateProfile({displayName:'馬克'})
    });
  }, []);
  const history = useHistory();
  async function handleLogoutH() {
    try {
      await firebase.auth().signOut();
      // 在這做轉址動作會沒作用
      // history.push('/login-form');
      // 改為在下拉選單直接 as={Link} to="login-form"
    } catch {
      // setError("Failed to log out")
    }

    // firebase.auth().signOut().then(()=>{
    // Uncaught TypeError: Cannot read properties of undefined (reading 'push')
    // history.push('/login-form');
    // });
  }
  const [activeItem, setActiveItem] = useState('');
  return (
    <Router>
      <Menu>
       
       
        {user && email == 'mkdodos@gmail.com' ? (
           <Menu.Item
           as={Link}
           to="/incomes"
           active={activeItem == 'editor'}
           onClick={() => setActiveItem('editor')}
         >
           外送收入 
         </Menu.Item>
        ) : (
          ''
        )}
       
       
       
        {user && email == 'mkdodos@gmail.com' ? (
          <Menu.Item
            as={Link}
            to="/stocks"
            active={activeItem == 'review'}
            onClick={() => setActiveItem('review')}
          >
            股票
          </Menu.Item>
        ) : (
          ''
        )}

        <Menu.Item
          as={Link}
          to="/accounts"
          active={activeItem == 'accounts'}
          onClick={() => setActiveItem('accounts')}
        >
          帳戶
        </Menu.Item>

        {/* <Menu.Item
          as={Link}
          to="/acc-expenses"
          active={activeItem == 'acc-expenses'}
          onClick={() => setActiveItem('acc-expenses')}
        >
          收支
        </Menu.Item> */}


        <Menu.Item
          as={Link}
          to="/balances"          
        >
          收支
        </Menu.Item>


        <Menu.Menu position="right">
          {user ? (
            <Dropdown item text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item text="基本資料" as={Link} to="my-settings" />
                <Dropdown.Item
                  text="登出"
                  as={Link}
                  to="login-form"
                  onClick={handleLogoutH}
                />
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

      <AuthProvider>
        <Switch>
          <Route path="/incomes">
            <Incomes />
          </Route>
          <Route path="/stocks">
            {/* 要有登入才能查看此頁,沒有登入時導向登入頁 */}
            {user ? <Stocks /> : <Redirect to="login-form"/> }
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
            <MySettings user={user} />
          </Route>
          <Route path="/signup" component={Signup} />
          <Route path="/balances" component={Balances} />
          <Route path="/" exact component={Dashboard} />
          <Route path="/incomes-total"  component={incomesTotal} />
          
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default Header;
