<template>
  <div class="m-3">
    <div class="fixed-header">
      <div class="flex w-full align-items-center mt-2 col-6">
        <h5 style="color: var(--primary-color)" class="font-semibold">HỒ SƠ THÔNG TIN</h5>
      </div>
    </div>
    <div class="grid container">
      <div class="fixed-panel">
        <div class="card">
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
              <Button
                class="upload-avatar"
                icon="pi pi-camera"
                style="height: 2rem; width: 2rem"
                @click="openUploadAvatar"
              />
            </div>
          </div>
          <h5 style="color: var(--primary-color)" class="font-semibold">
            Thông tin công ty
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
          <hr />
          <div class="col-12">
            <a
              class="p-button-label p-button-text text-color"
              @click="openChangePassword"
              style="cursor: pointer"
            >
              Đổi mật khẩu
            </a>
          </div>
        </div>
      </div>

      <div class="scroll-area">
        <!-- Thông tin chung -->
        <div id="section1" class="card pt-3">
          <div class="grid">
            <div class="col-12">
              <div class="flex align-items-center justify-content-between">
                <h5 style="color: var(--primary-color)" class="m-0 font-bold">
                  Thông tin chi tiết
                </h5>
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="openUpdateProfile(0)"
                />
              </div>
            </div>
            <span class="col-6">Tên công ty:</span>
            <span class="col-6">{{ modelView.CardName }}</span>
            <span class="col-6">Tên công ty (Tiếng Anh):</span>
            <span class="col-6">{{ modelView.CardFName }}</span>
            <span class="col-6">Mã số thuế</span>
            <span class="col-6">{{ modelView.LicTradNum }}</span>
            <span class="col-6">Email</span>
            <span class="col-6">{{ modelView.Email }}</span>
            <span class="col-6">Số điện thoại</span>
            <span class="col-6">{{ modelView.Phone || "-" }}</span>
            <span class="col-6">Người đại diện pháp lý:</span>
            <span class="col-6">{{ modelView.LegalRepresen }}</span>
            <span class="col-6">Địa chỉ</span>
            <span class="col-6">{{ modelView.FullAddress || "-" }}</span>
            <span class="col-6">Website</span>
            <span class="col-6">{{ modelView.Website || "-" }}</span>
            <span class="col-6">Năm thành lập</span>
            <span class="col-6">{{ modelView.FoundedY || "-" }}</span>
            <span class="col-6">Số lượng chi nhánh</span>
            <span class="col-6">{{ modelView.NumOfContr || "-" }}</span>
            <span class="col-6">Số lượng nhân sự</span>
            <span class="col-6">{{ modelView.NumOfEmpl || "-" }}</span>
          </div>
        </div>
        <!-- Thông tin liên hệ -->
        <div id="section2" class="card pt-3">
          <div class="grid">
            <div class="col-12">
              <div class="flex align-items-center justify-content-between">
                <h5 style="color: var(--primary-color)" class="m-0 font-bold">
                  Thông tin liên hệ
                </h5>
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="openUpdateProfile(1)"
                />
              </div>
            </div>
            <DataTable class="w-full" :value="modelView.CRD5">
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
                <h5 style="color: var(--primary-color)" class="m-0 font-bold">
                  Ngành nghề lĩnh vực
                </h5>
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="openUpdatePnF"
                />
              </div>
            </div>
            <DataTable
              class="w-full"
              :rows="5"
              :paginator="!expandPnF.isPnFExpanded"
              paginatorTemplate=""
              :value="modelView.CRD2"
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
                v-if="modelView.CRD2.length > 5"
                :class="{ 'mt-14px': expandPnF.isPnFExpanded }"
                class="btn-more font-semibold"
                @click="expandPnF.isPnFExpanded = !expandPnF.isPnFExpanded"
                >{{
                  expandPnF.isPnFExpanded
                    ? "Ẩn bớt"
                    : `Hiện thị thêm ${modelView.CRD2.length - 5} dòng`
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
                <h5 style="color: var(--primary-color)" class="m-0 font-bold">
                  Điều khoản thanh toán
                </h5>
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="openTermOfPayment"
                />
              </div>
            </div>
            <DataTable
              class="w-full"
              :rows="5"
              :paginator="!expandPnF.isPayDueExpanded"
              paginatorTemplate=""
              :value="modelView.CRD7"
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
                v-if="modelView.CRD7.length > 5"
                :class="{ 'mt-14px': expandPnF.isPayDueExpanded }"
                class="btn-more font-semibold"
                @click="expandPnF.isPayDueExpanded = !expandPnF.isPayDueExpanded"
                >{{
                  expandPnF.isPayDueExpanded
                    ? "Ẩn bớt"
                    : `Hiện thị thêm ${modelView.CRD7.length - 5} dòng`
                }}</a
              >
            </div>
          </div>
        </div>

        <!-- Tài liệu -->
        <div id="section5" class="card pt-3">
          <div class="grid">
            <div class="col-12">
              <div class="flex align-items-center justify-content-between">
                <h5 style="color: var(--primary-color)" class="m-0 font-bold">
                  Tài liệu
                </h5>
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="openUploadDocs"
                />
              </div>
            </div>
            <DataTable
              class="w-full"
              :rows="5"
              :paginator="!expandPnF.isDocsExpanded"
              paginatorTemplate=""
              :value="modelView.CRD1"
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
                v-if="modelView.CRD1.length > 5"
                :class="{ 'mt-14px': expandPnF.isDocsExpanded }"
                class="btn-more font-semibold"
                @click="expandPnF.isDocsExpanded = !expandPnF.isDocsExpanded"
                >{{
                  expandPnF.isPayDueExpanded
                    ? "Ẩn bớt"
                    : `Hiện thị thêm ${modelView.CRD1.length - 5} dòng`
                }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Toast and Dialog -->
  <!-- Cập nhật thông tin công ty và người liên hệ -->
  <Dialog
    v-model:visible="visibleInfoUpdate"
    header="Cập nhật thông tin công ty"
    modal
    :style="{ width: '90rem' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
      content: { style: 'padding-bottom: 0;' },
    }"
  >
    <TabView v-model:activeIndex="active1">
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="material-symbols-outlined">apartment</span>
            <span class="font-bold white-space-nowrap">Tổng quan</span>
          </div>
        </template>
        <div class="grid p-fluid">
          <div class="md:col-5 col-12 field">
            <label class="p-label" for="company-name"
              >Tên công ty<sup class="p-important">*</sup></label
            >
            <InputText v-model="modelEdit.CardName" id="company-name"></InputText>
          </div>
          <div class="md:col-5 col-12 field">
            <label for="company-name-eng">Tên công ty (Tiếng Anh)</label>
            <InputText v-model="modelEdit.CardFName" id="company-name-eng"></InputText>
          </div>
          <div class="md:col-2 col-12 field">
            <label class="p-label" for="company-tax"
              >Mã số thuế<sup class="p-important">*</sup></label
            >
            <InputMask
              mask="9999999999?-999"
              id="company-tax"
              :modelValue="modelEdit.LicTradNum"
              readonly
            ></InputMask>
          </div>
          <div class="md:col-3 col-12 field">
            <label class="p-label" for="company-phone"
              >Số điện thoại<sup class="p-important">*</sup></label
            >
            <InputText v-model="modelEdit.Phone" id="company-phone"></InputText>
          </div>
          <div class="md:col-5 col-12 field">
            <label class="p-label" for="company-website">Website</label>
            <InputText v-model="modelEdit.Website" id="company-website"></InputText>
          </div>
          <div class="md:col-4 col-12 field">
            <label class="p-label" for="company-email">Email</label>
            <InputText
              v-model="modelEdit.Email"
              type="email"
              id="company-email"
              readonly
            ></InputText>
          </div>
          <div class="md:col-4 col-12 field">
            <label class="p-label" for="company-legal-representative"
              >Người đại diện pháp luật</label
            >
            <InputText
              v-model="modelEdit.CRD6.FirstName"
              id="company-legal-representative"
            ></InputText>
          </div>
          <div class="md:col-4 col-12 field">
            <label class="p-label" for="company-role">Chức vụ</label>
            <InputText v-model="modelEdit.CRD6.LastName" id="company-role"></InputText>
          </div>
          <div class="md:col-12 field pb-0">
            <label class="p-label" for="company-address"
              >Địa chỉ<sup class="p-important">*</sup></label
            >
            <div class="grid">
              <div class="md:col-4 col-12">
                <AutoComplete
                  id="company-city"
                  v-model="modelEdit.City"
                  dropdown
                  :suggestions="citiOptions"
                  @complete="searchCity"
                  @change="onChangeCity"
                  @item-select="onSelectCity"
                  placeholder="-- Tỉnh/Thành phố --"
                />
              </div>
              <div class="md:col-4 col-12">
                <AutoComplete
                  id="company-district"
                  v-model="modelEdit.District"
                  dropdown
                  :disabled="!modelEdit.City"
                  :suggestions="districtOptions"
                  @change="onChangeDistrict"
                  @item-select="onSelectDistrict"
                  @focus="fillDistrictData"
                  @complete="searchDistrict"
                  placeholder="-- Quận/Huyện --"
                  forceSelection
                />
              </div>
              <div class="md:col-4 col-12">
                <AutoComplete
                  id="company-ward"
                  v-model="modelEdit.Commune"
                  dropdown
                  :disabled="!modelEdit.District"
                  :suggestions="wardOptions"
                  @complete="searchWard"
                  @focus="fillWardData"
                  placeholder="-- Phường/Xã --"
                />
              </div>
              <div class="md:col-12 flex">
                <Textarea
                  v-model="modelEdit.Address"
                  variant="filled"
                  cols="30"
                  rows="3"
                  placeholder="Địa chỉ chi tiết"
                />
              </div>
            </div>
          </div>
          <div class="md:col-4 col-12 field">
            <label for="company-founded">Năm thành lập</label>
            <InputMask v-model="modelEdit.FoundedY" mask="9999" slotChar="yyyy" />
            <!-- <InputNumber v-model="modelEdit.FoundedY" id="company-founded" placeholder="Nhập năm thành lập của công ty" :useGrouping="false"/> -->
          </div>
          <div class="md:col-4 col-12 field">
            <label for="company-brands">Số lượng chi nhánh</label>
            <InputNumber
              id="company-brands"
              v-model="modelEdit.NumOfContr"
              placeholder="Nhập số lượng chi nhánh của công ty"
            />
          </div>
          <div class="md:col-4 col-12 field">
            <label for="company-employees">Số lượng nhân sự</label>
            <InputNumber
              id="company-employees"
              v-model="modelEdit.NumOfEmpl"
              placeholder="Nhập số lượng nhân sự của công ty"
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="material-symbols-outlined">contacts</span>
            <span class="font-bold white-space-nowrap">Thông tin liên hệ</span>
          </div>
        </template>
        <DataTable :value="modelEdit.CRD5">
          <Column header="#" style="width: 2rem">
            <template #body="slotProps">
              {{ slotProps.index + 1 }}
            </template>
          </Column>
          <Column header="Tên người liên hệ">
            <template #body="slotProps">
              <InputText v-model="slotProps.data.FirstName" class="w-full" />
            </template>
          </Column>
          <Column header="Chức vụ" style="width: 15rem">
            <template #body="slotProps">
              <InputText v-model="slotProps.data.LastName" class="w-full" /> </template
          ></Column>
          <Column header="Số điện thoại 1" style="width: 12rem">
            <template #body="slotProps">
              <InputText v-model="slotProps.data.Phone" class="w-full" /> </template
          ></Column>
          <Column header="Số điện thoại 2" style="width: 12rem">
            <template #body="slotProps">
              <InputText v-model="slotProps.data.Address" class="w-full" /> </template
          ></Column>
          <Column header="Email" style="width: 17rem">
            <template #body="slotProps">
              <InputText v-model="slotProps.data.Email" class="w-full" /> </template
          ></Column>
          <Column header="" style="width: 3rem">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                text
                style="width: 24px; height: 24px"
                @click="removeContactPersion(slotProps.index, slotProps.data)"
              />
            </template>
          </Column>
          <template #footer>
            <Button
              :disabled="modelEdit.CRD5.length >= 5"
              icon="pi pi-plus-circle"
              label="Thêm người liên hệ"
              outlined
              size="small"
              @click="addContactPerson"
            />
          </template>
        </DataTable>
      </TabPanel>
    </TabView>
    <template #footer>
      <div class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="$t('Button.Cancel')"
        ></Button>
        <Button
          :loading="loadingSave"
          icon="pi pi-save"
          severity="primary"
          :label="$t('Button.Save')"
          @click="saveUpdateInfo"
        ></Button>
      </div>
    </template>
  </Dialog>
  <!-- Cập nhật ảnh đại diện -->
  <Dialog
    v-model:visible="visibleUploadAvatar"
    header="Cập nhật ảnh đại diện"
    modal
    :style="{ minWidth: '20rem' }"
  >
    <Cropper
      v-if="avatar.LocalFileLink"
      :src="avatar.LocalFileLink"
      :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
        aspectRatio: 1,
      }"
      class="cropper-image"
      :canvas="{
        minHeight: 200,
        minWidth: 200,
      }"
      :stencil-size="{
        width: 200,
        height: 200,
      }"
      :resize-image="{
        adjustStencil: false,
      }"
      image-restriction="stencil"
      @change="onChangeAvatar"
    />
    <template #footer>
      <div class="flex justify-end">
        <ImportFile
          label="Chọn ảnh"
          :multiple="false"
          accept="image/*"
          @on-select="onSelectFile"
        />
        <Button
          :loading="loadingSave"
          icon="pi pi-save"
          :label="$t('Button.Save')"
          @click="saveUploadAvatar"
        />
      </div>
    </template>
  </Dialog>
  <!-- Cập nhật ngành nghề lĩnh vực -->
  <Dialog
    v-model:visible="visiblePnFUpdate"
    header="Cập nhật ngành nghề lĩnh vực"
    modal
    :style="{ minWidth: '50rem' }"
  >
    <DataTable
      style="min-height: 25rem"
      :value="modelEdit.CRD2"
      scrollable
      scrollHeight="22rem"
    >
      <template #header>
        <div class="w-full flex justify-center">
          <TreeSelect
            emptyMessage="Không có dữ liệu"
            @change="onChangePnF"
            display="chip"
            v-model="selectedPnF"
            :options="PnF_DATA"
            label="IndName"
            selectionMode="checkbox"
            placeholder="Chọn ngành nghề, lĩnh vực"
            style="width: 100%; max-width: 46rem"
          />
        </div>
      </template>
      <template #empty>
        <div style="height: 15rem"></div>
      </template>
      <Column header="#" style="width: 3rem">
        <template #body="slotProps">
          {{ slotProps.index + 1 }}
        </template>
      </Column>
      <Column field="label" header="Tên ngành nghề, lĩnh vực"> </Column>
    </DataTable>
    <template #footer>
      <!-- <Button icon="pi pi-plus" outlined label="Log" @click="() => { console.log(modelEdit.CRD2)}" /> -->
      <Button
        icon="pi pi-times"
        outlined
        :label="$t('Button.Cancel')"
        @click="visiblePnFUpdate = false"
      />
      <Button
        :loading="loadingSave"
        icon="pi pi-save"
        :label="$t('Button.Save')"
        @click="saveUpdatePnF"
      />
    </template>
  </Dialog>
  <!-- Chỉ sửa tài liệu -->
  <Dialog
    v-model:visible="visibleUploadDocs"
    header="Chỉ sửa tài liệu"
    modal
    :style="{ minWidth: '70rem' }"
    :contentStyle="{ height: '30rem' }"
  >
    <DataTable
      scrollable
      scrollHeight="flex"
      :value="modelEdit.CRD1.filter((x) => x.Type !== 'D')"
    >
      <Column header="#" style="width: 3rem">
        <template #body="slotProps">
          {{ ++slotProps.index }}
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body>
          <Avatar icon="pi pi-file" class="mr-2" size="large" />
        </template>
      </Column>
      <Column field="PatchName" header="Tên tài liệu"> </Column>
      <Column field="PatchDesc" header="Ghi chú" style="width: 10rem">
        <template #body="slotProps">
          <InputText v-model="slotProps.data.PatchDesc" />
        </template>
      </Column>
      <Column header="" style="width: 3rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            text
            style="width: 24px; height: 24px"
            @click="removeFile(slotProps.data.ID, slotProps.index)"
          />
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <div class="flex justify-between">
        <ImportFile label="Chọn file" :multiple="true" @on-select="onSelectFiles" />
        <div>
          <Button
            icon="pi pi-times"
            outlined
            :label="$t('Button.Cancel')"
            @click="visibleUploadDocs = false"
          />
          <Button
            :loading="loadingSave"
            icon="pi pi-save"
            :label="$t('Button.Save')"
            @click="saveDocs"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <!-- Đổi mật khẩu -->
  <Dialog v-model:visible="visiblePassword" header="Đổi mật khẩu" modal>
    <div class="flex flex-column align-items-end gap-1 mb-3 mt-1">
      <small v-if="errorPassword.wrongPassword" class="p-error mr-5">{{
        errorPassword.wrongPassword
      }}</small>
      <div class="flex gap-2 align-items-center">
        <label for="currentPassword" class="font-semibold w-10rem">Mật khẩu cũ</label>
        <Password
          id="currentPassword"
          v-model="currentPassword"
          :feedback="false"
          toggleMask
          autofocus
          :class="{
            'p-invalid':
              (errorPassword.currentPassword && !currentPassword) ||
              errorPassword.wrongPassword,
          }"
        />
        <span style="width: 1rem">
          <i
            v-if="errorPassword.currentPassword && !currentPassword"
            style="color: red"
            class="pi pi-times-circle font-bold"
          ></i>
        </span>
      </div>
    </div>
    <Divider />
    <div class="flex flex-column align-items-end gap-2 mb-3">
      <div class="flex gap-2 align-items-center">
        <label for="newPassword" class="font-semibold w-10rem">Nhập mật khẩu mới</label>
        <Password
          id="newPassword"
          v-model="newPassword"
          toggleMask
          :pt="{
            info: { style: 'display: none' },
          }"
        >
          <template #footer>
            <p class="font-bold">Mật khẩu đề xuất:</p>
            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
              <li>Độ dài tối thiểu 8 ký tự.</li>
              <li>Bao gồm chữ thường và chữ in hoa.</li>
            </ul>
          </template>
        </Password>
        <span style="width: 1rem">
          <i
            v-if="!regexPw.test(newPassword)"
            style="color: red"
            class="pi pi-times-circle font-bold"
          ></i>
          <i v-else style="color: green" class="pi pi-check-circle font-bold"></i>
        </span>
      </div>
    </div>
    <div class="flex flex-column align-items-end gap-2">
      <div class="flex gap-2 align-items-center">
        <label for="confirmNewPassword" class="font-semibold w-10rem"
          >Nhập lại mật khẩu</label
        >
        <Password
          id="confirmNewPassword"
          v-model="confirmNewPassword"
          :feedback="false"
          toggleMask
        />
        <span style="width: 1rem">
          <i
            v-if="!regexPw.test(confirmNewPassword) || newPassword !== confirmNewPassword"
            style="color: red"
            class="pi pi-times-circle font-bold"
          ></i>
          <i v-else style="color: green" class="pi pi-check-circle font-bold"></i>
        </span>
      </div>
    </div>

    <template #footer>
      <Button icon="pi pi-times" outlined label="Huỷ" @click="visiblePassword = false" />
      <Button
        :loading="loadingSave"
        icon="pi pi-save"
        label="Lưu"
        @click="saveChangePassword"
      />
    </template>
  </Dialog>
  <!-- Điều khoản thanh toán -->
  <Dialog
    v-model:visible="visibleTermsOfPayment"
    header="Quản lý điều khoản thanh toán"
    modal
    style="width: 70rem"
  >
    <DataTable :value="modelEdit.CRD7.filter((x) => x.Type !== 'D')">
      <Column header="#" style="width: 3rem">
        <template #body="slotProps">
          {{ ++slotProps.index }}
        </template>
      </Column>
      <Column field="Name" header="Tên điều khoản"> </Column>
      <Column header="Ngày thanh toán dựa trên">
        <template #body="slotProps">
          {{ getPaymentDueLabel(slotProps.data.DateAdd) }}
        </template>
      </Column>
      <Column header="Bắt đầu từ">
        <template #body="slotProps">
          {{
            getStartTimeLabel(
              slotProps.data.StartTime,
              slotProps.data.Month,
              slotProps.data.Day
            )
          }}
        </template>
      </Column>
      <Column header="Số ngày chênh lệch">
        <template #body="slotProps">
          {{ `${slotProps.data.NumOfDaysDiff} ngày` }}
        </template>
      </Column>
      <Column header="">
        <template #body="slotProps">
          <div class="flex justify-between w-4rem">
            <Button
              icon="pi pi-pencil"
              text
              style="width: 24px; height: 24px"
              @click="openUpdateTermDue(slotProps.data)"
            >
            </Button>
            <Button
              icon="pi pi-trash"
              text
              style="width: 24px; height: 24px"
              @click="removeTermDue(slotProps.data)"
            >
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <div class="flex justify-between">
        <Button
          icon="pi pi-plus-circle"
          label="Thêm điều khoản"
          outlined
          @click="openAddTerms"
        />
        <div>
          <Button
            icon="pi pi-times"
            :label="$t('Button.Cancel')"
            outlined
            @click="visibleTermsOfPayment = false"
          />
          <Button
            :loading="loadingSave"
            icon="pi pi-save"
            :label="$t('Button.Save')"
            @click="saveTermDue"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <Dialog
    v-model:visible="visibleAddTermsOfPayment"
    :header="getLabelTermDue(mode)['title']"
    modal
    style="width: 60rem"
  >
    <div class="grid p-fluid">
      <div class="col-12 field">
        <label class="p-label" for="term-name"
          >Tên điều khoản thanh toán<sup class="p-important">*</sup></label
        >
        <InputText id="term-name" v-model="modelCRD7.Name" placeholder="Nhập tên">
        </InputText>
      </div>
      <div class="col-3 field">
        <label class="p-label" for="based-on"
          >Ngày thanh toán dựa trên<sup class="p-important">*</sup></label
        >
        <Dropdown
          id="based-on"
          v-model="modelCRD7.DateAdd"
          :options="paymentDueBasedOnOpitons"
          optionLabel="name"
          optionValue="value"
        >
        </Dropdown>
      </div>
      <div class="col-3 field">
        <label class="p-label" for="start-time"
          >Bắt đầu từ<sup class="p-important">*</sup></label
        >
        <Dropdown
          id="start-time"
          v-model="modelCRD7.StartTime"
          :options="startTimeOptions"
          optionLabel="name"
          optionValue="value"
        >
        </Dropdown>
      </div>
      <div class="col-3 field">
        <label class="p-label" for="month">&nbsp;</label>
        <div class="flex align-items-center">
          <span class="pr-3">+</span>
          <InputNumber
            id="month"
            class="unset-border-right"
            v-model="modelCRD7.Month"
            :min="0"
            :max="1000"
          >
          </InputNumber>
          <span class="pl-3 border-unit">tháng</span>
        </div>
      </div>
      <div class="col-3 field">
        <label class="p-label" for="day">&nbsp;</label>
        <div class="flex align-items-center">
          <span class="pr-3">+</span>
          <InputNumber
            id="day"
            class="unset-border-right"
            v-model="modelCRD7.Day"
            :min="0"
            :max="1000"
          >
          </InputNumber>
          <span class="pl-3 border-unit">ngày</span>
        </div>
      </div>
      <div class="col-4 field">
        <label class="p-label" for="diff-day"
          >Số ngày chênh lệch cho phép<sup class="p-important">*</sup></label
        >
        <div class="flex align-items-center">
          <InputNumber
            id="diff-day"
            class="unset-border-right"
            v-model="modelCRD7.NumOfDaysDiff"
            :min="0"
            :max="1000"
          >
          </InputNumber>
          <span class="pl-3 border-unit">ngày</span>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        icon="pi pi-times"
        :label="$t('Button.Cancel')"
        outlined
        @click="visibleAddTermsOfPayment = false"
      />
      <Button
        :icon="getLabelTermDue(mode)['icon']"
        :label="getLabelTermDue(mode)['primary_btn']"
        @click="addTermDue"
      />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
  <!-- Toast and Dialog -->
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import { ref, reactive, watch, onBeforeMount } from "vue";
import API from "../../apis/api";
import ImportFile from "../business/components/ImportFiles.vue";

import i18n from "../../locale/i18n";
const regexPw = ref(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
// ------------------ [ METHODS ] ----------------------------
// Xem thêm ngành nghề lĩnh vực --------------------
const expandPnF = reactive({
  isPnFExpanded: false,
  isPayDueExpanded: false,
  isDocsExpanded: false,
});

//Điều khoản thanh toán ----------------------------
const mode = ref(null);

const getLabelTermDue = (mode) => {
  if (mode === "A") {
    return {
      title: "Thêm điều khoản thanh toán",
      primary_btn: "Thêm",
      icon: "pi pi-plus",
    };
  } else {
    return {
      title: "Chỉnh sửa điều khoản thanh toán",
      primary_btn: "Sửa",
      icon: "pi pi-pencil",
    };
  }
};

const saveTermDue = async () => {
  console.log(modelEdit.CRD7);
  loadingSave.value = true;
  try {
    const res = await API.putAsync("ocrd/crd7", modelEdit.CRD7);
    loadingSave.value = false;
    console.log(res);
    if (res.status === 200) {
      visibleTermsOfPayment.value = false;
      showToast("success", "Thành công", "Cập nhật thành công");
      fetchOCRD();
    } else {
      showToast("error", "Lỗi", "Có lỗi trong quá trình cập nhật");
    }
  } catch (ex) {
    loadingSave.value = false;
    console.log(ex);
    showToast("error", "Lỗi", "Có lỗi trong quá trình cập nhật");
  }
};

const addTermDue = () => {
  if (modelCRD7.ID) {
    const i = modelEdit.CRD7.findIndex((x) => x.ID === modelCRD7.ID);
    modelEdit.CRD7[i] = modelCRD7;
    visibleAddTermsOfPayment.value = false;
  } else {
    modelEdit.CRD7.push({ ...modelCRD7, OcrdID: modelView.ID, Type: "A" });
    visibleAddTermsOfPayment.value = false;
  }
};

const removeTermDue = (data) => {
  if (data.Type === "U") {
    data.Type = "D";
  } else if (data.Type === "A") {
    const index = modelEdit.CRD7.findIndex((x) => x == data);
    modelEdit.CRD7.splice(index, 1);
  }
};

const initialCRD7 = {
  Name: null,
  DateAdd: null,
  StartTime: null,
  Month: null,
  Day: null,
  NumOfDaysDiff: null,
};
const modelCRD7 = reactive({ ...initialCRD7 });
const paymentDueBasedOnOpitons = ref([
  { name: "Ngày giao hàng", value: 1 },
  { name: "Ngày chứng từ", value: 2 },
]);

const startTimeOptions = ref([
  { name: "Đầu tháng", value: 1 },
  { name: "Giữa tháng", value: 2 },
  { name: "Cuối tháng", value: 3 },
]);

const visibleAddTermsOfPayment = ref(false);

const openUpdateTermDue = (data) => {
  mode.value = "U";
  Object.assign(modelCRD7, data);
  visibleAddTermsOfPayment.value = true;
};

const openAddTerms = () => {
  mode.value = "A";
  visibleAddTermsOfPayment.value = true;
  Object.assign(modelCRD7, initialCRD7);
  modelCRD7.DateAdd = 1;
  modelCRD7.StartTime = 1;
  modelCRD7.Month = 0;
  modelCRD7.Day = 0;
  modelCRD7.NumOfDaysDiff = 0;
};

const visibleTermsOfPayment = ref(false);
const openTermOfPayment = () => {
  modelEdit.CRD7 = [];
  Object.assign(
    modelEdit.CRD7,
    modelView.CRD7.map((x) => ({ ...x, Type: "U" }))
  );
  visibleTermsOfPayment.value = true;
};

const getPaymentDueLabel = (value) => {
  return paymentDueBasedOnOpitons.value.find((x) => x.value === value)["name"];
};

const getStartTimeLabel = (value, month, day) => {
  return `${startTimeOptions.value.find((x) => x.value === value)["name"]} + ${
    month ? month + " tháng" : ""
  } ${day} ngày`;
};

//Đổi mật khẩu -------------------------------------
const allowRetry = ref(true);
const errorPassword = reactive({
  wrongPassword: null,
  currentPassword: null,
  newPassword: null,
  confirmNewPassword: null,
});
const saveChangePassword = async () => {
  if (currentPassword.value == null || currentPassword.value.trim().length < 1) {
    errorPassword.currentPassword = true;
  } else {
    errorPassword.currentPassword = null;
  }

  if (!regexPw.value.test(newPassword.value)) {
    errorPassword.newPassword = true;
  } else {
    errorPassword.newPassword = false;
  }

  if (confirmNewPassword.value !== newPassword.value) {
    errorPassword.confirmNewPassword = true;
  } else if (!regexPw.value.test(newPassword.value)) {
    errorPassword.confirmNewPassword = true;
  } else {
    errorPassword.confirmNewPassword = false;
  }
  if (
    !errorPassword.currentPassword &&
    !errorPassword.newPassword &&
    !errorPassword.confirmNewPassword &&
    allowRetry.value
  ) {
    // Đổi mật khẩu
    try {
      loadingSave.value = true;
      const body = {
        Email: modelView.Email,
        Password: newPassword.value,
        OldPassword: currentPassword.value,
      };
      const res = await API.postAsync("user/changepassword", body);
      loadingSave.value = false;
      if (res.status === 201) {
        showToast("success", "Thông báo", "Đổi mật khẩu thành công");
        visiblePassword.value = false;
      } else {
        showToast("error", "Lỗi", `Đã có lỗi xảy ra ${res.status}`);
      }
    } catch (ex) {
      loadingSave.value = false;
      // console.log();
      if (ex.request.status === 401) {
        errorPassword.wrongPassword = "Sai mật khẩu";
        allowRetry.value = false;
      } else {
        showToast("error", "Lỗi", `Đã có lỗi xảy ra ${ex.message}`);
      }
    }
  }
};

const currentPassword = ref(null);
const newPassword = ref(null);
const confirmNewPassword = ref(null);
const visiblePassword = ref(false);
const openChangePassword = () => {
  currentPassword.value = null;
  newPassword.value = null;
  confirmNewPassword.value = null;
  errorPassword.currentPassword = null;
  errorPassword.newPassword = null;
  errorPassword.confirmNewPassword = null;
  errorPassword.wrongPassword = null;
  visiblePassword.value = true;
};

watch(currentPassword, (n, o) => {
  allowRetry.value = true;
  errorPassword.wrongPassword = null;
});

const openLink = (url) => {
  window.open(url, "_blank").focus();
};
const downloadFile = (data) => {
  if (data.Link) {
    fetch(data.Link)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = data.PatchName;
        link.click();
      })
      .catch(console.error);
  }
};

const saveDocs = async () => {
  try {
    loadingSave.value = true;
    // const dataJson = modelEdit.CRD1.map(x => ({
    //   CardID: modelView.ID,
    //   PatchDesc: x.PatchDesc,
    //   Type: x.Type
    // }));

    const dataJson = modelEdit.CRD1.map((x) => {
      if (!x.ID && x.Type === "A")
        return { CardID: modelView.ID, PatchDesc: x.PatchDesc, Type: x.Type };
      else if (x.ID && x.Type === "U")
        return { ID: x.ID, PatchDesc: x.PatchDesc, Type: x.Type };
      else if (x.ID && x.Type === "D") return { ID: x.ID, Type: x.Type };
    });
    // console.log(dataJson);

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataJson));
    modelEdit.CRD1.forEach((f) => {
      if (f.Type === "A") formData.append("files", f.File);
    });
    const res = await API.putAsync("ocrd/crd1", formData);
    if (res.status === 200) {
      visibleUploadDocs.value = false;
      loadingSave.value = false;
      showToast("success", "Thông báo", "Cập nhật thành công");
      fetchOCRD();
    } else {
      loadingSave.value = false;
      showToast("error", "Lỗi", "Cập nhật lỗi: " + res.status);
    }
  } catch (ex) {
    loadingSave.value = false;
    showToast("error", "Lỗi", "Cập nhật lỗi: " + ex.message);
    console.log(ex);
  }
};

const removeFile = (ID, index) => {
  // modelEdit.CRD1.splice(index, 1);
  if (ID) {
    const i = modelEdit.CRD1.findIndex((x) => x.ID === ID);
    // alert(`ID: ${ID}, index: ${i}`);
    if (i >= 0) modelEdit.CRD1[i].Type = "D";
  } else {
    modelEdit.CRD1.splice(index, 1);
  }
};

const onSelectFiles = (files) => {
  const docs = files.map((x) => ({
    File: x.File,
    PatchName: x.File.name,
    PatchDesc: null,
    Type: "A",
  }));
  modelEdit.CRD1.push(...docs);
};

const openUploadDocs = () => {
  modelEdit.CRD1 = [
    ...modelView.CRD1.map((x) => ({
      ID: x.ID,
      PatchName: x.PatchName,
      PatchDesc: x.PatchDesc,
      Type: "U",
    })),
  ];
  visibleUploadDocs.value = true;
};
//==================================================
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

//==================================================

const contactRemoveList = ref([]);
const removeContactPersion = (id, data) => {
  if (data.ID) {
    contactRemoveList.value.push(data);
  }
  modelEdit.CRD5.splice(id, 1);
};

const loadingSave = ref(false);
const saveUpdateInfo = async () => {
  loadingSave.value = true;
  let crd5 = modelEdit.CRD5.map((x) => {
    return { ...x, Type: x.Type || "U" };
  });
  if (contactRemoveList.value.length > 0) {
    const _list = contactRemoveList.value.map((x) => ({ ID: x.ID, Type: "D" }));
    crd5 = crd5.concat(_list);
  }

  const payload = {
    ID: modelEdit.ID,
    CardName: modelEdit.CardName,
    CardFName: modelEdit.CardFName,
    Email: modelEdit.Email,
    Phone: modelEdit.Phone,
    CardType: modelEdit.CardType,
    LicTradNum: modelEdit.LicTradNum,
    AvatarPath: modelEdit.AvatarPath,
    LinkAvatar: modelEdit.LinkAvatar,
    SubStatus: "R",
    IsActive: "Y",
    Website: modelEdit.Website,
    FoundedY: parseInt(modelEdit.FoundedY),
    Revenue: modelEdit.Revenue,
    NumOfEmpl: modelEdit.NumOfEmpl,
    NumOfContr: modelEdit.NumOfContr,
    Country: "Vietnam",
    City: modelEdit.City,
    District: modelEdit.District,
    Commune: modelEdit.Commune,
    Address: modelEdit.Address,
    CRD5: crd5,
    CRD6: {
      ID: modelView.CRD6.ID === 0 ? null : modelView.CRD6.ID,
      FirstName: modelEdit.CRD6.FirstName,
      LastName: modelEdit.CRD6.LastName,
    },
  };

  try {
    const response = await API.putAsync("ocrd/update", payload);
    loadingSave.value = false;
    visibleInfoUpdate.value = false;
    if (response.status === 200) {
      showToast("success", "Thông báo", "Cập nhật thành công");
      fetchOCRD();
    } else {
      showToast("error", "Thông báo", "Cập nhật lỗi");
      console.log(response);
    }
  } catch (ex) {
    loadingSave.value = false;
    showToast("error", "Thông báo", "Cập nhật lỗi");
    console.log(ex);
  }
};

const saveUploadAvatar = async () => {
  // console.log(URL.createObjectURL(avatar.File));

  try {
    loadingSave.value = true;
    const formData = new FormData();
    formData.append("avatar", avatar.File);
    const response = await API.postAsync("ocrd/avatar", formData);
    if (response.status === 200) {
      await fetchOCRD();
      showToast("success", "Thông báo", "Cập nhật ảnh đại diện thành công");
      loadingSave.value = false;
      visibleUploadAvatar.value = false;
    } else {
      console.log(response);
    }
  } catch (ex) {
    loadingSave.value = false;
    console.log(ex);
  }
};

const onSelectFile = (file) => {
  // console.log(file);
  avatar.LocalFileLink = file.Link;
  avatar.FileName = file.File.name;
};

const onChangeAvatar = (e) => {
  // console.log(e);
  e.canvas.toBlob((blob) => {
    avatar.File = new File([blob], avatar.FileName, { type: blob.type });
    // console.log(file);
  });
};

const addContactPerson = () => {
  if (modelEdit.CRD5.length < 5) {
    modelEdit.CRD5.push({ Type: "A" });
  } else {
    showToast("warn", "Cảnh báo", "Chỉ thêm được tối đa 5 liên hệ");
  }
};

const fetchOCRD = async () => {
  try {
    const res = await API.getAsync("ocrd/me");
    // console.log(res);
    if (res.status === 200) {
      Object.assign(modelView, res.data);
      modelView.FullAddress = [
        modelView.Address,
        modelView.Commune,
        modelView.District,
        modelView.City,
      ]
        .filter((x) => x)
        .join(", ")
        .toString();
      modelView.LegalRepresen = `${modelView.CRD6.FirstName || ""} ${
        modelView.CRD6.LastName ? "(" + modelView.CRD6.LastName + ")" : ""
      }`;
      avatar.Link = res.data.LinkAvatar;
    } else {
      showToast("error", "Lỗi", res.message);
    }
  } catch (e) {
    console.log(e);
    showToast("error", "Lỗi", e.message);
  }
};

const initialComponent = () => {
  fetchOCRD();
  API.getAsync("oond/getall")
    .then((res) => {
      OOND_DATA.value = res.data.data;
    })
    .catch((err) => {
      showToast("error", "Lỗi", err.message);
    });
};

onBeforeMount(() => {
  initialComponent();
});
// ===========================================================

// Chọn địa chỉ
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
  modelEdit.District = null;
}

function onChangeCity() {
  modelEdit.District = null;
  modelEdit.Commune = null;
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
function fillDistrictData() {
  if (modelEdit.City) {
    districtData.value = citiesData.data.find((x) => x.name === modelEdit.City)[
      "districts"
    ];
  }
}
function onSelectDistrict(event) {
  wardData.value = districtData.value.find((x) => x.name === event.value)["wards"];
}
function onChangeDistrict() {
  modelEdit.Commune = null;
}

const wardData = ref(null);
const wardOptions = ref([]);
function fillWardData() {
  districtData.value = citiesData.data.find((x) => x.name === modelEdit.City)[
    "districts"
  ];
  wardData.value = districtData.value.find((x) => x.name === modelEdit.District)["wards"];
}
function searchWard(event) {
  wardOptions.value = wardData.value
    .filter((x) =>
      x.name.trim().toLocaleLowerCase().includes(event.query.trim().toLocaleLowerCase())
    )
    .map((item) => item.name);
  // console.log(districtData.value);
  // modelEdit.Address.District = null;
}

// ------------------ [ CONFIGURATION ] ----------------------
const visibleInfoUpdate = ref(false);
const visibleUploadAvatar = ref(false);
const visiblePnFUpdate = ref(false);
const visibleUploadDocs = ref(false);

const OOND_DATA = ref([]);

const openUploadAvatar = () => {
  visibleUploadAvatar.value = true;
  loadingSave.value = false;
  avatar.LocalFileLink = null;
  avatar.FileName = null;
};

const active1 = ref();
const openUpdateProfile = (index) => {
  active1.value = index;
  Object.assign(modelEdit, modelView);
  modelEdit.CRD5 = [...modelView.CRD5];
  visibleInfoUpdate.value = true;
  contactRemoveList.value = [];
};

const saveUpdatePnF = async () => {
  // loadingSave.value = true;
  let bodyData = compareObjects(modelView.CRD2, modelEdit.CRD2);
  try {
    const res = await API.putAsync("ocrd/crd2", bodyData);
    loadingSave.value = false;
    if (res.status === 200) {
      showToast("success", "Thành công", "Cập nhật ngành nghề, lĩnh vực thành công");
      fetchOCRD();
      visiblePnFUpdate.value = false;
    } else {
      showToast("error", "Lỗi", "Có lỗi trong quá trình cập nhật");
    }
  } catch (e) {
    loadingSave.value = false;
    showToast("error", "Lỗi", "Có lỗi trong quá trình cập nhật");
    console.log(e.message);
  }
  loadingSave.value = false;
};

function compareObjects(arrA, arrB) {
  const result = [];

  // Tạo một tập hợp từ các khóa của mảng B
  const keysB = new Set(arrB.map((obj) => obj.key));

  // Duyệt qua mảng A
  for (const objA of arrA) {
    // Kiểm tra xem khóa của objA có tồn tại trong tập hợp keysB hay không
    if (!keysB.has(objA.key)) {
      // Thêm objA vào mảng kết quả với type: 'D'
      result.push({
        ID: objA.ID,
        Type: "D",
      });
    }
  }

  // Duyệt qua mảng B
  for (const objB of arrB) {
    // Kiểm tra xem objB có tồn tại trong mảng A hay không
    const foundObjA = arrA.find((objA) => objA.key === objB.key);
    if (!foundObjA) {
      // Thêm objB vào mảng kết quả với type: 'A'
      result.push({
        IndID: parseInt(objB.key),
        CardID: modelView.ID,
        Type: "A",
      });
    }
  }

  return result;
}

const PnF_DATA = ref([]);
const selectedPnF = ref({});
const openUpdatePnF = async () => {
  visiblePnFUpdate.value = true;
  PnF_DATA.value = await getFormatedPnFData();
  if (modelView.CRD2.length > 0) {
    modelEdit.CRD2 = modelView.CRD2.map((item) => ({
      id: item.ID,
      label: item.IndName,
    }));

    modelView.CRD2.forEach((element) => {
      selectedPnF.value[element.IndID.toString()] = { checked: true };
    });
  }
};

const onChangePnF = (e) => {
  const ids = [];
  for (let key of Object.keys(e)) {
    if (!e[key]["partialChecked"]) {
      ids.push(key);
    }
  }

  console.log(Object.keys(e));
  // const ids = Object.keys(e);
  const _2dArray = treeTo2DTable(PnF_DATA.value, ids);
  // console.log(_2dArray);
  modelEdit.CRD2 = _2dArray;
};

//**Duyệt cây và trả về những node trong mảng id */
function treeTo2DTable(tree, ids) {
  const table = [];
  const queue = [...tree];

  while (queue.length) {
    const node = queue.shift();
    if (ids.includes(node.key)) {
      table.push(node);
    }

    if (node.children) {
      queue.push(...node.children);
    }
  }

  return table;
}

//**Lấy dữ liệu và định dạng lại trường để hiển thị trên cây */
const getFormatedPnFData = async () => {
  let resultArray = [];
  //**Function định dạng lại trường */
  const formatObject = (array) => {
    if (array && array.length > 0) {
      return array.map((item) => {
        return {
          key: item.ID.toString(),
          label: item.IndName,
          code: item.IndCode,
          // data: item,
          children: formatObject(item.children),
        };
      });
    }
  };

  try {
    const res = await API.getAsync("oond/getall", null);
    if (res.status === 200) {
      return formatObject(res.data["data"]);
    } else {
      showToast("error", "Lỗi", res.message);
      return resultArray;
    }
  } catch (e) {
    showToast("error", "Lỗi", e.message);
    return resultArray;
  }
};

const toast = useToast();

const showToast = (severity, summary, msg) => {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
};
const copyToClipboard = (value) => {
  navigator.clipboard.writeText(value);
  toast.add({
    severity: "info",
    group: "br",
    summary: "Copied to clipboard",
    detail: value,
    life: 3000,
  });
};
// ------------------ [ MODELS ] -----------------------------
const initialState = {
  ID: null,
  CardName: null,
  CardFName: null,
  CardType: null,
  Email: null,
  Phone: null,
  LegalRepresenID: null,
  LegalRepresenName: null,
  LegalRepresenRole: null,
  LicTradNum: null,
  AvatarPath: null,
  LinkAvatar: null,
  SubStatus: null,
  Website: null,
  FoundedY: null,
  Revenue: null,
  NumOfEmpl: null,
  NumOfContr: null,
  Country: null,
  City: null,
  District: null,
  Commune: null,
  Address: null,
  CRD1: [], // Tài liệu đính kèm
  CRD2: [], // Ngành nghề lĩnh vực
  CRD3: [], // Địa chỉ
  CRD4: [], // Chứng chỉ
  CRD5: [], // Thông tin người liên hệ
  CRD6: {}, // Người chịu trách nhiệm pháp lý
  CRD7: [], // Điều khoản thanh toán
};

const modelEdit = reactive(initialState);
const modelView = reactive({
  CRD2: [],
  CRD1: [],
  CRD7: [],
});
const avatar = reactive({
  File: null,
  LocalFileLink: null,
  Link: null,
  FileName: null,
});
</script>

<style>
html {
  scroll-behavior: smooth;
}
.unset-border-right > input {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
<style scoped>
.border-unit {
  font-weight: bold;
  background: #f4f4f4;
  padding: 0.75rem 0.75rem;
  border-top: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.fixed-header {
  margin-left: 1rem;
  position: fixed;
}
.fixed-panel {
  position: fixed;
  margin-top: 3.5rem;
  width: 20rem;
  margin-left: 1rem;
}
.scroll-area {
  margin-top: 3.5rem;
  margin-left: 22rem;
  width: 100%;
}

.cropper-image {
  max-width: 30rem;
  max-height: 30rem;
}
.upload-avatar {
  position: absolute;
  right: -1rem;
  bottom: -1rem;
}

.image-company {
  width: 7rem;
  height: 7rem;
  position: relative;
}

.field {
  margin-bottom: 0;
  /* line-height: 23px; */
}

.btn-copy {
  visibility: hidden;
  /* transition: visibility 0.2s, opacity 0.5s linear; */
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
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
.mt-14px {
  margin-top: 14px;
}
</style>
