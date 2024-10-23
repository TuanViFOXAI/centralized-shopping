<template>
  <div class="">
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH MỤC ĐƠN VỊ TÍNH</h5>
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
                  <h5 class="m-0"></h5>
                  <span class="block p-input-button">
                    <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                    <Button @click="onSearch" icon="pi pi-search" />
                  </span>
                </div>
                <div class="col-6 flex fl-end">
                  <Button
                    label="Nhập excel"
                    icon="pi pi-file-import"
                    severity="success"
                    class="text-end px-3 py-2 font-medium mr-3"
                    @click="openImportData()"
                  />
                  <Button
                    label="Thêm mới"
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
              field="UomCode"
              header="Mã đơn vị tính"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">UomCode</span>
                {{ slotProps.data.UomCode }}
              </template>
            </Column>
            <Column
              field="UomName"
              header="Tên đơn vị tính"
              :sortable="true"
              headerStyle="width:14%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">UomName</span>
                {{ slotProps.data.UomName }}
              </template>
            </Column>
            <Column
              field="Length"
              header="Chiều dài"
              :sortable="true"
              headerStyle="width:11%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Length</span>
                {{ slotProps.data.Length }}
              </template>
            </Column>
            <Column
              field="Width"
              header="Chiều rộng"
              :sortable="true"
              headerStyle="width:11%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Width</span>
                {{ slotProps.data.Width }}
              </template>
            </Column>
            <Column
              field="Height"
              header="Chiều cao"
              :sortable="true"
              headerStyle="width:11%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Height</span>
                {{ slotProps.data.Height }}
              </template>
            </Column>

            <Column
              field="Volume"
              header="Thể tích"
              :sortable="true"
              headerStyle="width:11%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">Volume</span>
                {{ slotProps.data.Volume }}
              </template>
            </Column>
            <Column
              field="IsActive"
              header="Trạng thái"
              :sortable="true"
              headerStyle="width:16%; min-width:10rem;text-al"
            >
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt động" : "Không hoạt động" }}
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
      <div class="field col-5">
        <label for="">Mã đơn vị tính</label>
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
          v-model="dataEdit.UomCode"
          :class="{ 'p-invalid': submitted && !dataEdit.UomCode }"
        />
        <small class="p-error" v-if="submitted && !dataEdit.UomCode"
          >Mã đơn vị tính không được để trống.</small
        >
      </div>
      <div class="field col-7">
        <label for="">Tên đơn vị tính</label>
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
          v-model="dataEdit.UomName"
          :class="{ 'p-invalid': submitted && !dataEdit.UomName }"
          @keydown.enter="saveData()"
        />
        <small class="p-error" v-if="submitted && !dataEdit.UomName"
          >Tên đơn vị tính không được để trống.</small
        >
      </div>
    </div>

    <div class="grid">
      <div class="field col-3">
        <label for="">Chiều dài</label>
        <InputNumber
          :required="true"
          autofocus
          aria-required="true"
          v-model.trim="dataEdit.Length"
        />
      </div>
      <div class="field col-3">
        <label for="">Chiều rộng</label>
        <InputNumber
          :required="true"
          autofocus
          aria-required="true"
          v-model.trim="dataEdit.Width"
        />
      </div>
      <div class="field col-3">
        <label for="">Chiều cao</label>
        <InputNumber
          :required="true"
          autofocus
          aria-required="true"
          v-model.trim="dataEdit.Height"
        />
      </div>
      <div class="field col-3">
        <label for="">Đơn vị kích thước</label>
        <Dropdown
          v-model="dataEdit.LenUnit"
          :options="unit"
          optionLabel="name"
          optionValue="name"
          @change="setUnit()"
        />
      </div>
    </div>
    <div class="grid">
      <div class="field col-6">
        <label for="">Thể tích</label>
        <InputText
          :required="true"
          autofocus
          aria-required="true"
          v-model="dataEdit.Volume"
          disabled
        />
      </div>
      <div class="field col-6">
        <label for="">Đơn vị thể tích</label>
        <Dropdown
          v-model="dataEdit.VolUnit"
          :options="unit"
          optionLabel="name"
          optionValue="name"
          placeholder="Lựa chọn đơn vị thể tích"
          disabled
        />
      </div>
    </div>

    <div class="field">
      <div class="field col-6 pr-0">
        <div class="input-header">
          <h6>Trạng thái</h6>
        </div>
        <div class="formgrid">
          <div class="#">
            <InputSwitch v-model="dataEdit.IsActive" trueValue="A" falseValue="I" />
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
      <span v-if="dataEdit.UomCode"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.UomCode }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.UomCode"
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
  <Dialog
    v-model:visible="visibleImportFileData"
    :style="{ width: '80rem' }"
    modal
    header="Nhập dữ liệu từ Excel"
  >
    <div class="file-panel">
      <DataTable :value="[{}]" showGridlines="">
        <Column header="Tên file">
          <template #body>
            {{ sheetData.name }}
          </template>
        </Column>
        <Column header="Dung lượng">
          <template #body>
            {{ sheetData.size }}
          </template>
        </Column>
        <Column header="Số dòng">
          <template v-if="sheetData.name" #body>
            {{ sheetData.data.length }} dòng
          </template>
        </Column>
        <Column header="" style="text-align: center; width: 3rem">
          <template #body>
            <Button
              @click="removeFile"
              v-if="sheetData.name"
              rounded
              style="width: 22px; height: 22px"
              text
              icon="pi pi-times"
            />
          </template>
        </Column>
      </DataTable>
      <DataTable
        showGridlines=""
        size="small"
        :value="sheetData.data"
        class="mt-3"
        scrollable
        scrollHeight="20rem"
      >
        <Column header="#">
          <template #body="sp">
            {{ ++sp.index }}
          </template>
        </Column>
        <Column field="UomCode" header="Mã" />
        <Column field="UomName" header="Tên đơn vị" />
        <Column field="Length" header="Chiều dài" style="text-align: center" />
        <Column field="Width" header="Chiều rộng" style="text-align: center" />
        <Column field="Height" header="Chiều cao" style="text-align: center" />
        <Column field="Volume" header="Thể tích" style="text-align: center" />
        <Column field="VolUnit" header="Đơn vị kích thước" style="text-align: center" />
        <Column field="ErrorStatus" header="Mã lỗi" style="max-width: 15rem">
          <template #body="sp">
            <p
              :class="{
                'text-success': sp.data.ErrorStatus
                  ? sp.data.ErrorStatus.code === 0
                    ? true
                    : false
                  : false,
                'text-error': sp.data.ErrorStatus
                  ? sp.data.ErrorStatus.code !== 0
                    ? true
                    : false
                  : false,
              }"
            >
              {{ sp.data.ErrorStatus ? sp.data.ErrorStatus.message : null }}
            </p>
          </template>
        </Column>
        <template #empty>
          <div class="flex align-items-center justify-center h-16rem">
            <span class="material-symbols-outlined mr-3"> folder_off </span>
            Chưa có dữ liệu
          </div>
        </template>
      </DataTable>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <div class="flex gap-2">
          <ImportFiles
            :loading="waitLoad"
            size="normal"
            outlined
            @on-select="onImportFile"
            icon="pi pi-file-import"
            :accept="acceptFileType"
            label="Chọn file"
            :multiple="false"
          />
          <Button
            @click="downloadTemplateExcelFile"
            outlined
            icon="pi pi-download"
            label="Tải file mẫu"
          />
        </div>
        <Button
          :loading="loadingCreate"
          :disabled="sheetData.data.length < 1"
          :label="availableToSend ? 'Lưu' : 'Đóng'"
          :icon="availableToSend ? 'pi pi-save' : 'pi pi-times'"
          @click="sentDataCreate"
        />
      </div>
    </template>
  </Dialog>
  <!-- End xoa -->
</template>
<style>
.text-success {
  color: rgb(45, 224, 69);
}
.text-error {
  color: red;
}
</style>
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
  /* align-dataedits: center; */
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
.file-panel {
  /* border: 1px dashed #918c8c; */
  /* padding: 1rem; */
}
</style>
<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";

const api_add = "ouom/create";
const api_update = "ouom/update";
const api_get = "ouom/getall";
const api_delete = "ouom/delete";

// Search
const searchKey = ref('');
const onSearch =  () => {
  params.value = {
    page: 1,
    size: 10,
  }
  getData();
}

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
const header_update = ref("SỬA ĐƠN VỊ TÍNH");
const header_new = ref("THÊM MỚI ĐƠN VỊ TÍNH");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
// Đơn vị tính
const unit = ref([
  { code: "mm", name: "mm" },
  { code: "cm", name: "cm" },
  { code: "m", name: "m" },
]);

watch(() => {
  if (dataEdit.value.Height && dataEdit.value.Width && dataEdit.value.Length) {
    dataEdit.value.Volume =
      dataEdit.value.Height * dataEdit.value.Width * dataEdit.value.Length;
  } else {
    dataEdit.value.Volume = null;
  }
});

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
});

const getError = () => {
  if (!dataEdit.value.UomCode.trim() || !dataEdit.value.UomName.trim()) {
    return true;
  }
  return false;
};
// Lấy danh sách ----------------------------------------------------
const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  console.log(params.value);
  setTimeout(() => {
    API.get_all_v2(`${api_get}?q=${searchKey.value}`, {
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
  resetData();
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
  dataEdit.value = {};
  dialogCrud.value = false;
  submitted.value = false;
  delete_dialog.value = false;
};

const editData = (data) => {
  dialogCrud.value = true;
  titleDialog.value = header_update.value;
  dataEdit.value = { ...data };
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
  return { data: [dataEdit.value] };
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

const setUnit = () => {
  dataEdit.value.WdthUnit = dataEdit.value.LenUnit;
  dataEdit.value.HghtUnit = dataEdit.value.LenUnit;
  dataEdit.value.VolUnit = dataEdit.value.LenUnit;
};
import ImportFiles from "./components/ImportFiles.vue";
const acceptFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
const visibleImportFileData = ref(false);
const openImportData = () => {
  sheetData.data = [];
  sheetData.name = null;
  sheetData.size = null;
  visibleImportFileData.value = true;
  availableToSend.value = true;
};

const removeFile = () => {
  sheetData.data = [];
  sheetData.name = null;
  sheetData.size = null;
  availableToSend.value = true;
};

const sheetData = reactive({
  name: null,
  size: null,
  data: [],
});

const validFile = [
  "Mã đơn vị tính",
  "Tên đơn vị tính",
  "Chiều dài",
  "Chiều rộng",
  "Chiều cao",
  "Thể tích",
  "Đơn vị kích thước",
];

import readXlsxFile from "read-excel-file";
const waitLoad = ref(false);
const onImportFile = (file) => {
  // console.log(file);
  waitLoad.value = true;
  sheetData.data = [];
  readXlsxFile(file.File)
    .then((rows) => {
      if (JSON.stringify(rows[0]) === JSON.stringify(validFile)) {
        rows.splice(0, 1);
        for (const col of rows) {
          if (col[0] && col[1]) {
            sheetData.data.push({
              UomCode: col[0].toString(),
              UomName: col[1].toString(),
              Length: typeof col[2] === "number" ? col[2] : 0,
              Width: typeof col[3] === "number" ? col[3] : 0,
              Height: typeof col[4] === "number" ? col[4] : 0,
              Volume: typeof col[5] === "number" ? col[5] : 0,
              VolUnit: col[6],
              LenUnit: col[6],
              WdthUnit: col[6],
              HghtUnit: col[6],
              IsActive: "A",
            });
          }
        }
      } else {
        return true;
      }
    })
    .then((isError) => {
      waitLoad.value = false;
      if (isError) {
        sheetData.name = null;
        sheetData.size = null;
        sheetData.data = [];
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: "Định dạng file sai! Xin hãy sử dụng file mẫu.",
          life: 3000,
        });
      } else {
        sheetData.name = file.File.name;
        sheetData.size = file.Size;
      }
    })
    .catch((e) => {
      waitLoad.value = false;
      sheetData.data = [];
      sheetData.name = null;
      sheetData.size = null;
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: "Chỉ chấp nhận file excel!",
        life: 3000,
      });
      console.log(e);
    });
};
const loadingCreate = ref(false);
const availableToSend = ref(true);
const sentDataCreate = async () => {
  if (availableToSend.value) {
    loadingCreate.value = true;
    try {
      const res = await API.postAsync(api_add, {
        data: sheetData.data,
      });
      if (res.status === 200) {
        toast.add({
          severity: "success",
          summary: "Thành công",
          group: "br",
          detail: "Dữ liệu đã được gửi thành công.",
          life: 3000,
        });
      }
      for (let i = 0; i < sheetData.data.length; i++) {
        sheetData.data[i].ErrorStatus = {
          code: res.data.data[i].CodeErr,
          message:
            res.data.data[i].CodeErr === 0
              ? "Thành công"
              : res.data.data[i].CodeErr === 2627
              ? "Đã tồn tại"
              : res.data.data[i].Errors,
        };
      }
      getDataWhenAction();
    } catch (e) {
      console.log(e);
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: e.message,
        life: 3000,
      });
    }
    loadingCreate.value = false;
    availableToSend.value = false;
  } else {
    visibleImportFileData.value = false;
  }
};

const downloadTemplateExcelFile = () => {
  const link = document.createElement("a");
  link.href = "/data/sheets/Danh mục đơn vị tính.xlsx";
  link.download = "Danh mục đơn vị tính.xlsx";
  link.click();
  link.remove();
};
</script>
