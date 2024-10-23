<template>
    <template v-if="error">
        <Authorization :title="error.title" :code="error.code" :message="error.message" />
    </template>
    <template v-else>
        <div class="px-3">
            <div class="flex justify-between align-items-center m-3">
                <h5 class="p-title mb-0 mt-0 font-bold">CHI TIẾT TÌNH TRẠNG GÓI THẦU</h5>
                <router-link to="/scoring-list">
                    <Button icon="pi pi-times" label="Đóng" outlined></Button>
                </router-link>
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
                                <div class="font-bold">Thời gian đóng thầu</div>
                                <div>{{ getTimeLabel(modelState.EndTime, 'time') }}</div>
                            </div>
                            <div class="head"></div>
                        </div>
                    </div>
                    <div class="col-4 p-0">
                        <div class="flex justify-between" :class="{ active: (timeChecker(modelState.ResultReleaseTime) && modelState.Status === 'A' ) || modelState.Status === 'A' }">
                            <div class="tail"></div>
                            <div class="content py-2 flex flex-column gap-2 justify-center">
                                <!-- <div v-if="modelState.Status == 'A'" class="font-bold">Thời gian công bố dự kiến</div> -->
                                <div v-if="modelState.Status == 'C'" class="font-bold">Gói thầu bị huỷ</div>
                                <div v-else-if="modelState.Status == 'F'" class="font-bold">Gói thầu thất bại</div>
                                <div v-else-if="modelState.Status == 'I'" class="font-bold">Thời gian công bố dự kiến</div>
                                <div v-else class="font-bold">Kết thúc</div>
                                <div>{{ getTimeLabel(modelState.ResultReleaseTime, 'time') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="loading1" class="card border-radius-none"></div>
            <div v-else class="card border-radius-none">
                <div class="grid">
                    <!-- <div class="col-12 grid m-0 px-3">
                        <div class="col-1 flex align-items-center font-bold py-0">Gói thầu:</div>
                        <div class="col-11 flex align-items-center py-0">
                            <span class="code-span"> {{ modelState.CmaCode }}</span>
                            <h5 class="p-title font-semibold m-0">{{ modelState.CmaName }}</h5>
                        </div>
                    </div> -->
                    <div class="col-12 grid m-0 p-0">
                        <div class="col-6 grid m-0">
                            <div class="col-4 font-bold">Gói thầu:</div>
                            <h5 class="col-8 p-title font-semibold m-0">{{ modelState.CmaName }}</h5>

                            <div class="col-4 font-bold">Số lượng hồ sơ:</div>
                            <div class="col-8">{{ `${modelState.CMA1.filter((x) => x.Status && x.Status === 'S').length}/${modelState.CMA1.length}` }} (đã nộp)</div>

                            <div class="col-4 font-bold">Trạng thái chấm điểm:</div>
                            <div class="col-8">{{ modelState.MarkStatus === 'A' ? 'Đã chấm điểm' : 'Chưa chấm điểm' }}</div>

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
                </div>
            </div>

            <div v-if="loading1" class="card border-radius-none p-0">
                <div>
                    <div class="card m-0 gap-3 flex p-3 border-radius-none border-b-1">
                        <Skeleton width="8rem" height="2.0rem"></Skeleton>
                        <Skeleton width="8rem" height="2.0rem"></Skeleton>
                    </div>
                    <div class="p-3">
                        <Skeleton class="w-full" height="20rem"></Skeleton>
                    </div>
                </div>
            </div>
            <div v-else class="card border-radius-none p-0">
                <TabView v-model:activeIndex="active">
                    <TabPanel header="Thống kê điểm">
                        <DataTable v-model:expandedRows="expandedTongDiemRows" :value="danhSachDiem" showGridlines>
                            <Column expander style="width: 5rem" />
                            <!-- <Column field="CMA2_ID" header="CMA2_ID" /> -->
                            <Column field="ProductName" header="Vật tư hàng hoá"></Column>
                            <Column header="Ngày cần hàng" style="width: 15%; text-align: center">
                                <template #body="sp">
                                    {{ getTimeLabel(sp.data.TimeRequrement) }}
                                </template>
                            </Column>
                            <Column field="Quantity" header="Số lượng" style="width: 10%; text-align: center"></Column>
                            <Column field="Unit" header="Đơn vị" style="width: 10%; text-align: center"></Column>
                            <template #expansion="slotProps">
                                <DataTable :rowStyle="rs1" :value="slotProps.data.Suppliers" scrollable scrollHeight="50rem">
                                    <!-- <Column field="CMA1_ID" header="CMA1"></Column> -->
                                    <!-- <Column field="IsSubmit" header="Nộp thầu ?" /> -->
                                    <Column field="Name" header="Nhà cung cấp"></Column>
                                    <Column field="TDTH" header="Tiến độ thực hiện" style="width: 10%; text-align: center" sortable></Column>
                                    <Column field="DKTT" header="Điều khoản thanh toán" style="width: 10%; text-align: center" sortable></Column>
                                    <Column v-if="tabToShow['Origin'] === 'Y'" field="XX" header="Xuất xứ" style="width: 10%; text-align: center" sortable></Column>
                                    <Column v-if="tabToShow['WartyPolicy'] === 'Y'" field="CSBH" header="Chính sách bảo hành" style="width: 10%; text-align: center" sortable></Column>
                                    <Column field="BG" header="Báo giá" style="width: 10%; text-align: center" sortable></Column>
                                    <Column v-if="tabToShow['Other'] === 'Y'" field="Khac" header="Tiêu chí khác" style="width: 10%; text-align: center" sortable></Column>
                                    <Column field="TongDiem" header="Tổng điểm" style="width: 10%; text-align: center" sortable></Column>
                                </DataTable>
                            </template>
                        </DataTable>
                    </TabPanel>
                    <TabPanel :disabled="modelState.Status !== 'A'" header="Nhà cung cấp được chọn">
                        <DataTable v-model:expandedRows="expandedTongDiemRows1" :value="danhSachDiem" showGridlines>
                            <!-- <template #header>
                                <h5 class="font-semibold m-0">Chọn nhà cung cấp</h5>
                            </template> -->
                            <Column expander style="width: 5rem" />
                            <Column field="ProductName" header="Vật tư hàng hoá"></Column>
                            <Column header="Ngày cần hàng" style="width: 15%; text-align: center">
                                <template #body="sp">
                                    {{ getTimeLabel(sp.data.TimeRequrement) }}
                                </template>
                            </Column>
                            <Column field="Quantity" header="Số lượng" style="width: 10%; text-align: center"></Column>
                            <Column field="Unit" header="Đơn vị" style="width: 10%; text-align: center"></Column>
                            <template #expansion="slotProps">
                                <DataTable v-model:selection="slotProps.data.Selected" :value="slotProps.data.Suppliers.filter((x) => x.IsWon)" scrollable scrollHeight="50rem" showGridlines>
                                    <!-- <Column headerStyle="width: 3rem">
                                        <template #body="sp">
                                            <RadioButton v-model="sp.data.IsWon" :value="true" disabled />
                                        </template>
                                    </Column> -->
                                    <!-- <Column field="WPL_ID" header="WPL_ID"></Column> -->
                                    <Column field="Name" header="Nhà cung cấp"></Column>
                                    <!-- <Column field="TDTH" header="Tiến độ thực hiện" style="width: 6rem; text-align: center"> </Column>
                                    <Column field="DKTT" header="Điều khoản thanh toán" style="width: 6rem; text-align: center"></Column>
                                    <Column field="XX" header="Xuất xứ" style="width: 6rem; text-align: center"></Column>
                                    <Column field="CSBH" header="Chính sách bảo hành" style="width: 6rem; text-align: center"></Column>
                                    <Column field="BG" header="Báo giá" style="width: 6rem; text-align: center"></Column>
                                    <Column field="Khac" header="Tiêu chí khác" style="width: 6rem; text-align: center"> </Column> -->
                                    <Column field="TongDiem" header="Tổng điểm" style="width: 8rem; text-align: center"> </Column>

                                    <Column field="Desc" header="Lý do" style="width: 20rem">
                                        <!-- <template #body="_sp"> -->
                                        <!-- <Button v-if="slotProps.data.Selected == _sp.data" size="small" icon="pi pi-comment" @click="toggle"/> -->
                                        <!-- <OverlayPanel ref="op"> -->
                                        <!-- <InputText placeholder="Lý do (tuỳ chọn)" style="width: 10rem" v-model="_sp.data.Desc" :disabled="!(slotProps.data.Selected == _sp.data)" /> -->
                                        <!-- </OverlayPanel> -->
                                        <!-- </template> -->
                                    </Column>
                                </DataTable>
                            </template>
                        </DataTable>
                        <div class="pt-3 flex justify-end" >
                            <Button icon="pi pi-forward" @click="directToDHM" label="Tạo đơn hàng mua"></Button>
                            <!-- <Button @click="() => {console.log(expandedTongDiemRows1)}" label="log" class="ml-3"></Button> -->
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </template>
    <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import API from '../../../apis/api';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Authorization from '../../../components/Authorization.vue';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading1 = ref(false);

const state = {
    Oosw: null,
    trongSo: null,
    CreatedAt: null,
    EndTime: null,
    ResultReleaseTime: null
};
const modelState = reactive({ ...state });
const error = ref(null);

const active = ref();

onMounted(() => {
    // console.log(route.query);
    if(route.query.tab == 1){
        active.value = 1;
    }
})

const directToDHM = () => {
    router.push({
        path: `/purchase-order`,
        query: {
            'bid-code': modelState.CmaCode
        }
    })
}

const tinhDiem = (data) => {
    const result = [];

    data.CMA2.forEach((prdct) => {
        let obj = {
            CMA2_ID: prdct.ID,
            OcmaID: prdct.OcmaID,
            Selected: null,
            ProductName: prdct.Oitm.ItemName,
            Quantity: prdct.Quantity,
            TimeRequrement: prdct.TimeNeeded,
            Unit: prdct.UomName,
            Suppliers: data.CMA1.map((x) => {
                let Sup_ID = x.Ocrd.ID;
                let CMA1_ID = x.ID;
                let IsSubmit = x.Status === 'S';
                let IsWon = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).IsWonTheBid : false;
                let WPL_ID = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).ID : null;
                let Name = x.Ocrd.CardName;
                let TDTH = x.WPL1.find((z) => z.Cma2ID === prdct.ID) ? x.WPL1.find((z) => z.Cma2ID === prdct.ID).FinalLeadTimePoint : 0;
                let DKTT = x.WPL2.FinalPoint;
                let XX = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalOriginPoint : 0;
                let CSBH = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalWarrPolicyPoint : 0;
                let BG = x.WPL.find((z) => z.Cma2ID === prdct.ID) ? x.WPL.find((z) => z.Cma2ID === prdct.ID).FinalPricePoint : 0;
                let Khac = x.WPL3 ? x.WPL3.map((z) => z.FinalPoint).reduce((z, _z) => z + _z, 0) : 0;
                let TongDiem = TDTH + DKTT + XX + CSBH + BG + Khac;
                let Desc = x.WPL.find((m) => m.Cma2ID === prdct.ID) ? x.WPL.find((m) => m.Cma2ID === prdct.ID).Des : '';
                return {
                    Sup_ID: Sup_ID,
                    WPL_ID: WPL_ID,
                    IsWon: IsWon,
                    CMA1_ID: CMA1_ID,
                    IsSubmit: IsSubmit,
                    Name: Name,
                    TDTH: TDTH,
                    DKTT: DKTT,
                    XX: XX,
                    CSBH: CSBH,
                    BG: BG,
                    Khac: Khac,
                    TongDiem: Math.round(TongDiem * 100) / 100,
                    Desc: Desc
                };
            }).sort((a, b) => b.TongDiem - a.TongDiem)
        };

        result.push(obj);
    });

    // console.log(result);
    return result;
};

const tabToShow = reactive({
    ImpProgress: 'N', // Tiến độ thực hiện
    SumQuotes: 'N', // Báo giá
    TermsOfPay: 'N', // Điều khoản thanh toán
    Origin: 'N', // Xuất xứ
    WartyPolicy: 'N', // Chính sách bảo hành
    Other: 'N' // Tiêu chí khác
});

const danhSachDiem = ref([]);
const expandedTongDiemRows = ref();
const expandedTongDiemRows1 = ref();
const initialComponent = async () => {
    loading1.value = true;
    try {
        // console.log(route.params.id);
        const res = await API.getAsync('ocma/getbyid', { id: route.params.id });
        // console.log(res.data);
        // Oosw_DATA.value = await getOSW_Data();
        loading1.value = false;
        Object.assign(modelState, res.data);
        // modelState.OSW = modelState.OswID != 0 ? Oosw_DATA.value.find((x) => x.ID === modelState.OswID).SwName : '';
        Object.assign(modelState, res.data);
        Object.keys(tabToShow).forEach((key) => {
            tabToShow[key] = res.data[key];
        });
        danhSachDiem.value = tinhDiem(res.data);
        expandedTongDiemRows.value = danhSachDiem.value;
        expandedTongDiemRows1.value = danhSachDiem.value;
    } catch (e) {
        showToast('error', 'Lỗi', e.message);
        console.log(e);
        let err = {
            code: e.response.status,
            title: e.response.status === 404 ? 'Not found' : e.response.data.error
        };

        switch (e.response.status) {
            case 404:
                err.message = 'Không tìm thấy gói thầu.';
                break;
            default:
                err.message = e.message;
                break;
        }

        error.value = err;
    }
};

onBeforeMount(async () => {
    await initialComponent();
});

const currentTime = new Date();

const timeChecker = (_date) => {
    if (_date) {
        const time = new Date(_date);
        if (currentTime > time) return true;
    }
    return false;
};

const getTimeLabel = (date, format) => {
    if (!date) {
        return null;
    }
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

const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: 'br',
        detail: msg,
        life: 3000
    });
};

const rs1 = (data) => {
    return data.IsSubmit ? null : { color: 'red' };
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'P':
            return 'Đang thực hiện';
        case 'A':
            return 'Hoàn thành';
        case 'C':
            return 'Hủy';
        case 'F':
            return 'Thất bại';
        case 'I':
            return 'Đang đánh giá';
        default:
            return 'Unknown';
    }
};
</script>

<style scoped>
.border-b-1 {
    border-top: 0;
    border-right: 0;
    border-left: 0;
}

.active > .tail {
    border-top: 30px solid var(--primary-color);
    border-bottom: 30px solid var(--primary-color);
}

.active > .head {
    border-left: 20px solid var(--primary-color);
}

.active > .content {
    background-color: var(--primary-color);
    color: white;
}

.content {
    width: 100%;
    text-align: center;
    background-color: #d3d4d6;
}

.tail {
    border-radius: 0px;
    border-top: 30px solid #d3d4d6;
    border-bottom: 30px solid #d3d4d6;
    border-left: 20px solid transparent;
}

.head {
    border-radius: 0px;
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-left: 20px solid #d3d4d6;
}

.border-radius-none {
    border-radius: 0px !important;
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
</style>
