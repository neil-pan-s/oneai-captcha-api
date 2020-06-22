
document.write(" <script language=\"javascript\" src=\"crypto.js\" > <\/script>"); 

/*
*	Predict     	识别请求
*  		img_data		图片数据
*		pd_id 		用户id
*		pd_key			访问秘钥
*		predict_type 	验证码类型
*		pred_cb			结果数据回调
				pred_cb( ret_code, rsp_data, pred_data)
					ret_code: 		0 成功
									-1 访问失败,http 访问失败
									-2 超时
									其他 
					rsp_data		访问返回结果
									RetCode    与参数1的ret_code意思一致
									ErrMsg 		当ret_code非0时，保存错误信息
									RequestId   本次识别的序列号，当识别结果不对时，可以用来申请退款
					pred_data		识别结果
									result  	正常识别时，返回识别结果在pred_data.result中

*/
function Predict(img_data, app_id, app_key, pd_id, pd_key, predict_type, pred_cb){
	var curDate = new Date();
	timestamp	= parseInt(curDate.getTime() / 1000).toString();   // 时间戳秩序精确到秒，所以 除以1000
	sign 		= CalcSign( pd_id, pd_key, timestamp);
	params 		= {
		'user_id':pd_id,
		'timestamp':timestamp,
		'sign': sign,
		'predict_type': predict_type,
		//'up_type': 'mt',
	};
	if( app_id !== null || app_id !== undefined || app_id !== ''){
		asign 	= CalcSign( app_id, app_key, timestamp);
		params['appid'] = app_id;
		params['asign'] = asign;
	}
	url = "https://oneai.azurewebsites.net/captcha";
	var formdata = new FormData();
	for (var i in params){
		formdata.append(i,params[i]);
    }
    formdata.append("img_data",img_data);

	ajaxMFormPost(url, formdata, function(ret_code, rsp_str){
		if( ret_code == 0){
			rsp_data			= eval('('+ rsp_str + ')');
			var pred_data		= {};
			if( rsp_data.RetCode == 0){
				pred_data 		= eval('(' + rsp_data.RspData + ')');
			}
			pred_cb( rsp_data.RetCode, rsp_data, pred_data);
		}else{
			rsp_data 		= {};
			rsp_data.ErrMsg = rsp_str;
			rsp_data.RetCode = ret_code;
			pred_cb( ret_code, rsp_data, {});
		}
	})
}

//-------------------------------------------------//

function CalcSign(pd_id, pd_key, timestamp){
	md5_chk		= hex_md5(timestamp + pd_key);
	sign_chk	= hex_md5( pd_id + timestamp + md5_chk);
	return sign_chk;
}

function EncodeImgData( img_data, enc_flag){
	var str 	= img_data;
	if( enc_flag != true){
		var b 		= new Base64();
		str 		= b.encode(img_data);
	}
	var data 	= encodeURIComponent(str);
	return data;
}


// ajax 对象
function ajaxObject() {
    var xmlHttp;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
        } 
    catch (e) {
        // Internet Explorer
        try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                //alert("您的浏览器不支持AJAX！");
                return false;
            }
        }
    }
    return xmlHttp;
}
 
// ajax post请求：
function ajaxPost ( url , data , fncallback ) {
    var ajax = ajaxObject();
    var timeout = false;
    var timer = setTimeout( function(){
        timeout = true;
        ajax.abort();
    }, 60000 );
    ajax.open( "post" , url , true );
    ajax.setRequestHeader( "Content-Type" , "application/x-www-form-urlencoded");
    ajax.onreadystatechange = function () {
        if( ajax.readyState == 4 ) {    	
        	if( timeout ) {
        		// already timeout happened 
        		fncallback(-2, "http timeout failed!");
        		return;
        	}
        	clearTimeout( timer );
            if( ajax.status == 200 ) {
                fncallback(0, ajax.responseText);
            }
            else {
                fncallback(-1, "http request failed! http error code: " + ajax.status);
            }
        }
    };
    function DictToSendStr( params){
    	var str 	= "";
    	var first 	= true;
    	for( var i in params){
    		if( first){
    			first 	= false;
    		}else{
    			str += "&";
    		}
    		str += i + "=" + params[i];
    	}
    	return str;
    }
    str_data 		= DictToSendStr( data);
    ajax.send(str_data);
}

function ajaxMFormPost(url , data , fncallback ) {
    var ajax = ajaxObject();
    var timeout = false;
    var timer = setTimeout( function(){
        timeout = true;
        ajax.abort();
    }, 60000 );
    ajax.open( "post" , url , true );
    ajax.setRe
    ajax.onreadystatechange = function () {
        if( ajax.readyState == 4 ) {
            if( timeout ) {
                // already timeout happened
                fncallback(-2, "http timeout failed!");
                return;
            }
            clearTimeout( timer );
            if( ajax.status == 200 ) {
                fncallback(0, ajax.responseText);
            }
            else {
                fncallback(-1, "http request failed! http error code: " + ajax.status);
            }
        }
    };
    ajax.send(data);
}

function ReadFile(file, load_cb) {
	//console.log("read file: " + file);
    var reader = new FileReader();//new一个FileReader实例
    reader.onload = function() {
    	// 没做异常判断
    	file_data		= this.result;
    	file_data		= file_data.split(",");
    	file_data		= file_data.pop();
    	load_cb( file_data);
	};
    reader.readAsDataURL(file);
}
