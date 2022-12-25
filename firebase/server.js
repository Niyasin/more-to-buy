import  {initializeApp,getApp} from 'firebase-admin/app';
import {credential} from 'firebase-admin';
import  ServiceAccount  from '../serviceKey.json';
try{
  getApp('server');
}catch(e){
  initializeApp({
    credential:credential.cert(ServiceAccount)
  },'server');
}
export const app= getApp('server');
