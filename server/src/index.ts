import express, {Request,Response} from 'express';
const app = express()
import { config } from 'dotenv'
import { Client, GatewayIntentBits } from 'discord.js'
import Twitter from 'twitter-lite';
import cors from 'cors'
var Twit = require('twit')
config({path:"./vars/.env"})

app.use(cors())


/** 
 * @see https://betterprogramming.pub/add-an-ai-to-your-discord-server-with-node-js-and-gpt-3-198b538cc05b
 * 
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const twitterApiKey = process.env.TWITTER_API_KEY;
const twitterApiSecret = process.env.TWITTER_API_KEY_SCRET;

if(!twitterApiKey){
  console.error('twitter api is not defined');
  process.exit(1);
}

if (!twitterApiSecret) {
  console.error('Twitter API secret is not defined in .env file'); 
  process.exit(1);
}

const twitClient = new Twitter(
  {
    consumer_key:twitterApiKey,
    consumer_secret:twitterApiSecret,
    access_token_key:process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
    // timeout_ms: 60*1000
  }
);

const verifyFollow = async (sourceUser:any, targetUser:any)=>{
  try {
    // Get user IDs for the source and target users
    const sourceUserId = await twitClient.get('users/show', { screen_name: sourceUser }).then((res) => res.id_str);
    const targetUserId = await twitClient.get('users/show', { screen_name: targetUser }).then((res) => res.id_str);

   

    // Check if the source user follows the target user
    const result = await twitClient.get('friendships/show', {
      source_id: sourceUserId,
      target_id: targetUserId,
    });
    console.log(result.relationship.source.following);

  } catch (err) {
    console.error('Error verifying Twitter follow', err);
    return false;
  }
}

app.get("/api/check-follow", async (req,res)=>{
  try {
    const { sourceUser, targetUser } = req.query;

    // Verify that the source user is following the target user on Twitter
    const isFollowing =  verifyFollow(sourceUser, targetUser);
    res.status(200).json({ isFollowing });
    // console.log(isFollowing, "following or not")
  } catch (err) {
    console.error('Error checking Twitter follow status', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})







// app.post("/api/access_token", (req:Request, res:Response) => {

// //  twitterClient.getBearerToken((err:boolean, bearerToken:'') => {
// //     if (err) {
// //       res.status(500).send({ error: err });
// //     } else {
// //       console.log(bearerToken,"bearer")
// //       res.send({ access_token: bearerToken });
// //     }
// //   });

// twitClient.getOAuth2Token((err:any,accessToken:string)=>{
//   if (err) {
//     res.status(500).send({ error: err });
//   } else {
//     res.send({ access_token: accessToken });
//   }
// })
// });



// Endpoint to check if a user follows a particular Twitter handle
// app.get("/api/follows/:username", (req, res) => {
//   const { username } = req.params;
//   const { access_token } = req.query;

//   const twitterClient = new Twitter({
//     bearer_token: access_token as string,
//   });

//   twitterClient.get("users/show", { screen_name: username }, (err:any, user:any, response:any) => {
//     if (err) {
//       res.status(500).send({ error: err });
//     } else {
//       twitterClient.get(
//         "friendships/show",
//         {
//           source_screen_name: user.screen_name,
//           target_screen_name: username,
//         },
//         (err:any, friendship:any, response:any) => {
//           if (err) {
//             res.status(500).send({ error: err });
//           } else {
//             res.send({ isFollowing: friendship.relationship.source.following });
//           }
//         }
//       );
//     }
//   });
// });









const port = 3001;

console.log(process.env.BOT_CODE, "env code");
console.log(process.env.TWITTER_API_KEY, "twitter env code");

//twitter verifiication

// API endpoint to check if user has followed a Twitter handle







//discord verification
client.on('ready', () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
});

app.get('/check/:username', async (req, res) => {
  const { username } = req.params;
  const guildId = '1087345892333469706';


  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch({ query: username, limit: 1 });
    if (member.size > 0) {
      console.log("user is shit")
      res.send({ success: true, message: `${username} is a member of the server` });
    } else {
      console.log("user isnt")
      res.send({ success: false, message: `${username} is not a member of the server` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
})

client.login(process.env.BOT_CODE).then((e)=>{
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}).catch(e=>{
  console.error("Big error ", e);
});




