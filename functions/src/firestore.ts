import * as admin from "firebase-admin";
admin.initializeApp();
const firestore = admin.firestore()
import { toTrade  } from './convert'
import {Trade, Weather} from './type'

export const getAlertsEvent = async (triggerHour: number): Promise<Trade[]> => {
  const tradesDoc = await firestore
    .collection('alerts')
    .where('enabled', '==', true)
    .where('triggerHour', '==', triggerHour)
    .orderBy('createdAt', 'desc')
    .get()
  return tradesDoc.docs.map(
    (doc):Trade  => {
      return toTrade(doc)
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