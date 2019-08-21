import * as functions from 'firebase-functions';
import * as express from 'express';
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(
  cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })
);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
//https://us-central1-bbq4it-b4163.cloudfunctions.net/api/newScore/:route

app.post('/competitions', (req, res) => {
  db.collection('competitions')
    .add(req.body)
    .then((ref: any) => {
      res.send({ type: 'OK', msg: 'Dodano konkurencję' });
    })
    .catch((err: any) => {
      console.log(err);
      res.send({ type: 'ERROR', msg: err.msg });
    });
});

app.delete('/competitions', (req, res) => {
  db.collection('competitions')
    .where('route', '==', req.body.route)
    .get()
    .then((snapshot: any) => {
      snapshot.forEach((element: any) => {
        db.collection('competitions')
          .doc(element.id)
          .delete()
          .then((response: any) => {
            res.send({ type: 'OK', msg: 'Usunięto konurencję' + JSON.stringify(response) });
          });
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.send({ type: 'ERROR', msg: err.msg });
    });
});
app.post('/score/:route', (req, res) => {
  db.collection(req.params.route)
    .where('nick', '==', req.body.nick)
    .get()
    .then((snapshot: any) => {
      console.log(snapshot);
      if (snapshot.empty) {
        db.collection(req.params.route)
          .add(req.body)
          .then((docRef: any) => {
            db.collection(req.params.route)
              .doc(docRef.id)
              .update({ id: docRef.id, ...req.body });
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
//TODO: naprawic delete
app.put('/score/:route/:id', (req, res) => {
  if (req.body.delete == true) {
    db.collection(req.params.route)
      .doc(req.params.id)
      .delete()
      .then((ref: any) => {
        console.log('Deleted');
        res.send({ type: 'OK', msg: 'Usunięto wpis' });
      })
      .catch((error: any) => {
        console.log('ERROR');

        res.send({ type: 'ERROR', msg: 'Błąd ' + error.msg });
      });
  } else {
    console.log(req.body);
    const nickToCheck = req.body.new.nick === req.body.old.nick ? req.body.old.nick : req.body.new.nick;
    const sizeToCheck = req.body.new.nick === req.body.old.nick ? 1 : 0;
    db.collection(req.params.route)
      .where('nick', '==', nickToCheck)
      .get()
      .then((snapshot: any) => {
        console.log(snapshot);
        if (snapshot.size == sizeToCheck) {
          db.collection(req.params.route)
            .doc(req.params.id)
            .update(req.body.new)
            .then((ref: any) => {
              res.send({ type: 'OK', msg: 'Zaaktualizowano wpis' });
            })
            .catch((error: any) => {
              res.send({ type: 'ERROR', msg: 'Błąd ' + error.msg });
            });
        } else {
          res.send({
            type: 'ERROR',
            msg: 'Ta osoba jest już na liście'
          });
        }
      });
  }
});
exports.api = functions.https.onRequest(app);
