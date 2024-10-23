<template>
  <div class="card">
    <div class="grid align-items-center justify-content-between">
      <div class="col-7 flex align-items-center">
        <i
          class="pi pi-arrow-left p-title font-semibold cursor-pointer"
          @click="hide()"
        ></i>
        <h4 class="m-0 p-title m-2 p-2 mb-0 mt-0 font-semibold">
          BÁO CÁO CHI TIẾT YÊU CẦU MUA SẮM
        </h4>
      </div>
      <div class="col-5">
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
          <h5 class="font-semibold">BÁO CÁO CHI TIẾT YÊU CẦU MUA SẮM</h5>
          <p>Đơn vị đề xuất: Tất cả, Thời gian: Năm nay (01/01/2024 - 15/04/2024)</p>
        </div>
        <div class="mt-5 p-3">
          <div>
            <DataTable ref="dt" :value="data" tableStyle="min-width: 50rem" showGridlines>
              <Column field="type" header="Loại" headerClass="text-right">
                <template #body="slotProps">
                  {{
                    slotProps.data.type == 0
                      ? "Chưa thực hiện"
                      : slotProps.data.type == 1
                      ? "Đang thực hiện"
                      : slotProps.data.type == 2
                      ? "Đã hoàn thành"
                      : ""
                  }}
                </template>
              </Column>
              <Column field="month_1" header="Mã kế hoạch"></Column>
              <Column field="month_2" header="Tên kế hoạch"></Column>
              <Column field="month_3" header="Đơn vị đề xuất"></Column>
              <Column field="month_4" header="Trạng thái"></Column>
              <Column field="month_5" header="Mã hàng hóa"></Column>
              <Column field="month_6" header="Tên hàng hóa"></Column>
              <Column field="month_7" header="Đơn vị tính"></Column>
              <Column field="month_8" header="Số lượng kế hoạch"></Column>
              <Column field="month_9" header="Số lượng đã mua"></Column>
              <Column field="month_9" header="Số lượng đã mua"></Column>
              <Column field="month_9" header="Số lượng đã mua"></Column>
              <Column field="month_10" header="Số lượng đã nhận"></Column>
              <Column field="month_11" header="Số lượng chưa nhận"></Column>
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
      <div class="field">
        <label for="">Đơn vị đề xuất</label>
        <Dropdown />
      </div>
      <div class="grid">
        <div class="col-4">
          <Dropdown />
        </div>
        <div class="col-4">
          <Calendar placeholder="Từ ngày" />
        </div>
        <div class="col-4">
          <Calendar placeholder="Đến ngày" />
        </div>
      </div>
      <div class="field">
        <label for="">Loại yêu cầu</label>
        <Dropdown />
      </div>
    </div>
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="dialog = false" />
      <Button label="Xác nhận" icon="pi pi-check" @click="dialog = false" />
    </template>
  </Dialog>
</template>
<script setup>
import { onBeforeMount, ref, watchEffect, computed } from "vue";

const dialog = ref(true);
const dt = ref();
const emit = defineEmits(["close"]);
const props = defineProps({
  data: {
    type: String,
    default: null,
  },
});
const data = ref([
  {
    type: "0",
    month_1: 123,
    month_2: 12,
    month_3: 3,
    month_4: 23,
    month_5: 3,
    month_6: 133,
    month_7: 12,
    month_8: 23,
    month_9: 43,
    month_10: 13,
    month_11: 13,
    month_12: 53,
  },
  {
    type: "1",
    month_1: 13,
    month_2: 3,
    month_3: 13,
    month_4: 12,
    month_5: 33,
    month_6: 23,
    month_7: 143,
    month_8: 13,
    month_9: 12,
    month_10: 13,
    month_11: 13,
    month_12: 42,
  },
  {
    type: "2",
    month_1: 3,
    month_2: 12,
    month_3: 123,
    month_4: 123,
    month_5: 23,
    month_6: 13,
    month_7: 23,
    month_8: 13,
    month_9: 14,
    month_10: 13,
    month_11: 13,
    month_12: 1,
  },
]);
const exportCSV = () => {
  dt.value.exportCSV();
};
const hide = () => {
  emit("close", true);
};
</script>
