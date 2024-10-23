<template>
  <div>
    <div>
      <div class="flex">
        <div class="flex align-items-center mt-0 col-6">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH MỤC ĐƠN HÀNG MUA</h5>
        </div>
      </div>
      <div class="grid">
        <div class="col-12">
          <div class="card p-0">
            <div class="panel-content" style="position: relative">
              <Loading v-if="load_data" />
              <DataTable dataKey="ID" lazy @page="onPageChange($event)" showGridlines :paginator="true"
                :totalRecords="dataTable.TotalCount" :rows="dataTable.Size" :rowsPerPageOptions="[5, 10, 25]"
                :value="dataTable.data" tableStyle="min-width: 50rem">
                <template #empty>
              <div class="flex h-10rem justify-content-center align-items-center">
                Không có dữ liệu nào để hiển thị
              </div>
            </template>
                <template #header>
                  <div class="grid bg--surface-card">
                    <div class="flex flex-column col-6">
                      <h5 class="m-0"></h5>
                      <span class="">
                        <!-- p-input-icon-left -->
                        <!-- <i class="pi pi-search" /> -->
                        <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" style="
                    border-top-right-radius: unset;
                    border-bottom-right-radius: unset;
                  " />
                        <Button icon="pi pi-search" @click="onSearch"
                          style="border-top-left-radius: unset; border-bottom-left-radius: unset"></Button>
                      </span>
                    </div>
                    <div class="col-6 flex fl-end">
                      <!-- <Button label="Thêm mới" icon="pi pi-plus" class="text-end px-3 py-2 font-medium"
                        @click="openNew()" /> -->
                      <Button label="Thêm mới" icon="pi pi-plus" class="ml-3"
                        @click="openAddNew()" />
                      <!--  -->
                    </div>
                  </div>
                </template>
                <Column field="Index" header="#">
                  <template #body="{ index }">
                    {{ index + 1 }}
                  </template>
                </Column>
                <Column field="OpchCode" header="Mã phiếu"></Column>

                <Column :style="{ width: '25%' }" field="CrdName" header="Nhà cung cấp"></Column>
                <Column field="Memo" header="Ghi chú"></Column>
                <Column field="CreatedAt" header="Ngày tạo">
                  <template #body="{ data }">
                    {{ format(data.CreatedAt, "dd/MM/yyyy") }}
                  </template>
                </Column>
                <Column field="CreatorName" header="Người tạo"></Column>
                <Column field="Status" header="Trạng thái">
                  <template #body="{ data }">
                    {{ formatStatus(data.Status) }}
                  </template>
                </Column>
                <Column field="action" style="width: 3rem;">
                  <template #body="slotProps">
                    <!-- <Button icon="pi pi-eye" class="p-button-rounded p-button-text"
                      @click="viewDetail(slotProps.data)" /> -->
                    <Button icon="pi pi-eye" text
                      @click="openDetail(slotProps.data.ID)" />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="dialogCrud" modal header="TẠO MỚI ĐƠN HÀNG MUA" :style="{ width: '1406px' }">
    <!-- Create Modal -->
    <div class="grid grid-nogutter gap-4 mt-1">
      <!-- <div class="col">
        <div class="field">
          <label for="purchaseCode">Mã đơn hàng mua</label>
          <InputText class="bg-gray-300" id="purchaseCode" disabled />
        </div>
      </div> -->
      <div class="col-3">
        <div class="field">
          <label for="firstname">Sao chép danh sách hàng hóa từ</label>
          <Dropdown v-model="selectectPackage" :options="optionsPackage" optionLabel="CmaName"
            placeholder="Chọn gói thầu" class="w-full" />
        </div>
        <div class="field">
          <label for="supplierName">Tên nhà cung cấp</label>
          <Dropdown v-model="selectedSupplierName" @change="onChange"
            :options="selectectPackage ? selectectPackage.CMA1 : []" optionLabel="OcrdName"
            placeholder="Chọn nhà cung cấp" class="w-full" />
        </div>
      </div>
      <div class="col-3">
        <div class="field">
          <label class="p-label" for="recivingUnit">Đơn vị tiếp nhận<sup class="p-important">*</sup></label>
          <Dropdown v-model="recivingUnit" :options="selectectPackage ? selectectPackage.OORS : []"
            optionLabel="OrsName" placeholder="Chọn đơn vị" class="w-full" />
          <!-- <InputText :value="selectectPackage.OORS"></InputText> -->
        </div>
        <div class="field">
          <label for="contactUser">Người liên hệ</label>
          <Dropdown v-if="contactUser" v-model="selectedUser" :options="contactUser.CRD5" optionLabel="FirstName"
            placeholder="Chọn người liên hệ" class="w-full" />
          <Dropdown v-else :options="[]" optionLabel="FirstName" placeholder="Chọn người liên hệ" class="w-full" />
        </div>
      </div>
      <div class="col">
        <div class="field">
          <label for="dayVouchers">Ngày chứng từ</label>
          <Calendar class="w-full" placeholder="DD/MM/YYYY" v-model="selectDateDocument" dateFormat="dd/mm/yy" />
        </div>
        <div class="field">
          <label for="firstname">Trạng thái</label>
          <Dropdown :options="[]" optionLabel="contactUser" placeholder="Mở" class="w-full" />
        </div>
      </div>
      <div class="col">
        <div class="field">
          <label for="deliveryDate">Ngày giao hàng</label>
          <Calendar class="w-full" placeholder="DD/MM/YYYY" v-model="selectDateDelivery" dateFormat="dd/mm/yy" />
        </div>
      </div>
      <div class="my-2 w-full">
        <TabView>
          <!-- Nội dung -->
          <TabPanel header="Nội dung">
            <DataTable :value="selectectPackage ? selectectPackage.CMA2 : []" tableStyle="min-width: 50rem">
              <Column field="Index" header="#">
                <template #body="{ index }">
                  {{ index + 1 }}
                </template>
              </Column>
              <Column field="ID" header="Mã hàng hóa">

              </Column>
              <Column field="ItemName" header="Tên hàng hóa"></Column>
              <Column field="UomName" header="Đơn vị tính"></Column>
              <Column field="Quantity" header="Số lượng"></Column>
              <Column field="Memo" header="Ghi chú">
                <template #body="slotProps">
                  <InputText v-model="slotProps.data.Memo" size="small" :style="{ width: '250px' }" type="text" />
                </template>
              </Column>
              <Column field="quantity" header="Tài liệu đính kèm">
              </Column>
            </DataTable>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-semibold" for="noteContent">Ghi chú</label>
              <Textarea v-model="note" id="noteContent" rows="5" cols="30" />
            </div>
            <div class="flex p-2 gap-2 align-items-center">
              <label for="status">Trạng thái</label>
              <InputSwitch v-model="statusSwitch" id="status" />
            </div>
          </TabPanel>
          <TabPanel header="Chứng từ đính kèm"> </TabPanel>
          <TabPanel header="Giao nhận"> </TabPanel>
        </TabView>
      </div>
    </div>
    <!-- <div class="flex justify-content-end gap-2">
      
    </div> -->
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
      <Button type="button" label="Tạo phiếu nhập kho" @click="saveData()"></Button>
    </template>
  </Dialog>

  <!-- View Modal -->
  <Dialog v-model:visible="dialogView" modal :header="'Đơn hàng mua - ' + dataView.OpchCode"
    :style="{ width: '1406px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="grid grid-nogutter gap-4 mt-1">
      <div class="col">
        <div class="field">
          <label for="purchaseCode">Mã đơn hàng mua</label>
          <InputText v-model="dataView.OpchCode" class="bg-gray-300" id="purchaseCode" disabled />
        </div>
      </div>
      <div class="col-2">
        <div class="field">
          <label for="firstname">Sao chép danh sách hàng hóa từ</label>
          <InputText v-model="dataView.CrdName"></InputText>

        </div>
        <div class="field">
          <label for="supplierName">Tên nhà cung cấp</label>
          <InputText v-model="dataView.CrdName"></InputText>

        </div>
      </div>
      <div class="col-3">
        <div class="field">
          <label class="p-label" for="recivingUnit">Đơn vị tiếp nhận<sup class="p-important">*</sup></label>
          <InputText v-model="dataView.OrsName" class="w-full"></InputText>

        </div>
        <div class="field">
          <label for="contactUser">Người liên hệ</label>
          <InputText class="w-full" v-model="dataView.Crd6Name"></InputText>

        </div>
      </div>
      <div class="col">
        <div class="field">
          <label for="dayVouchers">Ngày chứng từ</label>
          <Calendar class="w-full" placeholder="DD/MM/YYYY" v-model="dataView.DocDate" dateFormat="dd/mm/yy" />
        </div>
        <div class="field">
          <label for="firstname">Trạng thái</label>
          <Dropdown :options="[]" optionLabel="contactUser" placeholder="Mở" class="w-full" />
        </div>
      </div>
      <div class="col">
        <div class="field">
          <label for="deliveryDate">Ngày giao hàng</label>
          <Calendar class="w-full" placeholder="DD/MM/YYYY" v-model="dataView.DeliveryTime" dateFormat="dd/mm/yy" />
        </div>
      </div>
      <div class="my-2 w-full">
        <TabView>
          <!-- Nội dung -->
          <TabPanel header="Nội dung">
            <DataTable :value="dataView.PCH2" tableStyle="min-width: 50rem">
              <Column field="Index" header="#">
                <template #body="{ index }">
                  {{ index + 1 }}
                </template>
              </Column>
              <Column field="ItemCode" header="Mã hàng hóa">
              </Column>
              <Column class="w-15rem" field="ItemName" header="Tên hàng hóa">

              </Column>
              <Column field="UomName" header="Đơn vị tính"> </Column>
              <Column field="Quantity" header="Số lượng">
              </Column>
              <Column field="Memo" header="Ghi chú">
                <template #body="slotProps">
                  <InputText v-model="slotProps.data.Memo" :style="{ height: '35px' }"></InputText>
                </template>
              </Column>
              <Column field="quantity" header="Tài liệu đính kèm"> </Column>
            </DataTable>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-semibold" for="noteContent">Ghi chú</label>
              <Textarea v-model="dataView.Memo" id="noteContent" rows="5" cols="30" />
            </div>
            <div class="flex p-2 gap-2 align-items-center">
              <label for="status">Trạng thái</label>
              <InputSwitch v-model="statusSwitch" id="status" />
            </div>
          </TabPanel>
          <TabPanel header="Chứng từ đính kèm"> </TabPanel>
          <TabPanel header="Giao nhận"> </TabPanel>
        </TabView>
      </div>
    </div>
    <div class="flex justify-content-end gap-2">
      <!-- <Button type="button" label="Tạo phiếu nhập kho" @click="saveData()"></Button> -->
    </div>
  </Dialog>
<!-- ======================= Sửa ============================== -->
<Dialog v-model:visible="visible1" modal header="TẠO MỚI ĐƠN HÀNG MUA" :style="{ maxWidth: '100rem' }">
<div class="grid pt-1">
  <div class="col-12 md:col-2 flex gap-2 flex-column">
    <label class="p-label">Mã gói thầu:</label>
    <InputText style="background-color: var(--disabled-background);" :value="selectedOCMA ? selectedOCMA.CmaCode : ''" readonly></InputText>
  </div>
  <div class="col-12 md:col-4 flex gap-2 flex-column">
    <label for="id-1" class="p-label">Sao chép danh sách hàng hóa từ: <sup class="p-important font-bold">*</sup></label>
    <Dropdown :class="invalidField1" id="id-1" @change="onChangeOCMA" v-model="selectedOCMA" :options="OCMA_List" optionLabel="CmaName">
      <!-- <template #value="slotProps">
        {{ slotProps.option.CmaCode }} - {{ slotProps.option.CmaName }}
      </template> -->
      <template #option="slotProps">
        {{ slotProps.option.CmaCode }} - {{ slotProps.option.CmaName }}
      </template>
    </Dropdown>
    <small class="p-error">{{ errorMessage.CmaCode }}</small>
  </div>
  <div class="col-12 md:col-4 flex gap-2 flex-column">
    <label class="p-label">Chọn nhà cung cấp: <sup class="p-important font-bold">*</sup></label>
    <Dropdown :class="invalidField2" @change="onChangeSupplier" v-model="CMA1" :disabled="!selectedOCMA.CmaCode" :options="CMA1_List" optionLabel="Ocrd.CardName">
    </Dropdown>
    <small class="p-error">{{ errorMessage.CMA1 }}</small>
  </div>
  <div class="col-12 md:col-2 flex gap-2 flex-column">
    <label class="p-label">Chọn người liên hệ: <sup class="p-important font-bold">*</sup></label>
    <Dropdown :class="invalidField3" v-model="contactSelected" :disabled="!CMA1" :options="contact_list" optionLabel="FirstName"></Dropdown>
    <small class="p-error">{{ errorMessage.Contact }}</small>
  </div>
  <div class="col-12 md:col-3 flex gap-2 flex-column">
    <label for="date1" class="p-label">Ngày chứng từ: <sup class="p-important font-bold">*</sup></label>
    <Calendar :class="invalidField4" dateFormat="dd/mm/yy" v-model="ngayChungTu" inputId="date1" />
    <small class="p-error">{{ errorMessage.ngayChungTu }}</small>
  </div>
  <div class="col-12 md:col-3 flex gap-2 flex-column">
    <label for="date2" class="p-label">Ngày giao hàng: <sup class="p-important font-bold">*</sup></label>
    <Calendar :class="invalidField5" dateFormat="dd/mm/yy" v-model="ngayGiaoHang" inputId="date2" />
    <small class="p-error">{{ errorMessage.ngayGiaoHang }}</small>
  </div>
  <div class="col-12 md:col-4 flex gap-2 flex-column">
    <label class="p-label">Đơn vị tiếp nhận:</label>
    <InputText :value="selectedOCMA ? selectedOCMA.OORS[0].OrsName : ''"></InputText>
  </div>
  <div class="col-12 md:col-2 flex gap-2 flex-column">
    <label class="p-label">Trạng thái:</label>
    <InputText style="background-color: var(--disabled-background);" value="Mở" readonly></InputText>
  </div>
</div>
<!-- {{ selectedOCMA }} -->
<TabView class="border border-300 border-1 border border-round p-1 my-3">
  <TabPanel header="Nội dung">
    <DataTable :value="item_list" showGridlines>
      <Column field="code" header="Mã" style="width: 10rem;"></Column>
      <Column field="name" header="Tên vật tư, hàng hoá"></Column>
      <Column field="price" sortable header="Đơn giá" style="width: 10rem; text-align: right;">
        <template #body="sp">
          {{ getCurrencyLabel(sp.data.price) }}
        </template>
      </Column>
      <Column field="quantity" sortable header="Số lượng" style="width: 10rem; text-align: center;"></Column>
      <Column field="unit" header="Đơn vị tính" style="width: 10rem;"></Column>
      <Column header="Tài liệu đính kèm" style="width: 7rem; text-align: center;">
        <template #body="sp">
          <Button :disabled="!sp.data.docs" @click="openViewDocs(sp.data.docs)" icon="pi pi-external-link" text></Button>
        </template>
      </Column>
      <template #empty>
        <span class="flex justify-content-center p-3">
          Dữ liệu trống
        </span>
      </template>
    </DataTable>
  </TabPanel>
  <TabPanel header="Chứng từ đính kèm"></TabPanel>
  <TabPanel header="Giao nhận"></TabPanel>
</TabView>
<div class="grid">
  <div class="col-12 flex flex-column gap-2">
    <label for="text-area">Ghi chú:</label>
    <Textarea v-model="Memo" class="w-full" id="text-area" rows="3"></Textarea>
  </div>
</div>
<template #footer>
  <!-- <Button icon="pi pi-info" label="Log" outlined @click="_logger()"></Button> -->
  <Button icon="pi pi-times" @click="visible1 = false" label="Đóng" outlined></Button>
  <Button icon="pi pi-save" label="Lưu" @click="sentData" :loading="loading1"></Button>
</template>
</Dialog>
<Dialog v-model:visible="visible3" header="Chi tiết đơn hàng" modal :style="{ width: '100rem' }">
  <template #header>
    <div>
      <span class="font-bold text-xl">ĐƠN HÀNG MUA: {{ viewModel.OpchCode }}</span>
    </div>
  </template>
  <div class="grid pt-1">
    <!-- <div class="col-12 md:col-2 flex gap-2 flex-column">
      <label class="p-label">Mã gói thầu:</label>
      <InputText :value="``" readonly></InputText>
    </div>
    <div class="col-12 md:col-4 flex gap-2 flex-column">
      <label class="p-label">Tên gói thầu:</label>
      <InputText :value="viewModel.CopyFrom" readonly></InputText>
    </div> -->
    <div class="col-12 md:col-4 flex gap-2 flex-column">
      <label class="p-label">Nhà cung cấp:</label>
      <InputText :value="viewModel.CrdName" readonly></InputText>
    </div>
    <div class="col-12 md:col-2 flex gap-2 flex-column">
      <label class="p-label">Người liên hệ:</label>
      <InputText :value="'--Đang đợi sửa!--'" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Ngày chứng từ:</label>
      <InputText :value="formatDate(viewModel.DocDate)" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Ngày giao hàng:</label>
      <InputText :value="formatDate(viewModel.DeliveryTime)" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Đơn vị tiếp nhận:</label>
      <InputText :value="viewModel.OrsName" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Người tạo:</label>
      <InputText :value="viewModel.CreatorName" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Ngày tạo:</label>
      <InputText :value="formatDate(viewModel.CreatedAt)" readonly></InputText>
    </div>
    <div class="col-12 md:col-3 flex gap-2 flex-column">
      <label class="p-label">Trạng thái:</label>
      <InputText :value="getStatusLabel(viewModel.Status)" readonly></InputText>
    </div>
  </div>
  <TabView class="border border-300 border-1 border border-round p-1 my-3">
    <TabPanel header="Nội dung">
      <DataTable showGridlines :value="viewModel.PCH2">
        <Column header="#" style="width: 2rem;">
          <template #body="sp">
            {{ sp.index + 1 }}
          </template>
        </Column>
        <Column field="ItemCode" header="Mã" style="width: 10rem;"></Column>
        <Column field="ItemName" header="Tên vật tư, hàng hoá"></Column>
        <Column sortable field="UnitPrice" header="Đơn giá" style="width: 10rem; text-align: right;">
          <template #body="sp">
            {{ getCurrencyLabel(sp.data.UnitPrice) }}
          </template>
        </Column>
        <Column sortable field="Quantity" header="Số lượng" style="width: 10rem; text-align: center;"></Column>
        <Column field="UomName2" header="Đơn vị tính" style="width: 10rem;"></Column>
      </DataTable>
    </TabPanel>
    <TabPanel header="Chứng từ đính kèm">

    </TabPanel>
    <TabPanel header="Giao nhận">

    </TabPanel>
  </TabView>
  <div class="grid">
    <div class="col-12 flex flex-column gap-2">
      <label for="text-area">Ghi chú:</label>
      <Textarea :value="viewModel.Memo" class="w-full" id="text-area" rows="3" readonly></Textarea>
    </div>
  </div>
  <template #footer>
    <Button icon="pi pi-times" @click="visible3 = false" label="Đóng" outlined></Button>
    <Button  :disabled="viewModel.Status == 'C'" icon="pi pi-forward" @click="directToPR(viewModel.ID )" label="Tạo phiếu nhập kho"></Button>
  </template>
</Dialog>
<!-- ======================= Sửa ============================== -->
  <Toast position="bottom-right" group="br" />
</template>
<script setup>
import { ref, onBeforeMount, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import API from "../../apis/api";
import { useToast } from "primevue/usetoast";
import { format } from "date-fns";
const toast = useToast();
// ======================== TUẤN FIX =============================

const onSearch = () => {
  params.value = {
    page: 1,
    size: 10,
    q: searchKey.value
  }
  getData();
}


const _logger = () => {
  // console.log(OCMA.value.CMA1)
  console.log(modelState.CMA1.Ocrd.ID);
  const temp = tinhDiem(OCMA.value);
  const sup_id = CMA1.value.Ocrd.ID;
  const items = filterItemsWin(sup_id,temp);
  console.log(items);
}

const directToPR = (id) => {
  router.push({
    path: "/purchase-receipt",
    query: {
      po_id: id
    }
  })
}

const resetForm = () => {
  selectedOCMA.value = {
    CmaCode: null,
    OORS: [{OrsName: null}]
  };
  ngayChungTu.value = null;
  ngayGiaoHang.value = null;
  contactSelected.value = null;
  Memo.value = null;
  CMA1.value = null;
  item_list.value = [];
}

const viewModel = reactive({

});
const visible3 = ref(false);
const openDetail = async (id) => {
  Object.keys(viewModel).forEach(key => {
    viewModel[key] = null;
  })
  const res = await API.getAsync('opch/getbyid',{
    id: id
  });
  Object.assign(viewModel,res.data);
  visible3.value = true;
}

const CMA1 = ref();
const visible1 = ref(false);

const Memo = ref();
const ngayChungTu = ref();
const ngayGiaoHang = ref();
const selectedOCMA = ref();
const OCMA_List = ref([]);
const contactSelected = ref();

const loading1 = ref(false);



const errorMessage = reactive({
  CmaCode: null,
  CMA1: null,
  Contact: null,
  ngayChungTu: null,
  ngayGiaoHang: null
});
const resetErrorMessage = () => {
  Object.keys(errorMessage).forEach(key => {
    errorMessage[key] = null;
  });
}

const invalidField1 = computed(() => {
  return {
    'p-invalid': errorMessage.CmaCode
  };
});

const invalidField2 = computed(() => {
  return {
    'p-invalid': errorMessage.CMA1
  };
});

const invalidField3 = computed(() => {
  return {
    'p-invalid': errorMessage.Contact
  };
});
const invalidField4 = computed(() => {
  return {
    'p-invalid': errorMessage.ngayChungTu
  };
});
const invalidField5 = computed(() => {
  return {
    'p-invalid': errorMessage.ngayGiaoHang
  };
});

const validatedField = () => {

  const feild = {
    CmaCode : selectedOCMA.value.CmaCode,
    CMA1 : CMA1.value,
    Contact: contactSelected.value,
    ngayChungTu : ngayChungTu.value,
    ngayGiaoHang : ngayGiaoHang.value
  }

  const isValid = (selectedOCMA.value.CmaCode 
                  && CMA1.value
                  && contactSelected.value
                  && ngayChungTu.value
                  && ngayGiaoHang.value
                );

  if(!selectedOCMA.value.CmaCode){
    errorMessage.CmaCode = 'Vui lòng chọn gói thầu';
  }
  if(!CMA1.value){
    errorMessage.CMA1 = 'Vui lòng chọn nhà cung cấp';
  }
  if(!contactSelected.value){
    errorMessage.Contact = 'Vui lòng chọn người liên hệ';
  }
  if(!ngayChungTu.value){
    errorMessage.ngayChungTu = 'Vui lòng nhập ngày chứng từ';
  }
  if(!ngayGiaoHang.value){
    errorMessage.ngayGiaoHang = 'Vui lòng nhập ngày giao hàng';
  }
  
  // console.log(feild);
  return isValid;
}

const sentData = async () => {

  resetErrorMessage();
  if(!validatedField()){
    // alert('not passed validation')
    showToast('warn', 'Cảnh báo', 'Vui lòng nhập đầy đủ thông tin.')
    return;
  }
  // else{
  //   alert('passed validation')
  //   return;
  // }

  const data = {
    Cma1ID: CMA1.value.ID,
    OrsID: selectedOCMA.value.OORS[0].ID,
    DeliveryTime: ngayGiaoHang.value,
    DocDate: ngayChungTu.value,
    Crd6ID: contactSelected.value.ID,
    Memo: Memo.value || ''
  }
  loading1.value = true;
  try{
    const res = await API.postAsync(api_add_opch,data);
    await openDetail(res.data.ID);
    getData();
    showToast('success', 'Thành công', 'Đã tạo thành công đơn hàng mua');
    visible1.value = false;
  }
  catch(e){
    if(e.response){
      showToast('error', 'Đã có lỗi', e.response.data)
    }
    else{
      showToast('error', 'Đã có lỗi', e.message)
    }
  }

  loading1.value = false;
}

const filterItemsWin = (sup_id, data) => {
  const res = data.filter(el => {
    const r = el.Suppliers.find(el_1 => 
      el_1.Sup_ID === sup_id && el_1.IsWon
    )
    if(r){
      return true;
    }
    else{
      return false;
    }
  });

  if(res.length > 0){
    const r = [];
    res.forEach(el => {
      const obj = {
        code: el.ProductCode,
        name: el.ProductName,
        unit: el.Unit,
        price: el.Suppliers.find(x => x.Sup_ID === sup_id)?.Price,
        quantity: el.Suppliers.find(x => x.Sup_ID === sup_id)?.Quantity,
        docs: el.Suppliers.find(x => x.Sup_ID === sup_id)?.Docs
      }

      r.push(obj);
    })
    return r;
  }
  else{
    return [];
  }
}



const openAddNew = () => {
  resetForm();
  resetErrorMessage();
  visible1.value = true;
}

const CMA1_List = ref([]);
const OCMA = ref();
const onChangeOCMA = async (data) => {
  contactSelected.value = null;
  const res = await API.getAsync('ocma/getbyid',{
    id: data.value.ID
  })
  OCMA.value = res.data;
  CMA1_List.value = res.data.CMA1.filter(el => el.IsWonTheBid);
  item_list.value = [];
}

const contact_list = ref([])
const onChangeSupplier = async (data) => {
  const res = await API.getAsync('ocrd/getbyid',{
    id: data.value.Ocrd.ID
  })
  // console.log(res.data.CRD5);
  contact_list.value = res.data.CRD5;
  
  const temp = tinhDiem(OCMA.value);
  const sup_id = CMA1.value.Ocrd.ID;
  item_list.value = filterItemsWin(sup_id,temp);
}

const item_list = ref([]);

const visible2 = ref(false);
const docs = ref([])
const openViewDocs = (data) => {
  alert(data)
}

onMounted(async () => {
  const res = await API.getAsync(api_get_ocma);
  OCMA_List.value = res.data.data.filter(el => el.Status === 'A');
  const code = route.query['bid-code'];
  if(code){
    openAddNew();
    selectedOCMA.value = OCMA_List.value.find(el => el.CmaCode === code);
    if(selectedOCMA.value){
      const res = await API.getAsync('ocma/getbyid',{
        id: selectedOCMA.value.ID
      });
      OCMA.value = res.data;
      CMA1_List.value = res.data.CMA1.filter(el => el.IsWonTheBid);
    }
  }
})

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
  
});

const tinhDiem = (data) => {
    const result = [];

    data.CMA2.forEach((prdct) => {
        let obj = {
            CMA2_ID: prdct.ID,
            OcmaID: prdct.OcmaID,
            Selected: null,
            ProductCode: prdct.Oitm.ItemCode,
            ProductName: prdct.Oitm.ItemName,
            Quantity: prdct.Quantity,
            TimeRequrement: prdct.TimeNeeded,
            Unit: prdct.UomName,
            Suppliers: data.CMA1.map((x) => {
                let Sup_ID = x.Ocrd.ID;
                let CMA1_ID = x.ID;
                let IsSubmit = x.Status === 'S';
                let GiaCungCap = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).Price : null;
                let SoLuongCungUng = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).QuanCanBeSupp : null;
                let IsWon = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).IsWonTheBid : false;
                let WPL_ID = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).ID : null;
                let Name = x.Ocrd.CardName;
                let TDTH = x.WPL1.find((z) => z.Cma2ID === prdct.ID) ? x.WPL1.find((z) => z.Cma2ID === prdct.ID).FinalLeadTimePoint : 0;
                let DKTT = x.WPL2.FinalPoint;
                let XX = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalOriginPoint : 0;
                let CSBH = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalWarrPolicyPoint : 0;
                let BG = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalPricePoint : 0;
                let Khac = x.WPL3 ? x.WPL3.map((z) => z.FinalPoint).reduce((z, _z) => z + _z, 0) : 0;
                let TongDiem = TDTH + DKTT + XX + CSBH + BG + Khac;
                let Desc = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).Des : '';
                let Docs = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).LinkDocument : '';;
                return {
                    Sup_ID: Sup_ID,
                    WPL_ID: WPL_ID,
                    IsWon: IsWon,
                    Quantity: SoLuongCungUng,
                    CMA1_ID: CMA1_ID,
                    IsSubmit: IsSubmit,
                    Price: GiaCungCap,
                    Name: Name,
                    TDTH: TDTH,
                    DKTT: DKTT,
                    XX: XX,
                    CSBH: CSBH,
                    BG: BG,
                    Khac: Khac,
                    TongDiem: Math.round(TongDiem * 100) / 100,
                    Desc: Desc,
                    Docs: Docs
                };
            })
        };

        result.push(obj);
    });

    // console.log(result);
    return result;
};

const getCurrencyLabel = (value) => {
    if (value) {
        let formater = new Intl.NumberFormat('vi-VI');
        return `${formater.format(value)} đ`
    }
    else {
        return null
    }
}
const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: "br",
        detail: msg,
        life: 3000,
    });
};

function formatDate(str) {
    const date = new Date(str);
    let day = date.getDate();
    let month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    let year = date.getFullYear();

    // Thêm số 0 đứng trước nếu ngày hoặc tháng nhỏ hơn 10
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return day + '/' + month + '/' + year;
}

const getStatusLabel = (str) =>{
  switch (str) {
    case 'O':
      return 'Đang mở';
    case 'C':
      return 'Đã đóng';
    default:
      return 'Unknown';
  }
}

// ======================== TUẤN FIX =============================
// Api ---------------------------
const api_get = "opch/getall";
const api_get_opch = "opch/getbyid";
const api_get_oors = "oors/getall";
const api_get_ocma = "ocma/getall";
const api_get_ocrd = "ocrd/getbyid";
const api_add_opch = "opch/create";
const api_update = "opch/update";
const api_delete = "opch/delete";

const load_data = ref(false);
const dialogCrud = ref(false);
const dialogView = ref(false);
const dataTable = ref([]);
const params = ref({});
const searchKey = ref("")
const route = useRoute()
const router = useRouter();
const selectDateDocument = ref();
const selectDateDelivery = ref();
const selectedSupplierName = ref(null);
const optionsUnit = ref([]);
const note = ref("")
const dataView = ref({});
const optionsPackage = ref([]);
const selectectPackage = ref();
const contactUser = ref([]);
const recivingUnit = ref();
const selectedUser = ref();
const statusSwitch = ref(true)


const onPageChange = (event) => {
  getData(event)
}
const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.originalEvent.rows;
  API.get_all_v2(api_get, {
    data: params.value,
  }).then((res) => {
    load_data.value = false;
    dataTable.value = res.data;
    router.push({
      name: route.name,
      query: {
        ...route.query,
        page: res.data.Page,
        q: searchKey.value
      },
    });
  });
};
const getRecivUnit = () => {
  API.get_all_v2(api_get_oors, {}).then((res) => {
    optionsUnit.value = res.data;
  });
};
const getSupplierName = () => {
  API.get_all_v2(api_get_ocma, {}).then((res) => {
    optionsPackage.value = res.data.data;

  });
};

const saveData = () => {

  const data = {
    Cma1ID: selectectPackage.value.CMA1[0].ID,
    OrsID: recivingUnit.value.ID,
    DeliveryTime: selectDateDelivery.value,
    DocDate: selectDateDocument.value,
    Crd6ID: selectedUser.value.ID,
    Memo: note.value
  };
  try {
    if (data.Cma1ID !== "" && data.OrsID !== "") {
      API.add_new_v2(data, api_add_opch)
        .then((res) => {
          console.log(res.data);
          console.log(data)
          showSuccess();
          getData();
          hideDialog()
        })
        .catch((e) => {
          showError(e.response.data);
        })
    } else {
      showError();
    }
  } catch (err) {
    console.log(err);
    showError();
  }
};
const fetchDetail = () => {
  const id = dataView.value.ID;
  try {
    API.get_all_v2(api_get_opch, {
      data: {
        id: id,
      },
    }).then((res) => {
      dataView.value = res.data;
      console.log(dataView.value.PCH2);
    });
  } catch (err) {
    console.log(err);
  }
};
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Thành công",
    detail: "Đơn hàng đã tạo thành công!",
    group: "br",
    life: 3000,
  });
};
const showError = (e) => {
  toast.add({
    severity: "error",
    summary: "Lỗi",
    group: "br",
    detail: e || "Trường nhập thiếu!",
    life: 3000,
  });
};
const onChange = (event) => {
  const id = event.value.OcrdID;
  API.get_all_v2(api_get_ocrd, {
    data: {
      id: id,
    },
  }).then((res) => {
    contactUser.value = res.data;
    console.log(res.data);
  });
};
const openNew = () => {
  getRecivUnit();
  getSupplierName();
  dialogCrud.value = true;
};
const viewDetail = (data) => {
  dialogView.value = true;
  dataView.value = { ...data };
  fetchDetail();
};
const hideDialog = () => {
  dialogCrud.value = false;
  dialogView.value = false;
};
const formatStatus = (status) => {
  switch (status) {
    case "O":
      return "Đang mở";
    case "C":
      return "Đã đóng";
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

.p-button.p-button-text {
  color: #374151;
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 0.5rem 0.5rem !important;
}
</style>
