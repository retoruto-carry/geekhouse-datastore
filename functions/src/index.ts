import * as functions from 'firebase-functions';

import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('ja')
dayjs().format()
dayjs.tz.setDefault("Asia/Tokyo")

//import { Trade } from './type'
//import {  getTradesBetween } from './firestore'
import { log } from './logger'
//import { sendMessage } from './slack'
import {getWeather} from "./openWeather"
import {getAlertsEvents, setWeather, updateCachedValues} from "./firestore";
import {postWebSignage} from "./webSignage";

//const DAYJS_FORMAT_STYLE = 'M/D'
//const DAYJS_FORMAT_STYLE_TIMEZONE = 'MM月DD日 dddd HH:mm Z'
//const OWNER_SLACK_USER_ID_LIST = ['UHRUC5RE3', 'U9F9S2B2Q'] // [れとるときゃりーのID, わみのID]
exports.scheduledFunction = functions.region('asia-northeast1').pubsub.schedule('every 1 hours synchronized').timeZone('Asia/Tokyo').onRun(async (context) => {
  log('compute started')

  const weather = await getWeather("35.6902157","139.7043682",functions.config().openweather.token)
  if(weather !== null) {
    log(weather.weather.description)
    await setWeather(weather);
  }else{
    log('Weather Error')
  }

  const events = await getAlertsEvents(dayjs().tz().hour());
  events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  const event = events.find(ev=>ev.triggerDayOfWeek[dayjs().tz().day()]);

  if(event){
    log('event found!')
    await postWebSignage({durationMillisecond:15000,url:encodeURI(`https://geekhouse-datastore.web.app/alert?message=${event.message}&image=${event.image}`)})
  }

  log('compute finished')
});

exports.updateCachedValue = functions.https.onRequest(async (req, res) => {
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
  if(await updateCachedValues(type,newData)){
    res.status(200).send('Updated value')
    return
  }
  res.status(500).send('Error update document');
})
