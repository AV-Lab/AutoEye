<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getVehicles, createVehicle, deleteVehicles, updateVehicle } from '@/services/VehicleService';
import { getChannels } from '@/services/ChannelService';

const toast = useToast();

const queryLoading = ref(true);
const vehicles = ref(null);
const vehicleDialog = ref(false);
const deleteVehicleDialog = ref(false);
const deleteVehiclesDialog = ref(false);
const vehicle = ref({});
const selectedVehicles = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const autoValue = ref(null);
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);
const channels = ref([]);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    fetchVehicles();
    fetchChannels();
});

const fetchChannels = () => {
    getChannels().then((data) => {
        data = data.sort((a, b) => a.order - b.order);
        const newData = data.map(({ id, name }) => ({ id, name }));
        autoValue.value = newData;
        channels.value = newData;
    });
};

const searchChannels = (event) => {
    if (!event.query.trim().length) {
        autoFilteredValue.value = [...autoValue.value];
    } else {
        autoFilteredValue.value = autoValue.value.filter((channel) => {
            return channel.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
    }
};

const fetchVehicles = () => {
    queryLoading.value = true;
    getVehicles().then((data) => {
        data = data.sort((a, b) => a.order - b.order);
        data.map((d) => (d.renderedChannels = d.channels.map((c) => c.name).join(',')));
        vehicles.value = data;
        queryLoading.value = false;
    });
};

const openNew = () => {
    vehicle.value = {};
    vehicle.value.order = Math.max(...vehicles.value.map((v) => v.order)) + 1;
    submitted.value = false;
    vehicleDialog.value = true;
};

const hideDialog = () => {
    selectedAutoValue.value = null;
    vehicleDialog.value = false;
    submitted.value = false;
};

const saveVehicle = () => {
    submitted.value = true;

    if (vehicle.value.name && vehicle.value.name.trim() && vehicle.value.order) {
        const vehicleName = vehicle.value.name.trim();
        const vehicleChannels = selectedAutoValue.value ? selectedAutoValue.value.map((v) => v.id) : [];
        const vehicleOrder = parseInt(vehicle.value.order);

        if (vehicle.value.id) {
            const vehicleId = vehicle.value.id.trim();

            updateVehicle(vehicleId, vehicleName, vehicleChannels, vehicleOrder).then((result) => {
                if (result.errors) {
                    result.errors.forEach((error) => {
                        toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Vehicle Updated', life: 3000 });
                    vehicleDialog.value = false;
                    vehicle.value = {};
                    fetchVehicles();
                }
            });
        } else {
            createVehicle(vehicleName, vehicleChannels, vehicleOrder).then((result) => {
                if (result.errors) {
                    result.errors.forEach((error) => {
                        toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Vehicle Created', life: 3000 });
                    vehicleDialog.value = false;
                    vehicle.value = {};
                    fetchVehicles();
                }
            });
        }

        selectedAutoValue.value = null;
    }
};

const editVehicle = (editVehicle) => {
    vehicle.value = { ...editVehicle };
    selectedAutoValue.value = vehicle.value.channels.map(({ id, name }) => ({ id, name }));
    vehicleDialog.value = true;
};

const confirmDeleteVehicle = (deleteVehicle) => {
    vehicle.value = deleteVehicle;
    deleteVehicleDialog.value = true;
};

const deleteVehicle = () => {
    vehicles.value = vehicles.value.filter((val) => val.id !== vehicle.value.id);
    deleteVehicles(vehicle.value.id).then((result) => {
        if (result.errors) {
            result.errors.forEach((error) => {
                toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
            });
        } else {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Vehicle Deleted', life: 3000 });
            deleteVehicleDialog.value = false;
            vehicle.value = {};
        }
    });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteVehiclesDialog.value = true;
};

const deleteSelectedVehicles = () => {
    vehicles.value = vehicles.value.filter((val) => !selectedVehicles.value.includes(val));
    const vehicleIds = selectedVehicles.value.map((v) => v.id);
    deleteVehicles(vehicleIds).then((result) => {
        if (result.errors) {
            result.errors.forEach((error) => {
                toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
            });
        } else {
            deleteVehiclesDialog.value = false;
            selectedVehicles.value = null;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Vehicles Deleted', life: 3000 });
        }
    });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

watch(selectedAutoValue, () => {
    const selectedVehicles = selectedAutoValue.value;
    if (selectedVehicles) {
        autoValue.value = channels.value;
        autoValue.value = autoValue.value.filter((v) => !selectedVehicles.includes(selectedVehicles.find((sv) => sv.id == v.id)));
    } else fetchChannels();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedVehicles || !selectedVehicles.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="vehicles"
                    v-model:selection="selectedVehicles"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vehicles"
                    :loading="queryLoading"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Vehicles</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple"></Column>
                    <Column field="name" header="Name" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="renderedChannels" header="Channels">
                        <template #body="slotProps">
                            <span class="p-column-title">Channels</span>
                            <div v-for="channel in slotProps.data.channels" :key="channel.id" style="display: inline-block">
                                <Tag class="mr-2" icon="pi pi-folder" :value="channel.name"></Tag>
                            </div>
                        </template>
                    </Column>
                    <Column field="order" header="Order" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Order</span>
                            {{ slotProps.data.order }}
                        </template>
                    </Column>
                    <Column>
                        <template #body="slotProps">
                            <div style="text-align: right">
                                <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editVehicle(slotProps.data)" />
                                <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteVehicle(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="vehicleDialog" :style="{ width: '450px' }" header="Vehicle Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="vehicle.name" required="true" autofocus :invalid="submitted && !vehicle.name" v-on:keyup.enter="saveVehicle" />
                        <small class="p-invalid" v-if="submitted && !vehicle.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="channels">Channels</label>
                        <AutoComplete placeholder="Select channels..." id="channels" :dropdown="true" :multiple="true" v-model="selectedAutoValue" :suggestions="autoFilteredValue" @complete="searchChannels($event)" field="name" />
                    </div>
                    <div class="field">
                        <label for="order">Order</label>
                        <InputNumber id="order" v-model.trim="vehicle.order" showButtons required="true" mode="decimal" :invalid="submitted && !vehicle.order" v-on:keyup.enter="saveVehicle"></InputNumber>
                        <small class="p-invalid" v-if="submitted && !vehicle.order">Order is required.</small>
                    </div>
                    <template #footer>
                        <Button tabindex="1" label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button tabindex="0" label="Save" icon="pi pi-check" text="" @click="saveVehicle" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteVehicleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="vehicle"
                            >Are you sure you want to delete <b>{{ vehicle.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteVehicleDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteVehicle" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteVehiclesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="vehicle">Are you sure you want to delete the selected vehicles?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteVehiclesDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedVehicles" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
