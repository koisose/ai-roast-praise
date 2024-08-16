
// @ts-ignore
import { parseString } from './parseString'
//@ts-ignore
import { HubRestAPIClient } from '@standard-crypto/farcaster-js-hub-rest';
import axios from 'axios'
async function submitCast(message: any, fid: any, signer: any) {


  const server = "https://hub-api.neynar.com";
  const signerPrivateKey = signer;
    const writeClient = new HubRestAPIClient({ hubUrl: server,  axiosInstance: axios.create({
      headers: { api_key: process.env.NEYNAR },
  }),});
  console.log(Number(fid))
  const publishCastResponse = await writeClient.submitCast(message, Number(fid), signerPrivateKey);
return publishCastResponse.hash

}
export async function sendMessage(message: string, fid: any, signer: any,url:any) {
  const submitThis = await parseString(message.substring(0, 320));
// console.log(submitThis)
// return
  const a = await submitCast(
    {
      text: submitThis.text,
      embeds: [{url}],
      embedsDeprecated: [],
      mentions: submitThis.mentions,
      mentionsPositions: submitThis.mentionsPositions,
      
    
    },
    fid,
    signer
  )
  console.log(a)
  // return hash
}




