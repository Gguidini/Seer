import firebase from 'firebase';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBJ40d8bNo2x_reFNjfxCUinALH24Rzh9Y",
  authDomain: "seer-3ec9b.firebaseapp.com",
  databaseURL: "https://seer-3ec9b-default-rtdb.firebaseio.com",
  projectId: "seer-3ec9b",
  storageBucket: "seer-3ec9b.appspot.com",
  messagingSenderId: "287984468860",
  appId: "1:287984468860:web:0c5e8ebdbb0d8a85f25af9",
  measurementId: "G-BJJ494Z4H4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database()

const live_report = database.ref('live_report/')

export { live_report }