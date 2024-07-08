<script setup>
import { NodeService } from '@/service/NodeService';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, ref, watch } from 'vue';
import { getVehicles } from '@/services/VehicleService';
import mqtt from "mqtt";

const initialMap = ref(null);
const vehicles = ref(null);
const checkboxValue = ref([]);
const selectedVehicle = ref(null);
const vehicleDetailsEmpty = ref(null);
const vehicleDetails = ref(null);
let marker = null;

const fetchVehicles = () => {
    getVehicles().then((data) => {
        data = data.sort((a, b) => a.order - b.order);
        vehicles.value = data;
    });
};

const connectMqttServers = () => {
    const client = mqtt.connect({
        host: 'localhost',
        port: 8888,
        clientId: 'AE_dashboard',
        username: 'test',
        password: 'test'
    });

    client.on("connect", () => {
        client.subscribe("/ae_gen0/localization", (err) => {
            console.log(err);
        });
    });

    client.on("message", (topic, message) => {
        const msg = JSON.parse(message.toString());

        addMarker([msg.lat, msg.lng]);

        console.log(msg);
    });
}

const addMarker = (position) => {
    if (marker !== null) initialMap.value.removeLayer(marker);

    const carIcon = L.icon({
        iconUrl: 'favicon.ico',

        iconSize: [30, 33], // size of the icon
        iconAnchor: [15, 33], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -33] // point from which the popup should open relative to the iconAnchor
    });

    marker = L.marker(position, {icon: carIcon});
    initialMap.value.addLayer(marker).on('click', () => alert('test'));
}

onMounted(() => {
    connectMqttServers();
    fetchVehicles();
    
    initialMap.value = L.map('map', { attributionControl: false }).setView([24.447071, 54.39466], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
    }).addTo(initialMap.value);

    watch(selectedVehicle, (data) => {
        vehicleDetails.style = "display: block";
    });
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" style="padding: 0">
                <div>
                    <div id="map" style="height: 50vh; border-radius: 12px"></div>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card">
                <h5>Vehicles</h5>
                <DataTable
                    :value="vehicles"
                    dataKey="id"
                    :rowHover="true"
                    :rowSelect="true"
                    v-model:selection="selectedVehicle"
                    selectionMode="single"
                >
                    <template #empty>No vehicles found.</template>
                    <template #loading>Loading vehicles data. Please wait. </template>
                    <Column field="name" header="" style="min-width: 12rem">
                        <template #body="{ data }">
                            <i class="pi pi-car"></i>&nbsp; {{ data.name }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <div class="col-6">
            <div class="card text-center" v-if="!selectedVehicle">Please select a vehicle.</div>
            <div class="card" v-if="selectedVehicle">
                <h5 style="display: inline"><i class="pi pi-fw pi-car"></i> {{ selectedVehicle.name }}</h5>
                <span style="color: green; background: lightgreen; padding: 5px; border-radius: 5px; display: inline; float: right">• Online</span>
            </div>
        </div>
    </div>
</template>
