<template>
  <!-- Title header -->
  <div class="bg-surface-card">
    <div>
      <div class="flex align-items-center col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          {{ $t("procurement_requests.header").toUpperCase() }}
        </h5>
      </div>
    </div>
  </div>
  <!-- Title header -->
  <!-- Data table -->
  <div class="p-0">
    <DataTable
      resizableColumns
      columnResizeMode="fit"
      showGridlines
      v-model:selection="selectedRows"
      lazy
      size="small"
      :totalRecords="OSRE_DATA.TotalCount"
      :loading="dataLoading"
      :paginator="true"
      :rows="PAGE_SIZE"
      dataKey="ID"
      :rowHover="true"
      :rowsPerPageOptions="[5, 10, 20]"
      currentPageReportTemplate=" / {totalPages}"
      @page="onPageChange($event)"
      :value="OSRE_DATA.data"
      responsiveLayout="scroll"
      :pt="{
          loadingOverlay: {
            style: 'background: none;',
          },
        }"
    >
      <template #header>
        <div class="flex justify-between">
          <span>
            <InputText
              v-model="searchKey"
              @keyup.enter="onSearch"
              :placeholder="$t('InputText.Search')"
              style="border-top-right-radius: unset; border-bottom-right-radius: unset"
            />
            <Button
              icon="pi pi-search"
              @click="onSearch"
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
          <span v-if="!dataLoading">Không có dữ liệu để hiển thị</span>
        </div>
      </template>
      <template #loading>
        <Loading />
      </template>
      <Column selectionMode="multiple" style="max-width: 3rem"></Column>
      <Column header="Mã yêu cầu" field="OsreCode"></Column>
      <Column :header="tableHeader.name" field="OsreName"></Column>
      <Column :header="tableHeader.business_unit" field="Oors.OrsName"></Column>
      <Column :header="tableHeader.type">
        <template #body="slotProps">
          {{ getTypeLabel(slotProps.data.IsInPlanned) }}
        </template>
      </Column>
      <Column header="Ngày cần hàng">
        <template #body="slotProps">
          {{ getTimeLabel(slotProps.data.TimeNeeded, "date") }}
        </template>
      </Column>
      <Column :header="tableHeader.approval_status">
        <template #body="slotProps">
          {{ getApproveSatusLabel(slotProps.data.ApprovalStatus) }}
        </template>
      </Column>
      <Column :header="tableHeader.action">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            text
            @click="openInfoWindow(slotProps.data.ID)"
          ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- Data table -->
  <!-- Dialog and Toast -->
  <Dialog
    maximizable
    v-model:visible="visibleProcurent"
    modal
    :header="dialogLabel.header.toUpperCase()"
    :style="{ width: '90rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :pt="{
      header: { style: 'border-bottom: 1px solid #e5e7eb;' },
    }"
  >
    <div class="mt-3">
      <template v-if="dialogLabel.mode !== 'VIEW'">
        <div class="grid">
          <div class="md:col-2 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_code">{{ formLabel.code }}</label>
              <InputText
                style="background-color: var(--disabled-background);"
                id="proc_req_code"
                :value="model.code"
                :placeholder="formLabel.code_plh"
                readonly
                :class="{ 'p-invalid': errorMessage.code }"
              />
              <small class="p-error">{{ errorMessage.code }}</small>
            </div>
          </div>
          <div class="md:col-4 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_name"
                >{{ formLabel.name }}<sup class="p-important">*</sup></label
              >
              <InputText
                id="proc_req_name"
                v-model="model.name"
                :placeholder="formLabel.name_plh"
                autofocus
                :readonly="dialogLabel.mode === 'VIEW'"
                :class="{ 'p-invalid': errorMessage.name && !model.name }"
              />
              <small v-if="!model.name" class="p-error">{{ errorMessage.name }}</small>
            </div>
          </div>
          
          <div class="md:col-2 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_creater">{{
                formLabel.creater
              }}</label>
              <InputText
                id="proc_req_creater" style="background-color: var(--disabled-background);"
                :value="model.creater"
                :placeholder="formLabel.code_plh"
                readonly
              />
              <small></small>
            </div>
          </div>
          <div class="md:col-4 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_creater">{{
                formLabel.business_unit
              }}</label>
              <InputText
                :value="`${model.business.code} - ${model.business.name}`"
                readonly style="background-color: var(--disabled-background);"
              ></InputText>
            </div>
          </div>
        </div>
        <div class="grid">
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="request_type"
                >{{ formLabel.type }}<sup class="p-important">*</sup></label
              >
              <Dropdown
                id="request_type"
                v-model="model.request_type"
                :options="requestTypeOptions"
                :placeholder="formLabel.type_plh"
                optionLabel="label"
                optionValue="value"
                @change="onChangeType"
              />
              <small>{{ errorMessage.request_type }}</small>
            </div>
          </div>
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_code"
                >{{ formLabel.ref_plan }}<sup class="p-important">*</sup></label
              >
              <!-- <InputText id="proc_req_code" v-model="model.ref_plan" :placeholder="formLabel.plan_plh"/> -->
              <PurchasePlanSelect
                @after-cancel="
                  () => {
                    OSPL_DATA = [];
                  }
                "
                @after-save="openSelectProduct"
                :class="{ 'p-invalid': errorMessage.ref_plan }"
                v-model:value="model.ref_plan"
                :placeholder="formLabel.plan_plh"
                :disabled="model.request_type === 'N'"
              />
              <small class="p-error">{{ errorMessage.ref_plan }}</small>
            </div>
          </div>
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="date"
                >{{ formLabel.date }}<sup class="p-important">*</sup></label
              >
              <Calendar
                v-model="model.date"
                :minDate="minDate"
                showIcon
                dateFormat="dd/mm/yy"
                :placeholder="formLabel.date_plh"
                :class="{ 'p-invalid': errorMessage.date && !model.date }"
              />
              <small v-if="!model.date" class="p-error">{{ errorMessage.date }}</small>
            </div>
          </div>
          <div class="md:col-3 col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="proc_req_creater">{{
                formLabel.approval_status
              }}</label>
              <InputText value="Đang chờ duyệt" readonly style="background-color: var(--disabled-background);" />
              <small></small>
            </div>
          </div>
        </div>
        <div v-if="model.request_type === 'N'" class="grid">
          <div class="col-12">
            <div class="flex flex-column gap-2">
              <label class="p-label" for="prop_req_name"
                >Địa chỉ thực hiện<sup class="p-important">*</sup></label
              >
              <div class="grid">
                <span class="col-3">
                  <InputText
                    id="Address"
                    class="w-full"
                    v-model="model.SRE3.Address"
                    :disabled="model.request_type === 'Y'"
                    placeholder="Nhập địa chỉ cụ thể"
                    autofocus
                    :class="{ 'p-invalid': errorMessage.Address && !model.SRE3.Address }"
                  />
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.SRE3.City" :placeholder="dialogLabel.City_plh" autofocus /> -->
                  <AutoComplete
                    id="City"
                    dropdown
                    class="w-full"
                    v-model="model.SRE3.City"
                    :suggestions="citiOptions"
                    @change="onChangeCity"
                    @item-select="onSelectCity"
                    @complete="searchCity"
                    :placeholder="formLabel.City_plh"
                    forceSelection
                    :disabled="model.request_type === 'Y'"
                    :class="{ 'p-invalid': errorMessage.City && !model.SRE3.City }"
                  />
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.SRE3.District" :placeholder="dialogLabel.District_plh" autofocus /> -->
                  <AutoComplete
                    id="District"
                    :disabled="!model.SRE3.City || model.request_type === 'Y'"
                    dropdown
                    class="w-full"
                    v-model="model.SRE3.District"
                    :suggestions="districtOptions"
                    @change="onChangeDistrict"
                    @item-select="onSelectDistrict"
                    @focus="fillDistrictData"
                    @complete="searchDistrict"
                    :placeholder="formLabel.District_plh"
                    forceSelection
                    :class="{
                      'p-invalid': errorMessage.District && !model.SRE3.District,
                    }"
                  />
                </span>
                <span class="col-3">
                  <!-- <InputText id="prop_req_name" v-model="model.SRE3.Ward" :placeholder="dialogLabel.Ward_plh" autofocus /> -->
                  <AutoComplete
                    id="Ward"
                    :disabled="!model.SRE3.District || model.request_type === 'Y'"
                    dropdown
                    class="w-full"
                    v-model="model.SRE3.Ward"
                    :suggestions="wardOptions"
                    @complete="searchWard"
                    :placeholder="formLabel.Ward_plh"
                    @focus="fillWardData"
                    forceSelection
                    :class="{ 'p-invalid': errorMessage.Ward && !model.SRE3.Ward }"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="grid">
          <div class="col-12 md:col-7 flex flex-column gap-2 label-view">
            <span>
              <label>{{ formLabel.code }}:</label>
              {{ model.code }}
              <Skeleton
                v-if="!model.code"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.name }}:</label>
              {{ model.name }}
              <Skeleton
                v-if="!model.code"
                width="17rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.business_unit }}:</label>
              {{ model.business.name }}
              <Skeleton
                v-if="!model.business.name"
                width="15rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.date }}:</label>{{ getTimeLabel(model.date, "date") }}
              <Skeleton
                v-if="!model.date"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span v-if="model.request_type === 'N'">
              <label>{{ formLabel.address }}:</label>
              {{
                `${model.SRE3.Address}, ${model.SRE3.Ward}, ${model.SRE3.District}, ${model.SRE3.City}`
              }}
              <Skeleton
                v-if="!model.SRE3"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
          </div>
          <div class="col-12 md:col-5 flex flex-column gap-2 label-view">
            <span>
              <label>{{ formLabel.created_time }}:</label
              >{{ getTimeLabel(model.created_time) }}
              <Skeleton
                v-if="!model.created_time"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.creater }}:</label>{{ model.creater }}
              <Skeleton
                v-if="!model.creater"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.type }}:</label>{{ getTypeLabel(model.request_type) }}
              <Skeleton
                v-if="!model.request_type"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
            <span>
              <label>{{ formLabel.approval_status }}:</label
              >{{ getApproveSatusLabel(model.approval_status) }}
              <Skeleton
                v-if="!model.approval_status"
                width="10rem"
                height="1.3rem"
                class=""
              ></Skeleton>
            </span>
          </div>
        </div>
      </template>
      <div class="bottom-tabview">
        <TabView
          :pt="{
            panelContainer: { style: 'padding: 0' },
          }"
        >
          <TabPanel :header="formLabel.prdct_tab">
            <DataTable
              ref="dataExport"
              showGridlines
              resizableColumns
              size="small"
              v-model:selection="selectedProduct"
              v-model:expandedRowGroups="expandedProducts"
              columnResizeMode="expand"
              :expandableRowGroups="model.request_type === 'Y'"
              rowGroupMode="subheader"
              groupRowsBy="PlanName"
              :value="model.SRE2"
              scrollable
              scrollHeight="320px"
            >
              <!-- selectionMode="multiple" -->
              <template v-if="model.request_type === 'Y'" #groupheader="slotProps">
                <span class="pl-2 mr-6 font-bold">
                  {{ slotProps.data.PlanName }}
                </span>
                <span> Địa chỉ: </span>
                <span
                  style="margin-left: 0.5rem; font-style: italic; color: rgb(0 40 200)"
                >
                  {{ slotProps.data.Address }}
                </span>
              </template>

              <Column field="" header="#" style="min-width: 3rem; width: 3rem">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>
              <Column
                field="ItemName"
                :header="formLabel.prdct_table.name"
                style="max-width: 35rem"
              >
              </Column>
              <Column
                v-if="model.request_type"
                field="PlanName"
                :header="formLabel.prdct_table.ref_plan"
                style="min-width: 15rem; width: 15rem"
              ></Column>
              <Column
                field="Quantity"
                :header="formLabel.prdct_table.amount"
                style="width: 8rem; min-width: 8rem; text-align: right"
              >
                <template #body="slotProps">
                  <template v-if="dialogLabel.mode === 'VIEW'">
                    {{ slotProps.data.Quantity }}
                  </template>
                  <template v-else>
                    <template v-if="model.request_type === 'Y'">
                      <InputNumber
                        class="small-input"
                        size="small"
                        v-model="slotProps.data.QuantityBuy"
                        :max="slotProps.data.OpenQuantity"
                        :min="1"
                        showButtons
                        :pt="{
                          input: {
                            style: 'width: 100%; height: 32px;text-align: right;',
                          },
                          incrementButton: { style: 'width: 20px;' },
                          decrementButton: { style: 'width: 20px;' },
                        }"
                      >
                      </InputNumber>
                    </template>
                    <template v-else>
                      <InputNumber
                        class="small-input"
                        size="small"
                        v-model="slotProps.data.QuantityBuy"
                        :min="1"
                        showButtons
                        :pt="{
                          input: {
                            style: 'width: 100%; height: 32px;text-align: right;',
                          },
                          incrementButton: { style: 'width: 20px;' },
                          decrementButton: { style: 'width: 20px;' },
                        }"
                      >
                      </InputNumber>
                    </template>
                  </template>
                </template>
              </Column>
              <Column
                field="UomName"
                :header="formLabel.prdct_table.unit"
                style="width: 7rem; min-width: 7rem"
              >
                <template #body="slotProps">
                  <template v-if="dialogLabel.mode === 'VIEW'">
                    {{ slotProps.data.UomName }}
                  </template>
                  <template v-else>
                    <template v-if="model.request_type === 'Y'">
                      {{ slotProps.data.UomName }}
                    </template>
                    <template v-else>
                      <Dropdown
                        v-model="slotProps.data.BuyUnitMsr"
                        :options="slotProps.data.UGP"
                        optionLabel="UomName"
                        optionValue="ID"
                        :pt="{
                          input: {
                            style: 'height: 32px;display: flex;align-items: center;',
                          },
                          root: { class: 'w-full' },
                        }"
                      ></Dropdown>
                    </template>
                  </template>
                </template>
              </Column>
              <Column
                field="UnitPrice"
                :header="formLabel.prdct_table.expected_price"
                style="width: 10rem;text-align: right"
              >
                <template #body="slotProps">
                  <template v-if="dialogLabel.mode === 'VIEW'">
                    {{ numberToCurrency(slotProps.data.UnitPrice) }}
                  </template>
                  <template v-else>
                    <template v-if="model.request_type === 1">
                      <span class="flex justify-end">
                        {{ numberToCurrency(slotProps.data.UnitPrice) }}
                      </span>
                    </template>
                    <template v-else>
                      <InputNumber
                        class="small-input w-10rem"
                        size="small"
                        v-model="slotProps.data.UnitPrice"
                        locale="en-US"
                        :min="0"
                        :pt="{
                          input: { style: 'height: 32px;width: 90%;text-align: right;' },
                          root: { style: 'width: 90%;' },
                        }"
                      >
                      </InputNumber>
                      <span> ₫</span>
                    </template>
                  </template>
                </template>
              </Column>
              <Column
                field="ToPrice"
                :header="formLabel.prdct_table.to_price"
                style="width: 10rem; text-align: right"
              >
                <template #body="slotProps">
                  <template v-if="dialogLabel.mode === 'VIEW'">
                    {{ numberToCurrency(slotProps.data.ToPrice) }}
                  </template>
                  <template v-else>
                    {{
                      numberToCurrency(
                        (slotProps.data.ToPrice =
                          slotProps.data.QuantityBuy * slotProps.data.UnitPrice)
                      )
                    }}
                  </template>
                </template>
              </Column>
              <Column
                field="Memo"
                :header="formLabel.prdct_table.desc"
                style="width: 10rem; min-width: 10rem"
              >
                <template #body="slotProps">
                  <span v-if="dialogLabel.mode === 'VIEW'">{{
                    slotProps.data.Memo
                  }}</span>
                  <InputText
                    v-else
                    class="w-full"
                    v-model="slotProps.data.Memo"
                    :pt="{ root: { style: 'height: 32px;' } }"
                  >
                  </InputText>
                </template>
              </Column>
              <Column
                v-if="dialogLabel.mode !== 'VIEW'"
                header=""
                style="max-width: 3rem; width: 3rem"
              >
                <template #body="slotProps">
                  <Button
                    text
                    icon="pi pi-trash"
                    severity="danger"
                    style="width: 26px; height: 26px"
                    @click="removeProduct(slotProps.index)"
                  ></Button>
                </template>
              </Column>
              <template #footer>
                <div class="flex justify-between">
                  <div v-if="dialogLabel.mode !== 'VIEW'" class="pn-left">
                    <Button
                      :label="formLabel.prdct_table.select_item"
                      outlined
                      icon="pi pi-cart-plus"
                      size="small"
                      @click="openSelectProduct"
                    />
                  </div>
                  <div v-else class="pn-left">
                    <Button
                      label="Xuất file CSV"
                      outlined
                      class="ml-2"
                      severity="contrast"
                      icon="pi pi-file-export"
                      size="small"
                      @click="exportFile"
                    />
                  </div>
                  <div class="pn-right">
                    <div class="mr-5">
                      <div class="flex justify-between">
                        <span class="mr-3"> Tổng tiền: </span>
                        <span class="font-normal">
                          {{ numberToCurrency(computingPrice()) }}
                        </span>
                      </div>
                      <div class="flex justify-between">
                        <span class="mr-3"> Bằng chữ: </span>
                        <span class="font-normal">
                          {{ VND2Word(computingPrice()) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="errorMessage.SRE2" #empty>
                <div
                  style="background: rgb(231 29 29 / 10%)"
                  class="flex align-items-center justify-center"
                >
                  <span
                    class="p-error p-5 m-2 flex justify-center align-items-center w-full"
                  >
                    <span class="material-symbols-outlined mr-3">inventory_2</span>
                    {{ errorMessage.SRE2 }}
                  </span>
                </div>
              </template>
            </DataTable>
          </TabPanel>
          <TabPanel :header="formLabel.docs_tab">
            <DataTable
              size="small"
              showGridlines
              resizableColumns
              columnResizeMode="fit"
              :value="model.SRE1"
              scrollable
              scrollHeight="320px"
            >
              <template #empty>
                <div class="flex justify-content-center p-3">
                  <span>Không có dữ liệu</span>
                </div>
              </template>
              <Column header="#" style="width: 3rem">
                <template #body="slotProps">
                  {{ slotProps.index + 1 }}
                </template>
              </Column>
              <Column :header="formLabel.docs_table.doc_file" style="width: 4rem">
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
              <Column
                field="PatchName"
                style="text-overflow: ellipsis; max-width: 10rem"
                :header="formLabel.docs_table.doc_name"
              >
              </Column>
              <!-- <Column field="IsImage" header="Type" ></Column> -->
              <Column :header="formLabel.docs_table.desc" style="width: 20rem">
                <template #body="slotProps">
                  <InputText
                    v-if="dialogLabel.mode !== 'VIEW'"
                    class="w-full"
                    v-model="slotProps.data.PatchDesc"
                  ></InputText>
                  <template v-else>{{ slotProps.data.PatchDesc }}</template>
                </template>
              </Column>
              <Column style="width: 3rem">
                <template #body="slotProps">
                  <Button
                    v-if="dialogLabel.mode !== 'VIEW'"
                    class="w-full"
                    text
                    icon="pi pi-trash"
                    severity="danger"
                    style="width: 26px; height: 26px"
                    @click="removeDocs(slotProps.index)"
                  ></Button>
                  <Button
                    v-else
                    text
                    icon="pi pi-download"
                    style="width: 26px; height: 26px"
                    @click="
                      downloadFile(
                        slotProps.data.Link,
                        `${model.business_unit_name}_${slotProps.data.PatchName}`
                      )
                    "
                  ></Button>
                </template>
              </Column>
              <template v-if="dialogLabel.mode !== 'VIEW'" #footer>
                <div class="flex justify-between">
                  <div class="pn-left">
                    <ImportFiles @on-select="onSelectFiles" />
                  </div>
                </div>
              </template>
            </DataTable>
          </TabPanel>
        </TabView>
      </div>
    </div>
    <template v-if="dialogLabel.mode !== 'VIEW'" #footer>
      <div class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="formLabel.btn_secondary"
          @click="closeAddWindow"
        ></Button>
        <Button
          :loading="loadingSend"
          icon="pi pi-save"
          :label="formLabel.btn_primary"
          @click="submit"
        ></Button>
      </div>
    </template>
    <template v-else #footer>
      <div class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="formLabel.btn_close"
          @click="closeAddWindow"
        ></Button>
        <!-- <Button icon="pi pi-save" :label="formLabel.btn_primary"
                  @click="submit"></Button> -->
      </div>
    </template>
  </Dialog>
  <!-- Chọn vật tư hàng hoá -->
  <Dialog
    v-model:visible="visibleProductSelect"
    modal
    :header="productFormLabel.header"
    :style="{ width: '60rem' }"
    class="uppercase"
  >
    <!-- {{ OSPL_DATA }} expandableRowGroups v-model:expandedRowGroups="expandedRowGroups"-->
    <div style="height: 27em">
      <DataTable
        resizableColumns
        showGridlines
        columnResizeMode="fit"
        scrollable
        scrollHeight="27rem"
        v-model:expandedRows="expandedOSPL_DATA"
        :value="OSPL_DATA"
        tableStyle="min-width: 50rem"
        dataKey="ID"
        :pt="{
          rowExpansionCell: {
            style: 'background: rgb(249, 250, 251); padding: 3px;',
          },
        }"
      >
        <Column expander style="width: 1rem; padding: 0 1rem 0 1rem" />
        <Column header="#" style="width: 3rem">
          <template #body="slotProps">
            <span class="font-bold">
              {{ slotProps.index + 1 }}
            </span>
          </template>
        </Column>
        <Column header="Kế hoạch">
          <template #body="slotProps">
            <div class="flex font-bold">
              <span class="mr-5">
                {{ slotProps.data.PlanCode }}
              </span>
              <span>
                {{ slotProps.data.PlanName }}
              </span>
            </div>
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="">
            <DataTable
              showGridlines
              resizableColumns
              columnResizeMode="fit"
              dataKey="ID"
              v-model:selection="slotProps.data.RowsSelected"
              scrollable
              scrollHeight="250px"
              size="small"
              :value="slotProps.data.SPL2.filter((x) => x.OpenQuantity > 0)"
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column
                field="Oitm.ItemName"
                header="Tên hàng hoá"
                style="max-width: 20rem"
              ></Column>
              <Column header="Số lượng khả dụng" style="width: 10rem; text-align: left">
                <template #body="slotProps">
                  {{ slotProps.data.OpenQuantity }} ({{ slotProps.data.UomName }})
                </template>
              </Column>
            </DataTable>
          </div>
          <!-- <h5>Orders for {{ slotProps.data.PlanName }}</h5> -->
        </template>
      </DataTable>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <Button
          icon="pi pi-times"
          severity="secondary"
          :label="$t('Button.Cancel')"
          @click="
            () => {
              visibleProductSelect = false;
            }
          "
        ></Button>
        <Button
          icon="pi pi-check"
          :label="$t('Button.Save')"
          @click="saveProduct"
        ></Button>
      </div>
    </template>
  </Dialog>
  <!-- Chọn vật tư hàng hoá -->
  <Toast position="bottom-right" group="br" />
  <ProductSelect v-model:visible="visibleAllProduct" @confirm="onAddProduct" />
  <!-- Dialog and Toast -->
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import API from "../../apis/api";
import { ref, reactive, onBeforeMount } from "vue";
import i18n from "../../locale/i18n";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { StatusCode } from "../../service/StatusCode";
import { VND2Word } from "../../extension/Extention";
import PurchasePlanSelect from "./components/PurchasePlanSelect.vue";
import ProductSelect from "./components/ProductSelect.vue";
import ImportFiles from "./components/ImportFiles.vue";

// ------------------ [ Data ] ----------------------------
const dataLoading = ref(false);
const loadingSend = ref(false);

//** Data - Yêu cầu mua sắm */
const OSRE_DATA = ref([]);

/** Data - Kế hoạch mua sắm */
const OSPL_DATA = ref([]);

// ------------------ [ Models ] ----------------------

const initialState = {
  name: null,
  code: null,
  creater: null,
  request_type: null,
  created_time: null,
  ref_plan: [],
  business: {},
  SRE3: {
    Address: null,
    City: null,
    District: null,
    Ward: null,
  },
  date: null,
  approval_status: null,
  SRE2: [], //Products
  SRE1: [], //Docs
};
const model = reactive({ ...initialState });
// ------------------ [ Variables ] -----------------------
const minDate = new Date(); //new Date().getTime() + 24 * 60 * 60 * 1000
//** Các dòng được chọn ở bảng chính - [Yêu cầu mua sắm]*/
const selectedRows = ref([]);
//** Các sản phẩm được chọn ở bảng vật tư hàng hoá khai báo */
const selectedProduct = ref([]);

//** Data sổ ra */
const expandedOSPL_DATA = ref([]);
const expandedProducts = ref([]);

// visibles dialog
const visibleProcurent = ref(false);
const visibleProductSelect = ref(false);
const visibleAllProduct = ref(false);

// ------------------ [ Methods ] -------------------------
const initErrorMessage = {
  name: null,
  date: null,
  ref_plan: null,
  Address: null,
  City: null,
  District: null,
  Ward: null,
  SRE2: null,
};
const errorMessage = reactive({ ...initErrorMessage });
const isValidated = ref(false);
const validateForm = () => {
  const checkEmptyValid = (str) => {
    if (str && str.toString().trim()) return true;
    else return false;
  };
  const requireField = (model, prop, msg = true) => {
    if (!(model[prop] && model[prop].toString().trim())) errorMessage[prop] = msg;
    else errorMessage[prop] = null;
  };

  isValidated.value =
    checkEmptyValid(model.name) && checkEmptyValid(model.date) && model.SRE2.length > 0;
  // alert(model.request_type);
  if (model.request_type === "N") {
    isValidated.value =
      isValidated.value &&
      checkEmptyValid(model.SRE3.Address) &&
      checkEmptyValid(model.SRE3.City) &&
      checkEmptyValid(model.SRE3.District) &&
      checkEmptyValid(model.SRE3.Ward);

    requireField(model.SRE3, "Address");
    requireField(model.SRE3, "City");
    requireField(model.SRE3, "District");
    requireField(model.SRE3, "Ward");
    const rowsEmpty = model.SRE2.filter((x) => x.UnitPrice === null).length;
    if (rowsEmpty > 0) {
      isValidated.value = false;
      showToast(
        "warn",
        "Cảnh báo",
        `Có ${rowsEmpty} vật tư, hàng hoá chưa được nhập giá tiền`
      );
    }
  }
  requireField(model, "name", "Tên yêu cầu không được để trống");
  requireField(model, "date", "Ngày cần hàng không được để trống");
  if (model.SRE2.length < 1) {
    errorMessage.SRE2 = "Hãy chọn vật tư, hàng hoá !";
  }
};
// Submit
const submit = () => {
  validateForm();
  if (isValidated.value)
    switch (dialogLabel.mode) {
      case "CREATE":
        create_OSRE();
        // alert('Tạo thành công')
        break;

      default:
        break;
    }
};

// Validate data

// Tạo yêu cầu mua sắm
const create_OSRE = () => {
  resetErrorMessage();
  loadingSend.value = true;
  let SRE2 = () => {
    if (model.request_type === "Y") {
      return model.SRE2.map((x) => ({
        BaseID: x.BaseID,
        BaseLineID: x.BaseLineID,
        BaseType: x.BaseType,
        OitmID: x.OitmID,
        UgpID: x.OuomID,
        UnitPrice: x.UnitPrice,
        Quantity: x.QuantityBuy,
        Memo: x.Memo,
      }));
    } else {
      return model.SRE2.map((x) => ({
        OitmID: x.ID,
        UgpID: x.BuyUnitMsr,
        UnitPrice: x.UnitPrice,
        Quantity: x.QuantityBuy,
        Memo: x.Memo,
      }));
    }
  };
  const dataBody = {
    OsreCode: model.code.split('-')[0]+'-',
    OsreName: model.name,
    SRE3:
      model.request_type === "N"
        ? {
            City: model.SRE3.City,
            District: model.SRE3.District,
            Ward: model.SRE3.Ward,
            Address: model.SRE3.Address,
          }
        : null,
    IsInPlanned: model.request_type,
    OorsID: model.business.id,
    TimeNeeded: model.date,
    SRE1: model.SRE1.map((i) => ({ PatchDesc: i.PatchDesc })),
    SRE2: SRE2(),
  };

  console.log(JSON.stringify(dataBody));

  const formData = new FormData();
  // console.log("Số lượng files: ", model.SRE1.length);
  if (model.SRE1.length > 0) {
    for (let item of model.SRE1) {
      // console.log(item);
      formData.append("files", item.File);
    }
  }
  formData.append("data", JSON.stringify(dataBody));

  // console.warn(formData);

  API.add_new_v2(formData, "osre/create")
    .then((res) => {
      if (res.status >= 200) {
        loadingSend.value = false;
        showToast("success", i18n.global.t("severity.success"), "Thêm mới thành công"); // Translate-here
        visibleProcurent.value = false;
        fetch_OSRE(CURRENT_PAGE.value, PAGE_SIZE.value.value);
        resetForm();
      }
    })
    .catch((err) => {
      loadingSend.value = false;
      console.log(err);
      if (err.response.data.error_message.includes("UNIQUE KEY")) {
        showToast("error", i18n.global.t("severity.error"), toastMessage.unique_key);
        errorMessage.code = toastMessage.unique_key;
      } else {
        showToast(
          "error",
          i18n.global.t("severity.error") + ` ${err.response.status}`,
          toastMessage.unsuccess
        );
      }
    });
};

const onAddProduct = (p) => {
  // console.log(p);
  model.SRE2.push(
    ...p.map((x, index) => ({
      ...x,
      UnitPrice: null,
      QuantityBuy: 1,
      ToPrice: 0,
      index: model.SRE2.length + index,
    }))
  );
};

// Chọn files
const onSelectFiles = (files) => {
  model.SRE1.push(
    ...files.map((f) => ({ ...f, PatchName: f.File.name, PatchDesc: null }))
  );
};

// Mở cửa sổ thêm sản phẩm
const openSelectProduct = async () => {
  // Trường hợp chọn từ kế hoạch
  errorMessage.ref_plan = null;
  if (model.request_type === "Y") {
    if (model.ref_plan.length > 0) {
      visibleProductSelect.value = true;
      const idsPlanSelected = model.ref_plan.map((item) => item.ID);
      const idsExist = OSPL_DATA.value.map((x) => x.ID);
      if (idsExist.length > 0) {
        for (let id of idsExist) {
          if (idsPlanSelected.find((x) => x === id)) {
          } else {
            const index2Del = idsExist.findIndex((item) => item === id);
            OSPL_DATA.value.splice(index2Del, 1);
          }
        }
      }
      for (let id of idsPlanSelected) {
        // Khi mà mảng đã có dữ liệu
        if (idsExist.length > 0) {
          if (idsExist.findIndex((idx) => idx === id) >= 0) {
            // Đã có thì không push vào nữa
          } else {
            // Chưa có thì push vào
            let res = await getOSPL_ById(id);
            OSPL_DATA.value.push(res);
          }
        }
        //Mảng chưa có thì cứ push vào
        else {
          let res = await getOSPL_ById(id);
          OSPL_DATA.value.push(res);
        }
      }
    } else {
      errorMessage.ref_plan = "Hãy chọn kế hoạch mua sắm trước";
      // showToast("warn", i18n.global.t("severity.warn"),"Chưa chọn kế hoạch")
    }
  }
  // Trường hợp chọn ngoài kế hoạch
  else {
    visibleAllProduct.value = true;
  }
};

// Mở cửa sổ thêm mới
const openAddWindow = () => {
  dialogLabel.header = "Thêm mới yêu cầu mua sắm"; // Translate-here
  dialogLabel.mode = "CREATE";
  resetForm();
  // model.code = "IP-" + generaterid(12);
  model.code = "IP-[xxxxxx]";
  model.request_type = "Y";
  model.approval_status = "P";
  model.business = {
    id: JSON.parse(localStorage.getItem("user"))["OrsId"],
    name: JSON.parse(localStorage.getItem("user"))["OrsName"],
    code: JSON.parse(localStorage.getItem("user"))["OrsCode"],
  };
  model.creater = JSON.parse(localStorage.getItem("user"))["UserName"];
  visibleProcurent.value = true;
};

// Mở cửa sổ xem thông tin
const openInfoWindow = (_id) => {
  expandedProducts.value = [];
  dialogLabel.header = "Chi tiết yêu cầu mua sắm"; // Translate-here
  dialogLabel.mode = "VIEW";
  resetForm();
  visibleProcurent.value = true;
  console.log(_id);
  API.get_all(`osre/getbyid?id=${_id}`)
    .then((res) => {
      console.log(res);
      if (res.status >= 200) {
        if (res.data) {
          model.name = res.data.OsreName;
          model.code = res.data.OsreCode;
          model.creater = res.data.CreateBy1.UserName;
          model.created_time = res.data.CreatedAt;
          model.request_type = res.data.IsInPlanned;
          model.approval_status = res.data.ApprovalStatus;
          model.business = {
            id: res.data.Oors.ID,
            name: res.data.Oors.OrsName,
            code: res.data.Oors.OrsCode,
          };
          model.SRE3 = res.data.SRE3;
          model.date = new Date(res.data.TimeNeeded);
          model.approval_status = getApproveSatusLabel(res.data.ApprovalStatus);
          model.SRE2 = res.data.SRE2.map((item) => ({
            ItemName: item.Oitm.ItemName,
            PlanName: item.PlanName,
            Quantity: item.Quantity,
            UomName: item.UomName,
            UnitPrice: item.UnitPrice,
            ToPrice: item.UnitPrice * item.Quantity,
            Memo: item.Memo,
            PlanName: item.PlanName,
            Address: item.Address,
          }));
          model.SRE1 = res.data.SRE1;
        }
        // visibleProcurent.value = true;
      }
    })
    .catch((err) => {});
};
const openEditWindow = (id) => {
  dialogLabel.header = "Chỉnh sửa yêu cầu mua sắm"; // Translate-here
  dialogLabel.mode = "UPDATE";
  resetForm();
  visibleProcurent.value = true;
};

// Export file
const dataExport = ref();
const exportFile = () => {
  dataExport.value.exportCSV();
};

// Lưu vật tư hàng hoá vào danh sách vật tư hàng hoá
const saveProduct = () => {
  // console.log(OSPL_DATA.value.map(item => item.RowsSelected));
  console.log(OSPL_DATA.value);
  let dataToTable = [];
  OSPL_DATA.value
    .map((item) => ({
      SPL3: item.SPL3,
      name: item.PlanName,
      products: item.RowsSelected,
    }))
    .forEach((x) => {
      if (x.products) {
        x.products.forEach((p) => {
          //
          dataToTable.push({
            ID: p.ID,
            BaseLineID: p.ID,
            BaseID: p.OsplID,
            BaseType: 1,
            OitmID: p.OitmID,
            OuomID: p.OuomID,
            OpenQuantity: p.OpenQuantity,
            UnitPrice: p.UnitPrice,
            UomName: p.UomName,

            Memo: p.Memo,
            ItemName: p.Oitm.ItemName,
            PlanName: x.name,
            QuantityBuy: p.OpenQuantity,
            ToPrice: p.OpenQuantity * p.UnitPrice,
            Address: `${x.SPL3.Address}, ${x.SPL3.Ward}, ${x.SPL3.District}, ${x.SPL3.City}`,
          });
        });
      }
    });
  model.SRE2 = dataToTable;

  visibleProductSelect.value = false;
  // expandProductGroupRow();
};

const removeProduct = (index) => {
  model.SRE2.splice(index, 1);
};

const removeDocs = (index) => {
  model.SRE1.splice(index, 1);
};

const closeAddWindow = () => {
  visibleProcurent.value = false;
  resetForm();
};

// Sự kiện khi thay đổi trang
const onPageChange = (event) => {
  CURRENT_PAGE.value = event.page + 1;
  PAGE_SIZE.value = event.rows;
  fetch_OSRE(CURRENT_PAGE.value, PAGE_SIZE.value);
};

const resetErrorMessage = () => {
  Object.keys(errorMessage).forEach((key) => {
    errorMessage[key] = null;
  });
};

const resetForm = () => {
  Object.assign(model, initialState);
  OSPL_DATA.value = [];
  resetErrorMessage();
};

// Khởi tạo component
const initialComponent = () => {
  // Nhận query là tham số page để set page hiện tại
  CURRENT_PAGE.value = route.query.page && route.query.page > 0 ? route.query.page : 1;

  // Fetch data from API of procurement request data
  fetch_OSRE(CURRENT_PAGE.value, PAGE_SIZE.value);
};

const onChangeType = (e) => {
  errorMessage.ref_plan = null;
  model.ref_plan = [];
  if (model.request_type === 1) {
    model.code = "IP-" + model.code.split("-")[1];
  } else {
    model.code = "OP-" + model.code.split("-")[1];
  }
  model.SRE2 = [];
  OSPL_DATA.value = [];
  model.SRE3 = {
    Address: null,
    City: null,
    District: null,
    Ward: null,
  };
};

onBeforeMount(() => {
  initialComponent();
});

// =================== [API service # CRUD] ===================
// - Read OSRE data [Yêu cầu mua sắm]

const searchKey = ref('');
const onSearch = () => {

  fetch_OSRE(1, PAGE_SIZE.value);
}

const fetch_OSRE = (page, size) => {
  dataLoading.value = true;
  router.push({
    name: route.name,
    query: {
      page: page,
    },
  });
  API.get_all_v2("osre/getall", {
    data: {
      size: size,
      page: page,
      q: searchKey.value
    },
  })
    .then((res) => {
      dataLoading.value = false;
      if (res.status >= 200) {
        dataLoading.value = false;
        if (res.data) {
          OSRE_DATA.value = res.data;
        } else {
          router.push({
            name: route.name,
            query: {
              page: 1,
            },
          });
          fetch_OSRE(1);
        }
      }
    })
    .catch((error) => {
      showToast("error", i18n.global.t("severity.error"), error.message);
      dataLoading.value = false;
      console.log(error);
    });
};

// - Get OSLP by id return detail
const getOSPL_ById = async (id) => {
  try {
    const res = await API.get_all_v2("ospl/getbyid", { data: { id: id } });
    return res.data;
  } catch (e) {
    showToast("error", i18n.global.t("severity.error"), e.message);
    return null;
  }
};

// ============================================================
// ------------------ Extention-Methods -------------------
const expandProductGroupRow = () => {
  expandedProducts.value = model.SRE2.map((x) => x.PlanName);
  // console.log(expandedProducts.value)
};

const rowClass = (data) => {
  return [
    {
      //!data.UnitPrice || data.UnitPrice === 0
      "invalid-row": !data.UnitPrice || data.UnitPrice === 0,
    },
  ];
};

const toast = useToast();
const confirm = useConfirm();

const showToast = (severity, summary, msg) => {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
};

const getTypeLabel = (value) => {
  switch (value) {
    case "Y":
      return requestTypeOptions.value[0].label;
    case "N":
      return requestTypeOptions.value[1].label;
    default:
      return value;
  }
};

const getApproveSatusLabel = (value) => {
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
};

// ------------------- Chọn địa điểm ----------------------
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
  model.SRE3.District = null;
}

function onChangeCity() {
  model.SRE3.District = null;
  model.SRE3.Ward = null;
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
  districtData.value = citiesData.data.find((x) => x.name === model.SRE3.City)[
    "districts"
  ];
}
function onSelectDistrict(event) {
  wardData.value = districtData.value.find((x) => x.name === event.value)["wards"];
  console.log(wardData.value);
}
function onChangeDistrict() {
  model.SRE3.Ward = null;
}

const wardData = ref(null);
const wardOptions = ref([]);
function fillWardData(e) {
  districtData.value = citiesData.data.find((x) => x.name === model.SRE3.City)[
    "districts"
  ];
  wardData.value = districtData.value.find((x) => x.name === model.SRE3.District)[
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
  // model.SRE3.District = null;
}

const computingPrice = () => {
  let price = 0;
  try {
    price = model.SRE2.map((x) => x.ToPrice).reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);
  } catch (e) {
    console.log(e);
  }
  return price;
};

const numberToCurrency = (num) => {
  const formatter = new Intl.NumberFormat("en-EN");
  return formatter.format(num) + " ₫";
};

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

function generaterid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function getTimeLabel(date, format = "datetime") {
  let options = null;
  switch (format) {
    case "date":
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      break;
    default:
      options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      break;
  }
  if (date) {
    const _date = new Date(date);
    return new Intl.DateTimeFormat("vi-GB", options).format(_date);
  } else {
    return null;
  }
}
// ------------------ [ Configuration ] -------------------
const requestTypeOptions = ref([
  { value: "Y", label: "Trong kế hoạch" },
  { value: "N", label: "Phát sinh mới" },
]);

const PAGE_SIZE = ref(10);
const CURRENT_PAGE = ref(1);

//** Toast Messages */
const toastMessage = reactive({
  unique_key: "Mã đã tồn tại", //Translate-here
  unsuccess: "Thêm mới lỗi",
});

// Translate-here              ↙↙↙↙↙
const tableHeader = reactive({
  name: "Tên yêu cầu mua sắm",
  business_unit: "Đơn vị đề xuất",
  type: "Loại yêu cầu",
  expire: "Thời gian thực hiện",
  approval_status: "Trạng thái",
  action: "",
});

const dialogLabel = reactive({
  header: "",
  mode: "",
});

// Translate-here
const formLabel = reactive({
  name: "Tên yêu cầu",
  name_plh: "Nhập tên yêu cầu",
  code: "Mã yêu cầu",
  code_plh: "Nhập mã yêu cầu",
  creater: "Người tạo",
  type: "Loại yêu cầu",
  type_plh: "Chọn loại yêu cầu",
  ref_plan: "Chọn từ kế hoạch",
  plan_plh: "Chọn kế hoạch mua sắm",
  business_unit: "Thuộc đơn vị",
  address: "Địa điểm",
  SpecificAddress_plh: "Nhập địa chỉ",
  City_plh: "--Tỉnh/Thành phố--",
  District_plh: "--Quận/Huyện--",
  Ward_plh: "--Phường/Xã--",
  date: "Ngày cần hàng",
  date_plh: "Chọn thời gian",
  approval_status: "Trạng thái phê duyệt",
  created_time: "Ngày tạo phiếu",

  prdct_tab: "Danh sách vật tư hàng hoá",
  docs_tab: "Chứng từ đính kèm",
  prdct_table: {
    name: "Tên hàng hoá",
    ref_plan: "Thuộc kế hoạch",
    amount: "Số lượng",
    expected_price: "Đơn giá dự kiến",
    to_price: "Thành tiền",
    desc: "Ghi chú",
    unit: "Đơn vị",
    select_item: "Chọn hàng hoá",
  },
  docs_table: {
    doc_name: "Tên chứng từ",
    doc_file: "Tệp tin",
    desc: "Ghi chú",
    act: "Hành động",
  },

  btn_close: "Đóng",
  btn_secondary: "Huỷ",
  btn_primary: "Lưu",
});

const productFormLabel = reactive({
  header: "Chọn vật tư hàng hoá", // Translate-here
});
</script>

<style scoped>
.label-view span {
  display: flex;
}
.label-view span label {
  margin-right: 1rem;
  font-weight: bold;
}
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
