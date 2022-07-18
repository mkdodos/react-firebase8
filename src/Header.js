import { useState } from 'react';
import { BrowserRouter as Router, Route,Link, Switch } from 'react-router-dom';
import Incomes from './components/Incomes';
import Stocks from './components/stocks';
import { Menu, List, Container } from 'semantic-ui-react';
function Header() {
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
      </Menu>



      <Switch>
        <Route path="/incomes">
          <Incomes />
        </Route>
        <Route path="/stocks">
          <Stocks />
        </Route>        
      </Switch>
    </Router>
  );
}

export default Header;
