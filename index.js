// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("ruby-uninterested-chameleonCyclicDB")
const bank = db.collection('bank')
const axios = require('axios')
const express = require('express');
const fs = require('fs');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const { allowedNodeEnvironmentFlags } = require('process')


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});




app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    let wallet = await bank.get(interaction.member.user.id)
    if (interaction.data.name == '생성') {
        if (wallet) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  content: '너 지갑 이미 있잖아 ㅡㅡ',
                },
            });
        }
        await bank.set(interaction.member.user.id, {
            money: 1000
        })
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '지갑 만들었고 뽀너스로 천원 더 넣어줌 ㅋ 고마워 해라',
            },
        });
    } else if (!wallet) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: '`/생성` 명령어 써서 지갑 만들어라',
            },
        });
    }
    try {
        require(`./commands/${interaction.data.name}`).run(interaction, res, wallet)
    } finally {}
};



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
        "name": "생성",
        "description": "지갑 만드는 명령언데 내가 착하니까 천원씩은 넣어줌 ㅋ",
        "options": []
    },
  ]

  for (let file of fs.readdirSync('./commands')) {
    let pull = require(`./commands/${file}`);
    slash_commands.push({
        "name": file,
        "description": pull.description,
        "options": pull.options
    })
  }
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Follow documentation ')
})


app.listen(3000, () => {

})});