import App from './App';
import ReactDom from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css'


import 'firebase/firestore';

const container = document.getElementById('root');
ReactDom.render(<App/>,container)