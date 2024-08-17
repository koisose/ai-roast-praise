import { Queue } from "quirrel/next-app"
import { generateRoastOrPraise, getUserBulk } from '@/lib/gaianet'
import { saveData } from '@/lib/mongo'
import { sendMessage } from '@/lib/submitcast'
import { generateImage } from '@/lib/create-image'
export const whatQueue = Queue(
    "api/what", // 👈 the route it's reachable on
    async job => {
        console.log("roast or praise")
        //@ts-ignore
        if (job.frameData.fid === 568857 || job.username === undefined || job.type === undefined) {
            console.log("TESTBOT")
            return
        }
        let id = ""
        //@ts-ignore
        const getUsername = await getUserBulk(job.frameData.fid)

        try {

            //@ts-ignore
            const roastOrPraise = await generateRoastOrPraise(job.username, job.type);
            //@ts-ignore
            id = await saveData({ username: job.username, creator: getUsername.users[0].username, type: job.type, message: roastOrPraise.choices[0].message.content }, "roastorpraise")
            //@ts-ignore
            await generateImage("/screenshot/" + id._id.toString(), id._id.toString())

        } catch (e) {
            //@ts-ignore
            console.log(e.message)
            //@ts-ignore
            await sendMessage(`@${getUsername.users[0].username} sorry there is an error on our end please try to ${job.type} again`, process.env.FID, process.env.SIGNER, `${process.env.QUIRREL_BASE_URL}/api`)
        }

        try {

            //@ts-ignore
            // const a=await getCastByHash("0x7b7c9ec629c915ba82d782e932a1b86f36fe4312") 
            // const a = await getCastByHash(job.frameData.fid)
            //@ts-ignore
            // ,`${process.env.QUIRREL_BASE_URL}/roastorpraise/${id._id.toString()}`
            await sendMessage(job.username === getUsername.users[0].username ? `@${job.username} this is your ${job.type}` : `@${job.username} you've been ${job.type === "praise" ? "praised" : "roasted"} by @${getUsername.users[0].username}`, process.env.FID, process.env.SIGNER, `${process.env.QUIRREL_BASE_URL}/api/roastorpraise/${id._id.toString()}`)

        } catch (e) {
            //@ts-ignore
            console.log("dsada", e.message)
        }

    }
)

export const POST = whatQueue