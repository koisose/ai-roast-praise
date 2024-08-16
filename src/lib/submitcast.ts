
// @ts-ignore
import {  Message,makeCastAdd } from "@farcaster/core";
import axios from "axios";

export async function submitCast(message:any,fid:number,signer:any) {
 
    
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
    process.env.SIGNER,
  );
  
  // // Encode the message into a Buffer (of bytes)
  //@ts-ignore
  const messageBytes = Buffer.from(Message.encode(msg.value).finish());

  // console.log(message)
    const response = await axios.post(url, messageBytes, postConfig);
    
      return response.data
    
 
}
export async function sendMessage(){
  const submitThis = await parseString(castInput.substring(0, 1024));
  const { hash } = await submitCast(
    {
        text: submitThis.text,
        embeds: embedList,
        embedsDeprecated: [],
        mentions: submitThis.mentions,
        mentionsPositions: submitThis.mentionsPositions,
        type: submitThis.text.length > 320 ? 1 : 0
    },
    fid,
    signer
)
}



            
