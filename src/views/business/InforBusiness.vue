<script setup>
import { ref } from 'vue'
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{label: 'Cơ Cấu Tổ Chức', to: '/BussinessConfig' },{ label:'Thông Tin Doanh Nghiệp', to:'/InforBussiness'}]);
const display = ref(false);
const open = () => {
    display.value = true;
};
const close = () => {
    display.value = false;
};

const model = {
    dropdownItems: [
        { name: 'Dưới 100 triệu VNĐ', code: '<100m' },
        { name: 'Từ 100 triệu đến 500 triệu VNĐ', code: '100mto500m' },
        { name: 'Từ 500 triệu đến 1 tỷ VNĐ', code: '500mto1b' },
        { name: 'Từ 1 tỷ đến 5 tỷ VNĐ', code: '1bto5b' },
        { name: 'Từ 5 tỷ đến 10 tỷ VNĐ', code: '5bto10b' },
        { name: 'Từ 10 tỷ đến 50 tỷ VNĐ', code: '10bto50b' },
        { name: 'Trên 50 tỷ VNĐ', code: '>50b' }
    ],
    tenDoanhNghiep: 'Nhà cung cấp ABC',
    masothue: '37219273',
    empl: 123,
    dscription: 'Doanh nghiệp ABC là doanh nghiệp lâu đời được thành lập từ 19xx, chuyên cung cấp nhu cầu về XYZ',
    website: 'https://example.com/'
}

//Panel Menu

//End Panel Menu


const score = ref(37)
const founderYear = ref(1999);

const countScore = () => {
    const maxScore = 100;
    let _score = 0;
    return _score;
}

</script>

<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" style="border: none; background-color: inherit;" />
    <div class="bg-green-700 rounded my-3">
        <div class="grid px-5">

            <div class="flex align-items-center col-6">
        <h5 style="color: #0773bb" class="text-black m-2 p-2 mb-0 mt-0 font-semibold">
          cƠ CẤU TỔ CHỨC
        </h5>
      </div>
            <div class="col-6 flex fl-end">
                <Button class="text-end px-3 py-2 font-medium" label="Thêm Cơ Cấu" icon="pi pi-pencil" style=""
                    @click="open" />
                <!-- <Button type="cancel" class="p-button-secondary" label="Huỷ" icon="pi pi-times" /> -->
            </div>
        </div>
    </div>

    <div class="grid">
        <div class="md:col-9 col-12">
            <div class="card">
                <div>
                    <div class="grid p-fluid m-3">
                        <TabView class="overflow-x-auto">
                            <TabPanel header="Thông tin cơ bản">
                                <p class="line-height-3 m-0">
                                <div class="p-fluid formgrid grid">
                                    <div class="field ">
                                        <!-- <label class="font-bold" for="tendoanhnghiep">Tên doanh nghiệp:</label> -->
                                        <label class="block ml-5">{{ model.tenDoanhNghiep }}</label>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label class="font-bold" for="tendoanhnghiep">Website:</label>
                                        <a :href="model.website"
                                            class="font-medium text-blue-600 dark:text-blue-500 hover:underline block ml-5">{{
                                                model.website }}</a>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label class="font-bold" for="tendoanhnghiep">Mã số thuế:</label>
                                        <label class="block ml-5">{{ model.masothue }}</label>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label class="font-bold" for="employees">Số lượng nhân viên:</label>
                                        <label class="block ml-5">{{ model.empl }} (Nhân viên)</label>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label class="font-bold" for="employees">Năm thành lập:</label>
                                        <label class="block ml-5">{{ founderYear }}</label>
                                    </div>

                                    <div class="field col-12 md:col-4 ">
                                        <label class="font-bold" for="employees">Doanh thu:</label>
                                        <label class="block ml-5">{{ model.dropdownItems[3].name }}</label>

                                    </div>
                                    <div class="field col-12">
                                        <label class="font-bold" for="employees">Mô tả:</label>
                                        <label class="block ml-5">{{ model.dscription }}</label>
                                    </div>
                                    <!-- <div class="field col-12 md:col-3">
                                    <label for="zip">Zip</label>
                                    <InputText id="zip" type="text" />
                                </div> -->
                                </div>
                                </p>
                            </TabPanel>
                            <TabPanel header="Liên hệ">
                                <p class="line-height-3 m-0">
                                <div class="p-fluid formgrid grid">
                                    <div class="field col-12 md:col-7">
                                        <label for="address1">Email </label>
                                        <InputText v-model="address1" id="address1" type="text" />
                                    </div>
                                    <div class="field col-12 md:col-5">
                                        <label for="address2">Số điện thoại</label>
                                        <InputText v-model="address2" id="address2" type="text" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="address2">Địa chỉ</label>
                                        <InputText v-model="address2" id="address2" type="text" />
                                    </div>
                                    <div class="field col-12 md:col-3">
                                        <label for="address2">Tỉnh</label>
                                        <InputText v-model="address2" id="address2" type="text" />
                                    </div>
                                    <div class="field col-12 md:col-3">
                                        <label for="address2">Quốc gia</label>
                                        <InputText v-model="address2" id="address2" type="text" />
                                    </div>
                                    <div class="field col-12 md:col-4 ">
                                        <label for="city">Thành phố</label>
                                        <InputText v-model="city" id="city" />
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="postalCode">Mã bưu chính</label>
                                        <InputText id="postalCode" v-model="postalCode" type="text" />
                                    </div>

                                    <div class="field col-12 md:col-4 ">
                                        <label for="state">Doanh thu</label>
                                        <Dropdown class="" id="state" v-model="doanhThu" :options="model.dropdownItems"
                                            optionLabel="name" placeholder="Lựa chọn"></Dropdown>
                                    </div>

                                    <!-- <div class="field col-12 md:col-3">
                                    <label for="zip">Zip</label>
                                    <InputText id="zip" type="text" />
                                </div> -->
                                </div>

                                </p>
                            </TabPanel>
                            <TabPanel header="Loại hình kinh doanh">
                                <p class="line-height-3 m-0">
                                <div class="p-fluid formgrid grid"></div>
                                </p>
                            </TabPanel>
                        </TabView>
                        <Dialog @keypress.enter="close" header="Thiết lập nhà cung cấp" v-model:visible="display" maximizable
                            :breakpoints="{ '960px': '75vw' }" :style="{ width: '70vw' }" :modal="true">
                            <div class="border-bottom border-solid border-1 border-inherit">
                                <div class="block border-b-1 border-inherit p-3 bg-current">
                                    <label class="font-bold">Thông tin doanh nghiệp</label>
                                </div>
                                <div class="grid m-5">
                                    <div class="lg:col-4 col-12 p-0">
                                        <div class="field grid">
                                            <label for="name3" class="col-12 md:col-4 md:mb-0">Tên doanh nghiệp</label>
                                            <div class="col-12 md:col-8">
                                                <InputText :value="model.tenDoanhNghiep" id="name3" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lg:col-4 col-12 p-0">
                                        <div class="field grid">
                                            <label for="name3" class="col-12 md:col-4 md:mb-0">Mã số thuế (Tax)</label>
                                            <div class="col-12 md:col-8">
                                                <InputText :value="model.masothue" id="name3" type="text" disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <template #footer>
                                <Button label="Lưu" @click="close" icon="pi pi-check" />
                                <Button label="Huỷ" @click="close" icon="pi pi-times" class="p-button-secondary" />
                            </template>
                        </Dialog>

                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="md:col-3 col-12">
            <div class="card">
                <div class="card-w-title">
                    <h5>Hoàn thiện hồ sơ</h5>
                </div>
                <ProgressBar :value="score" :showValue="true"></ProgressBar>
                <hr>
                <p>
                    Điểm hoàn thiện hồ sơ là căn cứ để hệ thống chấm điểm doanh nghiệp, giúp cho doanh nghiệp tăng cơ
                    hội được trúng thầu.
                </p>
            </div>
        </div> -->
      
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.p-dialog-content{
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
    border-bottom: 1px solid
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
.card{
    height: calc(100vh - 9rem);
}

</style>