<script setup lang="ts">
    import { RouterLink, useRouter } from 'vue-router';
    import { ref, onMounted } from 'vue'
    import { fetchVaultData, getAllCredentials } from '@/db/credential_queries';

    const router = useRouter();    

    const loading = ref(false)
    const credentials = ref([])

    async function loadInitialVaultData() {
        loading.value = true
        try {
            const result = await fetchVaultData()
            console.log('Vault data loaded:', result)
        } catch (error) {
            console.log('Error:', error)
            if (error.response?.status === 401) {
                // Redirect to login if unauthorized
                router.push('/signIn')
            }
        } finally {
            loading.value = false
        }
    }

    async function loadVault(){
        loading.value = true
        try {
            const credentialsList = await getAllCredentials(localStorage.getItem('user_id'))
            console.log('Credentials:', credentials)
        } catch (error) {
            console.error('Error loading vault:', error)
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        loadInitialVaultData()
        loadVault()
    })

    const lastSyncDate = ref([
        { message: '19th February 2025' }
    ])

    const syncBtnMsg = ref([
        { message: 'Sync Databases' },
        { message: 'Syncing...' }
    ])

    const btnMsg = ref(syncBtnMsg.value[0].message)

    const syncClick = () => {
        btnMsg.value = syncBtnMsg.value[1].message

        setTimeout(() => {
                btnMsg.value = syncBtnMsg.value[0].message
            }, 3000)
    }

    const redirectToIndividualPage = (credentialID : number) => {
        router.push({
            name:'credentialDetail',
            params: { id: credentialID }
        })
    }
</script>

<template>
    <body id="vault-page">
        <main>
            <div class="view-container">
                <div class="search-bar">
                    <input type="text" placeholder="Search...">
                </div>
                <div class="credential-container">
                    <div v-for="credential in credentials" class="individual-credential-container"
                        @click="redirectToIndividualPage(credential.id)">
                        <div class="website-txt">
                            {{ credential.website }}
                        </div>
                        <div class="username-txt">
                            {{ credential.username }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="action-section">
                <div class="sync-section">
                    <button class="sync-btn" @click="syncClick">
                        {{ btnMsg }}
                    </button>
                    <div class="sync-txt">
                        Last Sync Date: {{ lastSyncDate[0].message }}
                    </div>
                </div>
                <RouterLink to="/addCredential" active-class="active-link">
                    <div class="add-credential-btn">
                        Add Credential
                    </div>
                </RouterLink>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #vault-page{
        font-family: 'Montserrat', sans-serif;
        border-radius: 25px;
        background-color: #593939;
        margin: 10px;
        padding: 25px;
        height: calc(100% - 35px);
        width: calc(100% - 40px);
        box-sizing: border-box;
    }
    .search-bar{
        padding-bottom: 15px;
    }
    .search-bar input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 200;
        font-size: 20px;
        letter-spacing: 2px;
        background-color: inherit;
        border-width: 0px 0px 2px 0px;
        width: calc(100% - 155px);
        color: #d2caba;
        outline: none;
    }
    .credential-container{
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
    }
    .individual-credential-container{
        flex: 0 0 calc((100% - 60px) / 5);
        min-width: 300px;
        min-height: 100px;
        max-width: 300px;
        max-height: 100px;
        color: #DFD5C3;
        border-radius: 15px;
        border-width: 2px;
        border-style: solid;
        border-color: #8F7E6A;
        background-color: #520101; 
        margin-bottom: 25px;
        padding-left: 10px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .individual-credential-container:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    .individual-credential-container .website-txt{
        font-size: 35px;
        font-weight: 500;
    }
    .individual-credential-container .username-txt{
        font-size: 20px;
        font-weight: 300;
        padding-left: 10px;
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
    .add-credential-btn{
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
    .add-credential-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
    .sync-section{
        display: flex;
        gap: 15px;
    }
    .sync-btn{
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
    .sync-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
    .sync-txt{
        font-weight: 500;
        background: radial-gradient(circle , rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0) 100%);
        padding-top: 10px;
        text-decoration: underline;
        transition: background 0.3s ease;
    }
    .sync-txt:hover{
        background:rgba(0, 0, 0, 0.1);
        padding-top: 10px;
        text-decoration: underline;
    }
</style>