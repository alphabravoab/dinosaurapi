import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express'
import * as cors from 'cors'

const serviceAccount = require('../firebaseToken.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

app.get('/dinosaur', (request, response) => {
    response.send('should send an array of all dinosaur names')
})

app.get('/dinosaur/:dino', (request, response) => {
    const dino = request.params.dino
    response.send(`asking about ${dino}`)
})

app.post('/dinosaur', async (request, response) => {
    const dino = request.body
    console.log(dino.name)
    const dinoRef = db.collection('dinosaurs').doc(dino.name);

    await dinoRef.set({
            name: dino.name,
            diet: dino.diet,
            // lived: dino.lived,
            // found: dino.found,
            // pronunciation: dino.pronunciation,
            // meaning: dino.meaning,
            // Type: dino.type,
            // length: dino.length,
            // weight: dino.weight
        })
    response.send(`created ${dino.name}`)
})


export const api = functions.https.onRequest(app);