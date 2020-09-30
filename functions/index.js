const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateCachedValue = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  if (!req.body || !req.body.data || !req.body.type) {
    res.status(400).send('Request Body Not Found or Invalid')
    return
  }

  const data = req.body.data;
  const type = req.body.type;

  const newData = {
    data: data,
    updatedAt: new Date()
  };

  admin
    .firestore()
    .collection('cached_values')
    .doc(type)
    .set(newData)
    .then((docRef) => {
        return res.status(200).send('Updated value')
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error update document');
    })
})
