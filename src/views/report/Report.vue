<template>
  <div v-if="!dataEdit.codeReport">
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH SÁCH BÁO CÁO</h5>
      </div>
    </div>
  </div>
  <div v-if="!dataEdit.codeReport">
    <DataTable
      :value="dataRepot"
      showGridlines
    >
      <template v-if="false" #header>
        <div class="flex justify-content-start">
          <span class="block p-input-button">
            <InputText :placeholder="$t('InputText.Search')" />
            <Button icon="pi pi-search"/>
          </span>
        </div>
      </template>
      <!-- <Column header="STT" headerStyle="width:3rem" style="text-align: center">
        <template #body="slotProps">{{ slotProps.index + 1 }}</template></Column
      > -->
      <Column field="name" header="Tên báo cáo"></Column>
      <Column field="type" header="Danh mục"></Column>

      <Column field="name" header="Hành động" headerStyle="width:5rem">
        <template #body="slotProps">
          <Button text icon="pi pi-ellipsis-h" @click="dataEdit.codeReport = slotProps.data" />
        </template>
      </Column>
    </DataTable>
  </div>
  <PPR v-if="dataEdit.codeReport" @close="closeReport()" :data_1="dataEdit.codeReport" />
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import PPR from "./templateReport/PPR.vue";

const dialogRport = ref(true);
const dataEdit = ref({});
const dataRepot = [
  {
    code: 1,
    name: "Tiến độ thực hiện Kế hoạch mua sắm",
    type: "Báo cáo tiến độ",
  },
  {
    code: 3,
    name: "Tiến độ thực hiện Yêu cầu mua sắm",
    type: "Báo cáo tiến độ",
  },
  {
    code: 5,
    name: "Tiến độ thực hiện gói thầu mua sắm ",
    type: "Báo cáo tiến độ",
  },
  {
    code: 7,
    name: "Tiến độ giao - nhận hàng",
    type: "Báo cáo tiến độ",
  },
  {
    code: 8,
    name: "So sánh giá",
    type: "Báo cáo so sánh",
  },
  {
    code: 9,
    name: "So sánh nhà cung cấp",
    type: "Báo cáo so sánh",
  },
  {
    code: 10,
    name: "Mua hàng theo mặt hàng (hàng hóa/nhóm hàng hóa)",
    type: "Báo cáo sản lượng",
  },
  {
    code: 12,
    name: "Hàng mua theo nhà cung cấp",
    type: "Báo cáo sản lượng",
  },
];

const closeReport = (e) => {
  dataEdit.value.codeReport = null;
  dialogRport.value = true;
};
</script>
