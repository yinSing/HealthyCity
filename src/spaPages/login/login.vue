<template>
    <div id="logins">
        <header>
            <div class="logo"></div>
        </header>
        <main :style="{height:mainHeight}">
            <section class="pic"></section>
            <section class="login-container" v-show="isReturn">
                <article class="title">家庭医生账户登录</article>
                <article class="box">
                    <div class="login-msg">
                        <el-input placeholder="请输入账户" prefix-icon="el-icon-loading" v-model="account" @input="watchInput" @keydown.native.enter.stop.prevent="loginEvent">
                        </el-input>
                        <el-input type="password" placeholder="请输入密码" prefix-icon="el-icon-view" v-model="password" @input="watchInput" @keydown.native.enter.stop.prevent="loginEvent">
                        </el-input>
                    </div>
                    <div class="login-item">
                        <el-checkbox v-model="remberPsd">记住密码</el-checkbox>
                    </div>
                    <div class="login-btn">
                        <el-button type="primary" :disabled="disabled" @click="loginEvent" v-text="btnName" :loading="btnLoading"></el-button>
                    </div>
                </article>
            </section>
            <section class="login-container return-back" v-show="!isReturn">
                <article class="title el-icon-arrow-left" @click="returnLogin">返 回</article>
                <article class="box box-roles">
                   <ul class="clearfix">
                       <li v-for="item in rolesList" @click="loginByRoles(item)" v-text="item.roleName" :title="item.roleName"></li>
                   </ul> 
                </article>
            </section>
        </main>
        <footer>
            版权所有：创业软件股份有限公司 Copyright © 2008-2017 BSOFT
        </footer>
    </div>
</template>

<script>
    import {rolesRequest,rolesLogin,tenantId,aesEncrypt,aesDecrypt} from '@/api.js'
    const md5 = require('md5')
    export default {
        name: 'logins',
        data () {
            return {
                mainHeight: '5rem',
                account: '',
                password: '',
                remberPsd: false,   //记住密码
                disabled: true,
                btnName: '登 录',
                btnLoading: false,
                isReturn: true,     //返回
                rolesList: [],      //角色列表
                loginMsg: {         //登录信息
                    tenantId: '',
                    loginName: '',
                    rid: '',
                    pwd: '',
                    forAccessToken: true
                },
            }
        },
        mounted () {
            this.init();
        },
        methods: {
            // 初始化
            init () {
                //尺寸
                let wheight = window.innerHeight;
                this.mainHeight = wheight/10-14 + 'rem';
                window.onresize = () => {
                    this.windowSize();
                }
                //账号
                let users = JSON.parse(localStorage.getItem('user')) || '{}';
                    this.remberPsd = users.isRem || false;
                    this.account = users.name || '';
                    this.disabled = !(users.name != '') && (users.pwd != '');
                    this.password = users.pwd ? aesDecrypt(users.pwd,'Password!') : '';
            },

            // 窗口改变
            windowSize () {
                let wheight = window.innerHeight;
                this.mainHeight = wheight/10-14 + 'rem';
            },

            // input
            watchInput () {
                if (this.account != '' && this.password != '') {
                    this.disabled = false;
                    return true;
                } else {
                    this.disabled = true;
                    return false;
                }
            },

            // 登录(获取角色)
            loginEvent () {
                if(!this.watchInput()){
                    this.$message({
                        message: '账号或密码不能为空!',
                        type: 'warning'
                    });
                    return false;
                }
                //角色请求
                let param = JSON.stringify({
                    'uid': this.account,
                    'pwd': md5(this.password),
                    'forAccessToken': true
                })
                this.btnName = '加载中···';
                this.btnLoading = true;
                rolesRequest(param).then(res=>{
                    // console.log(res)
                    this.btnName = '登 录';
                    this.btnLoading = false;
                    if(res.code == 200){
                        if (!this.remberPsd) {
                            localStorage.removeItem('user');
                        } else {
                            let user = {
                                'name': this.account,
                                'pwd': aesEncrypt(this.password,'Password!'),
                                'isRem': this.remberPsd
                            }
                            localStorage.setItem('user',JSON.stringify(user));
                        }
                        this.isReturn = false;
                        //角色列表
                        this.rolesList  = res.body;
                        //赋值选项
                        this.loginMsg.tenantId = res.body[0].tenantId;
                        this.loginMsg.loginName = this.account;
                        this.loginMsg.rid = res.body[0].roleId;
                        this.loginMsg.pwd = md5(this.password);
                        //判断角色
                        if (res.body.length == 1) {
                            this.loginByRoles(res.body[0]);
                        } else {
                            return false;
                        }
                    } else if (res.code == 404) {
                        this.$message.error('该用户不存在！')
                    } else if (res.code == 501) {
                        this.$message.error('该密码不正确！')
                    } else {
                        let err = res.msg ? res.msg : '操作失败!';
                        this.$message.error(err);
                    }
                });
            },

            // 登录(角色登录)
            loginByRoles (item) {
                rolesLogin(this.loginMsg).then(res=>{
                    if (res.code == 200) {
                        // this.$message.success('登录成功');
                        //存储登录信息
                        let userMsg = {
                            'id': res.body.id,
                            'roleId': res.body.roleId,
                            'roleName': res.body.roleName,
                            'tenantId': res.body.tenantId,
                            'tenantName': res.body.tenantName,
                            'userAvatar': res.body.userAvatar,
                            'userId': res.body.userId,
                            'userName': res.body.userName
                        };
                        localStorage.setItem('userMsg',JSON.stringify(userMsg));
                        sessionStorage.setItem('accessToken',res.properties.accessToken);
                        // 前往平台主页
                        this.$router.push({path: '/main'});
                    } else {
                        let err = res.msg ? res.msg : '登录失败!';
                        this.$message.error(err);
                    }
                });
            },

            // 返回登录
            returnLogin () {
                this.isReturn = true;
            }
        }//Methods
    }
</script>

<style scoped>
    #logins {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        font-size: 12px;
    }
    #logins header {
        width: 100%;
        height: 7rem;
        background: -webkit-gradient(linear, 0 0, 0 bottom, from(#89EDE8), to(#fff));  
        position: relative;
    }
    #logins header .logo {
        width: 29.2rem;
        height: 4rem;
        position: absolute;
        top: 1rem;
        left: 3rem;
        background: url(../../assets/img/login/logo.png) no-repeat center;
        background-size: 29.2rem 4rem;
    }
    #logins main {
        width: 100%;
        background: url(../../assets/img/login/background.jpg) no-repeat center;
        background-size: cover;
    }
    main section.pic {
        width: 48rem;
        height: 51rem;
        float: left;
        margin-left: 15%;
        background: url(../../assets/img/login/login-pic.png) no-repeat center;
        background-size: cover;
    }
    main section.login-container {
        width: 36rem;
        height: 30rem;
        float: left;
        margin: 10rem 0 0 5%;
        border-radius: 1.4rem;
        background: #fff;
    }
    section.login-container article.title {
        width: 80%;
        height: 6rem;
        line-height: 6rem;
        font-size: 1.8rem;
        color: #444;
        margin: 0 auto;
        margin-bottom: .1rem;
        border-bottom: .01rem solid #ccc;
    }
    section.login-container article.title.el-icon-arrow-left{
        text-align: left;
        cursor: pointer;
    }
    section.login-container article.box div.login-msg {
        padding: 1.8rem 3rem 0 3rem;
    }
    section.login-container article.box div.login-msg .el-input {
        margin-bottom: 1.8rem;
        font-size: 1.6rem;
    }
    section.login-container article.box div.login-item {
        text-align: left;
        padding: 0 3rem;
    }
    section.login-container article.box div.login-btn {
        padding: 1.8rem 3rem;
    }
    section.login-container article.box div.login-btn .el-button {
        width: 100%;
    }
    section.login-container article.box.box-roles{
        padding: 0 3rem;
        height: 20rem;
        overflow: auto;
    }
    section.login-container article.box.box-roles ul li{
        float: left;
        width: 8rem;
        height: 2rem;
        margin: 1rem;
        color: #32B266;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 4rem;
        background: url(../../assets/img/login/2-1.png) no-repeat center 1rem;
        background-size: 2rem;
    }
    section.login-container article.box.box-roles ul li:hover{
        cursor: pointer;
        color: #fff;
        border-radius: 1rem;
        background: #32B266 url(../../assets/img/login/1-1.png) no-repeat center 1rem;
        background-size: 2rem;
    }
    #logins footer {
        width: 100%;
        height: 6rem;
        line-height: 6rem;
        position: absolute;
        bottom: 5%;
        text-align: center;
        font-size: 1.6rem;
        color: #444;
    }
</style>
