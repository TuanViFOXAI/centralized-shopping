<template>
  <div class="card">
    <!-- <Button label="Exprot Excel" @click="renderExcel" /> -->
    <div class="grid align-items-center justify-content-between">
      <div class="col-6 flex align-items-center">
        <i
          class="pi pi-arrow-left p-title font-semibold cursor-pointer"
          @click="hide()"
        ></i>
        <h4 class="m-0 p-title m-2 p-2 mb-0 mt-0 font-semibold uppercase">
          BÁO CÁO {{ props.data_1.name }}
        </h4>
      </div>
      <div class="col-6">
        <div class="flex justify-content-end">
          <Button text label="Xuất excel" @click="exportCSV($event)" />
          <Button text label="In báo cáo" />
          <Button outlined label="Chọn tham số" @click="dialog = true" />
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="card mt-5 col-12">
        <div class="text-center mt-5">
          <h5 class="font-semibold uppercase">BÁO CÁO {{ props.data_1.name }}</h5>
          <p>
            Đơn vị đề xuất:{{ NameOors }} <br />Thời gian:
            {{ dataEdit.from_date ? format(dataEdit.from_date, "dd/MM/yyyy") : "-" }} -
            {{ dataEdit.to_date ? format(dataEdit.to_date, "dd/MM/yyyy") : "-" }}
          </p>
        </div>
        <div class="mt-5 p-3">
          <div v-if="data.length && dataEdit.typeReport == 'S'">
            <DataTable :value="data" showGridlines ref="dt">
              <Column
                v-for="(col, index) in dynamicColumns"
                :key="index"
                :header="col.header"
                headerStyle="min-width:11rem;"
                style="text-align: end"
              >
                <template #body="slotProps">
                  {{ slotProps.data[col.field] || 0 }}
                </template>
              </Column>
            </DataTable>
          </div>
          <div v-if="data.length && dataEdit.typeReport == 'D'">
            <DataTable
              ref="dt"
              :value="data"
              tableStyle="min-width: 50rem"
              showGridlines
              paginator
              :rows="10"
            >
              <Column
                field="plan_code"
                header="Mã kế hoạch"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="plan_name"
                header="Tên kế hoạch"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="ors_name"
                header="Đơn vị đề xuất"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="status"
                header="Trạng thái"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="item_code"
                header="Mã hàng hóa"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="item_name"
                header="Tên hàng hóa"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="uom"
                header="Đơn vị tính"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="quantity"
                header="Số lượng kế hoạch"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="qtyOrder"
                header="Số lượng đã mua"
                headerStyle="min-width:10rem"
              ></Column>
              <Column
                field="qtyReceipt"
                header="Số lượng đã nhận"
                headerStyle="min-width:10rem"
              ></Column>
              <Column header="Số lượng chưa nhận" headerStyle="min-width:10rem">
                <template #body="slotProps">{{
                  slotProps.data.qtyOrder - slotProps.data.qtyReceipt
                }}</template></Column
              >
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="dialog"
    header="CHỌN THAM SỐ"
    modal
    :style="{ width: '50rem' }"
    class="p-fluid"
  >
    <div class="card">
      <div class="grid">
        <div class="col-4">
          <div class="field">
            <label>Chọn loại thời gian</label>
            <Dropdown
              placeholder="Chọn thời gian"
              :options="templateTime"
              optionValue="code"
              optionLabel="name"
              v-model="dataEdit.type"
              :class="{
                'p-invalid': submitted && !dataEdit.type && dataEdit.typeReport == 'S',
              }"
            />
            <small
              class="p-invalid"
              v-if="submitted && !dataEdit.type && dataEdit.typeReport == 'S'"
              >Không được bỏ trống thời gian.</small
            >
          </div>
        </div>
        <div class="col-4">
          <div class="field">
            <label>Từ ngày</label>
            <Calendar
              placeholder="Từ ngày"
              v-model="dataEdit.from_date"
              :class="{ 'p-invalid': submitted && !dataEdit.from_date }"
              dateFormat="dd/mm/yy"
            />
            <small class="p-invalid" v-if="submitted && !dataEdit.from_date"
              >Không được bỏ trống thời gian.</small
            >
          </div>
        </div>
        <div class="col-4">
          <div class="field">
            <label>Đến ngày</label>
            <Calendar
              placeholder="Đến ngày"
              dateFormat="dd/mm/yy"
              v-model="dataEdit.to_date"
              :class="{ 'p-invalid': submitted && !dataEdit.to_date }"
            />
            <small class="p-invalid" v-if="submitted && !dataEdit.from_date"
              >Không được bỏ trống thời gian.</small
            >
          </div>
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex align-items-center">
          <RadioButton
            v-model="dataEdit.typeReport"
            inputId="ingredient1"
            value="S"
            :class="{ 'p-invalid': submitted && !dataEdit.typeReport }"
          />
          <label for="ingredient1" class="ml-2">Tổng hợp</label>
        </div>
        <div class="flex align-items-center">
          <RadioButton
            v-model="dataEdit.typeReport"
            inputId="ingredient2"
            value="D"
            :class="{ 'p-invalid': submitted && !dataEdit.typeReport }"
          />
          <label for="ingredient2" class="ml-2">Chi tiết</label>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="dialog = false" />
      <Button label="Xác nhận" icon="pi pi-check" @click="getData()" />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
</template>
<script setup>
import { onBeforeMount, ref, watchEffect, computed } from "vue";
import API from "../../../apis/api";
import { useToast } from "primevue/usetoast";
import { format } from "date-fns";
import ExcelJS from "exceljs";

const dialog = ref(true);
const dt = ref();
const dataEdit = ref({ typeReport: "S" });
const submitted = ref(false);
const toast = useToast();
const NameOors = JSON.parse(localStorage.getItem("user"))["OrsName"];
const IdOors = JSON.parse(localStorage.getItem("user"))["OrsId"];

const emit = defineEmits(["close"]);
const props = defineProps({
  data_1: {
    type: Object,
    default: null,
  },
});
const templateTime = ref([
  { code: "W", name: "Tuần" },
  { code: "M", name: "Tháng" },
  { code: "Q", name: "Quý" },
  { code: "Y", name: "Năm" },
]);
const data = ref([]);
const dynamicColumns = ref([]);
onBeforeMount(() => {
  // getData();
});
const exportCSV = () => {
  dt.value.exportCSV();
};
const hide = () => {
  emit("close", true);
};
const getData = () => {
  dynamicColumns.value = [];
  submitted.value = true;
  if (!dataEdit.value.from_date) return;
  if (!dataEdit.value.to_date) return;
  if (!dataEdit.value.type && dataEdit.value.typeReport == "S") return;

  var from_date =
    new Date(dataEdit.value.from_date).getFullYear() +
    "-" +
    ("0" + (new Date(dataEdit.value.from_date).getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + new Date(dataEdit.value.from_date).getDate()).slice(-2);
  var to_date =
    new Date(dataEdit.value.to_date).getFullYear() +
    "-" +
    ("0" + (new Date(dataEdit.value.to_date).getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + new Date(dataEdit.value.to_date).getDate()).slice(-2);

  const url_s =
    "report/ospl?type=" +
    dataEdit.value.type +
    "&oors_id=" +
    IdOors +
    "&from_date=" +
    from_date +
    "&to_date=" +
    to_date +
    "&typeReport=" +
    dataEdit.value.typeReport;
  const url_d = "report/ospl/detail?from_date=" + from_date + "&to_date=" + to_date;

  const ENdpoirt = dataEdit.value.typeReport == "D" ? url_d : url_s;
  API.get_all(ENdpoirt)
    .then((res) => {
      if (res.data) {
        submitted.value = false;
        dialog.value = false;
        if (dataEdit.value.typeReport == "S") {
          for (let key in res.data[0]) {
            dynamicColumns.value.push({
              field: key,
              header: key == "status" ? "Trạng thái" : key,
            });
          }
          var lastObject = dynamicColumns.value.pop();
          dynamicColumns.value.unshift(lastObject);
        }
        data.value = res.data;
      }
    })
    .catch((error) => {
      submitted.value = false;
      notification("error", error);
    });
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
const renderExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");
  worksheet.mergeCells("A1:C1");
  worksheet.getRow(1).getCell(1).value = "BÁO CÁO TIẾN ĐỘ THỰC HIỆN KẾ HOẠCH MUA SẮM";
  worksheet.getRow(2).getCell(1).value =
    "Đơn vị đề xuất:Công ty Cổ phần Tập đoàn Xuân Thiện";

  const headerStyle = {
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };
  // headerRow.getCell(2).style = headerStyle;
  // headerRow.getCell(3).style = headerStyle;
  // Add data to the worksheet
  worksheet.addRow(["Name", "Age", "Country"]);
  worksheet.addRow(["John", 30, "USA"]);
  worksheet.addRow(["Alice", 25, "Canada"]);
  worksheet.addRow(["Bob", 35, "UK"]);

  const dataRows = worksheet.getRows(2, 4);
  dataRows.forEach((row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.style = headerStyle;
    });
  });

  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob from the buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a download link and trigger click event
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "example.xlsx";
  document.body.appendChild(a);
  a.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
</script>
