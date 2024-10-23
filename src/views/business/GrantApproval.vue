<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH SÁCH CẤP PHÊ DUYỆT</h5>
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
            <template #header>
              <div class="grid bg--surface-card">
                <div class="flex flex-column col-6">
                  <h5 class="m-0"></h5>
                  <span class="block p-input-button">
                    <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                    <Button @click="onSearch" icon="pi pi-search"/>
                  </span>
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
              field="WstName"
              header="Tên cấp phê duyệt"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">WstName</span>
                {{ slotProps.data.WstName }}
              </template>
            </Column>
            <Column
              field="WstDesc"
              header="Mô tả"
              :sortable="true"
              headerStyle="width:45%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">WstDesc</span>
                {{ slotProps.data.WstDesc }}
              </template>
            </Column>
            <Column
              field="MaxReqr"
              header="Số lượng phê duyệt"
              :sortable="true"
              headerStyle="width:15%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">MaxReqr</span>
                {{ slotProps.data.MaxReqr }}
              </template>
            </Column>
            <Column
              field="MaxRejReqr"
              header="Số lượng từ chối"
              :sortable="true"
              headerStyle="width:15%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">MaxRejReqr</span>
                {{ slotProps.data.MaxRejReqr }}
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
    :style="{ width: '850px' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <label>Tên cấp phê duyệt</label>
      <span
        style="
          color: #eb5757;
          font-size: 16px;
          font-family: Open Sans;
          font-weight: 400;
          word-wrap: break-word;
          margin-left: 3px;
        "
        >*</span
      >

      <InputText
        :required="true"
        autofocus
        aria-required="true"
        v-model="dataEdit.WstName"
        :class="{ 'p-invalid': submitted && !dataEdit.WstName }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.WstName"
        >Không được bỏ trống tên cấp phê duyệt.</small
      >
    </div>
    <div class="field">
      <label>Mô tả</label>
      <Textarea
        :required="true"
        autofocus
        aria-required="true"
        v-model="dataEdit.WstDesc"
        @keydown.enter="saveData()"
      />
    </div>
    <div class="grid">
      <div class="col-6">
        <div class="field">
          <label>Số lượng phê duyệt</label>
          <span
            style="
              color: #eb5757;
              font-size: 16px;
              font-family: Open Sans;
              font-weight: 400;
              word-wrap: break-word;
              margin-left: 3px;
            "
            >*</span
          >
          <InputNumber
            :required="true"
            autofocus
            aria-required="true"
            v-model="dataEdit.MaxReqr"
            :class="{ 'p-invalid': (submitted && !dataEdit.MaxReqr) || mess_01 }"
            @keydown.enter="saveData()"
          />
          <small class="p-invalid" v-if="submitted && !dataEdit.MaxReqr"
            >Không được bỏ trống số lượng phê duyệt.</small
          >
          <small class="p-invalid" v-if="mess_01">{{ mess_01 }}</small>
        </div>
      </div>
      <div class="col-6">
        <div class="field">
          <label>Số lượng từ chối</label>
          <span
            style="
              color: #eb5757;
              font-size: 16px;
              font-family: Open Sans;
              font-weight: 400;
              word-wrap: break-word;
              margin-left: 3px;
            "
            >*</span
          >
          <InputNumber
            :required="true"
            autofocus
            aria-required="true"
            v-model="dataEdit.MaxRejReqr"
            :class="{ 'p-invalid': (submitted && !dataEdit.MaxRejReqr) || mess_02 }"
            @keydown.enter="saveData()"
          />
          <small class="p-invalid" v-if="submitted && !dataEdit.MaxRejReqr"
            >Không được bỏ trống số lượng từ chối.</small
          >
          <small class="p-invalid" v-if="mess_02">{{ mess_02 }}</small>
        </div>
      </div>
    </div>

    <div class="field">
      <DataTable
        showGridlines
        :value="dataEdit.data.filter((val) => val.Type !== 'D')"
        responsiveLayout="scroll"
        dataKey="ID"
      >
        <Column
          field="UserName"
          header="Người phê duyệt"
          :sortable="true"
          headerStyle="width:50%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">UserName</span>
            {{ slotProps.data.UserName }}
          </template>
        </Column>
        <Column
          field="OrsName"
          header="Đơn vị trực thuộc"
          :sortable="true"
          headerStyle="width:50%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">OrsName</span>
            {{ slotProps.data.OrsName }}
          </template>
        </Column>
        <Column headerStyle="min-width:8rem;" header="Hành động" :sortable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="p-button-rounded p-button-text"
              @click="slotProps.data.Type = 'D'"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="p-title mt-5 mb-5" @click="dialogAddUser = true" style="cursor: pointer">
      <i class="pi pi-plus-circle"></i> Thêm người phê duyệt
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
      <span v-if="dataEdit.WstName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.WstName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.WstName"
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
  <!-- Dialog thêm người phê duyệt -->
  <Dialog
    v-model:visible="dialogAddUser"
    :style="{ width: '650px' }"
    header="DANH SÁCH NGƯỜI DÙNG"
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
        <Infinite
          ref="searchUser"
          @send-data-multi="ReceiveDataMultiUser"
          type="multi"
          :url="url_get_user"
          :dataHeader="[
            {
              title: 'Tên người dùng:',
              key: 'UserName',
              type: 'String',
            },
            {
              title: 'Mã người dùng:',
              key: 'UserCode',
              type: 'String',
            },
            {
              title: 'Email:',
              key: 'Email',
              type: 'String',
            },
          ]"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Chọn" icon="pi pi-check" @click="callFunChilldren()" />
      <Button label="Đóng" icon="pi pi-times" outlined @click="dialogAddUser = false" />
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
import Infinite from "./components/Infinite.vue";

const api_add = "owst/create";
const api_update = "owst/update";
const api_get = "owst/getall";
const api_delete = "owst/delete";
// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const dataTable = ref({});
// -----------------------------End phân trang--------------------------------

const searchKey = ref('');
const onSearch = () => {
  params.value = {
    size: 10,
    page: 1,
    q: searchKey.value
  }
  getData();
}

//-------------------- Start CRUD ------------------
const header_update = ref("SỬA CẤP PHÊ DUYỆT");
const header_new = ref("THÊM MỚI CẤP PHÊ DUYỆT");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
// Thêm nhóm người dùng
const dialogAddUser = ref(false);
const mess_01 = ref(null);
const mess_02 = ref(null);
const error = ref(null);
const url_get_user = "user/getall";
const searchUser = ref(null);

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
});
const getError = () => {
  mess_01.value = null;
  mess_02.value = null;
  if (!dataEdit.value.WstName || !dataEdit.value.MaxRejReqr || !dataEdit.value.MaxReqr) {
    return true;
  }

  if (dataEdit.value.MaxReqr > dataEdit.value.data.length) {
    mess_01.value =
      "Số lượng phê duyệt phải lớn hơn 0 và nhỏ hơn hoặc bằng số lượng người phê duyệt";

    return true;
  }
  if (dataEdit.value.MaxRejReqr > dataEdit.value.data.length) {
    mess_02.value =
      "Số lượng từ chối phải lớn hơn 0 và nhỏ hơn hoặc bằng số lượng người phê duyệt";

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
          query: {
            page: response.data.Page,
          },
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
  titleDialog.value = header_new.value;
  dialogCrud.value = true;
  dataEdit.value = {
    WstName: "",
    WstDesc: "",
    MaxReqr: 0,
    MaxRejReqr: 0,
    data: [],
  };
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
        const codeErr = response.data.data[0].CodeErr;
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
  dataEdit.value = {
    WstName: "",
    WstDesc: "",
    MaxReqr: 0,
    MaxRejReqr: 0,
    data: [],
  };
  dialogCrud.value = false;
  submitted.value = false;
  delete_dialog.value = false;
  mess_01.value = null;
  mess_02.value = null;
};

const editData = async (data) => {
  await getById(data.ID);

  titleDialog.value = header_update.value;
  //
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

const onchangeCTCC = (event) => {
  dataEdit.value.OrsID = event.value.ID;
};
const getById = async (id) => {
  await API.get_all("owst/getbyid?id=" + id).then((res) => {
    dataEdit.value = res.data;
    dialogCrud.value = true;
  });
};

const callFunChilldren = () => {
  searchUser.value.sendDataMulti();
};
const ReceiveDataMultiUser = (value) => {
  for (let index = 0; index < value.length; index++) {
    value[index].Type = "A";
    value[index].UserID = value[index].ID;
  }

  if (!dataEdit.value.data.length) dataEdit.value.data = value;
  else
    for (let index = 0; index < value.length; index++) {
      const t = dataEdit.value.data.filter((val) => {
        if (val.UserID) {
          return val.UserID == value[index].ID && val.Type != "D";
        } else {
          return val.ID == value[index].ID && val.Type != "D";
        }
      });
      if (t.length) {
        notification("error", "Đã tồn tại người dùng " + value[index].UserCode);
        continue;
      } else {
        console.log(value[index]);
        dataEdit.value.data.push(value[index]);
      }
    }
  dialogAddUser.value = false;
};
</script>
