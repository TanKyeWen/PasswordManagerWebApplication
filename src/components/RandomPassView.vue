<script setup lang="ts">
    import copyImg from '@/assets/copy_img.png';
    import repeatImg from '@/assets/repeat_img.png';
</script>

<template>
    <body id="passphrase-container">
        <div class="pass-display">
            <div class="pass-txt">
                p@s5w0rdt3s7
            </div>
            <div class="img-container">
                <img :src="repeatImg" alt="" style="height: 25px; width: 25px;"/>
                <img :src="copyImg" alt="" style="height: 25px; width: 25px;"/>
            </div>
        </div>     
        <div class="opt">
            <div class="opt-txt">OPTION</div>
            <div class="pass-length">
                <div class="min-length-opt">
                    Min Password Length =
                    <input type="number" value="8">
                </div>
                <div class="max-length-opt">
                    Max Password Length =
                    <input type="number" value="12">
                </div>
            </div>
            <div class="pass-symbols">
                <div class="symbol-txt">Include</div>
                <div class="symbol-container">
                    <div class="individual-symbol">
                        <input type="checkbox" name="cap" id="cap" value="A-Z">
                        <div class="individual-txt">A-Z</div>
                    </div>
                    <div class="individual-symbol">
                        <input type="checkbox" name="non-cap" id="non-cap" value="a-z">
                        <div class="individual-txt">a-z</div>
                    </div>
                    <div class="individual-symbol">
                        <input type="checkbox" name="special-char" id="special-char" value="!@#$">
                        <div class="individual-txt">!@#$%</div>
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
        margin-left: 200px;
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
    .opt-txt, .symbol-txt{
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

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }

</style>