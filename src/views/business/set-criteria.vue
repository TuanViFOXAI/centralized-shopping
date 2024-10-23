<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          THIẾT LẬP TIÊU CHÍ CHẤM ĐIỂM
        </h5>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
  <!-- End Header -->
  <div class="grid">
    <div class="col-12">
      <div class="card p-0">
        <div class="grid bg--surface-card p-2">
          <div class="flex flex-column col-6">
            <h5 class="m-0"></h5>
            <span class="block p-input-button">
              <InputText :placeholder="$t('InputText.Search')" />
              <Button icon="pi pi-search" />
            </span>
          </div>
          <div class="col-6 flex fl-end">
            <!-- <Button
              label="Thêm Mới"
              icon="pi pi-plus"
              class="text-end px-3 py-2 font-medium"
              @click="openNew()"
            /> -->
            <!-- <Button
              label="Xóa"
              icon="pi pi-trash"
              class="p-button-danger mx-3 text-end px-3 py-2 font-medium"
              @click="confirmDelete(null)"
              :disabled="!selected_data || !selected_data.length"
            /> -->
          </div>
        </div>
      </div>
      <div class="grid justifi-content-betwen p-2">
        <div class="col-3 border-round">
          <div class="bg-primary p-3 border-round-sm mb-3">
            <h6 class="text-white m-0 font-bold">Danh mục tiêu chí đánh giá</h6>
          </div>
          <div
            :class="{ active: inx == 0, 'p-3 border-round-sm mb-1  list-cri': true }"
            v-for="(item, inx) in dataTable"
            :key="inx"
            @click="getCri($event, item.ID)"
          >
            {{ item.ScwName }}
          </div>
        </div>
        <div class="col-9 border-round">
          <div class="bg-primary p-3 border-round-sm">
            <h6 class="text-white m-0">
              Tiêu chí {{ oscw ? oscw.ScwName.toLowerCase() : null }}
            </h6>
          </div>

          <div class="mt-3 relative" v-if="SCW1">
            <Loading v-if="!SCW1" class="absolute" />
            <DataTable
              :value="SCW1"
              responsiveLayout="scroll"
              @page="onPageChange($event)"
              v-model:selection="selected_data"
              dataKey="ID"
              :rows="10"
              :showGridlines="true"
              :paginator="true"
            >
              <Column
                field="CwCode"
                header="Mã tiêu chí"
                :sortable="true"
                headerStyle="width:25%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">CwCode</span>
                  {{ slotProps.data.CwCode }}
                </template>
              </Column>
              <Column
                field="CwName"
                header="Tên tiêu chí"
                :sortable="true"
                headerStyle="width:25%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">CwName</span>
                  {{ slotProps.data.CwName }}
                </template>
              </Column>
              <Column
                field="CwDesc"
                header="Mô tả"
                :sortable="true"
                headerStyle="width:25%; min-width:8rem;text-al"
              >
                <template #body="slotProps">
                  <span class="p-column-title">CwDesc</span>
                  {{ slotProps.data.CwDesc }}
                </template>
              </Column>
              <Column
                field="Score"
                header="Điểm"
                :sortable="true"
                headerStyle="width:25%; min-width:8rem;text-al"
              >
                <template #body="slotProps">
                  <span class="p-column-title">Score</span>
                  {{ slotProps.data.Score }}
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
            <Button
              label="Thêm mới"
              icon="pi pi-plus"
              severity="contrast"
              class="mt-3"
              outlined
              @click="openNew()"
            />
          </div>
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
        <label>Mã tiêu chí</label>
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
          v-model="dataEdit.CwCode"
          :class="{ 'p-invalid': submitted && !dataEdit.CwCode }"
        />
        <small class="p-error" v-if="submitted && !dataEdit.CwCode"
          >Không được bỏ trống mã tiêu chí.</small
        >
      </div>
      <div class="field col-6">
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
          v-model="dataEdit.CwName"
          :class="{ 'p-invalid': submitted && !dataEdit.CwName }"
        />
        <small class="p-error" v-if="submitted && !dataEdit.CwName"
          >Không được bỏ trống tên tiêu chí.</small
        >
      </div>
    </div>
    <div class="grid">
      <div class="field col-6">
        <label>Mô tả tiêu chí</label>

        <InputText autofocus v-model="dataEdit.CwDesc" />
      </div>
      <div class="field col-6">
        <label>Điểm</label>
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
          v-model="dataEdit.Score"
          mode="decimal"
          showButtons
          :min="0"
          :max="10"
          :class="{ 'p-invalid': submitted && dataEdit.Score == null }"
        />
        <small class="p-error" v-if="submitted && dataEdit.Score == null"
          >Hãy nhập điểm.</small
        >
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
      <span v-if="dataEdit.CwCode"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.CwName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.CwName"
        >Bạn chắc chắn muốn xóa <b>{{ selected_data.length }}</b> bản ghi này không
        ?</span
      >
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" outlined @click="hideDelete()" />
      <Button label="Xóa" icon="pi pi-check" :loading="loadAction" @click="saveData()" />
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
.active {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
}
.list-cri:hover {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
}
</style>
<script setup>
import { onBeforeMount, ref, watch } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import CRUD from "../../services/dataCRUD";

// Api ---------------------------
const api_add = "oscw/update";
const api_update = "oscw/update";
const api_get = "oscw/getall";
const api_delete = "oscw/update";
// ---------------------------------

// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const dataTable = ref([]);
// -----------------------------End phân trang--------------------------------

//-------------------- Start CRUD ------------------
const header_update = ref("SỬA TIÊU CHÍ CHẤM ĐIỂM");
const header_new = ref("THÊM MỚI TIÊU CHÍ CHẤM ĐIỂM");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const SCW1 = ref(null);
const oscw = ref(null);

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 5,
  };
  getData();
});

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
        dataTable.value = response.data.data;
        getCri("", dataTable.value[0].ID);
        router.push({
          name: route.name,
          query: {
            page: response.data.Page,
          },
        });
      })
      .catch((error) => {
        notification("error", error);
      });
  }, 50);
};

const getDataWhenAction = (t) => {
  if (dataEdit.value.Type == "U")
    SCW1.value[findIndexById(dataEdit.value.ID)] = dataEdit.value;

  if (dataEdit.value.Type == "A") SCW1.value.push(dataEdit.value);

  if (dataEdit.value.Type == "D")
    SCW1.value = SCW1.value.filter((val) => {
      return val.ID != dataEdit.value.ID;
    });

  resetData();
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < SCW1.value.length; i++) {
    if (SCW1.value[i].ID === id) {
      index = i;
      break;
    }
  }
  return index;
};

// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};
// Lấy danh sách ----------------------------------------------------

const openNew = () => {
  titleDialog.value = header_new.value;
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
    const apiFunction = dataEdit.value.ID ? API.update_v2 : API.update_v2;

    apiFunction(convertData(), apiEndpoint)
      .then((response) => {
        const codeErr = response.data.CodeErr;
        if (codeErr) {
          notification("error", ERROR.find((val) => val.code === codeErr)?.mes);
          loadAction.value = false;
        } else {
          let tin = "";
          if (dataEdit.value.Type == "U") tin = "Cập nhật thành công";

          if (dataEdit.value.Type == "A") tin = "Thêm mới thành công";

          if (dataEdit.value.Type == "D") tin = "Xoá thành công";
          notification("success", tin);
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
  dataEdit.value = { ...data };
  dataEdit.value.Type = "U";
};

const getError = () => {
  if (!dataEdit.value.CwCode || !dataEdit.value.CwName || dataEdit.value.Score == null) {
    return true;
  }
  return false;
};

const convertData = () => {
  if (!dataEdit.value.Type) dataEdit.value.Type = "A";
  oscw.value.SCW1 = [dataEdit.value];
  return oscw.value;
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
  dataEdit.value.Type = "D";
  delete_dialog.value = true;
};

const hideDelete = () => {
  delete_dialog.value = false;
  dataEdit.value = {};
};
const getCri = (event, ID) => {
  API.get_all("oscw/getbyid?id=" + ID).then((res) => {
    SCW1.value = res.data.SCW1;
    oscw.value = res.data;
    if (event != "") {
      const this_target = event.target;
      const children = this_target.parentNode.querySelectorAll(".active");
      children.forEach((child) => {
        child.classList.remove("active");
      });
      this_target.classList.add("active");
    }
  });
};
</script>
