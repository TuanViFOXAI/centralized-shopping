<template>
    <!-- Danh sách dữ liệu hồ sơ -->
    <template v-if="!visibleDetailWindow">
        <div class="flex align-items-center p-3">
            <h5 class="p-title mb-0 mt-0 font-semibold">CHẤM ĐIỂM - LỰA CHỌN NHÀ CUNG CẤP</h5>
        </div>
        <DataTable
            :value="OCMA_DATA['data']"
            columnResizeMode="fit"
            :totalRecords="OCMA_DATA['TotalCount']"
            paginator
            :pt="noFillBg"
            :rowsPerPageOptions="[5, 10, 20]"
            :rows="PAGE_SIZE"
            @page="onPageChange"
            showGridlines
            size="small"
            lazy
            :loading="loadingOcmaData"
        >
        <template #empty>
              <div class="flex h-10rem justify-content-center align-items-center">
                Không có dữ liệu nào để hiển thị
              </div>
            </template>
            <template #header>
                <div class="search-group">
                    <InputText @keyup.enter="onSearch" v-model="searchKey" :placeholder="$t('InputText.Search')" />
                    <Button @click="onSearch" icon="pi pi-search"></Button>
                </div>
            </template>
            <template #loading>
                <Loading></Loading>
            </template>
            <Column header="#">
                <template #body="sp">
                    {{ PAGE_SIZE * (CURRENT_PAGE - 1) + sp.index + 1 }}
                </template>
            </Column>
            <Column field="CmaCode" header="Mã gói thầu" />
            <Column field="CmaName" header="Tên gói thầu" />
            <Column header="Thời điểm mở thầu">
                <template #body="sp">
                    {{ getTimeLabel(sp.data.StartTime) }}
                </template>
            </Column>
            <Column header="Thời điểm đóng thầu">
                <template #body="sp">
                    {{ getTimeLabel(sp.data.EndTime) }}
                </template>
            </Column>
            <Column header="Số lượng nhà cung cấp" style="text-align: center; width: 8rem">
            <template #body="sp">
            {{ sp.data.NumSupBidding }}/{{ sp.data.CMA1.length }}
            </template>
            </Column>
            <Column header="Trạng thái">
                <template #body="sp">
                    {{ getStatusLabel(sp.data.Status) }}
                </template>
            </Column>
            <Column header="Trạng thái chấm điểm">
                <template #body="sp">
                    {{ getScoreStatusLabel(sp.data.IsSeflPoint) }}
                </template>
            </Column>
            <Column header="" style="min-width: 4rem; align-items: center">
                <template #body="sp">
                    <!-- <Button :disabled="sp.data.Status === 'A'" icon="pi pi-pencil" text style="width:32px;height:32px" @click="openDetailWindow(sp.data.ID)" /> -->
                    <!-- <router-link :to="`scoring-list/${sp.data.ID}/detail`"> -->
                    <div class="flex justify-between">
                        <Button :disabled="sp.data.Status === 'C' || sp.data.Status === 'F' || sp.data.Status === 'A'" @click="opendMark(sp.data.ID)" icon="pi pi-pencil" severity="" text style="width: 32px; height: 32px" />
                        <Button @click="opendViewDetail(sp.data.ID)" icon="pi pi-eye" text style="width: 32px; height: 32px" />
                    </div>
                    <!-- </router-link> -->
                </template>
            </Column>
        </DataTable>
    </template>
    <!-- ======================= Cửa sổ chấm điểm ========================= -->
    <template v-else-if="scoringMode === 3">
        <div class="card border-raduis-none m-3">
            <h5 class="p-title mb-0 mt-0 font-bold">KẾT QUẢ CHẤM ĐIỂM GÓI THẦU</h5>
            <Divider />
            <div class="grid">
                <div class="col-8">
                    <div class="grid">
                        <div class="col-3 font-semibold">Tên gói thầu:</div>
                        <div class="col-9">
                            <span class="code-span">{{ modelState.CmaCode }}</span> <span class="font-bold text-gray-800">{{ modelState.CmaName }}</span>
                        </div>
                        <div class="col-3 font-semibold">Ngân sách dự kiến:</div>
                        <div class="col-9">{{ getCurrencyLabel(modelState.CMA2.map((x) => x.UnitPrice * x.Quantity).reduce((a, b) => a + b, 0)) }}</div>
                        <div class="col-3 font-semibold">Hình thức:</div>
                        <div class="col-9">{{ modelState.CmaType === 'C' ? 'Chào giá cạnh tranh' : 'Chỉ định nhà cung cấp' }}</div>
                        <div class="col-3 font-semibold">Lĩnh vực:</div>
                        <div class="flex col-9 align-items-center">
                            {{ modelState.CMA6.map((x) => x.OondName).length > 1 ? `${modelState.CMA6.map((x) => x.OondName)[0]}, ...` : modelState.CMA6.map((x) => x.OondName)[0] }}
                            <Button v-if="modelState.CMA6.map((x) => x.OondName).length > 1" text label="xem thêm" style="padding: 0 0 0 3px; height: 20px; color: var(--primary-color)" @click="showNNLV($event)"></Button>
                        </div>
                        <div class="col-3 font-semibold">Nhóm hàng hoá:</div>
                        <div class="flex col-9 align-items-center">
                            {{ modelState.CMA7.map((x) => x.GroupItemName).length > 1 ? `${modelState.CMA7.map((x) => x.GroupItemName)[0]}, ...` : modelState.CMA7.map((x) => x.GroupItemName)[0] }}
                            <Button v-if="modelState.CMA7.map((x) => x.GroupItemName).length > 1" text label="xem thêm" style="padding: 0 0 0 3px; height: 20px; color: var(--primary-color)" @click="showNHH($event)"></Button>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="grid">
                        <div class="col-7 font-semibold">Thời gian nộp hồ sơ:</div>
                        <div class="col-5">{{ getTimeLabel(modelState.StartTime, 'time') }}</div>
                        <div class="col-7 font-semibold">Thời gian đóng hồ sơ:</div>
                        <div class="col-5">{{ getTimeLabel(modelState.EndTime, 'time') }}</div>
                        <div class="col-7 font-semibold">Thời gian công bố kế quả:</div>
                        <div class="col-5">{{ getTimeLabel(modelState.ResultReleaseTime, 'time') }}</div>
                    </div>
                </div>
            </div>

            <OverlayPanel ref="opNNLV">
                <div class="card p-2 gap-3 mw-30rem mh-30rem scroll">
                    <Chip class="m-1" :key="item" :label="item" v-for="item in modelState.CMA6.map((x) => x.OondName)"></Chip>
                </div>
            </OverlayPanel>
            <OverlayPanel ref="opNHH">
                <div class="card p-2 gap-3 mw-30rem mh-30rem scroll">
                    <Chip class="m-1" :key="item" :label="item" v-for="item in modelState.CMA7.map((x) => x.GroupItemName)"></Chip>
                </div>
            </OverlayPanel>
            <Divider />
            <DataTable showGridlines class="mb-3" :pt="ptTable3" :value="dtKetQuaChamDiem.trung_list" scrollable scrollHeight="500px" v-model:expandedRows="expandedTongKetRows">
                <template #header>
                    <h5 class="m-0 font-bold text-white">Danh sách trúng thầu</h5>
                </template>
                <Column expander style="width: 3rem" />
                <Column header="#" style="width: 3rem">
                    <template #body="sl">{{ ++sl.index }}</template>
                </Column>
                <Column field="sup_name" header="Nhà cung cấp"></Column>
                <Column field="total_point" header="Tổng điểm gói thầu" style="width: 13rem; text-align: center" headerClass="jf-center"></Column>
                <template #expansion="slotProps">
                    <DataTable showGridlines :value="slotProps.data.items" size="small" stripedRows>
                        <template #header>
                            <span class="m-0 font-semibold">Danh sách sản phẩm trúng thầu</span>
                        </template>
                        <Column header="#"
                            ><template #body="sl">{{ ++sl.index }}</template></Column
                        >
                        <Column field="item_name" header="Tên sản phẩm"></Column>
                        <Column field="point" header="Điểm" headerClass="jf-center" style="text-align: center"></Column>
                        <Column field="item_quantity" header="Số lượng" headerClass="jf-center" style="text-align: center"></Column>
                        <Column field="item_unit" header="Đơn vị" headerClass="jf-center"></Column>
                        <Column field="delivery_time" header="Ngày giao" headerClass="jf-center" style="text-align: center"></Column>
                        <Column field="item_sup_price" header="Giá trúng thầu" style="text-align: right" headerClass="jf-center">
                            <template #body="sp">
                                {{ getCurrencyLabel(sp.data.item_sup_price) }}
                            </template>
                        </Column>
                        <Column field="total_price" header="Thành tiền" style="text-align: right" headerClass="jf-center">
                            <template #body="sp">
                                {{ getCurrencyLabel(sp.data.total_price) }}
                            </template>
                        </Column>
                        <Column field="reason_win" header="Lý do"></Column>
                        <ColumnGroup type="footer">
                            <Row>
                                <Column footer="Tổng giá trị gói thầu:" :colspan="7" footerStyle="text-align:left" />
                                <Column style="text-align: right" :footer="totalCounting(slotProps.data.items, 'total_price')" :colspan="3" />
                            </Row>
                        </ColumnGroup>
                    </DataTable>
                </template>
            </DataTable>
            <!-- ======================================= -->
            <DataTable :pt="ptTable3" :showGridlines="true" :value="dtKetQuaChamDiem.truot_list" scrollable scrollHeight="500px">
                <template #header>
                    <h5 class="m-0 font-bold text-white">Danh sách trượt thầu</h5>
                </template>
                <Column header="#" style="width: 3rem">
                    <template #body="sl">{{ ++sl.index }}</template>
                </Column>
                <Column field="sup_name" header="Tên nhà cung cấp"></Column>
                <Column field="total_point" header="Tổng điểm gói thầu" style="width: 13rem; text-align: center"></Column>
            </DataTable>
            <div class="footer mt-3 flex justify-between gap-2">
                <Button @click="onClickCancel" label="Danh sách"></Button>
                <div class="flex justify-between gap-2">
                    <Button @click="scoringMode = 2" label="Quay lại" outlined></Button>

                    <Button :loading="loadingSend" @click="onSelectSupSave" severity="help" label="Lưu kết quả"></Button>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="px-3">
            <div class="flex justify-between align-items-center pt-3 px-3 mb-3">
                <h5 class="p-title mb-0 mt-0 font-semibold">{{ scoringMode === 1 ? 'CHẤM ĐIỂM NHÀ CUNG CẤP' : 'LỰA CHỌN NHÀ CUNG CẤP' }}</h5>
                <!-- <button @click="debug">debug</button> -->
                <Button icon="pi pi-times" label="Đóng" outlined @click="closeDetailWindow"></Button>
            </div>
            <div class="card border-raduis-none">
                <div class="grid">
                    <div class="col-12">
                        <Skeleton v-if="loadingOcma" height="1.5rem" width="20rem" class="mb-0"></Skeleton>
                        <h5 v-else class="p-title font-semibold m-0">{{ modelState.CmaName }}</h5>
                    </div>
                    <div class="col-6">
                        <div class="grid">
                            <div class="col-6">Ngày đóng thầu:</div>
                            <div class="col-6">
                                <Skeleton v-if="loadingOcma" width="10rem" class="mb-2"></Skeleton>
                                <span class="mb-2" v-else>{{ getTimeLabel(modelState.EndTime, 'day') }}</span>
                            </div>
                            <div class="col-6">Nhà cung cấp đã nộp thầu:</div>
                            <div class="col-6">
                                <Skeleton v-if="loadingOcma" width="10rem" class="mb-2"></Skeleton>
                                <span class="mb-2" v-else>{{ `${modelState.CMA1.filter((x) => x.Status && x.Status === 'S').length}/${modelState.CMA1.length}` }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="grid">
                            <div class="col-6">Người chấm:</div>
                            <div class="col-6">
                                <Skeleton v-if="loadingOcma" width="10rem" class="mb-2"></Skeleton>
                                <span v-else>{{ '-' }}</span>
                            </div>
                            <div class="col-6">Ngày chấm:</div>
                            <div class="col-6">
                                <Skeleton v-if="loadingOcma" width="10rem" class="mb-2"></Skeleton>
                                <span v-else>{{ '-' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 p-fluid">
                        <div class="field mb-0">
                            <label class="p-label">Trọng số giữa các tiêu chí<sup class="p-important">*</sup></label>
                            <Dropdown
                                :class="{ 'p-invalid': errorMessage.t1 && !modelState.Oosw }"
                                :disabled="loadingOcma || scoringMode === 2"
                                v-model="modelState.Oosw"
                                :options="Oosw_DATA"
                                optionLabel="SwName"
                                placeholder="Chọn trọng số chấm điểm"
                            >
                                <template #option="slotProps">
                                    <div class="font-semibold">{{ slotProps.option.SwName }}</div>
                                    <div class="font-light">{{ slotProps.option.SwDesc }}</div>
                                </template>
                            </Dropdown>
                            <small v-if="errorMessage.t1 && !modelState.Oosw" class="p-error">{{ errorMessage.t1 }}</small>
                        </div>
                    </div>
                    <div class="col-3 p-fluid" v-if="tabToShow['Other'] === 'Y'">
                        <div class="field mb-0">
                            <label class="p-label">Trọng số tiêu chí khác<sup class="p-important">*</sup></label>
                            <InputNumber
                                :class="{ 'p-invalid': errorMessage.t2 && modelState.trongSo === null }"
                                :disabled="loadingOcma || scoringMode === 2"
                                v-model="modelState.trongSo"
                                placeholder="Nhập trọng số (tối đa: 100)"
                                :min="0"
                                :max="100"
                            />
                            <small v-if="errorMessage.t2 && modelState.trongSo === null" class="p-error">{{ errorMessage.t2 }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!loadingOcma && scoringMode === 1" class="card p-0 border-raduis-none">
                <TabView v-model:activeIndex="activeIndex" :scrollable="true">
                    <TabPanel v-if="tabToShow['ImpProgress'] === 'Y'" header="Tiến độ thực hiện" :pt="ptTabPanel">
                        <DataTable showGridlines="" class="card border-raduis-none p-0" v-model:expandedRows="expandedTienDoRows" :rowClass="rowClass" :value="dtTDTHModel" :pt="ptTable1">
                            <Column expander style="width: 3rem" />
                            <Column header="#" style="width: 3rem">
                                <template #body="sp">
                                    {{ ++sp.index }}
                                </template>
                            </Column>
                            <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
            </Column> -->
                            <Column field="item_name" header="Tên sản phẩm"> </Column>
                            <Column field="item_time_required" header="Ngày cần hàng" style="width: 10rem"> </Column>
                            <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right"> </Column>
                            <Column field="item_unit" header="Đơn vị tính" style="width: 10rem"> </Column>
                            <template #expansion="sp">
                                <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                    <Column field="sup_name" header="Tên nhà cung cấp"> </Column>
                                    <Column field="delivery_time" style="width: 13rem; text-align: center">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Thời gian giao hàng</div>
                                                <div class="font-light">(so với ngày cần hàng)</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="auto_score" style="width: 13rem; text-align: center">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Điểm tham khảo</div>
                                                <div class="font-light">(hệ thống tính tự động)</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column style="width: 13rem">
                                        <template #header>
                                            <div class="text-center w-full">Điểm đánh giá</div>
                                        </template>
                                        <template #body="s_sp">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="s_sp.data.user_score" :min="0" :max="10">
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
                    <TabPanel v-if="tabToShow['TermsOfPay'] === 'Y'" header="Điều khoản thanh toán" :pt="ptTabPanel">
                        <DataTable showGridlines="" class="card border-raduis-none p-0" v-model:expandedRows="expandedDieuKhoanTTRows" :rowClass="rowClass" :value="dtDKTTModel" :pt="ptTable2">
                            <Column expander style="width: 3rem"> </Column>
                            <Column field="Ocrd.CardName" header="Tên nhà cung cấp" style="border-left: 0"> </Column>
                            <Column style="width: 20rem">
                                <template #header>
                                    <div class="text-center w-full">Thông tin</div>
                                </template>
                            </Column>
                            <Column style="width: 13rem">
                                <template #header>
                                    <div class="flex flex-column align-items-center w-full">
                                        <div>Điểm tham khảo</div>
                                        <div class="font-light">(hệ thống tính tự động)</div>
                                    </div>
                                </template>
                            </Column>
                            <Column style="width: 13rem">
                                <template #header>
                                    <div class="text-center w-full">Điểm đánh giá</div>
                                </template>
                            </Column>
                            <template #expansion="sp">
                                <DataTable size="small" showGridlines :value="sp.data.expandRow" :pt="ptTable2_1">
                                    <Column style="width: 3rem; padding: 1rem">
                                        <template #body>
                                            <div style="display: block; width: 28px"></div>
                                        </template>
                                    </Column>
                                    <Column field="title" header="1"> </Column>
                                    <Column header="2" style="width: 20rem">
                                        <template #body="slotP">
                                            {{ slotP.data.info }}
                                            <!-- <Button label="chi tiết" @click="openInfoDKTT(slotP.data.data, $event)" v-if="slotP.data.id === 2" rounded :pt="ptInfoBtn" text severity="info" style="height: 16px !important;padding: 4px;text-align: center"></Button> -->
                                            <span @click="openInfoDKTT(slotP.data.data, $event)" class="text-primary cursor-pointer h-font-bold" v-if="slotP.data.id === 2">chi tiết <i class="pi pi-info-circle"></i></span>
                                            <OverlayPanel ref="opInfoDKTT">
                                                <div class="grid w-30rem">
                                                    <div class="col-6 font-bold">Yêu cầu tạm ứng:</div>
                                                    <div class="col-6">{{ dataToView.IsAdvReq ? `Tạm ứng ${dataToView.NumAdvReq}%` : 'Không' }}</div>
                                                    <div class="col-6 font-bold">Ngày thanh toán dựa trên:</div>
                                                    <div class="col-6">{{ dataToView.DateAdd === 1 ? `Ngày hoá đơn (${dataToView.Month} tháng + ${dataToView.Day} ngày)` : `Ngày giao hàng (${dataToView.Month} tháng + ${dataToView.Day} ngày)` }}</div>
                                                    <div class="col-6 font-bold">Số ngày chênh lệch:</div>
                                                    <div class="col-6">{{ `${dataToView.NumOfDaysDiff} ngày` }}</div>
                                                </div>
                                            </OverlayPanel>
                                        </template>
                                    </Column>
                                    <Column field="auto_score" header="3" style="width: 13rem; text-align: center"> </Column>
                                    <Column header="user_score" style="max-width: 13rem; width: 13rem; text-align: center">
                                        <template #body="sp">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="sp.data.user_score">
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
                    <TabPanel v-if="tabToShow['Origin'] === 'Y'" header="Xuất xứ" :pt="ptTabPanel">
                        <DataTable showGridlines class="card border-raduis-none p-0" v-model:expandedRows="expandedXuatXuRows" :rowClass="rowClass" :value="dtXuatXuModel" :pt="ptTable1">
                            <Column expander style="width: 3rem" />
                            <Column header="#" style="width: 3rem">
                                <template #body="sp">
                                    {{ ++sp.index }}
                                </template>
                            </Column>
                            <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
            </Column> -->
                            <Column field="item_name" header="Tên sản phẩm"> </Column>
                            <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right"> </Column>
                            <Column field="item_unit" header="Đơn vị tính" style="width: 10rem"> </Column>
                            <template #expansion="sp">
                                <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                    <Column field="sup_name" header="Tên nhà cung cấp"> </Column>
                                    <Column field="origin" style="width: 13rem">
                                        <template #header>
                                            <div class="flex flex-column align-items-left w-full">
                                                <div>Xuất xứ</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="auto_score" style="width: 13rem; text-align: center">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Điểm tham khảo</div>
                                                <div class="font-light">(hệ thống tính tự động)</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column style="width: 13rem">
                                        <template #header>
                                            <div class="text-center w-full">Điểm đánh giá</div>
                                        </template>
                                        <template #body="s_sp">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="s_sp.data.user_score">
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
                    <TabPanel v-if="tabToShow['WartyPolicy'] === 'Y'" header="Chính sách bảo hành" :pt="ptTabPanel">
                        <DataTable showGridlines class="card border-raduis-none p-0" v-model:expandedRows="expandedCSBHRows" :rowClass="rowClass" :value="dtCSBHModel" :pt="ptTable1">
                            <Column expander style="width: 3rem" />
                            <Column header="#" style="width: 3rem">
                                <template #body="sp">
                                    {{ ++sp.index }}
                                </template>
                            </Column>
                            <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
            </Column> -->
                            <Column field="item_name" header="Tên sản phẩm"> </Column>
                            <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right"> </Column>
                            <Column field="item_unit" header="Đơn vị tính" style="width: 10rem"> </Column>
                            <template #expansion="sp">
                                <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                    <Column field="sup_name" header="Tên nhà cung cấp"> </Column>
                                    <Column field="warranty_policy" style="width: 13rem">
                                        <template #header>
                                            <div class="flex flex-column align-items-left w-full">
                                                <div>Thông tin</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="auto_score" style="width: 13rem; text-align: center">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Điểm tham khảo</div>
                                                <div class="font-light">(hệ thống tính tự động)</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column style="width: 13rem">
                                        <template #header>
                                            <div class="text-center w-full">Điểm đánh giá</div>
                                        </template>
                                        <template #body="s_sp">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="s_sp.data.user_score">
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
                    <TabPanel v-if="tabToShow['SumQuotes'] === 'Y'" header="Báo giá" :pt="ptTabPanel">
                        <DataTable showGridlines="" class="card border-raduis-none p-0" v-model:expandedRows="expandedBaoGiaRows" :rowClass="rowClass" :value="dtBaoGiaModel" :pt="ptTable1">
                            <Column expander style="width: 3rem" />
                            <Column header="#" style="width: 3rem">
                                <template #body="sp">
                                    {{ ++sp.index }}
                                </template>
                            </Column>
                            <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
            </Column> -->
                            <Column field="item_name" header="Tên sản phẩm"> </Column>
                            <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right"> </Column>
                            <Column field="item_unit" header="Đơn vị tính" style="width: 10rem"> </Column>
                            <template #expansion="sp">
                                <DataTable size="small" :value="sp.data.suppliers" showGridlines>
                                    <Column field="sup_name" header="Tên nhà cung cấp"> </Column>
                                    <Column field="sup_quantity" style="width: 7rem; text-align: right">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Số lượng</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="sup_price" style="width: 13rem; text-align: right">
                                        <template #header>
                                            <div class="flex flex-column text-center w-full">
                                                <div>Báo giá</div>
                                            </div>
                                        </template>
                                        <template #body="sub_sp">
                                            {{ getCurrencyLabel(sub_sp.data.sup_price) }}
                                        </template>
                                    </Column>
                                    <Column field="auto_score" style="width: 13rem; text-align: center">
                                        <template #header>
                                            <div class="flex flex-column align-items-center w-full">
                                                <div>Điểm tham khảo</div>
                                                <div class="font-light">(hệ thống tính tự động)</div>
                                            </div>
                                        </template>
                                    </Column>
                                    <Column style="width: 13rem">
                                        <template #header>
                                            <div class="text-center w-full">Điểm đánh giá</div>
                                        </template>
                                        <template #body="s_sp">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="s_sp.data.user_score">
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
                    <TabPanel v-if="tabToShow['Other'] === 'Y'" header="Tiêu chí khác" :pt="ptTabPanel">
                        <DataTable showGridlines="" class="card border-raduis-none p-0" v-model:expandedRows="expandedTieuChiKhacRows" :rowClass="rowClass" :value="dtTieuChiKhacModel" :pt="ptTable2">
                            <Column expander style="width: 3rem"> </Column>
                            <Column field="Ocrd.CardName" header="Tên nhà cung cấp" style="border-left: 0"> </Column>
                            <Column style="width: 15rem">
                                <template #header>
                                    <div class="text-center w-full">Tài liệu đính kèm</div>
                                </template>
                            </Column>
                            <Column style="width: 13rem">
                                <template #header>
                                    <div class="text-center w-full">Điểm đánh giá</div>
                                </template>
                            </Column>
                            <template #expansion="sp">
                                <DataTable size="small" showGridlines :value="sp.data.expandRow" :pt="ptTable2_1">
                                    <Column style="width: 3rem; padding: 1rem">
                                        <template #body="cc">
                                            <div style="display: block; width: 28px">
                                                {{ ++cc.index }}
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="doc_name" header="1"> </Column>
                                    <Column header="2" style="width: 15rem; text-align: center">
                                        <template #body="slotP">
                                            <a target="_blank" :href="slotP.data.doc">Mở liên kết <i class="pi pi-external-link"></i></a>
                                        </template>
                                    </Column>
                                    <Column header="user_score" style="max-width: 13rem; width: 13rem; text-align: center">
                                        <template #body="spz">
                                            <InputNumber showButtons :pt="ptInputNumber" :minFractionDigits="2" v-model="spz.data.user_score">
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
                </TabView>
                <div class="flex justify-end gap-3 cp-1 pt-0">
                    <Button :disabled="activeIndex < 1" @click="onClickPrevious" outlined label="Quay lại"></Button>
                    <Button
                        @click="
                            () => {
                                showToast('success', 'TEST', 'Thông báo - DEMO');
                            }
                        "
                        label="Lưu"
                        severity="help"
                    ></Button>
                    <Button @click="routerToSelectWinner(modelState.ID)" v-if="modelState.MarkStatus === 'A'" label="Chọn nhà cung cấp"></Button>
                    <Button
                        v-else
                        :loading="loadingSend"
                        :disabled="activeIndex > tabCount - 2 && modelState.CMA1.filter((x) => x.Status && x.Status === 'S').length < 1"
                        @click="onClickPrimary"
                        :label="activeIndex < tabCount - 1 ? 'Tiếp tục' : 'Lưu điểm'"
                    ></Button>
                </div>
            </div>
            <div v-else-if="!loadingOcma && scoringMode === 2">
                <Divider class="m-0" />
                <DataTable :value="dtDiemTongKet" class="card border-raduis-none p-0" v-model:expandedRows="expandedDiemTongKetRows" :rowClass="rowClass" :pt="ptTableTotal">
                    <Column expander style="width: 3rem" />
                    <Column header="#" style="width: 3rem">
                        <template #body="sp">
                            {{ ++sp.index }}
                        </template>
                    </Column>
                    <!-- <Column field="item_ID" header="ID" style="width: 7rem;">
            </Column> -->
                    <Column field="item_name" header="Tên sản phẩm"> </Column>
                    <Column field="item_time_required" header="Ngày cần hàng" style="width: 10rem"> </Column>
                    <Column field="item_quantity" header="Số lượng" style="width: 7rem; text-align: right"> </Column>
                    <Column field="item_unit" header="Đơn vị tính"> </Column>
                    <Column header="Trạng thái chấm điểm" style="max-width: 7rem; text-align: center">
                        <template #body="sp">
                            <div class="flex justify-center w-full">
                                <div class="circel">
                                    <i v-if="sp.data.Selected" class="pi pi-check" style="color: var(--green-500)"></i>
                                    <i v-else class="pi pi-times" style="color: var(--red-500)"></i>
                                </div>
                            </div>
                        </template>
                    </Column>
                    <template #expansion="sp">
                        <DataTable v-model:selection="sp.data.Selected" selectionMode="single" size="small" :value="sp.data.suppliers.sort((a, b) => b.total - a.total)" showGridlines>
                            <Column field="sup_name" header="Tên nhà cung cấp"> </Column>
                            <Column field="tdth" header="Tiến độ thực hiện" style="width: 7rem; text-align: center">
                                <template #body="sl">
                                    {{ (sl.data.tdth_s = sl.data.tdth * modelState.Oosw.Score1) }}
                                </template>
                            </Column>
                            <Column field="dktt" header="Điều khoản thanh toán" style="width: 7rem; text-align: center">
                                <template #body="sl">
                                    {{ (sl.data.dktt_s = sl.data.dktt * modelState.Oosw.Score2) }}
                                </template>
                            </Column>
                            <Column field="xx" headerStyle="text-align: center" style="width: 7rem; text-align: center">
                                <template #header>
                                    <div class="text-center w-full">Xuất xứ</div>
                                </template>
                                <template #body="sl">
                                    {{ (sl.data.xx_s = sl.data.xx * modelState.Oosw.Score6) }}
                                </template>
                            </Column>
                            <Column field="csbh" header="Chính sách bảo hành" style="width: 7rem; text-align: center">
                                <template #body="sl">
                                    {{ (sl.data.csbh_s = sl.data.csbh * modelState.Oosw.Score4) }}
                                </template>
                            </Column>
                            <Column field="bg" style="width: 7rem; text-align: center">
                                <template #header>
                                    <div class="text-center w-full">Báo giá</div>
                                </template>
                                <template #body="sl">
                                    {{ (sl.data.bg_s = Math.round(sl.data.bg * modelState.Oosw.Score7 * 100) / 100) }}
                                </template>
                            </Column>
                            <Column v-if="tabToShow['Other'] === 'Y'" field="tck" header="Tiêu chí khác" style="width: 7rem; text-align: center">
                                <template #body="sl">
                                    {{ (sl.data.tck_s = sl.data.tck * modelState.trongSo) }}
                                </template>
                            </Column>
                            <Column field="total" style="width: 7rem; text-align: center">
                                <template #header>
                                    <div class="text-center w-full">Tổng điểm</div>
                                </template>
                                <template #body="sl">
                                    {{
                                        (sl.data.total =
                                            sl.data.tdth_s + sl.data.dktt_s + (tabToShow['Origin'] ? sl.data.xx_s : 0) + (tabToShow['WartyPolicy'] === 'Y' ? sl.data.csbh_s : 0) + sl.data.bg_s + (tabToShow['Other'] === 'Y' ? sl.data.tck_s : 0))
                                    }}
                                </template>
                            </Column>
                            <Column header="Chọn" selectionMode="single" style="text-align: center" headerStyle="width: 3rem; text-align: center"></Column>
                            <Column style="text-align: center; width: 12rem" headerStyle="text-align: center">
                                <template #header>
                                    <div class="text-center w-full">Lý do</div>
                                </template>
                                <template #body="sl">
                                    <!-- <span style="display: none;">{{ sp.data.Selected = sp.data.suppliers[0] }}</span> -->
                                    <Textarea class="w-full" rows="2" v-if="sp.data.Selected === sl.data" v-model="sl.data.LyDo"></Textarea>
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                    <template #header>
                        <h5 class="font-bold m-0 text-primary">Báo cáo tổng kết điểm</h5>
                    </template>
                    <template #footer>
                        <div class="flex justify-end gap-3">
                            <Button outlined label="Chấm lại" @click="scoringMode = 1"></Button>
                            <Button @click="onClickKetQua" label="Tiếp tục"></Button>
                        </div>
                    </template>
                </DataTable>
            </div>
            <div v-else-if="!loadingOcma && scoringMode === 3"></div>
            <div v-else class="card p-0 border-raduis-none">
                <div class="header flex gap-2 p-2">
                    <Skeleton height="2.6rem" width="10rem"></Skeleton>
                    <Skeleton height="2.6rem" width="10rem"></Skeleton>
                    <Skeleton height="2.6rem" width="10rem"></Skeleton>
                </div>
                <Divider class="m-0" />
                <div class="body p-3">
                    <Skeleton height="20rem" class=""></Skeleton>
                </div>
            </div>
        </div>
    </template>

    <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import API from '../../../apis/api';
import { useToast } from 'primevue/usetoast';
const toast = useToast();
const route = useRoute();
const router = useRouter();

//==== Search ===========================
const searchKey = ref('');
const onSearch = () => {
    CURRENT_PAGE.value = 1;
    PAGE_SIZE.value = 10;
    fetchOcmaData(CURRENT_PAGE.value,PAGE_SIZE.value);
};


// 1. Tabview ----------------------------------

const activeIndex = ref(0);

const tabCount = ref(0);
const onClickPrevious = () => {
    activeIndex.value--;
};

const ptTabPanel = {
    root: {
        style: 'border-right: 1px solid var(--surface-border);'
    }
};
const ptTable1 = {
    // thead: {
    //   style: 'display: block'
    // },
    rowExpansion: {
        style: 'background: #eceef1' //
    }
};

const ptTableTotal = {
    rowExpansion: {
        style: 'padding: 0'
    },
    rowExpansionCell: {
        style: 'padding: 0'
    }
};

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
};

const ptTable2 = {
    rowExpansion: {
        style: 'padding: 0'
    },
    rowExpansionCell: {
        style: 'padding: 0'
    }
};

const ptTable2_1 = {
    thead: {
        style: 'display: none'
    }
};

const ptInfoBtn = {
    icon: {
        style: 'font-size: 10px;text-align: center'
    }
};

const rowClass = (data) => {
    return [{ 'row-item': true }];
};
//-------------------------------------------------
const loadingOcma = ref(false);
const initialState = {
    Oosw: null,
    trongSo: null
};
const modelState = reactive({ ...initialState });
const visibleDetailWindow = ref(false);

const closeDetailWindow = () => {
    visibleDetailWindow.value = false;
    Object.keys(modelState).forEach((key) => {
        modelState[key] = null;
    });
    router.back();
    // initialComponent();
};

const tabToShow = reactive({
    ImpProgress: 'N', //Tiến độ thực hiện
    SumQuotes: 'N', //
    TermsOfPay: 'N',
    Origin: 'N',
    WartyPolicy: 'N',
    Other: 'N'
});

const expandedTienDoRows = ref();
const expandedDieuKhoanTTRows = ref();
const expandedXuatXuRows = ref();
const expandedCSBHRows = ref();
const expandedSLDURows = ref();
const expandedBaoGiaRows = ref();
const expandedTieuChiKhacRows = ref();

const dtDKTTModel = ref([]);
const dtTDTHModel = ref([]);
const dtXuatXuModel = ref([]);
const dtCSBHModel = ref([]);
const dtSLDUModel = ref([]);
const dtBaoGiaModel = ref([]);
const dtTieuChiKhacModel = ref([]);

const openDetailWindow = async (id) => {
    loadingOcma.value = true;
    activeIndex.value = 0;
    errorMessage.t1 = null;
    errorMessage.t2 = null;
    scoringMode.value = 1;

    router.push({ path: route.path, query: { id: id } });
    Object.keys(tabToShow).forEach((key) => {
        tabToShow[key] = 'N';
    });
    visibleDetailWindow.value = true;

    try {
        // const auto_score = await API.putAsync("ocma/mark?id="+id, null);
        const res = await API.getAsync('ocma/getbyid', { id: id });
        loadingOcma.value = false;
        if (res.status === 200) {
            Object.assign(modelState, res.data);
            modelState.Oosw = Oosw_DATA.value.find((x) => x.ID === res.data.OswID);
        } else {
            visibleDetailWindow.value = false;
            showToast('error', 'Lỗi', res.status);
        }
    } catch (ex) {
        visibleDetailWindow.value = false;
        loadingOcma.value = false;
        showToast('error', 'Lỗi', ex.message);
    }

    tabCount.value = 0;
    Object.keys(tabToShow).forEach((key) => {
        tabToShow[key] = modelState[key];
        if (modelState[key] === 'Y') tabCount.value++;
    });

    //Tiến độ thực hiện
    if (tabToShow['ImpProgress'] === 'Y')
        dtTDTHModel.value = modelState.CMA2.map((x) => ({
            item_ID: x.ID,
            item_name: x.Oitm.ItemName,
            item_quantity: x.Quantity,
            item_time_required: getTimeLabel(x.TimeNeeded, 'date'),
            item_unit: x.UomName,
            suppliers: modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S').map((z) => ({
                sup_ID: z.ID,
                sup_name: z.Ocrd.CardName,
                delivery_time: z.WPL1.find((i) => i.Cma2ID === x.ID) ? getTimeLabel(z.WPL1.find((i) => i.Cma2ID === x.ID).LeadTime, 'date') : null,
                wpl1_id: z.WPL1.find((i) => i.Cma2ID === x.ID) ? z.WPL1.find((i) => i.Cma2ID === x.ID).ID : null,
                auto_score: z.WPL1.find((i) => i.Cma2ID === x.ID) ? z.WPL1.find((i) => i.Cma2ID === x.ID).LeadTimePoint : null,
                user_score: z.WPL1.find((i) => i.Cma2ID === x.ID) ? (modelState.IsSeflPoint === 'A' ? z.WPL1.find((i) => i.Cma2ID === x.ID).SelfLeadTimePoint : z.WPL1.find((i) => i.Cma2ID === x.ID).LeadTimePoint) : null
            }))
        }));

    //Điều khoản thanh toán
    if (tabToShow['TermsOfPay'] === 'Y')
        dtDKTTModel.value = modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S').map((x) => ({
            ...x,
            cma1_id: x.ID,
            wpl2_id: x.WPL2.ID,
            expandRow: [
                { id: 1, title: 'Tạm ứng', info: x.WPL2.IsAdvReq ? `Tạm ứng ${x.WPL2.NumAdvReq}%` : 'Không', auto_score: x.WPL2.Point, user_score: modelState.IsSeflPoint === 'A' ? x.WPL2.SelfPoint : x.WPL2.Point }, //Tạm ứng
                { id: 2, title: 'Thời hạn thanh toán', info: ``, auto_score: x.WPL2.Point2, user_score: modelState.IsSeflPoint === 'A' ? x.WPL2.SelfPoint2 : x.WPL2.Point2, data: x.WPL2 } // Thời hạn thanh toán
            ]
        }));

    //Xuất xứ
    if (tabToShow['Origin'] === 'Y')
        dtXuatXuModel.value = modelState.CMA2.map((x) => ({
            item_ID: x.ID,
            item_name: x.Oitm.ItemName,
            item_quantity: x.Quantity,
            item_unit: x.UomName,
            suppliers: modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S')
                .map((z) => ({
                    sup_ID: z.ID,
                    sup_name: z.Ocrd.CardName,
                    origin: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).OriginName : null,
                    auto_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).OriginPoint : null,
                    user_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? (modelState.IsSeflPoint === 'A' ? z.WPL.find((i) => i.Cma2ID === x.ID).SelfOriginPoint : z.WPL.find((i) => i.Cma2ID === x.ID).OriginPoint) : null
                }))
                .sort((a, b) => b.auto_score - a.auto_score)
        }));

    //Chính sách bảo hành
    if (tabToShow['WartyPolicy'] === 'Y')
        dtCSBHModel.value = modelState.CMA2.map((x) => ({
            item_ID: x.ID,
            item_name: x.Oitm.ItemName,
            item_quantity: x.Quantity,
            item_unit: x.UomName,
            suppliers: modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S')
                .map((z) => ({
                    sup_ID: z.ID,
                    sup_name: z.Ocrd.CardName,
                    warranty_policy: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).WarrPolicyName : null,
                    auto_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).WarrPolicyPoint : null,
                    user_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? (modelState.IsSeflPoint === 'A' ? z.WPL.find((i) => i.Cma2ID === x.ID).SelfWarrPolicyPoint : z.WPL.find((i) => i.Cma2ID === x.ID).WarrPolicyPoint) : null
                }))
                .sort((a, b) => b.auto_score - a.auto_score)
        }));

    //Báo giá
    if (tabToShow['SumQuotes'] === 'Y')
        dtBaoGiaModel.value = modelState.CMA2.map((x) => ({
            item_ID: x.ID,
            item_name: x.Oitm.ItemName,
            item_quantity: x.Quantity,
            item_unit: x.UomName,
            suppliers: modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S')
                .map((z) => ({
                    sup_ID: z.ID,
                    sup_name: z.Ocrd.CardName,
                    sup_quantity: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).QuanCanBeSupp : null,
                    sup_price: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).Price : null,
                    auto_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? z.WPL.find((i) => i.Cma2ID === x.ID).PricePoint : null,
                    user_score: z.WPL.find((i) => i.Cma2ID === x.ID) ? (modelState.IsSeflPoint === 'A' ? z.WPL.find((i) => i.Cma2ID === x.ID).SelfPricePoint : z.WPL.find((i) => i.Cma2ID === x.ID).PricePoint) : null
                }))
                .sort((a, b) => b.auto_score - a.auto_score)
        }));

    //Tiêu chí khác
    if (tabToShow['Other'] === 'Y')
        // if(tabToShow['TermsOfPay'] === 'Y')
        dtTieuChiKhacModel.value = modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S').map((x) => ({
            ...x,
            cma1_id: x.ID,
            expandRow: x.WPL3.map((p) => ({
                wpl3_id: p.ID,
                doc_name: p.PathName,
                doc: p.Link,
                user_score: p.Point
            }))
        }));

    // console.log(tabToShow)
    expandedTienDoRows.value = [dtTDTHModel.value[0]];
    expandedDieuKhoanTTRows.value = [dtDKTTModel.value[0]];
    expandedXuatXuRows.value = [dtXuatXuModel.value[0]];
    expandedCSBHRows.value = [dtCSBHModel.value[0]];
    expandedBaoGiaRows.value = [dtBaoGiaModel.value[0]];
    expandedTieuChiKhacRows.value = [dtTieuChiKhacModel.value[0]];
    // {0: dtTieuChiKhacModel.value[0]}
};

const opInfoDKTT = ref();
const dataToView = ref();
const openInfoDKTT = (data, e) => {
    console.log(data);
    opInfoDKTT.value.toggle(e);
    dataToView.value = data;
};

const errorMessage = reactive({
    t1: null,
    t2: null
});
const validate = () => {
    if (!modelState.Oosw) {
        errorMessage.t1 = 'Hãy chọn trọng số';
    }

    if (!modelState.trongSo && tabToShow['Other'] === 'Y') {
        errorMessage.t2 = 'Hãy nhập trọng số khác';
    }
    return modelState.Oosw && (tabToShow['Other'] === 'Y' ? modelState.trongSo : true);
};
const scoringMode = ref(1);

const dtDiemTongKet = ref([]);
const expandedDiemTongKetRows = ref();
const onClickPrimary = async () => {
    if (activeIndex.value < tabCount.value - 1) {
        activeIndex.value++;
    } else if (validate()) {
        const bodyData = [];
        for (const ncc of modelState.CMA1.filter((x) => x.Status && x.Status === 'S')) {
            var obj = {
                ID: ncc.ID, //CMA1 id - Nhà cung cấp
                OswID: modelState.Oosw.ID,
                // name: ncc.Ocrd.CardName,
                TrongSo: modelState.trongSo || null,

                // WPL tổng hợp
                WPL: getWPL(ncc.ID, ncc.WPL),

                //Tiến độ thực hiện
                WPL1: dtTDTHModel._rawValue.map((x) => x.suppliers.find((i) => i.sup_ID === ncc.ID)).map((z) => ({ ID: z.wpl1_id, SelfLeadTimePoint: z.user_score })),

                //Điều khoản thanh toán
                WPL2: {
                    ID: dtDKTTModel._rawValue.find((x) => x.ID === ncc.ID).wpl2_id,
                    SelfPoint: dtDKTTModel._rawValue.find((x) => x.ID === ncc.ID).expandRow[0].user_score,
                    SelfPoint2: dtDKTTModel._rawValue.find((x) => x.ID === ncc.ID).expandRow[1].user_score
                }
            };

            // Tiêu chí khác
            if (tabToShow['Other'] === 'Y')
                obj['WPL3'] = dtTieuChiKhacModel._rawValue
                    .find((x) => x.cma1_id === ncc.ID)
                    .expandRow.map((x) => ({
                        ID: x.wpl3_id,
                        Point: x.user_score
                    }));
            bodyData.push(obj);
        }
        // console.log(bodyData);
        try {
            loadingSend.value = true;
            const res = await API.putAsync('ocma/selfpoint', bodyData);
            loadingSend.value = false;
            if (res.status === 200) {
                showToast('success', 'Thành công', 'Chấm điểm thành công');
                scoringMode.value = 2;
                try {
                    dtDiemTongKet.value = modelState.CMA2.map((x) => ({
                        item_ID: x.ID,
                        item_name: x.Oitm.ItemName,
                        item_quantity: x.Quantity,
                        item_time_required: getTimeLabel(x.TimeNeeded, 'date'),
                        item_unit: x.UomName,
                        suppliers: modelState.CMA1.filter((zz) => zz.Status && zz.Status === 'S').map((z) => {
                            var obj = {};
                            (obj['LyDo'] = null), (obj['wpl_id'] = z.WPL.find((m) => m.Cma2ID === x.ID).ID);
                            obj['sup_ID'] = z.ID;
                            obj['so_luong_cung_cap'] = z.WPL.find((z) => z.Cma2ID === x.ID).QuanCanBeSupp;
                            obj['gia_cung_cap'] = z.WPL.find((z) => z.Cma2ID === x.ID).Price;
                            obj['sup_name'] = z.Ocrd.CardName;
                            obj['tdth'] = dtTDTHModel.value.find((a) => a.item_ID === x.ID).suppliers.find((a) => a.sup_ID === z.ID).user_score;
                            obj['dktt'] = dtDKTTModel.value.find((a) => a.cma1_id === z.ID).expandRow[0].user_score + dtDKTTModel.value.find((a) => a.cma1_id === z.ID).expandRow[1].user_score;
                            obj['bg'] = dtBaoGiaModel.value.find((a) => a.item_ID === x.ID).suppliers.find((a) => a.sup_ID === z.ID).user_score;
                            obj['delivery_time'] = dtTDTHModel.value.find((a) => a.item_ID === x.ID).suppliers.find((a) => a.sup_ID === z.ID).delivery_time;
                            //--------------------------------------------------------------------------
                            if (tabToShow['Origin'] === 'Y') obj['xx'] = dtXuatXuModel.value.find((a) => a.item_ID === x.ID).suppliers.find((a) => a.sup_ID === z.ID).user_score;
                            if (tabToShow['WartyPolicy'] === 'Y') obj['csbh'] = dtCSBHModel.value.find((a) => a.item_ID === x.ID).suppliers.find((a) => a.sup_ID === z.ID).user_score;
                            if (tabToShow['Other'] === 'Y') obj['tck'] = dtTieuChiKhacModel.value.find((a) => a.cma1_id === z.ID).expandRow.reduce((a, b) => (a.user_score + b ? b.user_score : 0), 0);
                            return obj;
                        }),
                        Selected: null
                    }));
                } catch (e) {
                    console.log(e);
                }
            }
        } catch (e) {
            showToast('error', 'Lỗi', e.message);
        }
        // scoringMode.value = 2;
    }
};

const ptTable3 = {
    header: {
        style: 'background: var(--primary-color)'
    }
};

const opNHH = ref();
const showNHH = (e) => {
    opNHH.value.toggle(e);
};

const opNNLV = ref();
const showNNLV = (e) => {
    opNNLV.value.toggle(e);
};

const expandedTongKetRows = ref();
const dtKetQuaChamDiem = ref({ trung_list: [], truot_list: [] });

const loadingSend = ref(false);
const onClickKetQua = async () => {
    if (dtDiemTongKet.value.filter((x) => x.Selected).length < 1 || dtDiemTongKet.value.filter((x) => x.Selected).length < dtDiemTongKet.value.length) {
        showToast('warn', 'Cảnh báo', `Có ${dtDiemTongKet.value.length - dtDiemTongKet.value.filter((x) => x.Selected).length} vật tư hàng hoá chưa chọn nhà cung cấp.`);
    } else {
        // alert('ok');
        dtKetQuaChamDiem.value = tongHopNCCTrungThau(dtDiemTongKet.value);
        // console.log(dtKetQuaChamDiem.value);
        scoringMode.value = 3;
    }
};

const totalCounting = (data, field) => {
    let total = 0;
    for (let item of data) {
        total += item[field];
    }

    return getCurrencyLabel(total);
};

const tongHopNCCTrungThau = (array) => {
    const NhaThauList = [];
    // Duyệt lấy danh sách nhà thầu
    for (const el of array[0].suppliers) {
        NhaThauList.push({
            sup_ID: el.sup_ID,
            sup_name: el.sup_name,
            total_point: 0,
            items: []
        });
    }

    // Duyệt lấy danh sách sản phầm - nhà thầu

    for (const item of array) {
        for (const sup of item.suppliers) {
            const idx = NhaThauList.findIndex((el) => el.sup_ID === sup.sup_ID);
            NhaThauList[idx].total_point = Math.round((NhaThauList[idx].total_point + sup.total) * 100) / 100;
            if (NhaThauList[idx].sup_ID === item.Selected.sup_ID) {
                NhaThauList[idx].items.push({
                    wpl_id: item.Selected.wpl_id,
                    item_ID: item.item_ID,
                    item_name: item.item_name,
                    item_sup_price: item.Selected.gia_cung_cap,
                    item_quantity: item.Selected.so_luong_cung_cap,
                    item_unit: item.item_unit,
                    delivery_time: item.Selected.delivery_time,
                    point: Math.round(item.Selected.total * 100) / 100,
                    total_price: item.Selected.gia_cung_cap * item.Selected.so_luong_cung_cap,
                    reason_win: item.Selected.LyDo || null
                });
            }
        }
    }

    return { trung_list: NhaThauList.filter((x) => x.items.length > 0), truot_list: NhaThauList.filter((x) => x.items.length < 1) };
};

const onClickCancel = () => {
    Object.keys(modelState).forEach((key) => {
        modelState[key] = null;
    });

    fetchOcmaData(CURRENT_PAGE.value, PAGE_SIZE.value);
    visibleDetailWindow.value = false;
};

const debug = () => {
    console.log(dtDiemTongKet.value);
};

const onSelectSupSave = async () => {
    // alert('Chọn nhà thầu thắng cuộc');
    console.log(dtKetQuaChamDiem.value);
    const wpl = [];

    for (const el of dtKetQuaChamDiem.value.trung_list) {
        for (const item of el.items) {
            wpl.push({
                ID: item.wpl_id,
                Des: item.reason_win
            });
        }
    }

    try {
        loadingSend.value = true;
        const res = await API.putAsync('ocma/winbid?id=' + modelState.ID, wpl);
        if (res.status === 200) {
            showToast('success', 'Thông báo', 'Chọn nhà cung cấp thành công');
        }
    } catch (ex) {
        console.log(ex);
        showToast('error', 'Lỗi', 'Chọn nhà cung cấp bị lỗi');
    }
    loadingSend.value = false;
};

function getWPL(cma1_id, wpl) {
    const arr = [];

    for (let i = 0; i < wpl.length; i++) {
        const obj = {};
        obj['ID'] = wpl[i].ID;
        // Chính sách bảo hành
        if (tabToShow['WartyPolicy'] === 'Y') obj['SelfWarrPolicyPoint'] = dtCSBHModel.value.find((x) => x.item_ID === wpl[i].Cma2ID).suppliers.find((z) => z.sup_ID === cma1_id).user_score;
        // Xuất xứ
        if (tabToShow['Origin'] === 'Y') obj['SelfOriginPoint'] = dtXuatXuModel.value.find((x) => x.item_ID === wpl[i].Cma2ID).suppliers.find((z) => z.sup_ID === cma1_id).user_score;
        // Báo giá
        obj['SelfPricePoint'] = dtBaoGiaModel.value.find((x) => x.item_ID === wpl[i].Cma2ID).suppliers.find((z) => z.sup_ID === cma1_id).user_score;

        arr[i] = obj;
    }
    return arr;
}

//==== Lấy dữ liệu và phân trang ===================
const CURRENT_PAGE = ref(1);
const PAGE_SIZE = ref(10);
const loadingOcmaData = ref(false);
const OCMA_DATA = ref({}); //Danh sách gói thầu
const Oosw_DATA = ref([]);

const fetchOcmaData = (page, size) => {
    router.push({
        name: route.name,
        query: {
            page: page
        }
    });
    CURRENT_PAGE.value = page;
    loadingOcmaData.value = true;
    API.getAsync('ocma/getall', { page: page, size: size, q: searchKey.value })
        .then((res) => {
            loadingOcmaData.value = false;
            if (res.data) {
                OCMA_DATA.value = res.data;
            } else {
                fetchOcmaData(1, size);
            }
        })
        .catch((err) => {
            loadingOcmaData.value = false;
            console.log(err);
        });
};

const onPageChange = (event) => {
    CURRENT_PAGE.value = event.page + 1;
    PAGE_SIZE.value = event.rows;
    fetchOcmaData(CURRENT_PAGE.value, PAGE_SIZE.value);
};

// ==== Khởi tạo component =========================
onMounted(() => {
    initialComponent();
});

const initialComponent = async () => {
    // Lấy danh sách trọng số
    // const res = await API.getAsync('oosw/getall', { page: 0, size: 0 });
    // Oosw_DATA.value = res.data.data;
    if (route.query.id) {
        openDetailWindow(route.query.id);
        return;
    }
    // Nhận query là tham số page để set page hiện tại
    CURRENT_PAGE.value = route.query.page && route.query.page > 0 ? route.query.page : 1;

    // Lấy danh sách gói thầu để chấm điểm
    fetchOcmaData(CURRENT_PAGE.value, PAGE_SIZE.value);
};
//===================================================
const noFillBg = {
    loadingOverlay: {
        style: 'background: none;'
    }
};
const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: 'br',
        detail: msg,
        life: 3000
    });
};

const getTimeLabel = (date, format) => {
    const _date = new Date(date);
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    if (format === 'time') {
        Object.assign(options, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });
    }
    return new Intl.DateTimeFormat('vi-VI', options).format(_date);
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'P':
            return 'Đang nhận hồ sơ';
        case 'A':
            return 'Hoàn thành';
        case 'C':
            return 'Hủy';
        case 'I':
            return 'Đang đánh giá';
        case 'F':
            return 'Thất bại';
        case 'L':
            return 'Đã chọn nhà thầu';
        default:
            return 'Unknown';
    }
};

const getScoreStatusLabel = (val) => {
    switch (val) {
        case 'A':
            return 'Đã chấm';
        case 'T':
            return 'Lưu nháp';
        default:
            return 'Chưa chấm';
    }
};

const opendViewDetail = (id) => {
    router.push({
        path: 'scoring-list/' + id
    });
};

const getCurrencyLabel = (value) => {
    if (value) {
        let USDollar = new Intl.NumberFormat('vi-VI');
        return `${USDollar.format(value)} đ`;
    } else {
        return null;
    }
};

// const routerToSelectWinner = (id) => {
// // router.push({
// //   path: 'scoring-list/'+id+'/select-supplier'
// //  });
// }

const opendMark = (id) => {
    router.push({
        path: 'scoring-list/mark/' + id
    });
};
</script>

<style scoped>
.mw-30rem {
    max-width: 30rem;
    width: fit-content;
}

.mh-30rem {
    max-height: 30rem;
}

.scroll {
    overflow-y: auto;
}

.search-group {
    width: fit-content;
}

.search-group > input {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}

.search-group > button {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
}

.border-raduis-none {
    border-radius: 0px !important;
}

.cp-1 {
    padding: 1.25rem;
}

.code-span {
    /* background: #696d8e; */
    padding: 0.4rem;
    margin-right: 0.5rem;
    /* border-radius: 6px; */
    border: 1px solid var(--gray-500);
    color: var(--gray-500);
    font-weight: bold;
}

.h-font-bold {
    font-weight: bold;
}
</style>

<style>
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

.circel > i {
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
    /* color: white; */
    border-radius: 0;
}
.btn-input-number {
    width: 28px;
}
.btn-input-number > span {
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
