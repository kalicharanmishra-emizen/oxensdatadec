// const http = require('http');
const fs = require('fs');
const {accpetReq} = require('./socket');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();
const options = {
//key: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/key.pem').toString(),
	//cert: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/oxensnew.crt').toString(),
//cert: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/main.pem').toString(),
//	ca: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/fullchain4.pem').toString(),
	key: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/privkey14.pem').toString(),
	cert: fs.readFileSync('/var/www/domains/oxens.ezxdemo.com/public_html/ssl/fullchain14.pem').toString(),
};
const app = require('./app');
const port= process.env.PORT || 8000
// const server = http.createServer(app)
const server = https.createServer(options,app)
const { Server } = require("socket.io");
const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection",socket=>{
    console.log('socket connect');
    //  send all request to socket
    accpetReq(socket)
})
server.listen(port,()=>{
console.log('server in up on',port)
})
