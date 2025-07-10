<script setup lang="ts">
    import PassphraseView from '@/components/PassphraseView.vue';
    import RandomPassView from '@/components/RandomPassView.vue';
    import copyImg from '@/assets/copy_img.png';
    import { ref } from 'vue';
    
    const currentComponent = ref('PassphraseView');
    const tabs = {
        PassphraseView,
        RandomPassView,
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };
</script>

<template>
    <body id="pass-gen-page">
        <main>
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
                <div class="component-container">
                    <component :is="tabs[currentComponent]" />
                </div>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #pass-gen-page{
        font-family: 'Montserrat', sans-serif;
    }
    main{
        border-radius: 25px;
        background-color: #593939;
        color: #DFD5C3;
        height: fit-content;
        width: fit-content;
        box-sizing: border-box;
        margin-left: 575px;
        margin-top: 50px;
        font-size: 25px;
        padding: 15px;
    }
    .gen-container{
        flex: 1;
    }
    .gen-opt{
        display: flex;
        justify-content: center;
        font-size: 30px;
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
    .component-container {
        justify-content: center;
        align-items: center;
        max-height: 650px;
        padding: 20px; /* Optional: add some padding */
    }
    .active{
        background-color: #8F7E6A !important;
        color: #503333 !important;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
</style>