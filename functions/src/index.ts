import * as functions from 'firebase-functions';
import * as express from 'express';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.use(express.json());

//https://us-central1-bbq4it-b4163.cloudfunctions.net/api/newScore/:route
app.post('/newScore/:route', (req, res) => {
  db.collection(req.params.route)
    .add(JSON.parse(req.body))
    .then((msg: any) => {
      console.log(msg);
      res.send(msg);
    })
    .catch((error: any) => {
      console.log(error);
      res.send(error);
    });
});

exports.api = functions.https.onRequest(app);
