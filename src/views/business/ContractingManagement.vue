<template>
  <div ref="CMA">
    <div class="view" v-if="!dataEdit.Action">
      <div>
        <div class="flex">
          <div class="flex align-items-center mt-0 col-6">
            <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">QUẢN LÝ GÓI THẦU</h5>
          </div>
        </div>
        <div></div>
      </div>
      <div class="grid">
        <div class="col-12">
          <div class="card p-0" style="position: relative">
            <Loading v-if="!dataTable.data" />
            <DataTable
              showGridlines
              lazy
              :totalRecords="dataTable.TotalCount"
              :paginator="true"
              :rows="params.size"
              :value="dataTable.data"
              :first="(dataTable.Page - 1) * dataTable.Size"
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
                      <Button @click="onSearch" icon="pi pi-search" />
                    </span>
                  </div>
                  <div class="col-6 flex fl-end" style="justify-content: flex-end">
                    <Button
                      label="Tạo gói thầu"
                      icon="pi pi-plus"
                      class="text-end px-3 py-2 font-medium"
                      @click="openNew()"
                    />
                  </div>
                </div>
              </template>
              <Column field="CmaCode" header="Mã gói thầu" headerStyle="width:8rem">
                <template #body="{ data }">
                  {{ data.CmaCode }}
                </template>
              </Column>
              <Column field="CmaName" header="Tên gói thầu">
                <template #body="{ data }">
                  {{ data.CmaName }}
                </template>
              </Column>
              <Column field="CmaType" header="Hình thức" headerStyle="width:12rem">
                <template #body="{ data }">
                  {{
                    data.CmaType == "C" ? "Chào giá cạnh tranh" : "Chỉ định nhà cung cấp"
                  }}
                </template>
              </Column>
              <Column field="CreatedAt" header="Ngày tạo" headerStyle="width:6rem"
                ><template #body="{ data }">{{
                  format(data.CreatedAt, "dd/MM/yyyy")
                }}</template></Column
              >
              <Column
                field="EndTime"
                header="Thời gian đóng thầu"
                headerStyle="width:7rem"
                ><template #body="{ data }">{{
                  data.EndTime ? format(data.EndTime, "dd/MM/yyyy") : null
                }}</template>
              </Column>
              <Column
                header="Hồ sơ"
                field="NumSupBidding"
                style="text-align: right"
                headerStyle="width:5rem"
              ></Column>
              <Column field="IsActive" header="Trạng thái" headerStyle="width:8rem">
                <template #body="{ data }">
                  {{ getStatusLabel(data.Status) }}
                </template></Column
              >
              <Column headerStyle="width:7rem">
                <template #body="{ data }">
                  <router-link :to="'contracting-management/detail-cma/' + data.ID"
                    ><Button icon="pi pi-eye" class="mr-2" style="padding: 1rem; width: 24px; height: 24px;" text
                  /></router-link>
                  <Button
                    :loading="load_data"
                    icon="pi pi-pencil"
                    @click="editData(data)"
                    style="padding: 1rem; width: 24px; height: 24px;" text
                    :disabled="data.Status == 'P' || data.Status == 'F' ? false : true"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
    <div class="create" v-if="dataEdit.Action">
      <div>
        <div class="flex">
          <div class="flex align-items-center mt-0 col-6">
            <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">TẠO GÓI THẦU</h5>
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="col-12 p-5">
          <div class="card p-0">
            <div class="p-3">
              <div class="container p-2">
                <div class="title mt-2">
                  <div class="grid">
                    <div class="col-7">
                      <div class="grid justify-content-center">
                        <div class="col-3">
                          <p><strong>Tên gói thầu:</strong></p>
                          <p><strong>Mã gói thầu:</strong></p>
                          <p><strong>Mã tổng hợp:</strong></p>
                          <p><strong>Tên tổng hợp:</strong></p>
                          <!-- <p><strong>Thời gian nhận hàng:</strong></p> -->
                          <!-- <p><strong>Địa điểm thực hiện:</strong></p> -->
                        </div>
                        <div class="col-9">
                          <p>{{ dataEdit.CmaName ? dataEdit.CmaName : "-" }}</p>
                          <p>{{ dataEdit.CmaCode ? dataEdit.CmaCode : "-" }}</p>
                          <p>{{ dataEdit.OAPR ? dataEdit.OAPR.OaprCode : "-" }}</p>
                          <p>{{ dataEdit.OAPR ? dataEdit.OAPR.OaprName : "-" }}</p>

                          <!-- <p>
                            {{
                              dataEdit.OAPR
                                ? format(dataEdit.OAPR.StartTime, "dd/MM/yyyy")
                                : "-"
                            }}
                          </p> -->
                          <!-- <p>-</p> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card p-0" v-if="!dataEdit.StepTwo">
            <div class="container">
              <div class="title">
                <h6 class="text-black m-2 p-2 mb-0 mt-0 font-semibold mt-3">
                  Lựa chọn hình thức đấu thầu
                </h6>
                <hr />
                <div class="grid p-5">
                  <div class="col-4">
                    <label>Hình thức đấu thầu</label>
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
                  </div>
                  <div class="col-4">
                    <div class="field-checkbox mb-0">
                      <RadioButton v-model="dataEdit.CmaType" value="C" />
                      <label> Chào giá cạnh tranh</label>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="field-checkbox mb-0">
                      <RadioButton v-model="dataEdit.CmaType" value="S" />
                      <label> Chỉ định nhà cung cấp</label>
                    </div>
                  </div>
                </div>

                <div class="grid p-5">
                  <div class="col-6">
                    <div class="mb-3">
                      <div class="w-full">
                        <div class="mb-3">
                          <!-- {{ dataEdit.DataGroupItem }} -->
                          <label class="font-bold">Chọn nhóm hàng hoá</label>
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
                        </div>

                        <MultiSelect
                          :options="dataEdit.DataGroupItem"
                          optionLabel="NameGroup"
                          display="chip"
                          class="w-full"
                          v-model="dataEdit.CMA7New"
                        />
                      </div>
                      <!-- <Button label="test" /> -->
                    </div>

                    <div class="mb-3">
                      <div class="w-full">
                        <div class="mb-3">
                          <label class="font-bold">Chọn ngành nghề lĩnh vực</label>
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
                        </div>
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
                    </div>
                    <div class="mt-5">
                      <div class="w-full">
                        <div class="mb-2">
                          <label class="font-bold">Tiêu chí đánh giá chấm điểm</label>
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
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.ImpProgress"
                            trueValue="Y"
                            falseValue="N"
                            binary
                            disabled
                          />
                          <label for="ingredient3" class="ml-2">Tiến độ thực hiện</label>
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.SumQuotes"
                            trueValue="Y"
                            falseValue="N"
                            binary
                            disabled
                          />
                          <label for="ingredient3" class="ml-2">Tổng hợp báo giá</label>
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.TermsOfPay"
                            trueValue="Y"
                            falseValue="N"
                            binary
                            disabled
                          />
                          <label for="ingredient3" class="ml-2"
                            >Điều khoản thanh toán</label
                          >
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.Origin"
                            trueValue="Y"
                            falseValue="N"
                            binary
                          />
                          <label for="ingredient3" class="ml-2">Xuất xứ</label>
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.WartyPolicy"
                            trueValue="Y"
                            falseValue="N"
                            binary
                          />
                          <label for="ingredient3" class="ml-2"
                            >Chính sách bảo hành</label
                          >
                        </div>
                        <div class="col-12 flex align-items-center">
                          <Checkbox
                            v-model="dataEdit.Other"
                            trueValue="Y"
                            falseValue="N"
                            binary
                          />
                          <label for="ingredient3" class="ml-2"
                            >Tài liệu khác (VD: Báo cáo tài chính, Hồ sơ nhân lực)</label
                          >
                        </div>
                        <div class="col-12" v-if="dataEdit.CMA5 && dataEdit.Other == 'Y'">
                          <ul
                            class="m-0 list-none p-2 card"
                            style="max-height: 150px; overflow: auto"
                            v-if="dataEdit.CMA5.length > 0"
                          >
                            <li
                              v-for="(item, i) in dataEdit.CMA5.filter((val) => {
                                return val.Type != 'D';
                              })"
                              :key="i"
                              class="p-2 mb-2 w-max border-round border-primary border-1"
                            >
                              {{ subString(item.Name) }}
                              <i
                                class="pi pi-times ml-2 cursor-pointer"
                                @click="item.Type = 'D'"
                              ></i>
                            </li>
                          </ul>
                        </div>
                        <div class="col-12" v-if="dataEdit.Other == 'Y'">
                          <InputText
                            class="w-full"
                            placeholder="VD: Báo cáo tài chính, Hồ sơ nhân lực,.."
                            v-model="dataEdit.textOther"
                            @keyup.enter="add_orther"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid p-1 mt-3 p-4">
              <div class="col-6">
                <Button
                  label="Quay lại"
                  severity="secondary"
                  @click="resetData()"
                  outlined
                />
              </div>
              <div class="col-6 text-right">
                <Button
                  label="Tiếp tục"
                  severity="info"
                  class="ml-2"
                  :loading="load_data"
                  @click="StepTWO"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 p-5" v-if="dataEdit.StepTwo">
          <div class="card">
            <!-- {{ dataEdit.DataGroup }} -->
            <TabView v-model:activeIndex="active">
              <TabPanel header="Danh mục hàng hoá">
                <div>
                  <DataTable
                    showGridlines
                    v-model:expandedRows="expandedRows"
                    :value="dataEdit.DataGroup"
                    responsiveLayout="scroll"
                    rows="10"
                    @rowExpand="onRowExpand"
                    @rowCollapse="onRowCollapse"
                    stripedRows
                    size="small"
                  >
                    <Column expander style="width: 1rem" />
                    <Column header="Tên hàng hoá" field="NameGroup" style="width: 30rem">
                    </Column>
                    <Column
                      header="Đơn vị tính"
                      field="UomName"
                      style="text-align: right; width: 150px"
                    >
                    </Column>
                    <Column header="Số lượng" style="text-align: right; width: 150px">
                      <template #body="slotProps">
                        {{ NumberFormat(slotProps.data.Quantity) }}
                      </template>
                    </Column>
                    <Column header="Thành tiền" style="text-align: right">
                      <template #body="slotProps">
                        {{ NumberFormat(slotProps.data.UnitPriceTotal) }} VNĐ
                      </template>
                    </Column>

                    <template #expansion="slotProps">
                      <DataTable
                        showGridlines
                        :value="slotProps.data.chilldren"
                        size="small"
                        rows="10"
                      >
                        <Column
                          header="Tên hàng hoá"
                          field="Oitm.ItemName"
                          headerStyle="min-width: 30rem"
                        >
                        </Column>
                        <Column
                          header="Đơn vị tính"
                          field="UomName"
                          style="text-align: right"
                          headerStyle="min-width:10rem"
                        >
                        </Column>
                        <Column
                          header="Số lượng"
                          field="Quantity"
                          style="text-align: right"
                          headerStyle="min-width:10rem"
                        >
                          <template #body="slotProps">
                            {{ NumberFormat(slotProps.data.Quantity) }}
                          </template>
                        </Column>
                        <Column
                          header="Thành tiền"
                          style="text-align"
                          headerStyle="min-width:10rem"
                        >
                          <template #body="slotProps">
                            {{
                              NumberFormat(
                                slotProps.data.UnitPrice * slotProps.data.Quantity
                              )
                            }}
                            VNĐ
                          </template>
                        </Column>
                        <Column header="Ghi chú" field="Memo" style="min-width: 20rem">
                        </Column>
                        <Column header="Tệp đính kèm" headerStyle="min-width:10rem">
                        </Column>
                        <Column
                          header="Xuất xứ"
                          :hidden="dataEdit.Origin == 'Y' ? false : true"
                          headerStyle="width:15%"
                        >
                          <template #body="slotProps">
                            <Dropdown
                              style="width: 13rem"
                              :options="dataEdit.dataOrigin"
                              optionLabel="CwName"
                              optionValue="ID"
                              v-model="slotProps.data.OriginID"
                            />
                          </template>
                        </Column>
                        <Column
                          header="Chính sách bảo hành"
                          :hidden="dataEdit.WartyPolicy == 'Y' ? false : true"
                          headerStyle="width:15%"
                        >
                          <template #body="slotProps">
                            <Dropdown
                              style="width: 13rem"
                              :options="dataEdit.dataWartyPolicy"
                              optionLabel="CwName"
                              optionValue="ID"
                              v-model="slotProps.data.WartyPolicyID"
                            />
                          </template>
                        </Column>
                        <Column
                          header="Địa chỉ giao hàng"
                          field="Address"
                          headerStyle="min-width:20rem"
                        >
                        </Column>
                        <Column
                          header="Yêu cầu mua hàng"
                          field="OsreName"
                          headerStyle="min-width:20rem"
                        >
                        </Column>
                      </DataTable>
                    </template>
                  </DataTable>
                </div>
              </TabPanel>
              <TabPanel header="Thông báo mời thầu">
                <div class="grid p-fluid">
                  <!-- <div class="field col-3">
                    <label>Mã gói thầu</label>

                    <InputText v-model="dataEdit.CmaCode" disabled />
                  </div> -->
                  <div class="field col-2">
                    <label>Ngân sách dự kiến</label>
                    <InputText disabled :modelValue="NumberFormat(getTotal) + ' VNĐ'" />
                  </div>
                  <div class="field col-10">
                    <label>Số tiền</label>
                    <InputText disabled :modelValue="VND2Word(getTotal)" />
                  </div>
                </div>
                <div class="grid p-fluid">
                  <div class="field col-6">
                    <label>Thời điểm đóng hồ sơ</label>
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
                    <Calendar
                      :showIcon="true"
                      :showButtonBar="true"
                      v-model="dataEdit.EndTime"
                      showTime
                      boolean
                      hourFormat="24"
                      dateFormat="dd/mm/yy"
                      placeholder="dd/mm/yyy hh:mm"
                    ></Calendar>
                  </div>
                  <div class="field col-6">
                    <label>Thời gian công bố kết quả (dự kiến)</label>
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
                    <Calendar
                      :showIcon="true"
                      :showButtonBar="true"
                      v-model="dataEdit.ResultReleaseTime"
                      showTime
                      hourFormat="24"
                      placeholder="dd/mm/yyy hh:mm"
                      dateFormat="dd/mm/yy"
                    />
                  </div>
                </div>
                <div class="grid p-fluid">
                  <div class="col-12">
                    <label>Hồ sơ thầu</label>
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
                  </div>
                  <div>
                    <div class="w-full">
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          v-model="dataEdit.ImpProgress"
                          trueValue="Y"
                          falseValue="N"
                          binary
                          disabled
                        />
                        <label for="ingredient3" class="ml-2">Tiến độ thực hiện</label>
                      </div>
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          v-model="dataEdit.SumQuotes"
                          trueValue="Y"
                          falseValue="N"
                          binary
                          disabled
                        />
                        <label for="ingredient3" class="ml-2">Tổng hợp báo giá</label>
                      </div>
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          v-model="dataEdit.TermsOfPay"
                          trueValue="Y"
                          falseValue="N"
                          binary
                          disabled
                        />
                        <label for="ingredient3" class="ml-2"
                          >Điều khoản thanh toán</label
                        >
                      </div>
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          disabled
                          v-model="dataEdit.Origin"
                          trueValue="Y"
                          falseValue="N"
                          binary
                        />
                        <label for="ingredient3" class="ml-2">Xuất xứ</label>
                      </div>
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          disabled
                          v-model="dataEdit.WartyPolicy"
                          trueValue="Y"
                          falseValue="N"
                          binary
                        />
                        <label for="ingredient3" class="ml-2">Chính sách bảo hành</label>
                      </div>
                      <div class="col-12 flex align-items-center">
                        <Checkbox
                          disabled
                          v-model="dataEdit.Other"
                          trueValue="Y"
                          falseValue="N"
                          binary
                        />
                        <label for="ingredient3" class="ml-2"
                          >Tài liệu khác (VD: Báo cáo tài chính, Hồ sơ nhân lực)</label
                        >
                      </div>
                      <div class="col-12" v-if="dataEdit.CMA5 && dataEdit.Other == 'Y'">
                        <ul
                          class="m-0 list-none p-2 card"
                          style="max-height: 150px; overflow: auto"
                          v-if="dataEdit.CMA5.length > 0"
                        >
                          <li
                            v-for="(item, i) in dataEdit.CMA5.filter((val) => {
                              return val.Type != 'D';
                            })"
                            :key="i"
                            class="p-2 mb-2 w-max border-round border-primary border-1"
                          >
                            {{ subString(item.Name) }}
                            <i
                              class="pi pi-times ml-2 cursor-pointer"
                              @click="item.Type = 'D'"
                            ></i>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="Lựa chọn nhà cung cấp">
                <div class="field">
                  <DataTable
                    showGridlines
                    :value="
                      dataEdit.CMA1
                        ? dataEdit.CMA1.filter((val) => {
                            return val.Type != 'D';
                          })
                        : dataEdit.CMA1
                    "
                    responsiveLayout="scroll"
                    dataKey="ID"
                  >
                    <Column field="LicTradNum" header="Mã số thuế">
                      <template #body="slotProps">
                        <span class="p-column-title">LicTradNum</span>
                        {{
                          slotProps.data.LicTradNum ||
                          slotProps.data.Ocrd.LicTradNum ||
                          null
                        }}
                      </template>
                    </Column>
                    <Column field="CardName" header="Tên nhà cung cấp">
                      <template #body="slotProps">
                        <span class="p-column-title">CardName</span>
                        {{
                          slotProps.data.CardName || slotProps.data.Ocrd.CardName || null
                        }}
                      </template>
                    </Column>
                    <Column field="Email" header="Email">
                      <template #body="slotProps">
                        <span class="p-column-title">Email</span>
                        {{ slotProps.data.Email || slotProps.data.Ocrd.Email || null }}
                      </template>
                    </Column>
                    <Column header="Hành động">
                      <template #body="slotProps">
                        <Button
                          icon="pi pi-trash"
                          severity="p-button-rounded p-button-text"
                          @click="slotProps.data.Type = 'D'"
                        />
                      </template>
                    </Column>
                  </DataTable>
                </div>
                <div
                  class="p-title mt-5 mb-5"
                  @click="dialogGroup = true"
                  style="cursor: pointer"
                >
                  <i class="pi pi-plus-circle"></i> Thêm nhà cung cấp
                </div>
              </TabPanel>
            </TabView>

            <div class="grid w-full">
              <div class="col-4">
                <Button
                  label="Quay lại"
                  severity="secondary"
                  outlined
                  @click="backStep2()"
                  style="width: 120px"
                />
              </div>
              <div class="col-8 text-right">
                <Button
                  label="Lưu"
                  severity="info"
                  class="ml-2"
                  style="width: 120px"
                  outlined
                  :loading="loadAction"
                  @click="saveData(false)"
                />
                <Button
                  :label="active == 2 ? 'Hoàn tất' : 'Tiếp tục'"
                  severity="info"
                  class="ml-2"
                  :loading="loadAction"
                  @click="saveData(true)"
                  style="width: 120px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <viewDetail
    v-if="dataEdit.url"
    :url="'ocma/getbyid?id=' + dataEdit.url"
    @close="closeView(e)"
  /> -->

  <!-- Dialog search-->
  <Dialog
    :style="{ width: '850px' }"
    v-model:visible="dialogCTM"
    header="Tìm kiếm tổng hợp yêu cầu mua sắm"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="grid">
      <div class="col-5">
        <div class="field">
          <label>Mã yêu cầu</label>
          <InputText
            :required="true"
            v-model="dataSearch.code"
            autofocus
            aria-required="true"
          />
        </div>
        <div class="field">
          <label>Tên yêu cầu mua sắm</label>
          <InputText
            :required="true"
            v-model="dataSearch.name"
            autofocus
            aria-required="true"
          />
        </div>
        <div class="field">
          <label>Tên đơn vị</label>
          <InputText
            :required="true"
            v-model="dataSearch.oors_name"
            autofocus
            aria-required="true"
          />
        </div>
        <div class="field">
          <label>Thời gian thực hiện mua sắm</label>
          <div class="grid">
            <div class="col-6">
              <Calendar placeholder="Từ ngày" v-model="dataSearch.date_start" />
            </div>
            <div class="col-6">
              <Calendar
                placeholder="Đến ngày"
                aria-required="true"
                v-model="dataSearch.date_end"
              />
            </div>
          </div>
        </div>
        <div class="field">
          <Button
            icon="pi pi-search"
            severity="primary"
            aria-label="Search"
            label="Tìm kiếm"
            @click="searchOPLS"
          />
        </div>
      </div>
      <div class="col-7 mt-4">
        <Infinite
          ref="searchNcc"
          @send-data="receiveDataFromChild"
          :url="url_get_oapr"
          :dataHeader="[
            {
              title: 'Mã yêu cầu:',
              key: 'OaprCode',
              type: 'String',
            },
            {
              title: 'Tên kế hoạch:',
              key: 'OaprName',
              type: 'String',
            },
            {
              title: 'Thời gian thực hiện mua sắm:',
              key: 'StartTime',
              type: 'Datetime',
            },
          ]"
          :filter="dataSearch.data"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Đóng" icon="pi pi-times" outlined @click="dialogCTM = false" />
    </template>
  </Dialog>
  <!-- Dialog search-->
  <Dialog
    v-model:visible="dialogGroup"
    :style="{ width: '650px' }"
    header="DANH SÁCH NHÀ CUNG CẤP"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="grid">
      <div class="col-12">
        <div class="field">
          <span class="block mt-2 md:mt-0 p-input-icon-right">
            <InputText placeholder="Tìm Kiếm..." />
            <i class="pi pi-search" style="cursor: pointer" />
          </span>
        </div>
      </div>
      <div class="col-12">
        <Infinite
          ref="searchNcc"
          @send-data-multi="ReceiveDataMulti"
          :url="url_get_ncc"
          :type="dataEdit.CmaType == 'C' ? 'multi' : 'one'"
          :dataHeader="[
            { title: 'Mã số thuế:', key: 'LicTradNum', type: 'String' },
            { title: 'Tên nhà cung cấp:', key: 'CardName', type: 'String' },
          ]"
          :filter="[{ oond_id: dataEdit.ArrOond }]"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Đóng" icon="pi pi-times" @click="dialogGroup = false" outlined />
      <Button label="Lưu" icon="pi pi-check" @click="callFunChilldren()" />
    </template>
  </Dialog>
  <!-- End -->
  <Dialog
    v-model:visible="dialogCRPB"
    :style="{ width: '650px' }"
    :header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="grid">
      <div class="col-12">
        <div class="field">
          <label>Tên gói thầu</label>
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
          <InputText
            :required="true"
            autofocus
            aria-required="true"
            v-model="dataEdit.CmaName"
            :class="{ 'p-invalid': screenEdit && !dataEdit.CmaName }"
          />
        </div>
      </div>
    </div>
    <div class="field">
      <label>Lựa chọn tổng hợp yêu cầu mua sắm</label>
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
      <span class="p-input-icon-right w-full" @click="dialogCTM = true">
        <InputText
          :class="{ 'p-invalid': screenEdit && !dataEdit.OaprID }"
          type="text"
          :modelValue="
            dataEdit.OAPR ? dataEdit.OAPR.OaprCode + '-' + dataEdit.OAPR.OaprName : ''
          "
          v-model="dataEdit.OaprID"
          placeholder="Tìm kiếm tổng hợp yêu cầu mua sắm"
          style="cursor: pointer"
        />
        <i class="pi pi-search" />
      </span>
      <small class="p-invalid" v-if="screenEdit && !dataEdit.OaprID"
        >Không được bỏ trống tổng hợp.</small
      >
    </div>
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="resetData()" />
      <Button label="Tiếp tục" icon="pi pi-check" @click="StepData()" />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { onBeforeMount, ref, watchEffect, computed } from "vue";
import API from "../../apis/api";
import i18n from "../../locale/i18n";
import ERROR from "../../services/StatusCode.json";
import { format } from "date-fns";
import Infinite from "./components/Infinite.vue";
import TreeArraySelect from "./components/TreeArraySelect.vue";
import { VND2Word } from "../../extension/Extention";
import viewDetail from "./components/detailCMA.vue";

const api_add = "ocma/create";
const api_update = "ocma/update";
const api_get = "ocma/getall";
const api_delete = "ocma/delete";
const url_get_oapr = "oapr/getall";
const url_get_ncc = "ocrd/getall";
// -----------------------------Start phân trang------------------------------
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
const params = ref({});
const route = useRoute();
const router = useRouter();
const load_data = ref(false);
const checktime = ref(false);
const dataTable = ref({});
const active = ref(0);
// -----------------------------End phân trang--------------------------------

//-------------------- Start CRUD ------------------
const header_update = ref("SỬA GÓI THẦU");
const header_new = ref("THÊM MỚI GÓI THẦU");
const dialogCRPB = ref(false);
const dialogCTM = ref(false);
const dialogGroup = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});

const submitted = ref(false);
const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
// Thêm nhóm người dùng
const error = ref(null);
const screenEdit = ref(false);
const dataOsre = ref([]);
let timestart = "";
let timeend = "";
const searchNcc = ref(null);
const isChange = ref(false);
const dataSearch = ref({});

const expandedRows = ref([]);
const viewdetail = ref(false);
const PnF_DATA = ref([]);
const selectedPnF = ref([]);
const CMA = ref(null);

const searchKey = ref('');
const onSearch = () => {
  params.value = {
    page: 1,
    size: 10,
    q: searchKey.value,
  }
  getData();
}

onBeforeMount(async () => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 5,
  };
  dataSearch.value.data = [
    {
      is_use: "N",
    },
  ];
  getData();
});

watchEffect(() => {
  if (dataEdit.value.ResultReleaseTime)
    dataEdit.value.ResultReleaseTime = CovertToDatetime(dataEdit.value.ResultReleaseTime);
  if (dataEdit.value.EndTime)
    dataEdit.value.EndTime = CovertToDatetime(dataEdit.value.EndTime);
});

const getError = () => {
  error.value = false;
  if (!dataEdit.value.CmaName) {
    notification("error", "Vui lòng nhập tên gói thầu");
    error.value = true;
  }

  if (dataEdit.value.CmaType == "C") {
    if (
      dataEdit.value.CMA1.filter((val) => {
        return val.Type != "D";
      }).length < 3
    ) {
      notification("error", "Số lượng nhà cung cấp phải lớn hơn hoặc bằng 3");
      error.value = true;
    }
  }
  if (!dataEdit.value.ResultReleaseTime && dataEdit.value.IsSendEmail == "Y") {
    notification("error", "Vui lòng chọn mốc thời gian công bố kế quả");
    error.value = true;
  }
  if (!dataEdit.value.EndTime && dataEdit.value.IsSendEmail == "Y") {
    notification("error", "Vui lòng chọn mốc thời gian đóng thầu");
    error.value = true;
  }
  if (dataEdit.value.ResultReleaseTime && dataEdit.value.EndTime) {
    if (new Date(dataEdit.value.ResultReleaseTime) < new Date(dataEdit.value.EndTime)) {
      notification(
        "error",
        "Vui lòng chọn mốc thời gian công bố lớn hơn thời gian đóng thầu"
      );
      error.value = true;
    }
  }
  return error.value;
};
// Thay đổi trang
const onPageChange = (event) => {
  getData(event);
};
// Lấy danh sách ----------------------------------------------------

const openNew = async () => {
  await resetData();
  await GetOOND();
  titleDialog.value = header_new.value;
  dialogCRPB.value = true;
};

const hideDialog = () => {
  dialogCRPB.value = false;
  dataEdit.value = {};
};

const saveData = async (val) => {
  if (active.value != 2) {
    active.value++;
    return;
  }
  const data = await convertData(val);
  if (val) {
    if (
      !data.CMA1.filter((value) => {
        return value.Type != "D";
      }).length
    ) {
      notification("error", "Vui lòng chọn nhà cung cấp");
      return;
    }
  }
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    const apiEndpoint = dataEdit.value.ID ? api_update : api_add;
    const apiFunction = dataEdit.value.ID ? API.update_v2 : API.add_new_v2;

    apiFunction(data, apiEndpoint)
      .then((response) => {
        const codeErr = response.data.CodeErr;
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

const resetData = async () => {
  loadAction.value = false;
  submitted.value = false;
  isChange.value = false;
  dialogCRPB.value = false;
  dataEdit.value = {
    OaprID: null,
    CmaCode: null,
    CmaName: null,
    CmaType: "C",
    StartTime: null,
    EndTime: null,
    ImpProgress: "Y",
    SumQuotes: "Y",
    TermsOfPay: "Y",
    Other: "N",
    Origin: "N",
    WartyPolicy: "N",
    CMA1: [],
    CMA5: [],
    CMA6: [],
  };
  selectedPnF.value = [];
};

const editData = async (data) => {
  if (data.IsSendEmail == "Y") return;
  dataEdit.value.fix = true;
  load_data.value = true;
  await getByIdOcma(data.ID, false);
  await GetOOND();
  dialogCRPB.value = true;
  load_data.value = false;

  titleDialog.value = header_update.value;
};

const getByIdOcma = async (id) => {
  await API.get_all("ocma/getbyid?id=" + id).then((res) => {
    dataEdit.value = res.data;
  });
  await getItemOapr(dataEdit.value.OaprID);
};

const convertData = async (val) => {
  const arr1 = dataEdit.value.CMA1;
  const CMA1 = [];
  const arrayNew = [];
  for (let index = 0; index < arr1.length; index++) {
    if (!arr1[index].Ocrd) {
      CMA1.push({
        OcrdID: arr1[index].ID,
        Type: "A",
      });
    } else {
      CMA1.push({
        ID: arr1[index].ID,
        OcrdID: arr1[index].OcrdID,
        Type: arr1[index].Type,
      });
    }
  }
  dataEdit.value.IsSendEmail = val ? "Y" : "N";
  for (let index = 0; index < dataEdit.value.CMA7New.length; index++) {
    const CMA7New = dataEdit.value.CMA7New[index];

    if (dataEdit.value.CMA7) {
      const CMA7 = dataEdit.value.CMA7.filter((val) => {
        return val.GroupItemID == CMA7New.GroupItemID;
      });
      if (CMA7.length) {
        CMA7[0].Type = "U";
      } else {
        CMA7New.Type = "A";
        dataEdit.value.CMA7.push(CMA7New);
      }
    } else {
      CMA7New.Type = "A";
      dataEdit.value.CMA7 = [CMA7New];
    }
  }
  const CM7_Del = dataEdit.value.CMA7.filter((val) => {
    return !val.Type;
  });

  if (CM7_Del.length) {
    for (let index = 0; index < CM7_Del.length; index++) {
      const item = CM7_Del[index];

      item.Type = "D";
    }
  }

  if (dataEdit.value.DataGroup) {
    const array = dataEdit.value.DataGroup;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      for (let i = 0; i < element.chilldren.length; i++) {
        const element_2 = element.chilldren[i];
        arrayNew.push({
          ID: element_2.ID,
          SreID: element_2.SreID,
          WartyPolicyID: element_2.WartyPolicyID,
          OriginID: element_2.OriginID,
          Type: null,
          GroupItemID: element_2.GroupItemID,
        });
      }
    }
  }

  const arrayNew_2 = [];
  if (dataEdit.value.CMA7)
    for (let index = 0; index < dataEdit.value.CMA7.length; index++) {
      const element = dataEdit.value.CMA7[index];
      if (element.Type != "A" && element.ListItem)
        for (let z = 0; z < element.ListItem.length; z++) {
          const element_3 = element.ListItem[z];
          if (element.Type == "D") {
            arrayNew_2.push({
              ID: element_3.ID,
              SreID: element_3.BaseLineID,
              WartyPolicyID: element_3.WartyPolicyID,
              OriginID: element_3.OriginID,
              Type: element.Type,
              GroupItemID: element.GroupItemID,
            });
          }
        }
    }

  for (let index = 0; index < dataEdit.value.CMA7.length; index++) {
    const element = dataEdit.value.CMA7[index];
    for (let i = 0; i < arrayNew.length; i++) {
      const element_2 = arrayNew[i];
      if (element_2.GroupItemID == element.GroupItemID) {
        element_2.Type = element.Type;
      }
    }
  }

  if (arrayNew_2.length) {
    for (let index = 0; index < arrayNew_2.length; index++) {
      const element = arrayNew_2[index];
      arrayNew.push(element);
    }
  }

  const dataNew = [];
  for (let index = 0; index < dataEdit.value.ArrOond.length; index++) {
    const id = dataEdit.value.ArrOond[index];
    if (dataEdit.value.CMA6) {
      const data = dataEdit.value.CMA6.filter((val) => {
        return val.OondID === parseInt(id);
      });

      if (data.length) {
        data[0].Type = "U";
      } else {
        dataNew.push({
          OondID: parseInt(id),
          Type: "A",
        });
      }
    }
  }
  for (let index = 0; index < dataNew.length; index++) {
    const element = dataNew[index];
    dataEdit.value.CMA6.push(element);
  }

  const dataDel = dataEdit.value.CMA6.filter((val) => {
    return !val.Type;
  });
  if (dataDel.length) {
    for (let index = 0; index < dataDel.length; index++) {
      dataDel[index].Type = "D";
    }
  }

  const dataSend = {
    ID: dataEdit.value.ID,
    OaprID: dataEdit.value.OaprID,
    CmaCode: dataEdit.value.CmaCode,
    CmaName: dataEdit.value.CmaName,
    CmaType: dataEdit.value.CmaType,
    ResultReleaseTime: dataEdit.value.ResultReleaseTime,
    EndTime: dataEdit.value.EndTime,
    ImpProgress: dataEdit.value.ImpProgress,
    SumQuotes: dataEdit.value.SumQuotes,
    TermsOfPay: dataEdit.value.TermsOfPay,
    Origin: dataEdit.value.Origin,
    WartyPolicy: dataEdit.value.WartyPolicy,
    IsSendEmail: dataEdit.value.IsSendEmail,
    Other: dataEdit.value.Other,
    CMA1: CMA1,
    CMA5: dataEdit.value.CMA5,
    CMA6: dataEdit.value.CMA6,
    CMA8: arrayNew ? arrayNew : null,
  };

  return dataSend;
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

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const CovertToDatetime = (time) => {
  const dateTime = new Date(time);
  return dateTime;
};
const NumberFormat = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};
const subString = (str) => {
  if (str.length > 63) {
    return str.substring(0, 60) + "...";
  } else {
    return str;
  }
};
const add_orther = () => {
  if (dataEdit.value.textOther != "") {
    if (dataEdit.value.CMA5 == null) dataEdit.value.CMA5 = [];

    dataEdit.value.CMA5.push({
      Name: dataEdit.value.textOther,
      Type: "A",
    });
    dataEdit.value.textOther = "";
  }
};

const thisCurrency = computed(() => {
  let total = 0;
  for (let item of dataOsre.value) {
    total += item.UnitPrice;
  }

  return NumberFormat(total);
});

// Phần lấy dữ liệu
const getData = async (event) => {
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  setTimeout(() => {
    API.get_all_v2(api_get, {
      data: params.value,
    })
      .then((response) => {
        dataTable.value = response.data;
        router.push({
          name: route.name,
          query: {
            page: response.data.Page,
          },
        });
      })
      .catch((error) => {
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
const getItemOapr = async (id) => {
  await API.get_all("oapr/getbyid?id=" + id).then((res) => {
    dataEdit.value.OAPR = res.data;
  });
  for (let index = 0; index < dataEdit.value.OAPR.APR1.length; index++) {
    await getGroupItem(dataEdit.value.OAPR.APR1[index].OsreID);
  }
  for (let index = 0; index < dataEdit.value.DataGroupItem.length; index++) {
    const globalData = dataEdit.value.DataGroupItem[index];
    for (let i = 0; i < dataEdit.value.CMA7.length; i++) {
      const CMA7 = dataEdit.value.CMA7[i];
      if (globalData.GroupItemID == CMA7.GroupItemID) {
        for (let y = 0; y < CMA7.ListItem.length; y++) {
          const element_01 = CMA7.ListItem[y];

          const dataCheck = globalData.chilldren.filter((val) => {
            return val.Oitm.ID === (element_01.OitmID || 0);
          });
          if (dataCheck.length) {
            dataCheck[0].ID = element_01.ID;
            dataCheck[0].OriginID = element_01.OriginID;
            dataCheck[0].WartyPolicyID = element_01.WartyPolicyID;
          }
        }
        if (dataEdit.value.CMA7New) {
          dataEdit.value.CMA7New.push(globalData);
        } else {
          dataEdit.value.CMA7New = [globalData];
        }
      }
    }
  }
};
// ----------------
// Phần nhận dữ liệu
const ReceiveDataMulti = (value) => {
  if (dataEdit.value.CmaType == "S") {
    if (value.length > 1) {
      notification("error", "Vui lòng chỉ chọn một nhà cung cấp");
      return;
    } else {
      dialogGroup.value = false;
      dataEdit.value.CMA1 = [value];
      return;
    }
  }
  if (!dataEdit.value.CMA1.length) dataEdit.value.CMA1 = value;
  else {
    for (let index = 0; index < value.length; index++) {
      const t = dataEdit.value.CMA1.filter((val) => {
        if (val.OcrdID) {
          val.OcrdID;
          return val.OcrdID == value[index].ID && val.Type != "D";
        } else {
          return val.ID == value[index].ID && val.Type != "D";
        }
      });
      if (t.length) {
        notification("error", "Đã tồn tại nhà cung cấp" + value[index].CardName);
        continue;
      } else {
        dataEdit.value.CMA1.push(value[index]);
      }
    }
  }

  dialogGroup.value = false;
};
const receiveDataFromChild = async (value) => {
  dataEdit.value.OAPR = value;
  for (let index = 0; index < value.APR1.length; index++) {
    await getGroupItem(value.APR1[index].OsreID, false);
  }
  dataEdit.value.OaprID = dataEdit.value.OAPR.ID;
  dialogCTM.value = false;
};
// const receiveDataGroup = (value) => {
//   dataEdit.value.CMA1 = value;
// };

const callFunChilldren = () => {
  searchNcc.value.sendDataMulti();
};
const searchOPLS = async () => {
  dataSearch.value.data = [
    {
      code: dataSearch.value.code ? dataSearch.value.code : "",
    },
    {
      name: dataSearch.value.name ? dataSearch.value.name : "",
    },
    {
      date_start: dataSearch.value.date_start ? dataSearch.value.date_start : "",
    },
    {
      date_end: dataSearch.value.date_end ? dataSearch.value.date_end : "",
    },
    {
      oors_name: dataSearch.value.oors_name ? dataSearch.value.oors_name : "",
    },
    {
      is_use: "N",
    },
  ];

  if (dataSearch.value.data.length) {
    searchNcc.value.search_key(dataSearch.value.data);
  }
};

const StepData = async () => {
  await openUpdatePnF();
  screenEdit.value = true;
  if (dataEdit.value.OaprID && dataEdit.value.CmaName) {
    dataEdit.value.Action = "New";
    dialogCRPB.value = false;
    screenEdit.value = false;
  } else {
    notification("error", "Vui lòng nhập đủ thông tin");
  }
};

const StepTWO = () => {
  if (dataEdit.value.Other === "Y") {
    const Ar = dataEdit.value.CMA5.filter((val) => {
      return val.Type != "D";
    });
    if (Ar.length < 1) {
      notification("error", "Vui lòng nhập thông tin tài liệu khác");
      return false;
    }
  }
  if (!dataEdit.value.CMA7New || !dataEdit.value.CMA7New.length) {
    notification("error", "Vui lòng chọn nhóm sản phẩm");
    return false;
  }
  if (!dataEdit.value.ArrOond.length) {
    notification("error", "Vui lòng chọn ngành nghề lĩnh vực");
    return false;
  }

  if (!dataEdit.value.CmaType) return false;

  getOrigin();
  getWartyPolicy();
  if (dataEdit.value.CMA7New) {
    for (let index = 0; index < dataEdit.value.CMA7New.length; index++) {
      const element = dataEdit.value.CMA7New[index];
      DataGroupItem(element.chilldren);
    }
  }
  dataEdit.value.StepTwo = true;
};

// Lấy dữ liệu từ database
const GetOOND = async () => {
  await API.get_all("oond/getall?page=0&size=0").then((res) => {
    dataEdit.value.OOND = res.data.data;
  });
};
const DataGroupItem = (data) => {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!dataEdit.value.DataGroup) {
      dataEdit.value.DataGroup = [
        {
          ID: item.Oitm.ID,
          NameGroup: item.Oitm.ItemName,
          UnitPriceTotal: item.UnitPrice * item.Quantity,
          Quantity: item.Quantity,
          UomName: item.UomName,
          chilldren: [
            {
              ID: item.ID ? item.ID : 0,
              SreID: item.SreID,
              Oitm: item.Oitm,
              Quantity: item.Quantity,
              UomName: item.UomName,
              OsreName: item.OsreName,
              UnitPrice: item.UnitPrice,
              Memo: item.Memo,
              OriginID: item.OriginID ? item.OriginID : 0,
              WartyPolicyID: item.WartyPolicyID ? item.WartyPolicyID : 0,
              GroupItemID: item.Oitm.ItmsGrpCod,
              Address: item.Address,
            },
          ],
        },
      ];
    } else {
      const data = dataEdit.value.DataGroup.filter((val) => {
        return val.ID == item.Oitm.ID && val.UomName == item.UomName;
      });
      if (data.length) {
        data[0].ID = item.ID;
        data[0].UomName = item.UomName;
        data[0].NameGroup = item.Oitm.ItemName;
        data[0].UnitPriceTotal += item.UnitPrice * item.Quantity;
        data[0].Quantity += item.Quantity;
        data[0].chilldren.push({
          ID: item.ID ? item.ID : 0,
          SreID: item.SreID,
          Oitm: item.Oitm,
          Quantity: item.Quantity,
          UomName: item.UomName,
          OsreName: item.OsreName,
          UnitPrice: item.UnitPrice,
          Memo: item.Memo,
          OriginID: item.OriginID ? item.OriginID : 0,
          WartyPolicyID: item.WartyPolicyID ? item.WartyPolicyID : 0,
          GroupItemID: item.Oitm.ItmsGrpCod,
          Address: item.Address,
        });
      } else {
        dataEdit.value.DataGroup.push({
          ID: item.Oitm.ID,
          UomName: item.UomName,
          NameGroup: item.Oitm.ItemName,
          UnitPriceTotal: item.UnitPrice * item.Quantity,
          Quantity: item.Quantity,
          chilldren: [
            {
              ID: item.ID ? item.ID : 0,
              SreID: item.SreID,
              Oitm: item.Oitm,
              Quantity: item.Quantity,
              UomName: item.UomName,
              OsreName: item.OsreName,
              UnitPrice: item.UnitPrice,
              Memo: item.Memo,
              OriginID: item.OriginID ? item.OriginID : 0,
              WartyPolicyID: item.WartyPolicyID ? item.WartyPolicyID : 0,
              GroupItemID: item.Oitm.ItmsGrpCod,
              Address: item.Address,
            },
          ],
        });
      }
    }
  }
};

const getGroupItem = async (id, check = true) => {
  let url = "osre/getbyid?id=" + id;
  if (dataEdit.value.fix) url = "osre/getbyid?id=" + id + "&is_use=N";
  dataEdit.value.fix = false;
  await API.get_all(url).then((res) => {
    if (res.data.SRE2 != null) {
      for (let i = 0; i < res.data.SRE2.length; i++) {
        if (res.data.SRE2[i].IsUseWithOcma && !check) continue;
        const item = res.data.SRE2[i];
        if (!dataEdit.value.DataGroupItem) {
          dataEdit.value.DataGroupItem = [
            {
              NameGroup: item.Oitm.ItmsGrpName,
              GroupItemID: item.Oitm.ItmsGrpCod,
              UnitPrice: item.UnitPrice * item.Quantity,
              chilldren: [
                {
                  SreID: item.ID,
                  Oitm: item.Oitm,
                  Quantity: item.Quantity,
                  UomName: item.UomName,
                  OsreName: res.data.OsreName,
                  UnitPrice: item.UnitPrice,
                  Memo: item.Memo,
                  Address: item.Address,
                },
              ],
            },
          ];
        } else {
          const data = dataEdit.value.DataGroupItem.filter((val) => {
            return val.GroupItemID == item.Oitm.ItmsGrpCod;
          });
          if (data.length) {
            data[0].GroupItemID = item.Oitm.ItmsGrpCod;
            data[0].UnitPrice += item.UnitPrice * item.Quantity;
            data[0].chilldren.push({
              SreID: item.ID,
              Oitm: item.Oitm,
              Quantity: item.Quantity,
              UomName: item.UomName,
              OsreName: res.data.OsreName,
              UnitPrice: item.UnitPrice,
              Memo: item.Memo,
              Address: item.Address,
            });
          } else {
            dataEdit.value.DataGroupItem.push({
              NameGroup: item.Oitm.ItmsGrpName,
              GroupItemID: item.Oitm.ItmsGrpCod,
              UnitPrice: item.UnitPrice * item.Quantity,
              chilldren: [
                {
                  SreID: item.ID,
                  Oitm: item.Oitm,
                  Quantity: item.Quantity,
                  UomName: item.UomName,
                  OsreName: res.data.OsreName,
                  UnitPrice: item.UnitPrice,
                  Memo: item.Memo,
                  Address: item.Address,
                },
              ],
            });
          }
        }
      }
    }
  });
};
const getTotal = computed(() => {
  let total = 0;
  if (dataEdit.value.CMA7New) {
    for (let i = 0; i < dataEdit.value.CMA7New.length; i++) {
      const item = dataEdit.value.CMA7New[i];
      total += item.UnitPrice;
    }
  }
  return total;
});
const getWartyPolicy = () => {
  API.get_all("oscw/getbyid?id=1").then((res) => {
    dataEdit.value.dataWartyPolicy = res.data.SCW1;
  });
};
const getOrigin = () => {
  API.get_all("oscw/getbyid?id=2").then((res) => {
    dataEdit.value.dataOrigin = res.data.SCW1;
  });
};

const backStep2 = () => {
  if (active.value == 0) {
    dataEdit.value.StepTwo = false;
    dataEdit.value.DataGroup = [];
  } else {
    active.value--;
  }
};

const viewData = (data) => {
  dataEdit.value.url = data.ID;
  CMA.value.style.display = "none";
};

const closeView = (e) => {
  delete dataEdit.value.url;
  CMA.value.style.display = "block";
};

const openUpdatePnF = async () => {
  PnF_DATA.value = await getFormatedPnFData();
  dataEdit.value.ArrOond = [];
  if (dataEdit.value.CMA6.length > 0) {
    dataEdit.value.CMA6New = dataEdit.value.CMA6.map((item) => ({
      id: item.OondID,
      label: item.OondName,
    }));
    dataEdit.value.CMA6New.forEach((element) => {
      const id = element.id;
      const myObject = { checked: true, partialChecked: false, id: id };
      selectedPnF.value.push(myObject);

      dataEdit.value.ArrOond.push(id);
    });
    selectedPnF.value = selectedPnF.value.reduce((acc, obj, index) => {
      const id = obj.id;
      acc[id] = obj;
      delete obj.id;
      return acc;
    }, {});
  } else {
    selectedPnF.value = {};
  }
};

function createObject(key, value) {
  return { [key]: value };
}

const getFormatedPnFData = async () => {
  let resultArray = [];
  const formatObject = (array) => {
    if (array && array.length > 0) {
      return array.map((item) => {
        return {
          key: item.ID.toString(),
          label: item.IndName,
          code: item.IndCode,
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

const onChangePnF = (e) => {
  const ids = [];
  for (let key of Object.keys(e)) {
    if (e[key]["checked"]) {
      ids.push(key);
    }
  }
  dataEdit.value.ArrOond = ids;
};

const getStatusLabel = (status) => {
  switch (status) {
    case "P":
      return "Đang nhận hồ sơ";
    case "A":
      return "Hoàn thành";
    case "C":
      return "Huỷ";
    case "I":
      return "Đang đánh giá";
    case "F":
      return "Thất bại";
    case "L":
      return "Đã chọn nhà thầu";
    default:
      return "Unknown";
  }
};
</script>
