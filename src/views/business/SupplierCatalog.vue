<template>
  <!-- Header -->
  <template v-if="!infoWindows">
    <div class="bg-surface-card">
      <div class="">
        <div class="flex align-items-center col-6">
          <h5 style="color: #0773bb" class="text-black m-2 p-2 mb-0 mt-0 font-semibold">
            {{ $t("supplier_catalog.header").toLocaleUpperCase() }}
          </h5>
        </div>
      </div>
    </div>
    <!-- End Header -->
    <!-- Data -->

    <template v-if="true">
      <!-- !errorsuppliersData -->
      <template v-if="true">
        <DataTable
          v-model:selection="selectedSupplier"
          :value="suppliersData.data"
          showGridlines
          tableStyle="min-width: 50rem"
          lazy
          :loading="loadingSuppliersData"
          :totalRecords="suppliersData.TotalCount"
          :rowsPerPageOptions="[10, 20, 50]"
          :rows="PAGE_SIZE"
          dataKey="ID"
          paginator
          size=""
          @page="onPageChange($event)"
          :pt="{
          loadingOverlay: {
              style: 'background: none;',
            },
          }"
        >
        <template #loading>
          <Loading />
        </template>
          <template #header>
            <div class="flex justify-between">
              <span class="block p-input-button">
                <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                <Button @click="onSearch" icon="pi pi-search"></Button>
              </span>
              <div>
                <Button
                  class="mr-3"
                  icon="pi pi-plus"
                  @click="openAddDialog"
                  :label="$t('Button.AddNew')"
                ></Button>
                <Button
                  :disabled="selectedSupplier.length < 1"
                  icon="pi pi-trash"
                  class="p-button-danger"
                  @click="deleteSuppliers"
                  :label="$t('Button.Delete')"
                ></Button>
              </div>
            </div>
          </template>
          <Column selectionMode="multiple"></Column>
          <Column field="CardName" :header="$t('supplier_catalog.name')">
            <template #body="slotProp">
              <span @click="openDetailWindown(slotProp.data.ID)" class="link-text"
                >{{ slotProp.data.CardName }} <i class="pi pi-link ml-2"></i
              ></span>
            </template>
          </Column>
          <Column field="Email" header="Email"></Column>
          <Column :header="$t('supplier_catalog.phone')" field="Phone"></Column>
          <Column :header="$t('supplier_catalog.status')" style="width: 11rem;">
            <template #body="slotProps">
              {{
                slotProps.data.IsActive === "A"
                  ? $t("Status.Active")
                  : $t("Status.InActive")
              }}
            </template>
          </Column>
          <Column :header="$t('supplier_catalog.registration_status')">
            <template #body="slotProps">
              <span
                :style="{ color: slotProps.data.SubStatus === 'R' ? 'rgb(0 165 0)' : '#e31a1a' }"
                >{{ getSubStatusLabel(slotProps.data.SubStatus) }}</span
              >
            </template>
          </Column>
          <Column
            :header="$t('OrgStrct.Action')"
            style="min-width: 7rem; width: 8rem;"
          >
            <template #body="dataProps">
              <div class="flex justify-content-center gap-3">
                <Button
                style="padding: 0;width: 24px;height: 24px;"
                icon="pi pi-pencil"
                text
                @click="openUpdate(dataProps.data)"
                />
                <Button
                style="padding: 0;width: 24px;height: 24px;"
                text
                v-if="!dataProps.data.children || dataProps.data.children.length < 1"
                icon="pi pi-trash"
                @click="showConfirmDelete(dataProps.data.ID)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
      <template v-else>
        <div class="flex justify-center align-items-center p-error"></div>
      </template>
    </template>
    <template v-else>
      <div
        class="flex"
        style="justify-content: center; align-items: center; background-color: #dbe2e8"
      >
        <ProgressSpinner
          style="min-height: 50rem"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
    </template>
    <!-- End Data -->
  </template>
  <template v-else>
    <div class="mx-3">
      <div class="fixed-header flex">
        <div class="flex align-items-center justify-between">
          <h5 style="color: var(--primary-color)" class="font-semibold m-0">
            {{ $t("supplier_catalog.w_header").toLocaleUpperCase() }}
          </h5>
        </div>
      </div>
      <div class="grid container">
        <div class="fixed-panel">
          <div class="card pb-3">
            <div class="flex justify-center">
              <div class="image-company">
                <Image
                  :src="avatar.Link || '../../../public/assets/pictures/No-photo.png'"
                  preview
                  style="
                    height: 100px;
                    width: 100px;
                    overflow: hidden;
                    border-radius: 50%;
                    background-color: #f2f2f2;
                  "
                  class="justify-self-center"
                  :pt="{
                    image: { style: 'width: 100%; object-fit: contain; height: 100%;' },
                  }"
                />
              </div>
            </div>
            <h5 style="color: var(--primary-color)" class="font-semibold">
              Thông tin chung
            </h5>
            <hr />
            <div class="col-12">
              <a
                class="p-button-label p-button-text text-color"
                @click="scrollToSection1"
                style="cursor: pointer"
              >
                Thông tin chi tiết
              </a>
            </div>
            <div class="col-12">
              <a
                class="p-button-label p-button-text text-color"
                @click="scrollToSection2"
                style="cursor: pointer"
              >
                Thông tin liên hệ
              </a>
            </div>
            <div class="col-12">
              <a
                class="p-button-label p-button-text text-color"
                @click="scrollToSection3"
                style="cursor: pointer"
              >
                Ngành nghề lĩnh vực
              </a>
            </div>
            <div class="col-12">
              <a
                class="p-button-label p-button-text text-color"
                @click="scrollToSection4"
                style="cursor: pointer"
              >
                Điều khoản thanh toán
              </a>
            </div>
            <div class="col-12">
              <a
                class="p-button-label p-button-text text-color"
                @click="scrollToSection5"
                style="cursor: pointer"
              >
                Tài liệu
              </a>
            </div>
          </div>
        </div>

        <div class="scroll-area">
          <div class="close-button flex justify-end">
            <Button
              severity="secondary"
              icon="pi pi-times"
              :label="$t('Button.Close')"
              @click="closeDetailWindown"
            />
          </div>
          <!-- Thông tin chung -->
          <div id="section1" class="card pt-3">
            <div class="grid">
              <div class="col-12">
                <div class="flex align-items-center justify-content-between">
                  <h5 style="color: var(--primary-color)" class="py-2 m-0 font-bold">
                    Thông tin chi tiết
                  </h5>
                </div>
              </div>
              <span class="col-6">Tên công ty:</span>
              <span class="col-6">{{ dataView.CardName }}</span>
              <span class="col-6">Tên công ty (Tiếng Anh):</span>
              <span class="col-6">{{ dataView.CardFName }}</span>
              <span class="col-6">Mã số thuế</span>
              <span class="col-6">{{ dataView.LicTradNum }}</span>
              <span class="col-6">Email</span>
              <span class="col-6">{{ dataView.Email }}</span>
              <span class="col-6">Số điện thoại</span>
              <span class="col-6">{{ dataView.Phone || "-" }}</span>
              <span class="col-6">Người đại diện pháp lý:</span>
              <span class="col-6">{{ dataView.LegalRepresen }}</span>
              <span class="col-6">Địa chỉ</span>
              <span class="col-6">{{ dataView.FullAddress || "-" }}</span>
              <span class="col-6">Website</span>
              <span class="col-6">{{ dataView.Website || "-" }}</span>
              <span class="col-6">Năm thành lập</span>
              <span class="col-6">{{ dataView.FoundedY || "-" }}</span>
              <span class="col-6">Số lượng chi nhánh</span>
              <span class="col-6">{{ dataView.NumOfContr || "-" }}</span>
              <span class="col-6">Số lượng nhân sự</span>
              <span class="col-6">{{ dataView.NumOfEmpl || "-" }}</span>
            </div>
          </div>
          <!-- Thông tin liên hệ -->
          <div id="section2" class="card py-3">
            <div class="grid">
              <div class="col-12">
                <div class="flex align-items-center justify-content-between">
                  <h5 style="color: var(--primary-color)" class="py-2 m-0 font-bold">
                    Thông tin liên hệ
                  </h5>
                </div>
              </div>
              <DataTable class="w-full" :value="dataView.CRD5">
                <Column header="#" style="width: 3rem">
                  <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                  </template>
                </Column>
                <Column header="Tên người liên hệ" field="FirstName" />
                <Column header="Chức vụ" field="LastName" />
                <Column header="Số điện thoại 1" field="Phone" />
                <Column header="Số điện thoại 2" field="Address" />
                <Column header="Email" field="Email" />
                <template #empty>
                  <div class="flex justify-center align-items-center">
                    <span style="font-size: 32px" class="material-symbols-outlined">
                      data_alert
                    </span>
                    Không có dữ liệu
                  </div>
                </template>
              </DataTable>
            </div>
          </div>
          <!-- Ngành nghề lĩnh vực -->
          <div id="section3" class="card py-3">
            <div class="grid">
              <div class="col-12">
                <div class="flex align-items-center justify-content-between">
                  <h5 style="color: var(--primary-color)" class="py-2 m-0 font-bold">
                    Ngành nghề lĩnh vực
                  </h5>
                </div>
              </div>
              <DataTable
                class="w-full"
                :value="dataView.CRD2"
                :rows="5"
                :paginator="!expandPnF.isPnFExpanded"
                paginatorTemplate=""
              >
                <Column header="#" field="index" style="width: 3rem">
                  <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                  </template>
                </Column>
                <Column header="Tên lĩnh vực" field="IndName" />
                <template #empty>
                  <div class="flex justify-center align-items-center">
                    <span style="font-size: 32px" class="material-symbols-outlined">
                      data_alert
                    </span>
                    Không có dữ liệu
                  </div>
                </template>
              </DataTable>
              <div class="flex justify-end w-full">
                <a
                  v-if="dataView.CRD2.length > 5"
                  :class="{ 'mt-14px': expandPnF.isPnFExpanded }"
                  class="btn-more font-semibold"
                  @click="expandPnF.isPnFExpanded = !expandPnF.isPnFExpanded"
                  >{{
                    expandPnF.isPnFExpanded
                      ? "Ẩn bớt"
                      : `Hiện thị thêm ${dataView.CRD2.length - 5} dòng`
                  }}</a
                >
              </div>
            </div>
          </div>

          <!-- Điều khoản thanh toán -->
          <div id="section4" class="card py-3">
            <div class="grid">
              <div class="col-12">
                <div class="flex align-items-center justify-content-between">
                  <h5 style="color: var(--primary-color)" class="py-2 m-0 font-bold">
                    Điều khoản thanh toán
                  </h5>
                </div>
              </div>
              <DataTable
                class="w-full"
                :value="dataView.CRD7"
                :rows="5"
                :paginator="!expandPnF.isPayDueExpanded"
                paginatorTemplate=""
              >
                <Column header="#" style="width: 3rem">
                  <template #body="slotProps">
                    {{ ++slotProps.index }}
                  </template>
                </Column>
                <Column field="Name" header="Tên điều khoản"> </Column>
                <template #empty>
                  <div class="flex justify-center align-items-center">
                    <span style="font-size: 32px" class="material-symbols-outlined">
                      data_alert
                    </span>
                    Không có dữ liệu
                  </div>
                </template>
              </DataTable>
              <div class="flex justify-end w-full">
                <a
                  v-if="dataView.CRD7.length > 5"
                  :class="{ 'mt-14px': expandPnF.isPayDueExpanded }"
                  class="btn-more font-semibold"
                  @click="expandPnF.isPayDueExpanded = !expandPnF.isPayDueExpanded"
                  >{{
                    expandPnF.isPayDueExpanded
                      ? "Ẩn bớt"
                      : `Hiện thị thêm ${dataView.CRD7.length - 5} dòng`
                  }}</a
                >
              </div>
            </div>
          </div>

          <!-- Tài liệu -->
          <div id="section5" class="card py-3">
            <div class="grid">
              <div class="col-12">
                <div class="flex align-items-center justify-content-between">
                  <h5 style="color: var(--primary-color)" class="py-2 m-0 font-bold">
                    Tài liệu bổ sung
                  </h5>
                </div>
              </div>
              <DataTable
                class="w-full"
                :value="dataView.CRD1"
                :rows="5"
                :paginator="!expandPnF.isDocsExpanded"
                paginatorTemplate=""
              >
                <Column header="#" style="width: 3rem">
                  <template #body="slotProps">
                    {{ ++slotProps.index }}
                  </template>
                </Column>
                <Column header="" style="width: 3rem">
                  <template #body>
                    <Avatar icon="pi pi-file" size="large"> </Avatar>
                  </template>
                </Column>
                <Column field="PatchName" header="Tên tài liệu"> </Column>
                <Column field="PatchDesc" header="Ghi chú"> </Column>
                <Column header="" style="width: 3rem">
                  <template #body="slotProps">
                    <Button
                      @click="downloadFile(slotProps.data)"
                      icon="pi pi-download"
                      text
                      style="width: 24px; height: 24px"
                    ></Button>
                  </template>
                </Column>
                <template #empty>
                  <div class="flex justify-center align-items-center">
                    <span style="font-size: 32px" class="material-symbols-outlined">
                      data_alert
                    </span>
                    Không có dữ liệu
                  </div>
                </template>
              </DataTable>
              <div class="flex justify-end w-full">
                <a
                  v-if="dataView.CRD1.length > 5"
                  :class="{ 'mt-14px': expandPnF.isDocsExpanded }"
                  class="btn-more font-semibold"
                  @click="expandPnF.isDocsExpanded = !expandPnF.isDocsExpanded"
                  >{{
                    expandPnF.isPayDueExpanded
                      ? "Ẩn bớt"
                      : `Hiện thị thêm ${dataView.CRD1.length - 5} dòng`
                  }}</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <!-- Begin Dialog -->
  <Dialog
    v-model:visible="visiableDialog"
    modal
    :header="dialogMode.header"
    :style="{ width: '45rem' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
  >
    <div class="m-0 mt-2 w-full">
      <div class="grid">
        <div class="col-5">
          <div class="flex flex-column gap-2 w-full">
            <label class="p-label"
              >{{ $t("supplier_catalog.tax") }}<sup class="p-important">*</sup></label
            >
            <div class="flex justify-between">
              <InputMask
                :class="{ 'p-invalid': errorMessages.supplierTax }"
                mask="9999999999"
                class="w-10rem"
                :placeholder="$t('supplier_catalog.plh_tax')"
                v-model="supplierMainTax"
                autofocus
              />
              <div class="dash"></div>
              <InputMask
                :class="{ 'p-invalid': errorMessages.supplierTax }"
                mask="999"
                class="w-5rem"
                placeholder="xxx"
                v-model="supplierSubTax"
                autofocus
              />
            </div>
            <small v-if="errorMessages.supplierTax" class="p-error">{{
              errorMessages.supplierTax
            }}</small>
          </div>
        </div>
        <div class="col-7">
          <div class="flex flex-column gap-2">
            <label class="p-label"
              >{{ $t("supplier_catalog.name") }}<sup class="p-important">*</sup></label
            >
            <InputText
              :class="{ 'p-invalid': errorMessages.supplierName }"
              v-model="supplierName"
              :placeholder="$t('supplier_catalog.plh_name')"
            />
            <small v-if="errorMessages.supplierName" class="p-error">{{
              errorMessages.supplierName
            }}</small>
          </div>
        </div>
      </div>
      <div class="flex flex-column gap-2">
        <span class="flex justify-between">
          <label class="p-label">Email<sup class="p-important">*</sup> </label>
          <span
            class="ml-3"
            style="
              font-style: italic;
              color: rgb(110, 110, 110);
              text-decoration: underline;
            "
            >{{ $t("supplier_catalog.noti") }}</span
          >
        </span>

        <InputText
          :class="{ 'p-invalid': errorMessages.supplierEmail }"
          v-model.trim="supplierEmail"
          variant="filled"
          rows="10"
          cols="30"
          :placeholder="$t('supplier_catalog.plh_email')"
        />
        <small v-if="errorMessages.supplierEmail" class="p-error">{{
          errorMessages.supplierEmail
        }}</small>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        icon="pi pi-times"
        @click="closeAddDialog"
        severity="secondary"
      />
      <Button
        :loading="loadingButton"
        :label="$t('Button.Save')"
        icon="pi pi-save "
        @click="submit"
        autofocus
      />
    </template>
  </Dialog>

  <Dialog
    v-model:visible="visibleDialog1"
    modal
    header="Cập nhật trạng thái nhà cung cấp"
    :style="{ width: '45rem' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
  >
    <div class="m-0 mt-2 w-full">
      <div class="grid">
        <div class="col-5">
          <div class="flex flex-column gap-2 w-full">
            <label class="p-label">{{ $t("supplier_catalog.tax") }}</label>
            <div class="flex justify-between">
              <InputText class="w-10rem" :value="supplierMainTax" disabled />
              <div class="dash"></div>
              <InputText disabled class="w-5rem" :value="supplierSubTax" />
            </div>
          </div>
        </div>
        <div class="col-7">
          <div class="flex flex-column gap-2">
            <label class="p-label">{{ $t("supplier_catalog.name") }}</label>
            <InputText :value="supplierName" disabled />
            <small v-if="errorMessages.supplierName" class="p-error">{{
              errorMessages.supplierName
            }}</small>
          </div>
        </div>

        <div class="col-12">
          <div class="flex flex-column gap-2">
            <label class="p-label">Email</label>
            <InputText
              :class="{ 'p-invalid': errorMessages.supplierEmail }"
              :value="supplierEmail"
              variant="filled"
              disabled
            />
          </div>
        </div>
        <div class="col-12 flex align-items-center gap-3">
          <label class="p-label">Trạng thái</label>
          <InputSwitch v-model="supplierStatus" :trueValue="'A'" :falseValue="'I'" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        icon="pi pi-times"
        @click="visibleDialog1 = false"
        severity="secondary"
      />
      <Button
        :loading="loadingUpdateStatus"
        :label="$t('Button.Save')"
        icon="pi pi-save "
        @click="submit"
        autofocus
      />
    </template>
  </Dialog>
  <!-- End Dialog -->

  <!-- Toast -->
  <Toast position="bottom-right" group="br" />
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import API from "../../apis/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import i18n from "../../locale/i18n";
import { StatusCode } from "../../service/StatusCode";
const confirm = useConfirm();

const onSearch = () => {
  // fetchSuppliersData();
  fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
}


// -------------------- Data ------------------------
const suppliersData = ref([]);
const loadingSuppliersData = ref(true);
const errorsuppliersData = ref(true);

const dataView = ref(null);
const loadSupplierById = ref(false);
// -------------------- Models ----------------------
const avatar = reactive({
  File: null,
  LocalFileLink: null,
  Link: null,
  FileName: null,
});
const supplierMainTax = ref(null);
const supplierSubTax = ref(null);
const supplierName = ref(null);
const supplierEmail = ref(null);
const supplierStatus = ref("A");

const errorMessages = reactive({
  supplierTax: null,
  supplierName: null,
  supplierEmail: null,
});

// -------------------- Variables -------------------
// Xem thêm --------------------
const expandPnF = reactive({
  isPnFExpanded: false,
  isPayDueExpanded: false,
  isDocsExpanded: false,
});

const CURRENT_PAGE = ref(1);
const PAGE_SIZE = ref(10);

const showDetailSupplier = ref(false);
const showDetailContact = ref(false);

const loadingButton = ref(false);
const isValidate = ref(false);
const toast = useToast();

const selectedSupplier = ref([]);
const infoWindows = ref(false);
const visiableDialog = ref(false);
const searchKey = ref([]);

const completionScore = ref(52);
const dialogMode = reactive({
  mode: "",
  header: "",
  primaryButton: "",
  secondaryButton: "",
});

// -------------------- Methods ---------------------

const scrollToSection1 = () => {
  const el = document.getElementById("section1");
  window.scrollTo(0, el.offsetTop - 126);
};

const scrollToSection2 = () => {
  const el = document.getElementById("section2");
  window.scrollTo(0, el.offsetTop - 126);
};

const scrollToSection3 = () => {
  const el = document.getElementById("section3");
  window.scrollTo(0, el.offsetTop - 126);
};

const scrollToSection4 = () => {
  const el = document.getElementById("section4");
  window.scrollTo(0, el.offsetTop - 126);
};
const scrollToSection5 = () => {
  const el = document.getElementById("section5");
  window.scrollTo(0, el.offsetTop - 126);
};

const submit = () => {
  checkValidate();

  switch (dialogMode.mode) {
    case "A":
      if (isValidate.value) addSupplier();
      break;
    case "U":
      if (isValidate.value) updateSupplier();
      break;
    default:
      break;
  }
};

const onPageChange = (event) => {
  CURRENT_PAGE.value = event.originalEvent.page + 1;
  PAGE_SIZE.value = event.originalEvent.rows;
  // console.log(event)
  fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
};

const checkValidate = () => {
  isValidate.value = true;
  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  resetErrorMessage();
  if (!supplierMainTax.value || !supplierMainTax.value.trim()) {
    errorMessages.supplierTax = i18n.global.t("valid_msg.null", [
      i18n.global.t("supplier_catalog.tax"),
    ]);
    isValidate.value = false;
  }

  if (!supplierName.value || !supplierName.value.trim()) {
    errorMessages.supplierName = i18n.global.t("valid_msg.null", [
      i18n.global.t("supplier_catalog.name"),
    ]);
    isValidate.value = false;
  }
  if (
    supplierName.value &&
    supplierName.value.trim() &&
    supplierName.value.length > 254
  ) {
    errorMessages.supplierName = i18n.global.t("valid_msg.leng", [
      i18n.global.t("supplier_catalog.name"),
      254,
    ]);
    isValidate.value = false;
  }
  if (!supplierEmail.value || !supplierEmail.value.trim()) {
    errorMessages.supplierEmail = i18n.global.t("valid_msg.null", ["Email"]);
    isValidate.value = false;
  } else {
    if (!supplierEmail.value.trim().match(emailRegExp)) {
      errorMessages.supplierEmail = i18n.global.t("valid_msg.invalid_email");
      isValidate.value = false;
    }
    if (
      supplierEmail.value &&
      supplierEmail.value.trim() &&
      supplierEmail.value.trim().length > 100
    ) {
      errorMessages.supplierEmail = i18n.global.t("valid_msg.leng", [
        i18n.global.t("supplier_catalog.name"),
        100,
      ]);
      isValidate.value = false;
    }
  }
};

const deleteSuppliers = () => {
  if (selectedSupplier.value.length > 0) {
    const ids = selectedSupplier.value.map((item) => ({ ID: item.ID }));
    console.log({ data: ids });
    confirm.require({
      message: i18n.global.t("cf_dl.deletes", [ids.length]),
      header: i18n.global.t("cf_dl.del_title"),
      icon: "pi pi-info-circle",
      rejectLabel: i18n.global.t("Button.Cancel"),
      acceptLabel: i18n.global.t("Button.Delete"),
      rejectClass: "p-button-secondary",
      acceptClass: "p-button-danger",
      accept: () => {
        API.delete_v2({ data: ids }, "ocrd/delete")
          .then((res) => {
            if (res.status >= 200) {
              showToast(
                "success",
                i18n.global.t("severity.success"),
                i18n.global.t("toast_message.delete_success")
              );
              if (suppliersData.value.HasMore)
                fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
              else {
                CURRENT_PAGE.value -= 1;
                fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
              }
            }
          })
          .catch((error) => {
            showToast(
              "error",
              i18n.global.t("severity.error"),
              i18n.global.t("toast_message.delete_failed")
            );
          });
      },
      reject: () => {},
    });
  }
};

const addSupplier = () => {
  loadingButton.value = true;
  const tax = `${supplierMainTax.value.trim()}${
    supplierSubTax.value ? "-" + supplierSubTax.value.trim() : ""
  }`;
  const dataSupplier = {
    CardName: supplierName.value.trim().toString(),
    Email: supplierEmail.value.trim().toString(),
    LicTradNum: tax,
    IsActive: supplierStatus.value,
    SubStatus: "I",
  };
  // console.log(data);
  API.add_new_v2(dataSupplier, "ocrd/create")
    .then((res) => {
      loadingButton.value = false;
      if (res.status === 200) {
        if (res.data) {
          switch (res.data.CodeErr) {
            case StatusCode.success:
              closeAddDialog();
              showToast(
                "success",
                i18n.global.t("severity.success"),
                i18n.global.t("toast_message.add_success")
              );
              fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
              break;
            case StatusCode.duplicate_key:
              if (res.data.Errors.includes(tax))
                errorMessages.supplierTax = i18n.global.t("valid_msg.exist", [
                  i18n.global.t("supplier_catalog.tax").toLocaleLowerCase(),
                ]);
              if (res.data.Errors.includes(dataSupplier.CardName))
                errorMessages.supplierName = i18n.global.t("valid_msg.exist", [
                  i18n.global.t("supplier_catalog.name").toLocaleLowerCase(),
                ]);
              if (res.data.Errors.includes(dataSupplier.Email))
                errorMessages.supplierEmail = i18n.global.t("valid_msg.exist", ["email"]);
              break;
            default:
              break;
          }
        } else {
          showToast(
            "error",
            i18n.global.t("severity.error"),
            "Thêm mới nhà cung cấp lỗi"
          );
        }
      } else {
        showToast("error", i18n.global.t("severity.error"), "Thêm mới nhà cung cấp lỗi");
      }
    })
    .catch((error) => {
      loadingButton.value = false;
      showToast("error", error.status, error.message);
    });
};

const openDetailWindown = (id) => {
  loadSupplierById.value = true;
  Object.assign(expandPnF, {
    isPnFExpanded: false,
    isPayDueExpanded: false,
    isDocsExpanded: false,
  });
  dataView.value = null;
  infoWindows.value = true;
  const param = {
    data: {
      id: id,
    },
  };
  API.get_all_v2("ocrd/getbyid", param)
    .then((res) => {
      loadSupplierById.value = false;
      dataView.value = res.data;
      dataView.value.FullAddress = [
        res.data.Address,
        res.data.Commune,
        res.data.District,
        res.data.City,
      ]
        .filter((x) => x)
        .join(", ")
        .toString();
      dataView.value.LegalRepresen = `${dataView.value.CRD6.FirstName || ""} ${
        dataView.value.CRD6.LastName ? "(" + dataView.value.CRD6.LastName + ")" : ""
      }`;
      avatar.Link = res.data.LinkAvatar;
    })
    .catch((error) => {
      const summary = i18n.global.t("severity.error");
      loadSupplierById.value = false;
      dataView.value = null;
      if (error.response) {
        // Request đã được tạo ra và server đã hồi đáp với một mã trạng thái
        // nằm ra ngoài tầm 2xx
        showToast("error", summary, error.response.status);
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // Request đã được tạo ra nhưng không nhận được hồi đáp nào
        // Trong trình duyệt, `error.request` là instance của XMLHttpRequest
        // còn trong node.js thì nó là instance của http.ClientRequest
        // console.log(error.request);
        showToast("error", summary, error.request);
      } else {
        // Điều gì đó đã xảy ra trong bước thiết lập request rồi gây nên lỗi
        // console.log('Lỗi', error.message);
        showToast("error", summary, error.message);
      }
    });
};

const closeDetailWindown = () => {
  infoWindows.value = false;
  dataView.value = null;
  showDetailSupplier.value = false;
  showDetailContact.value = false;
};

const downloadFile = (link, fileName) => {
  if (link) {
    fetch(link, { method: "get", mode: "no-cors", referrerPolicy: "no-referrer" })
      .then((res) => res.blob())
      .then((res) => {
        const aElement = document.createElement("a");
        aElement.setAttribute("download", fileName);
        const href = URL.createObjectURL(res);
        aElement.href = href;
        aElement.setAttribute("target", "_blank");
        aElement.click();
        URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "error", error.message);
      });
  }
};

const resetErrorMessage = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
};

const openAddDialog = () => {
  resetErrorMessage();
  supplierMainTax.value = null;
  supplierSubTax.value = null;
  supplierName.value = null;
  supplierEmail.value = null;
  supplierStatus.value = "A";
  loadingButton.value = false;
  dialogMode.header = i18n.global
    .t("dlg_title.add", [
      i18n.global.t("supplier_catalog.object_name").toLocaleLowerCase(),
    ])
    .toUpperCase();
  dialogMode.mode = "A";
  visiableDialog.value = true;
};

const visibleDialog1 = ref(false);
const openUpdate = (data) => {
  console.log(data);
  dialogMode.header = i18n.global.t("dlg_title.update", [
    i18n.global.t("supplier_catalog.object_name").toLocaleLowerCase(),
  ]);
  dialogMode.mode = "U";
  if (data.SubStatus === "I") {
    modeUpdate.value = 1;
    visiableDialog.value = true;
    const taxSplit = data.LicTradNum.split("-");
    supplierMainTax.value = taxSplit[0];
    supplierSubTax.value = taxSplit[1];
    supplierName.value = data.CardName;
    supplierEmail.value = data.Email;
  } else {
    modeUpdate.value = 2;
    visibleDialog1.value = true;
    const taxSplit = data.LicTradNum.split("-");
    suppliersID.value = data.ID;
    supplierMainTax.value = taxSplit[0];
    supplierSubTax.value = taxSplit[1];
    supplierName.value = data.CardName;
    supplierEmail.value = data.Email;
    supplierStatus.value = data.IsActive;
  }
};
const modeUpdate = ref();
const suppliersID = ref();
const loadingUpdateStatus = ref(false);
const updateSupplier = async () => {
  loadingUpdateStatus.value = true;
  if (modeUpdate.value === 1) {
    alert("Tính năng đang phát triển, :P");
  } else if (modeUpdate.value === 2) {
    const data = {
      ID: suppliersID.value,
      IsActive: supplierStatus.value,
    };
    // console.log(data);

    try {
      const res = await API.putAsync("ocrd/update", data);
      if (res.status === 200) {
        // console.log(res);
        visibleDialog1.value = false;
        showToast("success", "Thành công", "Cập nhật trạng thái thành công");
        fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    showToast("error", "Exception", "Unhandler exception!");
  }
  loadingUpdateStatus.value = false;
};

const showConfirmDelete = (id2d) => {
  confirm.require({
    message: "Bạn có muốn xoá nhà cung cấp này",
    header: i18n.global.t("cf_dl.del_title"),
    icon: "pi pi-info-circle",
    rejectLabel: i18n.global.t("Button.Cancel"),
    acceptLabel: i18n.global.t("Button.Delete"),
    rejectClass: "p-button-secondary",
    acceptClass: "p-button-danger",
    accept: () => {
      API.delete_v2({ data: [{ ID: id2d }] }, "ocrd/delete")
        .then((res) => {
          if (res.status >= 200) {
            showToast(
              "success",
              i18n.global.t("severity.success"),
              i18n.global.t("toast_message.delete_success")
            );
            fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
          }
        })
        .catch((error) => {
          showToast(
            "error",
            i18n.global.t("severity.error"),
            i18n.global.t("toast_message.delete_failed")
          );
        });
    },
    reject: () => {},
  });
};

const closeAddDialog = () => {
  visiableDialog.value = false;
};

onMounted(() => {
  fetchSuppliersData(CURRENT_PAGE.value, PAGE_SIZE.value);
});
const fetchSuppliersData = (page, size) => {
  API.get_all_v2("ocrd/getall", {
    data: {
      size: size,
      page: page,
      q: searchKey.value
    },
  })
    .then((res) => {
      suppliersData.value = res.data || [];
      loadingSuppliersData.value = false;
      errorsuppliersData.value = false;
      // showToast('success', i18n.global.t('severity.success'), 'hehe');
    })
    .catch((err) => {
      loadingSuppliersData.value = false;
      errorsuppliersData.value = true;
      const summary = i18n.global.t("severity.error");
      if (err.response) {
        showToast("error", summary, err.response);
      } else if (err.request) {
        showToast("error", summary, err.request);
      } else {
        showToast("error", summary, err.message);
      }
    });
};

const getSubStatusLabel = (key) => {
  switch (key) {
    case "I":
      return i18n.global.t("Status.Unregistered");
    case "R":
      return i18n.global.t("Status.Registered");
    default:
      return key;
  }
};

const showToast = (severity, summary, msg) => {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
};
</script>

<style scoped>
.link-text:hover {
  color: rgb(5, 65, 108);
  text-decoration: underline;
}
.link-text {
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
}
.dash {
  margin: auto 0 auto 0;
  align-items: center;
  width: 7px;
  display: flex;
  background: #6a6a6a;
  height: 1px;
}

.image-company {
  display: flex;
  position: relative;
  justify-content: center;
}

.fixed-header {
  margin: 1rem 0 0 1rem;
  top: 5.5rem;
  position: fixed;
  z-index: 1000;
}
.fixed-panel {
  position: fixed;
  margin-top: 4.5rem;
  width: 20rem;
  z-index: 1;
}
.scroll-area {
  /* margin-top: 4.5rem; */
  margin-left: 21rem;
  width: 100% !important;
}
.close-button {
  margin: 1.1rem 0 0.64rem 0;
  width: 100%;
  padding-right: 1rem;
}

.btn-more {
  color: var(--primary-color);
  padding: 0.7rem;
  cursor: pointer;
}
.btn-more:hover {
  color: var(--blue-800);
  text-decoration: underline;
}

.mt-14px {
  margin-top: 14px;
}
/* 
.field {
  margin-bottom: 0;
  line-height: 23px;
}

.field:hover button {
  visibility: visible;
  transition: visibility 0s;
  transition-delay: 0s;
  opacity: 0s linear;
} */
</style>
<style>
html {
  scroll-behavior: smooth;
}
</style>
