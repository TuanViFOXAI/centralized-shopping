<template>
  <div class="bg-surface-card">
    <div class="">
      <div class="flex align-items-center py-2">
        <h5 style="color: #0773bb" class="text-black m-2 p-2 mb-0 mt-0 font-semibold">
          {{ $t("Orglv.Header").toUpperCase() }}
        </h5>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
  <!-- End Header -->
  <div class="grid">
    <div class="col-12">
      <div class="card p-0">
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
              <div class="flex justify-between">
                  <span class="block p-input-button">
                    <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                    <Button @click="onSearch" icon="pi pi-search"></Button>
                  </span>

                <div class="flex gap-3">
                  <Button
                    :label="$t('Button.AddNew')"
                    icon="pi pi-plus"
                    @click="openNew()"
                  />
                  <Button
                    :label="$t('Button.Delete')"
                    severity="danger"
                    icon="pi pi-trash"
                    @click="confirmDelete(null)"
                    :disabled="!selected_data || !selected_data.length"
                  />
                </div>
              </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              field="OrlName"
              :header="$t('Orglv.OrlName')"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">OrlName</span>
                {{ slotProps.data.OrlName }}
              </template>
            </Column>
            <Column
              field="OrlDesc"
              :header="$t('Orglv.OrlDesc')"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">OrlDesc</span>
                {{ slotProps.data.OrlDesc }}
              </template>
            </Column>
            <Column
              field="is_active"
              :header="$t('Orglv.is_active')"
              :sortable="true"
              headerStyle="width:25%; min-width:8rem;text-al"
            >
              <template #body="slotProps">
                {{
                  slotProps.data.IsActive == "A"
                    ? i18n.global.t("Orglv.A")
                    : i18n.global.t("Orglv.I")
                }}
              </template>
            </Column>
            <Column
              headerStyle="min-width:10rem;"
              :header="$t('Orglv.act')"
              :sortable="false"
            >
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
    :style="{ width: '450px' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <label for="ten_dv">{{ $t("Orglv.OrlName") }}</label>
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
        v-model.trim="dataEdit.OrlName"
        :class="{ 'p-invalid': submitted && !dataEdit.OrlName }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.OrlName">{{
        $t("Orglv.validate")
      }}</small>
    </div>
    <div class="field">
      <label for="ten_dv">
        {{ $t("Orglv.OrlDesc") }}
      </label>
      <InputText
        :required="true"
        autofocus
        aria-required="true"
        v-model.trim="dataEdit.OrlDesc"
        @keydown.enter="saveData()"
      />
    </div>
    <div class="field">
      <div class="field col-6 pr-0">
        <div class="input-header">
          <label for=""></label>
          <h6>{{ $t("Orglv.is_active") }}</h6>
        </div>
        <div class="formgrid">
          <div class="#">
            <InputSwitch v-model="dataEdit.IsActive" trueValue="A" falseValue="I" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        icon="pi pi-times"
        outlined
        @click="hideDialog()"
      />
      <Button
        :label="$t('Button.Save')"
        icon="pi pi-check"
        :loading="loadAction"
        @click="saveData()"
      />
    </template>
  </Dialog>
  <Dialog
    v-model:visible="delete_dialog"
    :style="{ width: '450px' }"
    :header="$t('Action.deletion')"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="dataEdit.OrlName"
        >{{ $t("Action.deletionnoti") }} <b>{{ dataEdit.OrlName }}</b
        >?</span
      >
      <span v-if="selected_data && !dataEdit.OrlName"
        >{{ $t("Action.deletionnoti") }} <b>{{ selected_data.length }}</b>
        {{ $t("Action.deletionnoti1") }}</span
      >
    </div>
    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        icon="pi pi-times"
        outlined
        @click="hideDelete()"
      />
      <Button
        :label="$t('Button.Delete')"
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
  border-top: 1px solid var(--surface-border);
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
import { onBeforeMount, ref, watch } from "vue";
import API from "../../apis/api";
import i18n from "../../locale/i18n";
import ERROR from "../../services/StatusCode.json";

const api_add = "oorl/create";
const api_update = "oorl/update";
const api_get = "oorl/getall";
const api_delete = "oorl/delete";

const searchKey = ref('');
var delayTimer;
const onTyping = () => {
  clearTimeout(delayTimer);
  delayTimer = setTimeout(onSearch, 500);
}
watch(searchKey, () => {
  onTyping();
});

const onSearch = () => {
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
const header_update = ref("SỬA CẤP TỔ CHỨC");
const header_new = ref("THÊM MỚI CẤP TỔ CHỨC");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
});

const getError = () => {
  if (!dataEdit.value.OrlName) {
    return true;
  }
  return false;
};

// Lấy danh sách ----------------------------------------------------

const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  // console.log(params.value);
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
          const errMsg = "Không thể xoá cấp tổ chức này vì đã được sử dụng.";
          notification("error", errMsg);
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

function convertData() {
  return { data: [dataEdit.value] };
}

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
