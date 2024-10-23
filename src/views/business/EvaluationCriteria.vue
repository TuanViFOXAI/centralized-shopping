<template>
  <div>
    <div class="mb-3">
      <div class="flex">
        <div class="flex align-items-center mt-0 col-6">
          <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
            DANH MỤC TIÊU CHÍ ĐÁNH GIÁ
          </h5>
        </div>
      </div>
    </div>
    <div class="grid">
      <div class="col-12">
        <div class="panel-content" style="position: relative">
          <DataTable
            v-model:expandedRows="expandedRows"
            :value="data"
            tableStyle="min-width: 50rem"
            showGridlines
            paginator
            :rows="10"
            dataKey="id"
          >
            <template #header>
              <div class="grid bg--surface-card w-full">
                <div class="flex flex-column col-6">
                  <h5 class="m-0"></h5>
                  <span class="block p-input-button">
                    <InputText :placeholder="$t('InputText.Search')" />
                    <Button icon="pi pi-search" />
                  </span>
                </div>
                <div class="col-6 flex justify-content-end">
                  <Button
                    label="Thêm Mới"
                    icon="pi pi-plus"
                    class="text-end px-3 py-2 font-medium"
                    @click="openNew()"
                  />
                  <Button
                    label="Xóa"
                    icon="pi pi-trash"
                    class="p-button-danger mx-3 text-end px-3 py-2 font-medium"
                    @click="confirmDelete(null)"
                    :disabled="!selected_data || !selected_data.length"
                  />
                </div>
              </div>
            </template>

            <Column expander style="width: 5rem" />
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="criteria" header="Tiêu chí"> </Column>
            <Column field="method" header="Phương thức"></Column>
            <Column field="description" header="Diễn giải"></Column>
            <Column field="status" header="Trạng thái"></Column>
            <template #expansion="slotProps">
              <div>
                <DataTable
                  :value="slotProps.data.children"
                  size="small"
                  v-model:selection="selected_data"
                >
                  <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                  <Column field="criteria" header="Tiêu chí"> </Column>
                  <Column field="method" header="Phương thức"></Column>
                  <Column field="description" header="Diễn giải"></Column>
                  <Column field="status" header="Trạng thái"></Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="dialogCrud"
    :style="{ width: '750px' }"
    header="titleDialog"
    :modal="true"
    class="p-fluid"
    maximizable
  >
    <div class="field">
      <label>Tên tiêu chí</label>
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
        v-model="dataEdit.criteria"
        :class="{ 'p-invalid': submitted && !dataEdit.criteria }"
      />
      <small class="p-invalid" v-if="submitted && !dataEdit.criteria"
        >Không được bỏ trống tên tiêu chí.</small
      >
    </div>
    <div class="grid">
      <div class="col-8">
        <div class="field">
          <label>Thuộc</label>
          <Dropdown />
        </div>
      </div>
      <div class="col-4">
        <div class="field">
          <label>Phương thức</label>
          <Dropdown />
        </div>
      </div>
    </div>
    <div class="field">
      <label>Diễn giải</label>
      <Textarea />
    </div>
    <template #footer>
      <Button label="Huỷ" icon="pi pi-times" outlined @click="hideDialog()" />
      <Button
        :label="dataEdit.ID ? 'Cập nhật' : 'Thêm mới'"
        icon="pi pi-check"
        :loading="loadAction"
        @click="saveData()"
      />
    </template>
  </Dialog>
</template>
<script setup>
import { ref } from "vue";

const expandedRows = ref({});
const selected_data = ref([]);
const dialogCrud = ref(false);
const data = ref([
  {
    id: 1,
    criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
    method: "Đạt/Không đạt",
    description: "",
    status: "Đang sử dụng",
    parent: 0,
    children: [
      {
        id: 2,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 1,
      },
      {
        id: 3,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 1,
      },
    ],
  },

  {
    id: 4,
    criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
    method: "Đạt/Không đạt",
    description: "",
    status: "Đang sử dụng",
    parent: 0,
    children: [
      {
        id: 5,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 4,
      },
      {
        id: 6,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 4,
      },
      {
        id: 7,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 4,
      },
      {
        id: 8,
        criteria: "Chất lượng của sản phẩm/dịch vụ, hàng hóa nguyên vật liệu cung cấp",
        method: "Đạt/Không đạt",
        description: "",
        status: "Đang sử dụng",
        parent: 4,
      },
    ],
  },
]);
const dataEdit = ref({});
const openNew = () => {
  dialogCrud.value = true;
};
</script>
