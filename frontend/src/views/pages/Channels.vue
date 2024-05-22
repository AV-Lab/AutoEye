<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getChannels, createChannel, deleteChannels, updateChannel } from '@/services/ChannelService';

const toast = useToast();

const queryLoading = ref(true);
const channels = ref(null);
const channelDialog = ref(false);
const deleteChannelDialog = ref(false);
const deleteChannelsDialog = ref(false);
const channel = ref({});
const selectedChannels = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    fetchChannels();
});

const fetchChannels = () => {
    queryLoading.value = true;
    getChannels().then((data) => {
        data = data.sort((a, b) => a.order - b.order);
        channels.value = data;
        queryLoading.value = false;
    });
};

const openNew = () => {
    channel.value = {};
    channel.value.order = Math.max(...channels.value.map((c) => c.order)) + 1;
    submitted.value = false;
    channelDialog.value = true;
};

const hideDialog = () => {
    channelDialog.value = false;
    submitted.value = false;
};

const saveChannel = () => {
    submitted.value = true;

    if (channel.value.name && channel.value.name.trim() && channel.value.order) {
        const channelName = channel.value.name.trim();
        const channelOrder = parseInt(channel.value.order);

        if (channel.value.id) {
            const channelId = channel.value.id.trim();
            updateChannel(channelId, channelName, channelOrder).then((result) => {
                if (result.errors) {
                    result.errors.forEach((error) => {
                        toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Channel Updated', life: 3000 });
                    channelDialog.value = false;
                    channel.value = {};
                    fetchChannels();
                }
            });
        } else {
            createChannel(channelName, channelOrder).then((result) => {
                if (result.errors) {
                    result.errors.forEach((error) => {
                        toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
                    });
                } else {
                    toast.add({ severity: 'success', summary: 'Successful', detail: 'Channel Created', life: 3000 });
                    channelDialog.value = false;
                    channel.value = {};
                    fetchChannels();
                }
            });
        }
    }
};

const editChannel = (editChannel) => {
    channel.value = { ...editChannel };
    channelDialog.value = true;
};

const confirmDeleteChannel = (deleteChannel) => {
    channel.value = deleteChannel;
    deleteChannelDialog.value = true;
};

const deleteChannel = () => {
    channels.value = channels.value.filter((val) => val.id !== channel.value.id);
    deleteChannels(channel.value.id).then((result) => {
        if (result.errors) {
            result.errors.forEach((error) => {
                toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
            });
        } else {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Channel Deleted', life: 3000 });
            deleteChannelDialog.value = false;
            channel.value = {};
        }
    });
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteChannelsDialog.value = true;
};

const deleteSelectedChannels = () => {
    channels.value = channels.value.filter((val) => !selectedChannels.value.includes(val));
    const channelIds = selectedChannels.value.map((c) => c.id);
    deleteChannels(channelIds).then((result) => {
        if (result.errors) {
            result.errors.forEach((error) => {
                toast.add({ severity: 'error', summary: 'Operation Failed', detail: error, life: 3000 });
            });
        } else {
            deleteChannelsDialog.value = false;
            selectedChannels.value = null;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Channels Deleted', life: 3000 });
        }
    });
};

const initFilters = () => {
    filters.value = {
        name: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedChannels || !selectedChannels.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="channels"
                    v-model:selection="selectedChannels"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} channels"
                    :loading="queryLoading"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Channels</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['name'].value" placeholder="Search..." />
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
                    <Column field="order" header="Order" :sortable="true">
                        <template #body="slotProps">
                            <span class="p-column-title">Order</span>
                            {{ slotProps.data.order }}
                        </template>
                    </Column>
                    <Column>
                        <template #body="slotProps">
                            <div style="text-align: right">
                                <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editChannel(slotProps.data)" />
                                <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteChannel(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="channelDialog" :style="{ width: '450px' }" header="Channel Details" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="channel.name" required="true" autofocus :invalid="submitted && !channel.name" v-on:keyup.enter="saveChannel" />
                        <small class="p-invalid" v-if="submitted && !channel.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="order">Order</label>
                        <InputNumber id="order" v-model.trim="channel.order" showButtons required="true" mode="decimal" :invalid="submitted && !channel.order" v-on:keyup.enter="saveChannel"></InputNumber>
                        <small class="p-invalid" v-if="submitted && !channel.order">Order is required.</small>
                    </div>
                    <template #footer>
                        <Button tabindex="1" label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button tabindex="0" label="Save" icon="pi pi-check" text="" @click="saveChannel" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteChannelDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="channel"
                            >Are you sure you want to delete <b>{{ channel.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteChannelDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteChannel" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteChannelsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="channel">Are you sure you want to delete the selected channels?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteChannelsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedChannels" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
