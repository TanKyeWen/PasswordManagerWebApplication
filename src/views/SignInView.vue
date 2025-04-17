<script setup lang="ts">
    import { RouterLink } from 'vue-router'
    
</script>

<template>
    <body id="sign-in-page">
        <main>
            <div class="credential-container">
                <div class="header-txt">LOGIN PAGE</div>
                <div class="login-credential">
                    <div class="field-name">Username</div>
                        <input type="text" name="username" class="username" placeholder="Enter Username Or Email here" required>
                    <div class="line"></div>
                    <div class="field-name">Password</div>
                        <input type="password" name="password" class="password" placeholder="Enter Password here" required>
                </div>
            </div>
            <div class="redirect-container">
                Do not have an account?
                <RouterLink to="/signUp">
                    <div class="redirect-link">
                        Register Here!
                    </div>
                </RouterLink>
            </div>
            <div class="action-section">
                <RouterLink to="/">
                    <div class="login-btn">
                        Login Now
                    </div>
                </RouterLink>
            </div>
        </main>
    </body>
</template>

<style scoped>
    #sign-in-page{
        font-family: 'Montserrat', sans-serif;
    }
    main{
        position: relative;
        border-radius: 25px;
        background-color: #593939;
        color: #DFD5C3;
        height: fit-content;
        width: 500px;
        max-width: 500px;
        box-sizing: border-box;
        margin-left: 575px;
        margin-top: 50px;
        font-size: 25px;
        padding: 15px;
        padding-bottom: 250px;
        overflow: hidden;
    }
    .credential-container input{
        font-family: 'Montserrat', sans-serif;
        font-weight: 200;
        letter-spacing: 2px;
        font-size: inherit;
        background-color: inherit;
        border-width: 0px;
        width: 550px;
        color: #d2caba;
        outline: none;
        margin-bottom: 25px;
    }
    .header-txt{
        font-size: 25px;
        font-weight: 600;
        text-align: center;
    }
    .login-credential{
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
        color: #d9c6a2;
        font-size: 20px;
    }
    .action-section{            
        position: absolute;
        bottom: 20px;
        width: calc(100% - 25px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .redirect-container{
        font-size: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .redirect-link{
        margin-top: -1px;
        color: aqua;
    }
    .redirect-link:hover{
        text-decoration: underline;
    }
    .login-btn{
        font-weight: 500;
        font-size: 20px;
        height: fit-content;
        padding: 10px 20px 10px 20px;
        background-color: #B7B8AC;
        color: #2E181A;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .login-btn:hover{
        transform: translateY(5px);
        box-shadow: 0 4px 8px rgba(79, 0, 0, 0.2);
    }
</style>