# captcha

验证码识别服务 支持数字、字母、数字&字母类型 高识别率

```text
  https://oneai.azurewebsites.net/captcha
```

* 接口默认支持跨域 POST提交相关数据字段 即可返回识别结果
* 接口支持全开发语言 提供JS接口DEMO 其他语言需要自行参考Javascript代码实现

## 接口参数

* 请求URL
  * https://oneai.azurewebsites.net/captcha
* 请求方式
  * POST
* 参数
  * Content-type 请用application/x-www-form-urlencoded，暂时不支持application/json传输

### 请求报文

|参数名 | 必选 | 类型 | 说明|
 -: | -: | -: | :-
user_id | 是 | string | 用户id (即pd_id)
timestamp | 是 | string | 请求时间戳（精确到秒）
sign | 是 | string | 签名串，签名串计算规则请看最后一栏
app_id | 否 | string | app id
asign | 否 | string | app签名串，签名串计算规则请看最后一栏
predict_type | 是 | string | 识别类型
src_url | 否 | string | img_data的源网站地址，用于自动子类型分类用，以防识别率下降，单一类型为可选参数
up_type | 否 | string | 有效值为”mt”，使用Multipart/form-data形式直接上传图片数据
img_data | 是 | string | 识别数据，图片的数据 (Base64编码)

```text
  user_id: 124022
  timestamp: 1592853630
  sign: 5215be999e229fc0a7699b5bc4f40162
  predict_type: 30400
  appid: 1000001
  asign: e4aa2038d8ed991aa227f03c8b8a0b2f
  img_data: /9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkS...

  PS: 注意以FormData组织以上数组
```

### 响应报文

|错误码 | 描述 | 其他注释|
 -: | :- | :-
0 | 请求正常响应 | 无错误发生
-1 | 服务器繁忙请稍后重试 | 详情请查看返回的错误信息
3000 | 签名验证失败 | 请检查pd账户与秘钥是否输入正确，或者检查秘钥计算算法是否正确
3001 | 请求的参数不存在，请检查参数列表 | 根据返回信息可知道是哪个参数没带上
3002 | 用户不存在 | 请检查pd账户信息是否填写完整
3010 | 服务器繁忙，请稍候重试 | 请稍候重试或者与客服联系
3011 | 图片数据异常，请检查图片格式 | 无
4002 | 扣费类型不存在 | 请检查识别类型是否正确
4003 | 账户余额不足，请及时充值 | 需要充值
4004 | 请求失败 | 请稍候重试与3010类似，可能网络故障或者超时

```json
  {
    "RetCode": "0",
    "ErrMsg": "RetCode非0时，为具体的错误信息",
    "RequestId": "201707020038ae826793dc000501afdf",
    "RspData": "{\"result\":\"test\"}",
  }
```

### 签名计算

```text
  函数说明:
      md5   =>    md5sum计算，计算指定字符串数据的md5信息，返回32个十六进制的字符串(小写)
   计算规则:
      sign  =     md5(pd_id + timestamp + md5( timestamp + pd_key))
      asign =     md5(app_id + timestamp + md5( timestamp + app_key))
   参数说明:
      timestamp:  请求参数的timestamp一样，访问请求发生时的当前时间戳(1970年1月1日到现在的秒数)
      pd_id、pd_key、app_id、app_key: 用户授权码 开通服务后由客服提供
```

## 验证码类型

纯数字

|类型 | 说明|
 -: | -:
10100 | 1位纯数字
10200 | 2位纯数字
10300 | 3位纯数字
10400 | 4位纯数字
10500 | 5位纯数字
10600 | 6位纯数字
10700 | 7位纯数字
10800 | 8位纯数字
10900 | 9位纯数字

纯英文

|类型 | 说明|
 -: | -:
20100 | 1位纯英文
20200 | 2位纯英文
20300 | 3位纯英文
20400 | 4位纯英文
20500 | 5位纯英文
20600 | 6位纯英文
20700 | 7位纯英文
20800 | 8位纯英文
20900 | 9位纯英文

数字英文

|类型 | 说明|
 -: | -:
30100 | 1位数字英文
30200 | 2位数字英文
30300 | 3位数字英文
30400 | 4位数字英文
30500 | 5位数字英文
30600 | 6位数字英文
30700 | 7位数字英文
30800 | 8位数字英文
30900 | 9位数字英文

## 收费服务

| 费用 | 次数 |
 -: | -:
50元 | 2000
100元 | 5000

联系客服咨询和开通服务 可提供试用授权码 自行通过test.html验证

![客服微信](./wx.jpg "FuturePopeye")

## :)

程序员的头发还多吗? 100块基本满足一般项目的全年使用 不值得熬几个通宵 ...
