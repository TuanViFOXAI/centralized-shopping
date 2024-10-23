<script setup>
import { isRef, onBeforeMount, onMounted, reactive, ref, toRaw, unref } from "vue";
import { useToast } from "primevue/usetoast";
import TreeArray from "./components/TreeArray.vue";
import TreeArraySelect from "./components/TreeArraySelect.vue";
import API from "../../apis/api";

const toast = useToast();
const visibleDialog = ref(false);
const loadedCCTC = ref(false);
const loadedCTC = ref(false);
const dialogLabel = ref({ Case: 0, Title: "", PrimaryButton: "", SecondaryButton: "" });
const isValidate = ref(false);
const errorMessages = reactive({
  cardName: null,
  cardCode: null,
  father: null,
  level: null,
  isActive: null,
});
const displayConfirmationDeleteRows = ref(false);
const canDeleteRows = ref(true);
const itemsMenu = ref([
  {
    label: "Tuỳ chọn",
    items: [
      {
        label: "Thay đổi trạng thái",
        command: (e) => {
          alert("Thay đổi trạng thái");
        },
      },
      {
        label: "Xoá các dòng đã chọn",
        command: () => {
          selectedRows.value.forEach((element) => {
            if (element.children && element.children.length > 0) {
              canDeleteRows.value = false;
            }
          });
          displayConfirmationDeleteRows.value = true;
        },
      },
    ],
  },
]);
const searchText = ref(null);
const nodeSelected = ref(null);
const idsToDelete = ref(null);
const selectedRows = ref([]);
const model = reactive({
  id: null,
  card_code: null,
  card_name: null,
  father: null,
  father_name: null,
  level: null,
  level_name: null,
  level_description: null,
  is_active: "A",
  tree_level: null,
  children: [],
});
const status = ref([
  { name: "Đang hoạt động", code: "A" },
  { name: "Không hoạt động", code: "I" },
]);
const displayConfirmDelete = ref(false);
const menu = ref();
const CCTC_model = reactive({ ...model });
const API_CCTC_DATA = ref([]);
const API_CTC_DATA = ref([]);

//Loading flag
const loading = ref(false);

onMounted(() => {
  //API lấy dữ liệu cho Cơ cấu tổ chức
  API.get_tree("organizational-structure/get-all").then(
    (res) => {
      //Lấy dữ liệu thành công
      if (res.data.success) {
        API_CCTC_DATA.value = [res.data.data];
        nodeSelected.value = res.data.data;
        loadedCCTC.value = true;
      }
      //Dữ liệu lỗi
      else {
        loadedCCTC.value = false;
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: res.data.message,
          life: 3000,
        });
      }
    },
    //Lỗi mạng
    (err) => {
      loadedCCTC.value = false;
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: err,
        life: 3000,
      });
    }
  );
  API.get_tree("organizational-level/get-all").then(
    (res) => {
      if (res.data.success) {
        API_CTC_DATA.value = res.data.data;
        loadedCTC.value = true;
      }
      //Dữ liệu lỗi
      else {
        loadedCTC.value = false;
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: res.data.message,
          life: 3000,
        });
      }
    },
    (err) => {
      loadedCTC.value = false;
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: err,
        life: 3000,
      });
    }
  );
});

const toggleMenuSelect = (event) => {
  menu.value.toggle(event);
};

const onSelectNode = (node) => {
  nodeSelected.value = node;
};

//Reset form nhập liệu
const resetForm = () => {
  Object.assign(CCTC_model, model);
};

//Mở form thêm mới dữ liệu
const openAdd = () => {
  resetForm();
  dialogLabel.value = {
    Case: 1,
    Title: "Thêm mới cơ cấu tổ chức",
    PrimaryButton: "Thêm",
    SecondaryButton: "Huỷ",
  };
  showDialog();
  //gán id father là id của node đang chọn ở cây bên trái
  CCTC_model.father = nodeSelected.value.id;
  errorMessages.father = null;
};

const openUpdate = () => {
  dialogLabel.value = {
    Case: 2,
    Title: "Chỉnh sửa cơ cấu tổ chức",
    PrimaryButton: "Lưu",
    SecondaryButton: "Huỷ",
  };
  CCTC_model.id = nodeSelected.value.id;
  CCTC_model.card_code = nodeSelected.value.card_code;
  CCTC_model.card_name = nodeSelected.value.card_name;
  CCTC_model.father = nodeSelected.value.father;
  CCTC_model.father_name = nodeSelected.value.father_name;
  CCTC_model.level = nodeSelected.value.level;
  CCTC_model.level_name = nodeSelected.value.level_name;
  CCTC_model.is_active = nodeSelected.value.is_active;
  showDialog();
  errorMessages.father = null;
};

//Người dùng update ở bảng
const openUpdateChild = (element) => {
  dialogLabel.value = {
    Case: 2,
    Title: "Chỉnh sửa cơ cấu tổ chức",
    PrimaryButton: "Lưu",
    SecondaryButton: "Huỷ",
  };
  CCTC_model.id = element.id;
  CCTC_model.card_code = element.card_code;
  CCTC_model.card_name = element.card_name;
  CCTC_model.father = element.father;
  CCTC_model.father_name = element.father_name;
  CCTC_model.level = element.level;
  CCTC_model.level_name = element.level_name;
  CCTC_model.is_active = element.is_active;
  showDialog();
  errorMessages.father = null;
};

const checkValidate = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
  isValidate.value =
    CCTC_model.card_code &&
    CCTC_model.card_code.trim() &&
    CCTC_model.card_name &&
    CCTC_model.card_name.trim() &&
    CCTC_model.father &&
    CCTC_model.level &&
    CCTC_model.is_active &&
    CCTC_model.id != CCTC_model.father;
  // Validation for each field
  if (!CCTC_model.card_name || !CCTC_model.card_name.trim()) {
    errorMessages.cardName = "Tên đơn vị không được trống";
  }

  if (!CCTC_model.card_code || !CCTC_model.card_code.trim()) {
    errorMessages.cardCode = "Mã đơn vị không được trống";
  }

  // if (!CCTC_model.father) {
  //   errorMessages.father = "Thuộc đơn vị không được trống";
  // }

  if (!CCTC_model.level) {
    errorMessages.level = "Cấp tổ chức không được trống";
  }

  if (CCTC_model.id == CCTC_model.father) {
    errorMessages.father = "Không thể chọn đơn vị cấp trên là chính nó";
  }
};

const submit = () => {
  checkValidate();
  switch (dialogLabel.value.Case) {
    //Thêm cơ cấu tổ chức
    case 1:
      //Kiểm tra validate
      if (isValidate.value) {
        let data = {
          card_code: CCTC_model.card_code,
          card_name: CCTC_model.card_name,
          father: CCTC_model.father,
          level: CCTC_model.level,
          is_active: CCTC_model.is_active,
        };
        addNewNode(data);
      }
      break;
    //Update cơ cấu tổ chức
    case 2:
      if (isValidate.value) {
        let data = {
          id: CCTC_model.id,
          card_code: CCTC_model.card_code,
          card_name: CCTC_model.card_name,
          father: CCTC_model.father,
          level: CCTC_model.level,
          is_active: CCTC_model.is_active,
        };
        updateNode(data);
      }
      break;
    default:
      break;
  }
};

//Gửi API để tạo mới
const addNewNode = (data) => {
  loading.value = true;
  API.add_new(data, "organizational-structure/create")
    .then((res) => {
      if (res.data.success) {
        try {
          let nodeToTree = { ...res.data.data };
          nodeToTree.children = null;
          //Thêm node và cây data chính
          API_CCTC_DATA.value = addNodeToTreeArray(
            API_CCTC_DATA.value,
            nodeToTree.father,
            nodeToTree
          );
          loading.value = false;
          toast.add({
            severity: "success",
            summary: "Thông báo",
            group: "br",
            detail: res.data.message,
            life: 3000,
          });
          loading.value = false;
          closeDialog();
        } catch (err) {
          console.error("Lỗi khi thêm vào cây: ", err);
        }
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: "Lỗi",
          life: 3000,
        });
      }
    })
    .catch((err) => {
      loading.value = false;
      errorMessages.cardCode = "Mã đơn vị đã tồn tại";
      console.info(err);
    });
};

//Gửi data để update node
const updateNode = (data) => {
  loading.value = true;
  API.update(data, "organizational-structure/update")
    .then((res) => {
      if (res.data.success) {
        visibleDialog.value = false;
        loading.value = false;
        toast.add({
          severity: "success",
          summary: "Thông báo",
          group: "br",
          detail: res.data.message,
          life: 3000,
        });
        API.get_tree("organizational-structure/get-all").then(
          (res) => {
            //Lấy dữ liệu thành công
            if (res.data.success) {
              API_CCTC_DATA.value = [res.data.data];
              nodeSelected.value = res.data.data;
              loadedCCTC.value = true;
            }
            //Dữ liệu lỗi
            else {
              loadedCCTC.value = false;
              toast.add({
                severity: "error",
                summary: "Lỗi",
                group: "br",
                detail: res.data.message,
                life: 3000,
              });
            }
          },
          //Lỗi mạng
          (err) => {
            loadedCCTC.value = false;
            toast.add({
              severity: "error",
              summary: "Lỗi",
              group: "br",
              detail: err,
              life: 3000,
            });
          }
        );
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: res.data.error,
          life: 3000,
        });
      }
    })
    .catch((err) => {
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: err,
        life: 3000,
      });
    });
};

//Xoá 1 node
const deleteNode = () => {
  API.delete([{ id: idsToDelete.value }], "organizational-structure/delete")
    .then((res) => {
      if (res.data[0].success) {
        //Logic remove node from tree in local.
        if (idsToDelete.value == nodeSelected.value.id) {
          nodeSelected.value = API_CCTC_DATA.value[0];
        }
        API_CCTC_DATA.value = removeNodeById(API_CCTC_DATA.value, idsToDelete.value);
        toast.add({
          severity: "success",
          summary: "Thông báo",
          group: "br",
          detail: "Đã xoá",
          life: 3000,
        });
        displayConfirmDelete.value = false;
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: "Có lỗi xảy ra.",
          life: 3000,
        });
      }
    })
    .catch();
};
//Xoá nhiều node
const deleteSelectedNodes = () => {
  loading.value = true;
  let itemError = 0;
  let arrayId = selectedRows.value.map((el) => {
    return { id: el.id };
  });
  API.delete(arrayId, "organizational-structure/delete")
    .then((res) => {
      loading.value = false;
      displayConfirmationDeleteRows.value = false;
      res.data.forEach((iRes) => {
        if (iRes.success) {
          API_CCTC_DATA.value = removeNodeById(API_CCTC_DATA.value, iRes.target_id);
        } else {
          itemError++;
        }
      });
      if (itemError < 1) {
        toast.add({
          severity: "success",
          summary: "Thông báo",
          group: "br",
          detail: `Đã xoá thành công ${arrayId.length} dòng.`,
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: `Đã xoá thành công ${
            arrayId.length - itemError
          } dòng, ${itemError} dòng không thể xoá.`,
          life: 3000,
        });
      }
      selectedRows.value = [];
    })
    .catch((err) => {
      displayConfirmationDeleteRows.value = false;
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: err,
        life: 3000,
      });
      return;
    });
};

//Hiển thị pop up xác nhận xoá
const showConfirmDelete = (id) => {
  displayConfirmDelete.value = true;
  idsToDelete.value = id;
};

//chọn thuộc đơn vị
const onchangeFather = (node) => {
  CCTC_model.father = node.value.id;
};

//Mở dialog thêm sửa xoá
const showDialog = () => {
  visibleDialog.value = true;
};

const closeDialog = () => {
  resetForm();
  loading.value = false;
  visibleDialog.value = false;
};

//Local service
function addNodeToTreeArray(treeArray, fatherId, node) {
  // Nếu mảng cây là rỗng, trả về một mảng mới chứa node
  if (treeArray.length == 0) {
    return [node];
  }
  // Duyệt qua mảng cây và tìm node có id bằng với fatherId
  for (let i = 0; i < treeArray.length; i++) {
    let currentNode = treeArray[i];
    if (currentNode.id == fatherId) {
      // Nếu node có id bằng với fatherId, kiểm tra xem nó có children hay không
      if (currentNode.children == null) {
        // Nếu node không có children, gán node mới làm children của nó
        currentNode.children = [node];
      } else {
        // Nếu node có children, thêm node mới vào mảng children của nó
        currentNode.children.push(node);
      }
      // Trả về mảng cây đã được cập nhật
      return treeArray;
    } else {
      // Nếu node có id khác với fatherId, gọi đệ quy hàm trên children của nó (nếu có)
      if (currentNode.children != null) {
        addNodeToTreeArray(currentNode.children, fatherId, node);
      }
    }
  }
  // Nếu không tìm thấy node có id bằng với fatherId, trả về mảng cây ban đầu
  return treeArray;
}

// Hàm để xóa một node khỏi một mảng cây
function removeNodeById(array, id) {
  let resultArray = [];
  if (Array.isArray(array)) {
    for (let el of array) {
      if (el.id !== id) {
        if (Array.isArray(el.children)) {
          // Gọi đệ quy hàm trên children của el và gán kết quả lại cho el.children
          el.children = removeNodeById(el.children, id);
        }
        // Thêm el vào mảng kết quả
        resultArray.push(el);
      }
      // Chuyển lệnh return ra ngoài vòng lặp for
      // return resultArray;
    }
    // Trả về mảng kết quả sau khi duyệt hết mảng
    return resultArray;
  } else {
    return resultArray;
  }
}

//Update node
</script>

<template>
  <!-- Header content -->
  <div class="bg-surface-card">
    <div class="grid px-5">
      <div class="flex align-items-center col-6">
        <h5 style="color: #0773bb" class="text-black m-2 p-2 mb-0 mt-0 font-semibold">
          CƠ CẤU TỔ CHỨC
        </h5>
      </div>
      <div class="col-6 flex fl-end">
        <Button
          :disabled="!loadedCCTC && !loadedCTC"
          class="text-end px-3 py-2 font-medium"
          label="Thêm Mới"
          icon="pi pi-plus"
          @click="openAdd"
        />
      </div>
    </div>
  </div>
  <!-- Header content -->

  <!-- Body content -->
  <div class="card p-0 m-0">
    <Splitter style="" class="h-full">
      <SplitterPanel :size="20" :minSize="10" style="overflow: hidden">
        <!-- <div className="h-full flex align-items-center justify-content-center">Panel 1</div> -->
        <div class="h-full p-fluid px-3">
          <div class="header-panel pt-3">
            <InputText
              v-model.lazy="searchText"
              size="small"
              type="text"
              placeholder="Tìm kiếm"
            ></InputText>
            <Divider />
          </div>
          <div class="body-panel overflow-scroll">
            <template v-if="loadedCCTC">
              <TreeArray
                :selectedId="nodeSelected.id"
                :searchText="searchText"
                :data="API_CCTC_DATA"
                @select-node="onSelectNode"
              />
            </template>
            <template v-else>
              <Skeleton class="mb-3"></Skeleton>
              <Skeleton width="75%" class="mb-3"></Skeleton>
              <Skeleton class="mb-3"></Skeleton>
              <Skeleton width="40%" class="mb-3"></Skeleton>
            </template>
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel :size="80" :minSize="50" style="overflow: scroll">
        <Splitter layout="vertical">
          <SplitterPanel class="h-full">
            <div class="p-fluid">
              <div class="header-panel p-3">
                <div class="card mb-3 p-3">
                  <div class="header-panel-title">
                    <template v-if="loadedCCTC">
                      <h5>
                        {{ nodeSelected.card_name }}
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text p-1"
                          @click="openUpdate"
                          v-tooltip="'Sửa'"
                        />
                        <Button
                          v-if="
                            (!nodeSelected.children ||
                              nodeSelected.children.length < 1) &&
                            nodeSelected.father !== -1
                          "
                          icon="pi pi-trash text-red-500"
                          class="p-button-text p-1"
                          @click="showConfirmDelete(nodeSelected.id)"
                          v-tooltip="'Xoá'"
                        />
                      </h5>
                    </template>
                    <template v-else>
                      <div class="flex">
                        <Skeleton width="15rem" height="2rem" class="mb-2"></Skeleton>
                        <Skeleton width="4rem" height="2rem" class="ml-3"></Skeleton>
                        <Skeleton width="4rem" height="2rem" class="ml-2"></Skeleton>
                      </div>
                    </template>
                  </div>

                  <span v-if="loadedCCTC"
                    ><span class="font-bold">Mã đơn vị: </span>
                    {{ nodeSelected.card_code }}</span
                  >
                  <span class="px-5">|</span>
                  <span v-if="loadedCCTC"
                    ><span class="font-bold">Cấp tổ chức: </span
                    >{{ nodeSelected.level_name }}</span
                  >
                </div>
                <div id="main-panel" class="card p-0 .overflow-scroll">
                  <div class="card-header p-3">
                    <template v-if="selectedRows.length < 1">
                      <h5>Danh sách đơn vị trực thuộc</h5>
                    </template>
                    <template v-else>
                      <h5
                        aria-haspopup="true"
                        style="cursor: pointer"
                        @click="toggleMenuSelect"
                      >
                        Chọn thao tác {{ selectedRows.length }} dòng đang chọn
                        <i class="pi pi-angle-down"></i>
                      </h5>
                      <Menu ref="menu" :model="itemsMenu" :popup="true" />
                    </template>
                  </div>
                  <div class="panel-content">
                    <tempalte v-if="loadedCCTC">
                      <DataTable
                        v-model:selection="selectedRows"
                        class="h-full"
                        :value="nodeSelected.children"
                        tableStyle="min-width: 50rem"
                        dataKey="card_code"
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle="width: 3rem"
                        ></Column>
                        <Column field="card_name" header="Tên đơn vị" sortable></Column>
                        <Column field="card_code" header="Mã đơn vị" sortable></Column>
                        <Column field="level_name" header="Cấp tổ chức" sortable></Column>
                        <Column
                          field="father_name"
                          header="Đơn vị cấp trên"
                          sortable
                        ></Column>
                        <Column
                          field="is_active"
                          header="Trạng thái"
                          dataType="boolean"
                          sortable
                        >
                          <template #body="{ data }">
                            {{
                              data.is_active == "A" ? "Đang hoạt động" : "Ngừng hoạt động"
                            }}
                          </template>
                        </Column>
                        <Column :exportable="false" header="Hành động">
                          <template #body="dataProps">
                            <Button
                              icon="pi pi-pencil"
                              class="p-button-rounded p-button-text"
                              @click="openUpdateChild(dataProps.data)"
                              v-tooltip="'Sửa'"
                            />
                            <Button
                              v-if="
                                !dataProps.data.children ||
                                dataProps.data.children.length < 1
                              "
                              icon="pi pi-trash"
                              severity="p-button-rounded p-button-text text-red-500"
                              @click="showConfirmDelete(dataProps.data.id)"
                              v-tooltip="'Xoá'"
                            />
                          </template>
                        </Column>
                      </DataTable>
                    </tempalte>
                    <template v-else>
                      <DataTable
                        v-model:selection="selectedRows"
                        class="h-full"
                        :value="[{}, {}, {}, {}]"
                        tableStyle="min-width: 50rem"
                        dataKey="card_code"
                      >
                        <Column selectionMode="multiple" headerStyle="width: 3rem">
                        </Column>
                        <Column field="card_name" header="Tên đơn vị" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="card_code" header="Mã đơn vị" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="level_name" header="Cấp tổ chức" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="father_name" header="Đơn vị cấp trên" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column
                          field="is_active"
                          header="Trạng thái"
                          dataType="boolean"
                          sortable
                        >
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column :exportable="false" header="Hành động">
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                      </DataTable>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  </div>
  <!-- Body content -->

  <!-- Dialog and Toast -->
  <Dialog
    @keypress.enter="closeDialog"
    :header="dialogLabel.Title"
    v-model:visible="visibleDialog"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
    maximizable
  >
    <div class="border-bottom border-solid border-1 border-inherit">
      <div class="card">
        <div class="formgrid grid mr-0">
          <div class="field col-8">
            <div class="input-header">
              <h6>Tên Đơn Vị</h6>
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
            </div>
            <div class="formgrid">
              <InputText
                v-model="CCTC_model.card_name"
                class="w-full"
                type="text"
                placeholder="Tên đơn vị"
                :class="{ 'p-invalid': errorMessages.cardName }"
                aria-describedby="text-error"
              ></InputText>
              <small class="p-error" id="text-error">{{ errorMessages.cardName }}</small>
            </div>
          </div>
          <div class="field col-4 pr-0">
            <div class="input-header">
              <h6>Mã Đơn Vị</h6>
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
            </div>
            <div class="formgrid">
              <!-- <div class="">
                                <InputText v-model="CCTC_FormEdit.Code" class="w-full" type="text" placeholder="Mã đơn vị">
                                </InputText>
                            </div> -->
              <InputText
                v-model="CCTC_model.card_code"
                class="w-full"
                type="text"
                placeholder="Mã đơn vị"
                :class="{ 'p-invalid': errorMessages.cardCode }"
                aria-describedby="text-error"
              ></InputText>
              <small class="p-error" id="text-error">{{ errorMessages.cardCode }}</small>
            </div>
          </div>
          <div class="field col-12 pr-0" v-if="CCTC_model.father != -1">
            <div class="input-header">
              <h6>Thuộc Đơn Vị</h6>
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
            </div>
            <div class="formgrid">
              <div class="w-full">
                <TreeArraySelect
                  :class="{ 'p-invalid': errorMessages.father }"
                  :selectSelf="false"
                  :selectedId="CCTC_model.father"
                  :data="API_CCTC_DATA"
                  @onChange="onchangeFather"
                />
                <small class="p-error" id="text-error">{{ errorMessages.father }}</small>
              </div>
            </div>
          </div>
          <div class="field col-12 pr-0">
            <div class="input-header">
              <h6>Cấp Tổ Chức</h6>
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
            </div>
            <div class="formgrid">
              <div class="w-full">
                <Dropdown
                  v-model="CCTC_model.level"
                  :options="API_CTC_DATA.filter((x) => x.is_active == 'A')"
                  filter
                  :class="{ 'p-invalid': errorMessages.level }"
                  optionLabel="level_name"
                  optionValue="id"
                  placeholder="Chọn cấp tổ chức"
                  class="w-full"
                >
                </Dropdown>
                <small class="p-error" id="text-error">{{ errorMessages.level }}</small>
              </div>
            </div>
          </div>
          <div class="field col-6 pr-0">
            <div class="input-header">
              <h6>Trạng Thái</h6>
            </div>
            <div class="formgrid">
              <div class="#">
                <Dropdown
                  v-model="CCTC_model.is_active"
                  :options="status"
                  optionValue="code"
                  optionLabel="name"
                  placeholder="Chọn trạng thái"
                  class="w-full md:w-14rem"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        :label="dialogLabel.SecondaryButton"
        @click="closeDialog"
        icon="pi pi-times"
        class="p-button-secondary"
      />
      <Button
        :loading="loading"
        :label="dialogLabel.PrimaryButton"
        @click="submit"
        icon="pi pi-check"
      />
    </template>
  </Dialog>
  <Toast position="bottom-right" group="br" />
  <Dialog
    header="Xác nhận xoá"
    v-model:visible="displayConfirmDelete"
    :style="{ width: '350px' }"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Xác nhận xóa cơ cấu tổ chức</span>
    </div>
    <template #footer>
      <Button
        label="Huỷ"
        icon="pi pi-times"
        @click="displayConfirmDelete = false"
        severity="secondary"
      />
      <Button
        :loading="loading"
        label="Xoá"
        icon="pi pi-check"
        @click="deleteNode"
        autofocus
      />
    </template>
  </Dialog>
  <Dialog
    header="Xoá cơ cấu tổ chức"
    v-model:visible="displayConfirmationDeleteRows"
    :style="{ width: '450px' }"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center px-3">
      <div class="grid">
        <div class="col-2 text-center">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem" />
        </div>
        <div class="col-10">
          <div class="flex flex-wrap">
            <template v-if="canDeleteRows">
              <span class="font-bold"
                >Bạn có chắc chắn muốn xoá {{ selectedRows.length }} đơn vị đã chọn
                không?</span
              >
              <span class="pt-2"
                >Sau khi xoá, các dữ liệu không thể khôi phục và có thể ảnh hưởng đến các
                báo cáo.</span
              >
            </template>
            <template v-else>
              <span class="font-bold">Không thể xoá</span>
              <span class="pt-2"
                >Không thể xoá cơ cấu tổ chức có thành viên con bên trong.</span
              >
            </template>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <template v-if="canDeleteRows">
        <Button
          label="Huỷ"
          icon="pi pi-times"
          @click="displayConfirmationDeleteRows = false"
          severity="secondary"
        />
        <Button
          :loading="loading"
          label="Xoá"
          icon="pi pi-check"
          @click="deleteSelectedNodes"
          autofocus
        />
      </template>
      <template v-else>
        <Button
          :loading="loading"
          label="Ok"
          icon="pi pi-check"
          @click="
            () => {
              displayConfirmationDeleteRows = false;
              canDeleteRows = true;
            }
          "
          autofocus
        />
      </template>
    </template>
  </Dialog>
  <!-- Dialog and Toast -->
</template>

<style scoped>
.body-panel {
  height: 630px;
}

:root {
  --surface-hover: #f6f9fc;
  --boder-color: #d1d4db;
}

.card-header h5,
h4,
h3,
h2,
h1 {
  margin: 0px;
}

.overflow-scroll {
  overflow: auto;
}

.card-header {
  border-bottom: 1px solid #d1d4db;
}

.bg-surface {
  background-color: var(--surface-hover);
}

.container {
  align-items: center;
  /* padding: 5px; */
}

#main-panel {
  height: 40rem;
}

/* ---------------------- */
.p-dialog-content {
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
  border-bottom: 1px solid;
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

.input-header {
  display: flex;
}

.bg-current {
  background-color: #ffffff;
}

.card {
  border-radius: unset;
}

.p-button.p-button-text {
  /* color: #374151; */
}
</style>
