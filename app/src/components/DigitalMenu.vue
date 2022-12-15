<template>
  <v-container>

    <v-row class="text-center justify-center pa-6">
      <h1 class="font-weight-bold text-h2 basil--text">
        Digital Menu
      </h1>
    </v-row>

    <v-row class="text-center justify-center">
      <v-btn color="success" @click="addItem">
        <span class="mr-2">Add new item</span>
        <v-icon dark>
          mdi-cloud-upload
        </v-icon>
      </v-btn>
    </v-row>

    <v-row class="text-center justify-center pa-6">
      <v-col cols="12" sm="6" md="8">
        <p class="">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.</p>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
      <v-tab v-for="item in items" :key="item" @click="getMenuItem(item)">
        {{ item }}
      </v-tab>
    </v-tabs>

    <!-- Items based on selection -->
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-row>
          <v-card class="mx-auto my-12" width="370" v-for="menu in itemsList" :key="menu.id">

            <!-- <v-img height="150" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img> -->
            <!-- <v-img height="150" :src="menu.image"></v-img> -->

            <v-card-title>{{ menu.name }} <span class="menu-price">$ {{ menu.price }}</span> </v-card-title>

            <v-card-text>
              <div>{{ menu.description }}
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-title>Available at: {{ menu.available_time }}</v-card-title>

            <v-card-text>
              <div class="heading-4" color="primary">
                Approximate Waiting time: {{ menu.waiting_time }} minutes
              </div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-actions>
              <v-chip class="ma-2" color="green" text-color="white" v-if="menu.available">
                Available
              </v-chip>
              <v-chip class="ma-2" color="red" text-color="white" v-else>
                Sold Out
              </v-chip>
            </v-card-actions>
            <v-divider class="mx-4"></v-divider>
            <v-row>
              <v-col>
                <v-btn color="red lighten-2" text @click="deleteItem(menu)">
                  delete
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="red lighten-2" text @click="editMenuItem(menu)">
                  Edit
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-tab-item>
    </v-tabs-items>

    <!-- Edit and add new menu dialog -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select :items="['Main course', 'Beverage', 'Dessert', 'Starter']" label="Category*"
                    v-model="editedItem.category" :rules="fieldRules" required></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Name" v-model="editedItem.name" :rules="fieldRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Available time" v-model="editedItem.available_time"
                    :rules="fieldRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select :items="[true, false]" label="Available*" v-model="editedItem.available" :rules="fieldRules"
                    required></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Price" type="number" v-model="editedItem.price"
                    :rules="fieldRules"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-text-field label="Waiting time" type="number" v-model="editedItem.waiting_time"
                    :rules="fieldRules"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field label="Description" v-model="editedItem.description" :rules="fieldRules"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="submitorUpdate">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- delete dialog -->
    <v-dialog v-model="dialogDelete" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete {{ editedItem.name }}?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancelDelete">Cancel</v-btn>
          <v-btn color="primary" text @click="deleteConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar top v-model="snackbar" :timeout="timeout" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
//import menu from '../store/item.json';
import MenuService from "../services/MenuService";
export default {
  components: {
  },
  data: () => ({
    fieldRules: [(v) => !!v || "Field must be filled out"],
    snackbar: false,
    snackbarText: '',
    timeout: 2000,
    snackbarColor: 'black',
    tab: null,
    dialog: false,
    dialogDelete: false,
    items: [
      'Main course', 'Beverage', 'Dessert', 'Starter',
    ],
    itemsList: [],
    menuList: [],
    editedIndex: -1,
    editedItem: {
      _id: "",
      name: "",
      price: "",
      category: "",
      available_time: "",
      waiting_time: "",
      available: "",
      description: "",
      image: ""
    },
    defaultItem: {
      _id: "",
      name: "",
      price: "",
      category: "",
      available_time: "",
      waiting_time: "",
      available: "",
      description: "",
      image: ""
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  async mounted() {
    try {
      this.menuList = (
        await MenuService.menuGet()
      ).data.data;
    } catch (error) {
      console.error(error);
    }
    this.itemsList = this.menuList.filter(items => items.category === 'Main course');
  },
  methods: {
    //tab items control and filtering dishes based on category
    getMenuItem(item) {
      if (item === 'Main course') {
        this.itemsList = this.menuList.filter(items => items.category === 'Main course');
      }
      if (item === 'Beverage') {
        this.itemsList = this.menuList.filter(items => items.category === 'Beverage');
      }
      if (item === 'Dessert') {
        this.itemsList = this.menuList.filter(items => items.category === 'Dessert');
      }
      if (item === 'Starter') {
        this.itemsList = this.menuList.filter(items => items.category === 'Starter');
      }
    },

    addItem() {
      this.dialog = true;
    },
    editMenuItem(item) {
      this.editedIndex = this.itemsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.reset();
    },


    async submitorUpdate() {
      this.$refs.form.validate();
      if (this.$refs.form.validate() == true) {
        if (this.editedIndex === -1) {
          try {
            let response = await MenuService.menuSubmit({
              name: this.editedItem.name,
              price: this.editedItem.price,
              category: this.editedItem.category,
              available_time: this.editedItem.available_time,
              waiting_time: this.editedItem.waiting_time,
              available: this.editedItem.available,
              description: this.editedItem.description,
              image: this.editedItem.image
            });
            if (response.status === 200) {
              this.menuList = (
                await MenuService.menuGet()
              ).data.data;
              this.getMenuItem(this.editedItem.category);
              this.snackbarText = "Item added successfully";
              this.snackbarColor = 'green darken-1';
              this.snackbar = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
        else {
          try {
            let response = await MenuService.menuUpdate({
              _id: this.editedItem._id,
              name: this.editedItem.name,
              price: this.editedItem.price,
              category: this.editedItem.category,
              available_time: this.editedItem.available_time,
              waiting_time: this.editedItem.waiting_time,
              available: this.editedItem.available,
              description: this.editedItem.description,
              image: this.editedItem.image
            });
            if (response.status === 200) {
              if (this.editedIndex > -1) {
                Object.assign(this.itemsList[this.editedIndex], this.editedItem);
              }
              this.snackbarText = "Item updated successfully";
              this.snackbarColor = 'green lighten-1';
              this.snackbar = true;
            }
          } catch (error) {
            console.log(error);
          }
        }
        {
          this.menuList = (
            await MenuService.menuGet()
          ).data.data;
          this.close();
        }
      }
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteConfirm() {
      try {
        let response = await MenuService.menuDelete({
          _id: this.editedItem._id,
        });
        if (response.data.message === "Dish deleted") {
          this.itemsList = this.itemsList.filter(items => items._id != this.editedItem._id);
          this.menuList = (
            await MenuService.menuGet()
          ).data.data;
          this.getMenuItem(this.editedItem.category);
          this.snackbarText = response.data.message;
          this.snackbarColor = 'green lighten-1';
          this.snackbar = true;
          this.cancelDelete();
        }
        else {
          this.snackbarText = response.data.message;
          this.snackbarColor = 'red';
          this.snackbar = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    cancelDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
}
</script>
<style>
.menu-price {
  position: absolute;
  right: 10px;
}
</style>