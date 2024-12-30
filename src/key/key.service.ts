import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KeyService{
   getPrivateKey():string  {
      const privateKey  =  path.resolve(__dirname,'../../keys/private.key')
      // cái dirname là cái tim tới cái file mình làm
    try {
      return fs.readFileSync(privateKey,'utf-8');
    } catch (error) {
      throw new Error('Cloud not find private key');
    }
   }
   getPublicKey():string{
      const publicKey = path.resolve(__dirname,'../../keys/public.key')
      try {
         return fs.readFileSync(publicKey,'utf-8');
      } catch (error) {
         throw new Error("Not found public key")
      }
   }
   getRefTokenPrivateKey():string{
      const refreshToken = path.resolve(__dirname,'../../keys/refresh_private.key')
      try {
         return fs.readFileSync(refreshToken,'utf-8');
      } catch (error) {
         throw new Error("NOt Found RefToken")
      }
   }
}