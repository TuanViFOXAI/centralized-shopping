<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">QUẢN LÝ YÊU CẦU MUA SẮM</h5>
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
            responsiveLayout="scroll"
            @page="onPageChange($event)"
            v-model:selection="selected_data"
            dataKey="ID"
          >
            <template #header>
              <div class="grid bg--surface-card">
                <div class="flex flex-column col-6">
                  <h5 class="m-0"></h5>
                  <span class="block mt-2 md:mt-0 p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText v-model="keyword" placeholder="Tìm Kiếm..." />
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
              field="FobName"
              header="Tên yêu cầu mua sắm"
              :sortable="true"
              headerStyle="width:40%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">FobName</span>
                {{ slotProps.data.FobName }}
              </template>
            </Column>
            <Column
              field="FobDesc"
              header="Đơn vị đề xuất"
              :sortable="true"
              headerStyle="width:15%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">FobDesc</span>
                {{ slotProps.data.FobDesc }}
              </template>
            </Column>
            <Column
              field="is_active"
              header="Loại yêu cầu"
              :sortable="true"
              headerStyle="width:15%; min-width:8rem;text-al"
            >
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt Động" : "Không Hoạt Động" }}
              </template>
            </Column>
            <Column
              field="FobName"
              header="Thời gian thực hiện"
              :sortable="true"
              headerStyle="width:20%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">FobName</span>
                {{ slotProps.data.FobName }}
              </template>
            </Column>
            <Column
              field="FobName"
              header="Trạng thái"
              :sortable="true"
              headerStyle="width:10%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">FobName</span>
                {{ slotProps.data.FobName }}
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
    :style="{ width: '80%' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="grid">
      <div class="field col-4">
        <label for="ten_dv">Tên yêu cầu</label>
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
          v-model.trim="dataEdit.FobName"
          :class="{ 'p-invalid': submitted && !dataEdit.FobName }"
        />
        <small class="p-invalid" v-if="submitted && !dataEdit.FobName"
          >Không được bỏ trống mã hình thức.</small
        >
      </div>
      <div class="field col-4">
        <label for="ten_dv">Mã yêu cầu</label>
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
          :disabled="true"
          autofocus
          aria-required="true"
          v-model.trim="dataEdit.FobDesc"
          :class="{ 'p-invalid': submitted && !dataEdit.FobDesc }"
        />
        <small class="p-invalid" v-if="submitted && !dataEdit.FobDesc"
          >Không được bỏ trống tên hình thức.</small
        >
      </div>
      <div class="field col-4">
        <label for="ten_dv">Người tạo</label>
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
          :disabled="true"
          autofocus
          aria-required="true"
          v-model.trim="dataEdit.FobDesc"
          :class="{ 'p-invalid': submitted && !dataEdit.FobDesc }"
        />
        <small class="p-invalid" v-if="submitted && !dataEdit.FobDesc"
          >Không được bỏ trống tên hình thức.</small
        >
      </div>
    </div>
    <div class="grid">
      <div class="field col-4">
        <label for="ten_dv">Loại yêu cầu</label>
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

        <Dropdown />
        <!-- <small class="p-invalid" v-if="submitted && !dataEdit.FobName"
          >Không được bỏ trống mã hình thức.</small
        > -->
      </div>
      <div class="field col-4">
        <label for="ten_dv">Thuộc kế hoạch</label>
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
        <Dropdown />
        <!-- <small class="p-invalid" v-if="submitted && !dataEdit.FobDesc"
          >Không được bỏ trống tên hình thức.</small
        > -->
      </div>
      <div class="field col-4">
        <label for="ten_dv">Thuộc đơn vị</label>
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
        <Dropdown :disabled="true" />
        <small class="p-invalid" v-if="submitted && !dataEdit.FobDesc"
          >Không được bỏ trống tên hình thức.</small
        >
      </div>
    </div>
    <div class="grid">
      <div class="field col-4">
        <label for="ten_dv">Mã hình thức</label>
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

        <Calendar />
        <small class="p-invalid" v-if="submitted && !dataEdit.FobName"
          >Không được bỏ trống mã hình thức.</small
        >
      </div>
      <div class="field col-4">
        <label for="ten_dv">Trạng thái phê duyệt</label>
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
          :disabled="true"
          aria-required="true"
          v-model.trim="dataEdit.FobDesc"
          :class="{ 'p-invalid': submitted && !dataEdit.FobDesc }"
        />
        <!-- <small class="p-invalid" v-if="submitted && !dataEdit.FobDesc"
          >Không được bỏ trống tên hình thức.</small
        > -->
      </div>
    </div>
    <div class="grid">
      <TabView class="w-full">
        <!-- TabPanel_1 -->
        <TabPanel header="Danh sách vật tư hàng hoá cần mua">
          <div class="w-full">
            <DataTable
              showGridlines
              rows="10"
              :value="dataTable"
              responsiveLayout="scroll"
              v-model:selection="selected_data"
              dataKey="ID"
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column
                field="FobName"
                header="Tên hàng hoá"
                :sortable="true"
                headerStyle="width:40%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">FobName</span>
                  {{ slotProps.data.FobName }}
                </template>
              </Column>
              <Column
                field="FobDesc"
                header="Thuộc kế hoạch"
                :sortable="true"
                headerStyle="width:20%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">FobDesc</span>
                  {{ slotProps.data.FobDesc }}
                </template>
              </Column>
              <Column
                field="is_active"
                header="Số lượng"
                :sortable="true"
                headerStyle="width:10%; min-width:8rem;text-al"
              >
                <template #body="slotProps">
                  {{ slotProps.data.IsActive == "A" ? "Hoạt Động" : "Không Hoạt Động" }}
                </template>
              </Column>
              <Column
                field="FobName"
                header="Đơn giá dự kiến"
                :sortable="true"
                headerStyle="width:20%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">FobName</span>
                  {{ slotProps.data.FobName }}
                </template>
              </Column>
              <Column
                field="FobName"
                header="Thành tiền"
                :sortable="true"
                headerStyle="width:10%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">FobName</span>
                  {{ slotProps.data.FobName }}
                </template>
              </Column>
              <Column
                field="FobName"
                header="Ghi chú"
                :sortable="true"
                headerStyle="width:10%; min-width:10rem;"
              >
                <template #body="slotProps">
                  <span class="p-column-title">FobName</span>
                  {{ slotProps.data.FobName }}
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
            <div class="text-right">
              <p class="m-0 mt-3">Tổng tiền (dự kiến): <strong>xxx.xxx.xxx đ</strong></p>
              <p>Bằng chữ: <strong>xxx.xxx.xxx đ</strong></p>
            </div>
          </div>
        </TabPanel>
        <!-- TabPanel_2 -->

        <TabPanel header="Chứng từ đính kèm">
          <Toast />
          <FileUpload
            :multiple="true"
            v-model="dataEdit.file"
            :maxFileSize="1000000"
            @select="onAdvancedUploadTest"
            mode="basic"
            class="mb-4"
            :auto="true"
            chooseLabel="Tải lên"
          >
            <template #empty>
              <p>Kéo và thả tệp vào đây để tải lên</p>
            </template>
          </FileUpload>

          <DataTable
            :value="
              dataEdit.Patch
                ? dataEdit.Patch.filter((val) => val.Type !== 'D')
                : dataEdit.Patch
            "
            showGridlines
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              field="PatchName"
              header="Tên tệp tin"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">PatchName</span>
                {{ slotProps.data.PatchName }}
              </template>
            </Column>
            <Column
              field="type"
              header="Tệp tin"
              headerStyle="width:20%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">type</span>
                <Image :src="slotProps.data.Link" alt="" width="50" preview />
              </template>
            </Column>
            <Column
              field="size"
              header="Kích thước(KB)"
              headerStyle="width:20%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">size</span>
                {{ slotProps.data.size }}
              </template>
            </Column>

            <Column
              field="ItmsGrpCod"
              header="Ghi chú"
              headerStyle="width:30%; min-width:10rem;"
            >
              <template #body="slotProps">
                <InputText
                  placeholder="Ghi chú"
                  autofocus
                  aria-required="true"
                  v-model="slotProps.data.PatchDesc"
                />
              </template>
            </Column>
            <Column headerStyle="width:10%; min-width:5rem;" header="Hành động">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text"
                  @click="delete_file(slotProps.data)"
              /></template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        class="p-button-text"
        @click="hideDialog()"
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        :loading="loadAction"
        class="p-button-text"
        @click="saveData()"
      />
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
      <span v-if="dataEdit.FobName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.FobName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.FobName"
        >Bạn chắc chắn muốn xóa <b>{{ selected_data.length }}</b> bản ghi này không
        ?</span
      >
    </div>
    <template #footer>
      <Button
        label="Hủy"
        icon="pi pi-times"
        class="p-button-text"
        @click="hideDelete()"
      />
      <Button
        label="Xóa"
        icon="pi pi-check"
        :loading="loadAction"
        class="p-button-text"
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
import ERROR from "../../services/StatusCode.json";

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
const api_add = "oofb/create";
const api_update = "oofb/update";
const api_get = "oofb/getall";
const api_delete = "oofb/delete";
const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);

onBeforeMount(() => {
  params.value = {
    page: route.params.page ?? 1,
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
    }).then((response) => {
      dataTable.value = response.data.data;
      TotalCount.value = response.data.TotalCount;
      rowFirst.value = (response.data.Page - 1) * response.data.Size;
      loading.value = false;
      dataHeader.value = response.data;
      routerRedirect(response.data.Page);
    });
  }, 50);
};

// Chuyển hướng route
const routerRedirect = (event) => {
  router.push({ name: route.name, params: { page: event } });
};

const getDataWhenAction = () => {
  params.value = {
    page: route.params.page ?? 1,
    size: dataHeader.value.Size,
  };
  getData();
};

// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};

const openNew = () => {
  submitted.value = false;
  dialogCrud.value = true;
  Active.value = true;
  dataEdit.value = {};
  titleDialog.value = "THÊM MỚI YÊU CẦU MUA SẮM";
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
          const mes = ERROR.find((val) => val.code === codeErr)?.mes;
          notification("error", mes);
        } else {
          const ID = findIndexById(response.data.data[0].ID);
          let mes = "Đã thêm thành công";
          getDataWhenAction();
          if (ID !== -1) {
            dataTable.value[ID] = response.data.data[0];
            mes = "Đã sửa thành công";
          } else {
            dataTable.value?.push(response.data.data[0]);
          }
          notification("success", mes);
        }
        resetData();
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
};

const editData = (data) => {
  dialogCrud.value = true;
  titleDialog.value = "SỬA HÌNH THỨC ĐẤU THẦU";
  dataEdit.value = { ...data };
  if (dataEdit.value.IsActive == "I") Active.value = false;
  if (dataEdit.value.IsActive == "A") Active.value = true;
};

const deleteData = () => {
  const arr_delete = [];
  loadAction.value = true;

  if (selected_data.value) {
    for (const item of selected_data.value) {
      arr_delete.push({ ID: item.ID });
    }
  } else {
    arr_delete.push({ ID: dataEdit.value.ID });
  }

  const data_send = { data: arr_delete };

  // API.delete_v2(data_send, api_delete)
  //   .then(
  //     (response) => {
  //       if (dataEdit.value) {
  //         dataTable.value = dataTable.value.filter((val) => val.ID !== dataEdit.value.ID);
  //       } else {
  //         dataTable.value = dataTable.value.filter(
  //           (val) => !selected_data.value.includes(val)
  //         );
  //         selected_data.value = null;
  //       }
  //       delete_dialog.value = false;
  //       loadAction.value = false;
  //       dataEdit.value = {};
  //       notification("success", "Đã xoá thành công");
  //       getDataWhenAction();
  //     },
  //     (error) => {
  //       notification("error", error);
  //       loadAction.value = false;
  //     }
  //   )
  //   .catch((error) => {
  //     notification("error", error);
  //     loadAction.value = false;
  //   });
};

const getError = () => {
  error.value = false;
  if (!dataEdit.value.FobName || !dataEdit.value.FobDesc) {
    error.value = true;
  }
  return error.value;
};

const convertData = () => {
  dataEdit.value.IsActive = Active.value ? "A" : "I";
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

const keyword = ref();

const onClickSearch = () => {
  
}

</script>
