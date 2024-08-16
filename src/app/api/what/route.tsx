import { Queue } from "quirrel/next-app"
import {getCastByHash} from '@/lib/gaianet'
import {sendMessage} from '@/lib/submitcast'
export const whatQueue = Queue(
    "api/what", // 👈 the route it's reachable on
    async job => {
        try{
            //@ts-ignore
            const a=await getCastByHash("0x7b7c9ec629c915ba82d782e932a1b86f36fe4312") 
        // const a=await getCastByHash(job.frameData.messageHash) 
        console.log(a)
        }catch(e){
            //@ts-ignore
            console.log(e.message)
        }
        
    }
)

export const POST = whatQueue