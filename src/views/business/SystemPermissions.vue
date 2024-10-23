<template>
  <!-- Header content -->
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold uppercase">
          {{ $t("system_permision.header") }}
        </h5>
      </div>
    </div>
  </div>
  <!-- Header content -->
  <div class="container p-5">
    <div class="grid">
      <div class="col-4">
        <div class="card">
          <TabView v-model:activeIndex="tabIndex">
            <TabPanel :header="$t('system_permision.user')">
              <div class="flex overflow-y-scroll card">
                <ul class="layout-menu mt-0 w-full" ref="listEl" style="height: 400px">
                  <li class="li-list" v-for="item in items" :key="item.ID">
                    <div
                      class="label border-round p-2 mr-3 surface-200 mb-3 cursor-pointer hover:surface-300"
                      @click="getUserById(item.ID, item.UserName)"
                    >
                      <span>{{ item.UserCode }} -- {{ item.UserName }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </TabPanel>
            <TabPanel :header="$t('system_permision.user_group')">
              <div class="flex overflow-y-scroll card">
                <ul class="layout-menu mt-0 w-full" ref="listEl" style="height: 400px">
                  <li class="li-list" v-for="item in itemGs" :key="item.ID">
                    <div
                      class="label border-round p-2 mr-3 surface-200 mb-3 cursor-pointer hover:surface-300"
                      @click="getUserGroupById(item.ID, item.GroupName)"
                    >
                      <span>{{ item.GroupName ? item.GroupName : "null" }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </TabPanel>
          </TabView>
          <div>
            <Button
              icon="pi pi-copy"
              size="small"
              class="w-full"
              :label="$t('system_permision.copy_permission')"
            />
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="card">
          <TabView>
            <TabPanel :header="'Phân quyền ' + (NameUser ? NameUser : '')">
              <div class="flex overflow-y-scroll card">
                <ul
                  class="layout-menu mt-0 w-full"
                  v-if="permissions"
                  style="height: 400px"
                >
                  <template v-for="(item, i) in dataMenu" :key="item">
                    <list-menu
                      v-if="!item.separator"
                      :item="item"
                      :index="i"
                      :data="permissions"
                      :dataMenu="dataMenu"
                    ></list-menu>
                  </template>
                </ul>
              </div>
            </TabPanel>
          </TabView>
          <div>
            <Button
              icon="pi pi-copy"
              v-show="check_tt == 1 ? true : false"
              size="small"
              label="Cập nhật phân quyền người dùng"
              @click="UpdateMenu(dataMenu[0].children)"
              :disabled="check_data"
            />
            <Button
              icon="pi pi-copy"
              size="small"
              v-show="check_tt == 2 ? true : false"
              label="Cập nhật phân quyền nhóm người dùng"
              @click="UpdateMenuGroup(dataMenu[0].children)"
              :disabled="check_data"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import InfiniteScrollingList from "./components/InfiniteScrollingList.vue";
import API from "../../apis/api";
// import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ERROR from "../../services/StatusCode.json";
import API_USER from "../../apis/api.test";
import ListMenu from "../business/components/listMenu.vue";
const listEl = ref(null);
const items = ref(null);
const itemGs = ref(null);

const tabIndex = ref();
const dataMenu = ref(null);
const permissions = ref([]);
const check_data = ref(true);
const NameUser = ref(null);
const data = ref([]);
const IdUser = ref(null);
const IdGroupUser = ref(null);
const toast = useToast();

const check_tt = ref(1);

onBeforeMount(() => {
  getdata();
});
const getdata = () => {
  API.get_all("oomn/getall").then((response) => {
    dataMenu.value = [
      {
        children: response.data.data,
      },
    ];
    sort_arr(dataMenu.value);
  });

  API.get_all("user/getall?size=0&page=0").then((response) => {
    items.value = response.data.data;
  });
  API.get_all("ougr/getall?size=0&page=0").then((response) => {
    itemGs.value = response.data.data;
  });
};

const sort_arr = (data) => {
  for (let index = 0; index < data.length; index++) {
    if (data[index].children != null) {
      data[index].children.sort((a, b) => {
        if (a.ID > b.ID) return 1;
        else return -1;
      });
      sort_arr(data[index].children);
    }
  }
};
const getUserById = (id, name) => {
  check_tt.value = 1;
  API.get_all("oaut/getbyid?id=" + id).then((response) => {
    permissions.value = response.data.data;
    getNameUser(name);
    IdUser.value = id;
    changeMenu(dataMenu.value);
    check_data.value = false;
  });
};

const getUserGroupById = (id, name) => {
  check_tt.value = 2;
  API.get_all("oaug/getbyid?id=" + id).then((response) => {
    permissions.value = response.data.data;
    getNameUser(name);
    IdGroupUser.value = id;
    changeMenu(dataMenu.value);
    check_data.value = false;
  });
};

const getNameUser = (name) => {
  return (NameUser.value = name);
};

const changeMenu = (data) => {
  for (let index = 0; index < data.length; index++) {
    const check = permissions.value.filter((key) => {
      return key.MenuID == data[index].ID;
    });
    if (check.length) {
      data[index].permissions = check[0].Authorities;
      data[index].IdPermissions = check[0].ID;
    } else {
      data[index].permissions = "N";
      data[index].IdPermissions = 0;
    }

    // console.log(data[index]);

    if (data[index].children) {
      changeMenu(data[index].children);
    }
  }
};
const getDataFor = (t) => {
  for (let index = 0; index < t.length; index++) {
    data.value.push({
      MenuID: t[index].ID,
      UserID: IdUser.value,
      ID: t[index].IdPermissions,
      Authorities: t[index].permissions,
    });

    if (t[index].children) {
      getDataFor(t[index].children);
    }
  }
};
const getDataForGroup = (t) => {
  for (let index = 0; index < t.length; index++) {
    data.value.push({
      MenuID: t[index].ID,
      GroupID: IdGroupUser.value,
      ID: t[index].IdPermissions,
      Authorities: t[index].permissions,
    });

    if (t[index].children) {
      getDataForGroup(t[index].children);
    }
  }
};
const UpdateMenu = (t) => {
  data.value = [];
  for (let index = 0; index < t.length; index++) {
    data.value.push({
      MenuID: t[index].ID,
      UserID: IdUser.value,
      ID: t[index].IdPermissions,
      Authorities: t[index].permissions,
    });
    if (t[index].children) {
      getDataFor(t[index].children);
    }
  }
  API.update_v2({ data: data.value }, "oaut/update").then((response) => {
    const data = response.data.data;
    let mes = "";
    let check = "";
    for (let index = 0; index < data.length; index++) {
      if (data[index].Errors == "") {
        mes = "Cập nhật thành công";
        check = 1;
      } else {
        mes = data[index].Errors;
        check = 0;
      }
    }

    notification(check ? "success" : "error", mes);
  });
};

const UpdateMenuGroup = (t) => {
  data.value = [];
  for (let index = 0; index < t.length; index++) {
    data.value.push({
      MenuID: t[index].ID,
      GroupID: IdGroupUser.value,
      ID: t[index].IdPermissions,
      Authorities: t[index].permissions,
    });
    if (t[index].children) {
      getDataForGroup(t[index].children);
    }
  }
  API.update_v2({ data: data.value }, "oaug/update").then((response) => {
    const data = response.data.data;
    let mes = "";
    let check = "";
    for (let index = 0; index < data.length; index++) {
      if (data[index].Errors == "") {
        mes = "Cập nhật thành công";
        check = 1;
      } else {
        mes = data[index].Errors;
        check = 0;
      }
    }
    notification(check ? "success" : "error", mes);
  });
};

const notification = (status, mes) => {
  toast.add({
    severity: status,
    summary: "Thông báo",
    group: "br",
    detail: mes,
    life: 3000,
  });
};

const changer_tt = () => {
  alert(check_tt.value);
};
</script>

<style scoped>
.list {
  /* height: 42rem; */
}
.header {
  color: var(--primary-color);
}

.list-area {
  /* height: 100%; */
}
.avatar {
  /* padding-left: 10px; */
}
.ul-list {
  /* padding: 10px; */
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: auto;
  overflow-y: scroll;
}
.li-list:hover {
  background: var(--surface-hover);
  border-left: 2px solid var(--blue-300);
}
.li-list {
  cursor: pointer;
  /* padding: 5px 0 5px 0; */
  display: flex;
  width: 100%;
}
.label {
  /* padding-left: 10px; */
  margin: auto;
  width: 100%;
}

::-webkit-scrollbar {
  width: 7px;
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
