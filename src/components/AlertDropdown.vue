<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { onClickOutside } from "@vueuse/core";
import API from "../apis/api";

const classObject = {
  info: {
    "pi-info-circle": true,
    info: true,
  },
  warning: {
    "pi-exclamation-triangle": true,
    warning: true,
  },
  danger: {
    "pi-exclamation-circle": true,
    danger: true,
  },
};
let data = null;
const props = defineProps({
  items: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: "Thông báo hệ thống",
  },
  count_noti: {
    type: Number,
    default: 0,
  },
});

const isActiveNotication = ref(false);

const el = ref();
const dialog = ref(false);
const op = ref();

onClickOutside(el, () => {
  if (!op.value.visible) isActiveNotication.value = false;
});

const toogle = () => {
  isActiveNotication.value = !isActiveNotication.value;
};

const detail = (data) => {
  dialog.value = true;
};
const toggle_1 = (event, data1) => {
  if (!data1.isRead) API.add_new_v2({}, "noti/read?id=" + data1.data.ID);
  data1.isRead = true;
  data = data1.data;
  op.value.toggle(event);
};

const gettime = (time) => {
  var now = new Date().getTime();
  var countDownDate = new Date(time).getTime();
  var distance = now - countDownDate;
  var year = Math.floor(distance / (1000 * 60 * 60 * 24 * 30 * 12));
  var month = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  if (year > 0) return year + " năm trước";
  if (month > 0) return month + " tháng trước";
  if (days > 0) return days + " ngày trước";
  if (hours > 0) return hours + " giờ trước";
  if (minutes > 0) return minutes + " phút trước";
  if (seconds > 0) return seconds + " giây trước";
};
</script>
<template>
  <div ref="el">
    <button class="p-link layout-topbar-button" @click="toogle">
      <i id="new-total" class="pi pi-bell relative">
        <span
          v-if="props.count_noti"
          id="pv_id_1_badge"
          class="p-badge p-component p-badge-danger p-badge-no-gutter absolute"
          data-pc-name="badge"
          data-pc-section="root"
          >{{ props.count_noti }}</span
        >
      </i>
    </button>
    <div class="alert" :class="{ 'alert-show': isActiveNotication }">
      <h5 class="alert-title">{{ props.title }}</h5>
      <ul class="alert-container overflow-y-auto">
        <li
          v-for="item in props.items"
          :key="item"
          class="relative mb-3 mt-3 hover:bg-primary-100 p-2 border-round"
        >
          <div class="items flex items flex">
            <div
              v-if="!item.isRead"
              class="Read"
              style="
                width: 10px;
                height: 10px;
                background-color: #2e2eff;
                border-radius: 50%;
                position: absolute;
                right: 0;
                top: 41px;
              "
            ></div>
            <div class="item-icon">
              <div class="icon">
                <i
                  @click="toggle_1($event, item)"
                  class="pi"
                  :class="classObject[item.level] || classObject.info"
                ></i>
              </div>
            </div>
            <div class="alert-content">
              <div class="item-title">
                <p class="font-bold m-0 block">{{ item.title }}</p>
                <small>{{ gettime(item.data.CreatedAt) }}</small>
              </div>
              <div class="item-content">{{ item.content }}</div>
            </div>
          </div>
        </li>
        <OverlayPanel ref="op">
          <div class="card">
            <p>Loại thông báo: Thông báo phê duyệt</p>
            <p>
              Chứng từ:
              {{ data.NotiObj.DocType == 1 ? "Kế hạch mua sắm" : "Yêu cầu mua sắm" }}
            </p>
            <p>Nội dung: {{ data.Message }}</p>
            <p>Người tạo: {{ data.NotiObj.ActorName }}</p>
            <p>
              Link:
              <a
                :href="'/report-approval-decision?id=' + data.NotiObj.WddID || 0"
                class="p-title"
                >{{ data.NotiObj.Code }}</a
              >
            </p>
          </div>
        </OverlayPanel>
      </ul>
      <div class="alert-footer">
        <li><router-link to="">Xem tất cả thông báo</router-link></li>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#pv_id_1_badge {
  display: block !important;
  top: -10px;
  left: 10px;
}
.alert-footer {
  padding: 20px;
  text-align: center;
}

.info {
  color: var(--primary-color);
}

.warning {
  color: rgb(255, 203, 33);
}

.danger {
  color: rgb(244 63 94);
}

.item-title {
  display: flex;
  justify-content: space-between;
}

.item-content {
  padding: 5px 0 0 0;
  width: 255px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.alert-content {
  margin-left: 10px;
  width: 100%;
}

a.items {
  width: 100%px;
  height: 65px;
  padding: 10px;
  color: black;
}

a.items:hover {
  background-color: #f6f9fc;
}

.item-icon {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon i {
  font-size: 24px;
}

.alert-title {
  padding: 20px;
  margin: 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.24);
  -webkit-font-smoothing: antialiased;
}
.alert-container {
  height: 400px;
  padding: 10px;
  margin: 0;
  list-style-type: none;
}
.alert {
  display: none;
  width: 350px;
  position: absolute;
  background-color: #fff;
  border: 0.3px solid rgba(0, 0, 0, 0.24);
  border-radius: 3px;
  z-index: 1000;
  top: calc(100% + 10px);
  right: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.alert.alert-show {
  display: block;
}

.badge-d {
  top: 15px;
  right: 25px;
  display: block !important;
  position: absolute;
}
/* width */
::-webkit-scrollbar {
  width: 5px;
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
.total-noti {
  position: absolute;
  top: 0;
  right: -1px;
  color: rgb(241, 132, 132);
  font-weight: 900;
}
</style>
