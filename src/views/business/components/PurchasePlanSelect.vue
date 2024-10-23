<template>
    <span class="w-full p-input-icon-right" >
        <InputText
            @click="openDialogView"
            v-bind="$attrs"
            class="w-full bg-white"
            type="text"
            :placeholder="textPlaceHolder()"
            style="cursor: pointer"
            readonly
            :disabled="props.disabled"
        />
        <i class="pi pi-list" style="cursor: pointer;" :style="props.disabled?'color: #c2c6cc;':null" />
    </span>
    <Dialog v-model:visible="visiableDialog" modal style="width: 60rem;" :header="props.placeholder"
        :pt="{
            header: { style: 'border-bottom: 1px solid #e5e7eb;' }
        }"
    >
        <div class="pt-5">
            <div class="grid">
                <div class="md:col-12 col-12 table">
                    <div class="t-header p-3 flex justify-end">
                        <div class="flex align-items-center justify-between ml-2 w-full">
                            <div>
                                <InputText size="small" v-model="searchKey" :placeholder="$t('InputText.Search')" style="width: 12rem;border-top-right-radius: unset; border-bottom-right-radius: unset" />
                                <Button size="small" icon="pi pi-search" style="border-top-left-radius: unset; border-bottom-left-radius: unset"></Button>
                            </div>
                            <div class="flex align-items-center pr-3">
                                <span>Đã chọn: {{ OSPL_SELECTED.length }} kế hoạch</span>
                            </div>
                        </div>
                        <div class="mx-1 t-tool flex justify-around gap-2">
                            <Button style="width: 2rem; height: 2rem;" class="" text icon="pi pi-refresh" severity="info" @click="refresh" rounded/>
                            <Button icon="pi pi-times" style="width: 2rem; height: 2rem;" rounded severity="danger" text @click="clearSelectList" />
                        </div>
                    </div>
                    <div class="data-area">
                        <div v-if="loading" class="loading flex justify-center align-items-center">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                            
                        </div>
                        <div v-if="error" class="data-error flex justify-center align-items-center">
                            <div class="flex flex-column justify-center align-items-center">
                                <div class="card flex align-items-center">
                                    <div>
                                        <i style="font-size: x-large;" class="pi pi-server"></i>
                                    </div>
                                    <div class="flex ml-4 flex-column error-message">
                                        <span>Có lỗi khi tải dữ liệu</span>
                                        <span class="p-error">{{ error }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="OSPL_DATA.length <= 0" class="data-error flex justify-center align-items-center">
                            Dữ liệu trống
                        </div>

                        <ul class="data" ref="data">
                            <li class="item" v-for="(item, i) in OSPL_DATA" :key="i">
                                <div class="i-index">
                                    <Checkbox v-model="OSPL_SELECTED" :value="item" />
                                </div>
                                <div class="item-card">
                                    <div class="item-title">
                                        {{ item.PlanCode }} - {{ item.PlanName }}
                                    </div>
                                    <div class="item-body">
                                        <span>Số lượng vật tư: {{ item.SPL2.length }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end">
                <Button icon="pi pi-times" severity="secondary" :label="$t('Button.Cancel')" @click="cancelChange"></Button>
                <Button icon="pi pi-check-square" :label="$t('Button.Chose')" @click="saveChange"></Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import {ref , onMounted} from 'vue'
import API from '../../../apis/api'
import { useInfiniteScroll } from '@vueuse/core';
const emit = defineEmits(["update:value", "after-save", "after-cancel"]);

const searchKey = ref('');
const OSPL_SELECTED = ref([]);
const error = ref(null);

const totalCount = ref(0);


const dataError = ref(false);
const OSPL_DATA = ref([])
const visiableDialog = ref(false);


const data = ref(null);
const ROWS = 10;
const CURRENT_PAGE = ref(1);
const props = defineProps({    
    value: Array,
    placeholder: {
        type: String,
        default: null
    },
    disabled: Boolean
});



import { useToast } from 'primevue/usetoast';
import i18n from '../../../locale/i18n';
const toast = useToast();
const saveChange = () => {
    // console.log(OSPL_SELECTED.value);
    if(OSPL_SELECTED.value.length > 0){
        visiableDialog.value = false;
        emit('update:value',OSPL_SELECTED.value);
        emit('after-save', null);
    }
    else{
        toast.add({
            severity: "warn",
            summary: i18n.global.t('severity.warn'),
            group: 'br',
            detail: "Bạn chưa chọn kế hoạch nào!",
            life: 3000
        });
    }
    
}

const refresh = () => {
    error.value = null;
    OSPL_DATA.value = [];
    OSPL_SELECTED.value = [];
    CURRENT_PAGE.value = 1;
    fetch_OSPL(CURRENT_PAGE.value, ROWS);
    CURRENT_PAGE.value++;
}

const cancelChange = () => {
    clearSelectList()
    visiableDialog.value = false;
    emit('update:value',OSPL_SELECTED.value);
    emit('after-cancel', null);
}

const clearSelectList = () => {
    OSPL_SELECTED.value = [];
}

const filterProductOutStock = (array) => {
    if(!array && array.length < 1){
        return []
    }
    const res = array.filter(el => {
        const count = el.SPL2.filter(p => p.OpenQuantity > 0).length;
        return count > 0;
    })
    return res
}

const fetch_OSPL = (page, size) => {
    loading.value = true;
    const param = {
        data: {
            size: size,
            page: page,
            approval: 'A'
        }
    }
    API.get_all_v2('ospl/getall',param)
    .then(res => {
        if(res.status === 200 ){
            if(res.data.data){
                OSPL_DATA.value.push(...filterProductOutStock(res.data.data));
                totalCount.value = res.data.TotalCount;
                hasMoreData.value = true;
                loading.value = false;
            }
            else{
                hasMoreData.value = false;
                loading.value = false;
            }
            
        }else{
            loading.value = false;
            hasMoreData.value = false;
        }
    })
    .catch(err => {
        error.value = err;
        dataError.value = true;
        loading.value = false;
        hasMoreData.value = false;
    })
}

const loading = ref(false);
const hasMoreData = ref(true);

useInfiniteScroll(
    data, () => {
        if(!loading.value && hasMoreData.value)
        {
            fetch_OSPL(CURRENT_PAGE.value++,ROWS);
        }
    },
    {distance: 10}
)

const textPlaceHolder = () => {
    if(props.value && props.value.length > 0){
        return `Đã chọn ${props.value.length} kế hoạch`;
    }else{
        clearSelectList();
        return props.placeholder || null;
    }
}

const initialComponent = () => {
    // fetch_OSPL(CURRENT_PAGE.value, ROWS);
    OSPL_SELECTED.value = props.value;
}

const openDialogView = () => {
    visiableDialog.value = true;
}

onMounted(() => {
    initialComponent();
})

</script>

<style scoped>
.error-message{
    border-left: 2px solid #d83232 ;
    padding-left: 0.5rem;
}

.data-area{
    position: relative;
}
.data{
    /* box-shadow: rgba(0, 0, 0, 0.35) 0px -3px 6px -3px inset; */
    background-color: #ffffffc4;
    padding: 0;
    list-style-type: none;
    margin: 0;
    height: 325px !important;
    overflow-y: scroll;
    z-index: 5;
}
.item-title, .item-body{
    margin: 5px 0;
}
.item{
    display: flex;
    background: #f3f3f3d6;
    margin: 10px;
    padding: 10px;
    border-radius: 6px;
    z-index: 1;
}

.loading{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #66666a53;
}

.data-error{
    position: absolute;
    width: 100%;
    height: 100%;
}

.table{
    border: 1px solid #e5e7eb;
    padding: 0;
}
.t-tool{
    border-left: 1px solid #e5e7eb;
    padding: 0 10px 0 10px;
    margin: auto auto;
    display: flex;
    align-items: center;
}
.i-index{
    margin: auto 15px auto 5px;
}
.t-header{
    z-index: 3;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    border-bottom: 1px solid #e5e7eb;
    width: 100%;
}

::-webkit-scrollbar {
    width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;

}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>