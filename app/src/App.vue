<template>
  <v-app>
    <v-app-bar app color="grey lighten-3">
      <div class="d-flex align-center">
          Digital Menu
      </div>
    </v-app-bar>
    <v-main>
      <DigitalMenu></DigitalMenu>
    </v-main>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Md. Nazrul Islam</strong>
      </v-col>
    </v-footer>
  </v-app>


</template>

<script>
import DigitalMenu from './components/DigitalMenu.vue';

export default {
  name: 'App',

  components: {
    DigitalMenu,
  },

  data: () => ({
    //
  }),
};
</script>
