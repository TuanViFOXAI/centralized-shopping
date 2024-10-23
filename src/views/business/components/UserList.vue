<template>
    <div class="list-area">
        <ul class="ul-list" ref="listEl">
            <li class="li-list flex align-items-center" name="user"  v-for="item in users" :key="item.ID">
                <Checkbox :inputId="item.ID" v-model="usersSelected" name="item" class="ml-3" :value="item" />
                <label class="li-list flex align-items-center" :for="item.ID">
                    <div class="avatar">
                    <Avatar :image="item.image" shape="circle" />
                    </div>
                    <div class="label" :for="item.ID.toString()">
                        <span>{{ item.UserName }} - {{ item.ID }}</span>
                    </div>
                </label>
            </li>
            <li v-if="loading && !errorLoad && hasMoreData" class="loading">
                <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="8" fill="var(--surface-ground)"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </li>
            <div v-if="errorLoad" class="flex h-full" style="justify-content: center;align-items: center;">
                <i class="pi pi-times" style="font-size: 1.5rem"></i>
                <span class="center">Fail to load data</span>
            </div>
            <div v-if="firstLoading" class="flex h-full" style="justify-content: center;align-items: center;">
                <ProgressSpinner  style="width: 20px; height: 20px" strokeWidth="8" fill="var(--surface-ground)"
                animationDuration=".5s" aria-label="Custom ProgressSpinner" />
            </div>
            
        </ul>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import API from '../../../apis/api'
import { useInfiniteScroll } from '@vueuse/core';

const firstLoading = ref(true);
const listEl = ref(null);
const hasMoreData = ref(false);
const userToShow = 20;
const currentPage = ref(0);
const users = ref(null);
const loading = ref(true);
const errorLoad = ref(false);
const usersSelected = ref([]);

const onSelectUser = (item) => {
    usersSelected.value.push(item);
}

const getUsers = (size, page) => {
    loading.value = true;
    const param = {
        data: {
            size: size,
            page: page
        }
    }
    API.get_all_v2('user/getall',param)
    .then(res => {
        users.value = res.data.data;
        hasMoreData.value = res.data.has_more;
        loading.value = false;
        errorLoad.value = false;
        firstLoading.value = false;
    })
    .catch(err => {
        errorLoad.value = true;
        firstLoading.value = false;
    })
}

const  getUsersOnScroll = () => {
    loading.value = true;
    if(hasMoreData.value){
        const param = {
        data: {
            size: userToShow,
            page: currentPage.value = currentPage.value + 1
        }
        }
        API.get_all_v2('user/getall',param)
        .then(res => {
            if(res.data.data){
                users.value.push(...res.data.data);
                hasMoreData.value = res.data.has_more;
                loading.value = false;
                errorLoad.value = false;
            }
        })
        .catch(err => {
            errorLoad.value = true;
        })
    }
}

onMounted(() => {
    getUsers(userToShow, currentPage.value)
})

useInfiniteScroll(
    listEl, () => {
        if(!loading.value)
        {
            getUsersOnScroll()
        }
    },
    {distance: 10}
)
</script>
  
<style scoped>
.loading{
    text-align: center;
    line-height: 3rem;
}
.list-area {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    height: 100% !important;
    width: 100%;
    padding: 0.4rem;
    background: #fff;
}

.avatar {
    padding-left: 10px;
}

.ul-list {
    padding: 10px;
    list-style-type: none;
    padding: 0;
    margin: 0;
    height: 100%;
    overflow-y: scroll;
}

.li-list:hover {
    background: var(--surface-hover);
    /* border-left: 2px solid var(--blue-300); */
}

.li-list {
    cursor: pointer;
    padding: 5px 0 5px 0;
    display: flex;
    width: 100%;
}

.label {
    padding-left: 10px;
    margin: auto;
    width: 100%;
}

::-webkit-scrollbar {
    width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}</style>