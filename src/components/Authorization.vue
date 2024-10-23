<template>
    <div class="not-found">
        <div class="card-not-found card">
            <h1>{{ props.code }} - {{ props.title }}</h1>
            <div class="title mb-3">{{ props.message }}</div>
            <div v-if="props.code === 406">
                Còn lại: <span id="count-down"></span>
            </div>
            <div class="flex justify-end">
                <Button label="Quay lại" @click="onClickRouterBack" ></Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps(['code','title','message','time']);
const router = useRouter();

const onClickRouterBack = () => {
    router.back()
}

onMounted(() => {
    if(props.code === 406){
        var inner = document.getElementById("count-down");
        inner.innerHTML = `${0} ngày : ${0} giờ : ${0} phút : ${0} giây`;
        var counter = setInterval(function() {
            var distance = props.time.getTime() - new Date().getTime();

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            inner.innerHTML = `${days? days+ ' ngày : ': ''} ${hours} giờ : ${minutes} phút : ${seconds} giây`;

            if (distance < 0) {
                clearInterval(counter);
                inner.innerHTML = "Gói thầu đã đóng. Vui lòng đợi...";
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }
        }, 1000);
        
    }
});

</script>

<style scoped>
#count-down{
    margin-left: 1rem;;
    font-weight: bold;
    color: red;
}

h1{
    color: red;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<style>
.not-found{
    padding: 3rem;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.layout-main{
    flex:1 1 auto;
}
</style>