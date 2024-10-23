<template>
  <div>
    <div>
      <div class="flex">
        <div class="flex align-items-center mt-0 col-6">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH MỤC PHIẾU NHẬP KHO HÀNG MUA</h5>
        </div>
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
                <div class="flex justify-content-between">
                  <span class="">
                      <!-- <i class="pi pi-search" /> -->
                      <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" style="
                    border-top-right-radius: unset;
                    border-bottom-right-radius: unset;
                  " />
                      <Button icon="pi pi-search" @click="onSearch"
                        style="border-top-left-radius: unset; border-bottom-left-radius: unset"></Button>
                    </span>
                    <!-- <Button label="Thêm mới" severity="help" icon="pi pi-plus" class="text-end px-3 py-2 font-medium"
                      @click="openNew()" /> -->
                    <Button :label="$t('Button.AddNew')" icon="pi pi-plus" class="text-end px-3 py-2 font-medium"
                      @click="openCreateNew()" />
                </div>
              </template>
              <Column field="Index" header="#">
                <template #body="{ index }">
                  {{ index + 1 }}
                </template>
              </Column>
              <Column :style="{ width: '25%' }" field="CrdName" header="Nhà cung cấp"></Column>
              <Column field="Memo" header="Ghi chú"></Column>
              <Column field="CreatedAt" header="Ngày tạo">
                <template #body="{ data }">
                  <div>
                    {{ getTimeLabel(data.CreatedAt, "date") }}
                  </div>
                </template>
              </Column>
              <Column field="CreatorName" header="Người tạo"></Column>
              <Column field="Status" header="Trạng thái">
                <template #body="{ data }">
                  {{ formatStatus(data.Status) }}
                </template>
              </Column>
              <Column style="width: 3rem;">
                <template #body="slotProps">
                  <!-- <Button icon="pi pi-eye" class="p-button-rounded p-button-text"
                    @click="viewDetail(slotProps.data.ID)" /> -->
                  <Button icon="pi pi-eye" text @click="openViewDetail(slotProps.data.ID)" />
                  <!--  -->
                </template>
              </Column>
            </DataTable>
          </div>
          <!-- Crud -->
          <Dialog v-model:visible="dialogCrud" modal :header="'Tạo mới phiếu nhập kho hàng mua'.toUpperCase()"
            :style="{ width: '1406px' }">
            <!-- Create Modal -->
            <div class="grid grid-nogutter gap-4 mt-1">
              <div class="col">
                <div class="field">
                  <label for="purchaseReceiptCode">Mã phiếu</label>
                  <InputText class="bg-gray-300" id="purchaseReceiptCode" disabled />

                </div>
              </div>
              <div class="col-2">
                <div class="field">
                  <label for="CopyFrom">Sao chép danh sách hàng hóa từ</label>
                  <Dropdown id="CopyFrom" @change="onChange" v-model="selectedCopyFrom" :options="listCopyFrom"
                    optionLabel="OpchCode" placeholder="Chọn gói thầu" class="w-full" />
                </div>
                <div class="field">
                  <label for="supplierName">Tên nhà cung cấp</label>
                  <InputText v-if="selectedCopyFrom" v-model="supplierName" id="supplierName" />
                  <InputText v-else id="supplierName" />
                </div>
              </div>
              <div class="col-3">
                <div class="field">
                  <label class="p-label" for="recivingUnit">Đơn vị tiếp nhận<sup class="p-important">*</sup></label>
                  <InputText class="w-full" v-model="recivingUnit" id="recivingUnit" />
                </div>
                <div class="field">
                  <label for="contactUser">Người liên hệ</label>
                  <InputText class="w-full" v-if="selectedCopyFrom" v-model="selectedCopyFrom.Crd6Name"
                    id="recivingUnit" />
                  <InputText class="w-full" v-else id="recivingUnit" />
                </div>
              </div>
              <div class="col">
                <div class="field">
                  <label for="dayVouchers">Ngày chứng từ</label>
                  <Calendar v-model="DocDate" class="w-full" placeholder="DD/MM/YYYY" dateFormat="dd/mm/yy" />
                </div>
                <div class="field">
                  <label for="firstname">Trạng thái</label>
                  <Dropdown :options="[]" optionLabel="contactUser" placeholder="Mở" class="w-full" />
                </div>
              </div>
              <div class="col">
                <div class="field">
                  <label for="deliveryDate">Ngày nhập kho</label>
                  <Calendar v-model="ReceiptDate" class="w-full" placeholder="DD/MM/YYYY" dateFormat="dd/mm/yy" />
                </div>
              </div>
              <div class="my-2 w-full">
                <TabView>
                  <!-- Nội dung -->
                  <TabPanel header="Nội dung">
                    <DataTable v-model:selection="selectedProduct" :value="crudTable"
                      tableStyle="min-width: 50rem white-space-nowrap overflow-x-auto">
                      <Column selectionMode="multiple"></Column>
                      <Column field="Index" header="#">
                        <template #body="{ index }">
                          {{ index + 1 }}
                        </template>
                      </Column>
                      <Column field="ItemCode" header="Mã hàng hóa"></Column>
                      <Column class="w-20rem" field="ItemName" header="Tên hàng hóa"></Column>
                      <Column field="UomName" header="Đơn vị tính">

                      </Column>
                      <Column field="OpenQuantity" header="Số lượng">
                        <template #body="slotProps">
                          <InputText :style="{ height: '35px', width: '5rem' }" v-model="slotProps.data.OpenQuantity">
                          </InputText>
                        </template>
                      </Column>
                      <Column field="Memo" header="Ghi chú">
                        <template #body="slotProps">
                          <InputText v-model="slotProps.data.Memo" :style="{ height: '35px', width: '200px' }">
                          </InputText>
                        </template>
                      </Column>
                      <Column field="file" header="Tài liệu đính kèm"></Column>
                      <Column field="LotNumber" header="Số lô"></Column>
                      <Column field="quantity" header="Hạn sử dụng">
                        <template #body="slotProps">
                          <Calendar v-model="slotProps.data.ReceiptDate" class="w-full" :style="{ height: '35px' }"
                            placeholder="DD/MM/YYYY" dateFormat="dd/mm/yy" />
                        </template>
                      </Column>
                    </DataTable>
                    <div class="flex flex-column gap-2 p-2">
                      <label class="font-semibold" for="noteContent">Ghi chú</label>
                      <Textarea v-model="Memo" id="noteContent" rows="5" cols="30" />
                    </div>
                    <div class="flex p-2 gap-2 align-items-center">
                      <label for="status">Trạng thái</label>
                      <InputSwitch v-model="statusSwitch" id="status" />
                    </div>
                  </TabPanel>
                  <TabPanel header="Chứng từ đính kèm"> </TabPanel>
                </TabView>
              </div>
            </div>
            <div class="flex justify-content-end gap-2">
              <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
              <Button type="button" label="Tạo phiếu nhập kho" @click="saveData()"></Button>
            </div>
          </Dialog>

          <!-- View Detail -->
          <Dialog v-model:visible="dialogView" modal header="Chi tiết phiếu nhập kho hàng mua"
            :style="{ width: '1406px' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <div class="grid grid-nogutter gap-4 mt-1">
              <div class="col">
                <div class="field">
                  <label for="purchaseCode">Mã phiếu</label>
                  <InputText v-model="dataView.GrpoCode" class="bg-gray-300" id="purchaseCode" disabled />
                </div>
              </div>
              <div class="col-2">
                <div class="field">
                  <label for="firstname">Sao chép danh sách hàng hóa từ</label>
                  <InputText v-model="dataView.CopyFrom" disabled></InputText>
                </div>
                <div class="field">
                  <label for="supplierName">Tên nhà cung cấp</label>
                  <InputText v-model="dataView.CrdName" disabled></InputText>
                </div>
              </div>
              <div class="col-3">
                <div class="field">
                  <label class="p-label" for="recivingUnit">Đơn vị tiếp nhận<sup class="p-important">*</sup></label>
                  <InputText v-model="dataView.OrsName" class="w-full" disabled></InputText>

                </div>
                <div class="field">
                  <label for="contactUser">Người liên hệ</label>
                  <InputText v-model="dataView.Crd6Name" class="w-full" disabled></InputText>

                </div>
              </div>
              <div class="col">
                <div class="field">
                  <label for="dayVouchers">Ngày chứng từ</label>
                  <Calendar v-model="dataView.DocDate" class="w-full" placeholder="DD/MM/YYYY" dateFormat="dd/mm/yy"
                    disabled />
                </div>
                <div class="field">
                  <label for="firstname">Trạng thái</label>
                  <Dropdown :options="[]" optionLabel="contactUser" placeholder="Mở" class="w-full" disabled />
                </div>
              </div>
              <div class="col">
                <div class="field">
                  <label for="importDate">Ngày nhập kho</label>
                  <Calendar class="w-full" v-model="dataView.ReceiptDate" placeholder="DD/MM/YYYY" dateFormat="dd/mm/yy"
                    disabled />
                </div>
              </div>
              <div class="my-2 w-full">
                <TabView>
                  <!-- Nội dung -->
                  <TabPanel header="Nội dung">
                    <DataTable :value="dataView.GRP2" tableStyle="min-width: 50rem">
                      <Column field="Index" header="#">
                        <template #body="{ index }">
                          {{ index + 1 }}
                        </template>
                      </Column>
                      <Column field="ItemCode" header="Mã hàng hóa">

                      </Column>
                      <Column field="ItemName" header="Tên hàng hóa">

                      </Column>
                      <Column field="UomName" header="Đơn vị tính"></Column>
                      <Column field="OpenQuantity" header="Số lượng">

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
                      <Textarea id="noteContent" rows="5" cols="30" />
                    </div>
                    <div class="flex p-2 gap-2 align-items-center">
                      <label for="status">Trạng thái</label>
                      <InputSwitch v-model="statusSwitch" id="status" />
                    </div>
                  </TabPanel>
                  <TabPanel header="Chứng từ đính kèm"></TabPanel>
                </TabView>
              </div>
            </div>
            <div class="flex justify-content-end gap-2">
              <Button type="button" label="Tạo phiếu nhập kho" @click="saveData()"></Button>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="visible1" header="TẠO MỚI PHIẾU NHẬP KHO HÀNG MUA" modal :style="{ width: '100rem' }">
    <div class="grid mt-0 mb-3">
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Mã phiếu</label>
        <InputText placeholder="NK[xxxxxx]" readonly></InputText>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Sao chép danh sách hàng hóa từ<sup class="p-important">*</sup></label>
        <Dropdown
          :loading="loadingPO"
          optionLabel="OpchCode"
          optionValue="ID"
          placeholder="Chọn đơn mua hàng"
          :options="PO_data"
          v-model="modelState.po_id"
          @change="onPOChange"
          :class="getClass1(errorMessage.po_id&&!modelState.po_id)"/>
        <small v-if="!modelState.po_id" class="p-error">{{ errorMessage.po_id }}</small>
      </div>
      <div class="col-12 md:col-3 flex flex-column gap-2">
        <label class="p-label">Ngày chứng từ<sup class="p-important">*</sup></label>
        <Calendar v-model="modelState.docs_date" dateFormat="dd/mm/yy" :class="getClass1(errorMessage.docs_date && !modelState.docs_date)"></Calendar>
        <small v-if="!modelState.docs_date" class="p-error">{{ errorMessage.docs_date }}</small>
      </div>
      <div class="col-12 md:col-3 flex flex-column gap-2">
        <label class="p-label">Ngày nhập kho<sup class="p-important">*</sup></label>
        <Calendar v-model="modelState.stock_entry_date" dateFormat="dd/mm/yy" :class="getClass1(errorMessage.stock_entry_date && !modelState.stock_entry_date)"></Calendar>
        <small v-if="!modelState.stock_entry_date" class="p-error">{{ errorMessage.stock_entry_date }}</small>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Tên nhà cung cấp</label>
        <InputText :value="modelState.supplier_name" readonly></InputText>
      </div>
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Người liên hệ</label>
        <InputText readonly></InputText>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Đơn vị tiếp nhận</label>
        <InputText :value="modelState.org_name" readonly></InputText>
      </div>
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Trạng thái</label>
        <InputText v-model="modelState.status" readonly></InputText>
      </div>
    </div>
    <div class="border-300 border-1 border-round p-1">
      <TabView>
        <TabPanel header="Nội dung">
          <DataTable size="small" v-model:selection="modelState.selected_items" :value="modelState.PCH2" showGridlines>
            <ColumnGroup type="header">
              <Row>
                <Column selectionMode="multiple" class="p-3" style="width: 3rem;" rowspan="2"></Column>
                <Column header="Mã hàng hoá" rowspan="2"></Column>
                <Column header="Tên hàng hoá" rowspan="2"></Column>
                <Column colspan="2">
                  <template #header>
                      <label class="p-label w-full text-center">Số lượng</label>
                  </template>
                </Column>
                <Column header="Đơn vị tính" rowspan="2"></Column>
                <Column header="Số lô" rowspan="2"></Column>
                <Column header="Hạn sử dụng" rowspan="2"></Column>
              </Row>
              <Row>
                <Column>
                  <template #header>
                    <label class="p-label w-full text-center">Chứng từ</label>
                  </template>  
                </Column>
                <Column>
                  <template #header>
                    <label class="p-label w-full text-center">Thực nhập</label>
                  </template>    
                </Column>
              </Row>
            </ColumnGroup>
            <Column selectionMode="multiple" class="p-3"></Column>
            <Column field="ItemCode" header="Mã hàng hoá"></Column>
            <Column field="ItemName" header="Tên hàng hoá"></Column>
            <Column header="Chứng từ" style="width: 10rem;">
              <template #body="slotProps">
                <!-- <InputNumber class="custome_n_input" v-model="slotProps.data.DocQuantity"
                  showButtons
                  :min="0"
                  :disabled="!modelState.selected_items.find(x => x.ID == slotProps.data.ID)"
                  :max="slotProps.data.OpenQuantity"
                ></InputNumber> -->
                <div class="flex justify-center">
                  {{ slotProps.data.OpenQuantity }}
                </div>
              </template>  
            </Column>
            <Column header="Thực nhập" style="width: 10rem;">
              <template #body="slotProps">
                <InputNumber class="custome_n_input" v-model="slotProps.data.IQuantity"
                  showButtons
                  :min="0"
                  :disabled="!modelState.selected_items.find(x => x.ID == slotProps.data.ID)"
                  :max="slotProps.data.OpenQuantity"
                >
                </InputNumber>
              </template>
            </Column>
            <Column field="UomName" header="Đơn vị tính" style="width: 8rem;"></Column>
            <!-- <Column header="Ghi chú"></Column> -->
            <Column header="Số lô"></Column>
            <Column header="Hạn sử dụng" style="width: 10rem;">
              <template #body="slotProps">
                <Calendar
                  :disabled="!modelState.selected_items.find(x => x.ID == slotProps.data.ID)"
                  v-model="slotProps.data.ExpiryDate" dateFormat="dd/mm/yy"></Calendar>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel header="Chứng từ đính kèm">
          Tính năng đang phát triển
        </TabPanel>
      </TabView>
      
    </div>
    <div class="mt-3">
      <span>Ghi chú</span>
      <Textarea v-model="modelState.memo" class="w-full mt-2" rows="3"></Textarea>
    </div>
    <template #footer>
      <Button icon="pi pi-times" label="Huỷ" @click="visible1 = false" outlined></Button>
      <Button icon="pi pi-save" label="Hoàn tất" @click="createNewReceipt()"></Button>
    </template>
  </Dialog>
  <Dialog v-model:visible="visible2" header="CHI TIẾT PHIẾU NHẬP KHO" modal :style="{ width: '100rem' }">
    <div class="grid mt-0 mb-3">
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Mã phiếu</label>
        <InputText :value="modelView.GrpoCode" readonly></InputText>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Sao chép danh sách hàng hóa từ</label>
        <InputText :value="modelView.CopyFrom" readonly></InputText>
      </div>
      <div class="col-12 md:col-3 flex flex-column gap-2">
        <label class="p-label">Ngày chứng từ</label>
        <InputText :value="getTimeLabel(modelView.DocDate, 'date')" readonly></InputText>
      </div>
      <div class="col-12 md:col-3 flex flex-column gap-2">
        <label class="p-label">Ngày nhập kho</label>
        <InputText :value="getTimeLabel(modelView.DeliveryTime, 'date')" readonly></InputText>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Tên nhà cung cấp</label>
        <InputText :value="modelView.CrdName" readonly></InputText>
      </div>
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Người liên hệ</label>
        <InputText :value="modelView.NLH" readonly></InputText>
      </div>
      <div class="col-12 md:col-4 flex flex-column gap-2">
        <label class="p-label">Đơn vị tiếp nhận</label>
        <InputText :value="modelView.OrsName" readonly></InputText>
      </div>
      <div class="col-12 md:col-2 flex flex-column gap-2">
        <label class="p-label">Trạng thái</label>
        <InputText :value="modelView.Status" readonly>
          
        </InputText>
      </div>
    </div>
    <div class="border-1 border-300 border-round p-1">
      <TabView>
        <TabPanel header="Nội dung">
          <DataTable :value="modelView.GRP2" showGridlines size="small">
            <ColumnGroup type="header">
              <Row>
                <Column header="#" rowspan="2"></Column>
                <Column header="Mã hàng hoá" rowspan="2"></Column>
                <Column header="Tên hàng hoá" rowspan="2"></Column>
                <Column colspan="2">
                  <template #header>
                      <label class="p-label w-full text-center">Số lượng</label>
                  </template>
                </Column>
                <Column header="Đơn vị tính" rowspan="2"></Column>
                <Column header="Số lô" rowspan="2"></Column>
                <Column header="Hạn sử dụng" rowspan="2"></Column>
              </Row>
              <Row>
                <Column>
                  <template #header>
                    <label class="p-label w-full text-center">Chứng từ</label>
                  </template>  
                </Column>
                <Column>
                  <template #header>
                    <label class="p-label w-full text-center">Thực nhập</label>
                  </template>    
                </Column>
              </Row>
            </ColumnGroup>
            <Column header="#">
              <template #body="sp"> {{ ++sp.index }} </template>
            </Column>
            <Column field="ItemCode" header="Mã hàng hoá"></Column>
            <Column field="ItemName" header="Tên hàng hoá"></Column>
            <Column field="Quantity" header="Theo chứng từ" style="text-align: center;"></Column>
            <Column field="OpenQuantity" header="Thực nhập" style="text-align: center;"></Column>
            <Column field="UomName" header="Đơn vị tính"></Column>
            <Column header="Số lô"></Column>
            <Column header="Hạn sử dụng" style="width: 10rem;">
              <template #body="sp">
                {{ getTimeLabel(sp.data.Expiry, 'date') }}
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel header="Chứng từ đính kèm">
          Tính năng đang phát triển
        </TabPanel>
      </TabView>
    </div>
    <div class="flex flex-column mt-3 gap-2">
      <label class="p-label">Ghi chú</label>
      <Textarea class="w-full" rows="3" readonly></Textarea>
    </div>
  </Dialog>
  <Toast position="bottom-right" group="br" />
</template>
<script setup>
import { ref, onBeforeMount, onMounted, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import API from "../../apis/api";
import { formatDate } from "date-fns";

const toast = useToast()
const load_data = ref(true)
const dialogCrud = ref(false)
const dialogView = ref(false)
const selectedProduct = ref()
const dataView = ref({})
const dataTable = ref([])
const listCopyFrom = ref([])
const searchKey = ref("")
const selectedCopyFrom = ref()
const params = ref({})
const route = useRoute()
const router = useRouter();
const crudTable = ref([])
const recivingUnit = ref("")
const supplierName = ref("")
const DocDate = ref("")
const ReceiptDate = ref("")
const Memo = ref("")
const statusSwitch = ref(true)
// ====================== API ========================================================
const get_all_opch = "opch/getall"
const get_by_id_opch = "opch/getbyid"
const get_all_grpo = "grpo/getall"
const api_add_grpo = "grpo/create"
const get_grpo_byid = "grpo/getbyid"

// ====================== FIXED BY TUẤN ==============================================

const onSearch = () => {
  params.value = {
    page: 1,
    size: 10,
    q: searchKey.value
  }
  fetchAllGrpo();
}

const visible1 = ref(false);
const modelState = reactive({
  status: 'Mở',
  docs_date: null,
  stock_entry_date: null,
  po_id: null,
  supplier_name: null,
  org_name: null,
  PCH2: [],
  selected_items: [],
  memo: null,
});

const modelView = reactive({
  CrdID: null,
  GrpoCode: null,
  Memo: null,
  CrdName: null,
  ReceiptDate: null,
  DocDate: null,
  OrsName: null,
  DeliveryTime: null,
  CreatorName: null,
  Status: null,
  CopyFrom: null,
  GRP2: null
});

const errorMessage = reactive({
  docs_date: null,
  stock_entry_date: null,
  po_id: null
});
const visible2 = ref(false);
const openViewDetail = async (id) => {
  Object.keys(modelView).forEach(key => modelView[key] = null);
  visible2.value = true;
  const res = await API.getAsync(get_grpo_byid, { id });
  Object.assign(modelView, {...res.data});
  console.log(res);
};

const validateField = () => {
  const isValid = modelState.po_id && modelState.docs_date && modelState.stock_entry_date;
  if(!modelState.po_id)
    errorMessage.po_id = 'Hãy chọn đơn hàng mua'
  if(!modelState.docs_date)
    errorMessage.docs_date = 'Không được bỏ trống ngày chứng từ'
  if(!modelState.stock_entry_date)
    errorMessage.stock_entry_date = 'Không được bỏ trống ngày nhập kho'
  return isValid;
}

const createNewReceipt = async () => {
  if(!validateField()) return;
  if(modelState.selected_items.length < 1){
    showToast('warn', 'Cảnh báo','Bạn chưa chọn hàng hoá nhập kho');
    return;
  }
  const payload = {
    DocDate: modelState.docs_date,
    ReceiptDate: modelState.stock_entry_date,
    OpchID: modelState.po_id,
    GRP2: modelState.selected_items.map(el => ({
      Pch2ID: el.ID,
      Quantity: el.DocQuantity,
      OpenQuantity: el.IQuantity,
      Expiry: el.ExpiryDate
    })),
    Memo: modelState.memo
  }

  console.log(payload);

  try {
    const res = await API.postAsync(api_add_grpo, payload);
    console.log(res);
    showToast('success', 'Thành công', 'Tạo phiếu nhập kho thành công');
    visible1.value = false;
  }
  catch (error) {
    showToast('error', 'Lỗi', 'Tạo phiếu nhập kho lỗi: '+error.response.data);
    console.log(error);
  }

}

const onPOChange = async (event) => {
  const res = await API.getAsync(get_by_id_opch, {
    id: event.value
  });
  modelState.docs_date = new Date(res.data.DocDate);
  modelState.supplier_name = res.data.CrdName;
  modelState.org_name = res.data.OrsName;
  modelState.PCH2 = res.data.PCH2.map(el => ({...el,DocQuantity: null , IQuantity: null, ExpiryDate: null}))
  .filter(el => el.OpenQuantity > 0 && el.OpenQuantity);
  modelState.po_id = event.value;
  modelState.selected_items = [];
}

const loadingPO = ref(false);
const PO_data = ref();

const openCreateNew = async () => {
  Object.keys(modelState).forEach(key => {
    modelState[key] = null;
  });
  Object.keys(errorMessage).forEach(key => {
    errorMessage[key] = null;
  });
  modelState.status = 'Mở';
  loadingPO.value = true;
  visible1.value = true;
  const res = await API.getAsync(get_all_opch,{
    page: 0,
    size: 0
  });
  // console.log(res.data.data);
  PO_data.value = res.data.data.map(el => ({ID: el.ID,OpchCode: el.OpchCode, Status: el.Status })).filter(el => el.Status == 'O');
  loadingPO.value = false;
}

const test = () => {
  modelState.po_id = 1;
}

onMounted(async () => {
  console.log(route.query);
  if(route.query.po_id){
    const id = parseInt(route.query.po_id);
    await openCreateNew();
    await onPOChange({value: id});
  }
  fetchAllGrpo();
});

const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: "br",
        detail: msg,
        life: 3000,
    });
};
// ====================== FIXED BY TUẤN ==============================================


const fetchAllGrpo = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.originalEvent.rows;
  try {
    API.get_all_v2(get_all_grpo, {
      data: params.value,
    }).then((res) => {
      dataTable.value = res.data
      load_data.value = false
      router.push({
        name: route.name,
        query: {
          page: res.data.Page,
          q: searchKey.value,
        },
      });
    }).catch((err) => {
      showError(err)
    })
  } catch (err) {
    console.log(err)
  }
}
const fetchAllOpch = () => {
  try {
    API.get_all_v2(get_all_opch, {}).then((res) => {
      listCopyFrom.value = res.data.data
    })
  } catch (err) {
    console.log(err)
  }
}
const openNew = () => {
  fetchAllOpch()
  dialogCrud.value = true;
}
const onPageChange = (event) => {
  fetchAllGrpo(event)
}
const hideDialog = () => {
  dialogCrud.value = false
}
const onChange = (data) => {
  API.get_all_v2(get_by_id_opch, {
    data: {
      id: data.value.ID
    }
  }).then((res) => {
    supplierName.value = res.data.CrdName
    recivingUnit.value = res.data.OrsName
    DocDate.value = res.data.DocDate
    ReceiptDate.value = res.data.DeliveryTime
    crudTable.value = res.data.PCH2
    console.log(crudTable.value)
  })
}
const viewDetail = (id) => {
  API.get_all_v2(get_grpo_byid, {
    data: {
      id: id
    }
  }).then((res) => {
    dataView.value = res.data


  })
  dialogView.value = true
}
const formatStatus = (status) => {
  switch (status) {
    case "O":
      return "Đang mở";
    case "C":
      return "Đã đóng";
  }
}
const getTimeLabel = (date, format) => {
  if(!date){
    return null;
  }
  const _date = new Date(date);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };
  if (format === 'time') {
    Object.assign(options, {
      hour: "numeric",
      minute: "numeric",
      hour12: false
    })
  }
  return new Intl.DateTimeFormat("vi-VI", options).format(_date);
}
const saveData = () => {

  const data = {
    ReceiptDate: ReceiptDate.value,
    DocDate: DocDate.value,
    Memo: Memo.value,
    OpchID: selectedCopyFrom.value.ID,
    GRP2: selectedProduct.value.map(item => ({
      Pch2ID: item.ID,
      Quantity: item.OpenQuantity,
      LotNumber: item.LotNumber,
      Expiry: item.Expiry ? JSON.stringify(item.Expiry) : null
    }))
  }
  API.add_new_v2(data, api_add_grpo).then((res) => {
    console.log(res)
    fetchAllGrpo()
    showSuccess("Tạo thành công phiếu nhập kho!")
    hideDialog()
  }).catch((err) => {
    showError(err.response.data)
  })


}
const showSuccess = () => {
  toast.add({
    severity: "success",
    summary: "Thành công",
    detail: "Phiếu nhập kho đã tạo thành công!",
    group: "br",
    life: 3000,
  });
};
const showError = (e) => {
  toast.add({
    severity: "error",
    summary: "Lỗi",
    group: "br",
    detail: e || "Trường nhập thiếu",
    life: 3000,
  });
};

const getClass1 = (condition) => {
  if(condition){
    return {'p-invalid': condition}
  }
  return null

}

</script>

<style>
.custome_n_input input{
  width: 8rem;
}
.custome_n_input{

}
</style>

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

.p-datatable .p-datatable-tbody>tr>td {
  padding: 0.5rem 0.5rem !important;
}
</style>
