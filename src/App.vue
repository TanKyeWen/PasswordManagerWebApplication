<script setup lang="ts">
    import { RouterView, useRouter, useRoute } from 'vue-router';
    import { computed } from 'vue';
    import LeftNav from '@/components/LeftNav.vue';

    let router = useRouter();
    let currentPage = router.currentRoute.value;

    const showLeftNav = computed(() => {        
        // List of routes where LeftNav should be hidden
        const hiddenRoutes = ['/signIn', '/signUp'];
        return !hiddenRoutes.includes(router.currentRoute.value.path);
    });

</script>

<template>
    <div id="app">
        <main>
            <LeftNav v-if="showLeftNav" curPage="{{ currentPage }}" class="left-nav-comp"/>
            <RouterView class="main-display-view"/>
        </main>
    </div>
</template>

<style scoped>
    html, body, #app {
        height: 100%;
        width: 100%;
        margin: 0;
        background-color: #2E181A;
    }
    main{
        display: flex;
    }
    .left-nav-comp{
        padding: 10px;
        flex: 7;
    }
    .main-display-view{
        z-index: 1000;
        padding-left: 25px;
        flex: 93;
    }
</style>