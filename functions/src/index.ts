import * as functions from 'firebase-functions';
import * as express from 'express';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.use(express.json());

//https://us-central1-bbq4it-b4163.cloudfunctions.net/api/newScore/0oz0p3Ce11M8l3RMwLzM
app.post('/newScore/:route', (req, res) => {
  db.collection(req.params.route)
    .add(req.body)
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
