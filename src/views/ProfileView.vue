<script setup lang="ts">
    import { RouterLink } from 'vue-router'
    import profileIcon from '@/assets/profile_icon.png';
</script>
<template>
    <body id="profile-page">
        <main>
            <div class="user-container">
                <img :src="profileIcon" alt="" class="profile-img"/>
                <div class="user-name">User yesy 1</div>
            </div>
            <nav class="profile-container">
                <RouterLink to="/passwordHealth" active-class="active-link">
                    <div class="individual-btn">
                        Password Health
                        <div class="btn-arrow">
                            >
                        </div>
                    </div> 
                </RouterLink>

                <RouterLink to="/auditTrail" active-class="active-link">
                    <div class="individual-btn">
                        Audit Trail
                        <div class="btn-arrow">
                            >
                        </div>
                    </div>
                </RouterLink>
            </nav>
            <RouterLink to="/signIn">
                <div class="logout-btn">
                    Logout
                </div>
            </RouterLink>
        </main>
    </body>
</template>
<style scoped>
    #profile-page{
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
        padding-bottom: 250px;
    }
    .user-container{
        margin-left: 175px;
    }
    .profile-img{
        border-radius: 50%;
        height: 150px;
    }
    .user-name{
        font-weight: 600;
    }
    .individual-btn{
        display: flex;
        justify-content: space-between;
        width: 500px;
        height: fit-content;
        padding: 10px 20px 10px 20px;
        background-color: #B7B8AC;
        color: #2E181A;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .individual-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
    .btn-arrow{
        font-weight: 700;
    }
    .logout-btn{
        border-color: #B7B8AC;
        border-width: 2px;
        border-style:solid;
        font-weight: 600;
        justify-content: space-between;
        max-width: 500px;
        height: fit-content;
        padding: 10px 20px 10px 20px;
        background-color: #77030d;
        color: #B7B8AC;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .logout-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
</style>