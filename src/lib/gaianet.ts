import ky from 'ky';
import type {CastsResponse,Result,ChatCompletion} from './type'
async function getGaianetModels() {
  const response = await ky.get('https://api.gaianet.ai/api/v1/network/models/nodes/?model_name=Meta-Llama-3-8B-Instruct-Q5_K_M');
  return response.json();
}
async function getPopularFeed(fid:number): Promise<CastsResponse> {
  const response = await ky.get('https://api.neynar.com/v2/farcaster/feed/user/popular?fid='+fid, {
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR
    }
  });

  return response.json<CastsResponse>();
}

export async function getUserByUserName(username: string): Promise<Result> {
  const response = await ky.get(`https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`, {
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR
    }
  });

  return response.json<Result>();
}

export async function getCastByHash(hash: string): Promise<any> {
  const response = await ky.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`, {
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR
    }
  });

  return response.json();
}
export async function getUserBulk(fids: string): Promise<any> {
  const response = await ky.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, {
    headers: {
      'accept': 'application/json',
      'api_key': process.env.NEYNAR
    }
  });

  return response.json();
}
function getRandomNumber(length:number): number{
    const max = Math.floor(length);
    return Math.floor(Math.random() * (max));
  }

export async function generateRoastOrPraise(username:string,roastOrPraise:"roast"|"praise"): Promise<ChatCompletion>{
    const llamaModel=await getGaianetModels()
    
    
    //@ts-ignore
    const filteredModel=llamaModel.data.objects.filter(obj => obj.status === "ONLINE")
    const getRandomModel=filteredModel[getRandomNumber(filteredModel.length-1)]
    // console.log(filteredModel.length)
    // console.log(getRandomNumber(filteredModel.length-1))
    // return "::" as any
    const user=await getUserByUserName(username);
    const {fid,activeStatus,displayName,followerCount,followingCount,powerBadge,profile}=user.result.user
    let populars=[] as any
    try{
      const popularFeed=await getPopularFeed(fid)
      //@ts-ignore
      populars=popularFeed.casts.map(a=>({text:a.text}))
    }catch{
console.log("no populars")
    }
    
    
    const detail=JSON.stringify({activeStatus,displayName,followerCount,followingCount,powerBadge,profile,popularPost:populars});
    const response = await ky.post(`https://0x768da699e7b40d6fa4660afefa33ef6ccc45749a.us.gaianet.network/v1/chat/completions`, {
      json: {
        "messages": [
          {
            role: "system",
            content: roastOrPraise==="roast"?"you're a roast master":"You are a helpful, respectful, and honest assistant."
        },
        {
            role: "user",
            content: `give a short and ${roastOrPraise==="roast"?"harsh roasting":"glowing praise"} for the following social media user: "${username}". Here are the details: ${detail}`
        }
        ],
        "model": "Meta-Llama-3-8B-Instruct-Q5_K_M"
      },
      retry: {
        limit: 3,
        methods: ['post'],
        statusCodes: [408,504],
        backoffLimit: 3000
      },
      timeout: 50000
    });
    return response.json<ChatCompletion>()
    
  }
  