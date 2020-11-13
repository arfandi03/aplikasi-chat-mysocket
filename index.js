const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {})
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_chat'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
let countUserOnline = 1
io.on('connection', socket => {
    socket.on('join', param => {
        console.log('user join')
        countUserOnline++;
        io.emit('countUserOnline', countUserOnline)
    })
    socket.on('message', param => {
        console.log('user mengirim pesan')
        io.emit('message', param)
        console.log(param.text)
        let data = { message: param.text }
        let sql = "INSERT INTO chat SET ?";
        conn.query(sql, data, (err, results) => {
            if (err) throw err;
        });
    })
    socket.on('disconnect', param => {
        console.log('user keluar')
        countUserOnline--;
        io.emit('countUserOnline', countUserOnline)

    })
})

server.listen(3000)