<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { computed, ref, watch } from 'vue';
import { useErrorsStore } from '../../../stores/errors';
import { useRouter } from 'vue-router';

const { layoutConfig } = useLayout();
const username = ref('');
const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const authStore = useAuthStore();
const errorsStore = useErrorsStore();
const toast = useToast();
const router = useRouter();

const login = () => {
    authStore.login({ username: username.value, password: password.value }).then(() => {
        console.log(localStorage.getItem('loggedIn'));
        router.push({ name: 'dashboard' });
    });
};

const { message } = storeToRefs(errorsStore);
watch(message, () => {
    if (message.value) toast.add({ severity: 'error', summary: 'Error', detail: message.value, life: 3000 });
    password.value = null;
    errorsStore.$reset();
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="AutoEye Logo" class="mb-5 w-6 flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <form @submit.prevent="login()">
                        <div>
                            <label for="username" class="block text-900 text-xl font-medium mb-2">Username</label>
                            <InputText id="username" type="text" placeholder="Username / Email Address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="username" required autofocus />

                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <InputText id="password" type="password" placeholder="Password" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="password" required />

                            <div class="flex align-items-center justify-content-between mb-5 gap-5">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="checked" id="rememberme" binary class="mr-2"></Checkbox>
                                    <label for="rememberme">Keep me signed in.</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <Button label="Sign In" class="w-full p-3 text-xl" type="submit"></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
