<script setup>
const props = defineProps({
    token: String,
    id: String
});

import { ref } from "vue";
import { Eye, EyeClosed, LoaderCircle } from "lucide-vue-next";
import router from "@/router";

const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const confirmError = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
    passwordError.value = "";
    confirmError.value = "";

    if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters.";
        return;
    }

    if (password.value !== confirmPassword.value) {
        confirmError.value = "Passwords do not match.";
        return;
    }

    loading.value = true;

    try {
        const backend = import.meta.env.VITE_APP_BACKEND
        const url = `${backend}/users/reset-password`

        const r = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                id: props.id,
                token: props.token,
                newPassword: password.value,
            }),
        })

        if (r.status === 200) {
            return router.push("/reset-finish");
        }

        throw new Error("Reseting Password not possible at the moment Please try again later")
    } catch (err) {
        confirmError.value = "Something went wrong. Please try again." + err;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
            <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">
                Set a New Password
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- New Password -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div class="relative">
                        <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" minlength="6"
                            required
                            class="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
                            placeholder="Enter your new password" />
                        <button type="button"
                            class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            @click="showPassword = !showPassword" aria-label="Toggle password visibility">
                            <Eye v-if="!showPassword" class="w-5 h-5" />
                            <EyeClosed v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="passwordError" class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="confirm" class="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <div class="relative">
                        <input id="confirm" :type="showConfirm ? 'text' : 'password'" v-model="confirmPassword" required
                            class="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
                            placeholder="Re-enter your password" />
                        <button type="button"
                            class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            @click="showConfirm = !showConfirm" aria-label="Toggle confirm password visibility">
                            <Eye v-if="!showConfirm" class="w-5 h-5" />
                            <EyeClosed v-else class="w-5 h-5" />
                        </button>
                    </div>
                    <p v-if="confirmError" class="text-red-500 text-sm mt-1">{{ confirmError }}</p>
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                    <LoaderCircle v-if="loading" class="w-5 h-5 animate-spin" />
                    <span>{{ loading ? 'Resetting...' : 'Reset Password' }}</span>
                </button>

            </form>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 640px) {
    h2 {
        font-size: 1.5rem;
    }

    input {
        font-size: 0.95rem;
    }
}
</style>
