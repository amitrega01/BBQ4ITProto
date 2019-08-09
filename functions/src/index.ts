import * as functions from 'firebase-functions';
import * as express from 'express';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.use(express.json());

//https://us-central1-bbq4it-b4163.cloudfunctions.net/api/newScore/:route
app.post('/newScore/:route', (req, res) => {
  const toAdd = JSON.parse(req.body);
  db.collection(req.params.route)
    .where('nick', '==', toAdd.nick)
    .get()
    .then((snapshot: any) => {
      console.log(snapshot);
      if (snapshot.empty) {
        db.collection(req.params.route)
          .add(toAdd)
          .then((msg: any) => {
            res.send({ type: 'OK', msg: 'Dodano wynik' });
          })
          .catch((error: any) => {
            console.log(error);
            res.send({ type: 'ERROR', msg: error.msg });
          });
      } else
        res.send({
          type: 'ERROR',
          msg: 'Ta osoba jest już na liście'
        });
    })
    .catch((err: any) => res.send({ type: 'ERROR', msg: err.msg }));
});

exports.api = functions.https.onRequest(app);
