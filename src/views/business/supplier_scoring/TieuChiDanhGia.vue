<template>
  <div class="content-body mx-1">
    <div class="flex justify-content-between px-3 py-2">
      <h5 class="font-semibold p-title m-0 flex align-items-center">TIÊU CHÍ ĐÁNH GIÁ NHÀ CUNG CẤP</h5>
      <Button :label="$t('Button.AddNew')" icon="pi pi-plus" @click="openEvaluationCriteria"></Button>
    </div>
    <DataTable :loading="loading1" class="border-left-1 border-right-1 border-200 p-0"
      v-model:expandedRows="expandedRows" :value="dataTieuChiDanhGia" :pt="ptTable" :rowClass="rowClass">
      <template #header>
        <div class="flex justify-content-end">
          <!-- <div class="search-area">
            <span class="block p-input-button">
              <InputText :placeholder="$t('InputText.Search')" />
              <Button icon="pi pi-search" />
            </span>
          </div> -->
          <Button @click="openRankingCfg" label="Thiết lập loại xếp hạng" icon="pi pi-cog" outlined
            class="text-primary"></Button>
        </div>
      </template>
      <template #empty>
        <span class="flex justify-content-center p-3">Không có dữ liệu nào để hiển thị</span>
      </template>
      <template #loading>
        <Loading />
      </template>
      <Column expander style="width: 5rem" />
      <Column field="Name" header="Tiêu chí"></Column>
      <Column field="Description" header="Mô tả" style="width: 20rem;"></Column>
      <Column header="Phương pháp đánh giá" style="width: 15rem;"></Column>
      <Column field="IsActive" header="Trạng thái" style="width: 12rem;">
        <template #body="sp">
          {{ sp.data.IsActive ? 'Hoạt động' : 'Không hoạt động' }}
        </template>
      </Column>
      <Column header="" style="width: 6rem;">
        <template #body="sp">
          <div class="flex justify-content-between" style="width: 4rem;">
            <Button @click="openEditTieuChi(sp.data)" icon="pi pi-pencil" text
              style="width: 24px; height: 24px;"></Button>
            <Button @click="deleteTieuChi(sp.data)" icon="pi pi-trash" text style="width: 24px; height: 24px;"></Button>
          </div>
        </template>
      </Column>
      <template #expansion="slotProps">
        <div style="margin-left: 5rem" class="border-200 border-left-1">
          <DataTable :value="slotProps.data.Childs" :pt="ptSubTable">
            <ColumnGroup type="header"></ColumnGroup>
            <Column field="Name" header="Tên tiêu chí"></Column>
            <Column field="Description" header="Mô tả" style="width: 20rem;"></Column>
            <Column field="EvalMethods" header="Phương pháp đánh giá" style="width: 15rem;">
              <template #body="sp">
                {{ scoringTypeOptions.find(el => el.value === sp.data.EvalMethods) ? scoringTypeOptions.find(el =>
                  el.value === sp.data.EvalMethods).label : 'N/A' }}
              </template>
            </Column>
            <Column field="IsActive" header="Trạng thái" style="width: 12rem;">
              <template #body="sp">
                {{ sp.data.IsActive ? 'Hoạt động' : 'Không hoạt động' }}
              </template>
            </Column>
            <Column header="" style="width: 6rem;">
              <template #body="sp">
                <div class="flex justify-content-between" style="width: 4rem;">
                  <Button @click="openEditTieuChi(sp.data)" icon="pi pi-pencil" text
                    style="width: 24px; height: 24px;"></Button>
                  <Button @click="deleteTieuChi(sp.data)" icon="pi pi-trash" text
                    style="width: 24px; height: 24px;"></Button>
                </div>
              </template>
            </Column>
            <template #empty>
              <div class="flex p-1 justify-content-center font-italic text-400">Không có tiêu chí nào để hiển thị</div>
            </template>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
  <!-- Dialogs -->
  <!-- Thiết lập loại xếp hạng -->
  <Dialog v-model:visible="visibleRankingCfg" header="THIẾT LẬP LOẠI XẾP HẠNG NHÀ CUNG CẤP" modal style="width: 60rem;">
    <DataTable :value="ranks">
      <ColumnGroup type="header">
        <Row>
          <Column header="Loại xếp hạng"></Column>
          <Column header="Thang điểm" colspan="3"></Column>
        </Row>
      </ColumnGroup>
      <Column header="Loại xếp hạng">
        <template #body="sp">
          <InputText v-model="sp.data.TypeName" class="w-full" placeholder="Nhập loại xếp hạng vd: Tốt, Trung bình,...">
          </InputText>
        </template>
      </Column>
      <Column header="Thang điểm" style="width: 7rem;">
        <template #body="sp">
          <!-- :disabled="sp.data.disabled" -->
          <Dropdown :pt="{ input: { style: 'width: 7rem;' } }" v-model="sp.data.StartPoint" placeholder="Từ"
            :options="scoringOptions"></Dropdown>
        </template>
      </Column>
      <Column style="width: 7rem;">
        <template #body="sp">
          <!-- :disabled="!sp.data.StartPoint || sp.data.disabled" -->
          <Dropdown :disabled="!sp.data.StartPoint" :pt="{ input: { style: 'width: 7rem;' } }"
            v-model="sp.data.EndPoint" placeholder="Đến dưới"
            :options="scoringOptions.filter(el => parseInt(el) >= parseInt(sp.data.StartPoint))">
          </Dropdown>
          <!-- fromOptions(sp.data) -->
        </template>
      </Column>
      <Column style="width: 3rem;">
        <template #body="sp">
          <Button @click="removeItem(sp.index, sp.data)" icon="pi pi-trash" text
            style="padding: 5px; width: 24px; height: 24px;" />
        </template>
      </Column>
    </DataTable>
    <div class="flex p-2">
      <Button :disabled="disabledAppendRow()" @click="appendRow" icon="pi pi-plus-circle" label="Thêm dòng" text
        class="text-primary p-2"></Button>
    </div>
    <template #footer>
      <Button icon="pi pi-times" label="Đóng" @click="visibleRankingCfg = false" outlined></Button>
      <Button icon="pi pi-save" label="Lưu" @click="saveRankingConfig"></Button>
    </template>
  </Dialog>
  <!-- Thêm mới tiêu chí đánh giá -->
  <Dialog v-model:visible="visibleEvaluationCriteria"
    :header="(tcdgModel.ID ? 'CHỈNH SỬA' : 'THÊM') + ' TIÊU CHÍ ĐÁNH GIÁ NHÀ CUNG CẤP'" modal style="width: 70rem;">
    <div class="grid m-0">
      <div class="col-12 flex flex-column gap-2">
        <label class="p-label" for="name">Tên tiêu chí<sup class="p-important">*</sup></label>
        <InputText :class="invalidInputName" v-model="tcdgModel.Name" class="w-full"></InputText>
        <small class="p-error">{{ errorMessage.Name }}</small>
      </div>
      <div class="col-7 flex flex-column gap-2">
        <label class="p-label" for="name">Thuộc tiêu chí</label>
        <Dropdown @change="onChangeThuocTieuChi($event)" v-model="tcdgModel.ParentID" optionLabel="Name"
          :disabled="tcdgModel.ID && tcdgModel.ParentID === -1" optionValue="ID" :options="optionsTieuChiDanhGia">
        </Dropdown>
        <!-- <TreeArraySelect @onChange="onSelectTieuChi" :config="treeSelectConfig" /> -->
      </div>
      <div class="col-5 flex flex-column gap-2">
        <label class="p-label" for="name">Phương pháp chấm điểm<sup>*</sup></label>
        <Dropdown :disabled="tcdgModel.ParentID == -1" v-model="tcdgModel.EvalMethods" :options="scoringTypeOptions"
          optionLabel="label" optionValue="value" :class="invalidDropdownMethod">
        </Dropdown>
        <small class="p-error">{{ errorMessage.EvalMethods }}</small>
      </div>
      <div class="col-12 flex flex-column gap-2">
        <label class="p-label" for="memo">Mô tả</label>
        <Textarea id="memo" v-model="tcdgModel.Description" class="w-full" rows="3"></Textarea>
      </div>
      <div class="col-12 flex gap-3 align-items-center">
        <label class="p-label" for="isActive">Trạng thái</label>
        <InputSwitch inputId="isActive" v-model="tcdgModel.IsActive" />
      </div>
    </div>
    <template #footer>
      <Button icon="pi pi-times" label="Huỷ" @click="visibleEvaluationCriteria = false" outlined></Button>
      <Button icon="pi pi-save" label="Lưu" @click="saveTieuChiDanhGia" :loading="loading2"></Button>
    </template>
  </Dialog>
  <!-- Dialogs -->
  <Toast position="bottom-right" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import API from "./../../../apis/api";
const route = useRoute();

const confirm = useConfirm();
const deleteTieuChi = async (data) => {
  // console.log(data)
  confirm.require({
    message: `Bạn có chắc chắn muốn xoá tiêu chí "${data.Name}" không?`,
    header: 'Xác nhận xoá',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Huỷ',
    acceptLabel: 'Xoá',
    accept: async () => {
      const res = await API.deleteAsync('supplier-review/criteria', data.ID);
      if (res.status === 200) {
        showToast('success', 'Thành công', 'Xóa thành công');
      }
      else {
        showToast('error', 'Thông báo', 'Xóa thất bại');
      }
      fetchDataTieuChiDanhGia();
    },
    reject: () => {
      visibleEvaluationCriteria.value = false;
    }
  });
}

const invalidInputName = computed(() => {
  return {'p-invalid': errorMessage.Name }
})

const invalidDropdownMethod = computed(() => {
  return {'p-invalid': errorMessage.EvalMethods }
})

const openEditTieuChi = (data) => {
  clearTcdgModel();
  Object.assign(tcdgModel, data);
  visibleEvaluationCriteria.value = true;
}

const errorMessage = reactive({
  Name: null,
  EvalMethods: null
});
const valiadated = () => {
  Object.keys(errorMessage).forEach(key => {
    errorMessage[key] = null;
  })
  let valiadatedCriteria = true;
  if(!tcdgModel.Name){
    errorMessage.Name = 'Tên tiêu chí không được để trống';
    valiadatedCriteria = false;
  }
  else{
    if(!tcdgModel.Name.trim()){
      errorMessage.Name = 'Tên tiêu chí không được để trống';
      valiadatedCriteria = false;
    }
  }
  if(tcdgModel.ParentID !== -1 && !tcdgModel.EvalMethods){
    errorMessage.EvalMethods = 'Hãy chọn phương pháp chấm điểm';
    valiadatedCriteria = false;
  }
  return valiadatedCriteria;
}

const expandedRows = ref();
const loading2 = ref(false);

const saveTieuChiDanhGia = async () => {
  // console.log(tcdgModel);
  if(!valiadated()){
    // alert('not passed validation')
    return;
  }


  loading2.value = true;
  const payload = {
    ...tcdgModel,
    ParentID: tcdgModel.ParentID || -1,
  }
  try {
    const res = tcdgModel.ID
      ? await API.putAsync('supplier-review/criteria/' + tcdgModel.ID, payload)
      : await API.postAsync('supplier-review/criteria', payload);
    if (res.status === 200) {
      showToast('success', 'Thành công', `${tcdgModel.ID ? 'Chỉnh sửa' : 'Thêm mới'} thành công`);
    }
    fetchDataTieuChiDanhGia();
    visibleEvaluationCriteria.value = false;
  }
  catch (error) {
    toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra!' });
    showToast('error', 'Thành công', `${tcdgModel.ID ? 'Thêm mới' : 'Chỉnh sửa'} thành công`);
    return;
  }
  loading2.value = false;
}

const toast = useToast();
const tcdgModel = reactive({
  ID: null,
  Name: null,
  ParentID: null,
  EvalMethods: null,
  Description: null,
  IsActive: true
});
const clearTcdgModel = () => {
  Object.keys(tcdgModel).forEach(key => {
    tcdgModel[key] = null;
  })
}

const onChangeThuocTieuChi = (event) => {
  if (tcdgModel.ParentID === -1) {
    tcdgModel.EvalMethods = null;
  }
}

const disabledAppendRow = () => {
  let counter = 0;
  for (const item of ranks.value) {
    counter += (parseInt(item.EndPoint) - parseInt(item.StartPoint));
    if (item.EndPoint == 10 || item.EndPoint == item.StartPoint)
      counter++;
  }
  // console.log(counter);
  return counter > 10;
}

const saveRankingConfig = async () => {
  if (ranks.value.length < 1) {
    alert('Vui lòng thêm ít nhất một loại xếp hạng');
    return;
  }
  else {
    let countScore = 0;
    let isError = false;
    for (const item of ranks.value) {
      // console.log(item)
      isError = (item.TypeName == null || item.TypeName == undefined || !item.TypeName)
        || (item.EndPoint == null || item.EndPoint == undefined || !item.EndPoint)
        || (item.StartPoint == null || item.StartPoint == undefined || !item.StartPoint);
      if (isError) {
        // console.log('Lỗi')
        break;
      }
      countScore += (parseInt(item.EndPoint) - parseInt(item.StartPoint));
    }
    if (isError) {
      showToast('warn', 'Cảnh báo', 'Vui lòng điền đủ thông tin.')
      return;
    }
    else if (countScore > 10) {
      alert('Thang điểm xếp loại đã vượt quá thang điểm 10, vui lòng sửa lại thang điểm.')
      // showToast('warn', 'Cảnh báo', 'Thang điểm loại xếp hạng đã vượt quá thang điểm chấm, vui lòng sửa lại thang điểm.')
      return;
    }
    else {

      for(const row of ranks.value){
        const pl = {
          ID: row.ID,
          TypeName: row.TypeName,
          EndPoint: parseInt(row.EndPoint),
          StartPoint: parseInt(row.StartPoint)
        }
        if (row.ID) {
          const res = await API.putAsync('supplier-review/rating-type/' + row.ID, pl);
        }
        else {
          const res = await API.postAsync('supplier-review/rating-type', pl);
        }
      }

      // ranks.value.forEach(async _row => {
      //   // console.log(_row)
      //   const pl = {
      //     ID: _row.ID,
      //     TypeName: _row.TypeName,
      //     EndPoint: parseInt(_row.EndPoint),
      //     StartPoint: parseInt(_row.StartPoint)
      //   }
      //   if (_row.ID) {
      //     const res = await API.putAsync('supplier-review/rating-type/' + _row.ID, pl);
      //   }
      //   else {
      //     const res = await API.postAsync('supplier-review/rating-type', pl);
      //   }
      // });
      showToast('success', 'Thành công', 'Lưu thành công.');
    }
  }
}

const visibleEvaluationCriteria = ref(false);

const openEvaluationCriteria = () => {
  Object.keys(errorMessage).forEach(key => {
    errorMessage[key] = null;
  });
  clearTcdgModel();
  visibleEvaluationCriteria.value = true;
  tcdgModel.ParentID = -1;
  tcdgModel.IsActive = true;
}

const removeItem = (idx, data) => {
  if (data.ID) {
    confirm.require({
      message: `Bạn có chắc chắn muốn xoá loại xếp hạng "${data.TypeName}" không?`,
      header: 'Xác nhận xoá',
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-secondary p-button-outlined',
      rejectLabel: 'Huỷ',
      acceptLabel: 'Xoá',
      accept: async () => {
        const res = await API.deleteAsync('supplier-review/rating-type', data.ID);
        if (res.status === 200) {
          showToast('success', 'Thành công', 'Xóa thành công');
          if (ranks.value.length < 2) {
            ranks.value[idx] = {};
            return;
          }
          ranks.value.splice(idx, 1);
        }
        else {
          showToast('error', 'Thông báo', 'Xóa thất bại');
        }
      },
      reject: () => {
      }
    });
  }
  else {
    if (ranks.value.length < 2) {
      ranks.value[idx] = {};
      return;
    }
    ranks.value.splice(idx, 1);
  }
}

const appendRow = () => {
  if (ranks.value[ranks.value.length - 1]) {
    if (ranks.value[ranks.value.length - 1].TypeName
      && ranks.value[ranks.value.length - 1].StartPoint
      && ranks.value[ranks.value.length - 1].EndPoint) {
      ranks.value[ranks.value.length - 1].disabled = true;
      const prevScore = ranks.value[ranks.value.length - 1].EndPoint;
      ranks.value.push({ name: '', StartPoint: prevScore, EndPoint: '' });
    }
  }
}

const scoringTypeOptions = [
  {
    label: 'Thang điểm',
    value: 1
  },
  {
    label: 'Có / Không',
    value: 2
  },
  {
    label: 'Đạt / Không đạt',
    value: 3
  }
]

const scoringOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


const dataTieuChiDanhGia = ref([]);
const optionsTieuChiDanhGia = ref([]);
const loading1 = ref(false);
const fetchDataTieuChiDanhGia = async () => {
  loading1.value = true;
  try {
    const res = await API.getAsync('supplier-review/criteria');
    dataTieuChiDanhGia.value = tranformArray(res.data);
    optionsTieuChiDanhGia.value = [{ ID: -1, Name: '--Không--' }, ...dataTieuChiDanhGia.value];
  }
  catch (error) {
    console.error(error);
  }
  loading1.value = false;
}

const tranformArray = (array) => {
  let result = [];
  array.forEach((item, i) => {
    if (item.ParentID === -1) {
      item.Childs = array.filter(el => el.ParentID === item.ID);
      result.push(item);
    }
  });
  return result;
}

const onRenderComponent = () => {
  if(route.query.r === 'openconfig')
  {
    openRankingCfg();
  }
}

const initialComponent = async () => {
  await fetchDataTieuChiDanhGia();
  expandedRows.value = dataTieuChiDanhGia.value;
}

onMounted(() => {
  onRenderComponent();
});

onBeforeMount(() => {
  initialComponent();
});


const ranks = ref([]);
const visibleRankingCfg = ref(false);
const openRankingCfg = async () => {
  visibleRankingCfg.value = true;
  if (true) {
    const res = await API.getAsync('supplier-review/rating-type');
    if (res.data && res.data.length > 0) {
      ranks.value = res.data.map(el => ({
        ID: el.ID,
        TypeName: el.TypeName,
        StartPoint: el.StartPoint.toString(),
        EndPoint: el.EndPoint.toString(),
        checked: true
      }));
    }
    else {
      ranks.value = [{
        StartPoint: '0',
        EndPoint: null,
        TypeName: null,
        checked: false
      }];
    }
  }
}

const showToast = (severity, summary, msg) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: msg,
    life: 3000,
  });
};

const ptTable = {
  rowExpansion: {
    style: 'padding: 0px;'
  },
  rowexpansioncell: {
    style: 'padding: 0px;',
    class: 'surface-50'
  },
  loadingOverlay: {
    style: 'background: none;',
  }
}

const ptSubTable = {
  footer: {
    style: 'display: none;'
  }
}

const rowClass = () => {
  return [{ 'bg-blue-50': true }];
}
</script>

<style>
.pt-input-number>input {
  width: 10rem;
}
</style>