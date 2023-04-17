import express from 'express';
const app = express();
import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import cors from 'cors';
const Twitter = require('twitter-lite');

config({path:"./vars/.env"});

app.use(cors())


/** 
 * @see https://betterprogramming.pub/add-an-ai-to-your-discord-server-with-node-js-and-gpt-3-198b538cc05b
 * 
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const twitterClient = new Twitter(
  {
    consumer_key:process.env.TWITTER_API_KEY,
    consumer_secret:process.env.TWITTER_API_KEY_SCRET,
    access_token_key:process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
)

const port = 3001;

console.log(process.env.BOT_CODE, "env code");
console.log(process.env.TWITTER_API_KEY, "twitter env code");

//twitter verifiication

// API endpoint to check if user has followed a Twitter handle
app.get('/api/check-follow', async (req, res) => {
  const sourceUser = req.query.sourceUser;
  const targetUser = req.query.targetUser;

  try {
    // Make API request to check friendship status
    const response = await twitterClient.get('friendships/show', {
      source_screen_name: sourceUser,
      target_screen_name: targetUser,
    });

    // Check if source user is following target user
    if (response.relationship.source.following) {
      res.json({ followed: true });
    } else {
      res.json({ followed: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check follow status' });
  }
});



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

  console.error("Big error ", e)
});




