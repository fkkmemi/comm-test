import { ipcMain } from 'electron'
import { Server, createServer } from 'net'

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg) // prints "ping"
  event.reply('asynchronous-reply', 'pong')
})

let server: Server | null = null

ipcMain.on('server', (event, arg) => {
  if (arg === 'open') {
    if (server) return event.reply('server', !!server)
    server = createServer((socket) => {
      console.log('socket opened')
      event.reply('socket', 'opened', null)
      socket.on('data', (data) => {
        console.log(data)
        console.log(data.toString())
        event.reply('socket', 'data', data.toString().trim(), socket.remoteAddress)
      })
      socket.on('close', () => {
        console.log('socket closed')
        event.reply('socket', 'closed', null)
      })
    })
    server.listen(1111)
    console.log('server listened')
  } else {
    if (!server) return event.reply('server', !!server)
    server.close()
    server = null
    console.log('server closed')
  }
  event.reply('server', !!server)
})
