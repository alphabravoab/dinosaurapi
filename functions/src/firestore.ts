import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const addDino = (data: any) => functions.firestore
    .document('dinosaurs/{dinoId}')
    .onCreate(async (snapshot, context)=> {
        
        const dinoRef = db.doc('dinosaurs/{dinoId.uid}')

        return dinoRef.set({
            name: data.name,
            diet: data.diet,
            lived: data.lived,
            found: data.found,
            pronunciation: data.pronunciation,
            meaning: data.meaning,
            Type: data.type,
            length: data.length,
            weight: data.weight
        })
    });
