<template>
    <div class="grid h-full place-content-center">
        <div class="w-80">
            <div class="flex flex-col">
                <!-- Email input -->
                <div class="w-full">
                    <div class="mb-1 text-sm font-medium text-black dark:text-white">Email</div>
                    <input class="w-full rounded-md border border-gray-300 p-2" type="email" v-model="email" />
                </div>

                <!-- Password input -->
                <div class="mt-3 flex w-full flex-col">
                    <div class="mb-1 text-sm font-medium text-black dark:text-white"> Password </div>
                    <div class="flex w-full">
                        <input
                            class="w-full rounded-md rounded-r-none border border-r-0 border-gray-300 p-2"
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                        />
                        <div
                            class="flex items-center justify-center rounded-md rounded-l-none border border-l-0 border-gray-300 pr-1"
                        >
                            <button
                                class="cursor-default rounded p-1.5 text-black dark:text-white transition duration-300 hover:bg-gray-100 hover:text-gray-600"
                                @click="togglePassword"
                            >
                                <SvgIcon class="h-5 w-5" :name="showPassword ? 'eye-of' : 'eye'"></SvgIcon>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Login button -->
                <button
                    class="my-2 mt-6 flex w-full cursor-default items-center justify-center rounded-lg bg-brand-100 py-2 text-lg font-semibold text-green-500 transition duration-200"
                    @click="login"
                    >Login</button
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { loginWithEmail } from '@/api/auth'
    import { setCookie } from '@/utils/cookie'
    import { useUserStore } from '@/stores/user'
    import md5 from 'md5'

    const router = useRouter()
    const userStore = useUserStore()

    const showPassword = ref<boolean>(false)
    const email = ref<string>('')
    const password = ref<string>('')

    const togglePassword = () => {
        showPassword.value = !showPassword.value
    }

    const handlePostLogin = (cookies: string | undefined) => {
        if (!cookies) {
            alert('登陆失败 [no cookie returned]')
            return
        }
        setCookie(cookies)
        userStore.updateUserAccount()
        userStore.updateLikedList()
        router.push('/library')
    }

    const login = async () => {
        const { data } = await loginWithEmail({
            email: email.value.trim(),
            md5_password: md5(password.value.trim()),
        })
        handlePostLogin(data.value?.cookie)
    }
</script>
