import express from 'express';
const app = express();
import { config } from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import cors from 'cors';
config({path:"./vars/.env"});

app.use(cors())


/** 
 * @see https://betterprogramming.pub/add-an-ai-to-your-discord-server-with-node-js-and-gpt-3-198b538cc05b
 * 
 */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const port = 3001;

console.log(process.env.BOT_CODE, "env code")



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

  console.error("big error", e)
});




