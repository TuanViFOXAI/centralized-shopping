<template>
    <div class="tree-area">
      <ul class="m-0">
          <div class="tree-item">
            <template v-if="!props.searchText">
                <li v-for="(element, index) in props.data" :key="element[props.config.id]">
                    <div class="tree-root" :class="{'node-selected': props.selectedId == element[props.config.id]}">
                        <div class="tree-btn">
                            <button v-if="element[props.config.children] && element[props.config.children].length > 0"
                                @click="() => {
                                  if(ef){
                                    ef = false;
                                    expand['id'+element[props.config.id]] = false;
                                }
                                  else
                                    expand['id'+element[props.config.id]] = !expand['id'+element[props.config.id]];
                                }">
                                <i class="pi" :class="{ 'pi-angle-right': !expand['id'+element[props.config.id]] && !ef , 'pi-angle-down': expand['id'+element[props.config.id]] || ef  }"></i>
                            </button>
                        </div>
                        <a class="tree-label" style="cursor: pointer;" 
                            @click.prevent="onSelect(element, props.selectedId,element[props.config.id])"
                            :class="{ 'font-bold': element[props.config.father] == -1 }"
                            > {{ element[props.config.label] }}
                        </a>
                    </div>
                    <ul class="tree-list" :class="{ 'show': expand['id'+element[props.config.id]] || ef }"
                        v-if="(element[props.config.children] && element[props.config.children].length > 0)">
                        <TreeArray :config="props.config" :selectedId="props.selectedId" :data="element[props.config.children]" @select-node="$emit('select-node', $event)" :depth="depth + 1"/>
                    </ul>
                </li>
            </template>
            <template v-else>
                <li v-for="(element, index) in dataFilted" :key="element[props.config.id]">
                    <div class="tree-root" :class="{'node-selected': props.selectedId == element[props.config.id]}">
                        <div class="tree-btn">
                            <button v-if="element[props.config.children] && element[props.config.children].length > 0"
                                @click="expand['id'+element[props.config.id]] = !expand['id'+element[props.config.id]] ">
                                <i class="pi" :class="{ 'pi-angle-right': !expand['id'+element[props.config.id]] , 'pi-angle-down': expand['id'+element[props.config.id]]  }"></i>
                            </button>
                        </div>
                        <a class="tree-label" style="cursor: pointer;" 
                            @click.prevent="onSelect(element, props.selectedId,element[props.config.id])"
                            :class="{ 'font-bold': element[props.config.father] == -1 }"
                            > {{ element[props.config.label] }}
                        </a>
                    </div>
                    <ul class="tree-list" :class="{ 'show': expand['id'+element[props.config.id]] }"
                        v-if="(element[props.config.children] && element[props.config.children].length > 0)">
                        <TreeArray :config="props.config" :selectedId="props.selectedId" :data="element[props.config.children]" @select-node="$emit('select-node', $event)" :depth="depth + 1"/>
                    </ul>
                </li>
            </template>
          </div>
      </ul>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeMount, ref, watch } from "vue";
const expand = ref({});
const ef = ref()
const emit = defineEmits(["select-node"]);
const props = defineProps({
  selectedId: Number,
  data: Array,
  searchText: String,
  depth: Number,
  expandFirst: {
    type: Boolean,
    default: false
  },
  config: {
    type: Object,
    default: {
      id: "id",
      label: "card_name",
      code: "card_code",
      father: "father",
      children: "children",
    },
  },
});
const dataFilted = ref([]);

onMounted(() => {
  ef.value = props.expandFirst;
})

watch(
  () => props.searchText,
  (newV) => {
    if (newV && newV.trim() !== "") {
      setTimeout(() => {
        dataFilted.value = filterNodes(props.data, newV.trim());
      }, 200);
    } else if (newV && newV.trim() == "") {
      setTimeout(() => {
        dataFilted.value = [];
      }, 200);
    } else {
      dataFilted.value = props.data;
    }
  }
);

const onSelect = (node) => {
  emit("select-node", node);
};

const filterNodes = (array, key) => {
  const lowerKey = key.toLowerCase();
  if (Array.isArray(array)) {
    return array
      .filter((element) => {
        return (
          (element[props.config.code] &&
            element[props.config.code].toLowerCase().includes(lowerKey)) ||
          (element[props.config.label] &&
            element[props.config.label].toLowerCase().includes(lowerKey))
        );
      })
      .concat(
        ...array.map((element) => {
          return filterNodes(element[props.config.children], key);
        })
      );
  } else {
    return [];
  }
};
</script>

<style scoped>
:root {
  --btn-color: #707580;
}
.tree-area {
  z-index: 3102;
}
.node-selected {
  font-weight: bold;
  background: #f3f4f6;
  border-left: 2px solid var(--primary-color) !important;
}

.show {
  display: block !important;
}

.tree-btn {
  display: flex;
  align-items: center;
  height: 37px;
  padding: 0 5px 0 5px;
}

.tree-btn button {
  cursor: pointer;
  border-radius: 3px;
  color: var(--btn-color);
  border: 1px solid #cecece;
  /* border-radius: 5px; */
  background-color: white;
  max-height: 20px;
  max-width: 20px;
  padding: 2px;
}

.tree-root {
  display: inline-flex;
  width: 100%;
  height: 100%;
  margin: 0px 0 0px 0;
  /* border-radius: 5px 0 0 5px; */

  /* border-bottom: 1px solid rgba(134, 134, 134, 0.371); */
}

.tree-root:hover {
  color: #4b5563;
  background: var(--surface-hover);
  border-left: 2px solid var(--blue-300);
}

.tree-label {
  padding: 10px;
  height: 40px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.tree-list {
  display: none;
  padding-left: 25px;
  border-left: 1px dashed rgba(134, 134, 134, 0.694);
}

li {
  height: fit-content;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
