<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH SÁCH NGƯỜI DÙNG</h5>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
  <!-- End Header -->
  <div class="grid">
    <div class="col-12">
      <div class="card p-0">
        <Toast />
        <div class="panel-content" style="position: relative">
          <Loading v-if="load_data" />
          <DataTable
            showGridlines
            lazy
            :totalRecords="dataTable.TotalCount"
            :paginator="true"
            :rows="params.size"
            :value="dataTable.data"
            :first="(dataTable.Page - 1) * dataTable.Size"
            :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            @page="onPageChange($event)"
            v-model:selection="selected_data"
            dataKey="ID"
          >
          <template #empty>
              <div class="flex h-10rem justify-content-center align-items-center">
                Không có dữ liệu nào để hiển thị
              </div>
            </template>
            <template #header>
              <div class="grid bg--surface-card">
                <div class="flex flex-column col-6">
                  <div class="block p-input-button">
                    <InputText
                      v-model="dataEdit.searchKey"
                      :placeholder="$t('InputText.Search')"
                      @keyup="ResetKey(dataEdit.searchKey)"
                      @keyup.enter="searchData(dataEdit.searchKey)"
                    />
                    <Button @click=searchData(dataEdit.searchKey) icon="pi pi-search"></Button>
                  </div>
                </div>
                <div class="col-6 flex fl-end">
                  <Button
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    class="text-end px-3 py-2 font-medium"
                    @click="openNew()"
                  />
                  <Button
                    label="Xóa"
                    icon="pi pi-trash"
                    class="p-button-danger mx-3 text-end px-3 py-2 font-medium"
                    @click="confirmDelete(null)"
                    :disabled="!selected_data || !selected_data.length"
                  />
                </div>
              </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              field="UserName"
              header="Tên người dùng"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">UserName</span>
                {{ slotProps.data.UserName }}
              </template>
            </Column>
            <Column
              field="Email"
              header="Email"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Email</span>
                {{ slotProps.data.Email }}
              </template>
            </Column>
            <Column
              field="OrsName"
              header="Đơn vị trực thuộc"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">OrsName</span>
                {{ slotProps.data.OrsName }}
              </template>
            </Column>
            <Column
              field="IsActive"
              header="Trạng thái"
              :sortable="true"
              headerStyle="width:25%; min-width:8rem;text-al"
            >
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt Động" : "Không Hoạt Động" }}
              </template>
            </Column>
            <Column headerStyle="min-width:10rem;" header="Hành động" :sortable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="editData(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="p-button-rounded p-button-text"
                  @click="confirmDelete(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
        <Toast position="bottom-right" group="br" />
      </div>
    </div>
  </div>
  <!-- Taọ hoppj thoại CRUD-->
  <Dialog
    v-model:visible="dialogCrud"
    :style="{ width: '650px' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="grid">
      <div class="field col-6">
        <label for="">Mã người dùng</label>
        <InputText
          :required="true"
          autofocus
          aria-required="true"
          v-model="dataEdit.UserCode"
          :disabled="dataEdit.ID"
          :class="{ 'p-invalid': submitted && !dataEdit.UserCode }"
        />
        <span v-show="submitted && !dataEdit.UserCode">
          Vui lòng nhập mã người dùng
        </span>
      </div>
      <div class="field col-6">
        <label for="">Tên người dùng</label>
        <InputText
          :required="true"
          autofocus
          aria-required="true"
          v-model="dataEdit.UserName"
          :class="{ 'p-invalid': submitted && !dataEdit.UserName }"
        />
        <span v-show="submitted && !dataEdit.UserName">
          Vui lòng nhập tên người dùng
        </span>
      </div>

      <div class="field col-6">
        <label for="">Email</label>
        <InputText
          :required="true"
          autofocus
          aria-required="true"
          v-model="dataEdit.Email"
          :disabled="dataEdit.ID"
          :class="{ 'p-invalid': submitted && !dataEdit.Email }"
        />
        <span v-show="submitted && !dataEdit.UserName">
          Vui lòng nhập email người dùng
        </span>
      </div>
      <div class="field col-6">
        <label for="">Thuộc đơn vị</label>
        <TreeArraySelect
          :config="{
            field: {
              id: 'ID',
              code: 'OrsCode',
              label: 'OrsName',
              children: 'children',
            },
            ES_Root: false,
          }"
          :class="{ 'p-invalid': submitted && !dataEdit.OrsID }"
          :selectedId="dataEdit.OrsID"
          :data="dataCCTC"
          @onChange="onchangeCTCC"
        />
        <span v-show="submitted && !dataEdit.UserName"> Vui lòng chọn đơn vị </span>
      </div>
      <div class="field col-12">
        <div class="field">
          <DataTable
            showGridlines
            :value="
              dataEdit.USR7
                ? dataEdit.USR7.filter((val) => {
                    return val.Type !== 'D';
                  })
                : dataEdit.USR7
            "
            responsiveLayout="scroll"
            dataKey="ID"
          >
            <Column
              field="GroupName"
              header="Tên nhóm người dùng"
              :sortable="true"
              headerStyle="width:100%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">GroupName</span>
                {{ slotProps.data.GroupName }}
              </template>
            </Column>
            <Column headerStyle="min-width:8rem;" header="Hành động" :sortable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  severity="p-button-rounded p-button-text"
                  @click="DeleteUser(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="p-title mt-5 mb-5" @click="getAllGroupUser()" style="cursor: pointer">
          <i class="pi pi-plus-circle"></i> Thêm nhóm người dùng
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="field col-6">
        <div class="field-checkbox mb-0">
          <label class="mr-3"> Trạng thái</label>
          <InputSwitch v-model="dataEdit.IsActive" trueValue="A" falseValue="I" />
        </div>
      </div>
      <div class="field col-6">
        <div class="field-checkbox mb-0">
          <Checkbox
            v-model="dataEdit.Role"
            :binary="true"
            trueValue="admin"
            falseValue=""
          />
          <label>Admin</label>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
      <Button label="Lưu" icon="pi pi-check" :loading="loadAction" @click="saveData()" />
    </template>
  </Dialog>
  <!-- End hôp thoại CRUD -->
  <!-- Start dialog xoa -->
  <Dialog
    v-model:visible="delete_dialog"
    :style="{ width: '450px' }"
    header="Xác Nhận"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="dataEdit.UserName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.UserName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.UserName"
        >Bạn chắc chắn muốn xóa <b>{{ selected_data.length }}</b> bản ghi này không
        ?</span
      >
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" outlined @click="hideDelete()" />
      <Button
        label="Xóa"
        icon="pi pi-check"
        :loading="loadAction"
        @click="deleteData()"
      />
    </template>
  </Dialog>
  <!-- End xoa -->
  <!-- Dialog thêm nhóm người dùng -->
  <Dialog
    v-model:visible="dialogAddGroupUser"
    :style="{ width: '650px' }"
    header="DANH SÁCH NHÓM NGƯỜI DÙNG"
    :modal="true"
    class="p-fluid"
  >
    <div class="grid">
      <div class="col-12">
        <div class="field">
          <span class="block mt-2 md:mt-0 p-input-icon-right">
            <InputText
              placeholder="Tìm Kiếm..."
              v-model="key_search_g_user"
              @keyup="SearchGroupUser($event)"
            />
            <i class="pi pi-search" style="cursor: pointer" />
          </span>
        </div>
      </div>
      <div class="col-12">
        <small class="mb-3" v-if="dataSearchGroupUser"
          >Đã có {{ dataSearchGroupUser.length }} kết quả tìm kiếm cho từ khoá "{{
            key_search_g_user
          }}"</small
        >
        <div class="card verflow-hidden md:overflow-auto" style="max-height: 300px">
          <div
            class="border-round p-2 surface-200 mb-3 cursor-pointer hover:surface-300"
            v-for="group in dataSearchGroupUser ? dataSearchGroupUser : GroupUsers"
            :key="group.ID"
            @click="AddGUser(group)"
          >
            {{ group.GroupName ? group.GroupName : "null" }} -
            {{ group.GroupDesc ? group.GroupDesc : "null" }}
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Đóng"
        icon="pi pi-times"
        class="p-button-text"
        @click="dialogAddGroupUser = false"
      />
    </template>
  </Dialog>
  <!-- End -->
</template>
<style scoped>
:root {
  --surface-hover: #f6f9fc;
  --boder-color: #d1d4db;
}

.card-header h5,
h4,
h3,
h2,
h1 {
  margin: 0px;
}

.card-header {
  border-bottom: 1px solid #d1d4db;
}

.bg-surface {
  background-color: var(--surface-hover);
}

.container {
  align-dataedits: center;
  /* padding: 5px; */
}

#main-panel {
  height: 40rem;
}

/* ---------------------- */
.p-dialog-content {
  background: #ffffff;
  color: #4b5563;
  padding: none !important;
}

.rounded {
  border-radius: 12px;
}

.bg-current {
  background-color: rgb(225, 232, 240);
}

.border-b-1 {
  border-bottom: 1px solid;
}

.fl-end {
  justify-content: flex-end;
}

.border-inherit {
  border-color: rgb(187, 199, 216) !important;
}

.center {
  margin: auto;
  width: 50%;
}

.input-header {
  display: flex;
}

.bg-current {
  background-color: #ffffff;
}

.card {
  border-radius: unset;
}
.p-button.p-button-text {
  color: #374151;
}
.p-datatable .p-datatable-tbody > tr > td {
  padding: 0.5rem 0.5rem !important;
}
</style>
<script setup>
import { onBeforeMount, ref } from "vue";
import API from "../../apis/api";
import i18n from "../../locale/i18n";
import ERROR from "../../services/StatusCode.json";
import TreeArraySelect from "./components/TreeArraySelect.vue";
// import socket from "../../services/socket";

const api_add = "user/create";
const api_update = "user/update";
const api_get = "user/getall";
const api_delete = "user/delete";

// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const dataTable = ref({});
// -----------------------------End phân trang--------------------------------

//-------------------- Start CRUD ------------------
const header_update = ref("SỬA NGƯỜI DÙNG");
const header_new = ref("THÊM MỚI NGƯỜI DÙNG");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
// Đơn vị trực thuộc
const dataCCTC = ref(null);
// Thêm nhóm người dùng
const dialogAddGroupUser = ref(false);
const GroupUsers = ref(null);
const dataSearchGroupUser = ref(null);
const key_search_g_user = ref(null);

const getCCTC = () => {
  API.get_all("oors/getall?page=0&size=0").then(
    (response) => {
      if (response.data) {
        dataCCTC.value = response.data.data;
      }
    },
    (error) => {}
  );
};

onBeforeMount(() => {
  // socket.created();
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  if (route.query.q) params.value.q = route.query.q;
  getData();
  getCCTC();
});
const getError = () => {
  if (
    !dataEdit.value.UserName.trim() ||
    !dataEdit.value.UserCode.trim() ||
    !dataEdit.value.Email.trim()
  ) {
    return true;
  }
  return false;
};

// Lấy danh sách ----------------------------------------------------
const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  setTimeout(() => {
    API.get_all_v2(api_get, {
      data: params.value,
    })
      .then((response) => {
        dataTable.value = response.data;
        load_data.value = false;
        router.push({
          name: route.name,
          query: params.value,
        });
      })
      .catch((error) => {
        load_data.value = false;
        notification("error", error);
      });
  }, 50);
};

const getDataWhenAction = (t) => {
  params.value = {
    page: t ? t : parseInt(route.query.page) || 1,
    size: dataTable.value.Size,
  };
  resetData();
  getData();
};

// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};
// Lấy danh sách ----------------------------------------------------

const openNew = () => {
  resetData();
  titleDialog.value = header_new.value;
  dataEdit.value.IsActive = "A";
  dialogCrud.value = true;
};

const hideDialog = () => {
  dialogCrud.value = false;
  dataEdit.value = {};
};

const saveData = () => {
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    const apiEndpoint = dataEdit.value.ID ? api_update : api_add;
    const apiFunction = dataEdit.value.ID ? API.update_v2 : API.add_new_v2;

    apiFunction(convertData(), apiEndpoint)
      .then((response) => {
        const codeErr = response.data.CodeErr;
        if (codeErr) {
          notification("error", ERROR.find((val) => val.code === codeErr)?.mes);
          loadAction.value = false;
        } else {
          notification(
            "success",
            dataEdit.value.ID ? "Cập nhật thành công" : "Thêm mới thành công"
          );
          getDataWhenAction();
        }
      })
      .catch((error) => {
        notification("error", error);
        resetData();
      });
  }
};

const resetData = () => {
  loadAction.value = false;
  dataEdit.value = {};
  dialogCrud.value = false;
  submitted.value = false;
  delete_dialog.value = false;
};

const editData = (data) => {
  dialogCrud.value = true;
  titleDialog.value = header_update.value;
  dataEdit.value.OrsID = data.OrsID;
  getById(data.ID);
};

const deleteData = () => {
  loadAction.value = true;
  const arr_delete = selected_data.value
    ? selected_data.value.map((item) => ({ ID: item.ID }))
    : [{ ID: dataEdit.value.ID }];

  const data_send = { data: arr_delete };

  API.delete_v2(data_send, api_delete)
    .then((response) => {
      for (let index = 0; index < response.data.data.length; index++) {
        if (response.data.data[0].CodeErr) {
          notification("error", response.data.data[0].Errors);
        } else {
          notification("success", "Đã xoá thành công");
          if (
            dataTable.value.data.length - 1 == 0 ||
            arr_delete.length == dataTable.value.data.length
          )
            params.value.page = parseInt(route.query.page) - 1;
          getDataWhenAction(params.value.page);
          loadAction.value = false;
        }
      }
    })
    .catch((error) => {
      notification("error", error);
    })
    .finally(() => {
      loadAction.value = false;
    });
};

const convertData = () => {
  dataEdit.value.UserType = "Buying";
  return dataEdit.value;
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
const confirmDelete = (data) => {
  dataEdit.value = { ...data };
  delete_dialog.value = true;
};
const hideDelete = () => {
  delete_dialog.value = false;
  dataEdit.value = {};
};
const getAllGroupUser = () => {
  dialogAddGroupUser.value = true;
  API.get_all("ougr/getall?size=0&page=0").then((response) => {
    if (!dataEdit.value.USR7) {
      GroupUsers.value = response.data.data;
    } else {
      const datacheck = dataEdit.value.USR7.filter((val) => {
        return val.Type !== "D";
      });

      for (let index = 0; index < datacheck.length; index++) {
        response.data.data = response.data.data.filter((val) => {
          return val.ID !== datacheck[index].GroupId;
        });
      }
      GroupUsers.value = response.data.data;
    }
  });
};

const SearchGroupUser = (key) => {
  if (key_search_g_user.value == null || key_search_g_user.value == "") {
    dataSearchGroupUser.value = null;
  } else {
    dataSearchGroupUser.value = GroupUsers.value.filter((q) => {
      if (q.GroupName != undefined) {
        return (
          q.GroupName.toUpperCase().startsWith(key_search_g_user.value.toUpperCase()) ||
          q.GroupName.toUpperCase().includes(key_search_g_user.value.toUpperCase())
        );
      }
    });
  }
};
const AddGUser = (group) => {
  group.Type = "A";
  group.GroupId = group.ID;
  GroupUsers.value = GroupUsers.value.filter((groups) => {
    return groups.ID != group.ID;
  });
  if (dataSearchGroupUser.value) {
    dataSearchGroupUser.value = dataSearchGroupUser.value.filter((groups) => {
      return groups.ID != group.ID;
    });
  }

  if (dataEdit.value.USR7) {
    dataEdit.value.USR7.push(group);
  } else {
    dataEdit.value.USR7 = [group];
  }
};

const DeleteUser = (data) => {
  data.Type = "D";
};
const onchangeCTCC = (event) => {
  dataEdit.value.OrsID = event.value.ID;
};
const getById = (id) => {
  API.get_all("user/getbyid?id=" + id).then((res) => {
    dataEdit.value = res.data;
  });

};

const searchData = (q) => {
  if (q) {
    params.value.q = q;
    params.value.page = 1;

    getData();
  }
};
const ResetKey = (q) => {
  if (!q) {
    delete params.value.q;
    getData();
  }
};
</script>
