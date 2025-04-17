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
                <component :is="tabs[currentComponent]" />
            </div>
            <div class="history-container">
                <div class="history-header-txt">Password History</div>
                <div class="individual-history-container" v-for="n in 3" :key="n">
                    <div class="pass-txt">
                        123123
                    </div>
                    <div class="img-container">
                        <img :src="copyImg" alt="" style="height: 25px; width: 25px;"/>
                    </div>
                </div>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #pass-gen-page{
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
    /* .random-password-btn.active, .passphrase-password-btn.active { */
    .active{
        background-color: #8F7E6A !important;
        color: #503333 !important;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .history-container{
        flex: 1;
    }
    .history-header-txt{
        justify-content: center;
        font-size: 30px;
        padding-bottom: 25px;
    }
    .individual-history-container{
        font-size: 25px;
        border-radius: 5px;
        background-color: #503333;
        padding: 10px 10px 10px 20px;
        box-shadow: 2px;
        max-width: 450px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
    }
</style>