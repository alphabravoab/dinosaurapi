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

app.get('/dinosaur', async (request, response) => {
    const dinoRef = db.collection('dinosaurs');
    const dinos = await dinoRef.get();
    const dinoArray: Array<Object>  = [];
    dinos.forEach(doc => {
        dinoArray.push( doc.data());
      })
    response.send(dinoArray);
})

app.get('/dinosaur/names', async (request, response) => {
    const dinoRef = db.collection('dinosaurs');
    const dinos = await dinoRef.get();
    const dinoNames: Array<String>  = [];
    dinos.forEach(doc => {
        dinoNames.push(doc.id);
      })
    response.send(dinoNames);
})

app.get('/dinosaur/random', async (request, response) => {
    const dinoRef = db.collection('dinosaurs');
    const dinos = await dinoRef.get();
    const dinoNames: Array<string>  = [];
    dinos.forEach(doc => {
        dinoNames.push(doc.id);
      })
    const randomDino: string = dinoNames[Math.floor( Math.random() * dinoNames.length)]
    const selectedDino = dinoRef.doc(randomDino)
    const luckyDino = await selectedDino.get();
    response.send(luckyDino.data())
})

app.get('/dinosaur/:dino', async (request, response) => {
    const dino = request.params.dino
    try{
      const dinoRef = db.collection('dinosaurs').doc(dino)
      const doc = await dinoRef.get();
      if(doc.exists) {
        return response.send(doc.data())
      }
      else {
        throw new Error("No dino found")
      }
    }
    catch(error){
      return response.status(404).send("Dino not found")
    }
})

app.post('/dinosaur', async (request, response) => {
    const dino = request.body
    console.log(dino.name)
    const dinoRef = db.collection('dinosaurs').doc(dino.name);

    await dinoRef.set({
            name: dino.name,
            diet: dino.diet,
            livedFrom: dino.livedFrom,
            livedTo: dino.livedTo,
            era: dino.era,
            found: dino.found,
            pronunciation: dino.pronunciation,
            meaning: dino.meaning,
            type: dino.type,
            length: dino.length,
            weight: dino.weight,
            image: dino.images
        })
    response.send(`created ${dino.name}`)
})


export const api = functions.https.onRequest(app);