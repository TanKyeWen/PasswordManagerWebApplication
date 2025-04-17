<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    // function updateQuarterCircle(greenPercentage) {
    //     const redPercentage = 100 - greenPercentage;
    //     const quarterCircle = document.getElementById('quarter-circle');
    //     quarterCircle.style.background = `conic-gradient(
    //         green 0% ${greenPercentage}%, 
    //         red ${greenPercentage}% 100%
    //     )`;
    // }
    const credentials = ref([
        {
            id: 1,
            website: 'Google.com',
            username: 'alice@example.com',
            folders: ['Test', 'May The Fire and Flame', 'Blackns'],
        },
        {
            id: 2,
            website: 'huahu.com',
            username: 'alice@example.com',
            folders: ['Test', '###@'],
        },
        {
            id: 3,
            website: 'Yahoo.com',
            username: 'alice@example.com',
            folders: ['Num'],
        }
    ])

    const router = useRouter();
    const redirectToEdit = (credentialID : number) => {
        router.push({
            name:'editCredential',
            query: { id: credentialID }
        })
    }
</script>
<template>
    <body id="pass-health-page">
        <main>
            <div class="health-information-container">
                <div class="pass-health-report">
                    <div class="health-semi-circle">
                        <div class="barOverflow">
                            <div class="bar-semi-circle"></div>
                        </div>
                        <div class="pass-health-percentage">4%</div>
                    </div>
                    <div class="pass-health-msg">
                        Congrats You Got A Rank!
                    </div>
                </div>
                <div class="pass-health-info">
                    <div class="info-header">Password Health Ranking Information</div>
                    <div class="rank-info">Rank S: No weak and No repeated password used</div>
                    <div class="rank-info">Rank A: Weak or Repeated password are used LESS than 2% (<= 2%) </div>
                    <div class="rank-info">Rank B: Weak or Repeated password are used LESS than 5% (<= 5%)</div>
                    <div class="rank-info">Rank C: Weak or Repeated password are used LESS than 10% (<= 10%)</div>
                    <div class="rank-info">Rank F: Weak or Repeated password are used MORE than 10% (> 10%) </div>
                </div>
            </div>
            <div class="line"></div>
            <div class="credential-header">Weak or Repeated Password</div>
            <div class="credential-container">
                <div v-for="credential in credentials" class="individual-credential-container"
                    @click="redirectToEdit(credential.id)">
                    <div class="website-txt">
                        {{ credential.website }}
                    </div>
                    <div class="username-txt">
                        {{ credential.username }}
                    </div>
                </div>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #pass-health-page{
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
    .health-information-container{
        margin-bottom: 25px;
        display: flex;
        justify-content: space-around;
    }
    .health-semi-circle{
        position: relative;
        display:inline-block;
        padding: 20px;
        text-align: center;
    }
    .barOverflow{ /* Wraps the rotating .bar */
        position: relative;
        width: 270px; height: 180px; /* Half circle (overflow) */
        margin-bottom: -50px; /* bring the numbers up */
        overflow: hidden;
    }
    .bar-semi-circle{
        position: absolute;
        top: 0; left: 0;
        width: 270px; height: 270px; /* full circle! */
        border-radius: 50%;
        box-sizing: border-box;
        border: 25px solid green;     /* half gray, */
        border-bottom-color: red;  /* half azure */
        border-right-color: red; 
    }
    .pass-health-percentage{
        font-size: 45px;
        font-weight: 600;
    }
    .pass-health-msg{
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
    }
    .info-header{
        font-size: 25px;
        font-weight: 600;
        padding-bottom: 10px;
        text-decoration: underline;
    }
    .line{
        background: #d0b79a;
        height: 2px;
    }
    .credential-header{
        font-size: 30px;
        padding-bottom: 25px;
        font-weight: 600;
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
    .individual-credential-container .email-txt{
        font-size: 20px;
        font-weight: 300;
        padding-left: 10px;
    }
</style>