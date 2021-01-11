import { DocumentNotExistError } from './error'
import {Alert} from './type'

type Document = FirebaseFirestore.DocumentSnapshot<
  FirebaseFirestore.DocumentData
>

export function toObject<T>(doc: Document): T {
  if (!doc.exists) throw new DocumentNotExistError()
  const obj: any = {
    ...doc.data()
  }
  return obj as T
}

export function toAlert(doc: Document): Alert {
  const _doc: any = doc
  return {
    ...toObject<any>(doc),
    createdAt: _doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate()
  }
}
