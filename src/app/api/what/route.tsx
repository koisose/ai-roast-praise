import { Queue } from "quirrel/next-app"

export const whatQueue = Queue(
    "api/what", // 👈 the route it's reachable on
    async job => {
console.log(job)
    }
)

export const POST = whatQueue