<template>
  <div class="">
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          TIÊU CHÍ ĐÁNH GIÁ CHẤM ĐIỂM
        </h5>
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
          <Loading v-if="loading" />
          <DataTable
            showGridlines
            lazy
            :totalRecords="TotalCount"
            :paginator="true"
            :rows="params.size"
            :value="dataTable"
            :first="rowFirst"
            :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            @page="onPageChange($event)"
            v-model:selection="selected_data"
            dataKey="ID"
          >
            <template #header>
              <!-- <div
                class="flex flex-column md:flex-row md:justify-content-between md:align-dataEdits-center"
              >
                <h5 class="m-0"></h5>
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText placeholder="Tìm Kiếm..." />
                </span>
              </div> -->

              <div class="grid bg--surface-card">
                <div class="flex flex-column col-6">
                  <h5 class="m-0"></h5>
                  <span class="block mt-2 md:mt-0 p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText placeholder="Tìm Kiếm..." />
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
              field="OecName"
              header="Tên phương pháp chấm điểm"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">OecName</span>
                {{ slotProps.data.OecName }}
              </template>
            </Column>
            <Column
              field="OecDesc"
              header="Mô tả"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">OecDesc</span>
                {{ slotProps.data.OecDesc }}
              </template>
            </Column>
            <Column
              field="is_active"
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
    <div class="field">
      <label>Tên tiêu chí</label>
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
        v-model="dataEdit.OecName"
        :class="{ 'p-invalid': submitted && !dataEdit.OecName }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.OecName"
        >Không được bỏ trống tên tiêu chí.</small
      >
    </div>
    <div class="field">
      <label>Mô tả</label>
      <Textarea
        :required="true"
        autofocus
        aria-required="true"
        v-model="dataEdit.OecDesc"
        @keydown.enter="saveData()"
      />
    </div>
    <div class="field mt-5">
      <div class="grid pr-0 justify-content-between surface-200 mb-3">
        <div class="col-8"><p>Tiêu chí</p></div>
        <div class="col-4 text-center">Chọn tỉ trọng (Tổng = 100)</div>
      </div>
      <div class="grid pr-0 justify-content-between mb-3 border-bottom-1">
        <div class="col-8">
          <div class="field-checkbox mb-0">
            <Checkbox v-model="checked" :binary="true" />
            <label> Giá dự thầu</label>
          </div>
        </div>
        <div class="col-4 text-center">
          <Dropdown></Dropdown>
        </div>
      </div>
      <div class="grid pr-0 justify-content-between mb-3 border-bottom-1">
        <div class="col-8">
          <div class="field-checkbox mb-0">
            <Checkbox v-model="checked" :binary="true" />
            <label> Tiến độ cung cấp hàng hoá</label>
          </div>
        </div>
        <div class="col-4 text-center">
          <Dropdown></Dropdown>
        </div>
      </div>
      <div class="grid pr-0 justify-content-between mb-3 border-bottom-1">
        <div class="col-8">
          <div class="field-checkbox mb-0">
            <Checkbox v-model="checked" :binary="true" />
            <label> Điểu khoản thanh toán</label>
          </div>
        </div>
        <div class="col-4 text-center">
          <Dropdown></Dropdown>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="field col-6 pr-0">
        <div class="input-header">
          <h6>Trạng Thái</h6>
        </div>
        <div class="formgrid">
          <div class="#">
            <InputSwitch v-model="Active" />
          </div>
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
      <span v-if="dataEdit.OecName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.OecName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.OecName"
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
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

// -----------------------------Start phân trang------------------------------
const params = ref({});
const route = useRoute();
const router = useRouter();
const dataTable = ref(null);
const TotalCount = ref(0);
const rowFirst = ref(0);
const loading = ref(false);
const dataHeader = ref({});
// -----------------------------End phân trang--------------------------------
//-------------------- Start CRUD ------------------
const dialogCrud = ref(false);
const loadAction = ref(false);
const Active = ref(true);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);
const error = ref(false);
const api_add = "ooec/create";
const api_update = "ooec/update";
const api_get = "ooec/getall";
const api_delete = "ooec/delete";
const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const arr_error = ref([
  {
    code: 2627,
    mes: "Mã đã tồn tại",
  },
  {
    code: 404,
    mes: "Không có bản ghi nào",
  },
  {
    code: 2628,
    mes: "Độ dài vượt quá tối đa cho phép",
  },
]);

onBeforeMount(() => {
  // Khởi tạo data mặc định
  params.value = {
    page: route.params.page != undefined ? route.params.page : 1,
    size: 5,
  };
  getData();
});

// Get data từ api
const getData = (event) => {
  loading.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;

  setTimeout(() => {
    API.get_all_v2(api_get, {
      data: params.value,
    })
      .then((response) => {
        dataTable.value = response.data.data;
        TotalCount.value = response.data.TotalCount;
        rowFirst.value = (response.data.Page - 1) * response.data.Size;
        loading.value = false;
        dataHeader.value = response.data;
        routerRedirect(response.data.Page);
      })
      .catch(function (error) {
        notification("error", error);
        loading.value = false;
      });
  }, 50);
};

const getDataWhenAction = () => {
  params.value = {
    page: route.params.page != undefined ? route.params.page : 1,
    size: dataHeader.value.Size,
  };
  getData();
};

// Chuyển hướng route
const routerRedirect = (event) => {
  router.push({ name: route.name, params: { page: event } });
};

// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};

const openNew = () => {
  dialogCrud.value = true;
  submitted.value = false;
  Active.value = true;
  dataEdit.value = {};
  titleDialog.value = "THÊM MỚI TIÊU CHÍ ĐÁNH GIÁ CHẤM ĐIỂM";
};

const hideDialog = () => {
  dialogCrud.value = false;
  dataEdit.value = {};
};

const saveData = () => {
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    if (dataEdit.value.ID) {
      API.update_v2(convertData(), api_update).then((response) => {
        if (response.data.data[0].CodeErr) {
          notification(
            "error",
            arr_error.value.filter((val) => {
              return val.code == response.data.data[0].CodeErr;
            })[0].mes
          );
        } else {
          dataTable.value[findIndexById(response.data.data[0].ID)] =
            response.data.data[0];
          notification("success", "Đã sửa thành công");
        }
        loadAction.value = false;
        dataEdit.value = {};
        dialogCrud.value = false;
      });
    } else {
      API.add_new_v2(convertData(), api_add).then((response) => {
        if (response.data.data[0].CodeErr) {
          notification(
            "error",
            arr_error.value.filter((val) => {
              return val.code == response.data.data[0].CodeErr;
            })[0].mes
          );
        } else {
          if (dataTable.value) {
            dataTable.value.push(response.data.data[0]);
          } else {
            dataTable.value = response.data.data[0];
          }
          notification("success", "Đã thêm thành công");
        }
        // reset data
        getDataWhenAction();
        loadAction.value = false;
        dataEdit.value = {};
        dialogCrud.value = false;
      });
    }
    submitted.value = false;
  }
};

const editData = (data) => {
  dialogCrud.value = true;
  titleDialog.value = "SỬA TIÊU CHÍ ĐÁNH GIÁ";
  dataEdit.value = { ...data };
  if (dataEdit.value.IsActive == "I") Active.value = false;
  if (dataEdit.value.IsActive == "A") Active.value = true;
};

const deleteData = () => {
  const arr_delete = [];
  loadAction.value = true;
  if (selected_data.value) {
    for (let index = 0; index < selected_data.value.length; index++) {
      const element = selected_data.value[index].ID;
      arr_delete.push({
        ID: element,
      });
    }
  } else {
    arr_delete.push({
      ID: dataEdit.value.ID,
    });
  }
  const data_send = {
    data: arr_delete,
  };
  API.delete_v2(data_send, api_delete).then(
    (response) => {
      if (dataEdit.value) {
        dataTable.value = dataTable.value.filter((val) => val.ID !== dataEdit.value.ID);
      } else {
        dataTable.value = dataTable.value.filter(
          (val) => !selected_data.value.includes(val)
        );
        selected_data.value = null;
      }
      delete_dialog.value = false;
      loadAction.value = false;
      dataEdit.value = {};
      notification("success", "Đã xoá thành công");
      getDataWhenAction();
    },
    (error) => {
      loadAction.value = false;
    }
  );
};

const getError = () => {
  error.value = false;
  if (!dataEdit.value.OecName) error.value = true;
  // if (!dataEdit.value.OecDesc) error.value = true;

  return error.value;
};
const convertData = () => {
  if (Active.value) {
    dataEdit.value.IsActive = "A";
  } else {
    dataEdit.value.IsActive = "I";
  }

  return { data: [dataEdit.value] };
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < dataTable.value.length; i++) {
    if (dataTable.value[i].ID === id) {
      index = i;
      break;
    }
  }
  return index;
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
</script>
