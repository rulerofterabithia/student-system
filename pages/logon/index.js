var usernameTag = document.getElementById("username");
var promptTag = document.getElementById("prompt");
var errorTag = document.getElementById("error-msg");
var logonBtn = document.getElementsByClassName("logon-btn")[0];
var logonForm = document.getElementById("logon-form");
var appkey = "Q_A_Q_1590927055348";
usernameTag.onfocus = function () {
  promptTag.style.display = "block";
  errorTag.style.display = "none";
  this.classList.remove("error-inp");
};
usernameTag.onblur = function () {
  promptTag.style.display = "none";
  var errorMsg = "";
  var value = getStrLength(this.value);
  if (value == "null") {
    errorMsg = "输入字符不合法，请重新输入！";
  } else if (value > 14) {
    errorMsg = "用户名超过14个英文或7个汉字";
  }
  if (errorMsg !== "") {
    errorTag.style.display = "block";
    this.classList.add("error-inp");
    errorTag.innerHTML = errorMsg;
  }
};

function getStrLength(str) {
  var len = str.length;
  var total = str.length;
  for (var i = 0; i < len; i++) {
    var code = str.charCodeAt(i);
    if (code >= 19968) {
      total += 1;
    }
  }
  return total;
}

// 注册

logonBtn.onclick = function (e) {
  //取消默认事件
  e.preventDefault();
  // form 表单下面的input元素的集合
  var elems = logonForm.elements;
  var username = elems.username.value;
  var account = elems.account.value;
  var password = elems.pw.value;
  var rePassword = elems.repw.value;
  console.log(username, account, pw, repw);

  // ajax获取数据
  ajax({
    url: "http://api.duyiedu.com/api/student/stuRegister ", //请求路径

    type: "POST", //请求方法
    params: {
      //这里的值要和上面对应；
      appkey: appkey,
      username: username,
      account: account,
      password: password,
      rePassword: rePassword,
    },
    success(value) {
      var obj = JSON.parse(value);
      if (obj.status === "fail") {
        // {"msg":"帐号必须为4-16位的字母数字下划线任意组合组成","status":"fail"}
        console.log(value);

        alert("注册失败，错误信息：" + obj.msg);
      } else {
        alert("恭喜您，注册成功！");
        logonForm.reset();//重置表单
        
      }
    },
  });
};
