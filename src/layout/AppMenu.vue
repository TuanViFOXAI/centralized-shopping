<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import cookie from "../service/CookieService";

import AppMenuItem from "./AppMenuItem.vue";
import dataMenu from "../../public/demo/data/datamenu.json";
const route = useRoute();
let UserType = null;
let menudata = null;
if (JSON.parse(localStorage.getItem("user"))) {
  UserType = JSON.parse(localStorage.getItem("user"))["UserType"];
  if (UserType != "Supplier")
    menudata = JSON.parse(localStorage.getItem("user")).menu.data;
}

const model = ref(UserType == "Supplier" ? dataMenu : menudata);
model.value = [
  {
    MnCode: "menu_0",
    children: model.value,
  },
];
const sort_arr = (data) => {
  for (let index = 0; index < data.length; index++) {
    if (data[index].children != null) {
      data[index].children.sort((a, b) => {
        if (a.Sort > b.Sort) return 1;
        else return -1;
      });
      sort_arr(data[index].children);
    }
  }
};
onMounted(() => {
  if (UserType != "Supplier") sort_arr(model.value);

  // console.log(model.value);
});
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>
