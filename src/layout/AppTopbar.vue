<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
  watchEffect,
} from "vue";
import { useLayout } from "@/layout/composables/layout";
import { useRouter } from "vue-router";
import i18n from "../locale/i18n";
import cookie from "../service/CookieService";
import AlertDropdown from "../components/AlertDropdown.vue";
import UserDropdown from "../components/UserDropdown.vue";
import socket from "../services/socket";
import API from "../apis/api";

const lang = ref();
const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const user = JSON.parse(localStorage.getItem("user"));
const message = ref(null);
const count_noti = ref(0);
onMounted(() => {
  API.get_all("noti").then((res) => {
    if (res.data)
      for (let index = 0; index < res.data.length; index++) {
        const item = res.data[index];
        thongbao.value.items.push({
          title: "Thông báo",
          content: item.Message,
          level: "info",
          time: "0",
          data: item,
          isRead: item.IsRead,
        });
      }
  });
  bindOutsideClickListener();
  lang.value = i18n.global.locale.value;
});
watchEffect(() => {
  if (user) {
    const conn = socket.connect_socket(user["UserID"]);
    conn.onmessage = (event) => {
      try {
        const mes = JSON.parse(event.data);
        thongbao.value.items.unshift({
          title: "Thông báo",
          content: mes.Message,
          level: "info",
          time: "0",
          data: mes,
        });
        // count_noti.value = count_noti.value + 1;
      } catch (error) {}
    };
  }
});
onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const logoUrl = computed(() => {
  return `https://fox.ai.vn/wp-content/uploads/2023/09/logowhite.png`;
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
const logOut = () => {
  topbarMenuActive.value = false;
  // router.push("/auth/login");
  return router.push({ name: "login" });
};
const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
const menuLang = ref(null);

const openSelectLanguage = ($event) => {
  menuLang.value.toggle($event);
};

const langOptions = ref([
  {
    label: "Tiếng Việt",
    locale: "vi",
    cmd: () => {
      i18n.global.locale.value = "vi";
      lang.value = "vi";
      cookie.set("lang", "vi", 30);
    },
  },
  {
    label: "English",
    locale: "en",
    cmd: () => {
      i18n.global.locale.value = "en";
      lang.value = "en";
      cookie.set("lang", "en", 30);
    },
  },
]);

const thongbao = ref({
  items: [],
  title: "Thông báo hệ thống",
});

const userdropdown = ref({
  items: [
    {
      title: "Thông tin người dùng",
      icon: "pi pi-user",
      to: "/profile",
    },
    {
      title: "Đăng xuất",
      icon: "pi pi-power-off",
      to: "/auth/login",
    },
  ],
  title: "Quản lý người dùng",
});
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <img src="../assets/img/logo/Logo_White.png" alt="logo" style="width: 120px; height: auto" />
      <span style="color: #ffffff; margin-left: 10px; font-size: 1rem"
        >MUA SẮM TẬP TRUNG</span
      >
    </router-link>
    <div id="rotate">
      <button
        class="p-link layout-menu-button layout-topbar-button ml-0"
        @click="onMenuToggle()"
      >
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      @click="onTopBarMenuButton()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button @click="openSelectLanguage" class="p-link layout-topbar-button">
        <Avatar
          :image="'/demo/images/flag/' + lang + '.svg'"
          class="pi"
          style="border: 2px solid white; border-radius: 50%"
          shape="circel"
        />
        <span class="pl-2">Language</span>
      </button>
      <Menu
        ref="menuLang"
        class="py-2"
        id="overlay_menu"
        :model="langOptions"
        :popup="true"
      >
        <template #item="{ item, props }">
          <a
            v-bind="props.action"
            @click="item.cmd"
            class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround"
          >
            <Avatar
              :image="'/demo/images/flag/' + item.locale + '.svg'"
              class="mr-2"
              shape="circel"
            />
            <span class="inline-flex flex-column">
              <span class="pl-1">{{ item.label }}</span>
            </span>
          </a>
        </template>
      </Menu>
      <AlertDropdown
        :items="thongbao.items"
        :title="thongbao.title"
        :count_noti="
          thongbao.items.filter((val) => {
            return !val.isRead;
          }).length
        "
      />
      <div class="flex align-items-center justify-content-center">
        <UserDropdown :items="userdropdown.items" :title="userdropdown.title" />
        <p class="m-0 text-white">{{ user ? user.UserName : null || null }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
