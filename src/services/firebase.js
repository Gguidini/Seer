import firebase from 'firebase/app';
import 'firebase/database';

export const firebaseDemoConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT
};

export const initializeFirebaseConnection = (firebaseConfig) => firebaseConfig && firebase.initializeApp(firebaseConfig)

export const isFromUser = (ref, user) => {
  if (ref.path) {
    return ref.path.pieces_[0] === user
  }
  const x = ref.toString().replace('https://', '')
  return x.substring(x.indexOf('/') + 1, x.lastIndexOf('/')) === user
}
export default firebase.database
