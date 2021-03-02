<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      tester
      <v-spacer/>
      <v-btn icon @click="!serverActive ? serverOpen() : serverClose()">
        <v-icon>{{serverActive ? 'mdi-lan-connect' : 'mdi-lan-disconnect' }}</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-card>
          <v-toolbar color="accent" dark dense flat>
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
            <v-spacer/>

          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

const ipcRenderer = window.ipcRenderer

@Component<App>({
  created () {
    this.init()
  }
})
export default class App extends Vue {
  serverActive = false
  text = ''

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
  }

  serverOpen () {
    // window.ipcRenderer.send('asynchronous-message', 'ping')
    ipcRenderer.send('server', 'open')
  }

  serverClose () {
    ipcRenderer.send('server', 'close')
  }
}
</script>
