<template>
    <div class="loading" :style="{
        'background-color': (props.fill === undefined ? null : (props.fill || '#dbe2e8') ),
        'height': props.height

     }">
        <div class="spinner">
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';
const props = defineProps({
    height: {
        type: String,
        default: '5rem'
    },
    fill: {
    }
})
</script>

<style scoped>
.loading{
    display: block;
    height: 3rem;
    display: flex;
    justify-items: baseline;
    justify-content: center;
}
.spinner{
    align-content: center;
}
svg {
 width: 3.25em;
 transform-origin: center;
 animation: rotate4 2s linear infinite;
}

circle {
 fill: none;
 stroke: hsl(214, 97%, 59%);
 stroke-width: 2;
 stroke-dasharray: 1, 200;
 stroke-dashoffset: 0;
 stroke-linecap: round;
 animation: dash4 1.5s ease-in-out infinite;
}

@keyframes rotate4 {
 100% {
  transform: rotate(360deg);
 }
}

@keyframes dash4 {
 0% {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
 }

 50% {
  stroke-dasharray: 90, 200;
  stroke-dashoffset: -35px;
 }

 100% {
  stroke-dashoffset: -125px;
 }
}

</style>