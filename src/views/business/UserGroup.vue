<template>
  <!-- Header -->
  <div class="bg-surface-card">
    <div class="">
      <div class="flex align-items-center col-6">
        <h5 style="color: #0773bb" class="text-black m-2 p-2 mb-0 mt-0 font-semibold">
          {{ $t("user_group.header").toLocaleUpperCase() }}
        </h5>
      </div>
    </div>
  </div>
  <!-- Header -->
  <!-- Data -->
  <template v-if="true">
    <template v-if="true">
      <DataTable
        :value="userGroupData.data"
        :rows="PAGE_SIZE"
        tableStyle="min-width: 50rem"
        size="small"
        showGridlines
        :rowsPerPageOptions="[5, 10, 20]"
        lazy
        :totalRecords="userGroupData.TotalCount"
        :loading="loadUserGroupData"
        paginator
        @page="onPageChange($event)"
        :pt="{
          loadingOverlay: {
            style: 'background: none;',
          },
        }"
      >
      <template #empty>
              <div class="flex h-10rem justify-content-center align-items-center">
                Không có dữ liệu nào để hiển thị
              </div>
            </template>
        <template #loading>
          <Loading />
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="GroupName" :header="$t('user_group.group_name')"></Column>
        <Column
          field="UserQty"
          :header="$t('user_group.user_quantity')"
          style="text-align: center"
        ></Column>
        <Column field="GroupDesc" :header="$t('user_group.dsc')"></Column>
        <Column :header="$t('user_group.date')">
          <template #body="slotProps">
            {{ getDateTimeLabel(slotProps.data.CreateDate) }}
          </template>
        </Column>
        <Column field="IsActive" :header="$t('Status.Status')">
          <template #body="slotProps">
            {{ getStatusLabel(slotProps.data.IsActive) }}
          </template>
        </Column>
        <Column :header="$t('Action.act')">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              severity="p-button-rounded p-button-text"
              @click="openUpdateGroup(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="p-button-rounded p-button-text"
              @click="openConfirmDelete(slotProps.data)"
            />
          </template>
        </Column>
        <template #header>
          <div class="flex justify-between">
            <div class="p-input-button">
              <InputText
                v-model="searchKey"
                :placeholder="$t('InputText.Search')"
                @keydown.enter="onSearch"
              />
              <Button
                icon="pi pi-search"
                @click="onSearch"
              ></Button>
            </div>
            <div>
              <Button
                icon="pi pi-plus"
                @click="openDialogView"
                :label="$t('Button.AddNew')"
              ></Button>
            </div>
          </div>
        </template>
      </DataTable>
    </template>
    <template v-else>
      <div class="flex justify-center align-items-center p-error">
        <icon class="pi pi-times pr-5"></icon>Network Error
      </div>
    </template>
  </template>
  <template v-else>
    <div
      class="flex"
      style="justify-content: center; align-items: center; background-color: #dbe2e8"
    >
      <ProgressSpinner
        style="min-height: 50rem"
        fill="#dbe2e8"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
  </template>
  <!-- Data -->
  <!-- Toast and Dialog-->
  <Dialog
    v-model:visible="dialogView"
    modal
    :header="dialogMode.header"
    :style="{ width: '75rem' }"
    :hide="closeDialogView"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
    class="uppercase"
    maximizable
  >
    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        severity="secondary"
        @click="closeDialogView"
      />
      <Button
        :label="$t('Button.Save')"
        @click="submit"
        :loading="loadingButton"
        :disabled="loadGroup"
      />
    </template>
    <div class="grid m-0 mt-2">
      <div class="col-6 flex flex-column gap-2 border">
        <div class="flex flex-column gap-2">
          <label>{{ $t("user_group.group_name") }}<sup class="p-important">*</sup></label>
          <InputText
            :class="{ 'p-invalid': errorMessages.groupName }"
            v-model.trim="groupName"
            autofocus
          />
          <small v-if="errorMessages.groupName" class="p-error">{{
            errorMessages.groupName
          }}</small>
        </div>
        <div class="flex flex-column gap-2">
          <label>{{ $t("user_group.dsc") }}</label>
          <Textarea
            :class="{ 'p-invalid': errorMessages.groupDesc }"
            v-model.trim="groupDesc"
            variant="filled"
            rows="10"
            cols="30"
          />
          <small v-if="errorMessages.groupDesc" class="p-error">{{
            errorMessages.groupDesc
          }}</small>
        </div>
        <div class="grid pt-3">
          <div class="col-6">
            <div class="flex flex-column gap-2">
              <label>{{ $t("Status.Status") }}</label>
              <InputSwitch v-model="groupStatus" trueValue="A" falseValue="I" />
            </div>
          </div>
          <div class="col-6 flex" style="justify-content: end"></div>
        </div>
      </div>
      <div
        class="col-6 flex flex-column gap-2 pt-0"
        style="min-height: 363px; height: 390px"
      >
        <DataTable
          :value="usersInGroup"
          size="small"
          showGridlines
          scrollable
          scrollHeight="313px"
        >
          <template #header>
            <div class="flex" style="justify-content: space-between; align-items: center">
              <label>{{ $t("user_group.users") }}</label>
              <Button
                icon="pi pi-plus"
                :label="$t('user_group.add_user')"
                @click="openUserDialog"
              />
            </div>
          </template>
          <Column header="#" headerStyle="width:3rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column :header="$t('user_group.user')">
            <template #body="slotProps">
              <div v-if="slotProps.data" class="flex" style="align-items: center">
                <Avatar
                  :label="
                    slotProps.data.UserName
                      ? slotProps.data.UserName[0].toLocaleUpperCase()
                      : '#'
                  "
                  class="mr-2"
                  shape="circle"
                />
                <span
                  >{{ slotProps.data.UserCode ? slotProps.data.UserCode : "null" }} -
                  {{ slotProps.data.UserName ? slotProps.data.UserName : "null" }}</span
                >
              </div>
            </template>
          </Column>
          <Column headerStyle="width:3rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-times"
                text
                @click="removeUser(slotProps.data)"
              ></Button>
            </template>
          </Column>
          <template #footer>
            <template v-if="usersInGroup">
              <div>{{ $t("user_group.user_quantity") }} : {{ usersInGroup.length }}</div>
            </template>
            <template v-else> {{ $t("user_group.user_quantity") }} : 0 </template>
          </template>
        </DataTable>
      </div>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="dialogUser"
    modal
    :header="$t('user_group.title_add_user')"
    :style="{ width: '30rem' }"
    class="uppercase"
  >
    <div class="">
      <template v-if="!loadUserData">
        <template v-if="!errorUserData">
          <InputText class="w-full mt-1"></InputText>
          <ul class="user-list">
            <li
              class="user"
              v-for="user in usersData.data"
              @click="appendUser(user)"
              :key="user"
            >
              <Avatar
                :label="user.UserCode[0].toLocaleUpperCase()"
                class="mr-2"
                shape="circle"
              />
              {{ user.UserCode ? user.UserCode : "null" }} -
              {{ user.UserName ? user.UserName : "null" }}
            </li>
          </ul>
        </template>
        <template v-else> Error network </template>
      </template>
      <template v-else>
        <div
          class="flex"
          style="justify-content: center; align-items: center; background-color: #dbe2e8"
        >
          <ProgressSpinner
            style="min-height: 25rem"
            fill="#dbe2e8"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner"
          />
        </div>
      </template>
    </div>
    <template #footer>
      <Button :label="$t('Button.Done')" @click="closeUserDialog" />
    </template>
  </Dialog>
  <Dialog
    v-model:visible="confirmDelete"
    modal
    :header="$t('user_group.del_title')"
    :style="{ width: '30rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    maximizable
    class="uppercase"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>{{ deleteDetail }}</span>
    </div>
    <template #footer>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        @click="confirmDelete = false"
        severity="secondary"
      />
      <Button
        :loading="loadingButton"
        label="Xoá"
        icon="pi pi-check "
        @click="deleteGroup"
        autofocus
      />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
</template>

<script setup>
// ------------------ Packages -------------------
import { ref, onMounted, reactive } from "vue";
import API from "../../apis/api";
import i18n from "../../locale/i18n";
import { useToast } from "primevue/usetoast";
import { StatusCode } from "../../service/StatusCode";
// ------------------ Data -----------------------
const userGroupData = ref([]);
const usersData = ref([]);
// ------------------ Models ---------------------
const groupId = ref(null);
const groupName = ref(null);
const groupDesc = ref(null);
const groupStatus = ref("A");
const usersInGroup = ref([]);

const errorMessages = reactive({
  groupName: null,
  groupDesc: null,
});
// ------------------ Variables ------------------
const curentPage = ref(0);
const userUpdateList = ref([]);

const dataGroupsDelete = ref(null);
const loadingButton = ref(false);
const loadUserGroupData = ref(true);
const errorUserGroupData = ref(true);
const loadUserData = ref(true);
const loadGroup = ref(false);
const errorGroup = ref(true);
const errorUserData = ref(true);

const toast = useToast();
const dialogView = ref(false);
const dialogUser = ref(false);
const PAGE_SIZE = ref(10);

const confirmDelete = ref(false);
const deleteDetail = ref(null);
const searchKey = ref(null);
const dialogMode = reactive({
  mode: "",
  header: "",
  primaryButton: "",
  secondaryButton: "",
});
const isValidate = ref(false);
// ------------------ Methods --------------------
const submit = () => {
  checkValidateUserGroup();
  switch (dialogMode.mode) {
    case "A":
      if (isValidate.value) addGroup();
      break;
    case "U":
      if (isValidate.value) updateGroup("Updated");
      break;
    default:
      break;
  }
};

const updateGroup = () => {
  loadingButton.value = true;
  console.log(userUpdateList.value);
  const dataBody = {
    ID: groupId.value,
    GroupName: groupName.value,
    GroupDesc: groupDesc.value,
    IsActive: groupStatus.value,
    data: userUpdateList.value,
  };
  API.update_v2(dataBody, "ougr/update")
    .then((res) => {
      loadingButton.value = false;
      console.log(res.status, res.data);
      switch (res.data.CodeErr) {
        case StatusCode.success:
          showToast(
            "success",
            i18n.global.t("severity.success"),
            i18n.global.t("toast_message.success", [
              i18n.global.t("user_group.object_name").toLocaleLowerCase(),
            ])
          );
          closeDialogView();
          fetchUserGroupData(curentPage.value, PAGE_SIZE.value.value);
          break;
        case StatusCode.duplicate_key:
          errorMessages.groupName = i18n.global.t("toast_message.duplicate_name", [
            res.data.GroupName,
          ]);
          break;
        default:
          showToast("error", i18n.global.t("severity.error"), res.data.Errors);
          break;
      }
    })
    .catch((error) => {
      loadingButton.value = false;
      const summary = i18n.global.t("severity.error");
      showToast("error", summary, error.message);
    });
};

const checkValidateUserGroup = () => {
  isValidate.value = true;
  resetErrorMessage();
  if (!groupName.value || !groupName.value.trim()) {
    errorMessages.groupName = i18n.global.t("valid_msg.null", [
      i18n.global.t("user_group.group_name"),
    ]);
    isValidate.value = false;
  }
  if (groupName.value && groupName.value.trim() && groupName.value.length > 50) {
    errorMessages.groupName = i18n.global.t("valid_msg.leng", [
      i18n.global.t("user_group.group_name"),
      50,
    ]);
    isValidate.value = false;
  }
  if (groupDesc.value && groupDesc.value.trim() && groupDesc.value.length > 150) {
    errorMessages.groupDesc = i18n.global.t("valid_msg.leng", [
      i18n.global.t("user_group.dsc"),
      150,
    ]);
    isValidate.value = false;
  }
};

const resetErrorMessage = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
};

const addGroup = () => {
  loadingButton.value = true;
  const dataBody = {
    GroupName: groupName.value,
    GroupDesc: groupDesc.value,
    IsActive: groupStatus.value,
    data: usersInGroup.value.map((user) => ({ UserID: user.ID, Type: dialogMode.mode })),
  };
  console.log(dataBody);
  API.add_new_v2(dataBody, "ougr/create")
    .then((res) => {
      loadingButton.value = false;
      console.log(res.status, res.data);
      switch (res.data.CodeErr) {
        case StatusCode.success:
          showToast(
            "success",
            i18n.global.t("severity.success"),
            i18n.global.t("toast_message.success", [
              i18n.global.t("user_group.object_name").toLocaleLowerCase(),
            ])
          );
          userGroupData.value.data.push(res.data);
          closeDialogView();
          break;
        case StatusCode.duplicate_key:
          errorMessages.groupName = i18n.global.t("toast_message.duplicate_name", [
            res.data.GroupName,
          ]);
          break;
        default:
          showToast("error", i18n.global.t("severity.error"), res.data.Errors);
          break;
      }
    })
    .catch((error) => {
      loadingButton.value = false;
      const summary = i18n.global.t("severity.error");
      showToast("error", summary, error.message);
    });
};

const appendUser = (user) => {
  const u2a = {
    UserID: user.ID,
    ...user,
  };
  usersInGroup.value.push(u2a);
  usersData.value.data = usersData.value.data.filter((item) => item.ID !== user.ID);
  userUpdateList.value = userUpdateList.value.filter((u) => u.UserID !== u2a.UserID);
  userUpdateList.value.push({ UserID: u2a.UserID, Type: "A" });
};
const removeUser = (user) => {
  if (dialogMode.mode === "U") {
    console.log(user);
    // usersInGroup.value = usersInGroup.value.filter(u => u.UserID !== user.UserID);
    // if(userUpdateList.value.find(u => (u.UserID === user.UserID && u.Type === 'A')))
    // {
    //     userUpdateList.value =  userUpdateList.value.filter(u => (u.UserID !== user.UserID ));
    // }
    // else{
    //     userUpdateList.value =  userUpdateList.value.filter(u => (u.UserID !== user.UserID ));
    //     userUpdateList.value.push({UserID: user.UserID, Type: 'D'});
    // }
    usersInGroup.value = usersInGroup.value.filter((u) => u.UserID !== user.UserID);
    userUpdateList.value = userUpdateList.value.filter(
      (u) => u.Type === "D" && u.ID !== user.UserID
    );
    userUpdateList.value.push({ ID: user.ID, Type: "D" });
  } else if (dialogMode.mode === "A") {
    usersInGroup.value = usersInGroup.value.filter((u) => u.UserID !== user.UserID);
  }
};

const deleteGroup = () => {
  loadingButton.value = true;
  API.delete_v2(dataGroupsDelete.value, "ougr/delete")
    .then((res) => {
      loadingButton.value = false;
      confirmDelete.value = false;
      showToast(
        "success",
        i18n.global.t("severity.success"),
        i18n.global.t("toast_message.delete_success")
      );
      if (userGroupData.HasMore) fetchUserGroupData(curentPage.value, PAGE_SIZE.value);
      else {
        curentPage.value -= 1;
        fetchUserGroupData(curentPage.value, PAGE_SIZE.value);
      }
    })
    .catch((error) => {
      showToast("error", i18n.global.t("severity.error"), error.message);
    });
};

const openConfirmDelete = (group) => {
  deleteDetail.value = i18n.global.t("user_group.del_detail", [group.GroupName]);
  confirmDelete.value = true;
  dataGroupsDelete.value = {
    data: [{ ID: group.ID }],
  };
};

const openUpdateGroup = (userData) => {
  loadGroup.value = true;
  formatFields();
  resetErrorMessage();
  userUpdateList.value = [];
  dialogMode.header = i18n.global.t("user_group.title_update");
  dialogMode.mode = "U";
  dialogView.value = true;
  const param = {
    data: {
      id: userData.ID,
    },
  };
  API.get_all_v2("ougr/getbyid", param)
    .then((res) => {
      loadGroup.value = false;
      errorGroup.value = false;
      groupId.value = res.data.ID;
      groupName.value = res.data.GroupName;
      groupDesc.value = res.data.GroupDesc;
      groupStatus.value = res.data.IsActive;
      usersInGroup.value = res.data.data ? res.data.data : [];
    })
    .catch((error) => {
      const summary = i18n.global.t("severity.error");
      loadGroup.value = false;
      errorGroup.value = true;
      if (error.response) {
        // Request đã được tạo ra và server đã hồi đáp với một mã trạng thái
        // nằm ra ngoài tầm 2xx
        showToast("error", summary, error.response.status);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // Request đã được tạo ra nhưng không nhận được hồi đáp nào
        // Trong trình duyệt, `error.request` là instance của XMLHttpRequest
        // còn trong node.js thì nó là instance của http.ClientRequest
        // console.log(error.request);
        showToast("error", summary, error.request);
      } else {
        // Điều gì đó đã xảy ra trong bước thiết lập request rồi gây nên lỗi
        // console.log('Lỗi', error.message);
        showToast("error", summary, error.message);
      }
    });
};

const openUserDialog = () => {
  dialogUser.value = true;
  fetchUserData(0, 0, usersInGroup.value);
};

const closeUserDialog = () => {
  dialogUser.value = false;
};

const onSearch = () => {
  
  fetchUserGroupData(1,10);
};

const openDialogView = () => {
  formatFields();
  resetErrorMessage();
  loadGroup.value = false;
  dialogView.value = true;
  dialogMode.header = i18n.global.t("user_group.title_add");
  dialogMode.mode = "A";
};

const closeDialogView = () => {
  dialogView.value = false;
};

const formatFields = () => {
  groupId.value = null;
  groupName.value = null;
  groupDesc.value = null;
  usersInGroup.value = [];
  groupStatus.value = "A";
};

const getDateTimeLabel = (dateString) => {
  const trimmedDateString = dateString.substring(0, 23) + dateString.substring(26);
  const dateObject = new Date(trimmedDateString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
};

const getStatusLabel = (key) => {
  switch (key) {
    case "I":
      return i18n.global.t("Status.InActive");
    case "A":
      return i18n.global.t("Status.Active");
    default:
      return key;
  }
};

const onPageChange = (event) => {
  curentPage.value = event.originalEvent.page + 1;
  // console.log(event.originalEvent);
  PAGE_SIZE.value = event.originalEvent.rows;
  fetchUserGroupData(curentPage.value, PAGE_SIZE.value);
};
const fetchUserGroupData = (page, size) => {
  const param = {
    data: {
      size: size,
      page: page,
      q: searchKey.value
    },
  };
  API.get_all_v2("ougr/getall", param)
    .then((res) => {
      // console.log(res.data);
      loadUserGroupData.value = false;
      errorUserGroupData.value = false;
      userGroupData.value = res.data;
      // showToast('success','hihi','haha')
    })
    .catch((error) => {
      const summary = i18n.global.t("severity.error");
      loadUserGroupData.value = false;
      errorUserGroupData.value = true;
      if (error.response) {
        // Request đã được tạo ra và server đã hồi đáp với một mã trạng thái
        // nằm ra ngoài tầm 2xx
        showToast("success", summary, error.response.status);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // Request đã được tạo ra nhưng không nhận được hồi đáp nào
        // Trong trình duyệt, `error.request` là instance của XMLHttpRequest
        // còn trong node.js thì nó là instance của http.ClientRequest
        // console.log(error.request);
        showToast("success", summary, error.request);
      } else {
        // Điều gì đó đã xảy ra trong bước thiết lập request rồi gây nên lỗi
        // console.log('Lỗi', error.message);
        showToast("success", summary, error.message);
      }
    });
};

const fetchUserData = (page, size, dataFilter) => {
  const param = {
    data: {
      size: size,
      page: page
    },
  };
  API.get_all_v2("user/getall", param)
    .then((res) => {
      // console.log(res.data);
      loadUserData.value = false;
      errorUserData.value = false;
      usersData.value = res.data;
      if (dataFilter && dataFilter.length > 0)
        usersData.value.data = usersData.value.data.filter(
          (item) => !dataFilter.some((removeItem) => removeItem.UserID === item.ID)
        );
      // showToast('success','hihi','haha')
    })
    .catch((error) => {
      const summary = i18n.global.t("severity.error");
      loadUserData.value = false;
      errorUserData.value = true;
      if (error.response) {
        // Request đã được tạo ra và server đã hồi đáp với một mã trạng thái
        // nằm ra ngoài tầm 2xx
        showToast("error", summary, error.response.status);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // Request đã được tạo ra nhưng không nhận được hồi đáp nào
        // Trong trình duyệt, `error.request` là instance của XMLHttpRequest
        // còn trong node.js thì nó là instance của http.ClientRequest
        // console.log(error.request);
        showToast("error", summary, error.request);
      } else {
        // Điều gì đó đã xảy ra trong bước thiết lập request rồi gây nên lỗi
        // console.log('Lỗi', error.message);
        showToast("error", summary, error.message);
      }
    });
};

const showToast = (severity, summary, detail) => {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: detail,
    life: 3000,
  });
};

onMounted(() => {
  fetchUserGroupData(1, PAGE_SIZE.value);
});
</script>

<style scoped>
textarea {
  min-width: 300px;
  max-width: 474px;
}
.border {
  padding: 1rem;
  border: 1px solid #e5e7eb;
}
.user:hover {
  color: #4b5563;
  background: var(--surface-hover);
  border-left: 2px solid var(--blue-300);
}
.user {
  cursor: pointer;
  padding: 10px 0px 10px 10px;
}
.user-list {
  margin-bottom: 0px;
  border-radius: 6px;
  padding: 0px 0px;
  overflow: auto;
  border: 1px solid #e5e7eb;
  max-height: 20rem;
  list-style-type: none;
}

.p-button.p-button-text {
  color: #374151;
}
</style>
