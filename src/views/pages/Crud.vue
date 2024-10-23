<script setup>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, onBeforeMount } from "vue";
import ProductService from "@/service/ProductService";
import { useToast } from "primevue/usetoast";
import OFOB from "../../apis/api";

const toast = useToast();

const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
  { label: "Active", value: "1" },
  { label: "No active", value: "0" },
]);
const switchValue = ref(false);
onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  OFOB.get_all().then(
    (response) => {
      products.value = response.data.data;
    },
    (error) => {
      console.log(error);
      alert("Token hết hạn");
    }
  );
});

const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};

const hideDialog = () => {
  productDialog.value = false;
  submitted.value = false;
};

const saveProduct = () => {
  submitted.value = true;

  console.log(submitted.value);

  if (product.value.name && product.value.name.trim() && product.value.code) {
    if (product.value.id) {
      product.value.inventoryStatus = product.value.inventoryStatus.value
        ? product.value.inventoryStatus.value
        : product.value.inventoryStatus;
      products.value[findIndexById(product.value.id)] = product.value;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      const data = {
        Code: product.value.code,
        Name: product.value.name,
        status: product.value.is_wordk ? product.value.is_wordk.value : "false",
      };
      OFOB.add_new(data).then(
        (response) => {
          product.value.code = data.Code;
          product.value.name = data.Name;
          product.value.is_wordk = data.status == 1 ? "Active" : "No active";
          products.value.push(product.value);

          toast.add({
            severity: "success",
            summary: "Successful",
            detail: response.data.message,
            life: 3000,
          });
        },
        (error) => {
          alert("Thêm không thành công ");
        }
      );
    }
    productDialog.value = false;
    product.value = {};
  }
};

const editProduct = (editProduct) => {
  product.value = { ...editProduct };
  //   if (product._rawValue.is_wordk) {
  //     alert(1);
  //     switchValue.value = true;
  //   }

  console.log(editProduct);

  productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
  product.value = editProduct;
  deleteProductDialog.value = true;
};

const deleteProduct = () => {
  products.value = products.value.filter((val) => val.id !== product.value.id);
  deleteProductDialog.value = false;
  product.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Product Deleted",
    life: 3000,
  });
};

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < products.value.length; i++) {
    if (products.value[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};

const createId = () => {
  let id = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
  products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
  deleteProductsDialog.value = false;
  selectedProducts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
    life: 3000,
  });
};

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="New"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                label="Delete"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteSelected"
                :disabled="!selectedProducts || !selectedProducts.length"
              />
            </div>
          </template>

          <template v-slot:end>
            <Button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="products"
          v-model:selection="selectedProducts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">Manage Products</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" placeholder="Search..." />
              </span>
            </div>
          </template>

          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            field="code"
            header="Mã hình thức"
            :sortable="true"
            headerStyle="width:25%; min-width:10rem;"
          >
          </Column>
          <Column
            field="name"
            header="Tên hình thức"
            :sortable="true"
            headerStyle="width:25%; min-width:10rem;"
          >
          </Column>
          <Column
            field="is_wordk"
            header="Trạng thái"
            :sortable="true"
            headerStyle="width:25%; min-width:8rem;text-al"
          >
            <template #body="slotProps">
              <!-- <span class="p-column-title">Status</span> -->
              {{ slotProps.data.is_wordk == true ? "Active" : "No active" }}
            </template>
          </Column>
          <Column headerStyle="min-width:10rem;" header="Hành động" :sortable="false">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="editProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mt-2"
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="productDialog"
          :style="{ width: '450px' }"
          header="Product Details"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="ten_dv">Mã hình thức</label>
            <InputText
              id="ma_dv"
              v-model.trim="product.code"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small class="p-invalid" v-if="submitted && !product.name"
              >Mã hình thức is required.</small
            >
          </div>
          <div class="field">
            <label for="ten_dv">Tên hình thức</label>
            <InputText
              id="ten_dv"
              v-model="product.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !product.name }"
            />
            <small class="p-invalid" v-if="submitted && !product.name"
              >Tên hình thức is required.</small
            >
          </div>
          <div class="field">
            <div class="field col-6 pr-0">
              <div class="input-header">
                <h6>Trạng Thái</h6>
              </div>
              <div class="formgrid">
                <div class="#">
                  <InputSwitch v-model="product.is_wordk" />
                </div>
              </div>
            </div>
            <!-- <Dropdown
              id="inventoryStatus"
              v-model="product.inventoryStatus"
              :options="statuses"
              optionLabel="label"
              placeholder="Select a Status"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{
                    slotProps.value.label
                  }}</span>
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <span
                    :class="'product-badge status-' + slotProps.value.toLowerCase()"
                    >{{ slotProps.value }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown> -->
          </div>

          <template #footer>
            <Button
              label="Huỷ"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Lưu"
              icon="pi pi-check"
              class="p-button-text"
              @click="saveProduct"
            />
          </template>
        </Dialog>
        <!-- deleteProductDialog -->
        <Dialog
          v-model:visible="deleteProductDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
              >Are you sure you want to delete <b>{{ product.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteProduct"
            />
          </template>
        </Dialog>
        <!-- deleteProductsDialog -->
        <Dialog
          v-model:visible="deleteProductsDialog"
          :style="{ width: '450px' }"
          header="Confirm"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="product"
              >Are you sure you want to delete the selected products?</span
            >
          </div>
          <template #footer>
            <Button
              label="No"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteProductsDialog = false"
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteSelectedProducts"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
