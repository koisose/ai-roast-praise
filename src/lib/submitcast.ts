
// @ts-ignore
import {  Message,makeCastAdd } from "@farcaster/core";
import {parseString} from './parseString'
import axios from "axios";
function hexToUint8Array(hex:string) {
  // Remove the '0x' prefix if present
  if (hex.startsWith('0x')) {
      hex = hex.slice(2);
  }

  // Ensure the hex string length is even
  if (hex.length % 2 !== 0) {
      throw new Error('Hex string must have an even length');
  }

  // Create a Uint8Array with length half of the hex string length
  const byteArray = new Uint8Array(hex.length / 2);

  for (let i = 0; i < hex.length; i += 2) {
      // Convert each pair of hex characters to a byte
      byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
  }

  return byteArray;
}
async function submitCast(message:any,fid:number,signer:any) {
 
    
  const server = "https://hub.pinata.cloud";
  const url = `${server}/v1/submitMessage`;
  
   

  const postConfig = {
    headers: { "Content-Type": "application/octet-stream" },
    
  };
  const dataOptions = {
    fid: fid,
    network: 1,
  };
  // // Create a castAdd message
 
  const msg = await makeCastAdd(
    message,
    dataOptions,
    signer,
  );
  
  // // Encode the message into a Buffer (of bytes)
  //@ts-ignore
  const messageBytes = Buffer.from(Message.encode(msg.value).finish());

  // console.log(message)
    const response = await axios.post(url, messageBytes, postConfig);
    
      return response.data
    
 
}
export async function sendMessage(message:string,fid:any,signer:any,embeds?:any){
  const submitThis = await parseString(message.substring(0, 1024));
  // parentCastId: { fid: hashList[i].fid, hash: hexToUint8Array(hashList[i].hash) },
  const { hash } = await submitCast(
    {
        text: submitThis.text,
        embeds: embeds ?? [],
        embedsDeprecated: [],
        mentions: submitThis.mentions,
        mentionsPositions: submitThis.mentionsPositions,
        type: submitThis.text.length > 320 ? 1 : 0
    },
    fid,
    signer
)
return hash
}



            
