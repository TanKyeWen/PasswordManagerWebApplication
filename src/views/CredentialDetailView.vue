<script lang="ts">
    import { ref, onMounted } from 'vue';
    import { useRouter, useRoute, RouterLink } from 'vue-router';
    import ConfirmModal from '@/components/ConfirmModal.vue';
    import { getIndividualCredential } from '@/db/credential_queries';

    const router = useRouter();
    const route = useRoute();    

    const loading = ref(false)
    const credential = ref([])
    const credentialId = Array.isArray(route.params.id) 
        ? parseInt(route.params.id[0]) 
        : parseInt(route.params.id);

    async function loadCredential() {
        loading.value = true
        try {
            const userId = localStorage.getItem('user_id')
            if (!userId) {
                router.push('/signIn')
                return
            }

            const fetchedCredential = await getIndividualCredential(parseInt(userId), parseInt(route.params.id));
            if (fetchedCredential.success) {
                credential.value = fetchedCredential.data.map(cred => ({
                    id: cred[0],
                    website: cred[1],
                    username: cred[2],
                    password: cred[3]
                }))
            } else if (fetchedCredential.code === 'NO_SESSION' || fetchedCredential.code === 'ACCESS_DENIED') {
                console.error('Unauthorized Access:', fetchedCredential.error)
                router.push('/signIn')
            } else if (fetchedCredential.code === 'NOT_FOUND') {
                console.error('Credential not found:', fetchedCredential.error)
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

    async function deleteCredential() {
        try {
            const userId = localStorage.getItem('user_id')
            if (!userId) {
                router.push('/signIn')
                return
            }

            const fetchedCredential = await getIndividualCredential(parseInt(userId), credentialId);
            if (fetchedCredential.success) {
                credential.value = fetchedCredential.data.map(cred => ({
                    id: cred[0],
                    website: cred[1],
                    username: cred[2],
                    password: cred[3]
                }))
            }  else if (fetchedCredential.code === 'NO_SESSION' || fetchedCredential.code === 'ACCESS_DENIED') {
                console.error('Unauthorized Access:', fetchedCredential.error)
                router.push('/signIn')
            } else if (fetchedCredential.code === 'NOT_FOUND') {
                console.error('Credential not found:', fetchedCredential.error)
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

    const showModal = ref(false)

    const openModal = () => {
        showModal.value = true
    }

    const handleConfirm = () => {
        console.log('User confirmed deletion!')
        showModal.value = false
        
        deleteCredential()
        router.push('/vault')
    }

    const handleCancel = () => {
        console.log('User cancelled')
        showModal.value = false
    }

    const redirectToEdit = () => {
        try {
            const userId = localStorage.getItem('user_id')
            if (!userId) {
                router.push('/signIn')
                return
            }

            router.push({
                name:'editCredential',
                params: { id: credentialId }
            })
                
        } catch (error) {
            console.error('Error loading:', error)
            if (error.response?.status === 401) {
                router.push('/signIn')
            }
        }
    }

</script>

<template>
    <body id="credential-detail-page">
        <main>
            <div class="credential-container">
                <div class="header-txt">Item Details</div>
                <div class="item-details">
                    <div class="field-name">Item Name</div>
                    <div class="website-txt">{{ credential.website }}</div>
                </div>
                <div class="header-txt">Login Credential</div>
                <div class="login-credential">
                    <div class="field-name">Username</div>
                    <div class="username">
                        {{ credential.username }}
                    </div>
                    <div class="line"></div>
                    <div class="field-name">Password</div>
                    <div class="password">
                        password1test
                    </div>
                </div>
            </div>
            <div class="action-section">
                <div class="edit-credential-btn" @click="redirectToEdit()">
                    Edit Credential
                </div>
                <div class="back-btn" @click="openModal">
                    Delete
                </div>
                <ConfirmModal :show="showModal" @confirm="handleConfirm" @cancel="handleCancel" />
            </div>
        </main>
    </body>
</template>

<style scoped>
    #credential-detail-page{
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
        border-width: 0px 0px 2px 0px;
        width: 550px;
        color: #d2caba;
        outline: none;
        margin-bottom: 25px;
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
    .action-section{            
        position: absolute;
        bottom: 20px;
        width: calc(100% - 25px);
        display: flex;
        justify-content: space-between;
    }
    .edit-credential-btn, .back-btn{
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