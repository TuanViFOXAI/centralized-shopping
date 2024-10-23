<template>
  <div class="">
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">NHÓM ĐƠN VỊ TÍNH</h5>
      </div>
    </div>
  </div>
  <!-- End Header -->
  <div class="grid">
    <div class="col-12">
      <div class="card p-0">
        <Toast />
        <div class="panel-content">
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
            <Column selectionMode="multiple" headerStyle="min-width:3rem"></Column>
            <Column
              field="UgpCode"
              header="Mã nhóm đơn vị tính"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
            </Column>

            <Column
              field="UgpName"
              header="Tên nhóm đơn vị tính"
              :sortable="true"
              headerStyle="width:25%; min-width:10rem;"
            >
            </Column>

            <Column
              field="IsActive"
              header="Trạng thái"
              :sortable="true"
              headerStyle="width:25%; min-width:8rem;text-al"
            >
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt động" : "Không hoạt động" }}
              </template>
            </Column>
            <Column
              headerStyle=" width:25%; min-width:10rem; "
              header="Hành động"
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

        <Dialog
          :breakpoints="{ '960px': '75vw' }"
          v-model:visible="dialogCrud"
          :style="{ width: '60vw' }"
          :header="titleDialog"
          :modal="true"
          class="p-fluid"
          maximizable
        >
          <div class="border-bottom border-solid border-1 border-inherit">
            <div class="card">
              <div class="grid formgrid align-items-center">
                <div class="col-12 mb-2 lg:col-4 lg:mb-0 m-0 p-0">
                  <label>Mã nhóm đơn vị tính</label>
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
                  <div class="formgrid">
                    <InputText
                      v-model.trim="dataEdit.UgpCode"
                      :required="true"
                      autofocus
                      aria-required="true"
                      :class="{ 'p-invalid': submitted && !dataEdit.UgpCode }"
                    />
                    <small class="p-error" v-if="submitted && !dataEdit.UgpCode"
                      >Không bỏ trống mã đơn vị tính.</small
                    >
                  </div>
                </div>
                <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                  <label>Tên nhóm đơn vị tính</label>
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
                  <div class="formgrid">
                    <InputText
                      v-model.trim="dataEdit.UgpName"
                      :required="true"
                      autofocus
                      aria-required="true"
                      :class="{ 'p-invalid': submitted && !dataEdit.UgpName }"
                    />
                    <small class="p-error" v-if="submitted && !dataEdit.UgpName"
                      >Không bỏ tên nhóm đơn vị tính.</small
                    >
                  </div>
                </div>

                <div class="col-12 mb-2 lg:col-4 lg:mb-0 m-0 p-0">
                  <label>Đơn vị tính cơ sở</label>
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
                  <div class="flex">
                    <Dropdown
                      class="w-full"
                      placeholder="Lựa chọn đơn vị cơ sở"
                      :options="
                        data_unit.filter((val) => {
                          if (dataEdit.data != undefined) {
                            return checkDvt(dataEdit.data[0].UomEntry, val);
                          } else {
                            return checkDvt(0, val);
                          }
                        })
                      "
                      optionLabel="UomName"
                      optionValue="ID"
                      v-model="dataEdit.BaseUom"
                      @change="select_unit_base"
                    />
                    <!-- {{ item.base_uom.id }} -->
                    <Button
                      style="
                        border-top-right-radius: 6px;
                        border-bottom-right-radius: 6px;
                        border-top-left-radius: unset;
                        border-bottom-left-radius: unset;
                      "
                      icon="pi pi-plus"
                      aria-label="Submit"
                      @click="tab_blank"
                    />
                  </div>
                  <small class="p-invalid" v-if="submitted && !dataEdit.BaseUom"
                    >Lựa chọn đơn vị cơ sở</small
                  >
                </div>
                <div class="bg-gray-200 formgrid grid text-center mt-3 col-12 m-0 p-0">
                  <div class="field col-2 mt-3 m-0 p-0">
                    <h6>Số lượng quy đổi</h6>
                  </div>
                  <div
                    class="field col-4 mt-3 m-0 p-0"
                    style="display: flex; align-items: center; justify-content: center"
                  >
                    <h6
                      style="display: flex; align-items: center; justify-content: center"
                    >
                      Chọn đơn vị quy đổi
                    </h6>
                  </div>

                  <div class="field col-2 mt-3 m-0 p-0">
                    <h6>Số lượng quy đổi</h6>
                  </div>
                  <div class="field col-2 mt-3 m-0 p-0">
                    <h6>Đơn vị tính cơ sở</h6>
                  </div>
                  <div class="field col-2 mt-3 m-0 p-0">
                    <h6>Hành động</h6>
                  </div>
                </div>
                <div
                  v-for="(i, idx) in dataEdit.data"
                  :key="idx"
                  class="w-full"
                  style="width: 100%"
                >
                  <div
                    class="grid mt-3 align-items-center justify-content-center"
                    v-if="i.Type != 'D'"
                  >
                    <div class="col-12 mb-2 lg:col-2 lg:mb-0">
                      <InputNumber
                        v-model="i.BaseQty"
                        :useGrouping="false"
                        autofocus
                        :required="true"
                        :class="{ 'p-invalid': submitted && !i.BaseQty }"
                        :disabled="!idx"
                      />
                    </div>
                    <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                      <Dropdown
                        placeholder="Đơn vị quy đổi"
                        v-model="i.UomEntry"
                        optionValue="ID"
                        :options="
                          data_unit.filter((val) => {
                            return checkDvt(i.UomEntry, val);
                          })
                        "
                        optionLabel="UomName"
                        :disabled="!idx"
                      />
                    </div>
                    <div class="col-12 mb-2 lg:col-2 lg:mb-0">
                      <InputNumber
                        v-model="i.AltQty"
                        autofocus
                        :useGrouping="false"
                        :required="true"
                        :class="{ 'p-invalid': submitted && !i.AltQty }"
                        :disabled="!idx"
                      />
                    </div>
                    <div class="col-12 mb-2 lg:col-2 lg:mb-0">
                      <InputText
                        placeholder="Đơn vị tính cơ sở"
                        v-model="
                          data_unit.filter((val) => {
                            return val.ID == dataEdit.BaseUom;
                          })[0].UomName
                        "
                        autofocus
                        disabled
                        :useGrouping="false"
                      />
                    </div>
                    <div
                      class="col-12 mb-2 lg:col-1 lg:mb-0"
                      style="display: flex; align-items: center; justify-content: center"
                    >
                      <InputSwitch
                        v-model="i.IsActive"
                        :disabled="!idx"
                        trueValue="A"
                        falseValue="I"
                      />
                    </div>
                    <div
                      class="col-12 mb-2 lg:col-1 lg:mb-0"
                      style="display: flex; align-items: center"
                    >
                      <Button
                        @click="removeItem(i)"
                        :disabled="!idx"
                        icon="pi pi-trash"
                        severity="p-button-rounded  p-button-text"
                      />
                    </div>
                  </div>
                </div>
                <div class="field col-12 mt-3 m-0 p-0">
                  <div class="field-radiobutton mb-0" v-if="dataEdit.BaseUom">
                    <Button
                      @click="Adddata"
                      icon="pi pi-plus"
                      severity="success"
                      rounded
                      outlined
                      style="width: 23px; height: 12px"
                    />
                    <Label>Thêm đơn vị quy đổi mới</Label>
                  </div>
                </div>
                <div class="field col-12 mt-3 m-0 p-0"></div>
                <div class="formgrid col-12 m-0 p-0">
                  <div class="field">
                    <label>Trạng thái</label>
                    <div class="#">
                      <InputSwitch
                        v-model="dataEdit.IsActive"
                        trueValue="A"
                        falseValue="I"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- Trạng Thái -->
            </div>
          </div>
          <template #footer>
            <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
            <Button
              label="Lưu"
              icon="pi pi-check"
              :loading="loading"
              @click="saveData()"
            />
          </template>
        </Dialog>
        <!-- delete_data_dialog -->
        <Dialog
          v-model:visible="delete_dialog"
          :style="{ width: '450px' }"
          header="Xác nhận xóa"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="dataEdit.UgpName"
              >Bạn chắc chắn muốn xóa <b>{{ dataEdit.UgpName }}</b
              >?</span
            >
            <span v-if="selected_data && !dataEdit.UgpName"
              >Bạn chắc chắn muốn xóa <b>{{ selected_data.length }}</b> bản ghi này
              không?</span
            >
          </div>
          <template #footer>
            <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDelete()" />
            <Button
              label="Xoá"
              icon="pi pi-check"
              :loading="loading"
              @click="deleteData()"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
</template>

<style scoped lang="scss"></style>

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
  align-items: center;
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
</style>

<script setup>
import { onBeforeMount, ref } from "vue";
import API from "../../apis/api";
import i18n from "../../locale/i18n";
import ERROR from "../../services/StatusCode.json";

const api_add = "ougp/create";
const api_update = "ougp/update";
const api_get = "ougp/getall";
const api_delete = "ougp/delete";
// Search
const searchKey = ref('');
const onSearch = () => {
  params.value.page = 1;
  params.value.size = 10;
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
const header_update = ref("SỬA NHÓM ĐƠN VỊ TÍNH");
const header_new = ref("THÊM MỚI NHÓM ĐƠN VỊ TÍNH");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const data_unit = ref({});

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
  getUnit();
});

const getUnit = () => {
  API.get_all("ouom/getall?page=0&size=0").then(
    (response) => {
      if (response.data.data) {
        data_unit.value = response.data.data;
        data_unit.value = data_unit.value.filter((val) => val.IsActive === "A");
      }
    },
    (error) => {
      notification("error", error);
    }
  );
};

const select_unit_base = () => {
  if (dataEdit.value.data == undefined) {
    dataEdit.value.data = [
      {
        BaseQty: 1,
        UomEntry: dataEdit.value.BaseUom,
        AltQty: 1,
        IsActive: "A",
        Type: "A",
      },
    ];
  } else {
    dataEdit.value.data[0].UomEntry = dataEdit.value.BaseUom;
  }
};

const checkDvt = (id, data) => {
  if (dataEdit.value.data == undefined) return true;
  if (id == data.ID) return true;
  if (
    dataEdit.value.data.filter((t) => {
      return t.UomEntry == data.ID && t.Type != "D";
    }).length
  ) {
    return false;
  } else {
    return true;
  }
};

const Adddata = () => {
  if (dataEdit.value.BaseUom != undefined)
    if (dataEdit.value.data == undefined) {
      dataEdit.value.data = [
        {
          BaseQty: null,
          UomEntry: null,
          AltQty: null,
          IsActive: "A",
          Type: "A",
        },
      ];
    } else {
      dataEdit.value.data.push({
        BaseQty: null,
        UomEntry: null,
        AltQty: null,
        IsActive: "A",
        Type: "A",
      });
    }
};

const removeItem = (i) => {
  i.Type = "D";
  console.log(dataEdit.value.data);
};

const getError = () => {
  if (!dataEdit.value.UgpName || !dataEdit.value.UgpCode || !dataEdit.value.BaseUom) {
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
  dataEdit.value = { ...data };

  API.get_all("ougp/getbyid?id=" + data.ID).then((response) => {
    dataEdit.value.data = response.data.data;
    for (let index = 0; index < dataEdit.value.data.length; index++) {
      dataEdit.value.data[index].Type = "U";
    }
  });
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
          notification("error", response.data.Errors);
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
</script>
