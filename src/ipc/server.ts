import { ipcMain } from 'electron'
import { Server, createServer } from 'net'
import ExSocket from './ex-socket'

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

let server: Server | null = null
const exSockets = []

ipcMain.on('server-open', (event, port) => {
  if (server) return event.reply('server', !!server)
  server = createServer((socket) => {
    console.log('socket opened')
    const exSocket = new ExSocket(socket)
    console.log(exSocket)
    exSockets.push(exSocket)
    event.reply('socket-opened', exSocket.info)
    socket.on('data', (data) => {
      console.log(data)
      console.log(data.toString())
      event.reply('socket', 'data', data.toString().trim(), socket.remoteAddress)
    })
    socket.on('close', () => {
      console.log('socket closed')
      event.reply('socket-closed', exSocket.info)
    })
  })
  server.listen(port)
  console.log(`server listened ${port}`)
  event.reply('server', !!server)
})

ipcMain.on('server-close', (event) => {
  if (!server) return event.reply('server', !!server)
  server.close()
  server = null
  console.log('server closed')
  event.reply('server', !!server)
})
