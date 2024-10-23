<template>
    <Dialog @show="onShow" :closable="false" v-model:visible="props.visible" modal :style="{ width: '70rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header >
            <div class="w-full flex justify-between">
                <span class="p-dialog-title">Chọn sản phẩm</span>
                <Button class=".p-dialog-header-icon" style="width: 28px; height: 28px;" icon="pi pi-times" rounded text @click="cancelSelected"/>
            </div>
        </template>
        <div class="pn-table-header p-3 border">
            <div class="w-full flex justify-between">
                <span class="flex align-items-center">
                    Số lượng đang chọn: {{ selectedRows.length }}
                </span>
                <span class="relative">
                    <button v-if="searchKey" @click="removeSearchKey" class="absolute cancel-btn">
                        <i class="pi pi-times"></i>
                    </button>
                    <InputText class="w-20rem pr-5" @keyup="onTypeSearch" size="small" v-model="searchKey" :placeholder="$t('InputText.Search')" style="border-top-right-radius: unset; border-bottom-right-radius: unset" />
                    <Button @click="onPressSearch" size="small" icon="pi pi-search" style="border-top-left-radius: unset; border-bottom-left-radius: unset"></Button>
                </span>
            </div>
        </div>
        <div class="relative-table">
            <div class="i-table table-area border-r border-b" ref="scroll">
                <table class="p-table mt-header border-l" >
                    <thead class="p-absolute p-datatable-thead border-l border-b border-neutral-200 font-medium dark:border-white/10" >
                        <tr class="row">
                            <th style="width: 0%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content"></span></th>
                            <th style="width: 10%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content">Ảnh</span></th>
                            <th style="width: 20%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content">Mã hàng hoá</span></th>
                            <th style="width: 20%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content">Tên hàng hoá</span></th>
                            <th style="width: 25%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content">Nhóm hàng hoá</span></th>
                            <th style="width: 25%;" scope="col" class="px-4"><span class="p-column-title font-bold p-column-header-content">Ghi chú</span></th>
                        </tr>
                    </thead>
                    <tbody class="p-datatable-tbody" >
                        <tr @click.ctrl="appendItem(item)" role="row" :class="{'row-selected': selectedRows.find(x => x.ID === item.ID) }" class="c-pointer i-row border-b border-neutral-200 dark:border-white/10" v-for="(item, index) in OITM_DATA" :key="item.ID">
                            <td class="cell p-3 whitespace-nowrap" style="width: 5%;">
                                <Checkbox :id="'row-'+index" v-model="selectedRows" :value="item"></Checkbox>
                            </td>
                            <td style="width: 10%;" class="cell p-3 whitespace-nowrap">
                                <template v-if="item.Patch.length > 0">
                                    <Image preview class="p-overlay-badge" :src="item.Patch[0].Link" width="70" height="70" />
                                </template>
                                <template v-else >
                                    <Image class="p-overlay-badge" src="../../../../public/assets/pictures/No-Image.png" width="70" height="70" />
                                </template>
                            </td>
                            <td style="width: 15%;" class="cell p-3 whitespace-nowrap">{{ item.ItemCode }}</td>
                            <td style="width: 25%;" class="cell p-3 whitespace-nowrap">{{ item.ItemName }}</td>
                            <td style="width: 20%;" class="cell p-3 whitespace-nowrap">{{ item.ItmsGrpName }}</td>
                            <td style="width: 25%;" class="cell p-3 whitespace-nowrap">{{ item.UserText }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-between align-items-center">
                <span class="">
                    Giữ phím <span class="special-key">CTRL</span> để chọn nhanh
                </span>
                <span>
                    <Button icon="pi pi-times" severity="secondary" :label="$t('Button.Cancel')" @click="cancelSelected"></Button>
                    <Button :disabled="selectedRows.length < 1" icon="pi pi-check-square" :label="$t('Button.Chose')" @click="confirmSelected"></Button>
                </span>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import API from '../../../apis/api';
import { useInfiniteScroll } from '@vueuse/core';

const emit = defineEmits(["update:visible", "update:value","confirm"]);

const searchKey = ref('');
const selectedRows = ref([]);
const scroll = ref();

const dataError = ref(false);
const dataLoading = ref(false);
const totalCount = ref(0);
const hasMoreData = ref(true);
const OITM_DATA = ref([]);

const CURRENT_PAGE = ref(1);
const PAGE_SIZE = 10;

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    value: Array
});

const appendItem = (i) => {
    const idx = selectedRows.value.findIndex(item => item.ID === i.ID);
    if(idx >= 0){
        selectedRows.value.splice(idx,1);
    }
    else{
        selectedRows.value.push(i)
    }
    
}

const confirmSelected = () => {
    if(props.value){
        emit("update:value", selectedRows.value);
    }else{
        emit("confirm", selectedRows.value);
        selectedRows.value = [];
    }
    
    emit("update:visible", false);
}

const cancelSelected = () => {
    selectedRows.value = [];
    emit("update:visible", false);
}

const initialComponent = () => {
    // fetch_OITM_DATA(1,10);

}

const onShow = (e) => {
    hasMoreData.value = true;
    dataLoading.value = false;
    OITM_DATA.value = [];
    CURRENT_PAGE.value = 1;
    fetch_OITM_DATA(CURRENT_PAGE.value++, PAGE_SIZE);
}

const param = ref(
    {
        data: {
            size: 10,
            page: 1
        }
    }
);

var timer = null;

const removeSearchKey = () => {
    searchKey.value = '';
    param.value.data.q = searchKey.value;
    OITM_DATA.value = [];
    fetch_OITM_DATA(CURRENT_PAGE.value, PAGE_SIZE);
}

const onPressSearch = () => {
    OITM_DATA.value = [];
    CURRENT_PAGE.value = 1;
    param.value.data.q = searchKey.value.trim();
    fetch_OITM_DATA(CURRENT_PAGE.value, PAGE_SIZE);
}

const onTypeSearch = () => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(() => {
        onPressSearch()
    }, 800);
    
}

const fetch_OITM_DATA = (page, size) => {
    dataLoading.value = true;
    param.value.data.page = page;
    param.value.data.size = size;
    API.get_all_v2('oitm/getall',param.value)
    .then(res => {
        if(res.data.data.length > 0){
            OITM_DATA.value.push(...res.data.data.filter(x => x.IsActive === 'A'));
            totalCount.value = res.data.TotalCount;
            hasMoreData.value = res.data.HasMore;
            dataLoading.value = false;
        }else{
            loading.value = false;
            hasMoreData.value = false;
        }
    })
    .catch(err => {
        dataError.value = true;
        dataLoading.value = false;
        hasMoreData.value = false;
    })
}

useInfiniteScroll(
    scroll, () => {
        if(!dataLoading.value && hasMoreData.value)
        {
            fetch_OITM_DATA(CURRENT_PAGE.value++,PAGE_SIZE);
        }
    },
    {distance: 10}
)

onMounted(() => {
    initialComponent();
})

</script>

<style scoped>
.cancel-btn{
    display: flex;
    height: 24px;
    width: 24px;
    right: 2.5rem;
    background: none;
    border: none !important;
    cursor: pointer;
    top: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    color: rgb(255, 0, 0);
}
.cancel-btn i {
    display: flex;
}

.cancel-btn:hover{
    color: rgb(119, 8, 8);
}

.special-key{
    background: #525253;
    padding: 0.3rem;
    border-radius: 3px;
    color: #ffffff;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) -2px 3px 3px;
    margin: 0 3px;
}

.c-pointer{
    cursor: pointer;
}

.mt-header{
    margin-top: 46px;
}
.row-selected{
    background: #EFF6FF !important;
    color: var(--primary-color) !important;
}
.i-row:hover {
    background: #f3f4f6;
    color: #4b5563;
}
.border{
    border: 1px solid #d8d8d8;
}
.border-r{
    border-right: 1px solid #d8d8d8;
}
.border-l{
    border-left: 1px solid #d8d8d8;
}
.border-t{
    border-top: 1px solid #d8d8d8;
}
.border-b{
    border-bottom: 1px solid #d8d8d8;
}
.relative-table{
    position: relative;
}
.p-table{
    border-collapse: collapse;
    width: 100%;
}
.p-datatable-tbody{
    width: 100%;
}
.p-datatable-thead{
    width: calc(100% - 16px);
    z-index: 10000;
    padding: 1rem;
}
.p-absolute{
    display: block;
    position: absolute;
    background: var(--surface-ground);
    left: 0;
    top: 0;
    right: 0;
}
.i-table{
    width: 100%;
    padding: 0;
    list-style-type: none;
    margin: 0;
    height: 53vh !important;
    overflow-y: scroll;
}

</style>