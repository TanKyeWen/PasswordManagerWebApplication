<script setup lang="ts">
    import { useRouter, RouterLink } from 'vue-router'
    import axios from 'axios'
    import { ref } from 'vue'
    axios.defaults.baseURL = 'http://localhost:9011'

    const router = useRouter()

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const rePassword = ref('')

    // Function to handle user signup
    async function signup(username, email, password, rePassword) {
        try {
            const response = await axios.post('/api/auth/signup', {
                username: username,
                email: email,
                password: password,
                re_password: rePassword  // Note the hyphen in the key name
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    timeout: 10000, // 10 second timeout
                    withCredentials: true, // Send session cookies
                }
            );
            
            console.log('Signup successful:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            throw error;
        }
    }

    async function handleRegister() {
        try {
            const result = await signup(username.value, email.value, password.value, rePassword.value);
            console.log('User logged in:', result);
            // Redirect to the vault view after successful registration
            router.push('/vault');

        } catch (error) {
            console.log('Login error:', error);
        }
    }
</script>

<template>
    <body id="sign-up-page">
        <main>
            <div class="credential-container">
                <div class="header-txt">REGISTER PAGE</div>
                <div class="sign-up-credential">
                    <div class="field-name">Username</div>
                        <input type="text" name="username" class="username" v-model="username" placeholder="Enter Username here" required>
                    <div class="line"></div>
                    <div class="field-name">Email</div>
                        <input type="email" name="email" class="email" v-model="email" placeholder="Enter Username here" required>
                    <div class="line"></div>
                    <div class="field-name">Password</div>
                        <input type="password" name="password" class="password" v-model="password" placeholder="Enter Password here" required>
                    <div class="line"></div>
                    <div class="field-name">Repeat Password</div>
                        <input type="password" name="rePassword" class="rePassword" v-model="rePassword" placeholder="Repeat Your Password here" required>
                </div>
            </div>
            <div class="redirect-container">
                Already have an account?
                <RouterLink to="/signIn">
                    <div class="redirect-link">
                        Login Here!
                    </div>
                </RouterLink>
            </div>
            <div class="action-section">
                <div class="sign-up-btn" @click="handleRegister">
                    Register Now
                </div>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #sign-up-page{
        font-family: 'Montserrat', sans-serif;
    }
    main{
        position: relative;
        border-radius: 25px;
        background-color: #593939;
        color: #DFD5C3;
        height: fit-content;
        width: 500px;
        max-width: 500px;
        box-sizing: border-box;
        margin-left: 575px;
        margin-top: 50px;
        font-size: 25px;
        padding: 15px;
        padding-bottom: 250px;
        overflow: hidden;
    }
    .credential-container input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 200;
        letter-spacing: 2px;
        font-size: inherit;
        background-color: inherit;
        border-width: 0px;
        width: 550px;
        color: #d2caba;
        outline: none;
        margin-bottom: 25px;
    }
    .header-txt{
        font-size: 25px;
        font-weight: 600;
        text-align: center;
    }
    .sign-up-credential{
        color: #DFD5C3;
        font-size: 25px;
        border-radius: 15px;
        border-width: 2px;
        border-style: solid;
        border-color: #8F7E6A;
        background-color: #520101; 
        margin-bottom: 25px;
        padding-left: 10px;
        padding-bottom: 10px;
        overflow: hidden;
    }
    .line{
        background: #8F7E6A;
        height: 2px;
        width: 98%;
    }
    .field-name{
        padding-top: 15px;
        padding-left: 15px;
        color: #d9c6a2;
        font-size: 20px;
    }
    .action-section{            
        position: absolute;
        bottom: 20px;
        width: calc(100% - 25px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .redirect-container{
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .redirect-link{
        margin-top: -1px;
        color: aqua;
    }
    .redirect-link:hover{
        text-decoration: underline;
    }
    .sign-up-btn{
        font-weight: 500;
        font-size: 20px;
        height: fit-content;
        padding: 10px 20px 10px 20px;
        background-color: #B7B8AC;
        color: #2E181A;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .sign-up-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
</style>