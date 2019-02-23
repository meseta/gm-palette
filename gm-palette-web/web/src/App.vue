<template>
  <v-app>
    <v-toolbar flat app class="primary">
      <v-toolbar-title
        class="text-uppercase white--text font-weight-light"
        style="cursor: pointer"
        v-on:click=";">
        GMPalette
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>

    <v-snackbar top color="error" :timeout="0" v-model="errorFlag">
      {{ error }}
      <v-btn flat @click="errorFlag=false">Aww</v-btn>
    </v-snackbar>
    <v-snackbar top color="success" v-model="successFlag">
      {{ success }}
      <v-btn flat @click="successFlag=false">OK</v-btn>
    </v-snackbar>

    <v-content>
      <v-container>

        <v-stepper v-model="stage">
          <v-stepper-header>
            <v-stepper-step :complete="stage > 1" step="1">Enter Hex Color List</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stage > 2" step="2">Set Macro Names</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3">Genarted Macros</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card>
                <v-card-title>
                  <span class="title font-weight-light">Hex color list</span>
                </v-card-title>
                <v-card-text>
                  Paste or enter hex color list. Accepts text from Lospec .hex and .txt files
                  <v-textarea style="font-family: 'Roboto Mono', monospace;" label="Hex list" v-model="paletteText" hint="Enter or paste hex color list here" persistent-hint auto-grow></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="loadPalette()" :loading="loadingPalette">Load Colors</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card>
                <v-card-text>
                  <p>
                    <v-text-field name="prefix" label="Macro prefix" v-model="prefix" placeholder="PALETTE_"></v-text-field>
                  </p>
                  <v-list dense>
                    <template v-for="(colorData, index) in palette">
                      <v-list-tile :key="index" avatar>
                        <v-list-tile-avatar :color="'#' + colorData['color']">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-text-field :prefix="prefix" name="1" v-model="colorData['name']"></v-text-field>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat @click="back()">Back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="generate()">Generate Macros</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card>
                <v-card-title>
                  <span class="title font-weight-light">Generated Macros</span>
                </v-card-title>
                <v-card-text>
                  <v-textarea style="font-family: 'Roboto Mono', monospace;" label="Macros" v-model="generated" auto-grow readonly></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat @click="back()">Back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="copy()">Copy</v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

//import json from 'colors.json'

export default {
  name: 'App',
  data () {
    return {
      error: '',
      success: '',
      errorFlag: false,
      successFlag: false,
      stage: 1,

      loadingPalette: false,
      paletteText: '000000\r\n222034\r\n45283c\r\n663931\r\n8f563b\r\ndf7126\r\nd9a066\r\neec39a\r\nfbf236\r\n99e550\r\n6abe30\r\n37946e\r\n4b692f\r\n524b24\r\n323c39\r\n3f3f74\r\n306082\r\n5b6ee1\r\n639bff\r\n5fcde4\r\ncbdbfc\r\nffffff\r\n9badb7\r\n847e87\r\n696a6a\r\n595652\r\n76428a\r\nac3232\r\nd95763\r\nd77bba\r\n8f974a\r\n8a6f30\r\n',

      palette: [],
      prefix: 'PALETTE_',
      generated: ''
    }
  },
  computed: {
    noInput () {
      return this.inputFile === null
    },
    hasPalette () {
      return this.palette.length > 0
    }
  },
  methods: {
    back () {
      if (this.stage > 1) {
        this.stage -= 1
      }
    },
    setError (value) {
      this.successFlag = false
      this.errorFlag = true
      this.error = value
    },
    setSuccess (value) {
      this.errorFlag = false
      this.successFlag = true
      this.success = value
    },
    loadPalette () {
      this.loadingPalette = true

      return new Promise((resolve, reject) => {
        let lines = this.paletteText.match(/[^\r\n]+/g)
        this.palette = []
        let count = 1

        for (let i = 0; i < lines.length; i++) {
          let line = lines[i]
          if (!line.startsWith(';')) {
            let color
            if (line.length === 8) {
              color = line.substr(2, 7)
            } else if (line.length === 6) {
              color = line
            } else {
              reject(new Error('Error parsing line ' + (i + 1)))
            }

            this.palette.push({
              name: 'COL' + (count),
              color: color
            })
            count += 1
          }
        }
        resolve()
      })
        .then(() => {
          this.loadingPalette = false
          this.stage += 1
        })
        .catch((err) => {
          this.setError(err)
          console.log(err)
        })
    },
    generate () {
      let maxFraglength = 0
      for (let i = 0; i < this.palette.length; i++) {
        let fragment = '#macro ' + this.prefix + this.palette[i].name

        if (fragment.length > maxFraglength) {
          maxFraglength = fragment.length
        }

        this.palette[i].fragment = fragment
      }

      let text = ''
      for (let i = 0; i < this.palette.length; i++) {
        text += this.palette[i].fragment
        text += ' '.repeat(4 + maxFraglength - this.palette[i].fragment.length)
        let color = this.palette[i].color

        text += '$' + color.substr(4, 5) + color.substr(2, 3) + color.substr(0, 1)
        text += '\r\n'
      }

      this.generated = text
      this.stage += 1
    },
    copy () {
      this.$copyText(this.generated).then(() => {
        this.setSuccess('Copied to clipboard')
      }, () => {})
    }
  },
  mounted () {
  }
}
</script>

<style>
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: transparent;
    color: dimgray;
    padding: 10px 10px;
    height: 120px; /* minimum height */
    position: relative;
    cursor: pointer;
  }
  .input {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: rgba(255,255,255,0.1); /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
  </style>
