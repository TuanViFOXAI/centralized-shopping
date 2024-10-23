<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          QUẢN LÝ TỔNG HỢP YÊU CẦU MUA SẮM
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
          <!-- @row-dblclick="openDetailWindown($event)" -->
          <DataTable
            showGridlines
            lazy
            :totalRecords="dataTable.TotalCount"
            :paginator="true"
            :rows="params.size"
            :value="dataTable.data"
            :first="(dataTable.Page - 1) * dataTable.Size"
            responsiveLayout="scroll"
            @page="onPageChange($event)"
            v-model:selection="selected_data"
            dataKey="ID"
            :rowsPerPageOptions="[5, 10, 20]"
            size="small"
          >
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
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    class="text-end px-3 py-2 font-medium"
                    @click="openNew()"
                  />
                </div>
              </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="OaprCode" header="Mã tổng hợp"> </Column>
            <Column field="OaprName" header="Tên tổng hợp"> </Column>
            <Column field="StartTime" header="Thời gian thực hiện">
              <template #body="slotProps">
                {{ format(slotProps.data.StartTime, "dd/MM/yyyy") }}
              </template>
            </Column>
            <Column field="Description" header="Mô tả"> </Column>
            <Column style="width: 7rem" header="Hành động" :sortable="false">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-info-circle"
                    text
                    style="padding: auto"
                    @click="editData(slotProps.data, 1)"
                  />
                  <Button
                    icon="pi pi-pencil"
                    text
                    style="padding: auto"
                    @click="editData(slotProps.data, 0)"
                  />
                </div>
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
    :style="{ width: '1050px' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <label>Tên tổng hợp mua sắm</label>
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
        v-model="dataEdit.OaprName"
        :class="{ 'p-invalid': submitted && !dataEdit.OaprName }"
      />
      <small class="p-error" v-if="submitted && !dataEdit.OaprName"
        >Không được bỏ trống tên tổng hợp.</small
      >
    </div>
    <div class="grid">
      <div class="field col-6">
        <label>Mã yêu cầu</label>
        <InputText v-model="dataEdit.OaprCode" disabled />
      </div>
      <div class="field col-6">
        <label>Người tạo</label>
        <InputText v-model="dataEdit.CreateBy1.UserName" disabled />
      </div>
    </div>
    <div>
      <label>Thời gian</label>
      <div class="grid mt-1">
        <div class="field col-6">
          <Calendar
            showIcon
            :modelValue="
              dataEdit.StartTime
                ? format(dataEdit.StartTime, 'dd/MM/yyyy')
                : dataEdit.StartTime
            "
            v-model="dataEdit.StartTime"
            placeholder="dd/mm/yyy"
            dateFormat="dd/mm/yy"
          />
        </div>
        <div class="field col-6">
          <Calendar
            showIcon
            :modelValue="
              dataEdit.EndTime ? format(dataEdit.EndTime, 'dd/MM/yyyy') : dataEdit.EndTime
            "
            v-model="dataEdit.EndTime"
            placeholder="dd/mm/yyy"
            dateFormat="dd/mm/yy"
          />
        </div>
      </div>
    </div>
    <div class="field">
      <label>Chọn yêu cầu mua sắm</label>
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
      <MultiSelect
        placeholder="Chọn yêu cầu mua sắm"
        display="chip"
        v-model="dataEdit.ListOsre"
        :options="dataEdit.OSRE"
        optionLabel="OsreName"
        optionValue="ID"
        @change="ChangeOsre()"
      />
    </div>
    <div class="flex flex-column field w-full">
      <label for="mota">Mô tả</label>
      <Textarea
        class="w-full"
        id="mota"
        rows="5"
        cols="30"
        v-model="dataEdit.Description"
      />
    </div>
    <div class="field" style="position: relative">
      <TabView>
        <TabPanel header="Danh mục vật tư hàng hoá cần mua sắm">
          <DataTable
            showGridlines
            v-model:expandedRows="expandedRows"
            :value="dataEdit.DataGroupItem"
            responsiveLayout="scroll"
            rows="10"
            @rowExpand="onRowExpand"
            @rowCollapse="onRowCollapse"
            tableStyle="min-width: 60rem"
          >
            <Column expander style="width: 1rem" />
            <Column header="Nhóm hàng hoá" field="NameGroup"> </Column>
            <Column header="Thành tiền" field="UnitPrice" style="text-align: right">
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.UnitPrice) }} VNĐ
              </template>
            </Column>
            <template #expansion="slotProps">
              <DataTable
                showGridlines
                :value="slotProps.data.chilldren"
                responsiveLayout="scroll"
                stripedRows
                size="small"
                rows="10"
              >
                <Column
                  header="Tên hàng hoá"
                  field="Oitm.ItemName"
                  headerStyle="min-width:12rem"
                >
                </Column>
                <Column header="Đơn vị tính" field="UomName"> </Column>
                <Column header="Số lượng" field="Quantity">
                  <template #body="slotProps">
                    {{ NumberFormat(slotProps.data.Quantity) }}
                  </template>
                </Column>
                <Column header="Thành tiền" style="text-align: right">
                  <template #body="slotProps">
                    {{ NumberFormat(slotProps.data.UnitPrice * slotProps.data.Quantity) }}
                    VNĐ
                  </template>
                </Column>
                <Column header="Ghi chú" field="Memo"> </Column>
                <!-- <Column header="Tệp đính kèm"> </Column> -->
                <Column field="Address" header="Địa chỉ giao hàng"> </Column>
              </DataTable>
            </template>
          </DataTable>
        </TabPanel>
        <TabPanel header="Chứng từ đi kèm"></TabPanel>
      </TabView>
    </div>
    <template #footer>
      <div v-if="!dataEdit.view">
        <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
        <Button
          :label="dataEdit.ID ? 'Cập nhật' : 'Thêm mới'"
          icon="pi pi-check"
          :loading="loadAction"
          @click="saveData()"
        />
      </div>
    </template>
  </Dialog>
  <!-- End hôp thoại CRUD -->
  <Dialog
    style="width: 90rem"
    v-model:visible="visibleInfo"
    header="CHI TIẾT TỔNG HỢP YÊU CẦU MUA SẮM"
    modal
  >
    <SpinLoading v-if="loadingInfo" height="10rem" />
    <template v-else>
      <div class="grid">
        <div class="md:col-6 col-12">
          <div class="flex flex-column gap-2">
            <label for="">Tên tổng hợp yêu cầu mua sắm:</label>
            <InputText readonly :value="dataInfo.OaprName" />
          </div>
        </div>
        <div class="md:col-3 col-6">
          <div class="flex flex-column gap-2">
            <label for="">Mã tổng hợp:</label>
            <InputText readonly :value="dataInfo.OaprCode" />
          </div>
        </div>
        <div class="md:col-3 col-6">
          <div class="flex flex-column gap-2">
            <label for="">Người tạo:</label>
            <InputText readonly :value="dataInfo.CreateBy1.UserName" />
          </div>
        </div>
        <div class="md:col-4 col-12">
          <div class="flex flex-column gap-2">
            <label for="">Thời gian:</label>
            <div class="flex gap-2">
              <InputText
                class="w-full"
                readonly
                :value="getTimeLabel(dataInfo.StartTime, 'date')"
              />
              <div class="m-auto">đến</div>
              <InputText
                class="w-full"
                readonly
                :value="getTimeLabel(dataInfo.EndTime, 'date')"
              />
            </div>
          </div>
        </div>
        <div class="md:col-8 col-12">
          <div class="flex flex-column gap-2">
            <label for="">Yêu cầu mua sắm:</label>
            <DropdownChips optionLabel="Osre.OsreName" :value="dataInfo.APR1" />
          </div>
        </div>
        <div class="col-12">
          <div class="flex flex-column gap-2">
            <label for="">Mô tả:</label>
            <Textarea :value="dataInfo.Description" class="w-full" autoResize readonly>
            </Textarea>
          </div>
        </div>
        <div class="col-12 mt-2">
          <TabView
            :pt="{
              root: {
                style: 'border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden;',
              },
            }"
          >
            <TabPanel
              header="Danh mục vật tư, hàng hoá"
              :pt="{
                root: {
                  style: 'border-right: 1px solid #d1d5db;',
                },
              }"
            >
              <DataTable :value="[{}]">
                <Column header="Nhóm hàng hoá" />
                <Column header="Thành tiền" style="width: 20rem" />
              </DataTable>
            </TabPanel>
            <TabPanel
              header="Chứng từ đi kèm"
              :pt="{
                root: {
                  style: 'border-right: 1px solid #d1d5db;',
                },
              }"
            ></TabPanel>
          </TabView>
        </div>
      </div>
      <!-- {{ dataInfo }} -->
    </template>
  </Dialog>
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
import { onBeforeMount, ref, watchEffect } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import { format } from "date-fns";
import DropdownChips from "./components/DropdownChips.vue";

// Api ---------------------------
const api_add = "oapr/create";
const api_update = "oapr/update";
const api_get = "oapr/getall";
const api_delete = "oapr/delete";
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
const header_update = ref("SỬA TỔNG HỢP YÊU CẦU MUA SẮM");
const header_new = ref("THÊM MỚI TỔNG HỢP YÊU CẦU MUA SẮM");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const UserNameCreate = ref(JSON.parse(localStorage.getItem("user"))["UserName"]);
const DataGroupItem = ref([]);
const expandedRows = ref([]);

onBeforeMount(async () => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
});

watchEffect(async () => {
  if (dataEdit.value.StartTime && dataEdit.value.EndTime) await getOSRE();
});

const getGroupItem = async (id) => {
  await API.get_all("osre/getbyid?id=" + id).then((res) => {
    for (let i = 0; i < res.data.SRE2.length; i++) {
      const item = res.data.SRE2[i];
      if (dataEdit.value.DataGroupItem == undefined) {
        dataEdit.value.DataGroupItem = [
          {
            NameGroup: item.Oitm.ItmsGrpName,
            SreID: item.ID,
            GroupItemID: item.Oitm.ItmsGrpCod,
            UnitPrice: item.UnitPrice * item.Quantity,
            chilldren: [
              {
                Oitm: item.Oitm,
                Quantity: item.Quantity,
                UomName: item.UomName,
                OsreName: res.data.OsreName,
                UnitPrice: item.UnitPrice,
                Memo: item.Memo,
                Address: item.Address,
              },
            ],
          },
        ];
      } else {
        const data = dataEdit.value.DataGroupItem.filter((val) => {
          return val.NameGroup == item.Oitm.ItmsGrpName;
        });
        if (data.length) {
          data[0].SreID = item.ID;
          data[0].GroupItemID = item.Oitm.ItmsGrpCod;
          data[0].UnitPrice += item.UnitPrice * item.Quantity;
          data[0].chilldren.push({
            Oitm: item.Oitm,
            Quantity: item.Quantity,
            UomName: item.UomName,
            OsreName: res.data.OsreName,
            UnitPrice: item.UnitPrice,
            Memo: item.Memo,
            Address: item.Address,
          });
        } else {
          dataEdit.value.DataGroupItem.push({
            NameGroup: item.Oitm.ItmsGrpName,
            SreID: item.ID,
            GroupItemID: item.Oitm.ItmsGrpCod,
            UnitPrice: item.UnitPrice * item.Quantity,
            chilldren: [
              {
                Oitm: item.Oitm,
                Quantity: item.Quantity,
                UomName: item.UomName,
                OsreName: res.data.OsreName,
                UnitPrice: item.UnitPrice,
                Memo: item.Memo,
                Address: item.Address,
              },
            ],
          });
        }
      }
    }

    // console.log(dataEdit.value.DataGroupItem);
  });
};
// Lấy danh sách ----------------------------------------------------
const getOSRE = async () => {
  await API.get_all(
    "osre/getall?page=0&size=0&from_date=" +
      new Date(dataEdit.value.StartTime).toISOString() +
      "&to_date=" +
      new Date(dataEdit.value.EndTime).toISOString() +
      "&approval=A"
  ).then((res) => {
    dataEdit.value.OSRE = res.data.data;
  });
};

const searchKey = ref('');
const onSearch = () => {
  params.value = {
    page: 1,
    size: 10,
    q: searchKey.value,
  }
  getData();
}

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

const ChangeOsre = async () => {
  dataEdit.value.DataGroupItem = [];
  if (!dataEdit.value.ListOsre.length) dataEdit.value.DataGroupItem = [];
  for (let index = 0; index < dataEdit.value.ListOsre.length; index++) {
    await getGroupItem(dataEdit.value.ListOsre[index]);
  }
};

const openNew = () => {
  titleDialog.value = header_new.value;
  // Random string
  const length = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  dataEdit.value = {
    ID: null,
    OaprCode: result,
    OaprName: null,
    OorsID: null,
    StartTime: null,
    EndTime: null,
    Description: null,
    APR1: [],
    CreateBy1: {
      UserName: UserNameCreate,
    },
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
  dataEdit.value = {};
  dialogCrud.value = false;
  submitted.value = false;
  dataEdit.value.DataGroupItem = [];
};

const editData = async (data, t) => {
  await getById(data.ID);
  await getOSRE();
  dialogCrud.value = true;
  titleDialog.value = header_update.value;
  dataEdit.value.view = false;
  if (t == 1) {
    titleDialog.value = "Xem tổng hợp yêu cầu mua sắm";
    dataEdit.value.view = true;
  }
};

const getById = async (id) => {
  await API.get_all("oapr/getbyid?id=" + id).then((res) => {
    dataEdit.value = res.data;
    dataEdit.value.DataGroupItem = [];
    for (let index = 0; index < dataEdit.value.APR1.length; index++) {
      getGroupItem(dataEdit.value.APR1[index].OsreID);
      if (dataEdit.value.ListOsre != undefined) {
        dataEdit.value.ListOsre.push(dataEdit.value.APR1[index].OsreID);
      } else {
        dataEdit.value.ListOsre = [dataEdit.value.APR1[index].OsreID];
      }
    }
  });
};

const getError = () => {
  if (!dataEdit.value.OaprName || !dataEdit.value.OaprCode) {
    return true;
  }

  if (dataEdit.value.StartTime && dataEdit.value.EndTime) {
    if (dataEdit.value.StartTime > dataEdit.value.EndTime) {
      notification(
        "error",
        "Vui lòng chọn lại thời gian từ ngày nhỏ hơn thời gian đến ngày"
      );
      return true;
    }
  }

  if (!dataEdit.value.StartTime || !dataEdit.value.EndTime) {
    notification("error", "Vui lòng chọn lại thời gian ");
    return true;
  }

  if (!dataEdit.value.ListOsre) {
    notification("error", "Vui lòng chọn lại yêu cầu mua sắm");
    return true;
  }

  return false;
};

const convertData = async () => {
  if (dataEdit.value.ListOsre != undefined) {
    for (let i = 0; i < dataEdit.value.ListOsre.length; i++) {
      const ID = dataEdit.value.ListOsre[i];
      if (
        !dataEdit.value.APR1.filter((val) => {
          return val.OsreID == ID;
        }).length
      ) {
        dataEdit.value.APR1.push({
          OsreID: ID,
          Type: "A",
        });
      } else {
        dataEdit.value.APR1.filter((val) => {
          return val.OsreID == ID;
        })[0].Type = "U";
      }
    }
  }
  const arrDel = dataEdit.value.APR1.filter((val) => {
    return val.Type == "";
  });

  for (let index = 0; index < arrDel.length; index++) {
    arrDel[index].Type = "D";
  }

  const dataSend = {
    ID: dataEdit.value.ID,
    OaprCode: dataEdit.value.OaprCode,
    OaprName: dataEdit.value.OaprName,
    StartTime: dataEdit.value.StartTime,
    EndTime: dataEdit.value.EndTime,
    Description: dataEdit.value.Description,
    APR1: dataEdit.value.APR1,
  };
  return dataSend;
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

const NumberFormat = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

const openDetailWindown = (event) => {
  editData(event.data, 1);
};

const visibleInfo = ref(false);

const dataInfo = ref();
const loadingInfo = ref(false);

const openDetailWindows = async (id) => {
  dataInfo.value = null;
  visibleInfo.value = true;
  try {
    loadingInfo.value = true;
    const res = await API.getAsync("oapr/getbyid", { id: id });
    dataInfo.value = res.data;
    dataInfo.value.dataTable = formatDataTable(res.data.APR1);
    loadingInfo.value = false;
  } catch (e) {
    visibleInfo.value = false;
    console.error(e);
  }
};

const formatDataTable = (data) => {
  const result = [];
  for (const item of data) {
    result.push({
      id: item["ID"],
      code: item["Osre"]["OsreCode"],
      name: item["Osre"]["OsreName"],
      items: item["Osre"]["SRE2"].map((x) => ({
        id: x["OitmID"],
        name: x["Oitm"]["ItemName"],
        delivery_to: x["Address"],
        price: x["UnitPrice"],
        quantity: x["Quantity"],
        unit: x["UomName2"],
        desc: x["Memo"],
        group: {
          id: x["Oitm"]["ItmsGrpCod"],
          name: x["Oitm"]["ItmsGrpName"],
        },
      })),
    });
  }
  console.log(result);
  return result;
};

function getTimeLabel(date, format = "datetime") {
  let options = null;
  switch (format) {
    case "date":
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      break;
    default:
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      break;
  }
  if (date) {
    const _date = new Date(date);
    return new Intl.DateTimeFormat("vi-GB", options).format(_date);
  } else {
    return null;
  }
}
</script>
