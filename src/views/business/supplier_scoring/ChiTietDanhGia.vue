<template>
    <div class="content-body mx-1">
        <div class="flex justify-content-between p-3">
            <h5 class="font-semibold p-title m-0 flex align-items-center">ĐÁNH GIÁ NHÀ CUNG CẤP</h5>
            <Button @click="goBack" icon="pi pi-times" label="Đóng" severity="secondary"></Button>
        </div>
        <DataTable :value="dataDanhSachNCC.filter( x => filterNCC(x, keyWord,keyStatus))">
            <template #header>
                <div class="border-bottom-1 border-200 mb-3">
                    <div class="text-2xl text-600 font-semibold text-center mb-3">
                        {{ header }}
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="p-icon-field p-icon-field-left">
                        <i class="pi pi-search"> </i>
                        <InputText v-model.lazy="keyWord" placeholder="Tìm mã, tên nhà cung cấp" />
                    </div>
                    <Dropdown v-model="keyStatus" placeholder="Trạng thái" @change="ngu" optionLabel="label"
                        optionValue="value" :options="optionsTrangThai" class="w-2"></Dropdown>
                </div>
            </template>
            <Column header="Tên nhà cung cấp">
                <template #body="sp">
                    {{ sp.data.OCRD.CardName }}
                </template>
            </Column>
            <Column field="IsMark" header="Trạng thái">
                <template #body="sp">
                    {{ sp.data.IsMark ? 'Đã đánh giá' : 'Chưa đánh giá' }}
                </template>
            </Column>
            <Column header="Thao tác" style="width:7rem;">
                <template #body="sp">
                    <div class="flex justify-content-center gap-2" style="width:7rem;">
                        <Button icon="pi pi-eye" text @click="openView(sp.data)"
                            style="padding: 5px; width: 24px; height: 24px;" />
                        <Button v-if="!sp.data.IsMark" icon="pi pi-pencil" text @click="openEvaluate(sp.data)"
                            style="padding: 5px; width: 24px; height: 24px;" />
                        <Button v-else icon="pi pi-replay" text @click="openReEvaluate(sp.data)"
                            style="padding: 5px; width: 24px; height: 24px;" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog v-model:visible="visible1" :header="OCRDSelected.CardName" modal style="width: 90rem;">
        <div class="grid m-0">
            <div class="col-9">
                <DataTable class="card border-noround p-0" :rowClass="rowClass" v-model:expandedRows="expandedRows"
                    :value="formChamDiem" :pt="ptTable">
                    <ColumnGroup type="header"></ColumnGroup>
                    <Column expander style="width: 5rem" />
                    <Column field="Name" header="Tiêu chí"></Column>
                    <Column header="Điểm" style="width: 15rem; text-align: center;">
                        <template #body="sp">
                            <!-- {{ sp.data.Childs}} -->
                            <span class="font-bold">
                                {{ sp.data.Childs.filter(el => el.score !== null).length }}/{{ sp.data.Childs.length }}
                            </span>
                        </template>
                    </Column>
                    <template #expansion="sp">
                        <div style="margin-left: 5rem" class="border-200 border-left-1">
                            <DataTable :value="sp.data.Childs" :pt="ptSubTable">
                                <ColumnGroup type="header"></ColumnGroup>
                                <!-- <Column field="ID" header="Tên tiêu chí"></Column> -->
                                <Column field="Name" header="Tên tiêu chí"></Column>
                                <Column v-if="openMode == 'edit'" header="Điểm" style="width: 15rem;">
                                    <template #body="sp">
                                        <div class="w-full">
                                            <InputNumber v-model="sp.data.score" v-if="sp.data.EvalMethods === 1"
                                                style="width: 12rem;" :min="0" :max="10"></InputNumber>
                                            <Dropdown v-model="sp.data.score" v-else-if="sp.data.EvalMethods === 2"
                                                style="width: 12rem;" :options="options_Co_Khong" optionLabel="label"
                                                optionValue="value" aria-labelledby="basic" />
                                            <Dropdown v-model="sp.data.score" v-else-if="sp.data.EvalMethods === 3"
                                                style="width: 12rem;" :options="options_Dat_Khong" optionLabel="label"
                                                optionValue="value" aria-labelledby="basic" />
                                            <span v-else>N/A</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column v-if="openMode == 'view'" header="Điểm"
                                    style="width: 15rem; text-align: center;">
                                    <template #body="sp">
                                        <!-- <span>{{ sp.data.score }}</span> -->
                                        <span v-if="sp.data.EvalMethods === 1">{{ sp.data.score != null ?
                                            `${sp.data.score}` : '-' }}</span>
                                        <span v-else-if="sp.data.EvalMethods === 2">{{ sp.data.score != null ?
                                            (sp.data.score === 10 ? 'Có' : 'Không') : '-' }}</span>
                                        <span v-else-if="sp.data.EvalMethods === 3">{{ sp.data.score != null ?
                                            (sp.data.score === 10 ? 'Đạt' : 'Không đạt') : '-' }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
            <div class="col-3">
                <div class="fixed pr-5" style="width: inherit;max-width: inherit;">
                    <div class="card border-noround p-3 pb-0">
                        <div>Tổng điểm đánh giá: <span class="font-bold">
                                {{ totalRowScore }}/{{ totalRowScoreRowCount }}
                            </span></div>
                        <div :class="{
                            'text-green-500': finalScore >= 7,
                            'text-yellow-500': finalScore >= 3.5 && finalScore < 7,
                            'text-red-500': finalScore < 3.5,
                        }" class="font-bold text-center text-xl py-4">
                            {{ finalScore }} Điểm
                        </div>
                    </div>
                    <div class="card border-noround p-3">
                        <div class="flex gap-2">Kết quả đánh giá:
                            <span v-if="totalRowScoreRowCount == 0" class="font-bold">--</span>
                            <span v-else-if="ketQuaXepHang" class="font-bold">{{ ketQuaXepHang }}</span>
                            <span class="font-bold flex align-items-center gap-1" v-else>N/A? <i @click="showTooltip" class="pi pi-question-circle text-primary cursor-pointer"></i></span>
                            <!-- <span v-tooltip="'dsadsa'">dsadsa</span> -->
                            <OverlayPanel ref="op">
                                <div class="w-30rem">
                                    <div class="font-italic mb-3">Chưa có phân loại cho điểm số: <b>{{ finalScore }}</b>, vui lòng thiết lập loại xếp hạng để thực hiện đánh giá.</div>
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-arrow-right"></i> <router-link :to="{ path: '/AssessmentCriteria', query: { r: 'openconfig' }}" v-bind="{id: 1}" class="underline text-primary">Thiết lập loại xếp hạng nhà cung cấp</router-link>
                                    </div>
                                </div>
                            </OverlayPanel>
                        </div>
                    </div>
                    <div class="card border-noround p-3 flex flex-column gap-2">
                        <div for="description">Ghi chú:</div>
                        <Textarea :readonly="openMode === 'view'" v-model="Memo" rows="2"
                            class="w-full max-h-15rem"></Textarea>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="Đóng" icon="pi pi-times" outlined @click="visible1 = false" />
            <Button :loading="loading1" v-if="openMode === 'edit'" label="Lưu" icon="pi pi-save"
                @click="saveEvaluate" />
        </template>
    </Dialog>
    <Toast position="bottom-right" />
    <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import API from "../../../apis/api";

const keyStatus = ref(null);
const toast = useToast();
const confirm = useConfirm();
const router = useRouter();
const route = useRoute();

const keyWord = ref(null);
const filterNCC = (row, key, status) => {
    if(key && status != null) {
        return row.OCRD.CardName.toLowerCase().includes(key) && row.IsMark === status;
    }
    else if(key){
        return row.OCRD.CardName.toLowerCase().includes(key);
    }
    else if(status != null){
        return row.IsMark === status;
    }
    else{
        return true;
    }
}

const Memo = ref(null);
const payLoadId = ref(null);

const op = ref();
const showTooltip = (event) => {
    console.log(event);
    op.value.toggle(event);
}


const loading1 = ref(false);
const saveEvaluate = async () => {
    loading1.value = true;
    const data = [];
    formChamDiem.value.forEach(_parent => {
        _parent.Childs.forEach(_el => {
            if (_el.score !== null) {
                data.push({
                    OcrdID: OCRDSelected.value.ID,
                    Point: _el.score,
                    ScCrID: _el.ID,
                    TargetID: payLoadId.value,
                });
            }
        })
    });

    if (data.length < 1) {
        loading1.value = false;
        return;
    }

    const payload = {
        ID: payLoadId.value,
        Memo: Memo.value,
        APDetail: data
    };

    try {
        const res = await API.postAsync('supplier-review', payload);

        if (res.status == 200) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật dánh giá thành công.', life: 3000 });
        }
        else {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra.', life: 3000 });
        }
        fetchDanhSachNCC_KyDanhGia();
        visible1.value = false;
    }
    catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: error.message });
    }
    loading1.value = false;
}

const finalScore = computed(() => {
    if (totalRowScore.value)
        return Math.round((totalRowScore.value * 100) / totalRowScoreRowCount.value) / 10;
    else
        return 0;
});

const totalRowScoreRowCount = computed(() => {
    let totalRow = 0;
    formChamDiem.value.forEach(_parent => {
        totalRow += _parent.Childs.filter(x => x.score || x.score == 0).length;
    });
    return totalRow * 10;
})

const totalRowScore = computed(() => {
    let total = 0;
    formChamDiem.value.forEach(_parent => {
        _parent.Childs.forEach(_el => {
            if (_el.score !== null) {
                total += _el.score;
            }
        })
    });
    return total;
})

var dataCacTieuChi = [];
const expandedRows = ref([]);
const formChamDiem = ref([]);

const fetchDataTieuChiDanhGia = async () => {
    const res = await API.getAsync('supplier-review/criteria');
    if (res.status === 200) {
        const _data = res.data ? res.data.filter(x => x.IsActive) : [];
        dataCacTieuChi = tranformArray(_data).map(el => ({ ...el, Childs: el.Childs.map(x => ({ ...x, score: null })) }));
    } else {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Lỗi khi lấy dữ liệu tiêu chí đánh giá' });
    }
}

const header = ref(null);
const dataDanhSachNCC = ref([]);
const fetchDanhSachNCC_KyDanhGia = async () => {
    const res = await API.getAsync('supplier-review/' + route.params.id);
    if (res.status === 200) {
        header.value = `${res.data.Name} - ${new Date(res.data.CreatedAt).getFullYear()}`;
        dataDanhSachNCC.value = res.data.Detail;
    } else {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Lỗi khi lấy dữ liệu tiêu chí đánh giá' });
    }
}

const dataBacXepHang = ref([]);
const fetchDataBacXepHang = async () => {
    const res = await API.getAsync('supplier-review/rating-type');
    if (res.status === 200) {
        dataBacXepHang.value = res.data;
    } else {
        toast.add({ severity: 'error', summary: 'Thông báo', detail: 'Lỗi khi lấy dữ liệu bảng xếp hạng' });
    }
}

const ketQuaXepHang = computed(() => {

    if (totalRowScoreRowCount.value < 1)
        return null;

    const index = dataBacXepHang.value.findIndex(x => {
        if (finalScore.value == x.StartPoint && finalScore.value == x.EndPoint) {
            return true;
        }

        if(finalScore.value == 10){
            if (finalScore.value >= x.StartPoint && finalScore.value <= x.EndPoint) {
                return true;
            }
            else {
                return false;
            }
        }

        if (finalScore.value >= x.StartPoint && finalScore.value < x.EndPoint) {
            return true;
        }
        else {
            return false;
        }

    }
    );

    return index > -1 ? dataBacXepHang.value[index].TypeName : null;
});

const initialComponent = async () => {
    // TODO: Fetch data from API
    await fetchDanhSachNCC_KyDanhGia();
    await fetchDataTieuChiDanhGia();
    await fetchDataBacXepHang();
}

onBeforeMount(() => {
    initialComponent();
});

const openMode = ref(null);

const openReEvaluate = (data) => {
    openMode.value = 'edit';
    payLoadId.value = data.ID;
    formChamDiem.value = JSON.parse(JSON.stringify(dataCacTieuChi));
    const ID = data.ID;
    const diem = dataDanhSachNCC.value.find(el => el.ID == ID);
    formChamDiem.value.forEach(
        _parent => {
            _parent.Childs.forEach(_el => {
                const o = diem.APDetail.find(
                    x => x.ScCrID == _el.ID
                );
                _el.score = o ? o.Point : null;
            });
        }
    );

    Memo.value = diem.Memo;
    OCRDSelected.value = data.OCRD;
    visible1.value = true;
    setTimeout(() => {
        expandedRows.value = formChamDiem.value;
    }, 1)
}

const visible1 = ref(false);
const OCRDSelected = ref({});
const openEvaluate = (data) => {
    openMode.value = 'edit';
    payLoadId.value = data.ID;
    formChamDiem.value = JSON.parse(JSON.stringify(dataCacTieuChi));
    Memo.value = null;
    OCRDSelected.value = data.OCRD;
    visible1.value = true;
    setTimeout(() => {
        expandedRows.value = JSON.parse(JSON.stringify(dataCacTieuChi));
    }, 1)
}

const openView = (data) => {
    openMode.value = 'view';
    formChamDiem.value = JSON.parse(JSON.stringify(dataCacTieuChi));
    const ID = data.ID;
    const diem = dataDanhSachNCC.value.find(el => el.ID == ID);
    formChamDiem.value.forEach(
        _parent => {
            _parent.Childs.forEach(_el => {
                const o = diem.APDetail.find(
                    x => x.ScCrID == _el.ID
                );
                _el.score = o ? o.Point : null;
            });
        }
    );

    Memo.value = diem.Memo;
    OCRDSelected.value = data.OCRD;
    visible1.value = true;
    setTimeout(() => {
        expandedRows.value = formChamDiem.value;
    }, 1)
}

const ngu = (e) => {
    console.log(e);
}

const optionsTrangThai = [
    {
        label: 'Chưa đánh giá',
        value: false
    },
    {
        label: 'Đã đánh giá',
        value: true
    },
    {
        label: 'Tất cả',
        value: null
    }
]

const goBack = () => {
    router.back();
}

const tranformArray = (array) => {
    let result = [];
    array.forEach((item, i) => {
        if (item.ParentID === -1) {
            item.Childs = array.filter(el => el.ParentID === item.ID);
            result.push(item);
        }
    });
    return result;
}
const ptTable = {
    rowExpansion: {
        style: 'padding: 0px;'
    },
    rowexpansioncell: {
        style: 'padding: 0px;',
        class: 'surface-50'
    },
}

const rowClass = () => {
    return [{ 'bg-blue-50': true }];
}

const options_Dat_Khong = [
    { label: 'Đạt', value: 10 },
    { label: 'Không đạt', value: 0 }
];

const options_Co_Khong = [
    { label: 'Có', value: 10 },
    { label: 'Không', value: 0 }
];

const ptSubTable = {
    footer: {
        style: 'display: none;'
    }
    // headerRow:{
    //   style: 'display: none;'
    // },
}
</script>

<style>
.p-inputnumber>input {
    width: 100%;
}

.p-icon-field {
    position: relative;
}

.p-icon-field-left>i {
    left: 0.75rem;
    color: #94a3b8;
}

.p-icon-field-left>input {
    padding-left: 2.25rem;
    /* width: calc(100% - 3.25rem); */
}

.p-icon-field>i {
    position: absolute;
    top: 50%;
    margin-top: -0.5rem;
}
</style>