<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();

const classObject = {
  info: {
    "pi-info-circle": true,
    info: true,
  },
  warning: {
    "pi-exclamation-triangle": true,
    warning: true,
  },
  danger: {
    "pi-exclamation-circle": true,
    danger: true,
  },
};

const props = defineProps({
  items: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "Thông báo hệ thống",
  },
});

const isActiveNotication = ref(false);

const el = ref();

onClickOutside(el, () => {
  isActiveNotication.value = false;
});

const toogle = () => {
  isActiveNotication.value = !isActiveNotication.value;
};
const logOut = () => {
  topbarMenuActive.value = false;
  // router.push("/auth/login");
  return router.push({ name: "login" });
};
</script>

<template>
  <div ref="el">
    <button class="p-link layout-topbar-button" @click="toogle">
      <i class="pi pi-user"></i>
      <span>Người dùng</span>
      <div class="badge-d" v-badge.danger="'10+'"></div>
    </button>
    <div class="alert" :class="{ 'alert-show': isActiveNotication }">
      <h5 class="alert-title">{{ props.title }}</h5>
      <ul class="alert-container overflow-y-auto">
        <li v-for="item in props.items" :key="item">
          <router-link
            :to="item.to"
            class="items flex align-items-center justify-content-center"
          >
            <div class="item-icon">
              <div class="icon">
                <i :class="item.icon" style=""></i>
              </div>
            </div>
            <div class="alert-content">
              <div class="item-title">
                <p class="font-bold m-0">{{ item.title }}</p>
              </div>
              <div class="item-content">{{ item.content }}</div>
            </div>
          </router-link>
        </li>
      </ul>
      <!-- <div class="alert-footer">
        <li><router-link to="">Xem tất cả thông báo</router-link></li>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.alert-footer {
  padding: 20px;
  text-align: center;
}

.info {
  color: var(--primary-color);
}

.warning {
  color: rgb(255, 203, 33);
}

.danger {
  color: rgb(244 63 94);
}

.item-title {
  display: flex;
  justify-content: space-between;
}

.item-content {
  /* padding: 5px 0 0 0; */
  /* width: 255px; */
  /* text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden; */
}

.alert-content {
  margin-left: 10px;
  width: 100%;
}

a.items {
  width: 100%px;
  height: 65px;
  padding: 10px;
  color: black;
}

a.items:hover {
  background-color: #f6f9fc;
}

.item-icon {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon i {
  font-size: 24px;
}

.alert-title {
  padding: 20px;
  margin: 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.24);
  -webkit-font-smoothing: antialiased;
}
.alert-container {
  /* height: 200px; */
  padding: 10px;
  margin: 0;
  list-style-type: none;
}
.alert {
  display: none;
  /* width: 350px; */
  position: absolute;
  background-color: #fff;
  border: 0.3px solid rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  z-index: 1000;
  top: calc(100% + 10px);
  right: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.alert.alert-show {
  display: block;
}

.badge-d {
  top: 15px;
  right: 25px;
  display: block !important;
  position: absolute;
}
/* width */
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
