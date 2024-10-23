<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useLayout } from "@/layout/composables/layout";
import API from "../apis/api";

// import socket from "../services/socket";

const { layoutConfig } = useLayout();
let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue("--text-color");
let textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
let surfaceBorder = documentStyle.getPropertyValue("--surface-border");

const lineData = ref(null);
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const barData_2 = ref(null);
const radarData = ref(null);

const lineOptions = ref(null);
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);
const message = ref(null);
const dataChart = ref(null);
const dataChart_2 = ref(null);
const year_data = ref([]);
const op = ref();
const op_2 = ref();
const IdOors = JSON.parse(localStorage.getItem("user"))["OrsId"];
const dataEdit = ref({
  type_date: "S",
  type: "M",
  typeChart: "bar",
  typeChart_2: "bar",
  year: new Date().getFullYear(),
  year_2: new Date().getFullYear(),
  type_2: "M",
});
const setColorOptions = () => {
  documentStyle = getComputedStyle(document.documentElement);
  textColor = documentStyle.getPropertyValue("--text-color");
  textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
  surfaceBorder = documentStyle.getPropertyValue("--surface-border");
};

const setChart = () => {
  pieData.value = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [
          documentStyle.getPropertyValue("--indigo-500"),
          documentStyle.getPropertyValue("--purple-500"),
          documentStyle.getPropertyValue("--teal-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--indigo-400"),
          documentStyle.getPropertyValue("--purple-400"),
          documentStyle.getPropertyValue("--teal-400"),
        ],
      },
    ],
  };
  lineData.value = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Data",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: documentStyle.getPropertyValue("--primary-500"),
        borderColor: documentStyle.getPropertyValue("--primary-500"),
        tension: 0.4,
      },
    ],
  };
};

watch(
  layoutConfig.theme,
  () => {
    setColorOptions();
    setChart();
  },
  { immediate: true }
);

onBeforeMount(() => {
  barOptions.value = setOptions();
  lineOptions.value = setOptions();
  pieOptions.value = setOptions();
  setYear();
  getChart();
  getChart_2();
});

const getChart = () => {
  API.get_all(
    "ocma/report?type_date=" +
      dataEdit.value.type_date +
      "&type=" +
      dataEdit.value.type +
      "&year=" +
      dataEdit.value.year
  ).then((res) => {
    dataChart.value = res.data;
    barData.value = {
      datasets: [
        {
          label: "Khởi tạo",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
        {
          label: "Đang thực hiện",
          backgroundColor: documentStyle.getPropertyValue("--yellow-500"),
          borderColor: documentStyle.getPropertyValue("--yellow-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
        {
          label: "Đã hoàn thành",
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
        {
          label: "Huỷ",
          backgroundColor: documentStyle.getPropertyValue("--gray-500"),
          borderColor: documentStyle.getPropertyValue("--gray-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },

        {
          label: "Thất bại",
          backgroundColor: documentStyle.getPropertyValue("--red-500"),
          borderColor: documentStyle.getPropertyValue("--red-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
      ],
    };
    if (dataChart.value.length === 12)
      barData.value.labels = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
    if (dataChart.value.length === 4)
      barData.value.labels = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];
    if (dataChart.value.length === 52) {
      const w = [];
      for (let index = 1; index <= 52; index++) {
        w.push("Tuần " + index);
      }
      barData.value.labels = w;
    }
    const a1 = [];
    const a2 = [];
    const a3 = [];
    const a4 = [];
    const a5 = [];

    for (let index = 0; index < dataChart.value.length; index++) {
      const item = dataChart.value[index];
      a1.push(item.Success);
      a2.push(item.Process);
      a3.push(item.Failure);
      a4.push(item.Initialization);
      a5.push(item.Cancel);
    }
    barData.value.datasets[2].data = a1;
    barData.value.datasets[1].data = a2;
    barData.value.datasets[4].data = a3;
    barData.value.datasets[0].data = a4;
    barData.value.datasets[3].data = a5;
  });
};
const getChart_2 = () => {
  API.get_all(
    "report/ospl/chart?type=" +
      dataEdit.value.type_2 +
      "&oors_id=" +
      IdOors +
      "&date=" +
      dataEdit.value.year_2
  ).then((res) => {
    dataChart_2.value = res.data;
    barData_2.value = {
      datasets: [
        {
          label: "Chưa thực hiện",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
        {
          label: "Đang thực hiện",
          backgroundColor: documentStyle.getPropertyValue("--yellow-500"),
          borderColor: documentStyle.getPropertyValue("--yellow-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
        {
          label: "Đã thực hiện",
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          borderColor: documentStyle.getPropertyValue("--green-500"),
          tension: 0.4,
          fill: false,
          data: [],
        },
      ],
    };
    if (dataChart_2.value.length === 12)
      barData_2.value.labels = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
    if (dataChart_2.value.length === 4)
      barData_2.value.labels = ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];
    if (dataChart_2.value.length === 52) {
      const w = [];
      for (let index = 1; index <= 52; index++) {
        w.push("Tuần " + index);
      }
      barData_2.value.labels = w;
    }
    const a1 = [];
    const a2 = [];
    const a3 = [];

    for (let index = 0; index < dataChart_2.value.length; index++) {
      const item = dataChart_2.value[index];
      a1.push(item.Completed);
      a2.push(item.InProcess);
      a3.push(item.Planing);
    }
    barData_2.value.datasets[2].data = a1;
    barData_2.value.datasets[1].data = a2;
    barData_2.value.datasets[0].data = a3;
  });
};

const setOptions = () => {
  return {
    indexAxis: "x",
    maintainAspectRatio: false,
    aspectRatio: 0.2,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
};
const setYear = () => {
  let year = 1999;
  for (let index = 0; index < 99; index++) {
    year += 1;
    year_data.value.push(year);
  }
};
const toggle = (event) => {
  op.value.toggle(event);
};
const toggle_2 = (event) => {
  op_2.value.toggle(event);
};
</script>

<template>
  <div class="grid p-fluid card">
    <div class="col-12 xl:col-12 pt-0">
      <div class="card">
        <div class="grid">
          <div class="col-12">
            <div class="flex justify-content-between">
              <h5 class="m-0">Biểu đồ trạng thái gói thầu</h5>
              <div>
                <Button
                  text
                  icon="pi pi-chart-bar"
                  severity="warning"
                  @click="dataEdit.typeChart = 'bar'"
                />
                <Button
                  text
                  icon="pi pi-chart-line"
                  severity="info"
                  @click="dataEdit.typeChart = 'line'"
                />
                <Button text icon="pi pi-bars" @click="toggle" />
              </div>
            </div>
            <Chart
              :type="dataEdit.typeChart"
              :data="barData"
              :options="barOptions"
              style="height: 18rem"
            ></Chart>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 xl:col-6 pt-0">
      <div class="card">
        <div class="grid">
          <div class="col-12">
            <div class="flex justify-content-between">
              <h5 class="m-0">Biểu đồ thống kê mua sắm</h5>
              <div>
                <Button
                  text
                  icon="pi pi-chart-bar"
                  severity="warning"
                  @click="dataEdit.typeChart_2 = 'bar'"
                />
                <Button
                  text
                  icon="pi pi-chart-line"
                  severity="info"
                  @click="dataEdit.typeChart_2 = 'line'"
                />
                <Button text icon="pi pi-bars" @click="toggle_2" />
              </div>
            </div>
            <Chart
              :type="dataEdit.typeChart_2"
              :data="barData_2"
              :options="barOptions"
              style="height: 18rem"
            ></Chart>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 xl:col-6 pt-0">
      <div class="card flex flex-column align-items-center">
        <h5 class="text-left w-full">Biểu đồ thống kê nhà cung cấp</h5>
        <Chart
          type="doughnut"
          :data="pieData"
          :options="pieOptions"
          class="h-20rem"
        ></Chart>
      </div>
    </div>
  </div>

  <OverlayPanel ref="op">
    <div class="grid">
      <div class="col-12">
        <div>
          <!-- <small>Năm</small> -->
          <div class="grid">
            <div class="col-12">
              <Dropdown
                :options="year_data"
                v-model="dataEdit.year"
                @change="getChart()"
                size="small"
                :pt="{
                  root: { style: 'height: 40px' },
                  input: { style: 'height: 40px' },
                  trigger: { style: 'height: 40px' },
                  clearIcon: { style: 'height: 40px' },
                }"
              />
            </div>
          </div>
          <div class="card p-2 m-0 mt-1">
            <div class="grid">
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type" value="Q" @change="getChart" />
                <small for="ingredient2" class="ml-2">Quý</small>
              </div>
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type" value="M" @change="getChart" />
                <small for="ingredient3" class="ml-2">Tháng</small>
              </div>
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type" value="W" @change="getChart" />
                <small for="ingredient4" class="ml-2">Tuần</small>
              </div>
            </div>
          </div>
          <div class="card p-2 m-0 mt-1">
            <div class="grid">
              <div class="flex align-items-center col-12">
                <RadioButton v-model="dataEdit.type_date" value="S" @change="getChart" />
                <small for="ingredient2" class="ml-2">Ngày bắt đầu</small>
              </div>
              <div class="flex align-items-center col-12">
                <RadioButton v-model="dataEdit.type_date" value="E" @change="getChart" />
                <small for="ingredient3" class="ml-2">Ngày kết thúc</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OverlayPanel>
  <OverlayPanel ref="op_2">
    <div class="grid">
      <div class="col-12">
        <div>
          <!-- <small>Năm</small> -->
          <div class="grid">
            <div class="col-12">
              <Dropdown
                :options="year_data"
                v-model="dataEdit.year_2"
                @change="getChart_2()"
                size="small"
                :pt="{
                  root: { style: 'height: 40px' },
                  input: { style: 'height: 40px' },
                  trigger: { style: 'height: 40px' },
                  clearIcon: { style: 'height: 40px' },
                }"
              />
            </div>
          </div>
          <div class="card p-2 m-0 mt-1">
            <div class="grid">
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type_2" value="Q" @change="getChart_2" />
                <small for="ingredient2" class="ml-2">Quý</small>
              </div>
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type_2" value="M" @change="getChart_2" />
                <small for="ingredient3" class="ml-2">Tháng</small>
              </div>
              <div class="flex align-items-center lg:col-6 md:col-12">
                <RadioButton v-model="dataEdit.type_2" value="W" @change="getChart_2" />
                <small for="ingredient4" class="ml-2">Tuần</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>
