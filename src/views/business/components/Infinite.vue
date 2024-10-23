<template>
  <div class="card p-0 surface-200">
    <div>
      <div class="gird">
        <div class="col-12">
          <div
            class="bg-surface-card"
            ref="scrollContainer"
            style="height: 300px; overflow-y: scroll; overflow-x: hidden"
            @scroll="handleScroll"
          >
            <div class="grid surface-50">
              <div
                class="col-12 flex border-bottom-1 card m-1 p-3"
                style="cursor: pointer"
                v-for="item in items"
                :key="item.ID"
                @click="sendData(item)"
              >
                <Checkbox
                  class="text-right"
                  v-if="type == 'multi'"
                  v-model="selected"
                  :value="item"
                />
                <RadioButton
                  class="text-right"
                  v-if="type == 'one'"
                  v-model="selected"
                  :value="item"
                />
                <div class="ml-2">
                  <div v-for="i in dataHeader" :key="i">
                    <p class="" v-if="i.type == 'String'">
                      <strong>{{ i.title }}</strong>
                      {{ i.key2 ? item[i.key][i.key2] : item[i.key] }}
                    </p>
                    <p class="" v-if="i.type == 'Datetime'">
                      <strong>{{ i.title }}</strong>
                      {{ format(item[i.key], "dd/MM/yyyy") }}
                    </p>
                    <p class="" v-if="i.type == 'bool'">
                      <strong>{{ i.title }}</strong>
                      {{ item[i.key] == "A" ? "Hoạt động" : "Không hoạt động" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="loading" class="loading text-bold m-0">Đang tải...</p>

      <p class="text-red-500 m-0 text-center" v-if="!checkRow">Không còn bản ghi nào</p>

      <p class="text-green-600 m-0 text-center" v-if="items.length">
        Đã tải lên {{ items.length }} bản ghi
      </p>
      <!-- <p class="text-red-500 m-0 text-center" v-if="error">
        Máy chủ hiện đang quá tải vui lòng thử lại sau
      </p> -->
    </div>
  </div>
</template>

<script>
import API from "../../../apis/api";
import { format } from "date-fns";

export default {
  props: ["url", "dataHeader", "type", "filter", "search"],
  data() {
    return {
      items: [],
      loading: false,
      page: 1,
      perPage: 4,
      check: false,
      selected: [],
      format: format,
      checkRow: true,
      error: false,
    };
  },
  mounted() {
    // Initially load data
    this.loadData();
  },
  methods: {
    handleScroll() {
      const container = this.$refs.scrollContainer;
      const total = Math.floor(container.scrollHeight - container.scrollTop);
      if (total === container.clientHeight) {
        this.loadData();
      }
    },
    async loadData(data) {
      if (this.loading) return;
      this.loading = true;
      this.checkRow = true;
      this.error = false;
      const params = {
        page: this.page,
        size: this.perPage,
      };

      if (this.filter) {
        console.log(this.filter);
        for (let index = 0; index < this.filter.length; index++) {
          this.filter[index];
          const key = Object.keys(this.filter[index])[0];
          if (this.filter[index][key] != "") params[key] = this.filter[index][key];
        }
      } else {
        if (data) {
          for (let index = 0; index < data.length; index++) {
            data[index];
            const key = Object.keys(data[index])[0];
            if (data[index][key] != "") params[key] = data[index][key];
          }
        }
      }
      // Simulate loading data from an API
      const newData = await this.fetchData(params);
      console.log(params);

      if (newData.length) {
        this.page++;
      } else {
        this.checkRow = false;
      }

      // Append new data to existing items
      this.items = this.items.concat(newData);
      this.loading = false;
    },
    async fetchData(params) {
      // Simulate fetching data from an API
      return new Promise((resolve) => {
        setTimeout(() => {
          API.get_all_v2(this.url, {
            data: params,
          })
            .then((res) => {
              if (res.data.data) {
                resolve(res.data.data);
              } else {
                resolve([]);
              }
            })
            .catch((error) => {
              this.loading = false;
              if (error) this.error = true;
            });
        }, 1000); // Simulate delay
      });
    },
    sendData(item) {
      const dataToSend = item;
      this.$emit("send-data", dataToSend);
    },
    sendDataMulti() {
      this.$emit("send-data-multi", this.selected);
    },
    search_key(data) {
      this.page = 1;
      this.items = [];
      this.loadData(data);
    },
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
}

::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
