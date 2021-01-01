import { DocumentNotExistError } from './error'
import { Trade } from './type'

type Document = FirebaseFirestore.DocumentSnapshot<
  FirebaseFirestore.DocumentData
>

export function toObject<T>(doc: Document): T {
  if (!doc.exists) throw new DocumentNotExistError()
  const obj: any = {
    id: doc.id,
    ...doc.data()
  }
  return obj as T
}

export function toTrade(doc: Document): Trade {
  const _doc: any = doc
  return {
    ...toObject<any>(doc),
    date: _doc.data({ serverTimestamps: 'estimate' }).date.toDate()
  }
}
