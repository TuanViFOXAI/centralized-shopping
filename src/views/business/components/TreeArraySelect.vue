<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount, toRaw } from "vue";
import { onClickOutside } from "@vueuse/core";
import TreeArray from "./TreeArray.vue";

const el = ref();

onClickOutside(el, () => {
  visible.value = false;
});

const emit = defineEmits(["onChange"]);
const visible = ref(false);
const searchText = ref(null);
const textView = ref(null);
const nodeSelected = ref(null);
defineOptions({
  inheritAttrs: false,
});
const props = defineProps({
  config: {
    type: Object,
    default: {
      field: { id: "id", code: "card_code", label: "card_name", children: "children" },
      ES_Root: false,
    },
  },
  disabled: Boolean,
  data: Array,
  placeholder: String,
  selectedId: {
    type: Number,
    default: null,
  },
});

const openPanel = () => {
  visible.value = !visible.value;
};

function findNodeWithId(array, id) {
  for (const item of array) {
    if (item[props.config.field.id] === id) {
      return item;
    }
    if (
      item[props.config.field.children] &&
      item[props.config.field.children].length > 0
    ) {
      const foundInChildren = findNodeWithId(item[props.config.field.children], id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return null;
}

const selectRoot = () => {
  textView.value = "-------------";
  visible.value = false;
  let obj = {};
  obj[props.config.field.id] = -1;
  nodeSelected.value = obj;
  //???????????
  emit("onChange", nodeSelected);
};

const selectedNode = (data) => {
  nodeSelected.value = data;
  emit("onChange", nodeSelected);
  textView.value = data[props.config.field.code] + " - " + data[props.config.field.label];
  visible.value = false;
};

onMounted(() => {
  //let finder = searchTree(props.data, props.selected.id);
  // var inp = document.getElementById("drop-input");
  // inp.addEventListener("mousedown", function (event) {
  //   event.preventDefault();
  // });
  if (props.selectedId && props.selectedId >= 0) {
    const result = findNodeWithId(props.data, props.selectedId);
    if (result) {
      nodeSelected.value = result;
      textView.value =
        result[props.config.field.code] + " - " + result[props.config.field.label];
    } else {
      textView.value = "result is null - null";
    }
  } else if (props.selectedId < 0) {
    let obj = {};
    obj[props.config.field.id] = -1;
    nodeSelected.value = obj;
    //???????????
    emit("onChange", nodeSelected);
    textView.value = "-------------";
  } else {
    textView.value = "";
  }
});
</script>

<template>
  <div id="tree-drop" class="input w-full" ref="el">
    <span class="w-full p-input-icon-right">
      <InputText
        :class="{'none-pointer':props.disabled}"
        :disabled="props.disabled"
        v-bind="$attrs"
        @click="openPanel"
        @keypress.enter="openPanel"
        v-model="textView"
        class="w-full"
        type="text"
        :placeholder="props.placeholder"
        style="cursor: pointer"
        readonly
        id="drop-input"
      />
      <i :class="{'disabled': props.disabled}" class="pi pi-angle-down" />
    </span>
    <ul class="dropdown w-full" :class="{ active: visible }">
      <div class="dropdown-header p-input-icon-right">
        <InputText size="small" class="w-full" v-model="searchText" />
        <i class="pi pi-filter" />
      </div>
      <div id="tree-select" class="dropdown-content">
        <li class="select-root font-bold" v-if="props.config.ES_Root" @click="selectRoot">
          <span>-------------</span>
        </li>
        <template v-if="props.config.field">
          <TreeArray
            :config="props.config.field"
            :searchText="searchText"
            :data.sync="props.data"
            @select-node="selectedNode"
          />
        </template>
        <template v-else>
          <TreeArray
            :config="props.config.field"
            :searchText="searchText"
            :data.sync="props.data"
            @select-node="selectedNode"
          />
        </template>
      </div>
    </ul>
  </div>
</template>

<style scoped>

#drop-input{
  background-color: transparent;
}

.disabled{
  color: #b3b5ba;
}

.none-pointer{
  cursor: default !important;
}

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.select-root span {
  padding-left: 20px;
  line-height: 40px;
}
.select-root {
  cursor: pointer;
  display: block;
  height: 40px;
  padding: 0;
}

.select-root:hover {
  color: #4b5563;
  background: #f3f4f6;
  border-left: 2px solid var(--primary-color);
}
.dropdown-content {
  padding: 10px;
  overflow: auto;
  height: 100%;
  max-height: 200px;
}

.dropdown-header i {
  margin-right: 25px;
}

.dropdown-header {
  padding: 10px 20px;
  width: 100%;
  background-color: #f9fafc;
  border-bottom: 1px solid #e3e3e3;
  z-index: 99 !important;
}

.active {
  display: block !important;
}

.input {
  position: relative;
  z-index: 99 !important;
}

.dropdown {
  padding: 0px;
  display: none;
  border-radius: 10px;
  top: 30px;
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  width: 300px;
}
</style>
