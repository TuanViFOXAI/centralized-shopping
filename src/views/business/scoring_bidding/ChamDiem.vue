<template>
    <template v-if="!loading1 && !false">
        <template v-if="error">
            <Authorization :title="error.title" :code="error.code" :message="error.message" :time="error.time" />
        </template>
        <template v-else>
            <div class="px-3">
                <div class="flex justify-between align-items-center m-3">
                    <h5 class="p-title mb-0 mt-0 font-bold">CHẤM ĐIỂM GÓI THẦU</h5>
                    <!-- to="/scoring-list" -->
                    <!-- <router-link > -->
                        <Button @click="backHis" icon="pi pi-times" label="Đóng" outlined></Button>
                    <!-- </router-link> -->
                </div>
                <div class="card border-radius-none p-2">
                    <div class="flex">
                        <div class="col-4 p-0">
                            <div class="flex justify-between" :class="{ active: timeChecker(modelState.CreatedAt) }">
                                <div class="content py-2 flex flex-column gap-2 justify-center">
                                    <div class="font-bold">Thời gian mở thầu</div>
                                    <div>{{ getTimeLabel(modelState.CreatedAt, 'time') }}</div>
                                </div>
                                <div class="head"></div>
                            </div>
                        </div>
                        <div class="col-4 p-0">
                            <div class="flex justify-between" :class="{ active: timeChecker(modelState.EndTime) }">
                                <div class="tail"></div>
                                <div class="content py-2 flex flex-column gap-2 justify-center">
                                    <div class="font-bold">Thời gian đóng thầu - chấm điểm</div>
                                    <div>{{ getTimeLabel(modelState.EndTime, 'time') }}</div>
                                </div>
                                <div class="head"></div>
                            </div>
                        </div>
                        <div class="col-4 p-0">
                            <div class="flex justify-between"
                                :class="{ active: timeChecker(modelState.ResultReleaseTime) }">
                                <div class="tail"></div>
                                <div class="content py-2 flex flex-column gap-2 justify-center">
                                    <div class="font-bold">Thời gian công bố dự kiến</div>
                                    <div>{{ getTimeLabel(modelState.ResultReleaseTime, 'time') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loading1" class="card border-radius-none">

                </div>
                <div v-else class="card border-radius-none">
                    <div class="grid">
                        <div class="col-12 grid m-0 p-0">
                            <div class="col-6 grid m-0">
                                <div class="col-4 font-bold">Gói thầu:</div>
                                <h5 class="col-8 p-title font-semibold m-0">{{ modelState.CmaName }}</h5>

                                <div class="col-4 font-bold">Số lượng hồ sơ:</div>
                                <div class="col-8">{{ `${soLuongNCCDaNopHoSo}/${modelState.CMA1.length}` }} (đã nộp)</div>

                                <div class="col-4 font-bold">Trạng thái chấm điểm:</div>
                                <div class="col-8">{{ modelState.IsSeflPoint === 'A' ? 'Đã chấm điểm' : 'Chưa chấm điểm'
                                    }}
                                </div>

                                <div class="col-4 font-bold">Trạng thái gói thầu:</div>
                                <div class="col-8">{{ getStatusLabel(modelState.Status) }}</div>


                            </div>
                            <div class="col-6 grid m-0">
                                <div class="col-5 font-bold">Mã gói thầu:</div>
                                <div class="col-7 ">{{ modelState.CmaCode }}</div>

                                <div class="col-5 font-bold">Ngày chấm:</div>
                                <div class="col-7">{{ '-' }}</div>

                                <div class="col-5 font-bold">Người chấm:</div>
                                <div class="col-7">-</div>

                                <div class="col-5 font-bold">&nbsp;</div>
                                <div class="col-7"></div>

                            </div>
                        </div>
                        <div class="col-12 grid m-0">
                            <div class="col-6">
                                <div class="flex flex-column field">
                                    <label class="font-bold" for="">Trọng số giữa các tiêu chí:</label>
                                    <Dropdown v-model="modelState.OswID" :options="Oosw_DATA" optionLabel="SwName"
                                        :class="{'p-invalid': errorMessage.t1 && modelState.OswID === 0}"
                                        optionValue="ID" placeholder="Chọn trọng số chấm điểm">
                                        <template #option="slotProps">
                                            <div class="font-semibold">{{ slotProps.option.SwName }} <span v-if="slotProps.option.SwDesc" class="font-normal">({{ slotProps.option.SwDesc }})</span></div>
                                            <div class="flex gap-2 font-light">
                                                <div class="item">Tiến độ thực hiện: {{ slotProps.option.Score1 }},</div>
                                                <div class="item">Điều khoản thanh toán: {{ slotProps.option.Score2 }},</div>
                                                <div class="item">Xuất xứ: {{ slotProps.option.Score6 }},</div>
                                                <div class="item">Chính sách bảo hành: {{ slotProps.option.Score4 }},</div>
                                                <div class="item">Báo giá: {{ slotProps.option.Score7 }}</div>
                                            </div>
                                        </template>
                                    </Dropdown>
                                    <small v-if="errorMessage.t1 && modelState.OswID === 0" class="p-error">{{ errorMessage.t1 }}</small>
                                </div>
                            </div>
                            <div class="col-3" v-if="tabToShow['Other'] === 'Y'">
                                <div class="flex flex-column field">
                                    <label class="font-bold" for="">Trọng số tiêu chí khác:</label>
                                    <InputNumber :max="100" :min="0" v-model="modelState.TrongSoKhac"
                                        :class="{'p-invalid': errorMessage.t2 && !modelState.TrongSoKhac}"
                                        placeholder="Nhập trọng số (0 - 100)">
                                    </InputNumber>
                                    <small v-if="errorMessage.t2 && !modelState.TrongSoKhac" class="p-error">{{ errorMessage.t2 }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="loading1" class="card border-radius-none p-0">
                    Loading
                </div>
                <div v-else class="card border-radius-none p-0">
                    <TabView v-model:activeIndex="activeIndex" :scrollable="true">
                        <TabPanel v-if="tabToShow['ImpProgress'] === 'Y'" header="Tiến độ thực hiện">
                            <DataTable showGridlines="" class="card border-radius-none p-0"
                                v-model:expandedRows="expandedTienDoRows" :rowClass="rowClass" :value="dtTDTHModel"
                                :pt="ptTable1">
                                <Column expander style="width: 3rem" />
                                <Column header="#" style="width: 3rem;">
                                    <template #body="sp">
                                        {{ ++sp.index }}
                                    </template>
                                </Column>
                                <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
                                </Column> -->
                                <Column field="item_name" header="Tên vật tư, hàng hoá">
                                </Column>
                                <Column field="item_time_required" header="Ngày cần hàng" style="width: 10rem;">
                                </Column>
                                <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right;">
                                </Column>
                                <Column field="item_unit" header="Đơn vị tính" style="width: 10rem;">
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                        <Column field="sup_name" header="Tên nhà cung cấp">
                                        </Column>
                                        <Column field="delivery_time" style="width: 13rem;text-align: center;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Thời gian giao hàng</div>
                                                    <div class="font-light">(so với ngày cần hàng)</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="auto_score" style="width: 13rem; text-align: center;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Điểm tham khảo</div>
                                                    <div class="font-light">(hệ thống tính tự động)</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column style="width: 13rem;">
                                            <template #header>
                                                <div class="text-center w-full">
                                                    Điểm đánh giá
                                                </div>
                                            </template>
                                            <template #body="s_sp">
                                                <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2"
                                                    v-model="s_sp.data.user_score" :min="0" :max="10">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus" />
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus" />
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>

                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel v-if="tabToShow['TermsOfPay'] === 'Y'" header="Điều khoản thanh toán">
                            <DataTable showGridlines="" class="card border-radius-none p-0"
                                v-model:expandedRows="expandedDieuKhoanTTRows" :rowClass="rowClass" :value="dtDKTTModel"
                                :pt="ptTable2">
                                <Column expander style="width: 3rem">
                                </Column>
                                <Column field="Ocrd.CardName" header="Tên nhà cung cấp" style="border-left: 0;">
                                </Column>
                                <Column style="width: 20rem;">
                                    <template #header>
                                        <div class="text-center w-full">
                                            Thông tin
                                        </div>
                                    </template>
                                </Column>
                                <Column style="width: 13rem;">
                                    <template #header>
                                        <div class="flex flex-column align-items-center w-full">
                                            <div>Điểm tham khảo</div>
                                            <div class="font-light">(hệ thống tính tự động)</div>
                                        </div>
                                    </template>
                                </Column>
                                <Column style="width: 13rem;">
                                    <template #header>
                                        <div class="text-center w-full">
                                            Điểm đánh giá
                                        </div>
                                    </template>
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" showGridlines :value="sp.data.expandRow" :pt="ptTable2_1">
                                        <Column style="width: 3rem; padding: 1rem;">
                                            <template #body>
                                                <div style="display: block;width: 28px;">

                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="title" header="1">
                                        </Column>
                                        <Column header="2" style="width: 20rem;">
                                            <template #body="slotP">
                                                {{ slotP.data.info }}
                                                <!-- <Button label="chi tiết" @click="openInfoDKTT(slotP.data.data, $event)" v-if="slotP.data.id === 2" rounded :pt="ptInfoBtn" text severity="info" style="height: 16px !important;padding: 4px;text-align: center"></Button> -->
                                                <span @click="openInfoDKTT(slotP.data.data, $event)"
                                                    class="text-primary cursor-pointer h-font-bold"
                                                    v-if="slotP.data.id === 2">Chi tiết <i
                                                        class="pi pi-info-circle"></i></span>
                                                <OverlayPanel ref="opInfoDKTT">
                                                    <div class="grid w-30rem">
                                                        <div class="col-6 font-bold">Yêu cầu tạm ứng:</div>
                                                        <div class="col-6">{{ dataToView.IsAdvReq ? `Tạm ứng
                                                            ${dataToView.NumAdvReq}%` : 'Không' }}</div>
                                                        <div class="col-6 font-bold">Ngày thanh toán dựa trên: </div>
                                                        <div class="col-6">{{ dataToView.DateAdd === 1 ? `Ngày hoá đơn
                                                            (${dataToView.Month} tháng + ${dataToView.Day} ngày)` :
                                                            `Ngày giao hàng (${dataToView.Month} tháng +
                                                            ${dataToView.Day} ngày)` }}</div>
                                                        <div class="col-6 font-bold">Số ngày chênh lệch:</div>
                                                        <div class="col-6">{{ `${dataToView.NumOfDaysDiff} ngày` }}
                                                        </div>
                                                    </div>
                                                </OverlayPanel>
                                            </template>
                                        </Column>
                                        <Column field="auto_score" header="3" style="width: 13rem; text-align: center;">
                                        </Column>
                                        <Column header="user_score"
                                            style="max-width: 13rem;width: 13rem; text-align: center;">
                                            <template #body="sp">
                                                <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2"
                                                    v-model="sp.data.user_score" :min="0" :max="10">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus"></span>
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus"></span>
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel v-if="tabToShow['Origin'] === 'Y'" header="Xuất xứ">
                            <DataTable showGridlines class="card border-radius-none p-0"
                                v-model:expandedRows="expandedXuatXuRows" :rowClass="rowClass" :value="dtXuatXuModel"
                                :pt="ptTable1">
                                <Column expander style="width: 3rem" />
                                <Column header="#" style="width: 3rem;">
                                    <template #body="sp">
                                        {{ ++sp.index }}
                                    </template>
                                </Column>
                                <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
              </Column> -->
                                <Column field="item_name" header="Tên sản phẩm">
                                </Column>
                                <Column field="item_quantity" header="Số lượng" style="width: 7rem;text-align: right;">
                                </Column>
                                <Column field="item_unit" header="Đơn vị tính" style="width: 10rem;">
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                        <Column field="sup_name" header="Tên nhà cung cấp">
                                        </Column>
                                        <Column field="origin" style="width: 13rem;">
                                            <template #header>
                                                <div class="flex flex-column align-items-left w-full">
                                                    <div>Xuất xứ</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="auto_score" style="width: 13rem; text-align: center;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Điểm tham khảo</div>
                                                    <div class="font-light">(hệ thống tính tự động)</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column style="width: 13rem;">
                                            <template #header>
                                                <div class="text-center w-full">
                                                    Điểm đánh giá
                                                </div>
                                            </template>
                                            <template #body="s_sp">
                                                <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2"
                                                    v-model="s_sp.data.user_score" :min="0" :max="10">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus" />
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus" />
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel v-if="tabToShow['WartyPolicy'] === 'Y'" header="Chính sách bảo hành">
                            <DataTable showGridlines class="card border-radius-none p-0"
                                v-model:expandedRows="expandedCSBHRows" :rowClass="rowClass" :value="dtCSBHModel"
                                :pt="ptTable1">
                                <Column expander style="width: 3rem" />
                                <Column header="#" style="width: 3rem;">
                                    <template #body="sp">
                                        {{ ++sp.index }}
                                    </template>
                                </Column>
                                <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
              </Column> -->
                                <Column field="item_name" header="Tên sản phẩm">
                                </Column>
                                <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right;">
                                </Column>
                                <Column field="item_unit" header="Đơn vị tính" style="width: 10rem;">
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                        <Column field="sup_name" header="Tên nhà cung cấp">
                                        </Column>
                                        <Column field="warranty_policy" style="width: 13rem;">
                                            <template #header>
                                                <div class="flex flex-column align-items-left w-full">
                                                    <div>Thông tin</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="auto_score" style="width: 13rem; text-align: center;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Điểm tham khảo</div>
                                                    <div class="font-light">(hệ thống tính tự động)</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column style="width: 13rem;">
                                            <template #header>
                                                <div class="text-center w-full">
                                                    Điểm đánh giá
                                                </div>
                                            </template>
                                            <template #body="s_sp">
                                                <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2"
                                                    v-model="s_sp.data.user_score" :min="0" :max="10">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus" />
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus" />
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel v-if="tabToShow['SumQuotes'] === 'Y'" header="Báo giá">
                            <DataTable showGridlines="" class="card border-radius-none p-0"
                                v-model:expandedRows="expandedBaoGiaRows" :rowClass="rowClass" :value="dtBaoGiaModel"
                                :pt="ptTable1">
                                <Column expander style="width: 3rem" />
                                <Column header="#" style="width: 3rem;">
                                    <template #body="sp">
                                        {{ ++sp.index }}
                                    </template>
                                </Column>
                                <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
              </Column> -->
                                <Column field="item_name" header="Tên sản phẩm">
                                </Column>
                                <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right">
                                </Column>
                                <Column field="item_unit" header="Đơn vị tính" style="width: 10rem;">
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                        <Column field="sup_name" header="Tên nhà cung cấp">
                                        </Column>
                                        <Column field="sup_quantity" style="width: 7rem; text-align: right;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Số lượng</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="sup_price" style="width: 13rem; text-align: right;">
                                            <template #header>
                                                <div class="flex flex-column text-center w-full">
                                                    <div>Báo giá</div>
                                                </div>
                                            </template>
                                            <template #body="sub_sp">
                                                {{ getCurrencyLabel(sub_sp.data.sup_price) }}
                                            </template>
                                        </Column>
                                        <Column field="auto_score" style="width: 13rem; text-align: center;">
                                            <template #header>
                                                <div class="flex flex-column align-items-center w-full">
                                                    <div>Điểm tham khảo</div>
                                                    <div class="font-light">(hệ thống tính tự động)</div>
                                                </div>
                                            </template>
                                        </Column>
                                        <Column style="width: 13rem;">
                                            <template #header>
                                                <div class="text-center w-full">
                                                    Điểm đánh giá
                                                </div>
                                            </template>
                                            <template #body="s_sp">
                                                <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2"
                                                    v-model="s_sp.data.user_score" :min="0" :max="10">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus" />
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus" />
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel v-if="tabToShow['Other'] === 'Y'" header="Tiêu chí khác">
                            <DataTable showGridlines="" class="card border-radius-none p-0"
                                v-model:expandedRows="expandedTieuChiKhacRows" :rowClass="rowClass"
                                :value="dtTieuChiKhacModel" :pt="ptTable2">
                                <Column expander style="width: 3rem">
                                </Column>
                                <Column field="Ocrd.CardName" header="Tên nhà cung cấp" style="border-left: 0;">
                                </Column>
                                <Column style="width: 15rem;">
                                    <template #header>
                                        <div class="text-center w-full">
                                            Tài liệu đính kèm
                                        </div>
                                    </template>
                                </Column>
                                <Column style="width: 13rem;">
                                    <template #header>
                                        <div class="text-center w-full">
                                            Điểm đánh giá
                                        </div>
                                    </template>
                                </Column>
                                <template #expansion="sp">
                                    <DataTable size="small" showGridlines :value="sp.data.expandRow" :pt="ptTable2_1">
                                        <Column style="width: 3rem; padding: 1rem;">
                                            <template #body="cc">
                                                <div style="display: block;width: 28px;">
                                                    {{ ++cc.index }}
                                                </div>
                                            </template>
                                        </Column>
                                        <Column field="doc_name" header="1">
                                        </Column>
                                        <Column header="2" style="width: 15rem; text-align: center">
                                            <template #body="slotP">
                                                <a target="_blank" :href="slotP.data.doc">Mở liên kết <i
                                                        class="pi pi-external-link"></i></a>
                                            </template>
                                        </Column>
                                        <Column header="user_score"
                                            style="max-width: 13rem;width: 13rem; text-align: center;">
                                            <template #body="spz">
                                                <InputNumber :max="10" :min="0" showButtons :pt="ptInputNumber"
                                                    :minFractionDigits="2" v-model="spz.data.user_score">
                                                    <template #incrementbuttonicon>
                                                        <span class="pi pi-plus" />
                                                    </template>
                                                    <template #decrementbuttonicon>
                                                        <span class="pi pi-minus" />
                                                    </template>
                                                </InputNumber>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Kết quả chấm điểm" :disabled="!isFinish" :pt="ptResult">
                            <DataTable v-model:expandedRows="expandedTongDiemRows" :value="danhSachDiem" showGridlines>
                                <Column expander style="width: 5rem" />
                                <!-- <Column field="CMA2_ID" header="CMA2_ID" /> -->
                                <Column field="ProductName" header="Vật tư hàng hoá"></Column>
                                <Column header="Ngày cần hàng" style="width: 15%; text-align: center;">
                                    <template #body="sp">
                                    {{ getTimeLabel(sp.data.TimeRequrement) }}
                                    </template>
                                </Column>
                                <Column field="Quantity" header="Số lượng" style="width: 10%; text-align: center;"></Column>
                                <Column field="Unit" header="Đơn vị tính" style="width: 10%; text-align: center;"></Column>
                                <template #expansion="slotProps">
                                    <DataTable :rowStyle="rs1" :value="slotProps.data.Suppliers" scrollable scrollHeight="50rem">
                                        <!-- <Column field="CMA1_ID" header="CMA1"></Column> -->
                                        <!-- <Column field="IsSubmit" header="Nộp thầu ?" /> -->
                                        <Column field="Name" header="Nhà cung cấp"></Column>
                                        <Column field="TDTH" header="Tiến độ thực hiện" style="width: 10%; text-align: center;"></Column>
                                        <Column field="DKTT" header="Điều khoản thanh toán" style="width: 10%; text-align: center;"></Column>
                                        <Column v-if="tabToShow['Origin'] === 'Y'" field="XX" header="Xuất xứ" style="width: 10%; text-align: center;"></Column>
                                        <Column v-if="tabToShow['WartyPolicy'] === 'Y'" field="CSBH" header="Chính sách bảo hành" style="width: 10%; text-align: center;"></Column>
                                        <Column field="BG" header="Báo giá" style="width: 10%; text-align: center;"></Column>
                                        <Column v-if="tabToShow['Other'] === 'Y'" field="Khac" header="Tiêu chí khác" style="width: 10%; text-align: center;"></Column>
                                        <Column field="TongDiem" header="Tổng điểm" style="width: 10%; text-align: center;"></Column>
                                    </DataTable>
                                </template>
                            </DataTable>
                        </TabPanel>
                    </TabView>
                    <div v-if="activeIndex < tabCount" class="p-3 pt-0 flex justify-between gap-3">
                        <Button icon="pi pi-angle-left" :disabled="activeIndex <= 0" label="Quay lại" outlined @click="PrevTab"></Button>
                        <div class="flex gap-3">
                            <Button label="Lưu nháp" severity="help" outlined @click="() => { }"></Button>
                            <Button icon="pi pi-angle-right" v-if="activeIndex < tabCount - 1" label="Tiếp tục" @click="nextTab"></Button>
                            <Button :loading="loading2" v-else label="Hoàn tất"
                                :disabled="modelState.Status !== 'I'"
                                severity="help" @click="onSaveMark"></Button>
                        </div>
                    </div>
                    <div v-else class="p-3 pt-0 flex justify-between gap-3">
                        <div class="flex gap-3">
                            <Button icon="pi pi-angle-left" label="Quay lại" outlined @click="PrevTab"></Button>
                        </div>
                        <div class="flex gap-3">
                            <Button icon="pi pi-undo" label="Chấm lại" severity="secondary" @click="reMark"></Button>
                            <router-link v-if="modelState.Status !== 'L'" :to="'/scoring-list/award/'+modelState.ID">
                                <Button :disabled="modelState.Status == 'L'" icon="pi pi-forward" label="Chọn nhà thầu"></Button>
                            </router-link>
                            <router-link :to="'/scoring-list/'+modelState.ID">
                                <Button severity="secondary" v-if="modelState.Status == 'L'" icon="pi pi-info-circle" label="Xem kết quả"></Button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </template>
    <!-- Loading page -->
    <template v-else>
        <div class="px-3">
            <div class="flex justify-between align-items-center m-3">
                <h5 class="p-title mb-0 mt-0 font-bold">CHẤM ĐIỂM GÓI THẦU</h5>
                <router-link to="/scoring-list">
                    <Button icon="pi pi-times" label="Đóng" outlined></Button>
                </router-link>
            </div>
            <div class="card border-radius-none p-2">
                <div class="flex">
                    <div class="col-4 p-0">
                        <div class="flex justify-between">
                            <div class="content py-2 flex flex-column gap-2 justify-center">
                            </div>
                            <div class="head"></div>
                        </div>
                    </div>
                    <div class="col-4 p-0">
                        <div class="flex justify-between">
                            <div class="tail"></div>
                            <div class="content py-2 flex flex-column gap-2 justify-center">
                            </div>
                            <div class="head"></div>
                        </div>
                    </div>
                    <div class="col-4 p-0">
                        <div class="flex justify-between">
                            <div class="tail"></div>
                            <div class="content py-2 flex flex-column gap-2 justify-center">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card border-radius-none">
                <Skeleton class="mb-3" height="2rem" width="30rem"></Skeleton>
                <div class="grid">
                    <div class="col-6">
                        <Skeleton height="1.5rem" width="22rem"></Skeleton>
                    </div>
                    <div class="col-6">
                        <Skeleton height="1.5rem" width="20rem"></Skeleton>
                    </div>
                    <div class="col-6">
                        <Skeleton height="1.5rem" width="20rem"></Skeleton>
                    </div>
                    <div class="col-6">
                        <Skeleton height="1.5rem" width="15rem"></Skeleton>
                    </div>
                    <div class="col-6">
                        <Skeleton height="1.5rem" width="23rem"></Skeleton>
                    </div>

                </div>
            </div>
            <div class="card border-radius-none p-0">
                <div class="card m-0 flex border-radius-none p-0 border-t-0 border-l-0 border-r-0">
                    <div class="card m-0 w-fit border-radius-none border-r p-3">
                        <Skeleton height="2rem" width="7rem"></Skeleton>
                    </div>
                    <div class="card m-0 w-fit border-radius-none border-r p-3">
                        <Skeleton height="2rem" width="7rem"></Skeleton>
                    </div>
                    <div class="card m-0 w-fit border-radius-none border-r p-3">
                        <Skeleton height="2rem" width="7rem"></Skeleton>
                    </div>
                </div>
                <div class="p-3">
                    <div class="card border-radius-none p-3">
                        <Skeleton height="20rem"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import API from '../../../apis/api';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import Authorization from '../../../components/Authorization.vue'

const toast = useToast();
const router = useRouter();
const route = useRoute();

const loading1 = ref(false);

const state = {
    OswID: null,
    TrongSoKhac: null,
    CreatedAt: null,
    EndTime: null,
    ResultReleaseTime: null,
    CMA1: []
}
const modelState = reactive({ ...state });

// ------------- Methods ---------------

const reMark = () => {
    activeIndex.value = 0;
}

const loading2 = ref(false);

const danhSachDiem = ref([]);

const onSaveMark = async () => {
    if(soLuongNCCDaNopHoSo.value < 3){
        showToast('error', 'Cảnh báo', 'Số lượng nhà cung cấp chưa đủ, phải có ít nhất 3 nhà cung cấp để chấm điểm');
        return;
    }
    if (validate()) {
        try {
            const bodyData = [];
            for (const ncc of modelState.CMA1.filter(x => x.Status && x.Status === 'S')) {
                var obj = {
                    ID: ncc.ID, //CMA1 id - Nhà cung cấp
                    OswID: modelState.OswID,
                    // name: ncc.Ocrd.CardName,
                    OtherScoreCoe: modelState.TrongSoKhac || null,

                    // WPL tổng hợp
                    WPL: getWPL(ncc.ID, ncc.WPL),

                    //Tiến độ thực hiện
                    WPL1: dtTDTHModel._rawValue.map(x => x.suppliers.find(i => i.sup_ID === ncc.ID))
                        .map(z => ({ ID: z.wpl1_id, SelfLeadTimePoint: z.user_score })),

                    //Điều khoản thanh toán
                    WPL2: {
                        ID: dtDKTTModel._rawValue.find(x => x.ID === ncc.ID).wpl2_id,
                        SelfPoint: dtDKTTModel._rawValue.find(x => x.ID === ncc.ID).expandRow[0].user_score,
                        SelfPoint2: dtDKTTModel._rawValue.find(x => x.ID === ncc.ID).expandRow[1].user_score
                    }
                }

                // Tiêu chí khác
                if (tabToShow['Other'] === 'Y')
                    obj['WPL3'] = dtTieuChiKhacModel._rawValue.find(x => x.cma1_id === ncc.ID).expandRow.map(x => ({
                        ID: x.wpl3_id,
                        Point: x.user_score
                    }));
                bodyData.push(obj);
            }


            // Gửi dữ liệu lên server ============================
            loading2.value = true;
            const res = await API.putAsync('ocma/selfpoint',bodyData);
            
            if(res.status === 200){
                
                showToast('success', 'Thành công', 'Chấm điểm thành công');
                const resGoiThau = await API.getAsync("ocma/getbyid", { id: route.params.id });
                if(resGoiThau.status === 200){
                    danhSachDiem.value = tinhDiem(resGoiThau.data);
                    expandedTongDiemRows.value = danhSachDiem.value;
                    isFinish.value = true;
                    activeIndex.value++;
                }
            }
            else{
                showToast('error', 'Lỗi', 'Có lỗi khi chấm gói thầu');
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }
    loading2.value = false;
}
const expandedTongDiemRows = ref();

const filterData = (CMA1, OcmaId, Cma2ID) => {
    return CMA1.find(x => x.OcmaID === OcmaId).WPL.find(y => y.Cma2ID === Cma2ID);
}

const tinhDiem = (data) => {
    const resutl = [];

    data.CMA2.forEach(prdct => {
        let obj = {
            CMA2_ID: prdct.ID,
            OcmaID: prdct.OcmaID,
            ProductName: prdct.Oitm.ItemName,
            Quantity: prdct.Quantity,
            TimeRequrement: prdct.TimeNeeded,
            Unit: prdct.UomName,
            Suppliers: data.CMA1.map(x => {
                let Sup_ID = x.Ocrd.ID;
                let CMA1_ID = x.ID;
                let IsSubmit = x.Status === 'S';
                let Name = x.Ocrd.CardName;
                let TDTH = x.WPL1.find(z => z.Cma2ID === prdct.ID) ? x.WPL1.find(z => z.Cma2ID === prdct.ID).FinalLeadTimePoint : 0;
                let DKTT = x.WPL2.FinalPoint;
                let XX = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalOriginPoint : 0;
                let CSBH = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalWarrPolicyPoint : 0;
                let BG = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalPricePoint : 0;
                let Khac = x.WPL3 ? x.WPL3.map(z => z.FinalPoint).reduce((z, _z) => z+ _z, 0) : 0;
                let TongDiem =  TDTH+DKTT+XX+CSBH+BG+Khac;
                return {
                    Sup_ID: Sup_ID,
                    CMA1_ID: CMA1_ID,
                    IsSubmit: IsSubmit,
                    Name: Name,
                    TDTH: TDTH,
                    DKTT: DKTT,
                    XX: XX,
                    CSBH: CSBH,
                    BG: BG,
                    Khac: Khac,
                    TongDiem: Math.round(TongDiem * 100) / 100
                }
            }).sort((a,b) => b.TongDiem - a.TongDiem )
        }
        
        resutl.push(obj);
    });
    return resutl;
}

const rs1 = (data) => {
    return data.IsSubmit ? null : { color: 'red' } ;
}

const validate = () => {
    if (!modelState.OswID) {
        errorMessage.t1 = 'Hãy chọn trọng số'
    }

    if (!modelState.TrongSoKhac && tabToShow['Other'] === 'Y') {
        errorMessage.t2 = 'Hãy nhập trọng số khác'
    }
    return modelState.OswID && (tabToShow['Other'] === 'Y' ? modelState.TrongSoKhac : true);
}

const isFinish = ref(false);

const activeIndex = ref(0);
const tabCount = ref(0);
const nextTab = () => {
    if (activeIndex.value < tabCount.value - 1)
        activeIndex.value++;
}

const PrevTab = () => {
    if (activeIndex.value > 0)
        activeIndex.value--;
}

const routerBack = () => {
    router.back();
}

const getOSW_Data = async (filte) => {
    try {
        const res = await API.getAsync("oosw/getall", { page: 0, size: 0 });
        // console.log(res.data.data, filte);

        const filted = res.data.data.filter(el => {
            if(tabToShow['Origin'] === 'N' && el.Score6){
                return false;
            }
            if(tabToShow['Origin'] === 'Y' && !el.Score6){
                return false
            }
            if(tabToShow['WartyPolicy'] === 'N' && el.Score4){
                return false;
            }
            if(tabToShow['WartyPolicy'] === 'Y' && !el.Score4){
                return false
            }
            return true;
        })
        // return res.data.data;
        return filted;
    }
    catch (e) {
        return [];
    }
}

const errorMessage = reactive({});
const error = ref(null);
const Oosw_DATA = ref([]);

const tabToShow = reactive({
    ImpProgress: 'N',   // Tiến độ thực hiện
    SumQuotes: 'N',     // Báo giá
    TermsOfPay: 'N',    // Điều khoản thanh toán
    Origin: 'N',        // Xuất xứ
    WartyPolicy: 'N',   // Chính sách bảo hành
    Other: 'N'          // Tiêu chí khác
});

const opInfoDKTT = ref();
const dataToView = ref();

const openInfoDKTT = (data, e) => {
    // console.log(data)
    opInfoDKTT.value.toggle(e);
    dataToView.value = data;
}

const soLuongNCCDaNopHoSo = ref(0)

const preComponent = async () => {
    loading1.value = true;
    try {
        // console.log(route.params.id);
        const res = await API.getAsync("ocma/getbyid", { id: route.params.id });
        //   console.log(res.data)
        
        
        loading1.value = false;
        const time = new Date(res.data.EndTime);
        if (time > currentTime) {
            error.value = {
                code: 406,
                title: 'Chưa đến thời gian chấm điểm.',
                message: 'Gói thầu chưa kết thúc quá trình nộp thầu, vui lòng đợi gói thầu đóng.',
                time: time
            }
            return;
        }
        if (res.data.Status === 'A') {
            error.value = {
                code: 409,
                title: 'Gói thầu đã kết thúc',
                message: 'Gói thầu đã kết thúc, không thể thự hiện thao tác chấm điểm.'
            }
            return;
        }

        if (res.data.Status === 'F'){
            error.value = {
                code: 409,
                title: 'Gói thầu đã thất bại',
                message: 'Gói thầu đã thất bại, không thể thự hiện thao tác chấm điểm.'
            }
        }

        if (res.data.Status === 'C'){
            error.value = {
                code: 409,
                title: 'Gói thầu đã bị huỷ',
                message: 'Gói thầu đã bị huỷ.'
            }
        }

        if(res.data.IsSeflPoint === 'A'){
            isFinish.value = true;
            danhSachDiem.value = tinhDiem(res.data);
            expandedTongDiemRows.value = danhSachDiem.value;
        }

        Object.assign(modelState, res.data);
        if(modelState.IsSeflPoint === 'A'){
            modelState.TrongSoKhac = res.data.CMA1[0].OtherScoreCoe;
        }
        Object.keys(tabToShow).forEach(key => {
            tabToShow[key] = res.data[key];
            if (tabToShow[key] == 'Y')
                tabCount.value++;
        })
        Oosw_DATA.value = await getOSW_Data(tabToShow);
        soLuongNCCDaNopHoSo.value = modelState.CMA1.filter(x => x.Status && x.Status === 'S').length;
        // ------------------- Query data để nhét vào bảng -------------------------------
        // 1. Tiến độ thực hiện
        if (tabToShow['ImpProgress'] === 'Y')
            dtTDTHModel.value = modelState.CMA2.map(x => ({
                item_ID: x.ID,
                item_name: x.Oitm.ItemName,
                item_quantity: x.Quantity,
                item_time_required: getTimeLabel(x.TimeNeeded, 'date'),
                item_unit: x.UomName,
                suppliers: modelState.CMA1
                    .filter(zz => zz.Status && zz.Status === 'S')
                    .map(z => ({
                        sup_ID: z.ID,
                        sup_name: z.Ocrd.CardName,
                        delivery_time: z.WPL1.find(i => i.Cma2ID === x.ID) ? getTimeLabel(z.WPL1.find(i => i.Cma2ID === x.ID).LeadTime, 'date') : null,
                        wpl1_id: z.WPL1.find(i => i.Cma2ID === x.ID) ? z.WPL1.find(i => i.Cma2ID === x.ID).ID : null,
                        auto_score: z.WPL1.find(i => i.Cma2ID === x.ID) ? z.WPL1.find(i => i.Cma2ID === x.ID).LeadTimePoint : null,
                        user_score: z.WPL1.find(i => i.Cma2ID === x.ID) ? (
                            modelState.IsSeflPoint === 'A' ?
                                z.WPL1.find(i => i.Cma2ID === x.ID).SelfLeadTimePoint :
                                z.WPL1.find(i => i.Cma2ID === x.ID).LeadTimePoint
                        ) : null
                    }))
            }));

        // 2. Điều khoản thanh toán
        if (tabToShow['TermsOfPay'] === 'Y')
            dtDKTTModel.value = modelState.CMA1
                .filter(zz => zz.Status && zz.Status === 'S')
                .map(x => ({
                    ...x,
                    cma1_id: x.ID,
                    wpl2_id: x.WPL2.ID,
                    expandRow: [
                        {
                            id: 1, title: 'Tạm ứng', info: x.WPL2.IsAdvReq ? `Tạm ứng ${x.WPL2.NumAdvReq}%` : 'Không', auto_score: x.WPL2.Point, user_score: (
                                modelState.IsSeflPoint === 'A' ?
                                    x.WPL2.SelfPoint : x.WPL2.Point
                            )
                        }, //Tạm ứng
                        {
                            id: 2, title: 'Thời hạn thanh toán', info: ``, auto_score: x.WPL2.Point2, user_score: (
                                modelState.IsSeflPoint === 'A' ?
                                    x.WPL2.SelfPoint2 : x.WPL2.Point2
                            ), data: x.WPL2
                        }
                        // Thời hạn thanh toán
                    ]
                }));

        // 3. Xuất xứ
        if (tabToShow['Origin'] === 'Y')
            dtXuatXuModel.value = modelState.CMA2.map(x => ({
                item_ID: x.ID,
                item_name: x.Oitm.ItemName,
                item_quantity: x.Quantity,
                item_unit: x.UomName,
                suppliers: modelState.CMA1
                    .filter(zz => zz.Status && zz.Status === 'S')
                    .map(z => ({
                        sup_ID: z.ID,
                        sup_name: z.Ocrd.CardName,
                        origin: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).OriginName : null,
                        auto_score: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).OriginPoint : null,
                        user_score: z.WPL.find(i => i.Cma2ID === x.ID) ? (
                            modelState.IsSeflPoint === 'A' ?
                                z.WPL.find(i => i.Cma2ID === x.ID).SelfOriginPoint :
                                z.WPL.find(i => i.Cma2ID === x.ID).OriginPoint
                        ) : null
                    }))
                    .sort((a, b) => (b.auto_score - a.auto_score))
            }));

        //Chính sách bảo hành
        if (tabToShow['WartyPolicy'] === 'Y')
            dtCSBHModel.value = modelState.CMA2.map(x => ({
                item_ID: x.ID,
                item_name: x.Oitm.ItemName,
                item_quantity: x.Quantity,
                item_unit: x.UomName,
                suppliers: modelState.CMA1
                    .filter(zz => zz.Status && zz.Status === 'S')
                    .map(z => ({
                        sup_ID: z.ID,
                        sup_name: z.Ocrd.CardName,
                        warranty_policy: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).WarrPolicyName : null,
                        auto_score: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).WarrPolicyPoint : null,
                        user_score: z.WPL.find(i => i.Cma2ID === x.ID) ? (
                            modelState.IsSeflPoint === 'A' ?
                                z.WPL.find(i => i.Cma2ID === x.ID).SelfWarrPolicyPoint :
                                z.WPL.find(i => i.Cma2ID === x.ID).WarrPolicyPoint
                        ) : null
                    }))
                    .sort((a, b) => (b.auto_score - a.auto_score))
            }));

        //Báo giá
        if (tabToShow['SumQuotes'] === 'Y')
            dtBaoGiaModel.value = modelState.CMA2.map(x => ({
                item_ID: x.ID,
                item_name: x.Oitm.ItemName,
                item_quantity: x.Quantity,
                item_unit: x.UomName,
                suppliers: modelState.CMA1
                    .filter(zz => zz.Status && zz.Status === 'S')
                    .map(z => ({
                        sup_ID: z.ID,
                        sup_name: z.Ocrd.CardName,
                        sup_quantity: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).QuanCanBeSupp : null,
                        sup_price: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).Price : null,
                        auto_score: z.WPL.find(i => i.Cma2ID === x.ID) ? z.WPL.find(i => i.Cma2ID === x.ID).PricePoint : null,
                        user_score: z.WPL.find(i => i.Cma2ID === x.ID) ? (
                            modelState.IsSeflPoint === 'A' ?
                                z.WPL.find(i => i.Cma2ID === x.ID).SelfPricePoint :
                                z.WPL.find(i => i.Cma2ID === x.ID).PricePoint
                        ) : null
                    }))
                    .sort((a, b) => (b.auto_score - a.auto_score))
            }));

        //Tiêu chí khác
        if (tabToShow['Other'] === 'Y')
            // if(tabToShow['TermsOfPay'] === 'Y')
            dtTieuChiKhacModel.value = modelState.CMA1
                .filter(zz => zz.Status && zz.Status === 'S')
                .map(x => ({
                    ...x,
                    cma1_id: x.ID,
                    expandRow: x.WPL3.map(p => ({
                        wpl3_id: p.ID,
                        doc_name: p.PathName,
                        doc: p.Link,
                        user_score: p.Point
                    }))
                }));

        expandedTienDoRows.value = [dtTDTHModel.value[0]];
        expandedDieuKhoanTTRows.value = [dtDKTTModel.value[0]];
        expandedXuatXuRows.value = [dtXuatXuModel.value[0]];
        expandedCSBHRows.value = [dtCSBHModel.value[0]];
        expandedBaoGiaRows.value = [dtBaoGiaModel.value[0]];
        expandedTieuChiKhacRows.value = [dtTieuChiKhacModel.value[0]];

    }
    catch (e) {
        console.error(e);
        let err = {
            code: e.response.status,
            title: e.response.status === 404 ? 'Not found' : e.response.data.error
        }

        switch (e.response.status) {
            case 404:
                err.message = "Không tìm thấy gói thầu."
                break;
            default:
                err.message = e.message;
                break;
        }

        error.value = err;
    }
    loading1.value = false;
}

onBeforeMount(async () => {
    await preComponent();
})

onMounted(() => {
    // console.clear()
})
// -------------- extention -----------------------
const expandedTienDoRows = ref();
const expandedDieuKhoanTTRows = ref();
const expandedXuatXuRows = ref();
const expandedCSBHRows = ref();
const expandedBaoGiaRows = ref();
const expandedTieuChiKhacRows = ref();

const dtDKTTModel = ref([]);
const dtTDTHModel = ref([]);
const dtXuatXuModel = ref([]);
const dtCSBHModel = ref([]);
const dtBaoGiaModel = ref([]);
const dtTieuChiKhacModel = ref([]);

const currentTime = new Date();
const timeChecker = (_date) => {
    if (_date) {
        const time = new Date(_date);
        if (currentTime > time)
            return true;
    }
    return false;
}

const getTimeLabel = (date, format) => {
    if (!date) {
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

const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: "br",
        detail: msg,
        life: 3000,
    });
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'P':
      return "Đang nhận hồ sơ"
    case 'A':
      return "Hoàn thành"
    case 'C':
      return "Hủy"
    case 'I':
      return "Đang đánh giá"
    case 'F':
      return "Thất bại"
    case 'L':
      return "Đã chọn nhà thầu"
    default:
      return "Unknown";
  }
}

const getCurrencyLabel = (value) => {
    if (value) {
        let formater = new Intl.NumberFormat('vi-VI');
        return `${formater.format(value)} đ`
    }
    else {
        return null
    }
}

const backHis = () => {
    history.back()
}

// ------------ static config --------------
const ptResult = {
    headerAction: {
        class: 'result'
    }
}

// Blue row
const ptTable1 = {
    rowExpansion: {
        style: 'background: #eceef1' //
    }
}

//
const ptTable2 = {
    rowExpansion: {
        style: 'padding: 0px'
    },
    rowExpansionCell: {
        style: 'padding: 0px'
    }
}

// hide header
const ptTable2_1 = {
    thead: {
        style: 'display: none'
    }
}

const ptInputNumber = {
    input: {
        class: 'w-full text-center'
    },
    incrementButton: {
        class: 'btn-input-number'
    },
    decrementButton: {
        class: 'btn-input-number'
    }
}

const rowClass = (data) => {
    return [{ 'row-item': true }];
};

function getWPL(cma1_id, wpl) {
    const arr = [];

    for (let i = 0; i < wpl.length; i++) {
        const obj = {};
        obj['ID'] = wpl[i].ID;
        // Chính sách bảo hành
        if (tabToShow['WartyPolicy'] === 'Y')
            obj['SelfWarrPolicyPoint'] = dtCSBHModel.value.find(x => x.item_ID === wpl[i].Cma2ID)
                .suppliers.find(z => z.sup_ID === cma1_id).user_score;
        // Xuất xứ
        if (tabToShow['Origin'] === 'Y')
            obj['SelfOriginPoint'] = dtXuatXuModel.value.find(x => x.item_ID === wpl[i].Cma2ID)
                .suppliers.find(z => z.sup_ID === cma1_id).user_score;
        // Báo giá 
        obj['SelfPricePoint'] = dtBaoGiaModel.value.find(x => x.item_ID === wpl[i].Cma2ID)
            .suppliers.find(z => z.sup_ID === cma1_id).user_score;

        arr[i] = obj;
    }
    return arr

}

</script>

<style scoped>
.active>.tail {
    border-top: 30px solid var(--primary-color);
    border-bottom: 30px solid var(--primary-color);
}

.active>.head {
    border-left: 20px solid var(--primary-color);
}

.active>.content {
    background-color: var(--primary-color);
    color: white;
}


.content {
    width: 100%;
    text-align: center;
    background-color: #e5e7eb;
}

.tail {
    border-radius: 0px;
    border-top: 30px solid #e5e7eb;
    border-bottom: 30px solid #e5e7eb;
    border-left: 20px solid transparent;
}

.head {
    border-radius: 0px;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-left: 20px solid #e5e7eb;
}

.border-radius-none {
    border-radius: 0px !important;
}

.code-span {
    /* background: #696d8e; */
    padding: 0.40rem;
    margin-right: 0.5rem;
    /* border-radius: 6px; */
    border: 1px solid var(--gray-500);
    color: var(--gray-500);
    font-weight: bold;
}

.border-r {
    border-right: 1px solid var(--surface-border);
    border-top: none;
    border-left: none;
    border-bottom: none;
}

.border-b-0 {
    border-bottom: none;
}

.border-t-0 {
    border-top: none;
}

.border-l-0 {
    border-left: none;
}

.border-r-0 {
    border-right: none;
}
</style>

<style>
.result {
    border: 1px solid rgb(20, 76, 160);
    background: rgba(202, 223, 255, 0.507);
    /* color: rgb(255, 255, 255); */
}

.circel {
    background: #fff;
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-weight: bolder;
}

.circel>i {
    font-weight: 900;
}

.jf-center .p-column-header-content {
    justify-content: center;
}

.p-tabview .p-tabview-nav .p-tabview-nav-link {
    border-radius: 0;
}

.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    background: var(--blue-100);
    border-color: var(--primary-color);
    border-radius: 0;
}

.btn-input-number {
    width: 28px;
}

.btn-input-number>span {
    font-size: 8px;
    font-weight: bolder;
}

.row-item {
    /* background: #637bab; */
    background: var(--primary-color);
    color: #fcfcff;
    font-weight: bolder;
}

.row-item button {
    color: #fcfcff;
}

.row-item button:hover {
    color: black;
}

.btn-click:target {
    background: red;
}
</style>