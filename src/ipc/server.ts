import { ipcMain } from 'electron'
import { Server, createServer } from 'net'
import ExSocket from './ex-socket'
import { SocketInfo } from '../models/socket-info'

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

let server: Server | null = null
const exSockets: ExSocket[] = []

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
      // event.reply('socket', 'data', data.toString().trim(), socket.remoteAddress)
      const hex = data.toJSON().data.map(v => v.toString(16).padStart(2, '0')).join(' ')
      event.reply('socket-data', exSocket.info, data.toString().trim(), hex, 'r')
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

ipcMain.on('server-status', (event) => {
  event.reply('server', !!server)
})

ipcMain.on('socket-data', (event, info: SocketInfo, message: string) => {
  const exSocket = exSockets.find(s => s.info.id === info.id)
  if (!exSocket) return
  exSocket.write(message)
  const hex = Buffer.from('message').toJSON().data.map(v => v.toString(16).padStart(2, '0')).join(' ')
  event.reply('socket-data', exSocket.info, message, hex, 't')
})
