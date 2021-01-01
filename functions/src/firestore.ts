import * as admin from "firebase-admin";
admin.initializeApp();
const firestore = admin.firestore()
import {toAlert} from './convert'
import {Alert, Weather} from './type'

export const getAlertsEvents = async (triggerHour: number): Promise<Alert[]> => {
  const tradesDoc = await firestore
    .collection('alerts')
    .where('enabled', '==', true)
    .where('triggerHour', '==', triggerHour)
    .get()
  return tradesDoc.docs.map(
    (doc):Alert  => {
      return toAlert(doc)
    }
  )
}

export const setWeather = async (weather: Weather) => {
  await firestore.collection('cached_values').doc("weather").set(weather);
}

export const updateCachedValues = async (type:string,newData:object):Promise<boolean> => {
  try {
    await firestore.collection('cached_values').doc(type).set(newData)
    return true
  } catch(err){
    console.error(err);
    return false
  }
}