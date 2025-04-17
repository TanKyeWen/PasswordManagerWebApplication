<script setup lang="ts">
    import PassphraseView from '@/components/PassphraseView.vue';
    import RandomPassView from '@/components/RandomPassView.vue';
    import { ref } from 'vue';
    
    const currentComponent = ref('PassphraseView');
    const tabs = {
        PassphraseView,
        RandomPassView,
    }
</script>
<template>
    <body id="credential-field-component">
        <main>
            <div class="input-container">
                <input type="text" name="website-name-field" class="website-name-field" placeholder="Website Name"><br>
                <input type="text" name="username" class="username" placeholder="Username" required><br>
                <input type="password" name="password" class="password" placeholder="Password" required><br>
            </div>
        </main>
    </body>
</template>
<style scoped>
    #credential-field-component{
        background-color: inherit;
        font-family: 'Montserrat', sans-serif;
        border-radius: 25px;
        color: #DFD5C3;
    }
    .input-container{
        font-size: 30px;
        margin-left: 50px;
    }
    input{
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
</style>