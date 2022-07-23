import firebase from 'firebase/app'
import "firebase/auth"
// const firebaseConfig = {
//   apiKey: "AIzaSyCxMvi4M0Xai8kuqn3r970KLassk-fTlGw",
//   authDomain: "social-cool-16812.firebaseapp.com",
//   projectId: "social-cool-16812",
//   storageBucket: "social-cool-16812.appspot.com",
//   messagingSenderId: "443839253633",
//   appId: "1:443839253633:web:105b938de5b05af1f15180"
// };

const firebaseConfig = {
  apiKey: "AIzaSyClLeHQJMt3BzbrK_AHpWeq0nlqzY2r5ik",
  authDomain: "money-39797.firebaseapp.com",
  projectId: "money-39797",
  storageBucket: "money-39797.appspot.com",
  messagingSenderId: "142963352306",
  appId: "1:142963352306:web:ac3c09e593009a5175666b",
  measurementId: "G-012VKYDZ07"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth()

export default firebase
// Initialize Cloud Firestore and get a reference to the service
// const db = firebase.firestore();