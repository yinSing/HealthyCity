// API
import axios from 'axios';
import crypto from 'crypto';
import {Loading} from 'element-ui';

// 代理
let ySing = 'hc-admin';
// 租户
export const tenantId = 'hcn.zhongshan';
// 获取角色
// export const LOGIN_INT = `${ySing}/logon/myRoles`;
export const rolesRequest =  param => {
	// let loadInterface = Loading.service({ 
	// 	fullscreen: true,
	// 	text: '正在获取角色列表，请稍等···'
	// });
	return axios.post(`${ySing}/logon/myRoles`,param).then(res=>{
		//loadInterface.close();
		return res.data;
	});
};

// 角色登录
export const rolesLogin = param => {
	let loadInterface = Loading.service({ 
		fullscreen: true,
		text: '正在登录···'
	});
	let instance = axios.create({
		// 'X-Access-Token': sessionStorage.getItem('accessToken'),
		'Content-Type': 'application/json',
	});
	return instance.post(`${ySing}/logon/login`,param).then(res=>{
		loadInterface.close();
		return res.data;
	})
};

// 记住密码(加密)
export const aesEncrypt = (data , key) => {
	const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    	crypted += cipher.final('hex');
    return crypted;
}

// 记住密码(解密)
export const aesDecrypt = (encrypted , key) => {
	const decipher = crypto.createDecipher('aes192', key);
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	  	decrypted += decipher.final('utf8');
	return decrypted;
}


/*let instance = axios.create({
	'X-Access-Token': sessionStorage.getItem(),
	'X-Service-Id': ServiceId,
	'X-Service-Method': ServiceMethod,
	'Content-Type': 'application/json',
}); */