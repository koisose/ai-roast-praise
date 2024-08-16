/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { Box, Heading, Text, VStack, vars } from '@/frog-ui/ui'
import { whatQueue } from '../what/route'
import { getUserByUserName } from '@/lib/gaianet'
import { getDataById } from '@/lib/mongo'
const app = new Frog({
  // imageAspectRatio: '1:1',
  ui: { vars },
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: 'Roast or praise farcaster user',
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {

  return c.res({
    image: (
      <Box
        grow
        alignVertical="center"
        backgroundColor="blue"
        padding="3"
      >
        <VStack gap="4">
          <Heading>Roast or Praise Farcaster User</Heading>
          <Text color="text200" size="20">
            powered by gaianet
          </Text>
        </VStack>
      </Box>
    ),
    intents: [
      <TextInput placeholder="Enter farcaster username" />,
      <Button action='/whats' value="roast">Roast</Button>,
      <Button action='/whats' value="praise">Praise</Button>,


    ],
  })
})
app.frame('/roastorpraise/:id', async(c) => {
const id=c.req.param("id")
const data=await getDataById("roastorpraise",id)
  return c.res({
    imageAspectRatio:"1:1",
    image: `https://${process.env.MINIO_ENDPOINT}/image/file-${id}`,
    intents: [
        <Button action={'/giveback/'+data.creator} value={data.type}>{data.type} back</Button>,
    ],
  })
})
app.frame('/giveback/:username', async (c) => {
  const {  buttonValue, frameData } = c
  const username=c.req.param("username")
  try {
    await getUserByUserName(username as string)
  } catch {
    return c.error({ message: "can't find that username" })
  }

  await whatQueue.enqueue({ username, type: buttonValue, frameData })


  return c.res({

    image: (
      <Box
        grow
        alignVertical="center"
        alignHorizontal='center'
        padding="32"
      >
        <VStack gap="4">
          <Heading>Your {username} of {buttonValue} still being processed, we will mention you in a cast when its done</Heading>
          <Text color="text200" size="20">
            powered by gaianet
          </Text>
        </VStack>
      </Box>
    ),
    intents: [

      <Button.Reset >Back</Button.Reset>


    ],
  })



})
app.frame('/whats', async (c) => {
  const { buttonValue, inputText, frameData } = c
  try {
    await getUserByUserName(inputText as string)
  } catch {
    return c.error({ message: "can't find that username" })
  }

  await whatQueue.enqueue({ username: inputText, type: buttonValue, frameData })


  return c.res({

    image: (
      <Box
        grow
        alignVertical="center"
        alignHorizontal='center'
        padding="32"
      >
        <VStack gap="4">
          <Heading>Your {buttonValue} of {inputText} still being processed, we will mention you in a cast when its done</Heading>
          <Text color="text200" size="20">
            powered by gaianet
          </Text>
        </VStack>
      </Box>
    ),
    intents: [

      <Button.Reset >Back</Button.Reset>


    ],
  })



})
app.hono.get('/get/:id',async (c) => {
  const id=c.req.param("id")
  const data=await getDataById("roastorpraise",id)
  return c.json(data)
})
devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
