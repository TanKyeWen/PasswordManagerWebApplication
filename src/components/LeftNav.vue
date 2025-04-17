<script setup lang="ts">
    import { RouterLink, RouterView } from 'vue-router'

    defineProps<{
        curPage: string
    }>()
</script>

<template>
    <body id="left-nav">
        <nav class="left-nav-container">
            <RouterLink to="/vault" active-class="active-link">
                <div class="individual-btn">
                    Vault
                </div>
            </RouterLink>

            <RouterLink to="/gen" active-class="active-link">
                <div class="individual-btn">
                    Generator
                </div>
            </RouterLink>

            <RouterLink to="/profile" active-class="active-link">
                <div class="individual-btn">
                    Profile
                </div>
            </RouterLink>
        </nav>
    </body>
</template>

<style scoped>
    body{
        font-family: 'Montserrat', sans-serif;
        margin: 0;
        padding: 0;
        justify-content: center;
        align-items: start;
    }

    .left-nav-container {
        padding: 10px;
    }

    .individual-btn {
        color: #ede3cf;
        justify-self: center;
        margin-bottom: 5vh;
        font-size: 18px;
        font-weight: 100;
        position: relative;
    }

    .individual-btn::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 100%;
        height: 1px;
        background-color: #ede3cf;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 1s ease;
    }

    .individual-btn:hover::after {
        transform: scaleX(1);
    }

    .active-link .individual-btn{
        padding-left: 15px;
        color: #ede3cf;
        justify-self: center;
        font-size: 18px;
        font-weight: 500;
    }
</style>