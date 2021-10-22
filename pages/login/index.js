var loginForm = document.getElementById("login-form");
var loginBtn = document.getElementById("login-btn");
var appkey = "Q_A_Q_1590927055348";
loginBtn.onclick = function () {
  //获取表单下面的数据
  var usernmae = loginForm.elements.uname.value;
  var pw = loginForm.elements.pw.value;
  if (usernmae && pw) {
    ajax({
      url: "https://api.duyiedu.com/api/student/stuLogin",
      type: "POST",
      params: {
        appkey: appkey,
        account: usernmae,
        password: pw,
      },
      success(value) {
        var obj = JSON.parse(value);
        if (obj.status === "fail") {
          alert("登录失败！错误信息：" + obj.msg);
        } else {
          alert(obj.msg);
          location.href = "../main/index.html?name=" + usernmae;
        }
      },
    });
  } else {
    alert("请输入账号密码！");
  }
};
