<template>
  <div class="card mx-auto mt-5" style="border-radius: 53px; width: 500px">
    <div class="text-center mb-5">
      <img
        style="width: 120px; height: auto"
        src="../../../../public/Logo-Footer.svg"
        alt="Image"
        class="mb-3"
      />
      <div class="text-900 text-3xl font-medium mb-3">
        {{ $t("login.header") }}
      </div>
      <span class="text-600 font-medium">Cấp lại mật khẩu</span>
    </div>
    <div class="grid">
      <div class="col-12 p-fluid">
        <div class="field">
          <label>Nhập Email khôi phục mật khẩu</label>
          <span
            style="
              color: #eb5757;
              font-size: 16px;
              font-family: Open Sans;
              font-weight: 400;
              word-wrap: break-word;
              margin-left: 3px;
            "
            >*</span
          >

          <InputText
            :required="true"
            autofocus
            aria-required="true"
            @keyup.enter="ResetPassWord()"
            v-model="Email"
            :class="{ 'p-invalid': submitted && mess }"
          />
          <small class="p-invalid" v-if="submitted">{{ mess }}</small>
        </div>
        <div class="col-12">
          <Button
            @click="ResetPassWord()"
            label="Cấp lại mật khẩu"
            class="text-end px-3 py-2 font-medium"
            :loading="loadding"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import AppLayout from "@/layout/AppLayout.vue";

const submitted = ref(false);
const Email = ref(null);
const mess = ref(null);
const loadding = ref(false);

const getError = () => {
  mess.value = null;
  if (!Email.value) mess.value = "Không được bỏ trống Email";

  if (!/^[^@]+@\w+(\.\w+)+\w$/.test(Email.value))
    mess.value = "Vui lòng nhập đúng định dạng email";

  if (mess.value) {
    loadding.value = false;
    return false;
  } else {
    loadding.value = true;
    return true;
  }
};
const ResetPassWord = (email) => {
  submitted.value = true;
  loadding.value = true;
  if (getError()) {
    alert("Ok");
  } else {
    alert("No");
  }
};
</script>

<style scoped>
.changeLanggue {
  display: flex;
  justify-content: space-around;
  padding-top: 5px;
}
.languege-span {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
}
.button-flag {
  background: none;
  border: none;
}

.inner-image {
  height: 15px;
  padding-right: 6px;
}
</style>
