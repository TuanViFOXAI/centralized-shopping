<script setup>
import { isRef, onBeforeMount, onMounted, reactive, ref, toRaw, unref } from "vue";
import { useToast } from "primevue/usetoast";
import TreeArray from "./components/TreeArray.vue";
import TreeArraySelect from "./components/TreeArraySelect.vue";
import API from "../../apis/api.test";
import { StatusCode } from "../../service/StatusCode";

const nameItem = ref();

const toast = useToast();
const visibleDialog = ref(false);
const loadedOIBT = ref(false);
const loadedCTC = ref(false);
const dialogLabel = ref({ Case: 0, Title: "", PrimaryButton: "", SecondaryButton: "" });
const isValidate = ref(false);
const errorMessages = reactive({
  ItmsGrpNam: null,
  ItmsGrpCod: null,
  Father: null,
  Level: null,
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
  ID: null,
  ItmsGrpCod: null,
  ItmsGrpNam: null,
  Father: null,
  FatherCode: null,
  FatherName: null,
  Level: null,
  IsActive: "A",
  children: [],
});
const status = ref([
  { name: "Đang hoạt động", code: "A" },
  { name: "Không hoạt động", code: "I" },
]);
const displayConfirmDelete = ref(false);
const menu = ref();
const OIBT_model = reactive({ ...model });
const API_OIBT_DATA = ref([]);

//Loading flag
const loading = ref(false);
const isEmptyData= ref(false);

onMounted(() => {
  //API lấy dữ liệu cho Cơ cấu tổ chức
  API.get_all("oibt/getall").then(
    (res) => {
      //Lấy dữ liệu thành công
      if (res.status >= 200) {
        const data = sortData(res.data.data, "ID");
        API_OIBT_DATA.value = data;
        if(data){
          nodeSelected.value = data[0];
        }
        else{
          nodeSelected.value = {};
          isEmptyData.value = true;
        }
        loadedOIBT.value = true;
      } else {
      }
    },
    //Lỗi mạng
    (err) => {
      loadedOIBT.value = false;
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
  Object.assign(OIBT_model, model);
};

const resetErrorMessages = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
}

//Mở form thêm mới dữ liệu
const openAdd = () => {
  resetForm();
  resetErrorMessages();
  //gán id Father là id của node đang chọn ở cây bên trái
  OIBT_model.Father = nodeSelected.value.ID;
  dialogLabel.value = {
    Case: 1,
    Title: "Thêm nhóm vật tư, hàng hoá",
    PrimaryButton: "Thêm",
    SecondaryButton: "Huỷ",
  };
  showDialog();
  // errorMessages.Father = null;
};

const openUpdate = () => {
  dialogLabel.value = {
    Case: 2,
    Title: "Chỉnh sửa cơ cấu tổ chức",
    PrimaryButton: "Lưu",
    SecondaryButton: "Huỷ",
  };
  OIBT_model.ID = nodeSelected.value.ID;
  OIBT_model.ItmsGrpCod = nodeSelected.value.ItmsGrpCod;
  OIBT_model.ItmsGrpNam = nodeSelected.value.ItmsGrpNam;
  OIBT_model.Father = nodeSelected.value.Father;
  OIBT_model.Father_name = nodeSelected.value.Father_name;
  OIBT_model.Level = nodeSelected.value.Level;
  OIBT_model.Level_name = nodeSelected.value.Level_name;
  OIBT_model.IsActive = nodeSelected.value.IsActive;
  showDialog();
  errorMessages.Father = null;
  // console.log(OIBT_model)
};

//Người dùng update ở bảng
const openUpdateChild = (element) => {
  dialogLabel.value = {
    Case: 2,
    Title: "Chỉnh sửa cơ cấu tổ chức",
    PrimaryButton: "Lưu",
    SecondaryButton: "Huỷ",
  };
  OIBT_model.ID = element.ID;
  OIBT_model.ItmsGrpCod = element.ItmsGrpCod;
  OIBT_model.ItmsGrpNam = element.ItmsGrpNam;
  OIBT_model.Father = element.Father;
  OIBT_model.FatherName = element.FatherName;
  OIBT_model.FatherCode = element.FatherCode;
  OIBT_model.Level = element.Level;
  OIBT_model.IsActive = element.IsActive;
  showDialog();
  errorMessages.Father = null;
};

const checkValidate = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
  isValidate.value =
    OIBT_model.ItmsGrpCod &&
    OIBT_model.ItmsGrpCod.trim() &&
    OIBT_model.ItmsGrpNam &&
    OIBT_model.ItmsGrpNam.trim() &&
    OIBT_model.Father &&
    OIBT_model.IsActive &&
    OIBT_model.ID != OIBT_model.Father;
  // Validation for each field
  if (!OIBT_model.ItmsGrpNam || !OIBT_model.ItmsGrpNam.trim()) {
    errorMessages.ItmsGrpNam = "Tên nhóm không được trống";
  }

  if (!OIBT_model.ItmsGrpCod || !OIBT_model.ItmsGrpCod.trim()) {
    errorMessages.ItmsGrpCod = "Mã nhóm không được trống";
  }

  if (OIBT_model.ID == OIBT_model.Father) {
    errorMessages.Father = "Không thể chọn thuộc đơn vị là chính nó";
  }
};

const submit = () => {
  checkValidate();
  switch (dialogLabel.value.Case) {
    //Thêm mới
    case 1:
      // console.log(OIBT_model)
      //Kiểm tra validate
      if (isValidate.value) {
        let data = {
          data: [
            {
              ItmsGrpCod: OIBT_model.ItmsGrpCod,
              ItmsGrpNam: OIBT_model.ItmsGrpNam,
              Father: OIBT_model.Father,
              IsActive: OIBT_model.IsActive,
            },
          ],
        };
        addNewNode(data);
      }
      break;
    //Update
    case 2:
      if (isValidate.value) {
        let data = {
          ID: OIBT_model.ID,
          ItmsGrpCod: OIBT_model.ItmsGrpCod,
          ItmsGrpNam: OIBT_model.ItmsGrpNam,
          Father: OIBT_model.Father,
          Level: OIBT_model.Level,
          IsActive: OIBT_model.IsActive,
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
  API.add_new(data, "oibt/create")
    .then((res) => {
      if (res.status >= 200) {
        switch (res.data["data"][0]["CodeErr"]) {
          case StatusCode.success:
            try {
              let nodeToTree = { ...res.data["data"][0] };
              nodeToTree.children = null;
              console.log(nodeToTree);
              //Thêm node và cây data chính
              API_OIBT_DATA.value = addNodeToTreeArray(
                API_OIBT_DATA.value,
                nodeToTree.Father,
                nodeToTree
              );
              loading.value = false;
              toast.add({
                severity: "success",
                summary: "Thông báo",
                group: "br",
                detail: "Thêm thành công",
                life: 3000,
              });
              loading.value = false;
              closeDialog();
            } catch (err) {
              console.error("Lỗi khi thêm vào cây: ", err);
            }
            break;
          case StatusCode.duplicate_key:
            errorMessages.ItmsGrpCod = `Đã tồn tại mã ${res.data["data"][0]["ItmsGrpCod"]}`;
            isValidate.value = false;
            loading.value = false;
            break;
          default:
            break;
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
      toast.add({
        severity: "error",
        summary: "Lỗi",
        group: "br",
        detail: err,
        life: 3000,
      });
    });
};

//Gửi data để update node
const updateNode = (_data) => {
  loading.value = true;
  API.update({ data: [_data] }, "oibt/update")
    .then((res) => {
      loading.value = false;
      if (res.status === 200) {
        visibleDialog.value = false;
        toast.add({
          severity: "success",
          summary: "Thông báo",
          group: "br",
          detail: "Sửa thành công",
          life: 3000,
        });
        API.get_all("oibt/getall").then(
          (res) => {
            //Lấy dữ liệu thành công
            if (res.status >= 200) {
              const data = sortData(res.data.data, "ID");
              API_OIBT_DATA.value = data;
              nodeSelected.value = data[0];
              loadedOIBT.value = true;
            } else {
            }
          },
          //Lỗi mạng
          (err) => {
            loadedOIBT.value = false;
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
          detail: res.status,
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
  API.delete(idsToDelete.value, "oibt/delete")
    .then((res) => {
      switch (res.data["data"][0]["CodeErr"]) {
        case StatusCode.success:
          console.log(idsToDelete.value["data"][0]["ID"]);
          API_OIBT_DATA.value = removeNodeById(
            API_OIBT_DATA.value,
            idsToDelete.value["data"][0]["ID"]
          );
          if (idsToDelete.value["data"][0]["ID"] == nodeSelected.value.ID) {
            nodeSelected.value = API_OIBT_DATA.value[0];
          }
          toast.add({
            severity: "success",
            summary: "Thông báo",
            group: "br",
            detail: "Xoá thành công",
            life: 3000,
          });
          displayConfirmDelete.value = false;
          break;
        case StatusCode.not_found:
          toast.add({
            severity: "error",
            summary: "Thông báo",
            group: "br",
            detail: "Không tìm thấy đối tượng, có thể đã bị xoá",
            life: 3000,
          });
          break;

        default:
          alert("error");

          break;
      }
    })
    .catch();
};
//Xoá nhiều node
const deleteSelectedNodes = () => {
  loading.value = true;
  let itemError = 0;
  let arrayId = selectedRows.value.map((el) => {
    return { ID: el.ID };
  });
  API.delete({ data: arrayId }, "oibt/delete")
    .then((res) => {
      if (res.status === 200) {
        loading.value = false;
        displayConfirmationDeleteRows.value = false;
        res.data.data.forEach((iRes) => {
          if (iRes.CodeErr == 0) {
            API_OIBT_DATA.value = removeNodeById(API_OIBT_DATA.value, iRes.ID);
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
      } else {
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: res.status,
          life: 3000,
        });
      }
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
const showConfirmDelete = (node) => {
  nameItem.value = node.ItmsGrpNam;
  displayConfirmDelete.value = true;
  idsToDelete.value = {
    data: [{ ID: node.ID }],
  };
};

//chọn thuộc đơn vị
const onchangeFather = (node) => {
  OIBT_model.Father = node.value.ID;
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
function addNodeToTreeArray(treeArray, FatherId, node) {
  // Nếu mảng cây là rỗng, trả về một mảng mới chứa node
  if (treeArray.length == 0) {
    return [node];
  }
  if (FatherId == -1) {
    let result = treeArray;
    result.push(node);
    return result;
  }
  // Duyệt qua mảng cây và tìm node có id bằng với FatherId
  for (let i = 0; i < treeArray.length; i++) {
    let currentNode = treeArray[i];
    if (currentNode.ID == FatherId) {
      // Nếu node có id bằng với FatherId, kiểm tra xem nó có children hay không
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
      // Nếu node có id khác với FatherId, gọi đệ quy hàm trên children của nó (nếu có)
      if (currentNode.children != null) {
        addNodeToTreeArray(currentNode.children, FatherId, node);
      }
    }
  }
  // Nếu không tìm thấy node có id bằng với FatherId, trả về mảng cây ban đầu
  return treeArray;
}

// Hàm để xóa một node khỏi một mảng cây
function removeNodeById(array, id) {
  let resultArray = [];
  if (Array.isArray(array)) {
    for (let el of array) {
      if (el.ID !== id) {
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

//Sắp xếp data
function sortData(array, sortBy) {
  // kiểm tra mảng có tồn tại và không rỗng
  if (array && array.length > 0) {
    // sắp xếp mảng theo trường id tăng dần
    array.sort((a, b) => a[sortBy] - b[sortBy]);
    // duyệt qua các phần tử của mảng
    for (let item of array) {
      // nếu phần tử có mảng con
      if (item.children) {
        // gọi đệ quy để sắp xếp mảng con
        sortData(item.children);
      }
    }
  }
  // trả về mảng đã sắp xếp
  return array;
}
</script>

<template>
  <!-- Header content -->
  <div class="">
    <div class="flex p-3 justify-between">
      <div class="align-items-center flex align-items-center">
        <h5 class="p-title font-semibold m-0">NHÓM VẬT TƯ HÀNG HÓA</h5>
      </div>

      <Button
        :disabled="!loadedOIBT"
        label="Thêm Mới"
        icon="pi pi-plus"
        @click="openAdd"
      />

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
            <template v-if="loadedOIBT">
              <TreeArray
                :config="{
                  id: 'ID',
                  code: 'ItmsGrpCod',
                  label: 'ItmsGrpNam',
                  Father: 'Father',
                  children: 'children',
                }"
                :selectedId="nodeSelected.ID"
                :searchText="searchText"
                :data="API_OIBT_DATA"
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
                    <template v-if="loadedOIBT">
                      <h5>
                        {{ nodeSelected["ItmsGrpNam"] }}
                        <Button
                          v-if="!isEmptyData"
                          icon="pi pi-pencil"
                          class="p-button-text p-1"
                          @click="openUpdate"
                          v-tooltip="'Sửa'"
                        />
                        <Button
                          v-if="!nodeSelected.children && !isEmptyData"
                          icon="pi pi-trash text-red-500"
                          class="p-button-text p-1"
                          @click="showConfirmDelete(nodeSelected)"
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

                  <span v-if="loadedOIBT"
                    ><span class="font-bold">Mã nhóm: </span>
                    {{ nodeSelected["ItmsGrpCod"] }}</span
                  >
                  <span class="px-5">|</span>
                  <span v-if="loadedOIBT"
                    ><span class="font-bold">Trạng thái: </span
                    >{{
                      nodeSelected["IsActive"] === "A"
                        ? "Đang hoạt động"
                        : "Không hoạt động"
                    }}</span
                  >
                </div>
                <div id="main-panel" class="card p-0 .overflow-scroll">
                  <div class="card-header p-3">
                    <template v-if="selectedRows.length < 1">
                      <h5>Danh sách nhóm hàng hoá trực thuộc</h5>
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
                    <tempalte v-if="loadedOIBT">
                      <DataTable
                        v-model:selection="selectedRows"
                        class="h-full"
                        :value="nodeSelected.children"
                        tableStyle="min-width: 50rem"
                        dataKey="ID"
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle="width: 3rem"
                        ></Column>
                        <Column field="ItmsGrpCod" header="Mã nhóm" sortable></Column>
                        <Column field="ItmsGrpNam" header="Tên nhóm vật tư, hàng hoá" sortable></Column>
                        <Column
                          field="IsActive"
                          header="Trạng thái"
                          dataType="boolean"
                          sortable
                        >
                          <template #body="{ data }">
                            {{
                              data["IsActive"] == "A"
                                ? "Đang hoạt động"
                                : "Ngừng hoạt động"
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
                              @click="showConfirmDelete(dataProps.data)"
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
                        dataKey="ItmsGrpCod"
                      >
                        <Column selectionMode="multiple" headerStyle="width: 3rem">
                        </Column>
                        <Column field="ItmsGrpNam" header="Tên đơn vị" sortable>
                          <template #body> <Skeleton></Skeleton> </template
                        ></Column>
                        <Column field="ItmsGrpCod" header="Mã đơn vị" sortable>
                          <template #body> <Skeleton></Skeleton> </template
                        ></Column>
                        <Column field="Level_name" header="Cấp tổ chức" sortable>
                          <template #body> <Skeleton></Skeleton> </template
                        ></Column>
                        <Column field="Father_name" header="Đơn vị cấp trên" sortable>
                          <template #body> <Skeleton></Skeleton> </template
                        ></Column>
                        <Column
                          field="IsActive"
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
    :header="dialogLabel.Title.toUpperCase()"
    v-model:visible="visibleDialog"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
    maximizable
  >
    <div class="border-bottom border-solid border-1 border-inherit">
      <div class="card">
        <div class="formgrid grid mr-0">
          <div class="field col-4">
            <div class="input-header">
              <h6>Mã nhóm</h6>
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
                v-model="OIBT_model.ItmsGrpCod"
                class="w-full"
                type="text"
                placeholder="Nhập mã nhóm"
                :class="{ 'p-invalid': errorMessages.ItmsGrpCod }"
                aria-describedby="text-error"
              ></InputText>
              <small class="p-error" id="text-error">{{
                errorMessages.ItmsGrpCod
              }}</small>
            </div>
          </div>
          <div class="field col-8 pr-0">
            <div class="input-header">
              <h6>Tên nhóm</h6>
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
                v-model="OIBT_model.ItmsGrpNam"
                class="w-full"
                type="text"
                placeholder="Nhập tên nhóm vật tư hàng hoá"
                :class="{ 'p-invalid': errorMessages.ItmsGrpNam }"
                aria-describedby="text-error"
              ></InputText>
              <small class="p-error" id="text-error">{{
                errorMessages.ItmsGrpNam
              }}</small>
            </div>
          </div>
          <div class="field col-12 pr-0">
            <div class="input-header">
              <h6>Thuộc nhóm</h6>
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
                  :config="{
                    field: {
                      id: 'ID',
                      code: 'ItmsGrpCod',
                      label: 'ItmsGrpNam',
                      Father: 'Father',
                      children: 'children',
                    },
                    ES_Root: true,
                  }"
                  :class="{ 'p-invalid': errorMessages.Father }"
                  :selectedId="OIBT_model.Father"
                  :data="API_OIBT_DATA"
                  @onChange="onchangeFather"
                />
                <small class="p-error" id="text-error">{{ errorMessages.Father }}</small>
              </div>
            </div>
          </div>
          <div class="field col-6 pr-0">
            <div class="input-header">
              <h6>Trạng Thái</h6>
            </div>
            <div class="formgrid">
              <div class="#">
                <InputSwitch
                  v-model="OIBT_model.IsActive"
                  placeholder="Chọn trạng thái"
                  trueValue="A"
                  falseValue="I"
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
      <span>Xác nhận xóa nhóm hàng hoá <span class="font-bold">{{ nameItem }}</span></span>
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
