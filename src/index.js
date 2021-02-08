import { live_report } from "./firebase_client.js";

live_report.on('value', (snapshot) => {
  const data = snapshot.val()
  console.log(data)
})