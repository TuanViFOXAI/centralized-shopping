<template>
  <div>
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold uppercase">
          Thiết lập thông báo
        </h5>
      </div>
    </div>
  </div>
  <div class="card">
    <TabView>
      <TabPanel header="Loại thông báo" class="">
        <DataTable :value="TypeNotification" tableStyle="min-width: 50rem" size="small">
          <Column field="type" header="Loại" headerStyle="width:20%"></Column>
          <Column
            field="when"
            header="Gửi thông báo khi"
            headerStyle="width:50%"
          ></Column>
          <Column
            field="category"
            header="Gửi tới địa chỉ mail (Bắt buộc nhập)"
            headerStyle="width:30%"
          >
            <template #body="slotProps">
              <InputText v-model="slotProps.data.to" />
            </template>
          </Column>
        </DataTable>
        <div class="mt-5 text-right">
          <Button label="Huỷ" outlined class="mr-3" />
          <Button label="Cập nhật" />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>
<script setup>
import { ref } from "vue";

const user = JSON.parse(localStorage.getItem("user"));
alert(user["Email"]);
const TypeNotification = ref([
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
  {
    type: "Customer",
    when: "Khi tạo gói thầu",
    to: user["Email"],
  },
]);
</script>
