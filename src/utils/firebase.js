import firebase from 'firebase/app'
const firebaseConfig = {
  apiKey: "AIzaSyCxMvi4M0Xai8kuqn3r970KLassk-fTlGw",
  authDomain: "social-cool-16812.firebaseapp.com",
  projectId: "social-cool-16812",
  storageBucket: "social-cool-16812.appspot.com",
  messagingSenderId: "443839253633",
  appId: "1:443839253633:web:105b938de5b05af1f15180"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase
// Initialize Cloud Firestore and get a reference to the service
// const db = firebase.firestore();