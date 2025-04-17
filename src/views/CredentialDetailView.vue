<script lang="ts">
    import { ref } from 'vue';
    import { useRouter, useRoute, RouterLink } from 'vue-router';
    import ConfirmModal from '@/components/ConfirmModal.vue';

    export default {
        components: {
            ConfirmModal
        },
        setup() {
            const credentials = ref([
                { id: 1, website: 'Google.com', username: 'alice@example.com', folders: ['Test', 'May The Fire and Flame', 'Blackns'] },
                { id: 2, website: 'huahu.com', username: 'alice@example.com', folders: ['Test', '###@'] },
                { id: 3, website: 'Yahoo.com', username: 'alice@example.com', folders: ['Num'] },
            ]);

            const route = useRoute();
            const credentialId = route.params.id;

            const credential = ref(credentials.value.find(c => c.id === parseInt(credentialId[0])));

            const router = useRouter();
            const redirectToEdit = () => {
                router.push({
                    name:'editCredential',
                    query: { id: credentialId }
                })
            }
            
        const showModal = ref(false);

        const deleteItem = () => {
            // Your delete logic here
            console.log('Item deleted');
            showModal.value = false;
            router.push('/vault');
        };

            return {
                credential,
                redirectToEdit,                
                showModal,
                deleteItem
            };
        }
    };

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
                <div class="back-btn" @click="showModal = true">
                    Delete
                </div>
                <ConfirmModal :show="showModal" @confirm="deleteItem" @cancel="showModal = false" />
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