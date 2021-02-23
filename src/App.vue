<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      tester

    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-card>
          <v-toolbar color="accent" dark dense flat>
            connect
          </v-toolbar>
          <v-card-text>
            ijijiw
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="success" @click="serverOpen">열기</v-btn>
            <v-btn color="error" @click="serverClose">닫기</v-btn>

          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component<App>({
  created () {
    console.log(window.ipcRenderer)
    window.ipcRenderer.on('asynchronous-reply', (event: Electron.IpcRendererEvent, arg: string) => {
      // console.log(event)
      console.log(arg)
    })
  }
})
export default class App extends Vue {
  serverOpen () {
    window.ipcRenderer.send('asynchronous-message', 'ping')
  }

  serverClose () {
    //
  }
}
</script>
