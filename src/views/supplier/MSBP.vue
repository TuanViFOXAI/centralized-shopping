<template>
  <div v-if="!dataEdit.ID">
    <div>
      <div class="flex">
        <div class="flex align-items-center mt-0 col-6">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">QUẢN LÝ GÓI THẦU</h5>
        </div>
      </div>
    </div>
    <!-- End Header -->
    <div class="grid">
      <div class="col-12">
        <div class="card p-0">
          <Toast />
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
              responsiveLayout="scroll"
              @page="onPageChange($event)"
              v-model:selection="selected_data"
              dataKey="ID"
              size="small"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[5, 10, 25]"
              currentPageReportTemplate="Hiển thị từ {first} đến {last} trên tổng {totalRecords} "
            >
              <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
              <Column field="CmaCode" header="Mã gói thầu" headerStyle="width: 15rem">
              </Column>
              <Column field="CmaName" header="Tên gói thầu" headerStyle="width: 30rem">
              </Column>
              <Column field="FobDesc" header="Lĩnh vực" headerStyle="width: 15rem">
              </Column>
              <Column field="CmaType" header="Hình thức" headerStyle="width: 15rem">
                <template #body="slotProps">
                  {{
                    slotProps.data.CmaType == "C"
                      ? "Chào giá cạnh tranh"
                      : "Chỉ định nhà cung cấp"
                  }}
                </template>
              </Column>
              <Column
                field="StartTime"
                header="Thời gian nộp hồ sơ"
                headerStyle="width: 15rem"
              >
                <template #body="slotProps">
                  {{ convertToCustomFormat(slotProps.data.StartTime) }}
                  <br />
                  {{ convertToCustomFormat(slotProps.data.EndTime) }}
                </template>
              </Column>
              <Column
                field="StartTime"
                header="Ngày nộp hồ sơ"
                headerStyle="width: 15rem"
              >
                <template #body="slotProps">
                  {{ convertToCustomFormat(slotProps.data.StartTime) }}
                </template>
              </Column>
              <Column
                field="is_active"
                header="Trạng thái"
                headerClass="text-center"
                headerStyle="width: 15rem"
              >
                <template #body="slotProps">
                  {{
                    slotProps.data.CMA1[0].Status == "S"
                      ? "Đã nộp"
                      : slotProps.data.CMA1[0].Status == "O"
                      ? "Đã huỷ"
                      : "Chưa nộp"
                  }}
                </template>
              </Column>
              <Column
                header="Hành động"
                style="text-align: center"
                headerStyle="width: 15rem"
              >
                <template #body="slotProps">
                  <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text"
                    @click="getCMA(slotProps.data.ID)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- View -->
  <div v-if="dataEdit.ID && !dataEdit.submitBid">
    <div>
      <div class="flex justify-content-between m-3 mt-3">
        <div class="flex align-items-center mt-0">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">XEM THÔNG TIN GÓI THẦU</h5>
        </div>
        <div class="flex align-items-center mt-0">
          <Button label="Đóng" outlined @click="dataEdit = {}"></Button>
        </div>
      </div>
    </div>
    <div>
      <div class="mt-5 mb-5">
        <div class="grid">
          <div class="col-4" v-for="(i, index) in stepData" :key="index">
            <div class="flex">
              <div
                :class="[
                  i.classbox,
                  'right-1 relative border-round-left flex align-items-center',
                ]"
              >
                <div class="ml-5 mt-1">
                  <h6 class="m-0 text-white">{{ i.status }}</h6>
                  <p class="m-0 text-white">{{ i.time }}</p>
                </div>
                <div class="arrow-left absolute" v-if="index != 0"></div>
              </div>
              <div :class="['arrow-right', i.classarrow]" v-if="index != 2"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="grid">
        <div class="col-3">
          <div class="card border-round">
            <div class="grid mb-3">
              <div class="col-4">Trạng thái:</div>
              <div class="col-8" v-if="new Date(dataEdit.StartTime) <= new Date()">
                <strong>Đang nhận hồ sơ</strong>
              </div>
              <div class="col-8" v-else>
                <strong>Gói thầu chưa mở</strong>
              </div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Bắt đầu:</div>
              <div class="col-8">
                <strong class="p-title">{{
                  convertToCustomFormat(dataEdit.StartTime)
                }}</strong>
              </div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Kết thúc:</div>
              <div class="col-8">
                <strong class="p-title">{{
                  convertToCustomFormat(dataEdit.EndTime)
                }}</strong>
              </div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Còn lại:</div>
              <div class="col-8">
                <strong class="p-title">{{ countdownstring }}</strong>
              </div>
            </div>
            <hr />
            <div v-if="dataEdit.Status != 'A' && countdownstring">
              <div>
                <Button
                  :label="expiredCheck ? 'Đã hết hạn' : 'Nộp hồ sơ'"
                  @click="SubmitBid()"
                  class="w-full"
                  v-if="dataEdit.Detail.Status == ''"
                  :disabled="expiredCheck"
                />
                <Button
                  :label="expiredCheck ? 'Đã hết hạn' : 'Nộp lại'"
                  @click="SubmitBid()"
                  class="w-full"
                  v-if="dataEdit.Detail.Status == 'O'"
                  :disabled="expiredCheck"
                />
              </div>
              <div class="flex" v-if="dataEdit.Detail.Status == 'S' && expiredCheck">
                <Button
                  :label="expiredCheck ? 'Đã hết hạn' : 'Cập nhật'"
                  class="w-full me-3"
                  @click="SubmitBid()"
                  :disabled="expiredCheck"
                />
                <Button
                  label="Rút thầu"
                  class="w-full ml-3"
                  @click="withdrawal()"
                  severity="danger"
                  v-if="!expiredCheck"
                />
              </div>
            </div>
            <div v-if="dataEdit.Status == 'A'">
              <Button
                :label="
                  dataEdit.CMA1[0].IsWonTheBid == true ? 'Đã trúng thầu' : 'Đã trượt thầu'
                "
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div class="col-9">
          <div class="card border-round">
            <h5 class="p-title font-semibold">{{ dataEdit.CmaName }}</h5>
            <div class="card p-3 surface-200">
              <p class="m-0"><strong>Thông tin mời thầu</strong></p>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Mã gói thầu:</div>
              <div class="col-8">{{ dataEdit.CmaCode }}</div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Tên gói thầu:</div>
              <div class="col-8">{{ dataEdit.CmaName }}</div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Ngân sách dự kiến:</div>
              <div class="col-8">1.000.000 VNĐ</div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Hình thức:</div>
              <div class="col-8">
                {{
                  dataEdit.CmaType == "C"
                    ? "Chào hàng cạnh tranh"
                    : "Chỉ định nhà cung cấp"
                }}
              </div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Phương pháp chấm điểm:</div>
              <div class="col-8">Xếp hạng giá dự thầu</div>
            </div>
            <div class="grid mb-3">
              <div class="col-4">Lĩnh vực:</div>
              <div class="col-8">Nông nghiệp</div>
            </div>
          </div>
          <div class="card border-round">
            <h6>Danh mục hàng hóa</h6>
            <DataTable
              showGridlines
              v-model:expandedRows="expandedRows"
              :value="dataEdit.Items"
              responsiveLayout="scroll"
              :rows="10"
              stripedRows
              size="small"
            >
              <Column expander style="width: 1rem" />
              <Column header="Tên hàng hoá" field="itemName" style="width: 150px">
              </Column>
              <Column header="Đơn vị tính" field="uomName" style="text-align: right">
              </Column>
              <Column header="Số lượng" style="text-align: right">
                <template #body="slotProps">
                  {{ NumberFormat(slotProps.data.quantity) }}
                </template>
              </Column>
              <template #expansion="slotProps">
                <DataTable
                  showGridlines
                  :value="slotProps.data.item"
                  responsiveLayout="scroll"
                  stripedRows
                  size="small"
                  :rows="10"
                >
                  <Column header="Tên hàng hoá" field="Oitm.ItemName"> </Column>
                  <Column header="Đơn vị tính" field="UomName"> </Column>
                  <Column header="Số lượng" field="Quantity">
                    <template #body="slotProps">
                      {{ NumberFormat(slotProps.data.Quantity) }}
                    </template>
                  </Column>
                  <Column header="Ghi chú" field="Memo"> </Column>
                  <Column header="Tệp đính kèm" field="LinkDocument">
                    <template #body="slotProps">
                      <a :href="slotProps.data.LinkDocument" target="_blank">{{
                        slotProps.data.LinkDocument
                      }}</a>
                    </template>
                  </Column>
                  <Column
                    header="Xuất xứ"
                    :hidden="dataEdit.OriginID == 'Y' ? false : true"
                    headerStyle="width:15%"
                  >
                  </Column>
                  <Column
                    header="Chính sách bảo hành"
                    :hidden="dataEdit.WartyPolicyID == 'Y' ? false : true"
                    headerStyle="width:15%"
                  >
                  </Column>
                  <Column header="Địa chỉ giao hàng" field="Address"> </Column>
                </DataTable>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="dataEdit.submitBid">
    <div>
      <div class="flex justify-content-between m-3 mt-3">
        <div class="flex align-items-center mt-0">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">NỘP HỒ SƠ THẦU</h5>
        </div>
      </div>
      <div class="m-4">
        <div class="card">
          <div>
            <div class="grid mb-3">
              <div class="col-2">
                <strong>Tên gói thầu:</strong>
              </div>
              <div class="col-10">{{ dataEdit.CmaName }}</div>
            </div>
            <div class="grid">
              <div class="col-2">
                <strong>Mã gói thầu:</strong>
              </div>
              <div class="col-10">{{ dataEdit.CmaCode }}</div>
            </div>
          </div>
        </div>
        <div class="card p-0">
          <TabView v-model:activeIndex="dataEdit.indexTab">
            <TabPanel header="Thông tin dự thầu">
              <div class="card p-0">
                <div class="mb-3">
                  <div class="surface-300 p-2 m-2">
                    <div class="ml-5">
                      <h6 class="font-semibold m-0">Thông tin công ty</h6>
                    </div>
                  </div>
                  <div class="p-3 m-5">
                    <div class="grid mb-3">
                      <div class="col-3">Tên công ty</div>
                      <div class="col-9">{{ dataEdit.ocrd.CardName }}</div>
                    </div>
                    <div class="grid mb-3">
                      <div class="col-3">Mã số công ty</div>
                      <div class="col-9">{{ dataEdit.ocrd.LicTradNum }}</div>
                    </div>
                    <div class="grid mb-3">
                      <div class="col-3">Email</div>
                      <div class="col-9">{{ dataEdit.ocrd.Email }}</div>
                    </div>
                    <div class="grid mb-3">
                      <div class="col-3">Điện thoại</div>
                      <div class="col-9">
                        {{ dataEdit.ocrd.Phone ? dataEdit.ocrd.Phone : "-" }}
                      </div>
                    </div>
                    <div class="grid">
                      <div class="col-3">Địa chỉ</div>
                      <div class="col-9">{{ dataEdit.ocrd.Country }}</div>
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="surface-300 p-2 m-2">
                    <div class="ml-5">
                      <h6 class="font-semibold m-0">Thông tin Liên hệ</h6>
                    </div>
                  </div>
                  <div class="p-3 m-5">
                    <div class="grid mb-3">
                      <div class="col-3">Tên người liên hệ</div>
                      <div class="col-9">
                        {{
                          dataEdit.ocrd.CRD5[0] ? dataEdit.ocrd.CRD5[0].FirstName : "-"
                        }}
                      </div>
                    </div>
                    <div class="grid mb-3">
                      <div class="col-3">Email</div>
                      <div class="col-9">
                        {{ dataEdit.ocrd.CRD5[0] ? dataEdit.ocrd.CRD5[0].Email : "-" }}
                      </div>
                    </div>
                    <div class="grid mb-3">
                      <div class="col-3">Điện thoại</div>
                      <div class="col-9">
                        {{ dataEdit.ocrd.CRD5[0] ? dataEdit.ocrd.CRD5[0].Phone : "-" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card p-0 pt-5 pb-5">
                <div class="ml-5">
                  <h6 class="font-semibold p-title m-0">Nội dung dự thầu</h6>
                </div>
                <hr />
                <div class="grid p-2 pl-5 flex align-items-center">
                  <div class="col-3"><p class="m-0">Giá dự thầu</p></div>
                  <div class="col-2">
                    <div
                      class="border-round p-2 surface-200 flex-initial flex align-items-center justify-content-between"
                    >
                      <p class="m-0 text-left">{{ NumberFormat(getTotal) }}</p>
                      <p class="m-0"><strong>VNĐ</strong></p>
                    </div>
                  </div>
                </div>
                <div class="grid p-2 pl-5 flex align-items-center"></div>
              </div>
            </TabPanel>
            <TabPanel header="Hồ sơ dự thầu">
              <div class="card p-0">
                <div class="p-3">
                  <h6 class="font-semibold p-title m-0">
                    Hướng dẫn nhà cung cấp nộp hồ sơ.
                  </h6>
                </div>
                <hr class="m-0"/>
                <ol class="guild-ol">
                  <!-- <p>1. Nhấn nút xem trước để xem lại toàn bộ hồ sơ thầu</p> -->
                  <li>Nhấn nút nộp hồ sơ để nộp hồ sơ thầu.</li>
                  <li>Nhấn nút <i class="pi pi-eye btn-icon"></i> để xem thông tin chi tiết của các thành phần mời thầu, dự thầu của bộ hồ sơ.</li>
                  <li>Nhấn nút <i class="pi pi-pencil btn-icon"></i> để nhập thông tin của từng thành phần tương ứng.</li>
                </ol>
              </div>
              <div class="surface-300 p-2 m-1">
                <div class="ml-5">
                  <h6 class="font-semibold m-0">Nội dung hồ sơ dự thầu</h6>
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.ImpProgress == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.ImpProgressClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5">Tiến độ thực hiện</label>
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(1)" />
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.SumQuotes == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.SumQuotesClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5">Tổng hợp báo giá</label>
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(2)" />
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.TermsOfPay == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.TermsOfPayClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5">Điều khoản thanh toán</label>
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(3)" />
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.WartyPolicy == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.WartyPolicyClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5">Chính sách bảo hành</label>
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(4)" />
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.Origin == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.OriginClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5">Xuất xứ</label>
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(5)" />
                </div>
              </div>
              <div class="grid m-2" v-if="dataEdit.Other == 'Y'">
                <div class="col-6 flex align-items-center">
                  <Checkbox
                    disabled
                    v-model="dataEdit.OtherClient"
                    trueValue="Y"
                    falseValue="N"
                    binary="true"
                  />
                  <label for="ingredient1" class="ml-5"
                    >Tài liệu khác(VD:Chứng nhận,Hồ sơ doanh nghiệp,Hợp đồng,..vv)</label
                  >
                </div>
                <div class="col-6 flex align-items-center justify-content-end">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text @click="Update(6)" />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <div class="m-4">
        <div class="flex justify-content-end align-content-center">
          <Button
            label="Quay lại"
            class="mr-3"
            style="width: 100px"
            severity="secondary"
            @click="dataEdit.submitBid = false"
          />
          <Button
            v-if="dataEdit.indexTab != 1"
            label="Tiếp tục"
            class="mr-3"
            style="width: 100px"
            @click="dataEdit.indexTab = 1"
          />
          <Button
            v-if="dataEdit.indexTab == 1"
            label="Gửi thầu"
            class="mr-3"
            style="width: 100px"
            @click="saveData()"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Edit -->
  <Dialog
    v-model:visible="dialog01"
    :style="{ width: '1500px' }"
    :header="dataEdit.dialogheader"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="mb-3" v-if="dataEdit.dialogtype == 1">
      <p class="m-0">
        Nhà thầu đề xuất tiến độ thực hiện giao hàng phù hợp với yêu cầu của bên mời thầu
      </p>
      <p>Lưu ý: Thời gian giao hàng bắt đầu tính từ ngày ký hợp đồng</p>
    </div>
    <div class="mb-3" v-if="dataEdit.dialogtype == 2">
      <h6 class="m-0">Lưu ý</h6>
      <div>
        <p class="m-0">
          1. Nhà cung cấp báo giá hàng hóa theo số lượng hàng có thể đáp ứng.
        </p>
        <p>
          2. Đơn giá báo giá đã bao gồm tất cả chi phí dịch vụ vận chuyển, lắp đặt và thuế
          VAT.
        </p>
      </div>
    </div>
    <div
      class="card"
      v-if="
        dataEdit.dialogtype == 2 ||
        dataEdit.dialogtype == 1 ||
        dataEdit.dialogtype == 4 ||
        dataEdit.dialogtype == 5
      "
    >
      <DataTable
        showGridlines
        v-model:expandedRows="expandedRows2"
        :value="dataEdit.Items"
        responsiveLayout="scroll"
        :rows="10"
        stripedRows
        size="small"
        scrollHeight="700px"
        scrollable
      >
        <Column expander style="width: 1rem" />
        <Column header="Tên hàng hoá" field="itemName"> </Column>
        <Column header="Đơn vị tính" field="uomName" style="text-align: right"> </Column>
        <Column header="Số lượng" style="text-align: right">
          <template #body="slotProps">
            {{ NumberFormat(slotProps.data.quantity) }}
          </template>
        </Column>
        <!-- <Column header="Thành tiền" style="text-align: right">
          <template #body="slotProps">
            {{ NumberFormat(slotProps.data.UnitPrice) }} VNĐ
          </template>
        </Column> -->

        <template #expansion="slotProps">
          <DataTable
            showGridlines
            :value="slotProps.data.item"
            responsiveLayout="scroll"
            stripedRows
            size="small"
            :rows="10"
          >
            <Column header="Tên hàng hoá" field="Oitm.ItemName" style="min-width: 400px">
            </Column>
            <Column header="Đơn vị tính" field="UomName" style="min-width: 100px">
            </Column>
            <Column header="Số lượng" field="Quantity" style="min-width: 100px">
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.Quantity) }}
              </template>
            </Column>
            <Column
              header="Số lượng có thể cung cấp"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                <InputNumber
                  v-model="slotProps.data.QuanCanBeSupp"
                  :class="{ 'p-invalid': submitted && !slotProps.data.QuanCanBeSupp }"
                  :min="0"
                  :max="slotProps.data.Quantity"
                />
              </template>
            </Column>
            <Column
              header="Đơn giá"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                <InputNumber
                  v-model="slotProps.data.Price"
                  :class="{ 'p-invalid': submitted && !slotProps.data.Price }"
                />
              </template>
            </Column>
            <!-- <Column
              header="Giá tham khảo"
              field="UnitPrice"
              style="text-align: right; min-width: 150px"
            >
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.UnitPrice) }} VNĐ
              </template>
            </Column> -->
            <Column
              header="Thành tiền"
              v-if="dataEdit.dialogtype == 2"
              field="UnitPrice"
              style="text-align: right; min-width: 100px"
            >
              <template #body="slotProps">
                {{ NumberFormat(slotProps.data.Price * slotProps.data.QuanCanBeSupp) }}
                VNĐ
              </template>
            </Column>
            <Column header="Địa điểm thực hiện" field="Address" style="min-width: 200px">
            </Column>
            <Column
              header="Chính sách bảo hành đề xuất"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 4"
              field="WartyPolicyName"
            >
            </Column>
            <Column
              header="Chính sách bảo hành"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 4"
            >
              <template #body="slotProps">
                <Dropdown
                  :options="dataEdit.dataWartyPolicy"
                  optionLabel="CwName"
                  optionValue="ID"
                  v-model="slotProps.data.WarrPolicy"
                  :class="{ 'p-invalid': submitted && !slotProps.data.WarrPolicy }"
                />
              </template>
            </Column>
            <Column
              header="Xuất xứ đề xuất"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 5"
              field="OriginName"
            >
            </Column>
            <Column
              header="Xuất xứ"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 5"
            >
              <template #body="slotProps">
                <Dropdown
                  :options="dataEdit.dataOrigin"
                  optionLabel="CwName"
                  optionValue="ID"
                  v-model="slotProps.data.Origin"
                  :class="{ 'p-invalid': submitted && !slotProps.data.Origin }"
                />
              </template>
            </Column>

            <Column
              header="Tài liệu liên quan"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 2"
            >
              <template #body="slotProps">
                <div
                  v-if="slotProps.data.file || slotProps.data.LinkDocument"
                  class="flex align-items-center"
                >
                  <a
                    :href="
                      slotProps.data.file
                        ? slotProps.data.file.name
                        : slotProps.data.LinkDocument
                    "
                    target="_blank"
                    >{{
                      slotProps.data.file
                        ? slotProps.data.file.name
                        : slotProps.data.LinkDocument
                    }}</a
                  >
                  <Button text icon="pi pi-times" @click="delete slotProps.data.file" />
                </div>
                <Button
                  v-else
                  text
                  label="Chọn file"
                  icon="pi pi-upload"
                  @click="chooseFile(slotProps.data)"
                />
              </template>
            </Column>
            <Column
              header="Ngày cần hàng"
              style="min-width: 200px"
              v-if="dataEdit.dialogtype == 1"
              field="TimeNeeded"
            >
              <template #body="slotProps">
                {{ format(slotProps.data.TimeNeeded, "dd/MM/yyyy") }}
              </template>
            </Column>
            <Column
              header="Thời gian giao hàng dự kiến"
              style="min-width: 230px"
              v-if="dataEdit.dialogtype == 1"
            >
              <template #body="slotProps">
                <Calendar
                  :modelValue="
                    slotProps.data.LeadTime
                      ? format(slotProps.data.LeadTime, 'dd/MM/yyyy')
                      : ''
                  "
                  v-model="slotProps.data.LeadTime"
                  dateFormat="dd/mm/yyyy"
                  placeholder="dd/mm/yyyy"
                />
              </template>
            </Column>
          </DataTable>
        </template>
      </DataTable>
    </div>
    <div v-if="dataEdit.dialogtype == 3">
      <h6>Yêu cầu tạm ứng</h6>
      <div class="grid">
        <div class="col-2">
          <div class="col-12 flex align-items-center">
            <RadioButton inputId="btn-yes" :value="true" v-model="dataEdit.WPL2.IsAdvReq" @change="onChangeYCTU"/>
            <label for="btn-yes" class="ml-5">Có</label>
          </div>
        </div>
        <div class="col-2">
          <InputNumber
            :disabled="!dataEdit.WPL2.IsAdvReq"
            :max="100"
            :min="0"
            placeholder="Phần trăm tạm ứng (%)"
            suffix=" %"
            v-model="dataEdit.WPL2.NumAdvReq"
            :class="{
              'p-invalid':
                submitted && !dataEdit.WPL2.NumAdvReq && dataEdit.WPL2.IsAdvReq,
            }"
          />
        </div>
      </div>
      <div class="grid">
        <div class="col-2">
          <div class="col-12 flex align-items-center">
            <RadioButton inputId="btn-no" :value="false" v-model="dataEdit.WPL2.IsAdvReq" @change="onChangeYCTU"/>
            <label for="btn-no" class="ml-5">Không</label>
          </div>
        </div>
      </div>
      <hr />
      <h6>Điều khoản thanh toán</h6>
      <div class="grid">
        <div class="col-6">
          <div class="field">
            <Dropdown
              placeholder="Chọn"
              :options="dataEdit.ocrd.CRD7"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Type }"
              optionLabel="Name"
              optionValue="ID"
              v-model="dataEdit.WPL2.Type"
            />
          </div>
        </div>
      </div>
      <div class="grid" v-if="dataEdit.WPL2.Type == 0">
        <div class="col-3">
          <div class="field">
            <label> Ngày thanh toán dựa trên</label>
            <Dropdown
              placeholder="Chọn"
              :options="[
                {
                  type: 1,
                  name: 'Ngày hoá đơn',
                },
                {
                  type: 2,
                  name: 'Ngày giao hàng',
                },
              ]"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.DateAdd }"
              optionLabel="name"
              optionValue="type"
              v-model="dataEdit.WPL2.DateAdd"
            />
          </div>
        </div>
        <div class="col-5 flex align-items-end">
          <div class="field">
            <label> Bắt đầu từ</label>
            <Dropdown
              placeholder="Chọn"
              :options="[
                {
                  type: 1,
                  name: 'Đầu tháng',
                },
                {
                  type: 2,
                  name: 'Giữa tháng',
                },
                {
                  type: 3,
                  name: 'Cuối tháng',
                },
              ]"
              optionLabel="name"
              optionValue="type"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.StartTime }"
              v-model="dataEdit.WPL2.StartTime"
            />
          </div>
          <div class="field ml-4">
            <InputNumber
              placeholder="Nhập tháng"
              v-model="dataEdit.WPL2.Month"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Month }"
            />
          </div>
          <div class="field ml-4">
            <InputNumber
              placeholder="Nhập ngày"
              v-model="dataEdit.WPL2.Day"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.Day }"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="field">
            <label>Số ngày cho phép chênh lệch</label>
            <InputNumber
              v-model="dataEdit.WPL2.NumOfDaysDiff"
              :class="{ 'p-invalid': submitted && !dataEdit.WPL2.NumOfDaysDiff }"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card" v-if="dataEdit.dialogtype == 6">
      <DataTable :value="dataEdit.CMA5" tableStyle="min-width: 50rem">
        <Column header="Tên tài liệu" field="Name" headerStyle="width:50%"></Column>
        <Column header="Tệp đính kèm" headerStyle="width:40%">
          <template #body="slotProps">
            <a
              :href="slotProps.data.file ? slotProps.data.file.name : slotProps.data.Link"
              target="_blank"
              >{{
                slotProps.data.file
                  ? slotProps.data.file.name
                  : slotProps.data.PathName
                  ? slotProps.data.PathName
                  : ""
              }}</a
            >
          </template>
        </Column>
        <Column header="Hành động" headerStyle="width:8rem" headerClass="text-left">
          <template #body="slotProps">
            <div v-if="slotProps.data.file">
              <Button
                v-if="slotProps.data.file"
                icon="pi pi-times"
                class="text-left"
                text
                @click="delete slotProps.data.file"
              />
            </div>
            <Button
              v-else
              icon="pi pi-upload"
              class="text-left"
              text
              @click="chooseFile(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <template #footer>
      <!-- <Button label="Log" outlined @click="Log()" /> -->
      <Button label="Huỷ" icon="pi pi-times" outlined @click="dialog01 = false" />
      <Button label="Lưu" icon="pi pi-check" @click="dialog01 = false" />
    </template>
  </Dialog>
  <!-- End hôp thoại CRUD -->
  <!-- Start dialog xoa -->
  <Dialog
    v-model:visible="dialogwithdrawal"
    :style="{ width: '550px' }"
    header="Xác Nhận"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span
        >Bạn chắc chắn muốn rút gói thầu <b>{{ dataEdit.CmaName }}</b> ?</span
      >
    </div>
    <template #footer>
      <Button label="Hủy" icon="pi pi-times" @click="hideDelete()" outlined />
      <Button
        label="Rút thầu"
        severity="danger"
        icon="pi pi-check"
        :loading="loadAction"
        @click="withdrawalconfirmation()"
      />
    </template>
  </Dialog>
  <!-- End xoa -->
  <input type="file" ref="file_input" class="hidden" @change="onSelectFiles($event)" />
  <Toast position="bottom-right" group="br" />
</template>
<style scoped>
:root {
  --surface-hover: #f6f9fc;
  --boder-color: #d1d4db;
}

.btn-icon{
  border: 1px solid #494f59;
  padding: 0.35rem;
  margin: 0 0.3rem;
  border-radius: 6px;
}

ol.guild-ol{
  list-style-position: outside;
  list-style: decimal;
  margin: 1.75rem auto;
}

.guild-ol li {
  line-height: 30px;
  margin-bottom: 1rem;
  padding-left: 3px;
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
.arrow-right {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
}
.arrow-left {
  width: 0;
  height: 0;
  border-top: 30px solid transparent;
  border-bottom: 30px solid transparent;
  border-left: 15px solid #f9fafb;
}
.right-1 {
  width: 100%;
  height: 60px;
}
.surface-right {
  border-left: 15px solid #d1d5db;
}
.primary-right {
  border-left: 15px solid #0773bb;
}
</style>
<script setup>
import { onBeforeMount, ref, computed, watchEffect } from "vue";
import API from "../../apis/api";
import ERROR from "../../services/StatusCode.json";
import CRUD from "../../services/dataCRUD";
import { format } from "date-fns";

// ---------------------- FIX TUẤN ----------------------------
const onChangeYCTU = (event) => {
  // console.log(event);
  dataEdit.value.WPL2.NumAdvReq = null;
}
// ---------------------- FIX TUẤN ----------------------------

// Api ---------------------------
// const api_add = "oofb/create";
const api_update = "ocma/supplier/item";
const api_get = "ocma/supplier/getall";
// const api_delete = "oofb/delete";
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
const header_update = ref("SỬA HÌNH THỨC ĐẤU THẦU");
const header_new = ref("THÊM MỚI HÌNH THỨC ĐẤU THẦU");
const validImageTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/avif",
  "image/webp",
];
const dataFiles = ref([]);
const iconType = (fileType) => {
  switch (fileType) {
    case "xls/xlsx":
      return "pi pi-file-excel";
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "pi pi-file-excel";
    case "application/pdf":
      return "pi pi-file-pdf";
    case "application/msword":
      return "pi pi-file-word";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "pi pi-file-word";
    default:
      return "pi pi-file";
  }
};
const dialog01 = ref(false);
const dialogdownload = ref(false);
const dialogwithdrawal = ref(false);
const loadAction = ref(false);
const titleDialog = ref(null);
const dataEdit = ref({});
const submitted = ref(false);

const toast = useToast();
const selected_data = ref(null);
const delete_dialog = ref(false);
const expandedRows = ref([]);
const expandedRows2 = ref([]);
const file_input = ref(null);
const formData = new FormData();
const countdownstring = ref(null);
const expiredCheck = ref(false);

const stepData = ref([
  {
    status: "Đang nhận hồ sơ",
    time: convertToCustomFormat(dataEdit.value.StartTime),
  },
  {
    status: "Đang đánh giá",
    time: "00:00:00 00/00/0000",
  },
  {
    status: "Đã có kết quả",
    time: convertToCustomFormat(dataEdit.value.EndTime),
  },
]);

onBeforeMount(() => {
  params.value = {
    page: parseInt(route.query.page) || 1,
    size: 5,
  };
  getData();
});

watchEffect(() => {
  dataEdit.value.ImpProgressClient = "Y";
  dataEdit.value.SumQuotesClient = "Y";
  dataEdit.value.WartyPolicyClient = "Y";
  dataEdit.value.OriginClient = "Y";
  dataEdit.value.TermsOfPayClient = "Y";
  dataEdit.value.OtherClient = "Y";

  if (dataEdit.value.Items) {
    for (let index = 0; index < dataEdit.value.Items.length; index++) {
      const item = dataEdit.value.Items[index];
      console.log(item);
      for (let y = 0; y < item.item.length; y++) {
        const children = item.item[y];
        if (!children.LeadTime) {
          dataEdit.value.ImpProgressClient = "N";
        }
        if (!children.QuanCanBeSupp) {
          dataEdit.value.SumQuotesClient = "N";
        }
        if (!children.Origin) {
          dataEdit.value.OriginClient = "N";
        }
        if (!children.WarrPolicy) {
          dataEdit.value.WartyPolicyClient = "N";
        }
      }
    }
  }

  if (dataEdit.value.WPL2) {
    if (
      dataEdit.value.WPL2.Type === 0 &&
      (!dataEdit.value.WPL2.DateAdd ||
        !dataEdit.value.WPL2.StartTime ||
        !dataEdit.value.WPL2.Month ||
        !dataEdit.value.WPL2.Day ||
        !dataEdit.value.WPL2.NumOfDaysDiff)
    ) {
      dataEdit.value.TermsOfPayClient = "N";
    }
    if (dataEdit.value.WPL2.IsAdvReq && !dataEdit.value.WPL2.NumAdvReq) {
      dataEdit.value.TermsOfPayClient = "N";
    }
  }

  if (dataEdit.value.CMA5) {
    console.log(dataEdit.value.CMA5);
    for (let index = 0; index < dataEdit.value.CMA5.length; index++) {
      const item = dataEdit.value.CMA5[index];
      if (!item.Link)
        if (!item.file) {
          dataEdit.value.OtherClient = "N";
        }
    }
  }
});
// Lấy danh sách ----------------------------------------------------
const getData = (event) => {
  load_data.value = true;
  if (event) params.value.page = event.page + 1;
  if (event) params.value.size = event.rows;
  setTimeout(() => {
    API.get_all_v2(api_get, {
      data: params.value,
    })
      .then((response) => {
        if (response.data) {
          dataTable.value = response.data;
        }
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
const saveData = () => {
  submitted.value = true;
  if (!getError()) {
    loadAction.value = true;
    const apiEndpoint = api_update;
    const apiFunction = API.update_v2;
    apiFunction(convertData(), apiEndpoint)
      .then((response) => {
        const codeErr = response.data.CodeErr;
        if (codeErr) {
          notification("error", ERROR.find((val) => val.code === codeErr)?.mes);
          loadAction.value = false;
        } else {
          notification("success", "Cập nhật thành công");
          getDataWhenAction();
        }
      })
      .catch((error) => {
        notification("error", error);
        resetData();
      });
  }
};

const resetData = () => {
  loadAction.value = false;
  dataEdit.value = {};
  submitted.value = false;
  delete_dialog.value = false;
  dialogwithdrawal.value = false;
  formData.delete("data");
  formData.delete("files");
  formData.delete("files1");
  expiredCheck.value = false;
};

const getError = () => {
  // if (!dataEdit.value.Detail.DiscountRate) {
  //   notification("error", "Vui lòng  nhập tỉ lệ giảm giá");
  //   return true;
  // }
  if (dataEdit.value.ImpProgress == "Y" && dataEdit.value.ImpProgressClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin tiến độ thực hiện");
    return true;
  }

  if (dataEdit.value.SumQuotes == "Y" && dataEdit.value.SumQuotesClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin báo giá");
    return true;
  }
  if (dataEdit.value.WartyPolicy == "Y" && dataEdit.value.WartyPolicyClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin điều khoản thanh toán");
    return true;
  }
  if (dataEdit.value.Origin == "Y" && dataEdit.value.OriginClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin xuất xứ");

    return true;
  }
  if (dataEdit.value.TermsOfPay == "Y" && dataEdit.value.TermsOfPayClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin chính sách bảo hành");
    return true;
  }
  if (dataEdit.value.Other == "Y" && dataEdit.value.OtherClient == "N") {
    notification("error", "Vui lòng  nhập đủ thông tin tài liệu khác");
    return true;
  }

  return false;
};

const convertData = (context) => {
  const data = dataEdit.value.Items;
  const dataSend = [];
  const WPLFile = [];
  if (data.length) {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      for (let i = 0; i < item.item.length; i++) {
        const item2 = item.item[i];
        if (item2.file) WPLFile.push(item2.file);
        dataSend.push(item2);
      }
    }
  }
  const WPL = [];
  const WPL1 = [];
  const WPL3 = [];
  if (dataSend.length)
    for (let index = 0; index < dataSend.length; index++) {
      const item = dataSend[index];
      WPL.push({
        ID: item.IDWPL ? item.IDWPL : 0, // chưa có thì id = 0 (new obj), có id là update
        Cma2ID: item.ID, // ID dòng sản phẩm thầu
        WarrPolicy: item.WarrPolicy, // Bảo hành
        Origin: item.Origin, // Xuất xứ
        Price: item.Price, // Giá
        QuanCanBeSupp: item.QuanCanBeSupp, // Số lượng có thể đám ứng
        IsAddFile: item.file ? true : false, // Có thêm file đính kèm hay không
      });
      WPL1.push({
        ID: item.IDWPL1 ? item.IDWPL1 : 0, // chưa có thì id = 0 (new obj), có id là update
        Cma2ID: item.ID, // ID dòng sản phẩm thầu
        LeadTime: item.LeadTime, // Thời gian giao hàng dự kiến
      });
    }
  if (dataEdit.value.CMA5)
    for (let index = 0; index < dataEdit.value.CMA5.length; index++) {
      const element = dataEdit.value.CMA5[index];
      WPL3.push({
        Cma5ID: element.ID,
      });
      if (element.file != undefined) formData.append("files1", element.file);
    }
  formData.append(
    "data",
    JSON.stringify({
      ID: dataEdit.value.Detail.ID, // ID của cma1
      OcmaID: dataEdit.value.ID, // ID gói thầu
      OcrdID: dataEdit.value.OcrdID, // ID nhà cung cấp
      // DiscountRate: parseInt(dataEdit.value.Detail.DiscountRate), // % giảm giá
      // DiscountRate: 0, // % giảm giá
      WPL: WPL,
      WPL1: WPL1,
      WPL2: dataEdit.value.WPL2,
      WPL3: WPL3,
      Status: context ? "O" : "S",
    })
  );
  if (WPLFile.length) {
    for (let index = 0; index < WPLFile.length; index++) {
      formData.append("files", WPLFile[index]);
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

const getCMA = async (id) => {
  resetData();
  await API.get_all("ocma/getbyid/supplier?id=" + id).then((res) => {
    dataEdit.value = res.data;
    let WPL = res.data.Detail.WPL ? res.data.Detail.WPL : [];
    let WPL1 = res.data.Detail.WPL1 ? res.data.Detail.WPL1 : [];
    let WPL2 = res.data.Detail.WPL2
      ? res.data.Detail.WPL2
      : {
          ID: 0, // chưa có thì id = 0 (new obj), có id là update
          IsAdvReq: null, // Có tạm ứng không
          NumAdvReq: null, // Phần tram tạm ứng
          Type: null, // Loại điều khoản thanh toán
          DateAdd: null, // Ngành thanh toán dựa trên
          StartTime: null, // Bắt đầu từ
          Month: null, // Tháng
          Day: null, // Ngày
          NumOfDaysDiff: null, // Số ngành chênh lệch cho phép
        };
        if(WPL2.ID === 0){
          WPL2.NumAdvReq = null;
          WPL2.Month = null;
          WPL2.Day = null;
        }
    let WPL3 = res.data.Detail.WPL3 ? res.data.Detail.WPL3 : [];
    let Items = [];
    if (res.data.CMA7 != null)
      for (let index = 0; index < res.data.CMA7.length; index++) {
        const item = res.data.CMA7[index];
        if (item.ListItem.length)
          for (let y = 0; y < item.ListItem.length; y++) {
            const item2 = item.ListItem[y];
            Items.push(item2);
          }
      }
    // Duyệt qua với WPL [Báo giá sản phẩm/Dịch vụ]
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      const ID = item.ID;
      if (WPL.length) {
        const check = WPL.filter((val) => {
          return val.Cma2ID === ID;
        });
        if (check.length) {
          item.IDWPL = check[0].ID;
          item.WarrPolicy = check[0].WarrPolicy;
          item.Price = check[0].Price;
          item.QuanCanBeSupp = check[0].QuanCanBeSupp;
          item.LinkDocument = check[0].LinkDocument;
          item.IsAddFile = check[0].IsAddFile;
          item.Origin = check[0].Origin;
          item.WartyPolicyID = check[0].WartyPolicyID;
          item.OriginID = check[0].OriginID;
        } else {
          item.IDWPL = 0;
          item.WarrPolicy = null;
          item.Price = null;
          item.QuanCanBeSupp = null;
          item.LinkDocument = null;
          item.IsAddFile = null;
          item.Origin = null;
          item.WartyPolicyID = null;
          item.OriginID = null;
        }
      } else {
        item.IDWPL = 0;
        item.WarrPolicy = null;
        item.Price = null;
        item.QuanCanBeSupp = null;
        item.LinkDocument = null;
        item.IsAddFile = null;
        item.Origin = null;
        item.WartyPolicyID = null;
        item.OriginID = null;
      }
    }

    // Duyệt qua với WPL1 [Tiến độ thực hiện hợp đồng]
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      const ID = item.ID;
      if (WPL1.length) {
        const check = WPL1.filter((val) => {
          return val.Cma2ID === ID;
        });

        if (check.length) {
          item.IDWPL1 = check[0].ID;
          item.LeadTime = check[0].LeadTime;
        } else {
          item.IDWPL1 = 0;
          item.LeadTime = null;
        }
      } else {
        item.IDWPL1 = 0;
        item.LeadTime = null;
      }
    }
    // Nhóm hàng hoá
    for (let index = 0; index < Items.length; index++) {
      const item = Items[index];
      if (index == 0) {
        dataEdit.value.Items = [
          {
            itemName: item.Oitm.ItemName,
            uomName: item.UomName,
            quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            Iditem: item.OitmID,
            item: [item],
          },
        ];
      } else {
        const data = dataEdit.value.Items.filter((val) => {
          return val.Iditem == item.OitmID && val.uomName == item.UomName;
        });
        if (data.length) {
          data[0].quantity += item.Quantity;
          data[0].UnitPrice += item.UnitPrice;
          data[0].item.push(item);
        } else {
          dataEdit.value.Items.push({
            itemName: item.Oitm.ItemName,
            uomName: item.UomName,
            quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
            Iditem: item.OitmID,
            item: [item],
          });
        }
      }
    }

    // Duyệt CMA5
    if (res.data.CMA5)
      for (let index = 0; index < res.data.CMA5.length; index++) {
        const element = res.data.CMA5[index];
        if (res.data.Detail.WPL3) {
          const data = res.data.Detail.WPL3.filter((val) => {
            return val.Cma5ID == element.ID;
          });
          if (data.length) {
            element.Link = data[0].Link;
          }
        }
      }
    dataEdit.value.WPL2 = WPL2;
    coutDown();
    var ngay = new Date(dataEdit.value.EndTime);
    // Số ngày bạn muốn cộng
    var soNgay = 1;
    // Cộng số ngày vào ngày ban đầu
    ngay.setDate(ngay.getDate() + soNgay);
    // In ra ngày mới
    stepData.value = [
      {
        status: "Đang nhận hồ sơ",
        time: convertToCustomFormat(dataEdit.value.StartTime),
        classbox:
          new Date(dataEdit.value.StartTime) <= new Date() ? "bg-primary" : "surface-300",
        classarrow:
          new Date(dataEdit.value.StartTime) <= new Date()
            ? "primary-right"
            : "surface-right",
      },
      {
        status: "Đang đánh giá",
        time:
          new Date(dataEdit.value.EndTime) <= new Date()
            ? convertToCustomFormat(ngay)
            : "00:00: dd/MM/yyyy",
        classbox:
          new Date(dataEdit.value.EndTime) <= new Date() ? "bg-primary" : "surface-300",
        classarrow:
          new Date(dataEdit.value.EndTime) <= new Date()
            ? "primary-right"
            : "surface-right",
      },
      {
        status: "Đã có kết quả",
        time:
          dataEdit.value.Status == "A"
            ? convertToCustomFormat(dataEdit.value.UpdatedAt)
            : "00:00 dd/MM/yyyy",
        classbox: dataEdit.value.Status == "A" ? "bg-primary" : "surface-300",
        classarrow: dataEdit.value.Status == "A" ? "primary-right" : "surface-right",
      },
    ];
  });
};

const NumberFormat = (number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

const SubmitBid = () => {
  API.get_all("ocrd/me").then((res) => {
    dataEdit.value.indexTab = 0;
    dataEdit.value.ocrd = res.data;
    dataEdit.value.ocrd.CRD7.push({ Name: "Khác", ID: 0 });
    dataEdit.value.submitBid = true;
  });
};

const getTotal = computed(() => {
  let total = 0;
  if (dataEdit.value.Items) {
    for (let i = 0; i < dataEdit.value.Items.length; i++) {
      const item = dataEdit.value.Items[i];
      total += item.UnitPrice;
    }
  }
  return total;
});

const Update = (type) => {
  dataEdit.value.dialogtype = type;
  if (type == 1) dataEdit.value.dialogheader = "Tiến độ thực hiện";
  if (type == 2) dataEdit.value.dialogheader = "Tổng hợp báo giá";
  if (type == 3) dataEdit.value.dialogheader = "Điều khoản thanh toán";
  if (type == 4) dataEdit.value.dialogheader = "Chính sách bảo hành";
  if (type == 5) dataEdit.value.dialogheader = "Xuất xứ";
  if (type == 6) dataEdit.value.dialogheader = "Tài liệu khác";
  getWartyPolicy();
  dialog01.value = true;
};

const chooseFile = (data) => {
  file_input.value.click();
  dataEdit.value.DatachooseFile = data;
};

const onSelectFiles = (e) => {
  dataEdit.value.DatachooseFile.file = e.target.files[0];
  e.target.value = null;
};

const getWartyPolicy = () => {
  API.get_all("oscw/getbyid?id=1").then((res) => {
    dataEdit.value.dataWartyPolicy = res.data.SCW1;
  });
  API.get_all("oscw/getbyid?id=2").then((res) => {
    dataEdit.value.dataOrigin = res.data.SCW1;
  });
};
const Log = () => {};

const coutDown = () => {
  var x = setInterval(function () {
    if (dataEdit.value.EndTime) {
      var now = new Date().getTime();
      var countDownDate = new Date(dataEdit.value.EndTime).getTime();
      var distance = countDownDate - now;
      // Calculate days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownstring.value =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }

    if (distance < 0) {
      clearInterval(x);
      expiredCheck.value = true;
      countdownstring.value = "Đã quá hạn";
    }
    if (!dataEdit.value.EndTime) clearInterval(x);
  }, 1000);
};

const withdrawal = () => {
  dialogwithdrawal.value = true;
};

const hideDelete = () => {
  dialogwithdrawal.value = false;
  // dataEdit.value = {};
};

const withdrawalconfirmation = () => {
  loadAction.value = true;
  const apiEndpoint = api_update;
  const apiFunction = API.update_v2;
  apiFunction(convertData(true), apiEndpoint)
    .then((response) => {
      const codeErr = response.data.CodeErr;
      if (codeErr) {
        notification("error", ERROR.find((val) => val.code === codeErr)?.mes);
        loadAction.value = false;
      } else {
        notification("success", "Cập nhật thành công");
        getDataWhenAction();
      }
    })
    .catch((error) => {
      notification("error", error);
      resetData();
    });
};

function convertToCustomFormat(inputTime) {
  // Parse the input time
  var parsedTime = new Date(inputTime);

  // Extract hours, minutes, day, month, and year
  var hours = parsedTime.getHours();
  var minutes = parsedTime.getMinutes();
  var day = parsedTime.getDate();
  var month = parsedTime.getMonth() + 1; // Month starts from 0
  var year = parsedTime.getFullYear();

  // Format hours and minutes with leading zeroes if necessary
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;

  // Format day, month, and year with leading zeroes if necessary
  day = (day < 10 ? "0" : "") + day;
  month = (month < 10 ? "0" : "") + month;

  // Return the formatted string
  return hours + ":" + minutes + " " + day + "/" + month + "/" + year;
}
</script>
