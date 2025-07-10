<script setup lang="ts">
    import copyImg from '@/assets/copy_img.png';
    import repeatImg from '@/assets/repeat_img.png';
    import axios from 'axios';
    import { computed, onMounted, ref, watch } from 'vue';

    const noWords = ref(2);
    const noWordsToSpecialChar = ref(2);
    const cap = ref(true);
    const nonCap = ref(true);
    const specialChar = ref(true);
    let password = ref('');
    
    // Computed property to check if only one checkbox is selected
    const isLastChecked = computed(() => {
        const checkedCount = [cap.value, nonCap.value, specialChar.value].filter(Boolean).length
        return checkedCount === 1
    })

    const loadPassword = async () => {
        try {
            const { data } = await axios.get('/api/generate-password', {
                params: {
                    method: 'passphrase',
                    noWords: noWords.value,
                    noWordsToSpecialChar: noWordsToSpecialChar.value,
                    cap: cap.value,
                    nonCap: nonCap.value,
                    specialChar: specialChar.value
                },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                withCredentials: true
            });
            
            password.value = data.success ? data.data.password : '';
        } catch (error) {
            console.error('Error generating password:', error);
            console.error('Server response:', error.response?.data); // This will show the actual error
            console.error('Request params:', error.config?.params); // This will show what you sent
            password.value = '';
        }
    };

    onMounted(() => {
        // Load the initial password when the component is mounted
        loadPassword();
    });

    const handlePasswordReload = () => {
        // Logic to regenerate the password based on the options selected
        loadPassword();
    };

    // Debounce function to prevent too many API calls
    let debounceTimer;
    const debouncedLoadPassword = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadPassword();
        }, 300); // Wait 300ms after last change
    };

    // Watch each variable individually
    watch(noWords, debouncedLoadPassword);
    watch(noWordsToSpecialChar, debouncedLoadPassword);
    watch(cap, debouncedLoadPassword);
    watch(nonCap, debouncedLoadPassword);
    watch(specialChar, debouncedLoadPassword);

    const toggleCap = () => {
        if (isLastChecked.value && cap.value) {
            return; // Don't toggle if it's the last checked one
        }
        cap.value = !cap.value;
    };

    const toggleNonCap = () => {
        if (isLastChecked.value && nonCap.value) {
            return; // Don't toggle if it's the last checked one
        }
        nonCap.value = !nonCap.value;
    };

    const toggleSpecialChar = () => {
        if (isLastChecked.value && specialChar.value) {
            return; // Don't toggle if it's the last checked one
        }
        specialChar.value = !specialChar.value;
    };

    const copyToClipboard = async (text: string) => {
        try {
            if (!navigator.clipboard) {
                throw new Error('Clipboard API not supported');
            }
            await navigator.clipboard.writeText(password.value);
            console.log('Copied to clipboard:', text);
            
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

</script>

<template>
    <body id="passphrase-container">
        <div class="pass-display">
            <div class="pass-txt">
                {{ password}}
            </div>
            <div class="img-container">
                <img @click="handlePasswordReload" :src="repeatImg" alt="" style="height: 25px; width: 25px;"/>
                <img @click="copyToClipboard" :src="copyImg" alt="" style="height: 25px; width: 25px;"/>
            </div>
        </div>     
        <div class="opt">
            <div class="opt-txt">OPTION</div>
            <div class="pass-length">
                <div class="min-length-opt">
                    Passphrase Words =
                    <input type="number" v-model="noWords">
                </div>
            </div>
            <div class="special-char-replace">
                <div class="min-length-opt">
                    No Word to Special Char =
                    <input type="number" v-model="noWordsToSpecialChar">
                </div>
            </div>
            <div class="pass-symbols">
                <div class="symbol-txt">Include</div>
                <div class="symbol-container">
                    <div class="individual-symbol" @click="toggleCap">
                        <input type="checkbox" name="cap" id="cap" value="A-Z" v-model="cap"
                            :disabled="isLastChecked && cap">
                        <div class="individual-txt">A-Z</div>
                    </div>
                    <div class="individual-symbol" @click="toggleNonCap">
                        <input type="checkbox" name="nonCap" id="nonCap" value="a-z" v-model="nonCap"
                            :disabled="isLastChecked && nonCap">
                        <div class="individual-txt">a-z</div>
                    </div>
                    <div class="individual-symbol" @click="toggleSpecialChar">
                        <input type="checkbox" name="specialChar" id="specialChar" value="!@#" v-model="specialChar"
                            :disabled="isLastChecked && specialChar">
                        <div class="individual-txt">!@#$%^&*</div>
                    </div>
                </div>
            </div>
        </div>  
    </body>
</template>

<style scoped>
    #passphrase-container{
        font-family: 'Montserrat', sans-serif;
        background-color: inherit;
        color: #DFD5C3;
    }
    .pass-display{
        font-size: 25px;
        border-radius: 5px;
        background-color: #503333;
        padding: 10px 10px 10px 20px;
        box-shadow: 2px;
        max-width: 450px;
        display: flex;
        justify-content: space-between;
    }
    .pass-txt{
        flex: 1; /* Take up remaining space */
        overflow-x: auto; /* Horizontal scroll for long passwords */
        overflow-y: hidden; /* Prevent vertical scroll */
        white-space: nowrap; /* Prevent text wrapping */
        padding: 4px 8px;
        font-family: monospace; /* Better for passwords */
        font-size: 25px;
        min-width: 0; /* Allow flexbox to shrink below content size */
        gap: 10px;
        
        /* Custom scrollbar styling (optional) */
        scrollbar-width: thin;
        scrollbar-color: #888 #f1f1f1;
    }
    .img-container{
        margin-top: 10px;
        display: flex;
        gap: 8px; /* Space between images */
        flex-shrink: 0; /* Prevent images from shrinking */
    }
    img{
        margin-right: 10px;
        transition: background 0.3s ease;
    }
    img:hover{
        background: #6c4545;
        border-radius: 5px;
    }
    .opt{
        padding-top: 50px;
        font-size: 25px;
    }
    .opt-txt, .symbol-txt, .word-list-txt{
        font-weight: 600;
        letter-spacing: 5px;
    }
    .min-length-opt, .max-length-opt{
        border-radius: 5px;
        background-color: #503333;
        padding: 10px 10px 5px 20px;
        box-shadow: 2px;
        max-width: 450px;
        padding: 10px 10px 10px 20px;
        margin-bottom: 15px;
    }
    .min-length-opt input, .max-length-opt input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        font-size: inherit;
        background-color: inherit;
        border-width: 0px 0px 2px 0px;
        width: 50px;
        color: #d2caba;
        outline: none;
    }
    .symbol-container{
        display: flex;
    }
    .individual-symbol{
        display: inherit;
        border-radius: 5px;
        background-color: #503333;
        padding: 10px 10px 5px 20px;
        box-shadow: 2px;
        padding: 10px 10px 10px 20px;
        margin-bottom: 15px;
        margin-right: 25px;
    }
    .individual-symbol input[type="checkbox"]{
        margin-right: 15px;
    }
    .individual-txt{
        margin-right: 10px;
    }
    select{
        display: inherit;
        border-radius: 5px;
        border-width: 0px;
        background-color: #503333;
        padding: 10px 10px 5px 20px;
        box-shadow: 2px;
        min-width: 450px;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        padding: 10px 10px 10px 20px;
        margin-bottom: 15px;
        margin-right: 25px;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }

</style>