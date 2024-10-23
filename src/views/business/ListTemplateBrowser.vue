<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH SÁCH MẪU PHÊ DUYỆT</h5>
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
            :rowsPerPageOptions="[5, 10, 20]"
            :value="dataTable.data"
            :first="(dataTable.Page - 1) * dataTable.Size"
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
              field="WtmName"
              header="Tên mẫu phê duyệt"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">WtmName</span>
                {{ slotProps.data.WtmName }}
              </template>
            </Column>
            <Column
              field="WtmDesc"
              header="Mô tả"
              headerStyle="width:25%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">WtmDesc</span>
                {{ slotProps.data.WtmDesc }}
              </template>
            </Column>
            <Column
              field="IsActive"
              header="Trạng thái"
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
    :style="{ width: '60vw' }"
    v-model:visible="dialogCrud"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <label>Tên mẫu phê duyệt</label>
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
        v-model="dataEdit.WtmName"
        :class="{ 'p-invalid': submitted && !dataEdit.WtmName }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.WtmName"
        >Không được bỏ trống mã hình thức.</small
      >
    </div>
    <div class="field">
      <label>Mô tả</label>
      <Textarea
        :required="true"
        autofocus
        aria-required="true"
        v-model="dataEdit.WtmDesc"
        :class="{ 'p-invalid': submitted && !dataEdit.WtmDesc }"
        @keydown.enter="saveData()"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.WtmDesc"
        >Không được bỏ trống tên hình thức.</small
      >
    </div>
    <TabPanel>
      <div class="border-bottom border-solid border-1 border-inherit">
        <div class="card pb-0" style="height: 400px; overflow-y: auto">
          <div class="formgrid">
            <TabView>
              <TabPanel header="Người tạo">
                <div class="field">
                  <DataTable
                    showGridlines
                    :value="
                      dataEdit.WTM1
                        ? dataEdit.WTM1.filter((val) => val.Type !== 'D')
                        : dataEdit.WTM1
                    "
                    responsiveLayout="scroll"
                    dataKey="ID"
                  >
                    <Column field="UserName" header="Người phê duyệt">
                      <template #body="slotProps">
                        <span class="p-column-title">UserName</span>
                        {{ slotProps.data.UserName }}
                      </template>
                    </Column>
                    <Column field="OrsName" header="Đơn vị trực thuộc">
                      <template #body="slotProps">
                        <span class="p-column-title">OrsName</span>
                        {{ slotProps.data.OrsName }}
                      </template>
                    </Column>
                    <Column
                      headerStyle="min-width:8rem;"
                      header="Hành động"
                      :sortable="false"
                    >
                      <template #body="slotProps">
                        <Button
                          icon="pi pi-trash"
                          severity="p-button-rounded p-button-text"
                          @click="slotProps.data.Type = 'D'"
                        />
                      </template>
                    </Column>
                  </DataTable>
                  <div
                    class="p-title mt-5 mb-5"
                    @click="dialogAddUser = true"
                    style="cursor: pointer"
                  >
                    <i class="pi pi-plus-circle"></i> Thêm người phê duyệt
                  </div>
                </div></TabPanel
              >
              <TabPanel header="Chứng từ">
                <div class="grid">
                  <div class="col-4">
                    <div class="field-checkbox mb-0">
                      <Checkbox
                        :binary="true"
                        v-model="dataEdit.WTM2[0].Plan"
                        trueValue="Y"
                        falseValue="N"
                      />
                      <label> Kế hoạch mua sắm </label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="field-checkbox mb-0">
                      <Checkbox
                        v-model="dataEdit.WTM2[0].Request"
                        :binary="true"
                        trueValue="Y"
                        falseValue="N"
                      />
                      <label> Yêu cầu mua sắm </label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="field-checkbox mb-0">
                      <Checkbox
                        v-model="dataEdit.WTM2[0].Supplier"
                        :binary="true"
                        trueValue="Y"
                        falseValue="N"
                      />
                      <label> Đánh giá chấm điểm NCC</label>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Quy trình"
                ><div class="field">
                  <DataTable
                    showGridlines
                    :value="
                      dataEdit.WTM3
                        ? dataEdit.WTM3.filter((val) => val.Type !== 'D')
                        : dataEdit.WTM3
                    "
                    responsiveLayout="scroll"
                    dataKey="ID"
                  >
                    <Column field="WstName" header="Cấp phê duyệt">
                      <template #body="slotProps">
                        <div class="flex align-items-center">
                          <Button
                            icon="pi pi-arrow-circle-right text-yellow-500"
                            text
                            @click="getGrantApproval(slotProps.data.ID)"
                          />
                          <span>{{ slotProps.data.WstName }}</span>
                        </div>
                      </template>
                    </Column>
                    <Column field="WstDesc" header="Mô tả">
                      <template #body="slotProps">
                        <span class="p-column-title">WstDesc</span>
                        {{ slotProps.data.WstDesc }}
                      </template>
                    </Column>
                    <Column
                      headerStyle="min-width:8rem;"
                      header="Hành động"
                      :sortable="false"
                    >
                      <template #body="slotProps">
                        <Button
                          icon="pi pi-trash"
                          severity="p-button-rounded p-button-text"
                          @click="slotProps.data.Type = 'D'"
                        />
                      </template>
                    </Column>
                  </DataTable>
                  <div
                    class="p-title mt-5 mb-5"
                    @click="dialogAllApproval = true"
                    style="cursor: pointer"
                  >
                    <i class="pi pi-plus-circle"></i> Thêm cấp phê duyệt
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Điều kiện">
                <p>Khởi động Quy trình phê duyệt</p>
                <div class="col-4 flex align-items-center">
                  <RadioButton v-model="dataEdit.Conds" value="Y" />
                  <label for="ingredient1" class="ml-2">Luôn luôn</label>
                </div>
                <div class="col-4 flex align-items-center">
                  <RadioButton v-model="dataEdit.Conds" value="N" />
                  <label for="ingredient1" class="ml-2">Khi thỏa mãn điều kiện</label>
                </div>
                <DataTable
                  showGridlines
                  :value="[1]"
                  v-if="dataEdit.Conds && dataEdit.Conds == 'N'"
                >
                  <Column header="Quy định">
                    <template #body=""> Tổng giá trị chứng từ </template>
                  </Column>
                  <Column headerStyle="width:30%" header="Điều kiện">
                    <template #body="">
                      <Dropdown
                        :options="[
                          {
                            code: '=',
                            name: 'Bằng',
                          },

                          {
                            code: '>=',
                            name: 'Lớn hơn hoặc bằng',
                          },
                          {
                            code: '<=',
                            name: 'Nhỏ hơn hoặc bằng',
                          },
                          {
                            code: '#',
                            name: 'Trong khoảng',
                          },
                        ]"
                        optionValue="code"
                        optionLabel="name"
                        v-model="dataEdit.WTM4[0].Conds"
                      />
                    </template>
                  </Column>
                  <Column headerStyle="width:40%" header="Giá trị">
                    <template #body="">
                      <div class="grid justify-content-center">
                        <div class="col-6">
                          <InputNumber
                            placeholder="Từ"
                            v-model="dataEdit.WTM4[0].FromValue"
                          />
                        </div>
                        <div class="col-6" v-if="dataEdit.WTM4[0].Conds == '#'">
                          <InputNumber
                            placeholder="Đến"
                            v-model="dataEdit.WTM4[0].ToValue"
                          />
                        </div>
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </TabPanel>
            </TabView>
          </div>
        </div>
      </div>
    </TabPanel>

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
      <span v-if="dataEdit.WtmName"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.WtmName }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.WtmName"
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
            <InputText placeholder="Tìm Kiếm..." />
            <i class="pi pi-search" style="cursor: pointer" />
          </span>
        </div>
      </div>
      <div class="col-12">
        <Infinite
          ref="searchUser"
          @send-data-multi="ReceiveDataMultiUser"
          type="multi"
          :url="url_get_users"
          :dataHeader="[
            {
              title: 'Mã người dùng:',
              key: 'UserCode',
              type: 'String',
            },
            {
              title: 'Tên người dùng:',
              key: 'UserName',
              type: 'String',
            },
          ]"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Chọn" icon="pi pi-check" @click="callFunChilldren()" />
      <Button
        label="Đóng"
        icon="pi pi-times"
        class="p-button-text"
        @click="dialogAddUser = false"
      />
    </template>
  </Dialog>
  <!-- End -->
  <!-- Dialog cấp phê duyệt -->
  <Dialog
    v-model:visible="dialogAllApproval"
    :style="{ width: '650px' }"
    header="DANH SÁCH CẤP PHÊ DUYỆT"
    :modal="true"
    class="p-fluid"
  >
    <div class="grid">
      <div class="col-12">
        <div class="field">
          <span class="block mt-2 md:mt-0 p-input-icon-right">
            <InputText placeholder="Tìm Kiếm..." />
            <i class="pi pi-search" style="cursor: pointer" />
          </span>
        </div>
      </div>
      <div class="col-12">
        <Infinite
          ref="searchUser"
          @send-data-multi="ReceiveDataMultiApp"
          type="multi"
          :url="url_get_app"
          :dataHeader="[
            {
              title: 'Tên Cấp phê duyệt:',
              key: 'WstName',
              type: 'String',
            },
            {
              title: 'Mô tả Cấp phê duyệt:',
              key: 'WstDesc',
              type: 'String',
            },
          ]"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Chọn" icon="pi pi-check" @click="callFunChilldren()" />
      <Button
        label="Đóng"
        icon="pi pi-times"
        class="p-button-text"
        @click="dialogAllApproval = false"
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
import ERROR from "../../services/StatusCode.json";
import CRUD from "../../services/dataCRUD";
import Infinite from "./components/Infinite.vue";

// Api ---------------------------
const api_add = "owtm/create";
const api_update = "owtm/update";
const api_get = "owtm/getall";
const api_delete = "owtm/delete";
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
const header_update = ref("SỬA MẪU PHÊ DUYỆT");
const header_new = ref("THÊM MỚI MẪU PHÊ DUYỆT");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);
const dialogAddUser = ref(false);
const dialogAllApproval = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const url_get_users = "user/getall";
const url_get_app = "owst/getall";

const searchUser = ref(null);

const searchKey = ref('');
const onSearch = () => {
  params.value = {
    size: 10,
    page: 1,
    q: searchKey.value
  }
  getData();
}

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
  dataEdit.value = {
    WtmName: "",
    WtmDesc: "",
    IsActive: "A",
    Conds: "Y",
    WTM1: [],
    WTM2: [
      {
        Plan: "N",
        Request: "N",
        ReqSumary: "N",
        Supplier: "N",
        Type: "A",
      },
    ],
    WTM3: [],
    WTM4: [
      {
        Conds: "",
        FromValue: 0,
        ToValue: 0,
        Type: "A",
      },
    ],
  };
  dialogCrud.value = true;
};

const hideDialog = () => {
  dialogCrud.value = false;
  dataEdit.value = {};
};

const saveData = async () => {
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    const apiEndpoint = dataEdit.value.ID ? api_update : api_add;
    const apiFunction = dataEdit.value.ID ? API.update_v2 : API.add_new_v2;

    apiFunction(await convertData(), apiEndpoint)
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
  dataEdit.value = {
    WtmName: "",
    WtmDesc: "",
    IsActive: "A",
    Conds: "Y",
    WTM1: [],
    WTM2: [
      {
        Plan: "N",
        Request: "N",
        ReqSumary: "N",
        Supplier: "N",
        Type: "A",
      },
    ],
    WTM3: [],
    WTM4: [
      {
        Conds: "",
        FromValue: 0,
        ToValue: 0,
        Type: "A",
      },
    ],
  };
  dialogCrud.value = false;
  submitted.value = false;
  delete_dialog.value = false;
};

const editData = async (data) => {
  await getID(data.ID);
  dialogCrud.value = true;
  titleDialog.value = header_update.value;
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

const getError = () => {
  if (!dataEdit.value.WtmName) {
    return true;
  }
  return false;
};

const convertData = async () => {
  const arr = dataEdit.value.WTM3.filter((val) => {
    return val.Type != "D";
  });
  for (let index = 0; index < arr.length; index++) {
    arr[index].StepCode = index + 1;
    if (arr[index].Type == "A") {
      arr[index].ID = 0;
    } else {
      arr[index].Type = "U";
    }
  }
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

const ReceiveDataMultiUser = (value) => {
  for (let index = 0; index < value.length; index++) {
    value[index].Type = "A";
    value[index].UserID = value[index].ID;
  }

  if (!dataEdit.value.WTM1.length) dataEdit.value.WTM1 = value;
  else
    for (let index = 0; index < value.length; index++) {
      const t = dataEdit.value.WTM1.filter((val) => {
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
        dataEdit.value.WTM1.push(value[index]);
      }
    }
  dialogAddUser.value = false;
};

const ReceiveDataMultiApp = (value) => {
  for (let index = 0; index < value.length; index++) {
    value[index].Type = "A";
    value[index].WstID = value[index].ID;
    // value[index].StepCode = index;
  }
  if (!dataEdit.value.WTM3.length) dataEdit.value.WTM3 = value;
  else
    for (let index = 0; index < value.length; index++) {
      const t = dataEdit.value.WTM3.filter((val) => {
        if (val.WstID) {
          return val.WstID == value[index].ID && val.Type != "D";
        } else {
          return val.ID == value[index].ID && val.Type != "D";
        }
      });
      if (t.length) {
        notification("error", "Đã tồn tại cấp phê duyệt " + value[index].WstName);
        continue;
      } else {
        dataEdit.value.WTM3.push(value[index]);
      }
    }
  dialogAllApproval.value = false;
};

const callFunChilldren = () => {
  searchUser.value.sendDataMulti();
};

const getID = async (id) => {
  await API.get_all("owtm/getbyid?id=" + id).then((res) => {
    dataEdit.value = res.data;
    dataEdit.value.WTM2[0].Type = "U";
    dataEdit.value.WTM4[0].Type = "U";
  });
};
const getGrantApproval = () => {
  alert("Sắp ra mắt");
};
</script>
