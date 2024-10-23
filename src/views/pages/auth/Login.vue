<script setup>
import { onBeforeMount, ref, watch } from "vue";
import i18n from "../../../locale/i18n";
import cookie from "../../../service/CookieService";

const selectLanguege = (lang) => {
  langCK.value = lang;
  cookie.set("lang", lang, 365);
  i18n.global.locale.value = lang;
};
const langCK = ref(null);

onBeforeMount(() => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("activeMenuItem");
  langCK.value = cookie.get("lang");
});
</script>
<template>
  <div
    class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"
  >
    <div class="flex flex-column align-items-center justify-content-center">
      <div class="card card-login">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img
              src="../../../assets/img/logo/Logo_Original.png"
              alt="Image"
              class="mb-3 logo-login"
            />
            <div class="text-900 text-3xl font-medium mb-3">
              {{ $t("login.header") }}
            </div>
            <span class="text-600 font-medium">{{ $t("login.sub_header") }}</span>
          </div>
          <form @submit="handleLogin">
            <div>
              <label for="username1" class="block text-900 text-xl font-medium mb-2">{{
                $t("login.user_name")
              }}</label>
              <InputText
                id="username1"
                type="text"
                :placeholder="$t('login.inner_user_name')"
                class="w-full md:w-30rem mb-3"
                style="padding: 1rem"
                v-model.trim="username"
                @keyup.enter="handleLogin"
              />
              <p id="username-help" class="p-error" v-if="errors_login.username != null">
                {{ $t("login." + errors_login.username) }}
                <!-- {{ errors_login.username }} -->
              </p>
              <label for="password1" class="block text-900 font-medium text-xl mb-2">{{
                $t("login.password")
              }}</label>
              <Password
                id="password1"
                v-model="password"
                :placeholder="$t('login.inner_password')"
                :toggleMask="true"
                class="w-full md:w-30rem mb-3"
                inputClass="w-full"
                :feedback="false"
                :inputStyle="{ padding: '1rem' }"
                required
                @keyup.enter="handleLogin"
              ></Password>
              <p id="passwor-help" class="p-error" v-if="errors_login.password != null">
                {{ $t("login." + errors_login.password) }}
              </p>

              <div class="flex align-items-center justify-content-between mb-5 gap-5">
                <div class="flex align-items-center">
                  <Checkbox id="rememberme1" binary class="mr-2"></Checkbox>
                  <!-- v-model="checked" -->
                  <label for="rememberme1">{{ $t("login.remember_password") }}</label>
                </div>
                <a
                  class="font-medium no-underline ml-2 text-right cursor-pointer"
                  style="color: var(--primary-color)"
                  href="forgot-password"
                  >{{ $t("login.forget_password") }}</a
                >
              </div>
              <div class="form-group mb-3">
                <div v-if="message" class="alert alert-danger" role="alert">
                  <p id="username-help" class="p-error">{{ message }}</p>
                </div>
              </div>
              <Button
                :label="$t('login.log_in')"
                class="mr-2 mb-2 w-full p-3 text-xl md:w-30rem"
                v-on:click="handleLogin"
                :loading="loading"
              ></Button>
              <div class="changeLanggue mt-3">
                <button
                  type="button"
                  @click="selectLanguege('vi')"
                  class="button-flag"
                  :class="{ 'font-bold': langCK == 'vi' }"
                >
                  <span class="languege-span">
                    <img
                      src="../../../../public/demo/images/flag/vi.svg"
                      alt=""
                      class="inner-image"
                    />
                    <p class="inner-content">{{ $t("login.vi_lang") }}</p>
                  </span>
                </button>
                <button
                  type="button"
                  @click="selectLanguege('en')"
                  class="button-flag"
                  :class="{ 'font-bold': langCK == 'en' }"
                >
                  <span class="languege-span">
                    <img
                      src="../../../../public/demo/images/flag/en.svg"
                      alt=""
                      class="inner-image"
                    />
                    <p class="inner-content">{{ $t("login.en_lang") }}</p>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Form, ErrorMessage } from "vee-validate";

export default {
  name: "Login",
  components: {
    Form,
    ErrorMessage,
  },
  data() {
    return {
      loading: false,
      validEmail: true,
      validPassword: true,
      message: "",
      username: "",
      password: "",
      errors_login: {
        username: null,
        password: null,
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    handleLogin() {
      this.validateEmail();
      this.validatePassword();
      const user = {
        username: this.username,
        password: this.password,
      };
      this.errors_login.username = null;
      this.errors_login.password = null;
      if (!this.username) this.errors_login.username = "username_required";
      if (!this.password) this.errors_login.password = "password_required";
      if (!this.validEmail) this.errors_login.username = "invalid_email";
      if (!this.validPassword) this.errors_login.password = "invalid_password";

      if (this.errors_login.username != null || this.errors_login.password != null)
        return;

      this.loading = true;
      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    validateEmail() {
      if (this.username.trim() != "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.validEmail = regex.test(this.username);
      }
    },
    validatePassword() {
      // if (this.password.trim() != "") {
      //   const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      //   this.validPassword = regex.test(this.password);
      // }
    },
  },
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
.logo-login {
  width: 100px;
  height: auto;
}
.card-login {
  width: 550px;
  border-radius: 56px;
  padding: 0.3rem;
  background: linear-gradient(
    180deg,
    var(--primary-color) 10%,
    rgba(33, 150, 243, 0) 30%
  );
}
</style>
