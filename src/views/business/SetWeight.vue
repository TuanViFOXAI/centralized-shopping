<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          THIẾT LẬP TRỌNG SỐ CHẤM ĐIỂM
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
                    :label="$t('Button.AddNew')"
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
            <Column header="#" headerStyle="width: 3rem">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template></Column
            >
            <Column field="SwName" header="Tên trọng số" :sortable="true">
              <template #body="slotProps">
                <span class="p-column-title">SwName</span>
                {{ slotProps.data.SwName }}
              </template>
            </Column>
            <Column field="SwDesc" header="Mô tả" :sortable="true">
              <template #body="slotProps">
                <span class="p-column-title">SwDesc</span>
                {{ slotProps.data.SwDesc }}
              </template>
            </Column>
            <Column field="is_active" header="Trạng thái" :sortable="true">
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt Động" : "Không Hoạt Động" }}
              </template>
            </Column>
            <Column header="Hành động" :sortable="false">
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
      <label for="ten_dv">Tên trọng số</label>
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
        v-model="dataEdit.SwName"
        :class="{ 'p-invalid': submitted && !dataEdit.SwName }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.SwName"
        >Không được bỏ trống tên trọng số.</small
      >
    </div>
    <div class="field">
      <label for="ten_dv">Mô tả</label>
      <InputText
        :required="true"
        autofocus
        aria-required="true"
        v-model="dataEdit.SwDesc"
      />
    </div>
    <div class="field col-12 card p-0">
      <DataTable :value="Weight">
        <Column field="name" header="Tiêu chí"></Column>
        <Column
          header="Trọng số"
          headerStyle="height:3px"
          bodyStyle="height:10px !important"
          bodyClass="p-1"
        >
          <template #body="slotProps">
            <InputNumber :min="0" :max="100" v-model="dataEdit[slotProps.data.point]" />
          </template>
        </Column>
      </DataTable>
    </div>
    <small class="p-invalid" v-if="totalScore != 100 && submitted"
      >Tổng trọng số phải bằng 100</small
    >
    <ul class="text-right mr-2 list-none">
      <li>
        <small>Lưu ý: Tổng trọng số bằng 100</small>
      </li>
      <li>
        <small>Tổng diểm hiện tại: {{ totalScore }}</small>
      </li>
    </ul>
    <div class="field">
      <div class="field col-6 pr-0">
        <div class="input-header">
          <h6>Trạng Thái</h6>
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
      <span v-if="dataEdit.SwName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.SwName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.SwName"
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
.p-invalid {
  color: red;
}
</style>
<script setup>
import { computed, onBeforeMount, ref } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import CRUD from "../../services/dataCRUD";

// Api ---------------------------
const api_add = "oosw/create";
const api_update = "oosw/update";
const api_get = "oosw/getall";
const api_delete = "oosw/delete";
// ---------------------------------

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
const header_update = ref("SỬA TRỌNG SỐ CHẤM ĐIỂM");
const header_new = ref("THÊM MỚI TRỌNG SỐ CHẤM ĐIỂM");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);

const searchKey = ref('');
const onSearch = () => {
  params.value = {
    size: 10,
    page: 1,
    q: searchKey.value
  }
  getData();
}

const Weight = ref([
  {
    code: "1",
    name: "Tiến độ thực hiện",
    point: "Score1",
  },

  {
    code: "2",
    name: "Điều khoản thanh toán",
    point: "Score2",
  },

  {
    code: "6",
    name: "Xuất xứ",
    point: "Score6",
  },

  {
    code: "4",
    name: "Chính sách bảo hành",
    point: "Score4",
  },

  {
    code: "7",
    name: "Báo giá",
    point: "Score7",
  },

  
  // {
  //   code: "3",
  //   name: "Lịch sử nhà cung cấp",
  //   point: "Score3",
  // },

  

  // {
  //   code: "5",
  //   name: "Số lượng có thể cung cấp",
  //   point: "Score5",
  // },

  
]);
let total = 0;

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
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
        if (codeErr === 2627) {
          
          notification("error", "Tên đã tồn tại");
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
          notification("error", "Tên đã tồn tại");
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

const getError = () => {
  if (!dataEdit.value.SwName || total != 100) {
    console.log(total);
    return true;
  }
  return false;
};

const convertData = () => {
  console.log(dataEdit.value)
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
const totalScore = computed(() => {
  console.log(Weight.value)
  total = 0;
  if (dataEdit.value) {
    for (let index = 0; index < Weight.value.length; index++) {
      if (dataEdit.value[Weight.value[index].point] != undefined)
        total += dataEdit.value[Weight.value[index].point];
    }
  }
  return total;
});



</script>
