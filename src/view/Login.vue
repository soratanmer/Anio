<template>
    <div class="grid h-full place-content-center">
        <div class="w-80">
            <div class="flex flex-col">
                <!-- Email input -->
                <div v-show="method === 'email'" class="w-full">
                    <div class="mb-1 text-sm font-medium text-gray-700">Email</div>
                    <input class="w-full rounded-md border border-gray-300 p-2" type="email" v-model="email" />
                </div>

                <!-- Phone input -->
                <div v-show="method === 'phone'" class="w-full">
                    <div class="mb-1 text-sm font-medium text-gray-700">Phone </div>
                    <div class="flex w-full">
                        <input
                            class="rounded-md rounded-r-none border border-r-0 border-gray-300 px-3 py-2"
                            :class="{
                                'w-14': countryCode.length <= 3,
                                'w-16': countryCode.length == 4,
                                'w-20': countryCode.length >= 5,
                            }"
                            type="text"
                            v-model="countryCode"
                            placeholder="+86"
                        />
                        <input
                            class="flex-grow rounded-md rounded-l-none border border-gray-300 px-3 py-2"
                            type="text"
                            v-model="phone"
                        />
                    </div>
                </div>

                <!-- Password input -->
                <div class="mt-3 flex w-full flex-col">
                    <div class="mb-1 text-sm font-medium text-gray-700"> Password </div>
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
                                class="cursor-default rounded p-1.5 text-gray-400 transition duration-300 hover:bg-gray-100 hover:text-gray-600"
                                @click="togglePassword"
                            >
                                <SvgIcon class="h-5 w-5" :name="showPassword ? 'eye-of' : 'eye'"></SvgIcon>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Login button -->
                <button
                    class="my-2 mt-6 flex w-full cursor-default items-center justify-center rounded-lg bg-brand-100 py-2 text-lg font-semibold text-brand-500 transition duration-200"
                    @click="login"
                    >Login</button
                >

                <!-- Other login methods -->
                <div class="mt-8 mb-4 flex w-full items-center">
                    <span class="h-px flex-grow bg-gray-300"></span>
                </div>

                <button
                    v-for="item in otherLoginMethods"
                    v-show="method !== item.id"
                    class="flex w-full cursor-default items-center justify-center rounded-lg bg-gray-100 py-2 font-medium text-gray-6-- transition duration-300 hover:bg-gray-200 hover:text-gray-800"
                    @click="changeMethod(item.id)"
                >
                    <SvgIcon class="mr-2 h-5 w-5" :name="item.id"></SvgIcon>
                    <span>{{ item.name }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import md5 from 'md5'

    import { useUiStore } from '@/stores/ui'
    import { setCookie } from '@/utils/cookie'
    import { loginWithEmail, loginWithPhone } from '@/api/auth'

    type Method = 'email' | 'phone'

    const uiStore = useUiStore()
    const router = useRouter()

    const method = ref<Method>('email')
    const showPassword = ref<boolean>(false)
    const email = ref<string>('')
    const phone = ref<string>('')
    const countryCode = ref<string>(uiStore.loginPhoneCountryCode)
    const password = ref<string>('')

    const otherLoginMethods: {
        id: Method
        name: string
    }[] = [
        { id: 'email', name: '使用邮箱登陆' },
        { id: 'phone', name: '使用手机登陆' },
    ]

    const changeMethod = (newMethod: Method) => {
        method.value = newMethod
    }

    const togglePassword = () => {
        showPassword.value = !showPassword.value
    }

    const handlePostLogin = (cookies: string | undefined) => {
        if (!cookies) {
            alert('登陆失败 [no cookie returned]')
            return
        }
        setCookie(cookies)
        router.push('/library')
    }

    const doPhoneLogin = async () => {
        let countryCodeNum = 86
        const newCountryCode = countryCode.value.replace('+', '').trim()
        if (Number(newCountryCode) !== NaN) {
            countryCodeNum = Number(newCountryCode)
        }
        const result = await loginWithPhone({
            countrycode: countryCodeNum,
            phone: phone.value.trim(),
            password: password.value.trim(),
            md5_password: md5(password.value.trim()),
        })
        handlePostLogin(result.cookie)
    }

    const doEmailLogin = async () => {
        const result = await loginWithEmail({
            email: email.value.trim(),
            md5_password: md5(password.value.trim()),
        })
        handlePostLogin(result.cookie)
    }

    const login = () => {
        if (method.value === 'phone') {
            doPhoneLogin()
        } else {
            doEmailLogin()
        }
    }
</script>
