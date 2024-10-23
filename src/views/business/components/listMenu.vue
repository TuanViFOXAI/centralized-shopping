<script setup>
import { ref, onBeforeMount, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLayout } from "@/layout/composables/layout";

const route = useRoute();
const check_b = ref(true);
const selectedPermission = ref(null);
const { layoutConfig, layoutState, setActiveMenuPermission, onMenuToggle } = useLayout();

const props = defineProps({
  item: {
    type: Object,
    default: () => [],
  },
  data: {
    type: Object,
    default: () => [],
  },
  dataMenu: {
    type: Object,
    default: () => [],
  },
  index: {
    type: Number,
    default: 0,
  },
  root: {
    type: Boolean,
    default: true,
  },
  parentItemKey: {
    type: String,
    default: null,
  },
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + "-" + props.index
    : String(props.index);

  const activeItem = layoutState.activeMenuItem;

  isActiveMenu.value =
    activeItem === itemKey.value || activeItem
      ? activeItem.startsWith(itemKey.value + "-")
      : false;
});

watch(
  () => layoutConfig.activeMenuItem.value,
  (newVal) => {
    isActiveMenu.value =
      newVal === itemKey.value || newVal.startsWith(itemKey.value + "-");
  }
);
const itemClick = (event, id) => {
  if (document.getElementById("menu-" + id).style.display === "block") {
    document.getElementById("menu-" + id).style.display = "none";
  } else {
    document.getElementById("menu-" + id).style.display = "block";
  }
};
const checkPermissionChildren = (dataMenu, ID, permissions) => {
  for (let index = 0; index < dataMenu.length; index++) {
    // if (dataMenu[index].ID == ID) {
    //   console.log(dataMenu[index]);
    //   console.log(ID);
    //   if (dataMenu[index].children) {
    //     checkPermissionChildren(
    //       dataMenu[index].children,
    //       dataMenu[index].ID,
    //       permissions
    //     );
    //   }
    // }
    if (dataMenu[index].ID == ID) {
      console.log(dataMenu[index]);
    }

    if (dataMenu[index].children) {
      checkPermissionChildren(dataMenu[index].children, ID, permissions);
    }
  }
};
const brothers = (data, ID, permissions) => {
  for (let index = 0; index < data.length; index++) {
    if (data[index].Father == ID && data[index].permissions != permissions) {
      check_b.value = false;
    } else if (data[index].children) {
      brothers(data[index].children, ID, permissions);
    }
  }
};
const changeFather = (dataMenu, ID, originData, item) => {
  if (originData == null) {
    originData = dataMenu;
    brothers(dataMenu, item.Father, item.permissions);
  }

  for (let index = 0; index < dataMenu.length; index++) {
    if (dataMenu[index].ID == ID) {
      // console.log(dataMenu[index]);
      // console.log(dataMenu[index].Father);
      if (!check_b.value) {
        // dataMenu[index].permissions = item.permissions;
        dataMenu[index].permissions = "O";
      } else {
        dataMenu[index].permissions = item.permissions;
        brothers(dataMenu, dataMenu[index].Father, dataMenu[index].permissions);
      }
      changeFather(originData, dataMenu[index].Father, originData, item);
    } else if (dataMenu[index].children) {
      // console.log(ID);
      changeFather(dataMenu[index].children, ID, originData, item);
    }
  }
};

const changePermission = (item, dataMenu) => {
  if (item.children != null) {
    for (let index = 0; index < item.children.length; index++) {
      item.children[index].permissions = item.permissions;

      if (item.children[index].children) {
        changePermission(item.children[index], null);
      }
    }
  }
  if (dataMenu != null) {
    if (item.Father !== -1) {
      changeFather(dataMenu[0].children, item.Father, null, item);
      check_b.value = true;
      // checkPermissionChildren(dataMenu[0].children, item.Father, item.permissions);
    }
  }
};
</script>

<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <a v-if="(!root || item.children) && item.visible !== false">
      <strong @click="itemClick($event, item.ID, index)">
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.MnName }}</span>
        <i class="pi pi-fw pi-angle-down ml-3" v-if="item.children"></i>
      </strong>
      <select
        v-model="item.permissions"
        @change="changePermission(item, dataMenu)"
        style="margin-left: auto"
      >
        <option value="N">Không có quyền truy cập</option>
        <option value="F">Toàn quyền</option>
        <option value="R">Chỉ xem</option>
        <option value="O" class="hidden">Quyền truy cập khác</option>
      </select>
    </a>
    <Transition v-if="item.children && item.visible !== false" name="layout-submenu">
      <ul
        v-show="root ? true : isActiveMenu"
        class="layout-submenu"
        :ID="'menu-' + item.ID"
      >
        <list-menu
          v-for="(child, i) in item.children"
          :key="child"
          :index="i"
          :item="child"
          :parentItemKey="itemKey"
          :root="false"
          :dataMenu="dataMenu"
        ></list-menu>
      </ul>
    </Transition>
  </li>
</template>

<style lang="scss" scoped></style>
