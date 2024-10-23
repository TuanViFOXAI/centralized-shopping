<template>
    <div class="profile-container mx-3">
        <div class="flex justify-content-between px-3 py-3">
            <h5 class="font-semibold p-title m-0 flex align-items-center">THÔNG TIN NGƯỜI DÙNG</h5>
        </div>
        <div class="profile-body grid">
            <div class="col-3">
                <div class="card mb-3">
                    <div class="avatar-container flex justify-content-center mb-3">
                        <div class="avatar relative">
                            <Image src="https://primefaces.org/cdn/primevue/images/galleria/galleria10.jpg" alt="Avatar"
                                height="120" width="120" imageClass="border-circle" class="border-circle" preview
                                :pt="ptAvatar" />
                            <Button class="upload-avatar absolute" icon="pi pi-camera"
                                style="height: 2rem; width: 2rem" />
                        </div>
                    </div>
                    <div class="body-title text-xl text-primary font-semibold">Quản lý thông tin</div>
                    <hr class="my-2" />
                    <ul class="ml-4 menu">
                        <li class="menu-item">
                            <a class="p-button-label p-button-text text-color" href="#">Thông tin người dùng</a>
                        </li>
                        <li class="menu-item">
                            <a class="p-button-label p-button-text text-color" href="#">Đổi mật khẩu</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-9">
                <div class="card mb-3 p-0">
                    <div class="card-title p-3">
                        <div class="flex justify-content-between">
                            <h5 class="text-primary m-0 font-semibold">Thông tin người dùng</h5>
                            <Button :disabled="uMode" @click="onClickEdit" icon="pi pi-pencil" text
                                style="padding: 0px; height: 24px; width: 24px;"></Button>
                        </div>
                    </div>
                    <hr class="m-0" />
                    <div class="card-content p-3">
                        <div class="grid m-0 mx-3">
                            <div class="col-3">Tên đăng nhập:</div>
                            <div class="col-9">{{ modelViewInfo.email }}</div>
                            <div class="col-3 flex align-items-center">Họ và tên:</div>
                            <div class="col-9">
                                <template v-if="uMode">
                                    <InputText v-model="modelStateInfo.name" type="text" placeholder="Nhập họ và tên" />
                                </template>
                                <template v-else>
                                    {{ modelViewInfo.name }}
                                </template>
                            </div>
                            <div class="col-3 flex align-items-center">Giới tính:</div>
                            <div class="col-9">
                                <template v-if="uMode">
                                    <Dropdown v-model="modelStateInfo.gender" :options="['Nam', 'Nữ']"></Dropdown>
                                </template>
                                <template v-else>
                                    {{ modelViewInfo.gender }}
                                </template>
                            </div>
                            <div class="col-3">Đơn vị trực thuộc:</div>
                            <div class="col-9">{{ modelViewInfo.department }}</div>
                            <div class="col-3">Chức vụ:</div>
                            <div class="col-9">{{ modelViewInfo.position }}</div>
                            <div class="col-3 flex align-items-center">Số điện thoại:</div>
                            <div class="col-9">
                                <template v-if="uMode">
                                    <InputText v-model="modelStateInfo.phone" id="phone" type="phone"
                                        placeholder="Nhập số điện thoại" />
                                </template>
                                <template v-else>
                                    {{ modelViewInfo.phone }}
                                </template>
                            </div>
                            <div class="col-3 flex align-items-center">Nhóm người dùng:</div>
                            <div class="col-9">
                                <div class="flex gap-2">
                                    <Chip v-for="(item, i) in modelViewInfo.group" :key="i" :label="item"></Chip>
                                </div>
                            </div>
                        </div>
                        <div v-if="uMode" class="card-footer mx-3 flex justify-content-end gap-2">
                            <Button type="button" @click="onClickCancel" severity="secondary" label="Huỷ"
                                class="ml-auto" />
                            <Button type="button" label="Lưu" />
                        </div>
                    </div>
                </div>
                <div class="card p-0">
                    <div class="card-title p-3">
                        <div class="flex justify-content-between">
                            <h5 class="text-primary m-0 font-semibold">Đổi mật khẩu</h5>
                        </div>
                    </div>
                    <hr class="m-0" />
                    <div class="card-content p-3">
                        <div class="flex flex-column mx-3 mb-3 gap-3 ">
                            <div class="flex flex-column gap-2">
                                <label class="p-label" for="old-pw">Mật hiện tại:</label>
                                <Password v-model="modelStatePassword.currentPassword" class="custome-pw-input"
                                    id="old-pw" toggleMask :feedback="false" />
                            </div>
                            <div class="flex flex-column gap-2">
                                <label class="p-label" for="new-pw">Mật khẩu mới:</label>
                                <Password v-model="modelStatePassword.newPassword" class="custome-pw-input" id="new-pw"
                                    toggleMask />
                            </div>
                            <div class="flex flex-column gap-2">
                                <label class="p-label" for="repeat-pw">Nhập lại khẩu mới:</label>
                                <Password v-model="modelStatePassword.repeatPassword" class="custome-pw-input"
                                    id="repeat-pw" toggleMask :feedback="false" />
                            </div>
                        </div>
                        <div class="mx-3" style="display: flex; justify-content: end;">
                            <Button @click="onClickChangePassword" type="button" label="Đổi mật khẩu" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Toast position="bottom-right" />
    <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import API from '../../../apis/api'

const confirm = useConfirm();
const toast = useToast();

const modelViewInfo = reactive({
    // TODO: Initialize user profile data
    email: 'vianhtuan1@gmail.com',
    name: 'Vi Anh Tuấn',
    gender: 'Nam',
    department: '--',
    position: 'CEO',
    phone: '0987654321',
    group: [
        'Nhóm cán bộ cấp cao', 'Nhóm Quản lý'
    ]
});

const modelStateInfo = reactive({
    // TODO: Initialize user profile data
    name: null,
    gender: null,
    phone: null,
});

const validatedPassword = () => {
    return true;
}

const modelStatePassword = reactive({
    currentPassword: null,
    newPassword: null,
    repeatPassword: null,
});

const changePassword = async (body) => {
    // const body = {
    //     Email: user.email,
    //     Password: user.currentPassword,
    //     OldPassword: user.newPassword,
    //   };
    try {
        const res = await API.postAsync("user/changepassword", body);
        if (res.status == 200) {
            toast.add({ severity: 'success', summary: 'Thành công', detail: 'Thay đ��i mật khẩu thành công', life: 3000 });
        }
        else {
            toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Thay đổi mật khẩu thất bại', life: 3000 });
        }
    }
    catch (err) {
        console.log(err);
        toast.add({ severity: 'error', summary: 'Lỗi', detail: 'Thay đổi mật khẩu thất bại', life: 3000 });
    }
}

const onClickChangePassword = () => {
    // TODO: Call API to change password
    if (!validatedPassword()) {
        return;
    }

    confirm.require({
        message: 'Bạn có muốn thay đổi mật khẩu không?',
        header: 'Xác nhận thay đổi mật khẩu',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Huỷ',
        acceptLabel: 'Xác nhận',
        accept: async () => {
            const payload = {
                Email: 'vianhtuan1072@gmail.com',
                OldPassword: modelStatePassword.currentPassword,
                Password: modelStatePassword.newPassword
            }
            // console.log(payload);
            await changePassword(payload);
        },
        reject: () => {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

const uMode = ref(false);

const onClickEdit = () => {
    uMode.value = true;
    modelStateInfo.name = modelViewInfo.name;
    modelStateInfo.gender = modelViewInfo.gender;
    modelStateInfo.phone = modelViewInfo.phone;
}

const onClickCancel = () => {
    uMode.value = false;
}

const ptAvatar = {
    button: {
        class: 'border-circle'
    }
}

</script>


<style>
.custome-pw-input {
    width: 100%;
}

.custome-pw-input>input {
    width: 100%;
}

.menu {
    margin: 0px;
    list-style-type: none;
    padding: 0px;
}

.menu-item {
    padding: 0.3rem 0;
}

.upload-avatar {
    bottom: -3px;
    right: 0px;
}
</style>