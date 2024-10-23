<template>
  <div class="bg-surface-card">
    <div>
      <div class="flex align-items-center col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          {{ $t("purchasing_plans.header").toUpperCase() }}
        </h5>
      </div>
    </div>
  </div>
  <!-- Bảng kế hoạch mua sắm -->
  <div class="grid">
    <div class="col-12">
      <DataTable
        resizableColumns
        showGridlines
        howGridlines
        lazy
        columnResizeMode="fit"
        size="small"
        v-model:selection="selectedRows"
        :totalRecords="OSPL_DATA.TotalCount"
        :loading="loadingData"
        :paginator="true"
        :rows="PAGE_SIZE"
        dataKey="ID"
        :rowHover="true"
        :rowsPerPageOptions="[5,10,20]"
        @page="onPageChange($event)"
        :value="OSPL_DATA.data"
        responsiveLayout="scroll"
        :pt="{
          loadingOverlay: {
            style: 'background: none;',
          },
        }"
      >
        <template #header>
          <div class="flex justify-between">
            <span class="">
              <!-- p-input-icon-left -->
              <!-- <i class="pi pi-search" /> -->
              <InputText
                v-model="searchKey"
                :placeholder="$t('InputText.Search')"
                style="
                  border-top-right-radius: unset;
                  border-bottom-right-radius: unset;
                "
                @keyup.enter="onSearch"
              />
              <Button
                icon="pi pi-search"
                @click="onSearch()"
                style="border-top-left-radius: unset; border-bottom-left-radius: unset"
              ></Button>
            </span>
            <Button
              :label="$t('Button.AddNew')"
              icon="pi pi-plus"
              @click="openAddWindow()"
            />
          </div>
        </template>
        <template #empty>
          <div style="height: 10rem" class="flex align-items-center justify-center">
            <span v-if="!loadingData">Không có dữ liệu để hiển thị</span>
          </div>
        </template>
        <template #loading>
          <Loading />
        </template>
        <Column selectionMode="multiple" style="max-width: 3rem"></Column>
        <Column field="PlanCode" header="Mã kế hoạch"> </Column>
        <Column field="PlanName" header="Tên Kế Hoạch Mua Sắm"> </Column>
        <Column header="Thời gian thực hiện">
          <template #body="slotProps">
            {{ `Quý ${slotProps.data.ExcQuarter}/${slotProps.data.ExcYear}` }}
          </template>
        </Column>
        <Column header="Đơn vị đề xuất">
          <template #body="slotProps">
            {{ slotProps.data.Oors.OrsName }}
          </template>
        </Column>
        <Column header="Trạng thái">
          <template #body="slotProps">
            {{ getApproveSatusLabel(slotProps.data.ApprovalStatus) }}
          </template>
        </Column>

        <Column header="">
          <template #body="slotProps">
            <Button
              icon="pi pi-eye"
              text
              @click="openInfoWindow(slotProps.data.ID)"
            ></Button>
            <!-- :disabled="slotProps.data.ApprovalStatus !== 'R'" -->
            <!-- <Button
              :disabled="slotProps.data.ApprovalStatus !== 'R'"
              icon="pi pi-pencil"
              text
              @click="openUpdateWindow(slotProps.data.ID)"
            ></Button> -->
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <!-- Bảng kế hoạch mua sắm -->
  <!-- Dialog and toast -->
  <!-- Dialog kế hoạch mua sắm -->
  <Dialog
    maximizable
    v-model:visible="visiblePurchasePlan"
    modal
    :header="dialogLabel.header"
    :style="{ width:'90rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :pt="{
      header:{ style:'border-bottom: 1px solid #e5e7eb;' },
    }"
    
  >
    <div class="mt-3">
      <div v-if="mode !== 'VIEW'" class="field-area">
        <div class="grid">
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="PlanCode">{{ dialogLabel.PlanCode }}</label>
              <InputText
                id="PlanCode" style="background-color:var(--disabled-background);"
                :value="
                  model.PlanCode
                    ? model.PlanCode
                    : `KH-${model.Oors.OrsCode}-${
                        model.ExcYear ? model.ExcYear.getFullYear() : '[yyyy]'
                      }Q${(model.ExcQuarter )?(model.ExcQuarter+'[num]'):('[q][num]')}`"
                :class="{ 'p-invalid':errorMessage.PlanCode }"
                readonly
                :disabled="mode==='UPDATE'"
              />
              <small class="p-error">{{ errorMessage.PlanCode }}</small>
            </div>
          </div>
          <div class="md:col-6 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="PlanName"
                >{{ dialogLabel.PlanName }}<sup class="p-important">*</sup></label
              >
              <InputText
                id="PlanName"
                v-model="model.PlanName"
                :placeholder="dialogLabel.PlanName_plh"
                :class="{ 'p-invalid': errorMessage.PlanName && !model.PlanName }"
                autofocus
              />
              <small v-if="!model.PlanName" class="p-error">{{
                errorMessage.PlanName
              }}</small>
            </div>
          </div>
          
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="Creater">{{ dialogLabel.Creater }}</label>
              <InputText id="Creater" :value="model.Creater" readonly style="background-color: var(--disabled-background);" />
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="md:col-2">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="ExcYear"
                >{{ dialogLabel.Time }}<sup class="p-important">*</sup></label
              >
              <Calendar
                id="ExcYear"
                :disabled="mode === 'UPDATE'"
                v-model="model.ExcYear"
                :minDate="new Date()"
                view="year"
                :placeholder="dialogLabel.Year_plh"
                dateFormat="yy"
                showIcon
                iconDisplay
                :class="{ 'p-invalid': errorMessage.ExcYear && !model.ExcYear }"
              />
            </div>
          </div>
          <div class="md:col-2">
            <div class="flex flex-column gap-2">
              <label>&nbsp;</label>
              <Dropdown
                id="ExcQuarter"
                :disabled="mode === 'UPDATE'"
                v-model="model.ExcQuarter"
                :options="quarterOptions"
                optionValue="value"
                optionLabel="label"
                :placeholder="dialogLabel.Quarter_plh"
                checkmark
                class="w-full"
                :class="{ 'p-invalid': errorMessage.ExcQuarter && !model.ExcQuarter }"
              />
            </div>
            <!-- <small class="p-invalid">{{ errorMessage.ExcQuarter }}</small> -->
          </div>
          <div class="md:col-5 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="prop_req_name">{{ dialogLabel.OrsID }}</label>
              <!-- <TreeArraySelect :disabled="mode === 'UPDATE'" :config="oorsOption" :selectedId="model.Oors.ID" :data="OORS_DATA"
                @onChange="onChangeBusiness" /> -->
              <InputText
                readonly style="background-color: var(--disabled-background);"
                :value="mode === 'CREATE' ?`${model.Oors.OrsCode} - ${model.Oors.OrsName}`:`${model.Oors.OorsCode} - ${model.Oors.OorsName}`"
              ></InputText>
              <small class="p-invalid">{{ errorMessage.Oors }}</small>
            </div>
          </div>
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2 w-full">
              <label class="p-label" for="prop_req_name">{{
                dialogLabel.Approval
              }}</label>
              <InputText
                id="prop_req_name" style="background-color: var(--disabled-background);"
                :value="getApproveSatusLabel(model.ApprovalStatus)"
                readonly
              />
              <small class="p-invalid"></small>
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="prop_req_name"
                >{{ dialogLabel.Address }}<sup class="p-important">*</sup></label
              >
              <div class="grid">
                <span class="col-3 flex flex-column gap-2">
                  <InputText
                    :class="{
                      'p-invalid': errorMessage.Address && !model.Address.Address,
                    }"
                    class="w-full"
                    v-model="model.Address.Address"
                    :placeholder="dialogLabel.SpecificAddress_plh"
                    autofocus
                  />
                  <small v-if="!model.Address.Address" class="p-error">{{
                    errorMessage.Address
                  }}</small>
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.Address.City" :placeholder="dialogLabel.City_plh" autofocus /> -->
                  <AutoComplete
                    id="City"
                    dropdown
                    class="w-full"
                    v-model="model.Address.City"
                    :suggestions="citiOptions"
                    @change="onChangeCity"
                    @item-select="onSelectCity"
                    @complete="searchCity"
                    :placeholder="dialogLabel.City_plh"
                    forceSelection
                    :class="{ 'p-invalid': errorMessage.City && !model.Address.City }"
                  />
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.Address.District" :placeholder="dialogLabel.District_plh" autofocus /> -->
                  <AutoComplete
                    id="District"
                    :disabled="!model.Address.City"
                    dropdown
                    class="w-full"
                    v-model="model.Address.District"
                    :suggestions="districtOptions"
                    @change="onChangeDistrict"
                    @item-select="onSelectDistrict"
                    @focus="fillDistrictData"
                    @complete="searchDistrict"
                    :placeholder="dialogLabel.District_plh"
                    forceSelection
                    :class="{
                      'p-invalid': errorMessage.District && !model.Address.District,
                    }"
                  />
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.Address.Ward" :placeholder="dialogLabel.Ward_plh" autofocus /> -->
                  <AutoComplete
                    id="Ward"
                    :disabled="!model.Address.District"
                    dropdown
                    class="w-full"
                    v-model="model.Address.Ward"
                    :suggestions="wardOptions"
                    @complete="searchWard"
                    :placeholder="dialogLabel.Ward_plh"
                    @focus="fillWardData"
                    forceSelection
                    :class="{ 'p-invalid': errorMessage.Ward && !model.Address.Ward }"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="view-data">
        <div class="grid">
          <div class="col-12 md:col-6 flex flex-column gap-2 label-view">
            <span>
              <label>{{ dialogLabel.PlanCode }}:</label>{{ model.PlanCode }}
            </span>
            <span>
              <label>{{ dialogLabel.PlanName }}:</label>{{ model.PlanName }}
            </span>
            <span>
              <label>{{ dialogLabel.OrsID }}:</label>{{ model.Oors.OorsName }}
            </span>
            <span>
              <label>{{ dialogLabel.Time }}:</label
              >{{ `Q${model.ExcQuarter}/${model.ExcYear.getFullYear()}` }}
            </span>
            <span>
              <label>{{ dialogLabel.Address }}:</label
              >{{
                `${model.Address.Address}, ${model.Address.Ward},
              ${model.Address.District}, ${model.Address.City}`
              }}
            </span>
          </div>
          <div class="col-12 md:col-6 flex flex-column gap-2 label-view">
            <span>
              <label>{{ dialogLabel.CreateAt }}:</label>{{ getTimeLabel(model.CreateAt) }}
            </span>
            <span>
              <label>{{ dialogLabel.Creater }}:</label>{{ model.Creater }}
            </span>
            <span>
              <label>{{ dialogLabel.Approval }}:</label
              >{{ getApproveSatusLabel(model.ApprovalStatus) }}
            </span>
          </div>
        </div>
      </div>
      <div class="tabview-area">
        <TabView
          :pt="{
            panelContainer: { style: 'padding: 0' },
          }"
        >
          <TabPanel :header="dialogLabel.SPL2_tab">
            <DataTable
              showGridlines
              resizableColumns
              size="small"
              columnResizeMode="expand"
              :value="model.SPL2"
              scrollable
              scrollHeight="320px"
              stripedRows
            >
              <Column header="#" style="width: 3rem; text-align: right">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>
              <Column field="ItemName" :header="dialogLabel.SPL2.ItemName" sortable>
                <template #body="slotProps">
                  {{ slotProps.data.ItemName }}
                </template>
              </Column>
              <Column
                field="Quantity"
                :header="dialogLabel.SPL2.Quantity"
                sortable
                style="width: 10rem; text-align: right"
              >
                <template #body="slotProps">
                  <template v-if="mode === 'VIEW'">
                    {{ slotProps.data.Quantity }}
                  </template>
                  <template v-else>
                    <InputNumber
                      class="w-full small-input"
                      size="small"
                      v-model="slotProps.data.Quantity"
                      :min="1"
                      showButtons
                      :pt="{
                        input: { style: 'width: 100%; height: 32px;text-align: right;' },
                        incrementButton: { style: 'width: 20px;' },
                        decrementButton: { style: 'width: 20px;' },
                      }"
                    >
                    </InputNumber>
                  </template>
                </template>
              </Column>
              <Column :header="dialogLabel.SPL2.Unit" style="width: 10rem">
                <template #body="slotProps">
                  <template v-if="mode === 'VIEW'">
                    {{ slotProps.data.UomName }}
                  </template>
                  <template v-else>
                    <Dropdown
                      v-model="slotProps.data.selectedUnitID"
                      :options="slotProps.data.UGP"
                      optionLabel="UomName"
                      optionValue="ID"
                      class="w-full"
                      :pt="{
                        input: {
                          style: 'height: 32px;display: flex;align-items: center;',
                        },
                      }"
                    />
                  </template>
                </template>
              </Column>
              <Column
                field="UnitPrice"
                :header="dialogLabel.SPL2.UnitPrice"
                sortable
                style="width: 10rem; text-align: right"
              >
                <template #body="slotProps">
                  <template v-if="mode === 'VIEW'">
                    {{ numberToCurrency(slotProps.data.UnitPrice) }}
                  </template>
                  <template v-else>
                    <InputNumber
                      size="small"
                      v-model="slotProps.data.UnitPrice"
                      locale="en-US"
                      :min="0"
                      
                      class="small-input"
                    >
                    </InputNumber>
                    <span> ₫</span>
                  </template>
                </template>
              </Column>
              <Column
                field="ToPrice"
                :header="dialogLabel.SPL2.ToPrice"
                sortable
                style="text-align: right; width: 10rem"
              >
                <template #body="slotProps">
                  {{
                    numberToCurrency(
                      (slotProps.data.ToPrice =
                        slotProps.data.Quantity * slotProps.data.UnitPrice)
                    )
                  }}
                </template>
              </Column>
              <Column field="Memo" :header="dialogLabel.SPL2.Memo" style="width: 10rem">
                <template #body="slotProps">
                  <template v-if="mode === 'VIEW'">
                    {{ slotProps.data.Memo }}
                  </template>
                  <template v-else>
                    <InputText
                      class="w-full"
                      v-model="slotProps.data.Memo"
                      :pt="{ root: { style: 'height: 32px;' } }"
                    >
                    </InputText>
                  </template>
                </template>
              </Column>
              <Column
                v-if="mode !== 'VIEW'"
                header=""
                style="width: 3rem; text-align: center"
              >
                <template #body="slotProps">
                  <Button
                    icon="pi pi-trash"
                    style="height: 20px; width: 20px"
                    text
                    @click="removeProduct(slotProps.index)"
                  ></Button>
                </template>
              </Column>
              <template #footer>
                <div class="flex justify-between">
                  <div class="left-footer">
                    <Button
                      v-if="mode !== 'VIEW'"
                      :label="dialogLabel.Product_btn"
                      outlined
                      icon="pi pi-cart-plus"
                      size="small"
                      @click="openSelectProduct"
                    />
                    <!-- <Button label="Log data" outlined class="ml-2" severity="contrast"
                      icon="pi pi-save" size="small" @click="logProduct" /> -->
                  </div>
                  <div class="right-footer">
                    <div class="mr-5">
                      <div class="flex justify-between">
                        <span class="mr-3"> {{ dialogLabel.TotalPrice }} </span>
                        <span class="font-normal">
                          {{ numberToCurrency(computingPrice()) }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="mr-3"> {{ dialogLabel.Price2Word }} </span>
                        <span class="font-normal">
                          {{ VND2Word(computingPrice()) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="errorMessage.SPL2" #empty>
                <div
                  style="background: rgb(231 29 29 / 10%)"
                  class="flex align-items-center justify-center"
                >
                  <span
                    class="p-error p-5 m-2 flex justify-center align-items-center w-full"
                  >
                    <span class="material-symbols-outlined mr-3">inventory_2</span>
                    {{ errorMessage.SPL2 }}
                  </span>
                </div>
              </template>
            </DataTable>
          </TabPanel>
          <TabPanel :header="dialogLabel.SPL1_tab">
            <DataTable
              size="small"
              showGridlines
              resizableColumns
              columnResizeMode="fit"
              :value="model.SPL1"
              scrollable
              scrollHeight="320px"
            >
              <template #empty>
                <div class="flex justify-content-center p-3">
                  <span>Không có dữ liệu</span>
                </div>
              </template>
              <Column header="#" style="width: 3rem; text-align: right">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>
              <Column
                :header="dialogLabel.SPL1.File"
                style="width: 7rem; text-align: center"
              >
                <template #body="slotProps">
                  <Image
                    v-if="slotProps.data.IsImage"
                    :src="slotProps.data.Link"
                    width="42"
                    height="42"
                    preview
                  />
                  <Avatar
                    v-else
                    :icon="slotProps.data.Icon || 'pi pi-file'"
                    size="large"
                  ></Avatar>
                </template>
              </Column>
              <Column field="PatchName" :header="dialogLabel.SPL1.File_name"></Column>
              <Column field="PatchDesc" :header="dialogLabel.SPL1.Memo">
                <template v-if="mode !== 'VIEW'" #body="slotProps">
                  <InputText
                    size="small"
                    class="w-full"
                    v-model="slotProps.data.PatchDesc"
                  />
                </template>
              </Column>
              <Column header="" style="width: 3rem; text-align: center">
                <template #body="slotProps">
                  <Button
                    v-if="mode !== 'VIEW'"
                    icon="pi pi-trash"
                    style="height: 20px; width: 20px"
                    text
                    @click="removeFile(slotProps.index)"
                  ></Button>
                  <Button
                    v-else
                    icon="pi pi-download"
                    style="height: 20px; width: 20px"
                    text
                    @click="
                      downloadFile(
                        slotProps.data.Link,
                        model.PlanCode + '_' + slotProps.data.PatchName
                      )
                    "
                  />
                </template>
              </Column>
              <template v-if="mode !== 'VIEW'" #footer>
                <div class="pn-left">
                  <ImportFiles @on-select="onSelectFiles" />
                </div>
              </template>
            </DataTable>
          </TabPanel>
        </TabView>
      </div>
    </div>
    <template #footer>
      <div v-if="mode !== 'VIEW'" class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="$t('Button.Cancel')"
          @click="
            () => {
              visiblePurchasePlan = false;
            }
          "
        ></Button>
        <Button
          v-if="mode !== 'VIEW'"
          :loading="loadingSend"
          icon="pi pi-save"
          :label="$t('Button.Save')"
          @click="submit"
        ></Button>
      </div>
      <div v-else class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="$t('Button.Close')"
          @click="
            () => {
              visiblePurchasePlan = false;
            }
          "
        ></Button>
      </div>
    </template>
  </Dialog>
  <!-- Dialog kế hoạch mua sắm -->
  <Toast position="bottom-right" group="br" />
  <!-- Dialog and toast -->
  <ProductSelect v-model:visible="visibleAllProduct" @confirm="onSelectProduct" />
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// import TreeArraySelect from "./components/TreeArraySelect.vue";
import ProductSelect from "./components/ProductSelect.vue";
import ImportFiles from "./components/ImportFiles.vue";
import API from "../../apis/api";
import { ref, reactive, onBeforeMount } from "vue";
import i18n from "../../locale/i18n";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { VND2Word } from "../../extension/Extention";
import { StatusCode } from "../../service/StatusCode";

const toast = useToast();
// -----------------------  [ DATA ] --------------------------------
const loadingData = ref(false);
const OSPL_DATA = ref([]);
// ------------------------ [ MODELS ] ------------------------------
const mode = ref();
const searchKey = ref(null);

const initialState = {
  ID: null,
  PlanCode: null,
  Oors: null,
  PlanName: null,
  Creater: null,
  ApprovalStatus: "P",
  Address: {
    City: null,
    District: null,
    Ward: null,
    Address: null,
  },
  ExcYear: null,
  ExcQuarter: null,
  SPL2: [], //Products
  SPL1: [], //Docs
};

const model = reactive({ ...initialState });

// ------------------------ [ VARIABLES ] ---------------------------
const selectedRows = ref();

const CURRENT_PAGE = ref(1);
const PAGE_SIZE = ref(10);

// visible
const visiblePurchasePlan = ref(false);
const visibleAllProduct = ref(false);
// ------------------------ [ METHODS ] -----------------------------

// Mở cửa sổ chọn vật tư hàng hoá
function openSelectProduct() {
  visibleAllProduct.value = true;
}

function onSelectProduct(products) {
  // console.info(`Sản phẩm 1/${products.length}: `, products[0]);
  model.SPL2.push(
    ...products.map((x) => ({
      ...x,
      selectedUnitID: x.BuyUnitMsr,
      Quantity: 1,
      Memo: null,
      UnitPrice: null,
      Type: "A",
    }))
  );
}

function onSelectFiles(files) {
  model.SPL1.push(
    ...files.map((x) => ({ ...x, PatchName: x.File.name, Memo: null, Type: "A" }))
  );
}

function removeFile(index) {
  model.SPL1.splice(index, 1);
}

function removeProduct(index) {
  model.SPL2.splice(index, 1);
}

function logProduct() {
  console.log(model.SPL2);
}

function downloadFile(uri, name) {
  fetch(uri)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.click();
    })
    .catch(console.error);
}

const openInfoWindow = async (id) => {
  mode.value = "VIEW";
  dialogLabel.header = "Chi tiết kế hoạch mua sắm";
  visiblePurchasePlan.value = await fetchOSPLbyId(id);
};

async function openUpdateWindow(id) {
  mode.value = "UPDATE";
  dialogLabel.header = "Chỉnh sửa kế hoạch mua sắm".toUpperCase();
  visiblePurchasePlan.value = await fetchOSPLbyId(id);
}

// Thêm mới yêu kế hoạch mua sắm
function openAddWindow() {
  // prepare model
  mode.value = "CREATE";
  dialogLabel.header = "Thêm mới kế hoạch mua sắm".toUpperCase();
  resetModel();
  model.Creater = JSON.parse(localStorage.getItem("user"))["UserName"];
  model.Oors = {
    ID: JSON.parse(localStorage.getItem("user"))["OrsId"],
    OrsCode: JSON.parse(localStorage.getItem("user"))["OrsCode"],
    OrsName: JSON.parse(localStorage.getItem("user"))["OrsName"],
  };
  visiblePurchasePlan.value = true;
}

function resetModel() {
  Object.assign(model, initialState);
  model.Address = {
    City: null,
    District: null,
    Ward: null,
    Address: null,
  };
  model.SPL1 = [];
  model.SPL2 = [];
  resetErrorMessage();
}

function resetErrorMessage() {
  Object.assign(errorMessage, initErrorMessage);
}

function initialComponent() {
  // Nhận query là tham số page để set page hiện tại
  CURRENT_PAGE.value = route.query.page && route.query.page > 0 ? route.query.page : 1;

  //**Fetch data [Kế hoạch mua sắm] */
  fetch_OSPL(CURRENT_PAGE.value, PAGE_SIZE.value);
  //**Fetch OORS data [Cơ cấu tổ chức] */
  // fetch_OORS();
}

// ------------------------ [ EXTENTIONS METHODS ] -------------------

onBeforeMount(() => {
  initialComponent();
});

import citiesData from "../../../public/demo/data/location.json";

const citiOptions = ref([]);
function searchCity(event) {
  // console.log(event.query);
  citiOptions.value = citiesData.data
    .filter((x) =>
      x.name.trim().toLocaleLowerCase().includes(event.query.trim().toLocaleLowerCase())
    )
    .map((item) => item.name);
}
function onSelectCity(event) {
  districtData.value = citiesData.data.find((x) => x.name === event.value)["districts"];
  console.log(districtData.value);
  model.Address.District = null;
}

function onChangeCity() {
  model.Address.District = null;
  model.Address.Ward = null;
}

const districtData = ref(null);
const districtOptions = ref([]);
function searchDistrict(event) {
  districtOptions.value = districtData.value
    .filter((x) =>
      x.name.trim().toLocaleLowerCase().includes(event.query.trim().toLocaleLowerCase())
    )
    .map((item) => item.name);
}
function fillDistrictData(e) {
  console.log(e);
  districtData.value = citiesData.data.find((x) => x.name === model.Address.City)[
    "districts"
  ];
}
function onSelectDistrict(event) {
  wardData.value = districtData.value.find((x) => x.name === event.value)["wards"];
  console.log(wardData.value);
}
function onChangeDistrict() {
  model.Address.Ward = null;
}

const wardData = ref(null);
const wardOptions = ref([]);
function fillWardData(e) {
  districtData.value = citiesData.data.find((x) => x.name === model.Address.City)[
    "districts"
  ];
  wardData.value = districtData.value.find((x) => x.name === model.Address.District)[
    "wards"
  ];
}
function searchWard(event) {
  wardOptions.value = wardData.value
    .filter((x) =>
      x.name.trim().toLocaleLowerCase().includes(event.query.trim().toLocaleLowerCase())
    )
    .map((item) => item.name);
  // console.log(districtData.value);
  // model.Address.District = null;
}

function computingPrice() {
  let price = 0;
  try {
    price = model.SPL2.map((x) => x.ToPrice).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  } catch (e) {
    console.log(e);
  }
  return price;
}

const _key = ref();
// Sự kiện khi thay đổi trang
function onPageChange(event) {
  CURRENT_PAGE.value = event.page + 1;
  PAGE_SIZE.value = event.rows;
  fetch_OSPL(CURRENT_PAGE.value, PAGE_SIZE.value,_key.value);
}

//Lấy label trạng thái phê duyệt
function getApproveSatusLabel(value) {
  switch (value) {
    case "P":
      return i18n.global.t("approval_status.pending");
    case "A":
      return i18n.global.t("approval_status.approved");
    case "E":
      return i18n.global.t("approval_status.empty");
    case "C":
      return i18n.global.t("approval_status.canceled");
    case "R":
      return i18n.global.t("approval_status.rejected");
    default:
      return value;
  }
}

function getTimeLabel(date) {
  const _date = new Date(date);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  return new Intl.DateTimeFormat("vi-VI", options).format(_date);
}

function numberToCurrency(num) {
  const formatter = new Intl.NumberFormat("en-EN");
  return formatter.format(num) + " ₫";
}

function showToast(severity, summary, msg) {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
}

// ======================= [ BEGIN API service # CRUD] =======================

const initErrorMessage = {
  PlanCode: null,
  PlanName: null,
  ExcYear: null,
  ExcQuarter: null,
  SPL2: null,
  Address: null,
  City: null,
  District: null,
  Ward: null,
};
const errorMessage = reactive({ ...initErrorMessage });
const isValidated = ref(false);

function validateForm() {
  const isEmpty = (str) => {
    if (str && str.toString().trim()) return true;
    else return false;
  };
  const requireField = (model, prop, msg = true) => {
    if (!(model[prop] && model[prop].toString().trim())) errorMessage[prop] = msg;
  };
  isValidated.value =
    isEmpty(model.PlanName) &&
    isEmpty(model.ExcQuarter) &&
    isEmpty(model.ExcYear) &&
    isEmpty(model.Address.Address) &&
    isEmpty(model.Address.City) &&
    isEmpty(model.Address.District) &&
    isEmpty(model.Address.Ward) &&
    model.SPL2.length > 0;
  requireField(model, "PlanName", "Tên kế hoạch không được để trống");
  requireField(model, "ExcYear");
  requireField(model, "ExcQuarter");
  requireField(model.Address, "Address", "Địa chỉ không được để trống");
  requireField(model.Address, "Ward");
  requireField(model.Address, "District");
  requireField(model.Address, "City");
  if (model.SPL2.length < 1) {
    errorMessage.SPL2 = "Hãy chọn vật tư, hàng hoá !";
  }
  // console.log(model.SPL2.filter(x => !x.UnitPrice).length)
  const itemPriceNullCount = model.SPL2.filter((x) => x.UnitPrice === null).length;
  if (itemPriceNullCount > 0 && isValidated.value) {
    showToast(
      "warn",
      "Cảnh báo",
      `Có ${itemPriceNullCount} vật tư, hàng hoá chưa được nhập giá tiền`
    );
  }
  isValidated.value = isValidated.value && itemPriceNullCount <= 0;
}
function submit() {
  validateForm();
  // alert(isValidated.value);
  if (isValidated.value) {
    switch (mode.value) {
      case "CREATE":
        createOSPL();
        // alert(1);
        break;
      case "UPDATE":
        updateOSPL();
        break;
    }
  }
}

function updateOSPL() {
  const dataBody = {
    ID: model.ID,
    PlanCode: model.PlanCode,
    PlanName: model.PlanName.trim(),
    OorsID: model.Oors.ID,
    ExcYear: model.ExcYear.getFullYear(),
    ExcQuarter: model.ExcQuarter,
    SPL3: model.Address,
    SPL2: model.SPL2.map((x) => ({
      OitmID: x.ID,
      UgpID: x.selectedUnitID,
      Quantity: x.Quantity,
      UnitPrice: x.UnitPrice,
      Memo: x.Memo,
      Type: x.Type,
    })),
    SPL1: model.SPL1.map((x) => ({...x, Type: x.Type })),
  };
  // for (let file of model.SPL1.map((x) => x.File)) {
  //   formData.append("files", file);
  // }
  // formData.append("data", JSON.stringify(dataBody));
  console.log(dataBody);
  // try{

  // }
}

const loadingSend = ref(false);
function createOSPL() {
  const dataBody = {
    PlanCode: `KH-${model.Oors.OrsCode}-${model.ExcYear.getFullYear()}Q${
      model.ExcQuarter
    }`,
    PlanName: model.PlanName.trim(),
    OorsID: model.Oors.ID,
    ExcYear: model.ExcYear.getFullYear(),
    ExcQuarter: model.ExcQuarter,
    SPL3: model.Address,
    SPL2: model.SPL2.map((x) => ({
      OitmID: x.ID,
      UgpID: x.selectedUnitID,
      Quantity: x.Quantity,
      UnitPrice: x.UnitPrice,
      Memo: x.Memo,
    })),
    SPL1: model.SPL1.map((x) => ({ PatchDesc: x.PatchDesc })),
  };

  const formData = new FormData();
  for (let file of model.SPL1.map((x) => x.File)) {
    formData.append("files", file);
  }
  formData.append("data", JSON.stringify(dataBody));
  loadingSend.value = true;
  API.add_new_v2(formData, "ospl/create")
    .then((res) => {
      if (res.status >= 200) {
        loadingSend.value = false;
        showToast("success", i18n.global.t("severity.success"), "Thêm mới thành công"); // Translate-here
        fetch_OSPL(CURRENT_PAGE.value, PAGE_SIZE.value);
        visiblePurchasePlan.value = false;
      }
    })
    .catch((err) => {
      loadingSend.value = false;
      console.log(err);
      showToast("error", i18n.global.t("severity.error"), err);
    });
}

const onSearch = () => {
  CURRENT_PAGE.value = 1;
  _key.value = searchKey.value;
  fetch_OSPL(CURRENT_PAGE.value, PAGE_SIZE.value, _key.value);
}

//**Fetch data [Kế hoạch mua sắm] */
function fetch_OSPL(page, size, key = null) {
  loadingData.value = true;
  router.push({
    name: route.name,
    query: {
      page: page
    },
  });
  API.get_all_v2("ospl/getall", {
    data: {
      size: size,
      page: page,
      q: key
    },
  })
    .then((res) => {
      loadingData.value = false;
      if (res.status >= 200) {
        loadingData.value = false;
        if (res.data) {
          OSPL_DATA.value = res.data;
        } else {
          router.push({
            name: route.name,
            query: {
              page: 1,
            },
          });
          fetch_OSPL(1, size);
        }
      }
    })
    .catch((error) => {
      showToast("error", i18n.global.t("severity.error"), error.message);
      loadingData.value = false;
      console.log(error);
    });
}

async function fetchOSPLbyId(id) {
  document.body.style.cursor = "wait";
  try {
    resetModel();
    const res = await API.getAsync("ospl/getbyid", { id: id });
    document.body.style.cursor = "default";
    if (res.data) {
      model.ID = res.data.ID;
      model.Address = res.data.SPL3;
      model.SPL1 = res.data.SPL1.map((x) => ({ ...x, Type: "U" }));
      model.SPL2 = res.data.SPL2.map((x) => ({
        ...x,
        selectedUnitID: x.UgpID,
        ItemName: x.Oitm.ItemName,
        UGP: x.Ugp,
        Type: "U",
      }));
      model.Oors = {
        ID: res.data.OorsID,
        OorsCode: res.data.Oors.OrsCode,
        OorsName: res.data.Oors.OrsName,
      };
      model.PlanCode = res.data.PlanCode;
      model.PlanName = res.data.PlanName;
      model.ExcQuarter = res.data.ExcQuarter;
      model.ExcYear = new Date(res.data.ExcYear, 0);
      model.ApprovalStatus = res.data.ApprovalStatus;
      model.Creater = res.data.CreateBy1.UserName;
      model.CreateAt = res.data.CreatedAt;
    }
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

//**Fetch data [Cơ cấu tổ chức] */
// function fetch_OORS() {
//   API.get_all("oors/getall").then(
//     (res) => {
//       //Lấy dữ liệu thành công
//       if (res.status >= 200) {
//         let data = sortData(res.data.data, "ID");
//         OORS_DATA.value = data;
//       }
//       //Dữ liệu lỗi
//     },
//     //Lỗi mạng
//     (err) => {}
//   );
// }

// ======================= [END API service # CRUD] ==========================

// -----------------------  [ LABELS AND OPTIONS] ------------------------------
const dialogLabel = reactive({
  header: null,
  PlanName: "Tên kế hoạch",
  PlanName_plh: "Nhập tên kế hoạch",
  PlanCode: "Mã kế hoạch",
  Creater: "Người tạo",
  OrsID: "Thuộc đơn vị",
  Address: "Địa điểm thực hiện",
  Time: "Thời gian thực hiện",
  Year_plh: "Năm",
  Quarter_plh: "Quý",
  Approval: "Trạng thái phê duyệt",
  SpecificAddress_plh: "Nhập địa chỉ cụ thể",
  City_plh: "--Tỉnh/Thành phố--",
  District_plh: "--Quận/Huyện--",
  Ward_plh: "--Phường/Xã--",
  Product_btn: "Chọn hàng hóa",
  CreateAt: "Thời gian tạo phiếu",

  SPL2_tab: "Danh sách vật tư, hàng hoá",
  SPL2: {
    ItemName: "Tên hàng hoá",
    Quantity: "Số lượng",
    Unit: "Đơn vị",
    UnitPrice: "Đơn giá dự kiến",
    ToPrice: "Thành tiền",
    Memo: "Ghi chú",
  },
  SPL1_tab: "Chứng từ đính kèm",
  SPL1: {
    File: "Tệp tin",
    File_name: "Tên chứng từ",
    Memo: "Ghi chú",
  },

  TotalPrice: "Tổng tiền:",
  Price2Word: "Bằng chữ:",
});

const quarterOptions = [
  {
    label: "Quý 1",
    value: 1,
  },
  {
    label: "Quý 2",
    value: 2,
  },
  {
    label: "Quý 3",
    value: 3,
  },
  {
    label: "Quý 4",
    value: 4,
  },
];

const oorsOption = {
  field: { id: "ID", code: "OrsCode", label: "OrsName", children: "children" },
  ES_Root: false,
};
</script>

<style scoped>
.label-view span label {
  margin-right: 1rem;
  font-weight: bold;
}

.cell-null {
  background: red;
}

/* .right-footer{
  align-content: end;
}
.left-footer{
  align-self: start;
} */
.empty-data {
  height: 28vh;
}
</style>

<style>
.small-input > input {
  width: 100px;
  height: 32px;
}
.small-input > span > button {
  width: 30px;
}

</style>