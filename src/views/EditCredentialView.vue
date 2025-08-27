<script setup lang="ts">
    import PassphraseView from '@/components/PassphraseView.vue';
    import RandomPassView from '@/components/RandomPassView.vue';
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter, RouterLink } from 'vue-router';
    import { updateCredential, getIndividualCredential } from '@/db/credential_queries';
    
    const currentComponent = ref('PassphraseView');
    const tabs = {
        PassphraseView,
        RandomPassView,
    };

    const router = useRouter();
    const route = useRoute();

    const loading = ref(false)
    const credential = ref({})
    const updatedCredential = ref({});
    const credentialId = Array.isArray(route.query.id) 
        ? parseInt(route.query.id[0]) 
        : parseInt(route.query.id);
    const userId = localStorage.getItem('user_id')
    const website = ref('');
    const username = ref('');
    const password = ref('');

    async function loadCredential() {
        loading.value = true
        try {
            if (!userId) {
                router.push('/signIn')
                return
            }

            const fetchedCredential = await getIndividualCredential(parseInt(userId), credentialId);
            if (fetchedCredential.success) {
                const cred = fetchedCredential.data;
                website.value = cred[1];
                username.value = cred[2];
                password.value = cred[3];
                
            } else if (fetchedCredential.code === 401 || fetchedCredential.code === 403) {
                console.log('Unauthorized Access:', fetchedCredential.error)
                router.push('/signIn')
            } else if (fetchedCredential.code === 404) {
                console.log('Credential not found:', fetchedCredential.error)
                router.push('/vault')
            } else {
                console.error('Error fetching credentials:', fetchedCredential.error)
            }
        } catch (error) {
            console.error('Error loading credentials:', error)
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        loadCredential();
    });

    const handleUpdateCredential = async () => {
        if (!website.value.trim()) {
            alert('Website name is required');
            return;
        }
        if (!username.value.trim()) {
            alert('Username is required');
            return;
        }
        if (!password.value.trim()) {
            alert('Password is required');
            return;
        }
        
        updatedCredential.value = {
            credential_website: website.value,
            credential_username: username.value,
            credential_password: password.value
        };
        
        try{
            if (!userId) {
                router.push('/signIn');
                return;
            }

            const result = await updateCredential(parseInt(userId), credentialId, updatedCredential.value);
            if (result.success) {
                website.value = '';
                username.value = '';
                password.value = '';

                router.push('/vault');
                console.log('Credential updated successfully');
            } else if (result.code === 401 || result.code === 403) {
                console.log('Unauthorized Access:', result.error)
                router.push('/signIn')
            } else if (result.code === 404) {
                console.log('Credential not found:', result.error)
                router.push('/vault')
            } else {
                console.log(`Error updating credential: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating credential:', error);
        }
    }

</script>
<template>
    <body id="edit-credential-page">
        <main>
            <div class="edit-credential-container">
                <div class="header-txt">
                    Edit Credential
                </div>
                <div class="input-container">
                    <div class="header-txt">Item Details</div>
                    <div class="item-details">
                        <div class="field-name">Item Name</div>
                        <input type="text" name="website-name-field" class="website-name-field" v-model="website"><br>
                    </div>
                    <div class="header-txt">Login Credential</div>
                    <div class="login-credential">
                        <div class="field-name">Username</div>
                        <input type="text" name="username" class="username" v-model="username" required><br>
                        <div class="line"></div>
                        <div class="field-name">Password</div>
                        <input type="text" name="password" class="password" v-model="password" required><br>
                    </div>
                </div>
            </div>
            <div class="gen-container">
                <div class="gen-opt">
                    <div class="random-password-btn" 
                    :class="{ active: currentComponent === 'RandomPassView' }" 
                    @click="currentComponent = 'RandomPassView'"
                    >
                        Password
                    </div>
                    <div class="passphrase-password-btn"  
                    :class="{ active: currentComponent === 'PassphraseView' }" 
                    @click="currentComponent = 'PassphraseView'"
                    >
                        Passphrase
                    </div>
                </div>
                <div class="gen-display">
                    <component :is="tabs[currentComponent]" />
                </div>
            </div>
            <div class="action-section">
                <div class="edit-credential-btn" @click="handleUpdateCredential">
                    Save Credential
                </div>
                <RouterLink to="/vault" active-class="active-link">
                    <div class="back-btn">
                        Cancel
                    </div>
                </RouterLink>
            </div>
        </main>
    </body>
</template>
<style scoped>
    #edit-credential-page{
        font-family: 'Montserrat', sans-serif;
        border-radius: 25px;
        background-color: #593939;
        color: #DFD5C3;
        margin: 10px;
        padding: 25px;
        height: calc(100% - 35px);
        width: calc(100% - 40px);
        box-sizing: border-box;
    }
    main{
        display: flex;
    }
    .edit-credential-container{
        flex: 1;
    }
    .input-container{
        font-size: 30px;
        margin-left: 50px;
    }
    .header-txt{
        font-size: 25px;
        font-weight: 600;
    }
    .item-details, .login-credential{
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
        color: #dfd5c385;
        font-size: 20px;
    }
    input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 200;
        letter-spacing: 2px;
        font-size: inherit;
        background-color: inherit;
        border-width: 0px 0px 2px 0px;
        width: 98%;
        color: #d2caba;
        outline: none;
        margin-bottom: 25px;
    }
    .gen-container{
        flex: 1;
    }
    .gen-opt, .gen-display{
        display: flex;
        justify-content: center;
        font-size: 25px;
        padding-bottom: 25px;
    }
    .random-password-btn, .passphrase-password-btn{
        cursor: pointer;
        border-width: 2px;
        border-style: solid;
        border-color: #8F7E6A;
        padding-right: 15px;
        padding-left: 15px;
        min-width: 250px;
        background-color: inherit;
        color: inherit;
    }
    .random-password-btn{
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
        text-align: right;
    }
    .passphrase-password-btn{
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
        text-align: left;
    }
    .active{
        background-color: #8F7E6A !important;
        color: #503333 !important;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .action-section{
        position: fixed;
        bottom: 0;
        width: calc(100% - 265px);
        height: 50px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
    }
    .edit-credential-btn, .back-btn{
        font-weight: 500;
        height: fit-content;
        padding: 10px 20px 10px 20px;
        background-color: #B7B8AC;
        color: #2E181A;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .back-btn{
        background-color: #77030d;
        color: #B7B8AC;
        border-color: #B7B8AC;
        border-width: 2px;
        border-style:solid;
    }
    .edit-credential-btn:hover, .back-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
</style>