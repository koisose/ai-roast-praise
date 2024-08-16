/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { Box, Heading, Text, VStack, vars } from '@/frog-ui/ui'
import {whatQueue} from '../what/route'
const app = new Frog({
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
      padding="32"
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
app.frame('/whats', async(c) => {
  const { buttonValue, inputText,frameData } = c
  await whatQueue.enqueue({username:inputText,type:buttonValue,frameData})
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
