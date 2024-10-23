<template>
  <div>
    <div class="flex justify-content-between m-3 mt-3">
      <div class="flex align-items-center mt-0">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          XEM THÔNG TIN HỒ SƠ DỰ THẦU
        </h5>
      </div>
      <div class="flex align-items-center mt-0">
        <Button label="Đóng" outlined @click="hide()"></Button>
      </div>
    </div>
    <div>
      <div class="card p-0 pt-5 pl-2 pr-2">
        <div class="grid">
          <div class="col-3">
            <div class="card border-round">
              <div class="grid mb-3">
                <div class="col-4">Trạng thái:</div>
                <div class="col-8"><strong>Đang nhận hồ sơ</strong></div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Bắt đầu:</div>
                <div class="col-8">
                  <strong class="p-title">{{
                    dataEdit.StartTime
                      ? format(dataEdit.StartTime, "hh:MM dd/MM/yyyy")
                      : ""
                  }}</strong>
                </div>
              </div>
              <div class="grid mb-3">
                <div class="col-4">Kết thúc:</div>
                <div class="col-8">
                  <strong class="p-title">{{
                    dataEdit.EndTime ? format(dataEdit.EndTime, "hh:MM dd/MM/yyyy") : ""
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
                label="Yêu cầu bổ sung thông tin"
                class="w-full"
                @click="dialogEdit = true"
                :disabled="expiredCheck"
              />
            </div>
          </div>
          <div class="col-9">
            <div class="card border-round">
              <div>
                <h4 class="p-title font-semibold">
                  {{ dataEdit.CMA1 ? dataEdit.Detail.Ocrd.CardName : "-" }}
                </h4>
                <div class="card p-3 surface-200">
                  <p class="m-0"><strong>Thông tin nhà cung cấp</strong></p>
                </div>
                <div class="grid mb-3">
                  <div class="col-4">Mã số thuế:</div>
                  <div class="col-8">
                    {{ dataEdit.CMA1 ? dataEdit.Detail.Ocrd.LicTradNum : "-" }}
                  </div>
                </div>
                <div class="grid mb-3">
                  <div class="col-4">Số điện thoại:</div>
                  <div class="col-8">
                    {{ dataEdit.CMA1 ? dataEdit.Detail.Ocrd.Phone : "-" }}
                  </div>
                </div>
                <div class="grid mb-3">
                  <div class="col-4">Email:</div>
                  <div class="col-8">
                    {{ dataEdit.CMA1 ? dataEdit.Detail.Ocrd.Email : "-" }}
                  </div>
                </div>
                <div>
                  <div class="card p-3 surface-200">
                    <p class="m-0"><strong>Thông tin dự thầu</strong></p>
                  </div>
                  <div class="grid mb-3">
                    <div class="col-4">Giá thầu:</div>
                    <div class="col-8">{{ NumberFormat(getTotal) }} VNĐ</div>
                  </div>
                  <div class="grid mb-3">
                    <div class="col-4">Thời gian giao hàng:</div>
                    <div class="col-8">-</div>
                  </div>
                  <div class="grid mb-3">
                    <div class="col-4">Điều khoản thanh toán:</div>
                    <div class="col-8">-</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card border-round">
              <h5>Hồ sơ dự thầu</h5>
              <div>
                <div class="grid m-2" v-if="dataEdit.ImpProgress == 'Y'">
                  <div class="col-6 flex align-items-center">
                    <Checkbox
                      disabled
                      v-model="dataEdit.ImpProgress"
                      trueValue="Y"
                      falseValue="N"
                      binary="true"
                    />
                    <label for="ingredient1" class="ml-5">Tiến độ thực hiện</label>
                  </div>
                  <div class="col-6 flex align-items-center justify-content-end">
                    <Button icon="pi pi-eye" text @click="Update(1)" />
                  </div>
                </div>
                <div class="grid m-2" v-if="dataEdit.SumQuotes == 'Y'">
                  <div class="col-6 flex align-items-center">
                    <Checkbox
                      disabled
                      v-model="dataEdit.SumQuotes"
                      trueValue="Y"
                      falseValue="N"
                      binary="true"
                    />
                    <label for="ingredient1" class="ml-5">Tổng hợp giá thầu</label>
                  </div>
                  <div class="col-6 flex align-items-center justify-content-end">
                    <Button icon="pi pi-eye" text @click="Update(2)" />
                  </div>
                </div>
                <div class="grid m-2" v-if="dataEdit.TermsOfPay == 'Y'">
                  <div class="col-6 flex align-items-center">
                    <Checkbox
                      disabled
                      v-model="dataEdit.TermsOfPay"
                      trueValue="Y"
                      falseValue="N"
                      binary="true"
                    />
                    <label for="ingredient1" class="ml-5">Điều khoản thanh toán</label>
                  </div>
                  <div class="col-6 flex align-items-center justify-content-end">
                    <Button icon="pi pi-eye" text @click="Update(3)" />
                  </div>
                </div>
                <div class="grid m-2" v-if="dataEdit.Other == 'Y'">
                  <div class="col-6 flex align-items-center">
                    <Checkbox
                      disabled
                      v-model="dataEdit.Other"
                      trueValue="Y"
                      falseValue="N"
                      binary="true"
                    />
                    <label for="ingredient1" class="ml-5"
                      >Tiều liệu khác(VD:Chứng nhận,Hồ sơ doanh nghiệp,Hợp
                      đồng,..vv)</label
                    >
                  </div>
                  <div class="col-6 flex align-items-center justify-content-end">
                    <Button icon="pi pi-eye" text @click="Update(4)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="dialog01"
    :style="{ width: '1500px' }"
    :header="dataEdit.dialogheader"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="mb-3" v-if="dataEdit.dialogtype == 1">
      <p class="m-0">
        Nhà thầu đề xuất tiến độ thực hiện giao hàng phù hợp với yêu cầu của bên mời thầu
      </p>
      <p>Lưu ý: Thời gian giao hàng bắt đầu tính từ ngày ký hợp đồng</p>
    </div>
    <div class="mb-3" v-if="dataEdit.dialogtype == 2">
      <h6 class="m-0">Lưu ý</h6>
      <div>
        <p class="m-0">
          1. Nhà cung cấp báo giá hàng hóa theo số lượng hàng có thể đáp ứng.
        </p>
        <p>
          2. Đơn giá báo giá đã bao gồm tất cả chi phí dịch vụ vận chuyển, lắp đặt và thuế
          VAT.
        </p>
      </div>
    </div>
    <div class="card" v-if="dataEdit.dialogtype == 2 || dataEdit.dialogtype == 1">
      <DataTable
        showGridlines
        v-model:expandedRows="expandedRows2"
        :value="dataEdit.Items"
        responsiveLayout="scroll"
        rows="10"
        @rowExpand="onRowExpand"
        @rowCollapse="onRowCollapse"
        stripedRows
        size="small"
        scrollHeight="700px"
        scrollable
      >
        <Column expander style="width: 1rem" />
        <Column header="Tên hàng hoá" field="itemName"> </Column>
        <Column header="Đơn vị tính" field="uomName" style="text-align: right"> </Column>
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
            rows="10"
          >
            <Column header="Tên hàng hoá" field="Oitm.ItemName" style="min-width: 400px">
            </Column>
            <Column header="Đơn vị tính" field="UomName" style="min-width: 100px">
            </Column>
            <Column header="Số lượng" field="Quantity" style="min-width: 100px">
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.Quantity) }}
              </template>
            </Column>
            <Column
              header="Số lượng có thể cung cấp"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                {{ slotProps.data.QuanCanBeSupp }}
              </template>
            </Column>
            <Column
              header="Đơn giá"
              style="min-width: 100px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                {{ slotProps.data.Price }}
              </template>
            </Column>
            <Column
              header="Thành tiền"
              field="UnitPrice"
              style="text-align: right; min-width: 100px"
            >
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.UnitPrice) }} VNĐ
              </template>
            </Column>
            <Column header="Địa điểm thực hiện" field="Address" style="min-width: 200px">
            </Column>
            <Column
              header="Chính sách bảo hành"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                <Dropdown
                  :options="dataEdit.dataWartyPolicy"
                  optionLabel="CwName"
                  optionValue="ID"
                  disabled
                  v-model="slotProps.data.WarrPolicy"
                  :class="{ 'p-invalid': submitted && !slotProps.data.WarrPolicy }"
                />
              </template>
            </Column>
            <Column
              header="Tài liệu liên quan"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                <div
                  v-if="slotProps.data.file || slotProps.data.LinkDocument"
                  class="flex align-items-center"
                >
                  <a
                    :href="
                      slotProps.data.file
                        ? slotProps.data.file.name
                        : slotProps.data.LinkDocument
                    "
                    target="_blank"
                    >{{
                      slotProps.data.file
                        ? slotProps.data.file.name
                        : slotProps.data.LinkDocument
                    }}</a
                  >
                </div>
                <Button
                  v-else
                  text
                  label="Chọn file"
                  icon="pi pi-upload"
                  @click="chooseFile(slotProps.data)"
                />
              </template>
            </Column>
            <Column
              header="Ngày cần hàng"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 1"
              field="CreatedAt"
            >
              <template #body="slotProps">
                {{ format(slotProps.data.CreatedAt, "dd/MM/yyyy") }}
              </template>
            </Column>
            <Column
              header="Thời gian giao hàng dự kiến"
              style="min-width: 230px"
              v-if="dataEdit.dialogtype == 1"
            >
              <template #body="slotProps">
                {{ format(slotProps.data.LeadTime, "dd/MM/yyyy") }}
              </template>
            </Column>
          </DataTable>
        </template>
      </DataTable>
    </div>
    <div v-if="dataEdit.dialogtype == 3">
      <h6>Yêu cầu tạm ứng</h6>
      <div class="grid">
        <div class="col-2">
          <div class="col-12 flex align-items-center">
            <RadioButton :value="true" v-model="dataEdit.WPL2.IsAdvReq" disabled />
            <label for="ingredient1" class="ml-5">Có</label>
          </div>
        </div>
        <div class="col-2">
          <InputNumber
            placeholder="Nhập số tiền tạm ứng (%)"
            suffix=" %"
            disabled
            v-model="dataEdit.WPL2.NumAdvReq"
            :class="{
              'p-invalid':
                submitted && !dataEdit.WPL2.NumAdvReq && dataEdit.WPL2.IsAdvReq,
            }"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-2">
          <div class="col-12 flex align-items-center">
            <RadioButton :value="false" v-model="dataEdit.WPL2.IsAdvReq" disabled />
            <label for="ingredient1" class="ml-5">Không</label>
          </div>
        </div>
      </div>
      <hr />
      <h6>Điều khoản thanh toán</h6>
      <div class="grid">
        <div class="col-6">
          <div class="field">
            <Dropdown
              placeholder="Chọn"
              :options="[
                {
                  type: 1,
                  name: 'Khác',
                },
              ]"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Type }"
              optionLabel="name"
              optionValue="type"
              disabled
              v-model="dataEdit.WPL2.Type"
            />
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <div class="field">
            <label> Ngày thanh toán dựa trên</label>
            <Dropdown
              placeholder="Chọn"
              disabled
              :options="[
                {
                  type: 1,
                  name: 'Ngày hoá đơn',
                },
                {
                  type: 2,
                  name: 'Ngày giao hàng',
                },
              ]"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.DateAdd }"
              optionLabel="name"
              optionValue="type"
              v-model="dataEdit.WPL2.DateAdd"
            />
          </div>
        </div>
        <div class="col-5 flex align-items-end">
          <div class="field">
            <label> Bắt đầu từ</label>
            <Dropdown
              disabled
              placeholder="Chọn"
              :options="[
                {
                  type: 1,
                  name: 'Đầu tháng',
                },
                {
                  type: 2,
                  name: 'Giữa tháng',
                },
                {
                  type: 2,
                  name: 'Cuối tháng',
                },
              ]"
              optionLabel="name"
              optionValue="type"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.StartTime }"
              v-model="dataEdit.WPL2.StartTime"
            />
          </div>
          <div class="field ml-4">
            <InputNumber
              placeholder="Nhập tháng"
              disabled
              v-model="dataEdit.WPL2.Month"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Month }"
            />
          </div>
          <div class="field ml-4">
            <InputNumber
              disabled
              placeholder="Nhập ngày"
              v-model="dataEdit.WPL2.Day"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Day }"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="field">
            <label>Số ngày cho phép chênh lệch</label>
            <InputNumber
              disabled
              v-model="dataEdit.WPL2.NumOfDaysDiff"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.NumOfDaysDiff }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card" v-if="dataEdit.dialogtype == 4">
      <DataTable :value="dataEdit.CMA5" tableStyle="min-width: 50rem">
        <Column header="Tên tài liệu" field="Name" headerStyle="width:50%"></Column>
        <Column header="Tệp đính kèm" field="Link" headerStyle="width:50%">
          <template #body="slotProps">
            <a :href="slotProps.data.Link" target="_blank">{{ slotProps.data.Link }}</a>
          </template>
        </Column>
      </DataTable>
    </div>
    <template #footer>
      <Button label="Đóng" icon="pi pi-times" outlined @click="dialog01 = false" />
    </template>
  </Dialog>
</template>
<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { format } from "date-fns";
import API from "../../../apis/api";

const dataEdit = ref({});
const countdownstring = ref(null);
const expiredCheck = ref(false);
const dialogEdit = ref(false);
const dialog01 = ref(false);
const expandedRows = ref([]);
const expandedRows2 = ref([]);
const props = defineProps({
  url: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(["close"]);

onBeforeMount(() => {
  detailCmaOcrd();
});

const NumberFormat = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};
const detailCmaOcrd = () => {
  API.get_all(props.url).then((res) => {
    dataEdit.value = res.data;
    let WPL = res.data.Detail.WPL ? res.data.Detail.WPL : [];
    let WPL1 = res.data.Detail.WPL1 ? res.data.Detail.WPL1 : [];
    console.log(WPL1);
    let WPL2 = res.data.Detail.WPL2
      ? res.data.Detail.WPL2
      : {
          ID: 0, // chưa có thì id = 0 (new obj), có id là update
          IsAdvReq: null, // Có tạm ứng không
          NumAdvReq: null, // Phần tram tạm ứng
          Type: null, // Loại điều khoản thanh toán
          DateAdd: null, // Ngành thanh toán dựa trên
          StartTime: null, // Bắt đầu từ
          Month: null, // Tháng
          Day: null, // Ngày
          NumOfDaysDiff: null, // Số ngành chênh lệch cho phép
        };
    let WPL3 = res.data.Detail.WPL3 ? res.data.Detail.WPL3 : [];
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
    // Duyệt qua với WPL [Báo giá sản phẩm/Dịch vụ]
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      const ID = item.ID;
      if (WPL.length) {
        const check = WPL.filter((val) => {
          return val.Cma2ID === ID;
        });
        if (check.length) {
          item.IDWPL = check[0].ID;
          item.WarrPolicy = check[0].WarrPolicy;
          item.Price = check[0].Price;
          item.QuanCanBeSupp = check[0].QuanCanBeSupp;
          item.LinkDocument = check[0].LinkDocument;
          item.IsAddFile = check[0].IsAddFile;
        } else {
          item.IDWPL = 0;
          item.WarrPolicy = null;
          item.Price = null;
          item.QuanCanBeSupp = null;
          item.LinkDocument = null;
          item.IsAddFile = null;
        }
      } else {
        item.IDWPL = 0;
        item.WarrPolicy = null;
        item.Price = null;
        item.QuanCanBeSupp = null;
        item.LinkDocument = null;
        item.IsAddFile = null;
      }
    }

    // Duyệt qua với WPL1 [Tiến độ thực hiện hợp đồng]
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      const ID = item.ID;
      if (WPL1.length) {
        const check = WPL1.filter((val) => {
          return val.Cma2ID === ID;
        });

        if (check.length) {
          item.IDWPL1 = check[0].ID;
          item.LeadTime = check[0].LeadTime;
        } else {
          item.IDWPL1 = 0;
          item.LeadTime = null;
        }
      } else {
        item.IDWPL1 = 0;
        item.LeadTime = null;
      }
    }
    // Nhóm hàng hoá
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

    // Duyệt CMA5
    if (res.data.CMA5)
      for (let index = 0; index < res.data.CMA5.length; index++) {
        const element = res.data.CMA5[index];
        if (res.data.Detail.WPL3) {
          const data = res.data.Detail.WPL3.filter((val) => {
            return val.Cma5ID == element.ID;
          });
          if (data.length) {
            element.Link = data[0].Link;
          }
        }
      }
    dataEdit.value.WPL2 = WPL2;
    coutDown(dataEdit.value.EndTime);
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
    countdownstring.value = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
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

const Update = (type) => {
  dataEdit.value.dialogtype = type;
  if (type == 1) dataEdit.value.dialogheader = "Tiến độ thực hiện";
  if (type == 2) dataEdit.value.dialogheader = "Tổng hợp giá thầu";
  if (type == 3) dataEdit.value.dialogheader = "Điều khoản thanh toán";
  if (type == 4) dataEdit.value.dialogheader = "Tài liệu khác";
  getWartyPolicy();
  dialog01.value = true;
};
const getWartyPolicy = () => {
  API.get_all("oscw/getbyid?id=1").then((res) => {
    dataEdit.value.dataWartyPolicy = res.data.SCW1;
  });
};
const hide = () => {
  emit("close", true);
};
</script>
