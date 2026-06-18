import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles/tailwind.css";
import socket from "./plugins/socket";
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);
app.config.globalProperties.$socket = socket;
app.mount("#app");
