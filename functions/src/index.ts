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
import {setWeather, updateCachedValues} from "./firestore";

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
  // NOTE: weekは日曜から始まる。つまりstartOf('week') は日曜日の00:00になる
  // const lastWeekStart = dayjs().tz().startOf('week').subtract(1, 'week').add(1, 'day')
  // const lastWeekEnd = dayjs().tz().endOf('week').subtract(1, 'week').add(1, 'day')
  // log(`tradesデータの取得範囲: ${lastWeekStart.format(DAYJS_FORMAT_STYLE_TIMEZONE)} ~ ${lastWeekEnd.format(DAYJS_FORMAT_STYLE_TIMEZONE)}`)

 //  const trades = await getTradesBetween(lastWeekStart, lastWeekEnd)
 // // const users = await getAllUsers()
 //
 //  users.forEach(async user => {
 //    const sumPriceAccumulator = (acc:number, cur: Trade) => acc + cur.price
 //    const buyPriceSum = trades.filter(trade => trade.buyUserId === user.id).reduce(sumPriceAccumulator, 0)
 //    const sellPriceSum = trades.filter(trade => trade.sellUserId === user.id).reduce(sumPriceAccumulator, 0)
 //    if (buyPriceSum === 0 && sellPriceSum === 0) {
 //      log(`${user.name}さんは商品の売り買いをしていません`)
 //      return
 //    }
 //    const payPrice = buyPriceSum - sellPriceSum
 //    const message = `${lastWeekStart.format(DAYJS_FORMAT_STYLE)}~${lastWeekEnd.format(DAYJS_FORMAT_STYLE)}のレジ決済をお願いします\n使用金額: ${buyPriceSum}円\n売上金額: ${sellPriceSum}円\n支払い金額: ${payPrice}円\n${user.name}さん`
 //    await sendMessage(message, user.slack)
 //    OWNER_SLACK_USER_ID_LIST.forEach(async slackUserId => {
 //      await sendMessage(`===送信ログ===\n${message}\n==========`, slackUserId)
 //    })
 //  });

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