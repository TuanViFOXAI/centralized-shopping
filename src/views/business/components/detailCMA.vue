<template>
  <div ref="DetailCMA">
    <div class="flex justify-content-between m-3 mt-3">
      <div class="flex align-items-center mt-0">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">XEM THÔNG TIN GÓI THẦU</h5>
      </div>
      <div class="flex align-items-center mt-0">
        <Button label="Đóng" outlined @click="hide()"></Button>
      </div>
    </div>
    <div>
      <div class="card p-0 pt-5 pl-2 pr-2">
        <div class="grid">
          <div class="col-4" v-for="(i, index) in stepData" :key="index">
            <div class="flex">
              <div
                :class="[
                  i.classbox,
                  'right-1 relative border-round-left flex align-items-center',
                ]"
              >
                <div class="ml-5 mt-1">
                  <h6 class="m-0 text-white">{{ i.status }}</h6>
                  <p class="m-0 text-white">{{ i.time }}</p>
                </div>
                <div class="arrow-left absolute" v-if="index != 0"></div>
              </div>
              <div :class="['arrow-right', i.classarrow]" v-if="index != 2"></div>
            </div>
          </div>
        </div>
        <div class="grid mt-5">
          <div class="col-3">
            <div class="card border-round">
              <div class="grid mb-3">
                <div class="col-4">Trạng thái:</div>
                <div class="col-8">
                  <strong>{{ getStatusLabel(dataEdit.Status) }}</strong>
                </div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Bắt đầu:</div>
                <div class="col-8">
                  <strong class="p-title">{{
                    dataEdit.StartTime ? convertToCustomFormat(dataEdit.StartTime) : ""
                  }}</strong>
                </div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Kết thúc:</div>
                <div class="col-8">
                  <strong class="p-title">{{
                    dataEdit.EndTime ? convertToCustomFormat(dataEdit.EndTime) : ""
                  }}</strong>
                </div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Còn lại:</div>
                <div class="col-8">
                  <strong class="p-title">{{ countdownstring }}</strong>
                </div>
              </div>
              <hr />
              <Button
                label="Huỷ thầu"
                class="w-full"
                v-if="dataEdit.Status == 'P' && dataEdit.Status != 'P'"
                @click="Cancel()"
                severity="danger"
              />
              <router-link :to="`/scoring-list/mark/${dataEdit.ID}`">
                <Button
                  label="Chấm điểm"
                  class="w-full"
                  v-if="dataEdit.Status == 'I'"
                  severity="primary"
                />
              </router-link>
              <router-link :to="`/scoring-list/${dataEdit.ID}?tab=1`">
                <Button
                  label="Kết quả"
                  class="w-full"
                  v-if="dataEdit.Status == 'A'"
                  severity="primary"
                />
              </router-link>
            </div>
          </div>
          <div class="col-9">
            <div class="card border-round">
              <h5 class="p-title font-semibold">{{ dataEdit.CmaName }}</h5>
              <div class="card p-3 surface-200">
                <p class="m-0"><strong>Thông tin mời thầu</strong></p>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Mã gói thầu:</div>
                <div class="col-8">{{ dataEdit.CmaCode }}</div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Ngân sách dự kiến:</div>
                <div class="col-8">{{ NumberFormat(getTotal) }} VNĐ</div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Hình thức:</div>
                <div class="col-8">
                  {{
                    dataEdit.CmaType == "C"
                      ? "Chào hàng cạnh tranh"
                      : "Chỉ định nhà cung cấp"
                  }}
                </div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Phương pháp chấm điểm:</div>
                <div class="col-8">Xếp hạng giá dự thầu</div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Lĩnh vực:</div>
                <div class="col-8">Nông nghiệp</div>
              </div>
              <div class="mt-5 card">
                <h6>Danh mục hàng hóa</h6>
                <DataTable
                  showGridlines
                  :value="dataEdit.Items"
                  v-model:expandedRows="expandedRows"
                  stripedRows
                  size="small"
                >
                  <Column expander style="width: 1rem" />
                  <Column header="Tên hàng hoá" field="itemName"> </Column>
                  <Column header="Đơn vị tính" field="uomName" style="text-align: right">
                  </Column>
                  <Column header="Số lượng" style="text-align: right">
                    <template #body="slotProps">
                      {{ NumberFormat(slotProps.data.quantity) }}
                    </template>
                  </Column>
                  <Column header="Thành tiền" style="text-align: right">
                    <template #body="slotProps">
                      {{ NumberFormat(slotProps.data.UnitPrice) }} VNĐ
                    </template>
                  </Column>

                  <template #expansion="slotProps">
                    <DataTable
                      showGridlines
                      :value="slotProps.data.item"
                      responsiveLayout="scroll"
                      stripedRows
                      size="small"
                    >
                      <Column header="Tên hàng hoá" field="Oitm.ItemName"> </Column>
                      <Column header="Đơn vị tính" field="UomName"> </Column>
                      <Column header="Số lượng" field="Quantity">
                        <template #body="slotProps">
                          {{ NumberFormat(slotProps.data.Quantity) }}
                        </template>
                      </Column>
                      <Column header="Thành tiền" style="text-align: right">
                        <template #body="slotProps">
                          {{
                            NumberFormat(
                              slotProps.data.UnitPrice * slotProps.data.Quantity
                            )
                          }}
                          VNĐ
                        </template>
                      </Column>
                      <Column header="Ghi chú" field="Memo"> </Column>
                      <Column header="Tệp đính kèm" field="LinkDocument"> </Column>
                      <Column
                        header="Xuất xứ"
                        :hidden="dataEdit.OriginID == 'Y' ? false : true"
                        headerStyle="width:15%"
                      >
                      </Column>
                      <Column
                        header="Chính sách bảo hành"
                        :hidden="dataEdit.WartyPolicyID == 'Y' ? false : true"
                        headerStyle="width:15%"
                      >
                      </Column>
                      <Column header="Địa chỉ giao hàng" field="Address"> </Column>
                    </DataTable>
                  </template>
                </DataTable>
                <h6>Danh mục nhà cung cấp</h6>
                <DataTable
                  v-if="dataEdit.CMA1"
                  showGridlines
                  :value="
                    dataEdit.CMA1.filter((val) => {
                      return val.Status != '';
                    })
                  "
                  size="small"
                >
                  <Column header="Tên nhà cung cấp" field="Ocrd.CardName"> </Column>
                  <Column header="Ngày nộp hồ sơ">
                    <template #body="slotProps">
                      {{ format(slotProps.data.CreatedAt, "dd/MM/yyyy") }}
                    </template>
                  </Column>
                  <Column header="Kết quả">
                    <template #body="slotProps">
                      {{
                        slotProps.data.Status == "S"
                          ? "Đã nộp"
                          : slotProps.data.Status == "O"
                          ? "Đã huỷ thầu"
                          : "Đang chờ phản hồi"
                      }}
                    </template>
                  </Column>
                  <Column header="Hành động" style="text-align: center">
                    <template #body="slotProps">
                      <Button
                        text
                        icon="pi pi-eye"
                        @click="viewData(slotProps.data.Ocrd.ID)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ViewDetailOcrd
    v-if="dataEdit.url"
    :url="'ocma/getcma1?cmaid=' + dataEdit.ID + '&crdid=' + dataEdit.url"
    @close="closeView(e)"
  />
  <Dialog
    v-model:visible="dialogEdit"
    :style="{ width: '550px' }"
    header="Xác Nhận"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span
        >Bạn chắc chắn muốn huỷ gói thầu <b>{{ dataEdit.CmaName }}</b> ?</span
      >
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="hideDelete()" outlined />
      <Button
        label="Xác nhận"
        severity="danger"
        icon="pi pi-check"
        :loading="loadAction"
        @click="withdrawalconfirmation()"
      />
    </template>
  </Dialog>
</template>
<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { format } from "date-fns";
import ViewDetailOcrd from "./ViewDetailOcrd.vue";
import API from "../../../apis/api";
import { useRoute } from "vue-router";
import { Integer } from "read-excel-file";

const dataEdit = ref({});
const expandedRows = ref([]);
const countdownstring = ref(null);
const expiredCheck = ref(false);
const dialogEdit = ref(false);
const DetailCMA = ref(null);
const Rotuer = useRoute();

const emit = defineEmits(["close"]);

const props = defineProps({
  url: {
    type: String,
    default: null,
  },
});

const items = ref([
  {
    icon: "pi pi-user",
  },
  {
    icon: "pi pi-calendar",
  },
  {
    icon: "pi pi-check",
  },
]);

const stepData = ref([
  {
    status: "Đang nhận hồ sơ",
    time: convertToCustomFormat(dataEdit.value.StartTime),
  },
  {
    status: "Đang đánh giá",
    time: "00:00:00 00/00/0000",
  },
  {
    status: "Đã có kết quả",
    time: convertToCustomFormat(dataEdit.value.EndTime),
  },
]);

onBeforeMount(() => {
  detailCma();
  // console.log(Rotuer.params.id);
});
const NumberFormat = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};
const detailCma = () => {
  API.get_all("ocma/getbyid?id=" + Rotuer.params.id).then((res) => {
    dataEdit.value = res.data;
    let Items = [];
    if (res.data.CMA7 != null)
      for (let index = 0; index < res.data.CMA7.length; index++) {
        const item = res.data.CMA7[index];
        if (item.ListItem.length)
          for (let y = 0; y < item.ListItem.length; y++) {
            const item2 = item.ListItem[y];
            Items.push(item2);
          }
      }
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      if (index == 0) {
        dataEdit.value.Items = [
          {
            itemName: item.Oitm.ItemName,
            uomName: item.UomName,
            quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            Iditem: item.OitmID,
            item: [item],
          },
        ];
      } else {
        const data = dataEdit.value.Items.filter((val) => {
          return val.Iditem == item.OitmID && val.uomName == item.UomName;
        });
        if (data.length) {
          data[0].quantity += item.Quantity;
          data[0].UnitPrice += item.UnitPrice;
          data[0].item.push(item);
        } else {
          dataEdit.value.Items.push({
            itemName: item.Oitm.ItemName,
            uomName: item.UomName,
            quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            Iditem: item.OitmID,
            item: [item],
          });
        }
      }
    }
    coutDown(dataEdit.value.EndTime);
    var ngay = new Date(dataEdit.value.EndTime);
    stepData.value = [
      {
        status: "Đang nhận hồ sơ",
        time: convertToCustomFormat(dataEdit.value.StartTime),
        classbox:
          new Date(dataEdit.value.StartTime) <= new Date() ? "bg-primary" : "surface-300",
        classarrow:
          new Date(dataEdit.value.StartTime) <= new Date()
            ? "primary-right"
            : "surface-right",
      },
      {
        status: "Đang đánh giá",
        time:
          new Date(dataEdit.value.EndTime) <= new Date()
            ? convertToCustomFormat(ngay)
            : "00:00: dd/MM/yyyy",
        classbox:
          new Date(dataEdit.value.EndTime) <= new Date() ? "bg-primary" : "surface-300",
        classarrow:
          new Date(dataEdit.value.EndTime) <= new Date()
            ? "primary-right"
            : "surface-right",
      },
      {
        status: "Đã có kết quả",
        time:
          dataEdit.value.Status == "A"
            ? convertToCustomFormat(dataEdit.value.UpdatedAt)
            : "00:00 dd/MM/yyyy",
        classbox: dataEdit.value.Status == "A" ? "bg-primary" : "surface-300",
        classarrow: dataEdit.value.Status == "A" ? "primary-right" : "surface-right",
      },
    ];
  });
};

const coutDown = (EndTime) => {
  // Calculate the remaining time
  var x = setInterval(function () {
    var now = new Date().getTime();
    var countDownDate = new Date(EndTime).getTime();
    var distance = countDownDate - now;
    // Calculate days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    countdownstring.value =
      days + "ngày " + hours + "giờ " + minutes + "phút " + seconds + "giây ";
    // If the countdown is over, display a message
    if (distance < 0) {
      clearInterval(x);
      expiredCheck.value = true;
      countdownstring.value = "Đã quá hạn";
    }
  }, 1000);
};

const getTotal = computed(() => {
  let total = 0;
  if (dataEdit.value.Items) {
    for (let i = 0; i < dataEdit.value.Items.length; i++) {
      const item = dataEdit.value.Items[i];
      total += item.UnitPrice;
    }
  }
  return total;
});

const hide = () => {
  history.back();
};

const viewData = (data) => {
  dataEdit.value.url = data;
  DetailCMA.value.style.display = "none";
};

const closeView = (e) => {
  delete dataEdit.value.url;
  DetailCMA.value.style.display = "block";
};

function convertToCustomFormat(inputTime) {
  // Parse the input time
  var parsedTime = new Date(inputTime);

  // Extract hours, minutes, day, month, and year
  var hours = parsedTime.getHours();
  var minutes = parsedTime.getMinutes();
  var day = parsedTime.getDate();
  var month = parsedTime.getMonth() + 1; // Month starts from 0
  var year = parsedTime.getFullYear();

  // Format hours and minutes with leading zeroes if necessary
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;

  // Format day, month, and year with leading zeroes if necessary
  day = (day < 10 ? "0" : "") + day;
  month = (month < 10 ? "0" : "") + month;

  // Return the formatted string
  return hours + ":" + minutes + " " + day + "/" + month + "/" + year;
}

const getStatusLabel = (status) => {
  switch (status) {
    case "P":
      return "Đang nhận hồ sơ";
    case "A":
      return "Hoàn thành";
    case "C":
      return "Huỷ";
    case "I":
      return "Đang đánh giá";
    case "F":
      return "Thất bại";
    case "L":
      return "Đã chọn nhà thầu";
    default:
      return "Unknown";
  }
};

const Cancel = () => {
  let text = "Bạn có chắc chắn huỷ gói thầu này không ?";
  if (confirm(text) == true) {
    const data = {
      id: Integer(Rotuer.params.id),
      status: "C",
    };
    API.update(data, "ocma/update").then((res) => {
      history.back();
    });
  }
};
</script>
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
.arrow-right {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
}
.arrow-left {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 15px solid #f9fafb;
}
.right-1 {
  width: 100%;
  height: 60px;
}
.surface-right {
  border-left: 15px solid #d1d5db;
}
.primary-right {
  border-left: 15px solid #0773bb;
}
</style>
