import { Socket } from 'net'
import { v4 } from 'uuid'
import { SocketInfo } from '../models/socket-info'

export default class ExSocket {
  socket: Socket | null = null
  info: SocketInfo = {
    id: v4(),
    createdAt: new Date(),
    ip: ''
  }

  constructor (socket: Socket) {
    this.socket = socket
    this.info.ip = socket.remoteAddress || 'unknown'
  }

  write (bytes: Buffer) {
    if (!this.socket) return
    this.socket.write(bytes)
  }
}
