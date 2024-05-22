<script setup>
import { NodeService } from '@/service/NodeService';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, ref, watch } from 'vue';

const initialMap = ref(null);
const treeValue = ref(null);
const selectedTreeValue = ref(null);
const nodeService = new NodeService();

onMounted(() => {
    initialMap.value = L.map('map', { attributionControl: false }).setView([24.4202154, 54.5019644], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: ''
    }).addTo(initialMap.value);

    const carIcon = L.icon({
        iconUrl: 'favicon.ico',

        iconSize: [30, 33], // size of the icon
        iconAnchor: [15, 33], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -33] // point from which the popup should open relative to the iconAnchor
    });

    nodeService.getTreeNodes().then((data) => (treeValue.value = data));

    let marker = '';

    watch(selectedTreeValue, (v) => {
        if (v[0]) {
            if (v[0].checked) {
                marker = L.marker([24.420394, 54.50244], { icon: carIcon });
                marker.bindPopup('AV1-G0');
                initialMap.value.addLayer(marker);
                document.getElementById('noVehicle').style = 'display: none';
                document.getElementById('withVehicle').style = 'display: block';
            } else {
                document.getElementById('noVehicle').style = 'display: block';
                document.getElementById('withVehicle').style = 'display: none';
                initialMap.value.removeLayer(marker);
            }
        } else {
            document.getElementById('noVehicle').style = 'display: block';
            document.getElementById('withVehicle').style = 'display: none';
            initialMap.value.removeLayer(marker);
        }
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
                <Tree :value="treeValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeValue"></Tree>
            </div>
        </div>
        <div class="col-6">
            <div class="card text-center" id="noVehicle">Please select a vehicle.</div>
            <div class="card" id="withVehicle" style="display: none">
                <h5 style="display: inline"><i class="pi pi-fw pi-car"></i> AV1-G0</h5>
                <span style="color: green; background: lightgreen; padding: 5px; border-radius: 5px; display: inline; float: right">• Online</span>
                <span style="display: block; font-style: italic; margin-top: 5px; font-size: 13px">Gen0 > AV1-G0</span>
            </div>
        </div>
    </div>
</template>
