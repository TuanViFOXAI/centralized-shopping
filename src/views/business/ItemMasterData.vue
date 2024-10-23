BB<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">DANH MỤC VẬT TƯ HÀNG HOÁ</h5>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
  <!-- End Header -->
  <div class="grid">
    <div class="col-12">
      <div class="card p-0">
        <div class="panel-content" style="position: relative">
          <Loading v-if="load_data" />
          <DataTable
            showGridlines
            lazy
            :totalRecords="dataTable.TotalCount"
            :paginator="true"
            :rows="params.size"
            :value="dataTable.data"
            :first="(dataTable.Page - 1) * dataTable.Size"
            :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            @page="onPageChange($event)"
            v-model:selection="selected_data"
            dataKey="ID"
          >
            <template #empty>
              <div class="flex h-10rem justify-content-center align-items-center">
                Không có dữ liệu nào để hiển thị
              </div>
            </template>
            <template #header>
              <div class="grid bg--surface-card">
                <div class="flex flex-column col-6">
                  <h5 class="m-0"></h5>
                  <span class="block p-input-button">
                    <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                    <Button @click="onSearch" icon="pi pi-search"></Button>
                  </span>
                </div>
                <div class="col-6 flex fl-end">
                  <Button
                    label="Nhập excel"
                    severity="success"
                    icon="pi pi-file-import"
                    @click="onClickExcel"
                    class="text-end py-2 font-medium mr-3"
                  />
                  <Button
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    class="text-end px-3 py-2 font-medium"
                    @click="openNew()"
                  />
                  <Button
                    label="Xóa"
                    icon="pi pi-trash"
                    class="p-button-danger mx-3 text-end px-3 py-2 font-medium"
                    @click="confirmDelete(null)"
                    :disabled="!selected_data || !selected_data.length"
                  />
                </div>
              </div>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              field="ItemCode"
              header="Mã hàng hoá"
              :sortable="true"
              headerStyle="width:15%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">ItemCode</span>
                {{ slotProps.data.ItemCode }}
              </template>
            </Column>
            <Column
              field="ItemName"
              header="Tên hàng hoá"
              :sortable="true"
              headerStyle="width:17%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">ItemName</span>
                {{ slotProps.data.ItemName }}
              </template>
            </Column>
            <Column
              field="ItmsGrpName"
              header="Nhóm hàng hoá"
              :sortable="true"
              headerStyle="width:17%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">ItmsGrpName</span>
                {{ slotProps.data.ItmsGrpName }}
              </template>
            </Column>
            <Column
              field="UgpName"
              header="Nhóm đơn vị tính"
              :sortable="true"
              headerStyle="width:16.5%; min-width:10rem;"
            >
              <template #body="slotProps">
                <span class="p-column-title">UgpName</span>
                {{ slotProps.data.UgpName }}
              </template>
            </Column>
            <Column
              field="IsActive"
              header="Trạng thái"
              :sortable="true"
              headerStyle="width:16.5%; min-width:8rem;text-al"
            >
              <template #body="slotProps">
                {{ slotProps.data.IsActive == "A" ? "Hoạt Động" : "Không Hoạt Động" }}
              </template>
            </Column>
            <Column headerStyle="min-width:10rem;" header="Hành động" :sortable="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text"
                  @click="editData(slotProps.data)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="p-button-rounded p-button-text"
                  @click="confirmDelete(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <!-- Taọ hoppj thoại CRUD-->
  <Dialog
    v-model:visible="dialogCrud"
    :style="{ width: '75vw' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <TabPanel class="mb-5">
      <!-- Thêm Tổ Chức -->
      <div class="border-bottom border-solid border-1 border-inherit">
        <div class="card pb-0">
          <div class="formgrid grid">
            <div class="field col-6">
              <label>Mã vật tư hàng hóa</label>
              <span
                style="
                  color: #eb5757;
                  font-size: 16px;
                  font-family: Open Sans;
                  font-weight: 400;
                  word-wrap: break-word;
                  margin-left: 3px;
                "
                >*</span
              >
              <div class="grid mt-1">
                <div class="col-5">
                  <Dropdown
                    placeholder="Chọn tiền tố"
                    v-model="dataEdit.Series"
                    :options="dataItemCode"
                    optionLabel="name"
                    optionValue="code"
                    :disabled="dataEdit.ID"
                  ></Dropdown>
                </div>
                <div class="col-7">
                  <InputText
                    v-model="dataEdit.ItemCode"
                    :required="true"
                    autofocus
                    :disabled="dataEdit.ID"
                    aria-required="true"
                    :class="{ 'p-invalid': submitted && !dataEdit.ItemCode }"
                  />
                  <small class="p-error" v-if="submitted && !dataEdit.ItemCode"
                    >Không bỏ trống mã vật tư hàng hóa.</small
                  >
                </div>
              </div>
            </div>

            <div class="field col-6">
              <label>Tên vật tư hàng hóa</label>
              <span
                style="
                  color: #eb5757;
                  font-size: 16px;
                  font-family: Open Sans;
                  font-weight: 400;
                  word-wrap: break-word;
                  margin-left: 3px;
                "
                >*</span
              >
              <div class="grid mt-1">
                <div class="col-12">
                  <InputText
                    v-model.trim="dataEdit.ItemName"
                    :required="true"
                    autofocus
                    aria-required="true"
                    :class="{ 'p-invalid': submitted && !dataEdit.ItemName }"
                  />
                  <small class="p-error" v-if="submitted && !dataEdit.ItemName"
                    >Không bỏ trống tên vật tư hàng hóa.</small
                  >
                </div>
              </div>
            </div>

            <div class="field col-6">
              <label>Nhóm vật tư hàng hóa</label>
              <span
                style="
                  color: #eb5757;
                  font-size: 16px;
                  font-family: Open Sans;
                  font-weight: 400;
                  word-wrap: break-word;
                  margin-left: 3px;
                "
                >*</span
              >
              <TreeArraySelect
                :config="{
                  field: {
                    id: 'ID',
                    code: 'ItmsGrpCod',
                    label: 'ItmsGrpNam',
                    children: 'children',
                  },
                  ES_Root: false,
                }"
                :class="{ 'p-invalid': submitted && !dataEdit.ItmsGrpCod }"
                :selectedId="dataEdit.ItmsGrpCod"
                :data="dataGroupItem"
                @onChange="onchangeGroupItem"
              />
              <small class="p-error" v-if="submitted && !dataEdit.ItmsGrpCod"
                >Nhóm vật tư hàng hóa không được để trống.</small
              >
              <!-- <Dropdown autofocus /> -->
              <!-- <div class="field-radiobutton mt-2 mb-0">
                <Button icon="pi pi-plus" outlined style="width: 23px; height: 12px" />
                <Label>Thêm nhóm vật tư hàng hóa</Label>
              </div> -->
            </div>
            <!-- {{ dataGroupItem }} -->

            <div class="field col-6">
              <label>Tên gọi khác</label>
              <InputText v-model="dataEdit.FrgnName" autofocus />
            </div>

            <div class="field col-6">
              <label>Nhóm đơn vị tính</label>
              <span
                style="
                  color: #eb5757;
                  font-size: 16px;
                  font-family: Open Sans;
                  font-weight: 400;
                  word-wrap: break-word;
                  margin-left: 3px;
                "
                >*</span
              >
              <Dropdown
                placeholder="Chọn nhóm đơn vị tính"
                :options="dataUnit"
                optionLabel="UgpName"
                optionValue="ID"
                @change="changeGroupUnit($event)"
                v-model="dataEdit.UgpEntry"
                :disabled="dataEdit.ID"
                :class="{ 'p-invalid': submitted && !dataEdit.UgpEntry }"
              ></Dropdown>
              <small class="p-error" v-if="submitted && !dataEdit.UgpEntry"
                >Không bỏ trống nhóm đơn vị tính</small
              >
            </div>
          </div>
          <!-- Thông Tin Liên Hệ -->
          <div class="formgrid card" style="height: 400px; overflow-y: auto">
            <TabView>
              <!-- TabPanel_1 -->
              <TabPanel header="Thông tin chung">
                <div class="grid pr-0">
                  <div class="field col-6">
                    <label>Loại hàng hóa</label>
                    <Dropdown
                      placeholder="Chọn loại hàng hóa"
                      autofocus
                      :options="TypeItemCode"
                      optionLabel="name"
                      optionValue="code"
                      v-model="dataEdit.ItemType"
                    ></Dropdown>
                  </div>
                  <div class="col-12 flex">
                    <div class="field col-12 mb-0">
                      <div>
                        <div class="grid pr-0">
                          <div class="col-4 flex align-items-center">
                            <Checkbox
                              v-model="dataEdit.InvntItem"
                              trueValue="Y"
                              falseValue="N"
                              binary
                            />
                            <label for="ingredient1" class="ml-2">Hàng lưu kho</label>
                          </div>
                          <div class="col-4 flex align-items-center">
                            <Checkbox
                              v-model="dataEdit.SellItem"
                              trueValue="Y"
                              falseValue="N"
                              binary
                            />
                            <label for="ingredient2" class="ml-2">Hàng bán</label>
                          </div>
                          <div class="col-4 flex align-items-center">
                            <Checkbox
                              v-model="dataEdit.PrchseItem"
                              trueValue="Y"
                              falseValue="N"
                              binary
                            />
                            <label for="ingredient3" class="ml-2">Hàng mua</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field col-6">
                    <label>Nhà sản xuất</label>
                    <div class="formgrid">
                      <InputText
                        placeholder="Nhập tên nhà sản xuất"
                        :required="true"
                        autofocus
                        v-model="dataEdit.FirmCode"
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div class="field col-6 mb-0 pb-0">
                    <label for="name_dd">Nhà cung cấp chính</label>
                    <InputText
                      placeholder="Nhập tên nhà cấp chính"
                      :required="true"
                      autofocus
                      v-model="dataEdit.CardCode"
                      aria-required="true"
                    />
                  </div>
                </div>
              </TabPanel>
              <!-- TabPanel_2 -->
              <TabPanel header="Thông tin kế hoạch">
                <div class="grid pr-0">
                  <div class="field col-6">
                    <label>Đơn vị tính mua hàng</label>
                    <Dropdown
                      :disabled="dataEdit.ID"
                      placeholder="Chọn đơn vị tính"
                      :options="dataUnitById"
                      optionLabel="UomName"
                      optionValue="ID"
                      v-model="dataEdit.BuyUnitMsr"
                      :class="{ 'p-invalid': submitted && !dataEdit.BuyUnitMsr }"
                    ></Dropdown>
                    <small class="p-error" v-if="submitted && !dataEdit.BuyUnitMsr"
                      >Không bỏ trống đơn vị mua hàng.</small
                    >
                  </div>
                  <div class="field col-6">
                    <label>Số lượng mua tối thiểu</label>
                    <div class="formgrid">
                      <InputNumber
                        placeholder="Nhập số lượng"
                        :required="true"
                        autofocus
                        v-model="dataEdit.ReorderQty"
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div class="field col-6 mb-0 pb-0">
                    <label for="name_dd">Đơn vị tính lưu kho</label>
                    <div class="formgrid">
                      <InputText
                        :required="true"
                        autofocus
                        aria-required="true"
                        v-model="dataEdit.InvntryUomName"
                        disabled
                      />
                    </div>
                  </div>
                  <div class="field col-3">
                    <label>Tồn kho tối thiểu</label>
                    <div class="formgrid">
                      <InputNumber
                        placeholder="Nhập số lượng"
                        :required="true"
                        autofocus
                        aria-required="true"
                        v-model="dataEdit.MinLevel"
                      />
                    </div>
                  </div>
                  <div class="field col-3">
                    <label>Tồn kho tối đa</label>
                    <div class="formgrid">
                      <InputNumber
                        placeholder="Nhập số lượng"
                        :required="true"
                        autofocus
                        aria-required="true"
                        v-model="dataEdit.MaxLevel"
                      />
                    </div>
                  </div>
                  <div class="field col-6">
                    <label>Thời gian thực hiện đơn hàng</label>
                    <div class="formgrid">
                      <InputNumber
                        :required="true"
                        autofocus
                        aria-required="true"
                        v-model="dataEdit.LeadTime"
                      />
                    </div>
                  </div>
                  <div class="field col-6">
                    <label>Thời gian cho phép chênh lệch</label>
                    <div class="formgrid">
                      <InputNumber
                        :required="true"
                        autofocus
                        v-model="dataEdit.ToleranDay"
                        aria-required="true"
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel class="p-0 m-0" header="Ghi chú">
                <Textarea
                  class="w-100"
                  v-model="dataEdit.UserText"
                  inputId="textarea"
                  rows="5"
                  cols="40"
                ></Textarea>
              </TabPanel>
              <TabPanel header="Tài liệu đính kèm">
                <FileUpload
                  :multiple="true"
                  v-model="dataEdit.file"
                  :maxFileSize="1000000"
                  @select="onAdvancedUploadTest"
                  mode="basic"
                  class="mb-4"
                  :auto="true"
                  chooseLabel="Tải lên"
                >
                  <template #empty>
                    <p>Kéo và thả tệp vào đây để tải lên</p>
                  </template>
                </FileUpload>

                <DataTable
                  :value="
                    dataEdit.Patch
                      ? dataEdit.Patch.filter((val) => val.Type !== 'D')
                      : dataEdit.Patch
                  "
                  showGridlines
                >
                  <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                  <Column
                    field="PatchName"
                    header="Tên tệp tin"
                    headerStyle="width:25%; min-width:10rem;"
                  >
                    <template #body="slotProps">
                      <span class="p-column-title">PatchName</span>
                      {{ slotProps.data.PatchName }}
                    </template>
                  </Column>
                  <Column
                    field="type"
                    header="Tệp tin"
                    headerStyle="width:20%; min-width:10rem;"
                  >
                    <template #body="slotProps">
                      <span class="p-column-title">type</span>
                      <Image :src="slotProps.data.Link" alt="" width="50" preview />
                    </template>
                  </Column>
                  <Column
                    field="size"
                    header="Kích thước(KB)"
                    headerStyle="width:20%; min-width:10rem;"
                  >
                    <template #body="slotProps">
                      <span class="p-column-title">size</span>
                      {{ slotProps.data.size }}
                    </template>
                  </Column>

                  <Column
                    field="PatchDesc"
                    header="Ghi chú"
                    headerStyle="width:30%; min-width:10rem;"
                  >
                    <template #body="slotProps">
                      <InputText
                        placeholder="Ghi chú"
                        autofocus
                        aria-required="true"
                        v-model="slotProps.data.PatchDesc"
                      />
                    </template>
                  </Column>
                  <Column headerStyle="width:10%; min-width:5rem;" header="Hành động">
                    <template #body="slotProps">
                      <Button
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text"
                        @click="slotProps.data.Type = 'D'"
                    /></template>
                  </Column>
                </DataTable>
              </TabPanel>
            </TabView>
          </div>
          <!-- Trạng Thái -->
          <div class="field col-12">
            <div class="field col-6 mb-0 pb-0 pr-0">
              <div class="input-header">
                <h6>Trạng Thái</h6>
              </div>
              <div class="formgrid">
                <div>
                  <InputSwitch v-model="dataEdit.IsActive" trueValue="A" falseValue="I" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
      <Button label="Lưu" icon="pi pi-check" :loading="loadAction" @click="saveData()" />
    </template>
  </Dialog>
  <!-- End hôp thoại CRUD -->
  <Dialog
    v-model:visible="delete_dialog"
    :style="{ width: '450px' }"
    header="Xác Nhận"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="dataEdit.ItemCode"
        >Bạn chắc chắn muốn xóa <b>{{ dataEdit.ItemCode }}</b> ?</span
      >
      <span v-if="selected_data && !dataEdit.ItemCode"
        >Bạn chắc chắn muốn xóa <b>{{ selected_data.length }}</b> bản ghi này không
        ?</span
      >
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" outlined @click="hideDelete()" />
      <Button
        label="Xóa"
        icon="pi pi-check"
        :loading="loadAction"
        @click="deleteData()"
      />
    </template>
  </Dialog>
  <!-- End xoa -->
  <Dialog v-model:visible="visibleExcel" 
    :style="{ width: '90rem' }"
    modal
    header="Nhập dữ liệu từ Excel">
    
    <DataTable :value="fileView" showGridlines class="mb-3">
      <Column field="name" header="Tên file"></Column>  
      <Column field="size" header="Dung lượng"></Column>  
      <Column field="row" header="Số dòng"></Column>  
      <Column style="width: 3rem;">
        <template #body="sp">
          <Button v-if="sp.data.btn" icon="pi pi-times" text style="padding: 0; width: 24px; height: 24px;" @click="removeFile()"></Button>    
        </template>
      </Column>  
    </DataTable>
    <DataTable lazy :loading="waitLoad" :value="data" scrollable scrollHeight="30rem" showGridlines size="small">
      <Column field="index" header="#"></Column>
      <Column field="ItemCode" header="Mã"></Column>
      <Column field="ItemName" header="Tên vật tư hàng hoá"></Column>
      <Column header="Thông tin" style="width: 20rem;">
        <template #body="sp">
          <span v-if="sp.data.error.isError" class="p-error">{{ sp.data.error.message }}</span>
          <span v-if="sp.data.error.isSave" style="color: #22C55E">{{ sp.data.error.message }}</span>
        </template>  
      </Column>
      <Column header="" style="width: 3rem;">
        <template #body="sp">
          <Button :disabled="isSending" icon="pi pi-pencil" text style="padding: 0; width: 24px; height: 24px;" @click="openEditRow(sp.data, sp.index)"></Button>    
        </template>
      </Column>
      <template #empty>
          <div class="flex align-items-center justify-center h-16rem">
            <span class="material-symbols-outlined mr-3"> folder_off </span>
            Chưa có dữ liệu
          </div>
        </template>
    </DataTable>
    <template #footer>
      <div class="flex justify-between">
        <div>
          <ImportFiles
            :loading="waitLoad"
            size="normal"
            outlined
            @on-select="onSelectFile"
            icon="pi pi-file-import"
            :accept="acceptFileType"
            label="Chọn file"
            :multiple="false"
          />
          <Button label="Tải file mẫu" @click="renderExcel" icon="pi pi-download" outlined></Button>    
        </div>
          <Button :disabled="!fileView[0].row" :loading="isSending" label="Tải lên" icon="pi pi-upload" @click="sendingData()"></Button>
      </div>
    </template>
  </Dialog>
  <Dialog v-model:visible="visibleRowEdit" modal header="Chỉnh sửa" style="width: 70rem;">
    <div class="grid mt-1">
      <div class="flex flex-column gap-2 col-2">
        <label class="p-label">Mã<sup class="p-important">*</sup></label>
        <InputText class="w-full" :class="{'p-invalid' : errorMsg.ItemCode && !modelRowEdit.ItemCode}" v-model="modelRowEdit.ItemCode" ></InputText>
        <small class="p-error" v-if="errorMsg.ItemCode && !modelRowEdit.ItemCode">{{ errorMsg.ItemCode }}</small>
      </div>
      <div class="flex flex-column gap-2 col-5">
        <label class="p-label">Tên vật tư hàng hoá<sup class="p-important">*</sup></label>
        <InputText :class="{'p-invalid' : errorMsg.ItemName && !modelRowEdit.ItemName}" v-model="modelRowEdit.ItemName" ></InputText>
        <small class="p-error" v-if="errorMsg.ItemName && !modelRowEdit.ItemName">{{ errorMsg.ItemName }}</small>
      </div>
      <div class="flex flex-column gap-2 col-5">
        <label class="p-label">Tên khác</label>
        <InputText v-model="modelRowEdit.FrgnName" ></InputText>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Nhóm vật tư hàng hoá<sup class="p-important">*</sup></label>
        <Dropdown v-model="modelRowEdit.ItmsGrpCod" :options="nhomVTHH.map(x => `${x.ItmsGrpCod} - ${x.ItmsGrpNam}`)" :class="{ 'p-invalid' : errorMsg.ItmsGrpCod && !modelRowEdit.ItmsGrpCod  }" placeholder="Chọn nhóm vật tư hàng hoá" class="w-full" />
        <small class="p-error" v-if="errorMsg.ItmsGrpCod && !modelRowEdit.ItmsGrpCod">{{ errorMsg.ItmsGrpCod }}</small>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Nhóm đơn vị tính<sup class="p-important">*</sup></label>
        <Dropdown v-model="modelRowEdit.UgpEntry" :options="dataUnit" :class="{ 'p-invalid' : errorMsg.UgpEntry && !modelRowEdit.UgpEntry  }" optionValue="UgpName" optionLabel="UgpName" placeholder="Chọn nhóm đơn vị tính" class="w-full" />
        <small class="p-error" v-if="errorMsg.UgpEntry && !modelRowEdit.UgpEntry">{{ errorMsg.UgpEntry }}</small>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Nhà sản xuất</label>
        <InputText v-model="modelRowEdit.FirmCode" ></InputText>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Nhà cung cấp chính</label>
        <InputText v-model="modelRowEdit.CardCode" ></InputText>
      </div>
      <div class="flex flex-column gap-2 col-4">
        <label class="p-label">Số lượng mua tối thiểu</label>
        <InputNumber :min="0" v-model="modelRowEdit.ReorderQty" ></InputNumber>
      </div>
      <div class="flex flex-column gap-2 col-4">
        <label class="p-label">Tồn kho tối thiểu</label>
        <InputNumber :min="0" v-model="modelRowEdit.MinLevel" ></InputNumber>
      </div>
      <div class="flex flex-column gap-2 col-4">
        <label class="p-label">Tồn kho tối đa</label>
        <InputNumber :min="0" v-model="modelRowEdit.MaxLevel" ></InputNumber>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Thời gian thực hiện đơn hàng</label>
        <InputNumber :min="0" v-model="modelRowEdit.LeadTime" ></InputNumber>
      </div>
      <div class="flex flex-column gap-2 col-6">
        <label class="p-label">Thời gian cho phép chênh lệch</label>
        <InputNumber :min="0" v-model="modelRowEdit.ToleranDay" ></InputNumber>
      </div>
      
      <div class="flex flex-column gap-2 col-12">
        <label class="p-label">Ghi chú</label>
        <Textarea v-model="modelRowEdit.UserText" ></Textarea>
      </div>
      <div class="col-12">
        <div class="flex gap-5 border-1 border-300 p-3 border-round-md mt-3">
          <div class="flex align-items-center">
            <Checkbox v-model="modelRowEdit.InvntItem" inputId="ingredient1" trueValue="Y" falseValue="N" :binary="true" />
            <label for="ingredient1" class="ml-2"> Hàng lưu kho </label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="modelRowEdit.SellItem" inputId="ingredient2" trueValue="Y" falseValue="N" :binary="true"/>
            <label for="ingredient2" class="ml-2"> Hàng bán </label>
          </div>
          <div class="flex align-items-center">
            <Checkbox v-model="modelRowEdit.PrchseItem" inputId="ingredient3" trueValue="Y" falseValue="N" :binary="true"/>
            <label for="ingredient3" class="ml-2"> Hàng mua </label>
          </div>

          <div class="flex align-items-center" style="justify-items: right;">
            <InputSwitch inputId="ingredient4" v-model="modelRowEdit.IsActive" trueValue="A" falseValue="I"/>
            <label for="ingredient4" class="ml-2"> Trạng thái </label>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Sửa" icon="pi pi-wrench" @click="changeRow"></Button>
    </template>
  </Dialog>
</template>
<style scoped>
:root {
  --surface-hover: #f6f9fc;
  --boder-color: #d1d4db;
}
.card-header
h5,
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
  background-color: rgb(213.5, 232, 240);
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

.p-tabview-nav-link .p-tabview-header-action {
  background: #ffffff;
}
.font {
  font-family: var(--font-family) !important;
}
</style>
<script setup>
import { onBeforeMount, onMounted, watch, reactive, ref } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import TreeArraySelect from "./components/TreeArraySelect.vue";
import readXlsxFile from "read-excel-file";
import ImportFiles from "./components/ImportFiles.vue";
// Search for items in the database
const searchKey = ref('');
const onSearch = () => {
  params.value.page = 1;
  params.value.size = 10;
  getData();
}


// Excel service ----------------------------------------------------------------
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
const fileView = ref([{
  row:0
}]);
const isSending = ref(false);
const data = ref([]);
const validatedRowCount = ref(0);
const rowSuccess = ref(0);
const processValue = ref(0);

const modelRowEdit = ref({});
const visibleRowEdit = ref(false);

const removeFile = () => {
  fileView.value = [{
    row:0
  }];
  data.value = [];
}

const errorMsg = reactive({

})

const validateRow = (row) => {
  let isValid = (
    (row.ItemCode && row.ItemCode.length > 0) &&
    (row.ItemName && row.ItemName.length > 0) &&
    (row.ItmsGrpCod) &&
    (row.UgpEntry)
  );

  if(isValid) {
    row.error = { 
      isSave: false,
      isError: false,
      message: ""
    }
    return isValid;
  }

  if(!row.ItemCode || row.ItemCode.trim().length == 0){
    errorMsg.ItemCode = "Không được để trống mã hàng hoá";
  }
  if(!row.ItemName || row.ItemName.trim().length == 0){
    errorMsg.ItemName = "Không được để trống tên hàng hoá";
  }
  if(!row.ItmsGrpCod || !row.ItmsGrpCod.trim()){
    errorMsg.ItmsGrpCod = "Không được bỏ trống nhóm vật tư hàng hoá";
  }
  if(!row.UgpEntry || !row.UgpEntry.trim()){
    errorMsg.UgpEntry = "Không được bỏ trống nhóm đơn vị tính";
  }

  return isValid;
}

const changeRow = () => {
  // validate the row
  if(!validateRow(modelRowEdit.value)){
    return;
  }

  // change the row
  data.value[modelRowEdit.value.idx] = modelRowEdit.value;
  // close the dialog
  visibleRowEdit.value = false;
}

const openEditRow = (row, index) => {
  Object.keys(errorMsg).forEach(key => {
    errorMsg[key] = null;
  });
  visibleRowEdit.value = true;
  modelRowEdit.value = {...row};
  modelRowEdit.value.idx = index;
}

onMounted(() => {
  
})

const sendingData = async () => {
  processValue.value = 0;
  rowSuccess.value = 0;
  isSending.value = true;
  validatedRowCount.value = data.value.filter(el => !el.error.isError).length;
  console.log(validatedRowCount.value )
  if(validatedRowCount.value === 0) {
    showToast('error', 'Lỗi', 'Không có dữ liệu nào đúng định dạng');
    isSending.value = false;
    return;
  }

  data.value.forEach( async (row, i) => {
    // row validated and send data
    if(!row.error.isError){
      try{
        const formData = new FormData();
        const ItmsGrpCod = getItmsGrpCod(row.ItmsGrpCod.split(' - ')[0]);
        const UgpEntry = getUgpEntry(row.UgpEntry);
        const payload = {
          "IsActive": row.IsActive,
          "ItemCode": row.ItemCode,
          "ItemName": row.ItemName,
          "ItmsGrpCod": ItmsGrpCod,
          "FrgnName": row.FrgnName,
          "UgpEntry": UgpEntry,
          "InvntryUomName": row.InvntryUomName,
          "BuyUnitMsr": row.BuyUnitMsr,
          "ReorderQty": row.ReorderQty,
          "MinLevel": row.MinLevel,
          "MaxLevel": row.MaxLevel,
          "LeadTime": row.LeadTime,
          "ToleranDay": row.ToleranDay,
          "UserText": row.UserText,
          "InvntItem": row.InvntItem,
          "SellItem": row.SellItem,
          "PrchseItem": row.PrchseItem,
        }
        formData.append('data', JSON.stringify(payload));
        const res = await API.postAsync('oitm/create', formData);
        if(res.data.data[0].CodeErr == 2627){
          data.value[i].error.isSave = false;
          data.value[i].error.isError = true;
          data.value[i].error.message = "Mã đã tồn tại";
        }
        else if(res.data.data[0].CodeErr == 0){
          data.value[i].error.isSave = true;
          data.value[i].error.isError = false;
          data.value[i].error.message = "Tạo thành công";
        }
        else{
          data.value[i].error.isSave = false;
          data.value[i].error.isError = true;
          data.value[i].error.message = "Unhandle error";
        }
        rowSuccess.value++;
      }
      catch(err){
        data.value[i].error.isSave = false;
        data.value[i].error.isError = true;
        data.value[i].error.message = "Lỗi mạng";
      }
    }
    processValue.value = Math.round(rowSuccess.value * 100 / validatedRowCount.value)
    // console.log(processValue.value);
  });
  
}

watch(processValue,(newV, exV) => {
  console.log(newV,exV);
  if(newV === 100){
    isSending.value = false;
    showToast('success', 'Thông báo', 'Tải lên hoàn tất');
  }
})

const nhomVTHH = ref([]);

const getUgpEntry = (name) => {
  const result = dataUnit.value.find(el => el.UgpName == name);
  if(result){
    return result.ID;
  }
  else{
    return null;
  }
}

const getItmsGrpCod = (code) => {
  const result = nhomVTHH.value.find(el => el.ItmsGrpCod == code);
  if(result){
    return result.ID;
  }
  else{
    return null;
  }
}

const acceptFileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

const getRowError = (row) => {
  const error = {};
  if(!row[0] || !row[1] || !row[3] || !row[4]){
    error.isSave = false;
    error.isError = true;
    error.message = "Dữ liệu không đúng định dạng";
  }
  else{
    error.isSave = false;
    error.isError = false;
    error.message = "";
  }
  return error;
};

const waitLoad = ref(false);

const onSelectFile = async (e) => {
  waitLoad.value = true;
  if(e){
    await readXlsxFile(e.File,).then(
      async (rows) => {
        fileView.value = [{
          name: e.File.name,
          size: e.Size,
          row: rows.length - 1,
          btn: true
        }]
        data.value = rows.slice(1, rows.length).map((row, i) => {
          if(row){
            return {
              index: ++i,
              IsActive: 'A',
              ItemCode: row[0],
              ItemName: row[1],
              FrgnName: row[2], // Tên khác
              ItmsGrpCod: row[3],  // Nhóm vật tư hàng hoá
              UgpEntry: row[4], // Nhóm đơn vị tính
              Series: null,
              FirmCode: row[5], // Nhà sản xuất
              CardCode: row[6], // Nhà cung cấp
              InvntryUomName: null,
              ReorderQty: row[7], // Số lượng mua tối thiểu
              MinLevel: row[8], // Tồn kho tối thiểu
              MaxLevel: row[9], // Tồn kho tối đa
              LeadTime: row[10],  // Thời gian thực hiên đơn hàng
              ToleranDay: row[11],  // Thời gian cho phép chênh lệch
              UserText: row[12],  // Ghi chú
              error: getRowError(row),
              "InvntItem": "N",
              "SellItem": "N",
              "PrchseItem": "N",
            }
          }
        });
      }
      
    ).catch(error => {
      waitLoad.value = false;
      fileView.value = [{}];
      showToast('error','Lỗi','Định dạng file sai');
    })
  }
  waitLoad.value = false;
};

const generateExcel = async (header) => {
  //Create workbook and worksheet
  const nhomVatTuHangHoa = convertTreeToArray(dataGroupItem.value).map(el => `${el.ItmsGrpCod} - ${el.ItmsGrpNam}`);
  
  // console.log(nhomVatTuHangHoa);
  let workbook = new Workbook();
  let worksheet1 = workbook.addWorksheet('Danh sách vật tư hàng hoá');
  let worksheet2 = workbook.addWorksheet('Drop list');

  nhomVatTuHangHoa.forEach(el => {
    worksheet2.addRow([el]);
  });
  dataUnit.value.map(el => el.UgpName).forEach((el, i) => {
    worksheet2.getCell('B'+(i+1)).value = el;
  });
  //Add Header Row
  let headerRow = worksheet1.addRow(header);
  worksheet2.state = 'hidden';
  await worksheet2.protect('vituan', {
    selectLockedCells: false,
    selectUnlockedCells: true
  });

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'C5D9F1D9' },
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  });

  headerRow.getCell(1).fill = { 
    type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC1C1' },
  }

  headerRow.getCell(2).fill = { 
    type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC1C1' },
  }

  headerRow.getCell(4).fill = { 
    type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC1C1' },
  }

  headerRow.getCell(5).fill = { 
    type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFC1C1' },
  }

  header.forEach((el, i) => {
    worksheet1.getColumn(i+1).width = el.length + 10;
  });

  // worksheet.getColumn(3).width = 30;
  // console.log(dataUnit.value);

  // Nhóm 
  worksheet1.dataValidations.add('E2:E9999', {
    type: 'list',
    allowBlank: false,
    formulae: [`='Drop list'!$B$1:$B$${dataUnit.value.length}`],
    showErrorMessage: true,
    errorStyle: 'error',
    error: 'Đơn vị tính sai định dạng',
  });

  worksheet1.dataValidations.add('D2:D9999', {
    type: 'list',
    allowBlank: false,
    formulae: [`='Drop list'!$A$1:$A$${nhomVatTuHangHoa.length}`],
    showErrorMessage: true,
    errorStyle: 'error',
    error: 'Nhóm vật tư hàng hoá sai định dạng',
  });

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, 'Mẫu dữ liệu vật tư hàng hoá.xlsx');
  })

};

const convertTreeToArray = tree => {
  const result = [];
  if (tree) {
    for (let node of tree) {
      result.push(node);
      result.push(...convertTreeToArray(node.children));
    }
  }
  return result;
};


const header = [
  'Mã hàng hoá',
  'Tên hàng hoá',
  'Tên khác (tuỳ chọn)',
  'Nhóm vật tư hàng hoá',
  'Nhóm đơn vị tính',
  'Nhà sản xuất (tuỳ chọn)',
  'Nhà cung cấp chính (tuỳ chọn)',
  'Số lượng mua tối thiểu (tuỳ chọn)',
  'Tồn kho tối thiểu (tuỳ chọn)',
  'Tồn kho tối đa (tuỳ chọn)',
  'Thời gian thực hiện đơn hàng (tuỳ chọn)',
  'Thời gian cho phép chênh lệch (tuỳ chọn)',
  'Ghi chú (tuỳ chọn)',
]

const renderExcel = () => {
  generateExcel(header);
}

const onClickExcel = () => {
  nhomVTHH.value = convertTreeToArray(dataGroupItem.value);
  data.value = [];
  fileView.value = [{}];
  visibleExcel.value = true;
  processValue.value = 0;
}

const visibleExcel = ref(false);

function showToast(severity, summary, msg) {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
}
//----------------------------------------------------------------
// Api ---------------------------
const api_add = "oitm/create";
const api_update = "oitm/update";
const api_get = "oitm/getall";
const api_delete = "oitm/delete";
// ---------------------------------

// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const dataTable = ref({});
// -----------------------------End phân trang--------------------------------
//-------------------- Start CRUD ------------------
const header_update = ref("SỬA DANH MỤC HÀNG HOÁ");
const header_new = ref("THÊM MỚI DANH MỤC HÀNG HOÁ");
const dialogCrud = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);
const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const dataItemCode = ref([
  {
    name: "Thủ công",
    code: "1",
  },
]);
const TypeItemCode = ref([
  {
    code: "1",
    name: "Hàng hoá",
  },
  {
    code: "2",
    name: "Dịch vụ",
  },
  {
    code: "3",
    name: "Khác",
  },
]);
const dataGroupItem = ref([]);
const dataUnit = ref([]);
const dataUnitById = ref([]);
const formData = new FormData();

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 10,
  };
  getData();
  getGroudItem();
  getUnit();
});
// lấy danh sách nhóm hàng hoá
const getGroudItem = () => {
  API.get_all("oibt/getall?page=0&size=0").then(
    (response) => {
      if (response.data) {
        dataGroupItem.value = response.data.data;
      }
    },
    (error) => {}
  );
};
const onchangeGroupItem = (event) => {
  dataEdit.value.ItmsGrpCod = event.value.ID;
};
// Lấy danh sách đơn  vị tính
const getUnit = () => {
  API.get_all("ougp/getall?page=0&size=0").then(
    (response) => {
      if (response.data.data) {
        dataUnit.value = response.data.data.filter((val) => {
          return (val.IsActive = "A");
        });
      }
    },
    (error) => {}
  );
};

const changeGroupUnit = (event) => {
  getByIDougp(event.value);
};

const getByIDougp = (id) => {
  API.get_all("ougp/getbyid?id=" + id).then(
    (response) => {
      if (response.data.data) {
        dataUnitById.value = response.data.data;
        dataEdit.value.InvntryUomName = response.data.BaseUomName;
      }
    },
    (error) => {}
  );
};
// Upload file
const onAdvancedUploadTest = async (event) => {
  if (dataEdit.value.Patch != undefined) {
    const ArrNewFile = [];
    for (let index = 0; index < event.files.length; index++) {
      ArrNewFile.push({
        Link: event.files[index].objectURL,
        PatchName: event.files[index].name,
        File: event.files[index],
        Type: "A",
      });
      dataEdit.value.Patch.push(ArrNewFile[index]);
    }
  } else {
    const ArrNewFile = [];
    for (let index = 0; index < event.files.length; index++) {
      ArrNewFile.push({
        Link: event.files[index].objectURL,
        PatchName: event.files[index].name,
        File: event.files[index],
        Type: "A",
      });
    }
    dataEdit.value.Patch = ArrNewFile;
  }
};


// Lấy danh sách ----------------------------------------------------
const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  setTimeout(() => {
    API.get_all_v2(`${api_get}?q=${searchKey.value}`, {
      data: params.value,
    })
      .then((response) => {
        dataTable.value = response.data;
        load_data.value = false;
        router.push({
          name: route.name,
          query: {
            page: response.data.Page,
          },
        });
      })
      .catch((error) => {
        load_data.value = false;
        notification("error", error);
      });
  }, 50);
};

const getDataWhenAction = (t) => {
  params.value = {
    page: t ? t : parseInt(route.query.page) || 1,
    size: dataTable.value.Size,
  };
  resetData();
  getData();
};

// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};
// Lấy danh sách ----------------------------------------------------

const openNew = () => {
  titleDialog.value = header_new.value;
  dialogCrud.value = true;
  resetFormData();
  dataEdit.value.IsActive = "A";
};

const hideDialog = () => {
  dialogCrud.value = false;
  dataEdit.value = {};
};

const saveData = () => {
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    const apiEndpoint = dataEdit.value.ID ? api_update : api_add;
    const apiFunction = dataEdit.value.ID ? API.update_v2 : API.add_new_v2;

    apiFunction(convertData(), apiEndpoint)
      .then((response) => {
        const codeErr = response.data.data[0].CodeErr;
        if (codeErr) {
          notification("error", ERROR.find((val) => val.code === codeErr)?.mes);
          loadAction.value = false;
        } else {
          notification(
            "success",
            dataEdit.value.ID ? "Cập nhật thành công" : "Thêm mới thành công"
          );
          getDataWhenAction();
        }
      })
      .catch((error) => {
        notification("error", error);
        resetData();
      });
  }
};

const resetFormData = () => {
  Object.keys(dataEdit.value).forEach((key) => {
    dataEdit.value[key] = null;
  });
};

const resetData = () => {
  loadAction.value = false;
  dataEdit.value = {};
  dialogCrud.value = false;
  submitted.value = false;
  delete_dialog.value = false;
  formData.delete("data");
  formData.delete("files");
};

const editData = (data) => {
  console.log(data)
  dialogCrud.value = true;
  titleDialog.value = header_update.value;
  dataEdit.value = { ...data };
  getByIDougp(dataEdit.value.UgpEntry);
  for (let index = 0; index < dataEdit.value.Patch.length; index++) {
    dataEdit.value.Patch[index].Type = "U";
  }
};

const deleteData = () => {
  loadAction.value = true;
  const arr_delete = selected_data.value
    ? selected_data.value.map((item) => ({ ID: item.ID }))
    : [{ ID: dataEdit.value.ID }];

  const data_send = { data: arr_delete };

  API.delete_v2(data_send, api_delete)
    .then((response) => {
      for (let index = 0; index < response.data.data.length; index++) {
        if (response.data.data[index].CodeErr) {
          notification(
            "error",
            ERROR.find((val) => val.code === response.data.data[index].CodeErr)?.mes
          );
          console.log(
            ERROR.find((val) => val.code === response.data.data[index].CodeErr)?.mes
          );
        } else {
          notification("success", "Đã xoá thành công");
          if (
            dataTable.value.data.length - 1 == 0 ||
            arr_delete.length == dataTable.value.data.length
          )
            params.value.page = parseInt(route.query.page) - 1;
          getDataWhenAction(params.value.page);
          loadAction.value = false;
        }
      }
    })
    .catch((error) => {
      notification("error", error);
    })
    .finally(() => {
      loadAction.value = false;
    });
};

const getError = () => {
  if (
    !dataEdit.value.ItemCode ||
    !dataEdit.value.ItemName ||
    !dataEdit.value.ItmsGrpCod ||
    !dataEdit.value.UgpEntry ||
    !dataEdit.value.BuyUnitMsr
  ) {
    return true;
  }
  return false;
};

const convertData = () => {
  if (formData.has("data")) {
    formData.delete("data");
  }
  formData.append("data", JSON.stringify(dataEdit.value));
  if (typeof dataEdit.value.Patch !== "undefined") {
    for (let index = 0; index < dataEdit.value.Patch.length; index++) {
      if (dataEdit.value.Patch[index].File != undefined)
        formData.append("files", dataEdit.value.Patch[index].File);
      console.log(dataEdit.value.Patch[index].File);
    }
  }

  return formData;
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

const confirmDelete = (data) => {
  dataEdit.value = { ...data };
  delete_dialog.value = true;
};

const hideDelete = () => {
  delete_dialog.value = false;
  dataEdit.value = {};
};
</script>
