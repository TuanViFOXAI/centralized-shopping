<template>
    <div @click="togglePanel" class="dropdown-custome flex pointer">
        <div id="chip-container" class="chips flex gap-2">
            <Chip :id="'chip_'+i" v-for="(item, i) in props.value" :key="i">
                <span class="">{{ props.optionLabel ? accessToObjectProperty(item,props.optionLabel) : item }}</span>
            </Chip>
            <Chip v-if="numOfChipRemain > 0">
                <span >+{{ numOfChipRemain }}</span>
            </Chip>
        </div>
        <div class="show-btn">
            <i class="pi pi-angle-down"></i>
        </div>
    </div>
    <OverlayPanel ref="op">
        <div class="flex gap-2 pannel-dropdown">
            <Chip :id="'chip_'+i" v-for="(item, i) in props.value" :key="i">
                <span class="">{{ props.optionLabel ? accessToObjectProperty(item,props.optionLabel) : item }}</span>
            </Chip>
        </div>
    </OverlayPanel>
</template>

<script setup>
import { computed, defineProps, onBeforeMount, onMounted, ref } from 'vue';
import { useElementSize } from '@vueuse/core'
const props = defineProps({
    value: {
        default: []
    },
    optionLabel: String
});

const op = ref();
const togglePanel = (event) => {
    op.value.toggle(event);
}


const accessToObjectProperty = (obj, stringKey) => {
    const keys = String(stringKey).split('.');
    try{
        const result = keys.reduce((value, entry) => value[entry], obj);
        return result;
    }
    catch{
        return obj;
    }
};

const numOfChipRemain = ref(0);

onMounted(() => {
    let numOfChipShow = 0;
    const container_chip = document.getElementById('chip-container');
    let container_width = container_chip.offsetWidth;
    for(let i = 0; i < props.value.length; i++){
        const chip = document.getElementById(`chip_${i}`);
        const chip_width = chip.offsetWidth;
        
        if(container_width > chip_width){
            container_width -= chip_width;
            numOfChipShow++;
        }
        else{
            chip.style.display = 'none';
        }
        
    }
    numOfChipRemain.value = props.value.length - numOfChipShow;
})

</script>

<style scoped>
.dropdown-custome {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    width: 100%;
    position: relative;
}

.expand{
    display: block !important;
}

.chips {
    padding: 0.375rem 0.75rem;
    overflow: hidden;
    white-space: nowrap;
    appearance: none;
    width: 100%;
}

.show-btn{
    padding:  0.75rem;
    border-radius: 0px 4px 4px 0px;
}

.p-chip {
    padding: 0.375rem 0.75rem;
}
.pointer{
  cursor: pointer;
}

.pannel-dropdown{
    overflow-y: auto;
    min-width: 30rem;
    max-height: 70rem;
    flex-wrap: wrap;
}

</style>