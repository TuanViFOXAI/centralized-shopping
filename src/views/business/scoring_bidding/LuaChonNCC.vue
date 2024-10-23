<template>
    <template v-if="!loading1">

        <template v-if="error">
            <Authorization :title="error.title" :code="error.code" :message="error.message" />
        </template>
        <template v-else>
            <div class="px-3">
                <div class="flex justify-between align-items-center m-3">
                    <h5 class="p-title mb-0 mt-0 font-bold">LỰA CHỌN NHÀ CUNG CẤP</h5>
                    <router-link to="/scoring-list">
                        <Button icon="pi pi-times" label="Đóng" outlined></Button>
                    </router-link>
                </div>
                <!-- Timeline -->
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
                <!-- Timeline -->

                <!-- Detail biding -->
                <div class="card border-radius-none">
                    <div class="grid">
                        <!-- <div class="col-12 grid m-0">
                            <div class="col-6 grid align-items-center font-bold">
                                <span>Gói thầu:</span>
                                <h5 class="p-title font-semibold m-0 ml-2">{{ modelState.CmaName }}</h5>
                            </div>
                            <div class="col-6">
                                <div class="grid">
                                    <div class="col-5 align-items-center font-bold">
                                        Mã gói thuầu:
                                    </div>
                                    <div class="col-7">
                                        <span class="code-span"> {{ modelState.CmaCode }}</span>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                        <div class="col-12 grid m-0">
                            <div class="col-6 grid m-0">
                                <div class="col-4 font-bold">Gói thầu:</div>
                                <h5 class="col-8 p-title font-semibold m-0">{{ modelState.CmaName }}</h5>

                                <div class="col-4 font-bold">Số lượng hồ sơ:</div>
                                <div class="col-8">{{ `${modelState.CMA1.filter(x => x.Status && x.Status ===
                                    'S').length}/${modelState.CMA1.length}` }} (đã nộp)</div>

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
                    </div>
                </div>
                <!-- Detail biding -->

                <div class="card border-radius-none">
                    <!-- Chưa chấm -->
                    <template v-if="modelState.Status !== 'L'">
                        <DataTable v-model:expandedRows="expandedTongDiemRows" :value="danhSachDiem">
                            <!-- <template #header>
                                <h5 class="font-semibold m-0">Chọn nhà cung cấp</h5>
                            </template> -->
                            <Column expander style="width: 5rem" />
                            <Column field="ProductName" header="Vật tư hàng hoá"></Column>
                            <Column header="Ngày cần hàng" style="width: 15%; text-align: center;">
                                <template #body="sp">
                                    {{ getTimeLabel(sp.data.TimeRequrement) }}
                                </template>
                            </Column>
                            <Column field="Quantity" header="Số lượng" style="width: 10%; text-align: center;"></Column>
                            <Column field="Unit" header="Đơn vị" style="width: 10%; text-align: center;"></Column>
                            <template #expansion="slotProps">
                                <DataTable v-model:selection="slotProps.data.Selected" :value="slotProps.data.Suppliers.filter(x => x.IsSubmit)"
                                    scrollable selectionMode="single" scrollHeight="50rem" showGridlines>
                                    <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                                    <!-- <Column field="WPL_ID" header="WPL_ID"></Column> -->
                                    <Column field="Name" header="Nhà cung cấp"></Column>
                                    <Column sortable field="TDTH" header="Tiến độ thực hiện" style="width: 6rem; text-align: center;">
                                    </Column>
                                    <Column sortable field="DKTT" header="Điều khoản thanh toán"
                                        style="width: 6rem; text-align: center;"></Column>
                                    <Column sortable field="XX" header="Xuất xứ" style="width: 6rem; text-align: center;"></Column>
                                    <Column sortable field="CSBH" header="Chính sách bảo hành"
                                        style="width: 6rem; text-align: center;"></Column>
                                    <Column sortable field="BG" header="Báo giá" style="width: 6rem; text-align: center;"></Column>
                                    <Column sortable field="Khac" header="Tiêu chí khác" style="width: 6rem; text-align: center;">
                                    </Column>
                                    <Column sortable field="TongDiem" header="Tổng điểm" style="width: 6rem; text-align: center;">
                                    </Column>
                                    
                                    <Column header="Lý do" style="width: 10rem;">
                                        <template #body="_sp">
                                            <!-- <Button v-if="slotProps.data.Selected == _sp.data" size="small" icon="pi pi-comment" @click="toggle"/> -->
                                            <!-- <OverlayPanel ref="op"> -->
                                            <InputText placeholder="Lý do (tuỳ chọn)" style="width: 10rem;" v-model="_sp.data.Desc" :disabled="!(slotProps.data.Selected == _sp.data)" />
                                            <!-- </OverlayPanel> -->
                                        </template>
                                    </Column>
                                </DataTable>
                            </template>
                        </DataTable>
                    </template>
                    <!-- Chưa chấm -->
                    <!-- Đã chấm -->
                    <template v-else>
                        <DataTable v-model:expandedRows="expandedTongDiemRows" :value="danhSachDiem">
                            <!-- <template #header>
                                <h5 class="font-semibold m-0">Chọn nhà cung cấp</h5>
                            </template> -->
                            <Column expander style="width: 5rem" />
                            <Column field="ProductName" header="Vật tư hàng hoá"></Column>
                            <Column header="Ngày cần hàng" style="width: 15%; text-align: center;">
                                <template #body="sp">
                                    {{ getTimeLabel(sp.data.TimeRequrement) }}
                                </template>
                            </Column>
                            <Column field="Quantity" header="Số lượng" style="width: 10%; text-align: center;"></Column>
                            <Column field="Unit" header="Đơn vị" style="width: 10%; text-align: center;"></Column>
                            <template #expansion="slotProps">
                                <DataTable v-model:selection="slotProps.data.Selected" :value="slotProps.data.Suppliers.filter(x => x.IsSubmit)"
                                    scrollable scrollHeight="50rem" showGridlines>
                                    <Column headerStyle="width: 3rem">
                                        <template #body="sp">
                                            <RadioButton v-model="sp.data.IsWon" :value="true" disabled />
                                        </template>
                                    </Column>
                                    <!-- <Column field="WPL_ID" header="WPL_ID"></Column> -->
                                    <Column field="Name" header="Nhà cung cấp"></Column>
                                    <Column field="TDTH" header="Tiến độ thực hiện" style="width: 6rem; text-align: center;">
                                    </Column>
                                    <Column field="DKTT" header="Điều khoản thanh toán"
                                        style="width: 6rem; text-align: center;"></Column>
                                    <Column field="XX" header="Xuất xứ" style="width: 6rem; text-align: center;"></Column>
                                    <Column field="CSBH" header="Chính sách bảo hành"
                                        style="width: 6rem; text-align: center;"></Column>
                                    <Column field="BG" header="Báo giá" style="width: 6rem; text-align: center;"></Column>
                                    <Column field="Khac" header="Tiêu chí khác" style="width: 6rem; text-align: center;">
                                    </Column>
                                    <Column field="TongDiem" header="Tổng điểm" style="width: 6rem; text-align: center;">
                                    </Column>
                                    
                                    <Column header="Lý do" style="width: 10rem;">
                                        <template #body="_sp">
                                            <!-- <Button v-if="slotProps.data.Selected == _sp.data" size="small" icon="pi pi-comment" @click="toggle"/> -->
                                            <!-- <OverlayPanel ref="op"> -->
                                            <InputText placeholder="Lý do (tuỳ chọn)" style="width: 10rem;" v-model="_sp.data.Desc" :disabled="!(slotProps.data.Selected == _sp.data)" />
                                            <!-- </OverlayPanel> -->
                                        </template>
                                    </Column>
                                </DataTable>
                            </template>
                        </DataTable>
                    </template>
                    <!-- Đã chấm -->
                    <div class="flex mt-3 justify-end">
                        <!-- <Button :loading="loading2" icon="pi pi-save" label="Lưu chọn" @click="luuChon"></Button> -->
                        <Button :disabled="modelState.Status === 'L' || disableButtonAfterSave" :loading="loading2" icon="pi pi-save" label="Lưu chọn" @click="onClickSave"></Button>
                    </div>
                </div>
            </div>
        </template>
    </template>
    <template v-else>
        Loading
    </template>
    <Toast position="top-right" group="br" />
    <ConfirmDialog style="width: 30rem;">
        <template #message>
            <div class="block">
                <div>Kết quả nhà thầu được chọn sẽ không thể thay đổi,</div>
                <div>hãy kiểm tra lại thông tin trước khi xác nhận.</div>
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import API from '../../../apis/api';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import Authorization from '../../../components/Authorization.vue';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

const toast = useToast();
const route = useRoute();
const router = useRouter();

const disableButtonAfterSave = ref(false);

const loading2 = ref(false);
const luuChon = async (data) => {
    try{
        loading2.value = true;
        const res = await API.putAsync('ocma/winbid?id='+ modelState.ID,data);
        Object.assign(modelState, res.data);
        showToast('success', 'Thông báo', 'Chọn nhà cung cấp thành công');
        disableButtonAfterSave.value = true;
        setTimeout(() => {
            router.push({
            path: '/scoring-list/'+ modelState.ID,
            // id:
        })
        },3000)
        
    }
    catch(e){
        showToast('error', 'Lỗi', 'Chọn nhà cung cấp bị lỗi');
    }
    loading2.value = false;
}

const onClickSave = () => {
    let emptySelectCount = 0;

    const data = danhSachDiem.value.map(x => {
        if(x.Selected){
            return {
                ID : x.Selected.WPL_ID ,
                Des: x.Selected.Desc || ''
            }
        }
        else{
            emptySelectCount++;
            return null;
        }
    })

    if(emptySelectCount > 0){
        showToast('warn', 'Cảnh báo', `Còn ${emptySelectCount}/${danhSachDiem.value.length} mặt hàng chưa chọn nhà thầu`);
        return;
    }
    confirm.require({
        header: 'Bạn chắc chắn muốn lưu kết quả này?',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Chọn lại',
        rejectIcon: 'pi pi-undo',
        acceptLabel: 'Xác nhận',
        acceptIcon: 'pi pi-check',
        accept: () => {
            luuChon(data);
        },
        reject: () => {
            console.log(danhSachDiem.value);
            for(let i = 0; i < danhSachDiem.value.length; i++){
                danhSachDiem.value[i].Selected = null;
            }
        }
    });
}

const error = ref(null);
const loading1 = ref(false);
const state = {
    OswID: null,
    TrongSo: null,
    CreatedAt: null,
    EndTime: null,
    ResultReleaseTime: null,
    CMA1: []
}
const modelState = reactive({ ...state });

const tinhDiem = (data) => {
    const result = [];

    data.CMA2.forEach(prdct => {
        let obj = {
            CMA2_ID: prdct.ID,
            OcmaID: prdct.OcmaID,
            Selected: null,
            ProductName: prdct.Oitm.ItemName,
            Quantity: prdct.Quantity,
            TimeRequrement: prdct.TimeNeeded,
            Unit: prdct.UomName,
            Suppliers: data.CMA1.map(x => {
                let Sup_ID = x.Ocrd.ID;
                let CMA1_ID = x.ID;
                let IsSubmit = x.Status === 'S';
                let IsWon = x.WPL.find(m => m.Cma2ID === prdct.ID) ? x.WPL.find(m => m.Cma2ID === prdct.ID).IsWonTheBid : false;
                let WPL_ID = x.WPL.find(m => m.Cma2ID === prdct.ID) ? x.WPL.find(m => m.Cma2ID === prdct.ID).ID : null;
                let Name = x.Ocrd.CardName;
                let TDTH = x.WPL1.find(z => z.Cma2ID === prdct.ID) ? x.WPL1.find(z => z.Cma2ID === prdct.ID).FinalLeadTimePoint : 0;
                let DKTT = x.WPL2.FinalPoint;
                let XX = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalOriginPoint : 0;
                let CSBH = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalWarrPolicyPoint : 0;
                let BG = x.WPL.find(z => z.Cma2ID === prdct.ID) ? x.WPL.find(z => z.Cma2ID === prdct.ID).FinalPricePoint : 0;
                let Khac = x.WPL3 ? x.WPL3.map(z => z.FinalPoint).reduce((z, _z) => z+ _z, 0) : 0;
                let TongDiem = TDTH+DKTT+XX+CSBH+BG+Khac;
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
                    TongDiem: Math.round(TongDiem * 100) / 100
                }
            }).sort((a,b) => b.TongDiem - a.TongDiem )
        }
        
        
        result.push(obj);
    });

    // console.log(result)
    return result;
}


const expandedTongDiemRows = ref();
const danhSachDiem = ref([]);

const preInitialComponent = async () => {
    // console.log(route.params.id);
    loading1.value = true;
    try {
        const res = await API.getAsync('ocma/getbyid', { id: route.params.id }); //Get điểm ở đây
        loading1.value = false;
        
        if (res.data.Status === 'A') {
            error.value = {
                code: 409,
                title: 'Không thể chọn lại nhà cung cấp',
                message: 'Gói thầu này đã hoàn thành, không thể chọn lại nhà cung cấp.'
            };
            return;
        }
        if (res.data.Status === 'F'){
            error.value = {
                code: 409,
                title: 'Gói thầu đã thất bại',
                message: 'Gói thầu đã thất bại, không thể thự hiện thao tác chấm điểm.'
            }
            return;
        }

        if (res.data.Status === 'C'){
            error.value = {
                code: 409,
                title: 'Gói thầu đã bị huỷ',
                message: 'Gói thầu đã bị huỷ.'
            }
            return;
        }

        if (res.data.IsSeflPoint !== 'A') {
            error.value = {
                code: 409,
                title: 'Không thể chọn nhà cung cấp',
                message: 'Gói thầu này chưa được chấm điểm.'
            };
            return;
        }

        Object.assign(modelState, res.data);
        danhSachDiem.value = tinhDiem(res.data);
        expandedTongDiemRows.value = danhSachDiem.value ;
    } catch (e) {
        console.log(e)
        error.value = {
            code: e.response ? e.response.status : 500,
            title: e.response ? (e.response.status === 404 ? 'Không tìm thấy' : e.code) : e.code,
            message: e.response ? (e.response.status === 404 ? `Không tìm thấy gói thầu - id: '${route.params.id}' ` : e.code) : e.code,
        };
    }
    loading1.value = false;
}

onBeforeMount(() => {
    preInitialComponent()
})

const showToast = (severity, summary, msg) => {
    toast.add({
        severity: severity,
        summary: summary,
        group: "br",
        detail: msg,
        life: 3000,
    });
};

const scoringStatus = {
    dangthuhien: 'P',
    hoanthanh: 'A',
    huy: 'C',
    thatbai: 'F'
}

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

const timeChecker = (_date) => {
    const currentTime = new Date();
    if (_date) {
        const time = new Date(_date);
        if (currentTime > time)
            return true;
    }
    return false;
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

</script>

<style scoped>
.border-radius-none {
    border-radius: 0px !important;
}

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

.code-span {
    /* background: #696d8e; */
    padding: 0.40rem;
    margin-right: 0.5rem;
    /* border-radius: 6px; */
    border: 1px solid var(--gray-500);
    color: var(--gray-500);
    font-weight: bold;
}
</style>