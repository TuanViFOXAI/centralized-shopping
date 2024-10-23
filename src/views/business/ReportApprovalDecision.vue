<template>
  <div>
    <div>
      <div class="flex">
        <div class="flex align-items-center mt-0 col-6">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
            BÁO CÁO QUYẾT ĐỊNH PHÊ DUYỆT PHÊ DUYỆT
          </h5>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <div class="card p-0">
          <div class="panel-content" style="position: relative" v-if="dataTable">
            <DataTable
              showGridlines
              :rows="5"
              :value="dataTable"
              responsiveLayout="scroll"
              dataKey="ID"
              paginator
              selectionMode="single"
              :metaKeySelection="false"
              :rowClass="rowClass"
              @rowSelect="openDetailWindown($event.data)"
              :pt="{
                bodyRow: { style: 'cursor: pointer;' },
              }"
            >
              <template #header>
                <div class="grid bg--surface-card">
                  <div class="flex flex-column col-6">
                    <h5 class="m-0"></h5>
                    <span class="block p-input-button">
                      <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                      <Button @click="onSearch" icon="pi pi-search" />
                    </span>
                  </div>
                  <div class="col-6 flex fl-end">
                    <Button
                      label="Bộ lọc"
                      icon="pi pi-search"
                      class="text-end px-3 py-2 font-medium"
                      @click="dialogReport = true"
                    />
                  </div>
                </div>
              </template>
              <Column header="#" headerStyle="width: 3rem">
                <template #body="slotProps">{{ slotProps.index + 1 }}</template>
              </Column>
              <Column field="ObjType" header="Loại chứng từ">
                <template #body="slotProps">
                  <div class="flex align-items-center">
                    <Button
                      icon="pi pi-arrow-circle-right text-yellow-500"
                      text
                      @click="fetchOSPLbyId(slotProps.data)"
                    />
                    <span>{{
                      slotProps.data.ObjType == 1 ? "Kế hoạch mua sắm" : "Yêu cầu mua sắm"
                    }}</span>
                  </div>
                </template>
              </Column>
              <Column field="Obj.ObjCode" header="Mã chứng từ"> </Column>
              <Column field="Actor.UserName" header="Người tạo"> </Column>
              <Column header="Ngày tạo">
                <template #body="slotProps">{{
                  format(slotProps.data.Obj.CreatedAt, "dd/MM/yyyy")
                }}</template>
              </Column>
              <Column field="Owtm.WtmName" header="Mẫu phê duyệt">
                <template #body="slotProps">
                  <div class="flex align-items-center">
                    <Button
                      icon="pi pi-arrow-circle-right text-yellow-500"
                      text
                      @click="getTemplate(slotProps.data.Owtm.ID)"
                    />
                    <span>{{ slotProps.data.Owtm.WtmName }}</span>
                  </div>
                </template>
              </Column>
              <Column header="Trạng thái" field="Status">
                <template #body="slotProps">
                  {{
                    slotProps.data.Status == "P"
                      ? "Đang chờ"
                      : slotProps.data.Status == "A"
                      ? "Đã duyệt"
                      : slotProps.data.Status == "R"
                      ? "Từ chối"
                      : "Đã huỷ"
                  }}
                </template>
              </Column>
              <Column header="Ghi chú" field="Obj.Memo"> </Column>
            </DataTable>
          </div>
          <div class="panel-content" style="position: relative" v-if="dataEdit.detal">
            <loading v-if="!dataEdit.loading" />
            <DataTable
              showGridlines
              :rows="50"
              :value="dataEdit.detal.WDD1"
              responsiveLayout="scroll"
              v-if="dataEdit.detal"
              paginator
            >
              <Column header="Quy trình" field="StepName"> </Column>
              <Column header="Người duyệt" field="User.UserName"> </Column>
              <Column field="Status" header="Kết quả">
                <template #body="slotProps">
                  {{
                    slotProps.data.Status == "P"
                      ? "Đang chờ"
                      : slotProps.data.Status == "A"
                      ? "Đã duyệt"
                      : slotProps.data.Status == "R"
                      ? "Từ chối"
                      : "Đã huỷ"
                  }}
                </template>
              </Column>
              <Column header="Phê duyệt">
                <template #body="slotProps">
                  <Dropdown
                    :options="DataStatus"
                    optionLabel="name"
                    optionValue="code"
                    class="w-full"
                    v-model="slotProps.data.Status"
                    :disabled="
                      dataEdit.detal.Status == 'P'
                        ? User['UserID'] == slotProps.data.User.ID &&
                          dataEdit.detal.CurStep == slotProps.data.StepCode &&
                          slotProps.data.ApprovalAt == null
                          ? false
                          : true
                        : true
                    "
                    @change="Approval($event, slotProps)"
                  /> </template
              ></Column>
              <Column header="Ngày duyệt">
                <template #body="slotProps">
                  {{
                    slotProps.data.ApprovalAt
                      ? format(slotProps.data.ApprovalAt, "dd/MM/yyyy")
                      : ""
                  }}
                </template>
              </Column>
            </DataTable>
            <div class="text-right mr-3 mb-3">
              <Button label="Cập nhật" @click="sendApp()" />
            </div>
          </div>
        </div>
      </div>
      <Toast position="bottom-right" group="br" />
    </div>
  </div>
  <!-- Taọ hoppj thoại CRUD-->
  <Dialog
    v-model:visible="dialogReport"
    :style="{ width: '750px' }"
    header="Lựa chọn tiêu chí"
    :modal="true"
    class="p-fluid uppercase"
    maximizable
  >
    <div class="field">
      <h6>Trạng thái</h6>
      <div class="grid">
        <div class="col-6">
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.pending" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Chờ xử lý</label>
          </div>
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.approved" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Đã phê duyệt</label>
          </div>
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.all" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Chọn tất cả</label>
          </div>
        </div>
        <div class="col-6">
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.refuse" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Từ chối</label>
          </div>
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.cancel" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Đã hủy</label>
          </div>
        </div>
      </div>
    </div>
    <div class="field">
      <h6>Loại chứng từ</h6>
      <div class="grid">
        <div class="col-6">
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.ospl" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Kế hoạch mua sắm</label>
          </div>
          <div class="col-12 flex align-items-center">
            <Checkbox v-model="dataEdit.osre" trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Yêu cầu mua sắm</label>
          </div>
        </div>
        <div class="col-6">
          <div class="col-12 flex align-items-center">
            <Checkbox trueValue="Y" falseValue="N" binary />
            <label class="ml-2">Đánh giá -Chấm điểm nhà cung cấp</label>
          </div>
        </div>
      </div>
    </div>
    <div class="field">
      <h6>Người khởi tạo</h6>
      <div class="grid justify-content-center">
        <div class="col-1 text-center"><p class="m-0 mt-2">Từ</p></div>
        <div class="col-5">
          <Dropdown
            placeholder="Chọn"
            showClear
            :options="dataEdit.Users"
            optionLabel="UserName"
            optionValue="UserName"
            v-model="dataEdit.user_create_from"
          />
        </div>
        <div class="col-1 text-center"><p class="m-0 mt-2">Đến</p></div>
        <div class="col-5">
          <Dropdown
            placeholder="Chọn"
            showClear
            :options="dataEdit.Users"
            optionLabel="UserName"
            optionValue="UserName"
            v-model="dataEdit.user_create_to"
          />
        </div>
      </div>
    </div>
    <div class="field">
      <h6>Thời gian</h6>
      <div class="grid justify-content-center">
        <div class="col-1 text-center"><p class="m-0 mt-2">Từ</p></div>
        <div class="col-5">
          <Calendar
            v-model="dataEdit.from_date"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            showButtonBar
          />
        </div>
        <div class="col-1 text-center"><p class="m-0 mt-2">Đến</p></div>
        <div class="col-5">
          <Calendar
            v-model="dataEdit.from_to"
            dateFormat="dd/mm/yy"
            placeholder="dd/mm/yyyy"
            showButtonBar
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Huỷ" outlined icon="pi pi-times" @click="dialogReport = false" />
      <Button
        label="Xác nhận"
        icon="pi pi-check"
        :disabled="
          dataEdit.pending == 'Y' ||
          dataEdit.refuse == 'Y' ||
          dataEdit.approved == 'Y' ||
          dataEdit.cancel == 'Y' ||
          dataEdit.osre == 'Y' ||
          dataEdit.ospl == 'Y' ||
          dataEdit.user_create_from ||
          dataEdit.user_create_to ||
          dataEdit.from_date ||
          dataEdit.to_date
            ? false
            : true
        "
        @click="Filter()"
      />
    </template>
  </Dialog>
  <!-- End hôp thoại CRUD -->

  <Dialog
    maximizable
    v-model:visible="dialogView"
    modal
    :header="model.type === 1 ? 'CHI TIẾT KẾ HOẠCH' : 'CHI TIẾT YÊU CẦU'"
    :style="{ width: '90rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
  >
    <div class="mt-3">
      <div class="view-data">
        <div class="grid">
          <div class="col-12 md:col-6 flex flex-column gap-2 label-view">
            <span>
              <label>{{ model.type == 1 ? "Mã kế hoạch" : "Mã yêu cầu" }}:</label
              >{{ model.code }}
            </span>
            <span>
              <label>{{ model.type == 1 ? "Tên kế hoạch" : "Tên yêu cầu" }}:</label
              >{{ model.name }}
            </span>
            <span>
              <label>{{ dialogLabel.OrsID }}:</label>{{ model.Oors.OorsName }}
            </span>
            <span v-if="model.type == 1">
              <label>{{ dialogLabel.Time }}:</label
              >{{ `Q${model.ExcQuarter}/${model.ExcYear.getFullYear()}` }}
            </span>
            <span v-if="model.type == 2">
              <label>{{ dialogLabel.Time }}:</label
              >{{ format(model.TimeNeeded, "dd/MM/yyyy") }}
            </span>
            <span v-if="model.type === 1">
              <label>{{ dialogLabel.Address }}:</label>
              {{
                `${model.Address.Address}, ${model.Address.Ward},
              ${model.Address.District}, ${model.Address.City}`
              }}
            </span>
            <span v-if="model.type == 2">
              <label>{{ dialogLabel.Address }}:</label>
              {{ model.Address }}
            </span>
          </div>
          <div class="col-12 md:col-6 flex flex-column gap-2 label-view">
            <span>
              <label
                >{{ dialogLabel.CreateAt }}:{{
                  format(model.CreateAt, "dd/MM/yyyy")
                }}</label
              >
            </span>
            <span>
              <label>{{ dialogLabel.Creater }}:</label>{{ model.Creater }}
            </span>
            <span>
              <label
                >{{ dialogLabel.Approval }}:{{
                  model.ApprovalStatus == "P"
                    ? "Đang chờ"
                    : model.ApprovalStatus == "A"
                    ? "Đã phê duyệt"
                    : model.ApprovalStatus == "R"
                    ? "Từ chối"
                    : "Huỷ"
                }}</label
              >
            </span>
            <span v-if=" model.type !== 1">
              Loại yêu cầu: {{ model.IsInPlanned === 'N' ? 'Phát sinh mới':'Trong kế hoạch'  }}
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
          <TabPanel header="Danh sách hàng hoá">
            <DataTable
              showGridlines
              resizableColumns
              size="small"
              columnResizeMode="expand"
              :value="model.data2"
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
                  {{ numberToCurrency(slotProps.data.Quantity) }}
                </template>
              </Column>
              <Column :header="dialogLabel.SPL2.Unit" style="width: 10rem">
                <template #body="slotProps">
                  {{ slotProps.data.UomName }}
                </template>
              </Column>
              <Column
                field="UnitPrice"
                :header="dialogLabel.SPL2.UnitPrice"
                sortable
                style="width: 10rem; text-align: right"
              >
                <template #body="slotProps">
                  {{ numberToCurrency(slotProps.data.UnitPrice) }} ₫
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
                  ₫
                </template>
              </Column>
              <Column field="Memo" :header="dialogLabel.SPL2.Memo" style="width: 10rem">
                <template #body="slotProps">
                  {{ slotProps.data.Memo }}
                </template>
              </Column>
              <template #footer>
                <div class="flex justify-between">
                  <div class="right-footer">
                    <div class="mr-5">
                      <div class="flex justify-between">
                        <span class="mr-3"> {{ dialogLabel.TotalPrice }} ₫ </span>
                        <span class="font-normal">
                          {{ numberToCurrency(computingPrice()) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="right-footer">
                    <div class="mr-5">
                      <div class="flex justify-between">
                        <span class="mr-3"> {{ dialogLabel.Price2Word }} ₫ </span>
                        <span class="font-normal">
                          {{ VND2Word(computingPrice()) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </DataTable>
          </TabPanel>
          <TabPanel header="Tệp đính kèm">
            <DataTable
              size="small"
              showGridlines
              resizableColumns
              columnResizeMode="fit"
              :value="model.SPL1"
              scrollable
              scrollHeight="320px"
            >
              <Column header="#" style="width: 3rem; text-align: right">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>
              <Column
                :header="dialogLabel.SPL2.File"
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
              <Column field="PatchName" header="Tên tệp"></Column>
              <Column field="PatchDesc" header="Ghi chú"> </Column>
              <Column header="" style="width: 3rem; text-align: center">
                <template #body="slotProps">
                  <Button
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
            </DataTable>
          </TabPanel>
        </TabView>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          label="Đóng"
          @click="dialogView = false"
        ></Button>
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="dialogTem"
    header="MẪU PHÊ DUYỆT"
    :style="{ width: '60rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
  >
    <div class="card mt-3">
      <p>Tên mẫu phê duyệt: {{ dataEdit.WMT.WtmName }}</p>
      <p>Mô tả: {{ dataEdit.WMT.WtmDesc }}</p>

      <TabView>
        <TabPanel header="Danh sách người phê duyệt">
          <DataTable
            v-model:expandedRows="dataEdit.expandedRows"
            :value="dataEdit.WMT.WTM3"
            tableStyle="min-width: 50rem"
            dataKey="ID"
          >
            <Column expander style="width: 3rem" />
            <Column header="Tên cấp phê duyệt" field="WstName">
              <template #body="slotProps">
                <div class="flex align-items-center">
                  <Button
                    icon="pi pi-arrow-circle-right text-yellow-500"
                    text
                    @click="getLevelApp(slotProps.data.WstID)"
                  />
                  <span>{{ slotProps.data.WstName }}</span>
                </div>
              </template></Column
            >
            <Column header="Mô tả" field="WstDesc"></Column>
            <Column header="Cấp độ" field="StepCode"></Column>
            <template #expansion="slotProps">
              <DataTable :value="slotProps.data.WST1" tableStyle="min-width: 50rem">
                <Column header="Mã người phê duyệt" field="UserCode"></Column>
                <Column header="Tên người phê duyệt" field="UserName"></Column>
              </DataTable>
            </template>
          </DataTable>
        </TabPanel>
        <TabPanel header="Điều kiện">
          <p>Khởi động Quy trình phê duyệt</p>
          <div>
            <div class="flex align-items-center mb-3">
              <RadioButton v-model="dataEdit.WMT.Conds" value="Y" disabled="true" />
              <label for="ingredient1" class="ml-2">Luôn luôn</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="dataEdit.WMT.Conds" value="N" disabled="true" />
              <label for="ingredient2" class="ml-2">Khi thỏa mãn điều kiện</label>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  </Dialog>
  <Dialog
    v-model:visible="dialogLevelApp"
    :style="{ width: '750px' }"
    header="CẤP PHÊ DUYỆT"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <p>Tên cấp phê duyệt: {{ dataEdit.LevelApp.WstName }}</p>
    </div>
    <div class="field">
      <p>Mô tả: {{ dataEdit.LevelApp.WstDesc }}</p>
    </div>
    <div class="grid">
      <div class="col-6">
        <div class="field">
          <p>Số lượng phê duyệt: {{ dataEdit.LevelApp.MaxReqr }}</p>
        </div>
      </div>
      <div class="col-6">
        <div class="field">
          <p>Số lượng từ chối: {{ dataEdit.LevelApp.MaxRejReqr }}</p>
        </div>
      </div>
    </div>

    <div class="field">
      <DataTable
        showGridlines
        :value="dataEdit.LevelApp.data.filter((val) => val.Type !== 'D')"
        responsiveLayout="scroll"
        dataKey="ID"
        size="small"
      >
        <Column
          field="UserName"
          header="Người phê duyệt"
          :sortable="true"
          headerStyle="width:50%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">UserName</span>
            {{ slotProps.data.UserName }}
          </template>
        </Column>
        <Column
          field="OrsName"
          header="Đơn vị trực thuộc"
          :sortable="true"
          headerStyle="width:50%; min-width:10rem;"
        >
          <template #body="slotProps">
            <span class="p-column-title">OrsName</span>
            {{ slotProps.data.OrsName }}
          </template>
        </Column>
      </DataTable>
    </div>
    <template #footer>
      <Button label="Đóng" icon="pi pi-times" outlined @click="dialogLevelApp = false" />
    </template>
  </Dialog>
</template>
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
.selected-row {
  background-color: yellow;
}
</style>
<script setup>
import { onBeforeMount, ref, watchEffect, reactive, watch } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import CRUD from "../../services/dataCRUD";
import { format } from "date-fns";
import { VND2Word } from "../../extension/Extention";


// ---------- Tìm kiếm ---------------
var sourceData = [];
const searchKey = ref('');

var delayTimer;
const onTyping = () => {
  clearTimeout(delayTimer);
  delayTimer = setTimeout(onSearch, 300);
}

watch(searchKey,() => {
  onTyping();
});

const onSearch = () => {
  if(!searchKey.value.trim())
    dataTable.value = sourceData;
  else{
    dataTable.value = sourceData.filter(el => (
      el.Obj.ObjCode.toLowerCase().includes(searchKey.value.trim().toLowerCase()) ||
      el.Obj.ObjName.toLowerCase().includes(searchKey.value.trim().toLowerCase())
    ));
  }
}
// ---------------------------------------

// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const dataTable = ref([]);

// -----------------------------End phân trang--------------------------------

//-------------------- Start CRUD ------------------
const dialogReport = ref(true);
const dialogLevelApp = ref(false);
const dialogView = ref(false);
const dialogTem = ref(false);

const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const DataStatus = ref([
  {
    code: "R",
    name: "Từ chối",
  },
  {
    code: "A",
    name: "Phê duyệt",
  },
  {
    code: "P",
    name: "Đang chờ",
  },
]);
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
  City_plh: "Chọn Tỉnh/Thành phố",
  District_plh: "Chọn Quận/Huyện",
  Ward_plh: "Chọn Phường/Xã",
  Product_btn: "Chọn sản phẩm",
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
const User = ref(JSON.parse(localStorage.getItem("user")));
const model = ref({});
onBeforeMount(async () => {
  getListUser();
  const ID = parseInt(route.query.id) || 0;
  if (ID) {
    dataEdit.value.id = ID;
    dialogReport.value = false;
    await Filter();
    openDetailWindown(dataTable.value[0]);
  }
});

watchEffect(() => {
  if (dataEdit.value.all == "Y") {
    dataEdit.value.pending = "Y";
    dataEdit.value.approved = "Y";
    dataEdit.value.refuse = "Y";
    dataEdit.value.cancel = "Y";
  } else {
    dataEdit.value.pending = "N";
    dataEdit.value.approved = "N";
    dataEdit.value.refuse = "N";
    dataEdit.value.cancel = "N";
  }
});

const getListUser = () => {
  API.get_all("user/getall?size=0&page=0").then((res) => {
    dataEdit.value.Users = res.data.data;
    dataEdit.value.Users = dataEdit.value.Users.slice().sort((a, b) =>
      a.UserName.localeCompare(b.UserName)
    );
  });
};

const getDataWhenAction = (t) => {
  resetData();
};

const openNew = () => {
  dialogReport.value = true;
};

const hideDialog = () => {
  alert(dialogReport.value);
  dialogReport.value = false;
  alert(dialogReport.value);
  // dataEdit.value = {};
};

const resetData = () => {
  loadAction.value = false;
  // dataEdit.value = {};
  dialogReport.value = false;
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
const Filter = async () => {
  dataEdit.value.detal = null;
  const approved =
    dataEdit.value.approved == "Y" ? "&approved=" + dataEdit.value.approved : "";
  const cancel = dataEdit.value.cancel == "Y" ? "&cancel=" + dataEdit.value.cancel : "";
  const from_date = dataEdit.value.from_date
    ? "&from_date=" + JSON.stringify(dataEdit.value.from_date)
    : "";
  const from_to = dataEdit.value.from_to
    ? "&from_to=" + JSON.stringify(dataEdit.value.from_to)
    : "";
  const ospl = dataEdit.value.ospl == "Y" ? "&ospl=" + dataEdit.value.ospl : "";
  const osre = dataEdit.value.osre == "Y" ? "&osre=" + dataEdit.value.osre : "";
  const pending =
    dataEdit.value.pending == "Y" ? "&pending=" + dataEdit.value.pending : "";
  const refuse = dataEdit.value.refuse == "Y" ? "&refuse=" + dataEdit.value.refuse : "";
  const user_create_from = dataEdit.value.user_create_from
    ? "&user_create_from=" + dataEdit.value.user_create_from
    : "";
  const user_create_to = dataEdit.value.user_create_to
    ? "&user_create_to=" + dataEdit.value.user_create_to
    : "";

  const id = dataEdit.value.id ? "&id=" + dataEdit.value.id : "";

  const key =
    approved +
    cancel +
    from_date +
    from_to +
    ospl +
    osre +
    pending +
    refuse +
    user_create_from +
    user_create_to +
    id;
  await API.get_all("owdd/me?page=0&size=0" + key).then((res) => {
    if (res.data.data != null) {
      dataTable.value = res.data.data;
      sourceData = res.data.data;
      dialogReport.value = false;
    } else {
      notification("error", "Không tìm thấy bản ghi nào phù hợp");
    }
  });
};

const openDetailWindown = (event) => {
  dataEdit.value.loading = false;
  setTimeout(function () {
    API.get_all("owdd/getbyid?id=" + event.ID).then((res) => {
      dataEdit.value.detal = res.data;
      dataEdit.value.loading = true;
      dataEdit.value.rowSelect = event;
      dataEdit.DocID = event.DocID;
      dataEdit.ObjType = event.ObjType;
      rowClass(event);
    });
  }, 50);
};

const rowClass = (data) => {
  return { "bg-primary": data === dataEdit.value.rowSelect };
};

const Approval = (event, data) => {
  dataEdit.value.status_now = event.value;
  dataEdit.value.dataHehe = data.data;
};

const sendApp = () => {
  if (dataEdit.value.status_now) {
    const Data = {
      Status: dataEdit.value.status_now,
      ObjType: dataEdit.value.rowSelect.ObjType,
      DocID: dataEdit.value.rowSelect.DocID,
    };
    API.update_v2(Data, "owdd/approval")
      .then((res) => {
        if (res.data === "true") {
          dataEdit.value.dataHehe.ApprovalAt = new Date();
          notification("success", "Cập nhật thành công");
        }
      })
      .catch((error) => {
        notification("error", "Cập nhật không thành công");
      });
  }
};

function fetchOSPLbyId(data) {
  document.body.style.cursor = "wait";
  model.value.type = data.ObjType;
  const url = model.value.type == 1 ? "ospl/getbyid?id=" : "osre/getbyid?id=";
  API.get_all(url + data.Obj.ID).then((res) => {
    if (res.data) {
      model.value.ID = res.data.ID;
      model.value.Address = res.data[model.value.type == 1 ? "SPL3" : "FullAddress"];
      model.value.data1 = res.data[model.value.type == 1 ? "SPL1" : "SRE1"].map((x) => ({
        ...x,
        Type: "U",
      }));
      model.value.data2 = res.data[model.value.type == 1 ? "SPL2" : "SRE2"].map((x) => ({
        ...x,
        selectedUnitID: x.UgpID,
        ItemName: x.Oitm.ItemName,
        UGP: [1, 2, 3],
        Type: "U",
      }));
      model.value.Oors = {
        ID: res.data.OorsID,
        OorsCode: res.data.Oors.OrsCode,
        OorsName: res.data.Oors.OrsName,
      };
      model.value.TimeNeeded = res.data.TimeNeeded;
      model.value.code = model.value.type == 1 ? res.data.PlanCode : res.data.OsreCode;
      model.value.name = model.value.type == 1 ? res.data.PlanName : res.data.OsreName;
      model.value.ExcQuarter = res.data.ExcQuarter;
      model.value.ExcYear = new Date(res.data.ExcYear, 0);
      model.value.ApprovalStatus = res.data.ApprovalStatus;
      model.value.Creater = res.data.CreateBy1.UserName;
      model.value.CreateAt = res.data.CreatedAt;
      if( model.value.type !== 1) {
        model.value.IsInPlanned = res.data.IsInPlanned;
      }
      dialogView.value = true;
    }
    document.body.style.cursor = "default";
  });
}
function numberToCurrency(num) {
  const formatter = new Intl.NumberFormat("en-EN");
  return formatter.format(num);
}

function computingPrice() {
  let price = 0;
  try {
    price = model.value.data2
      .map((x) => x.ToPrice)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
  } catch (e) {
    console.log(e);
  }
  return price;
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

const getTemplate = (id) => {
  API.get_all("owdd/wst?id=" + id).then((res) => {
    dataEdit.value.WMT = res.data;
    dialogTem.value = true;
    console.log(dataEdit.value.WMT);
  });
};
const getLevelApp = (id) => {
  API.get_all("owst/getbyid?id=" + id).then((res) => {
    dataEdit.value.LevelApp = res.data;
    dialogLevelApp.value = true;
    console.log(dataEdit.value.LevelApp);
  });
};
</script>
