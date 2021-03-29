<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      tester

      <v-spacer />
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>{{ serverActive ? 'mdi-lan-connect' : 'mdi-lan-disconnect' }}</v-icon>
          </v-btn>
        </template>
        <v-form
          v-if="!serverActive"
          @submit="serverOpen"
        >
          <v-card>
            <v-card-title>서버 연결</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="port"
                outlined
                label="포트"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                type="submit"
                color="success"
              >
                연결
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
        <v-form
          v-else
          @submit="serverClose"
        >
          <v-card>
            <v-card-title>서버 종료</v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                type="submit"
                color="error"
              >
                끊기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-card>
          <v-toolbar
            color="accent"
            dark
            dense
            flat
          >
            connect
          </v-toolbar>
          <v-card-text>
            <v-textarea
              v-model="text"
              outlined
              label="packet"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
          </v-card-actions>
          <v-card-text>
            <v-list-item
              v-for="item in socketInfos"
              :key="item.id"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.id }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.ip }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SocketInfo } from './models/socket-info'

const ipcRenderer = window.ipcRenderer

@Component<App>({
  created () {
    this.init()
  }
})
export default class App extends Vue {
  serverActive = false
  text = ''
  dialog = false
  port = 3000
  socketInfos: SocketInfo[] = []

  init () {
    ipcRenderer.on('server', (event: Electron.IpcRendererEvent, active: boolean) => {
      console.log(active)
      this.serverActive = active
    })
    ipcRenderer.on('socket', (event: Electron.IpcRendererEvent, status: string, data: string, ip: string) => {
      console.log(status)
      console.log(data)

      // this.text = status + ' ' + data + ' ' + ip + '\n' + this.text
      this.text = `${status} ${data} ${ip}\n${this.text}`
    })

    ipcRenderer.on('socket-opened', (event: Electron.IpcRendererEvent, info: SocketInfo) => {
      console.log(info)
      console.log('opened')
      this.socketInfos.push(info)
    })

    ipcRenderer.on('socket-closed', (event: Electron.IpcRendererEvent, info: SocketInfo) => {
      console.log(info)
      console.log('closed')
      const index = this.socketInfos.findIndex(s => s.id === info.id)
      this.socketInfos.splice(index, 1)
    })
  }

  serverOpen () {
    // window.ipcRenderer.send('asynchronous-message', 'ping')
    ipcRenderer.send('server-open', this.port)
    this.dialog = false
  }

  serverClose () {
    ipcRenderer.send('server-close')
    this.dialog = false
  }
}
</script>
