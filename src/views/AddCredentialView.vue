<script setup lang="ts">
    import PassphraseView from '@/components/PassphraseView.vue';
    import RandomPassView from '@/components/RandomPassView.vue';
    import repeatImg from '@/assets/repeat_img.png';
    import { ref } from 'vue';
    
    const currentComponent = ref('PassphraseView');
    const tabs = {
        PassphraseView,
        RandomPassView,
    }
</script>
<template>
    <body id="add-credential-page">
        <main>
            <div class="add-credential-container">
                <div class="header-txt">
                    Add Credential
                </div>
                <div class="input-container">
                    <div class="header-txt">Item Details</div>
                    <div class="item-details">
                        <div class="field-name">Website Name</div>
                        <input type="text" name="website-name-field" class="website-name-field" placeholder="Google.com"><br>
                    </div>
                    <div class="header-txt">Login Credential</div>
                    <div class="login-credential">
                        <div class="field-name">Username</div>
                        <input type="text" name="username" class="username" placeholder="Username" required><br>
                        <div class="line"></div>
                        <div class="field-name">Password</div>
                        <div class="password-field">
                            <input type="text" name="password" class="password" placeholder="Password" required><br>
                        </div>
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
                <component :is="tabs[currentComponent]" />
            </div>
            <div class="action-section">
                <RouterLink to="/vault" active-class="active-link">
                    <div class="add-credential-btn">
                        Add Credential
                    </div>
                </RouterLink>
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
    #add-credential-page{
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
    .add-credential-container{
        flex: 1;
    }
    .header-txt{
        font-size: 30px;
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
        overflow-y: hidden;
    }
    input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 200;
        letter-spacing: 2px;
        font-size: inherit;
        background-color: inherit;
        border-width: 0px 0px 2px 0px;
        width: 90%;
        color: #d2caba;
        outline: none;
        margin-bottom: 25px;
    }
    .password-field{
        display: flex;
        align-items: center;
        width: 100%;
    }
    .gen-container{
        flex: 1;
    }
    .gen-opt{
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
    .add-credential-btn, .back-btn{
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
    .add-credential-btn:hover, .back-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
</style>