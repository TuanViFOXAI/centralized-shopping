<script setup>
import { isRef, onBeforeMount, onMounted, reactive, ref, toRaw, unref } from "vue";
import { useToast } from "primevue/usetoast";
import TreeArray from "./components/TreeArray.vue";
import TreeArraySelect from "./components/TreeArraySelect.vue";
import API from "../../apis/api";
import { StatusCode } from "../../service/StatusCode";
import i18n from "../../locale/i18n";
const toast = useToast();
const visibleDialog = ref(false);
const loadedCCTC = ref(false);
const loadedCTC = ref(false);
const dialogLabel = ref({ Case: 0, Title: "", PrimaryButton: "", SecondaryButton: "" });
const isValidate = ref(false);
const errorMessages = reactive({
  OrsName: null,
  OrsCode: null,
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
  OrsCode: null,
  OrsName: null,
  Father: null,
  FatherName: null,
  Level: null,
  LevelName: null,
  level_description: null,
  IsActive: "A",
  tree_level: null,
  children: [],
});
const status = ref([
  { name: i18n.global.t("Status.Active"), code: "A" },
  { name: i18n.global.t("Status.InActive"), code: "I" },
]);
const displayConfirmDelete = ref(false);
const menu = ref();
const CCTC_model = reactive({ ...model });
const API_CCTC_DATA = ref([]);
const API_CTC_DATA = ref([]);

//Loading status
const loading = ref(false);

onMounted(() => {
  //API lấy dữ liệu cho Cơ cấu tổ chức
  API.get_all("oors/getall").then(
    (res) => {
      //Lấy dữ liệu thành công
      if (res.status === 200) {
        let data = sortData(res.data.data, "ID");
        API_CCTC_DATA.value = data;
        nodeSelected.value = data[0] || {};
        loadedCCTC.value = true;
      }
      //Dữ liệu lỗi
      else {
        loadedCCTC.value = false;
        toast.add({
          severity: "error",
          summary: "Lỗi",
          group: "br",
          detail: res.status,
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
  API.get_all("oorl/getall").then((res) => {
    if (res.status >= 200) {
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
        detail: err,
        life: 3000,
      });
    }
  });
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
    Title: i18n.global.t("OrgStrct.add"),
    PrimaryButton: i18n.global.t("Button.AddNew"),
    SecondaryButton: i18n.global.t("Button.Cancel"),
  };
  showDialog();
  //gán id Father là id của node đang chọn ở cây bên trái
  CCTC_model.Father = nodeSelected.value.ID;
  //Xoá hết error message khi mở lại cửa sổ thêm
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
};

const openUpdate = () => {
  dialogLabel.value = {
    Case: 2,
    Title: i18n.global.t("OrgStrct.edit"),
    PrimaryButton: i18n.global.t("Button.Save"),
    SecondaryButton: i18n.global.t("Button.Cancel"),
  };
  CCTC_model.ID = nodeSelected.value.ID;
  CCTC_model.OrsCode = nodeSelected.value.OrsCode;
  CCTC_model.OrsName = nodeSelected.value.OrsName;
  CCTC_model.Father = nodeSelected.value.Father;
  CCTC_model.FatherName = nodeSelected.value.FatherName;
  CCTC_model.Level = nodeSelected.value.Level;
  CCTC_model.LevelName = nodeSelected.value.LevelName;
  CCTC_model.IsActive = nodeSelected.value.IsActive;
  CCTC_model.children = nodeSelected.children;
  showDialog();
  errorMessages.Father = null;
};

//Người dùng update ở bảng
const openUpdateChild = (element) => {
  dialogLabel.value = {
    Case: 2,
    Title: i18n.global.t("OrgStrct.edit"),
    PrimaryButton: i18n.global.t("Button.Save"),
    SecondaryButton: i18n.global.t("Button.Cancel"),
  };
  CCTC_model["ID"] = element.ID;
  CCTC_model.OrsCode = element.OrsCode;
  CCTC_model.OrsName = element.OrsName;
  CCTC_model.Father = element.Father;
  CCTC_model.FatherName = element.FatherName;
  CCTC_model.Level = element.Level;
  CCTC_model.LevelName = element.LevelName;
  CCTC_model.IsActive = element.IsActive;
  CCTC_model.children = element.children;
  showDialog();
  errorMessages.Father = null;
};

const checkValidate = () => {
  Object.keys(errorMessages).forEach((key) => {
    errorMessages[key] = null;
  });
  isValidate.value =
    CCTC_model.OrsCode &&
    CCTC_model.OrsCode.trim() &&
    CCTC_model.OrsName &&
    CCTC_model.OrsName.trim() &&
    CCTC_model.Father &&
    CCTC_model.Level &&
    CCTC_model.IsActive &&
    CCTC_model["ID"] != CCTC_model.Father;
  // Validation for each field tdv
  if (!CCTC_model.OrsName || !CCTC_model.OrsName.trim()) {
    errorMessages.OrsName = i18n.global.t("valid_msg.null", [
      i18n.global.t("OrgStrct.UnitLevel"),
    ]);
  }

  if (!CCTC_model.OrsCode || !CCTC_model.OrsCode.trim()) {
    errorMessages.OrsCode = i18n.global.t("valid_msg.null", [
      i18n.global.t("OrgStrct.UnitCode"),
    ]);
  }

  // if (!CCTC_model.Father) {
  //   errorMessages.Father = "Thuộc đơn vị không được trống";
  // }

  if (!CCTC_model.Level) {
    errorMessages.Level = i18n.global.t("valid_msg.null", [
      i18n.global.t("OrgStrct.OrgLevel"),
    ]);
  }

  if (CCTC_model["ID"] == CCTC_model.Father) {
    errorMessages.Father =
      "Không thể chọn đơn vị cấp trên là chính nó:" +
      CCTC_model["ID"] +
      CCTC_model.Father;
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
          data: [
            {
              OrsCode: CCTC_model.OrsCode,
              OrsName: CCTC_model.OrsName,
              Father: CCTC_model.Father,
              Level: CCTC_model.Level,
              IsActive: CCTC_model.IsActive,
            },
          ],
        };
        addNewNode(data);
      }
      break;
    //Update cơ cấu tổ chức
    case 2:
      if (isValidate.value) {
        updateNode(CCTC_model);
      }
      break;
    default:
      break;
  }
  loading.value = false;
};

//Gửi API để tạo mới
const addNewNode = (data) => {
  loading.value = true;
  API.add_new_v2(data, "oors/create")
    .then((res) => {
      //Mạng ok không lỗi
      if (res.status >= 200) {
        switch (res.data["data"][0]["CodeErr"]) {
          //Thành công => thông báo ok -> Thoát
          case StatusCode.success:
            let nodeToTree = res.data["data"][0];
            nodeToTree.children = null;
            API_CCTC_DATA.value = addNodeToTreeArray(
              API_CCTC_DATA.value,
              nodeToTree.Father,
              nodeToTree
            );
            loading.value = false;
            toast.add({
              severity: "success",
              summary: i18n.global.t("severity.info"),
              group: "br",
              detail: i18n.global.t("toast_message.add_success", [
                i18n.global.t("OrgStrct.Header").toLowerCase(),
              ]),
              life: 3000,
            });
            closeDialog();
            break;
          //Trùng mã => đổi mã khác
          case StatusCode.duplicate_key:
            isValidate.value = false;
            errorMessages.OrsCode = i18n.global.t("toast_message.error_code");
            break;
          //Không tìm thấy cha -> có thể đã bị xoá trước đó, ai khác xoá => Refresh lại trang
          case StatusCode.not_found_father_id:
            isValidate.value = false;
            errorMessages.Father = i18n.global.t("toast_message.not_found_record1", [
              i18n.global.t("OrgStrct.ParentUnit"),
            ]);
            toast.add({
              severity: "warn",
              summary: "Thông báo",
              group: "br",
              detail:
                "Đơn vị cấp trên có thể đã bị xoá. Vui lòng chọn đơn vị cấp trên khác hoặc tải lại trang để sửa lỗi.",
              life: 5000,
            });
            break;

          default:
            break;
        }
        //Cố sự cố http khi status code trả về kết quả khác
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
    //Lỗi mạng: không giao tiếp được với Back-End
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
const updateNode = (data) => {
  loading.value = true;
  let bodyJson = {
    data: [
      {
        ID: data.ID,
        OrsCode: data.OrsCode,
        OrsName: data.OrsName,
        Father: data.Father,
        IsActive: data.IsActive,
        Level: data.Level,
      },
    ],
  };
  API.update_v2(bodyJson, "oors/update")
    .then((res) => {
      if (res.status >= 200) {
        switch (res.data["data"][0]["CodeErr"]) {
          case StatusCode.success:
            API.get_all("oors/getall").then(
              (res) => {
                //Lấy dữ liệu thành công
                if (res.status >= 200) {
                  let data = sortData(res.data.data, "ID");
                  API_CCTC_DATA.value = data;
                  nodeSelected.value = data[0];
                  loadedCCTC.value = true;
                }
                //Dữ liệu lỗi
                else {
                  loadedCCTC.value = false;
                  toast.add({
                    severity: "error",
                    summary: "Lỗi",
                    group: "br",
                    detail: res.status,
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
            loading.value = false;
            notication(
              "success",
              i18n.global.t("severity.success"),
              i18n.global.t("toast_message.edit_success")
            );
            visibleDialog.value = false;
            break;
          case StatusCode.duplicate_key:
            //Update thành công ...
            notication("error", "Lỗi", `Mã ${CCTC_model.OrsCode} đã tồn tại`);
            // notication('error', i18n.global.t('severity.error'), i18n.global.t('toast_message.error_code', [CCTC_model.OrsCode]));
            break;
          case StatusCode.not_found_id:
            //Update thành công ...
            notication(
              "error",
              "Lỗi",
              `Mã ${CCTC_model.OrsName} không tìm thấy hoặc đã bị xoá`
            );
            break;
          case StatusCode.not_found_father_id:
            //Update thành công ...
            notication(
              "error",
              "Lỗi",
              `không tìm thấy đơn vị cấp trên này hoặc đã bị xoá`
            );
            break;
          default:
            //Không update được
            notication("error", "Lỗi", `Mã lỗi ${res.data["data"][0]["CodeErr"]}`);
            break;
        }
      } else {
        notication("error", "Lỗi", `Mã lỗi ${res.status}`);
      }
    })
    .catch((err) => {
      notication("error", "Lỗi", err);
    });
};

//Xoá 1 node
const deleteNode = () => {
  loading.value = true;
  API.delete_v2({ data: [{ ID: idsToDelete.value }] }, "oors/delete")
    .then((res) => {
      if (res.status == 200) {
        switch (res.data["data"][0]["CodeErr"]) {
          case StatusCode.success:
            if (idsToDelete.value == nodeSelected.value.ID) {
              nodeSelected.value = API_CCTC_DATA.value[0];
            }
            API_CCTC_DATA.value = removeNodeById(API_CCTC_DATA.value, idsToDelete.value);
            // notication('success','Thông báo','Xoá thành công');
            notication(
              "success",
              i18n.global.t("severity.info"),
              i18n.global.t("toast_message.delete_success")
            );
            loading.value = false;
            displayConfirmDelete.value = false;
            break;
          case StatusCode.not_found_id:
            loading.value = false;
            notication(
              "error",
              i18n.global.t("severity.info"),
              res.data["data"][0]["Errors"]
            );
            break;
          default:
            loading.value = false;
            notication(
              "error",
              i18n.global.t("severity.info"),
              res.data["data"][0]["Errors"]
            );
            break;
        }
        //Logic remove node from tree in local.
      } else {
        loading.value = false;
        notication("error", "Lỗi", res.status);
      }
    })
    .catch((err) => {
      loading.value = false;
      notication("error", "Lỗi", err);
    });
};
//Xoá nhiều node
const deleteSelectedNodes = () => {
  loading.value = true;
  let itemError = 0;
  let arrayId = selectedRows.value.map((el) => {
    return { ID: el.ID };
  });
  API.delete_v2({ data: arrayId }, "oors/delete")
    .then((res) => {
      loading.value = false;
      if (res.status == 200) {
        res.data["data"].forEach((el) => {
          if (el.CodeErr == StatusCode.success) {
            API_CCTC_DATA.value = removeNodeById(API_CCTC_DATA.value, el.ID);
          } else {
            itemError++;
          }
        });
        if (itemError <= 0) {
          notication("success", "Thông báo", `Đã xoá ${arrayId.length}`);
          displayConfirmationDeleteRows.value = false;
        } else {
          notication(
            "warn",
            "warn",
            `Đã xoá: ${arrayId.length - itemError} Lỗi: ${itemError}`
          );
          displayConfirmationDeleteRows.value = false;
        }
        selectedRows.value = [];
      } else {
        loading.value = false;
        notication("error", "Lỗi", res.status);
        displayConfirmationDeleteRows.value = false;
      }
    })
    .catch((err) => {
      notication("error", "Lỗi", err);
      loading.value = false;
    });
};

//Hiển thị pop up xác nhận xoá
const showConfirmDelete = (id) => {
  displayConfirmDelete.value = true;
  idsToDelete.value = id;
};

//chọn thuộc đơn vị
const onchangeFather = (node) => {
  CCTC_model.Father = node.value.ID;
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
    if (currentNode.ID == fatherId) {
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

// Update date node
function updateNodeTree(array, node) {
  let result = removeNodeById(array, node.ID);
  result = addNodeToTreeArray(result, node.Father, node);
  return result;
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

//Sort data
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
        sortData(item.children, sortBy);
      }
    }
  }
  // else{
  //   // return [];
  // }
  // trả về mảng đã sắp xếp
  return array;
}

const notication = (severity, summary, msg) => {
  toast.add({
    severity: severity,
    summary: summary,
    group: "br",
    detail: msg,
    life: 3000,
  });
};
</script>

<template>
  <!-- Header content -->
  <div class="">
    <div class="flex">
      <div class="flex align-items-center mt-0 col-6">
        <h5 class="p-title m-2 p-2 mb-0 mt-0 font-semibold">
          {{ $t("OrgStrct.Header").toLocaleUpperCase() }}
        </h5>
      </div>
      <div class="col-6 flex fl-end">
        <Button
          :disabled="!loadedCCTC && !loadedCTC"
          class="text-end mr-5 py-2 font-medium"
          :label="$t('Button.AddNew')"
          icon="pi pi-plus"
          @click="openAdd"
        />
      </div>
    </div>
  </div>
  <!-- Header content -->

  <!-- Body content -->
  <div class="right-panel p-0 m-0">
    <Splitter style="" class="h-full">
      <SplitterPanel :size="25" :minSize="10" style="overflow: hidden">
        <!-- <div className="h-full flex align-items-center justify-content-center">Panel 1</div> -->
        <div class="h-full p-fluid">
          <div class="header-panel px-3 pt-3">
            <InputText
              v-model.lazy="searchText"
              size="small"
              type="text"
              :placeholder="$t('InputText.Search')"
            >
            </InputText>
            <Divider />
          </div>
          <div class="body-panel pl-3">
            <template v-if="loadedCCTC">
              <TreeArray
                :config="{
                  id: 'ID',
                  code: 'OrsCode',
                  label: 'OrsName',
                  children: 'children',
                  father: 'Father',
                }"
                :expandFirst="true"
                :selectedId="nodeSelected['ID']"
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
      <SplitterPanel :size="75" :minSize="50" style="overflow: scroll">
        <Splitter layout="vertical">
          <SplitterPanel class="h-full">
            <div class="p-fluid">
              <div class="header-panel p-3">
                <div class="card mb-3 p-3">
                  <div class="header-panel-title">
                    <template v-if="loadedCCTC">
                      <h5>
                        {{ nodeSelected["OrsName"] }}
                        <Button
                          icon="pi pi-pencil"
                          class="p-button-text p-1"
                          @click="openUpdate"
                        />
                        <Button
                          v-if="
                            (!nodeSelected.children ||
                              nodeSelected.children.length < 1) &&
                            nodeSelected.Father !== -1
                          "
                          icon="pi pi-trash text-red-500"
                          class="p-button-text p-1"
                          @click="showConfirmDelete(nodeSelected['ID'])"
                        />
                      </h5>
                    </template>
                    <template v-else>
                      <div class="flex">
                        <Skeleton width="15rem" height="2rem" class="mb-2"></Skeleton>
                      </div>
                    </template>
                  </div>
                  <template v-if="loadedCCTC">
                    <div class="grid">
                      <div class="md:col-2 col-12">
                        <span
                          ><span class="font-bold">{{ $t("OrgStrct.UnitCode") }}: </span>
                          {{ nodeSelected.OrsCode }}</span
                        >
                      </div>
                      <div class="md:col-10 col-12">
                        <span
                          ><span class="font-bold">{{ $t("OrgStrct.UnitLevel") }}: </span>
                          {{ nodeSelected.LevelName }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="grid">
                      <div class="md:col-3 col-12 flex">
                        <span class="font-bold">{{ $t("OrgStrct.UnitCode") }}: </span>
                        <Skeleton width="8rem" height="1.5rem" class="ml-2"></Skeleton>
                      </div>
                      <div class="md:col-9 col-12 flex">
                        <span class="font-bold">{{ $t("OrgStrct.UnitName") }}: </span>
                        <Skeleton width="12rem" height="1.5rem" class="ml-2"></Skeleton>
                      </div>
                    </div>
                  </template>
                </div>
                <div id="main-panel" class="p-0 .overflow-scroll">
                  <div class="card card-header p-3 mb-0">
                    <template v-if="selectedRows.length < 1">
                      <h5>{{ $t("OrgStrct.TableName") }}</h5>
                    </template>
                    <template v-else>
                      <h5
                        aria-haspopup="true"
                        style="cursor: pointer"
                        @click="toggleMenuSelect"
                      >
                        {{ $t("OrgStrct.SelectRows", [selectedRows.length]) }}
                        <i class="pi pi-angle-down"></i>
                      </h5>
                      <Menu ref="menu" :model="itemsMenu" :popup="true" />
                    </template>
                  </div>
                  <div class="panel-content">
                    <tempalte v-if="loadedCCTC">
                      <DataTable
                        size="small"
                        resizableColumns
                        columnResizeMode="fit"
                        stripedRows
                        paginator
                        showGridlines
                        :rows="8"
                        v-model:selection="selectedRows"
                        class="h-full"
                        :value="nodeSelected.children"
                        tableStyle="min-width: 50rem"
                        dataKey="OrsCode"
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle="width: 3rem"
                        ></Column>
                        <Column
                          field="OrsName"
                          :header="$t('OrgStrct.UnitName')"
                          sortable
                        ></Column>
                        <Column
                          field="OrsCode"
                          :header="$t('OrgStrct.UnitCode')"
                          sortable
                        ></Column>
                        <Column
                          field="LevelName"
                          :header="$t('OrgStrct.OrgLevel')"
                          sortable
                        ></Column>
                        <Column
                          field="FatherName"
                          :header="$t('OrgStrct.ParentUnit')"
                        ></Column>
                        <Column
                          field="IsActive"
                          :header="$t('OrgStrct.Status')"
                          dataType="boolean"
                          sortable
                        >
                          <template #body="{ data }">
                            {{
                              data.IsActive == "A"
                                ? $t("Status.Active")
                                : $t("Status.InActive")
                            }}
                            <!-- <i class="pi" :class="{ 'pi-check-circle text-green-500 ':  data.IsActive == 'A', 'pi-times-circle text-red-500': data.IsActive == 'I' }"></i> -->
                          </template>
                        </Column>
                        <Column :exportable="false" :header="$t('OrgStrct.Action')">
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
                              severity="p-button-rounded p-button-text"
                              @click="showConfirmDelete(dataProps.data.ID)"
                              v-tooltip="'Xoá'"
                            />
                          </template>
                        </Column>
                        <Row>
                          <template #body="">
                            <span>no data</span>
                          </template>
                        </Row>
                      </DataTable>
                    </tempalte>
                    <template v-else>
                      <DataTable
                        v-model:selection="selectedRows"
                        class="h-full"
                        :value="[{}, {}, {}, {}, {}, {}, {}, {}]"
                        tableStyle="min-width: 50rem"
                        dataKey="OrsCode"
                      >
                        <Column selectionMode="multiple" headerStyle="width: 3rem">
                        </Column>
                        <Column field="card_name" header="" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="OrsCode" header="" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="LevelName" header="" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="FatherName" header="" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column field="IsActive" header="" dataType="boolean" sortable>
                          <template #body>
                            <Skeleton></Skeleton>
                          </template>
                        </Column>
                        <Column :exportable="false" header="">
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
    @keypress.escape="closeDialog"
    :header="dialogLabel.Title.toLocaleUpperCase()"
    v-model:visible="visibleDialog"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '50vw' }"
    :modal="true"
    maximizable
  >
    <div class="border-bottom border-solid border-1 border-inherit">
      <div class="card">
        <div class="formgrid grid mr-0">
          <div class="field col-4 pr-0">
            <div class="input-header">
              <h6>{{ $t("OrgStrct.UnitCode") }}</h6>
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
                v-model="CCTC_model.OrsCode"
                class="w-full"
                type="text"
                :placeholder="$t('OrgStrct.UnitCode')"
                :class="{ 'p-invalid': errorMessages.OrsCode }"
                aria-describedby="text-error"
                autofocus
              ></InputText>
              <small class="p-error" id="text-error">{{ errorMessages.OrsCode }}</small>
            </div>
          </div>
          <div class="field col-8">
            <div class="input-header">
              <h6>{{ $t("OrgStrct.UnitName") }}</h6>
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
                v-model="CCTC_model.OrsName"
                class="w-full"
                type="text"
                :placeholder="$t('OrgStrct.UnitName_plh')"
                :class="{ 'p-invalid': errorMessages.OrsName }"
                aria-describedby="text-error"
              ></InputText>
              <small class="p-error" id="text-error">{{ errorMessages.OrsName }}</small>
            </div>
          </div>
          <div class="field col-12 pr-0" v-if="CCTC_model.Father != -1">
            <div class="input-header">
              <h6>{{ $t("OrgStrct.BelongDepartment") }}</h6>
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
                      code: 'OrsCode',
                      label: 'OrsName',
                      children: 'children',
                    },
                    ES_Root: false,
                  }"
                  :class="{ 'p-invalid': errorMessages.Father }"
                  :selectSelf="false"
                  :selectedId="CCTC_model.Father"
                  :data="API_CCTC_DATA"
                  @onChange="onchangeFather"
                />
                <small class="p-error" id="text-error">{{ errorMessages.Father }}</small>
              </div>
            </div>
          </div>
          <div class="field col-12 pr-0">
            <div class="input-header">
              <h6>{{ $t("OrgStrct.OrgLevel") }}</h6>
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
                  v-model="CCTC_model.Level"
                  :options="API_CTC_DATA.filter((x) => x.IsActive == 'A')"
                  filter
                  :class="{ 'p-invalid': errorMessages.Level }"
                  optionLabel="OrlName"
                  optionValue="ID"
                  :placeholder="$t('OrgStrct.SelectOrgLevel')"
                  class="w-full"
                >
                </Dropdown>
                <small class="p-error" id="text-error">{{ errorMessages.Level }}</small>
              </div>
            </div>
          </div>
          <div class="field col-6 pr-0">
            <div class="input-header">
              <h6>{{ $t("OrgStrct.Status") }}</h6>
            </div>
            <div class="formgrid">
              <div class="#">
                <Dropdown
                  v-model="CCTC_model.IsActive"
                  :options="status"
                  optionValue="code"
                  optionLabel="name"
                  :placeholder="$t('Status.SelectStatus')"
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
    :header="$t('valid_msg.ConfDelete2')"
    v-model:visible="displayConfirmDelete"
    :style="{ width: '350px' }"
    :modal="true"
  >
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>
        {{ $t("valid_msg.ConfDelete", [$t("OrgStrct.Header").toLowerCase()]) }}</span
      >
    </div>
    <template #footer>
      <Button
        :label="$t('Button.Cancel')"
        icon="pi pi-times"
        @click="displayConfirmDelete = false"
        severity="secondary"
      />
      <Button
        :loading="loading"
        :label="$t('Button.Delete')"
        icon="pi pi-check "
        @click="deleteNode"
        autofocus
      />
    </template>
  </Dialog>
  <Dialog
    header="XOÁ CƠ CẤU TỔ CHỨC"
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
          :label="$t('Button.Cancel')"
          icon="pi pi-times"
          @click="displayConfirmationDeleteRows = false"
          severity="secondary"
        />
        <Button
          :loading="loading"
          :label="$t('Button.Delete')"
          icon="pi pi-check"
          @click="deleteSelectedNodes"
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
  bottom: 0px;
  height: 630px;
  overflow: auto;
}

:root {
  --surface-hover: #f6f9fc;
  --boder-color: #d1d4db;
}

.card {
  border-radius: unset;
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

.right-panel {
  border-radius: unset;
  height: 53rem;
}

.p-button.p-button-text {
  color: #374151;
}
</style>
