/*
纯javascript基于数据的表单验证
    @params {object} form表单数据
    @params {object} rules对应表单数据的验证规则
    		内置有telphone,email,identity验证，还有快速非空验证（空数组和空对象也认为是false），同时支持正则pattern和自定义验证方法validator
*/

const validate = function (form,rules){
	try{
		// 遍历所有需要验证的元素
		for(var i in rules){
			// 遍历验证规则
			if(rules[i] && rules[i] instanceof Array){
				rules[i].forEach(function(item){
					// 校验，有错误会外部被catch
					check(form[i],item)
				})
			}
		}
	}catch(err){
		return {
			valid : false,
			message : err
		}
	}
	//没有被catch到错误，就验证通过
	return {
		valid : true,
		message : '验证通过'
	}
	
	

	function check(value,rule){
		// 非空验证
		if(rule.required){
			// 0是false，需要规避掉
			if(!value && typeof(value) != 'number'){
				throw rule.message;
			}
			// 空数组和空对象也被认为是空
			if(typeof(value) == 'object' && Object.values(value).length == 0){
				throw rule.message;
			}
			
		}
		// 正则验证
		if(rule.pattern && !rule.pattern.test(value)){
			throw rule.message;
		}
		//自定义方法验证
		if(rule.validator){
			try{
				rule.validator(value)
			}catch(err){
				throw err;
			}
		}
		// 内置常见的验证
		if(rule.type){
			switch(rule.type){
				case 'telphone' : 
					if(!/^1[3456789]\d{9}$/.test(value)){
						throw rule.message;
					};
					break;
				case 'email' : 
					if(!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)){
						throw rule.message;
					};
					break;
				case 'identity' : 
					if(!checkIdentity(value)){
						throw rule.message;
					};
					break;
				case 'bankCard' : 
					if(!checkBankCard(value)){
						throw rule.message;
					};
			}
		}
	}

	//验证身份证
	function checkIdentity (code) {    
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;

        if(!code || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }

        else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        return pass;
    }

    //验证银行卡
	//银行卡号码检测
	function checkBankCard(bankno) {
	    var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
	    var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
	    var newArr = new Array();
	    for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
	        newArr.push(first15Num.substr(i, 1));
	    }
	    var arrJiShu = new Array(); //奇数位*2的积 <9
	    var arrJiShu2 = new Array(); //奇数位*2的积 >9
	    var arrOuShu = new Array(); //偶数位数组
	    for (var j = 0; j < newArr.length; j++) {
	        if ((j + 1) % 2 == 1) { //奇数位
	            if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
	            else arrJiShu2.push(parseInt(newArr[j]) * 2);
	        } else //偶数位
	        arrOuShu.push(newArr[j]);
	    }

	    var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
	    var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
	    for (var h = 0; h < arrJiShu2.length; h++) {
	        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
	        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
	    }

	    var sumJiShu = 0; //奇数位*2 < 9 的数组之和
	    var sumOuShu = 0; //偶数位数组之和
	    var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
	    var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
	    var sumTotal = 0;
	    for (var m = 0; m < arrJiShu.length; m++) {
	        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
	    }

	    for (var n = 0; n < arrOuShu.length; n++) {
	        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
	    }

	    for (var p = 0; p < jishu_child1.length; p++) {
	        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
	        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
	    }
	    //计算总和
	    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

	    //计算luhn值
	    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
	    var luhn = 10 - k;

	    if (lastNum == luhn) {
	        return true;
	    } else {
	        return false;
	    }
	}
}


//示例
// var form = {
// 	userName:'13776844936',
// 	password:'123',
// 	emptyArr : [],
// 	emptyObj : {},
// 	phone : '13776844936',
// 	email : '664258072@qq.com',
// 	identity : '320481199303274013',
// }
// var rules = {
// 	userName : [
//         { required: true, message: '用户名不能为空'},
//         { pattern: /^1[3456789]\d{9}$/,message: '手机号格式有误'},
//     ],
//     emptyArr : [
//         { required: true, message: '空数组也是空'},
//     ],
//     emptyObj : [
//         { required: true, message: '空对象也是空'},
//     ],
//     password : [
//         { required: true, message: '密码不能为空'},
//         { validator : function(value){
//         	if(value != 123){
//         		throw '密码需要是123'
//         	}
//         }}
//     ],
//     phone : [
//     	{ type: 'telphone',message: '手机号格式有误'},
//     ],
//     email : [
//     	{ type: 'email',message: '邮箱格式有误'},
//     ],
//     identity : [
//     	{ type: 'identity',message: '身份证格式有误'},
//     ]
// }
// console.log(validate(form,rules))

export default validate



