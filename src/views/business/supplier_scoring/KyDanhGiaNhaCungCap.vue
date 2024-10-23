<template>
  <div class="content-body mx-1">
    <div class="flex justify-content-between px-3 py-3">
      <h5 class="font-semibold p-title m-0 flex align-items-center">DANH SÁCH KỲ ĐÁNH GIÁ</h5>
      <!-- <Button :label="$t('Button.AddNew')" icon="pi pi-plus" @click="openEvaluationCriteria"></Button> -->
    </div>
    <DataTable :value="dataTableKyDanhGia">
      <template #header>
        <div class="flex justify-content-between">
          <div class="search-area">
            <span class="block p-input-button">
              <InputText :placeholder="$t('InputText.Search')" />
              <Button icon="pi pi-search" />
            </span>
          </div>
          <Button @click="openScoreSetting" label="Thiết lập kỳ đánh giá" icon="pi pi-cog" outlined
            class="text-primary"></Button>
        </div>
      </template>
      <template #empty>
        <span class="flex justify-content-center p-3">Không có dữ liệu nào để hiển thị</span>
      </template>
      <Column field="Name" header="Kỳ đánh giá"></Column>
      <Column header="Năm đánh giá">
        <template #body="sp"> 
          <div>{{ new Date(sp.data.CreatedAt).getFullYear() }}</div>
        </template>
      </Column>
      <Column field="CountSupplier" header="Số lượng nhà cung cấp"></Column> 
      <Column field="Status" header="Trạng thái">
        <template #body="sp">
          <div>{{ getStatusLabel(sp.data.Status) }}</div>
        </template>
      </Column>
      <Column style="width: 3rem;">
        <template #body="sp">
          <div style="width: 3rem;" class="flex justify-content-between gap-2">
            <Button @click="directToDetail(sp.data)" icon="pi pi-pencil" text style="padding: 5px; width: 24px; height: 24px;" ></Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
  <Dialog v-model:visible="scoreSettingVisible" header="THIẾT LẬP KỲ ĐÁNH GIÁ" modal style="width: 30rem;">
    <div class="flex flex-column gap-2">
        <label class="p-label">Kỳ đánh giá định kỳ</label>
        <Dropdown v-model="cfgKyDanhGia" :options="optionsThietLapKyDanhGia" optionLabel="label" optionValue="value"></Dropdown>
    </div>
    <template #footer>
        <Button label="Hủy" class="p-button" icon="pi pi-times" @click="scoreSettingVisible = false" outlined/>
        <Button label="Lưu" class="p-button p-button-primary" icon="pi pi-save" @click="saveConfigSetting"/>
    </template>
  </Dialog>
  <Toast position="bottom-right" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue';
import { useRouter} from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import API from "./../../../apis/api";

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

const getStatusLabel = (key) => {
  return key === 'A'? 'Hoàn thành' : key === 'P'? 'Đang đánh giá' : key === 'I'? 'Chưa đánh giá' : '-';
}

const saveConfigSetting = async () => {
  // supplier-review/period
  scoreSettingVisible.value = false;
  const response = await API.putAsync('supplier-review/change-period/' + cfgKyDanhGia.value);
  if (response.status === 200) {
    toast.add({ severity:'success', summary: 'Thành công', detail: 'Thiết lập thành công.', life: 3000 });
    scoreSettingVisible.value = false;
  } else {
    console.error('Save config setting error', response);
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra.', life: 3000 });
  }
}

const fetchDataTieuChiDanhGiant = async () => {
  //supplier-review
  const response = await API.getAsync('supplier-review');
  if (response.status === 200) {
    dataTableKyDanhGia.value = response.data;
  } else {
    console.error('Fetch data tieu chi danh gia error', response);
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã xảy ra lỗi khi tải dữ liệu tiêu chí đánh giá.', life: 3000  });
  }
}

onBeforeMount(async () => {
  await fetchDataTieuChiDanhGiant();
})

const directToDetail = (data) => {
  router.push(
    {
      name: 'evaluation-criteria-detail',
      params: { id: data.ID }
    }
  )
}

const cfgKyDanhGia = ref(null);
const scoreSettingVisible = ref(false);
const openScoreSetting = async () => {
  const res = await API.getAsync('supplier-review/period');
  if (res.status === 200) {
    // console.log(res.data);
    cfgKyDanhGia.value = res.data.Type;
  }
  scoreSettingVisible.value = true;
}

const dataTableKyDanhGia = ref([
]);

const optionsThietLapKyDanhGia = [
  {
    label: '3 tháng',
    value: 1
  },
  {
    label: '6 tháng',
    value: 2
  },
  {
    label: '1 năm',
    value: 3
  }
]

</script>

<style>

</style>