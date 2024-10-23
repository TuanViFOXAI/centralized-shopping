<template>
  <div class="list-area">
    <ul class="ul-list" ref="listEl">
      <li class="li-list p-2" v-for="item in items" :key="item.ID">
        <div class="avatar">
          <!-- <Avatar :image="item.image" shape="circle" /> -->
        </div>
        <div
          class="label border-round p-2 surface-200 mb-3 cursor-pointer hover:surface-300"
          @click="oaut(item.ID)"
        >
          <span>{{ item.UserCode }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import API from "../../../apis/api.test";

const listEl = ref(null);
const items = ref(await API.getUsers());
</script>

<style scoped>
.list-area {
  height: 100%;
}
.avatar {
  padding-left: 10px;
}
.ul-list {
  padding: 10px;
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: scroll;
}
.li-list:hover {
  background: var(--surface-hover);
  border-left: 2px solid var(--blue-300);
}
.li-list {
  cursor: pointer;
  padding: 5px 0 5px 0;
  display: flex;
  width: 100%;
}
.label {
  padding-left: 10px;
  margin: auto;
  width: 100%;
}

::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
