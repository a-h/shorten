<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">Shortener</h1>
      <div>
        <input type="text" v-model="urlToShorten" />
        <button @click="shorten">Shorten</button>
        <div>{{ shortenedUrl }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      urlToShorten: '',
      errors: new Array<Error>(),
      shortenedUrl: '',
    }
  },
  methods: {
    async shorten(): Promise<string> {
      try {
        console.log('attempting post')
        await fetch(`http://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
          body: this.urlToShorten,
        })
        console.log('posted')
      } catch (e) {
        console.log('got error', e)
        this.errors.push(e)
      }
      return ''
    },
  },
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
