<template>
    <input ref="file_input" @change="onSelectFiles($event)" type="file" :accept="props.accept" style="visibility: hidden; position: absolute" :multiple="props.multiple === true ? true : null" />
    <Button :loading="props.loading" :style="props.style" :label="props.label" :outlined="props.outlined" :severity="props.severity" :icon="props.icon" :size="props.size" @click="openSelectFiles" />
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(["on-select"]);
const props = defineProps({
    label: {
        type: String,
        default: "Chọn file"
    },
    icon: {
        type: String,
        default: "pi pi-file-import" 
    },
    accept: {
        type: String,
        default: "*"
    },
    multiple : {
        type: Boolean,
        default: true
    },
    severity: {
        type: String,
        default: "primary"
    },
    outlined: {
        type: Boolean,
        default: true
    },
    style: String,
    size: {
        type: String,
        default: 'small'
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/avif','image/webp'];
const file_input = ref();
const dataFiles = ref([]);

const iconType = (fileType) => {
    switch(fileType){
        case 'xls/xlsx':
            return 'pi pi-file-excel';
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'pi pi-file-excel';
        case 'application/pdf':
            return 'pi pi-file-pdf';
        case 'application/msword':
            return 'pi pi-file-word';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'pi pi-file-word';
        default:
            return 'pi pi-file';
    }
}

const openSelectFiles = () => {
    file_input.value.click();
    dataFiles.value = [];
}

const onSelectFiles = (e) => {
    // console.log(e.target.files);
    for(let _file of e.target.files){
        const isImage = validImageTypes.includes(_file.type);
        dataFiles.value.push({
            File: _file,
            IsImage: isImage,
            Link: URL.createObjectURL(_file), // Blob url,
            Icon: iconType(_file.type),
            Size: humanFileSize(_file.size, true)
        })
    }
    // console.log(dataFiles.value);
    if(props.multiple){
        emit("on-select", dataFiles.value)
    }
    else{
        emit("on-select", dataFiles.value[0]);
    }
    e.target.value = null;
}

function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}

</script>

<style scoped>
.file{
    border: 1px dashed var(--primary-color);
    display: block;
    width: 100px;
    height: 110px;
}
</style>