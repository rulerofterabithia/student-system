// 页面守卫
var uname = "";
var appkey = "Q_A_Q_1590927055348";
var stuList = [];
var nowPage = 1;
var size = 3;
var totalPage = 1;
function getName() {
  return location.search.slice(1).split("=")[1];
}
uname = getName();
if (!uname) {
  location.href = "../login/index.html";
}

//DOM
var leftNav = document.getElementById("left-nav");
var rightContent = document.getElementById("right-content");
var addForm = document.getElementById("add-form");
var addBtn = document.getElementById("add-btn");
var listBody = document.getElementById("list-body"); //学生列表
var listBody = document.getElementById("list-body");
var dialog = document.getElementById("dialog");
var editForm = document.getElementById("edit-form");
var editBtn = document.getElementById("edit-btn");
// 翻页DOM
var pageDom = document.getElementById("page");
var prevBtn = document.getElementById("prev-btn");
var nextBtn = document.getElementById("next-btn");

//左侧导航栏的切换逻辑
leftNav.onclick = function (e) {
  // console.log(e.target);
  var child = this.children;
  for (var i = 0; i < child.length; i++) {
    child[i].classList.remove("active");
  }
  // 事件委托
  e.target.classList.add("active");
  var goal = e.target.getAttribute("goal");
  var content = rightContent.getElementsByClassName(goal)[0]; //这里的goal是string 所以不用引号
  if (content) {
    for (var i = 0; i < rightContent.children.length; i++) {
      rightContent.children[i].classList.remove("active-content");
    }
    content.classList.add("active-content");
  }
};

// 表单提交按钮逻辑
addBtn.onclick = function () {
  var elems = addForm.elements;
  var data = {};
  data.appkey = appkey;
  data.sNo = elems.sNo.value;
  data.name = elems.name.value;
  data.sex = elems.sex.value;
  data.birth = elems.birth.value;
  data.phone = elems.phone.value;
  data.address = elems.address.value;
  data.email = elems.email.value;

  ajax({
    url: "http://api.duyiedu.com/api/student/addStudent",
    type: "GET",
    params: data,
    success(result) {
      var obj = JSON.parse(result);
      if (obj.status === "fail") {
        alert("添加失败！错误信息：" + obj.msg);
      } else {
        alert(obj.msg);
        addForm.reset();
        location.reload();
      }
    },
  });
};

//获取数据
function getDataByPage() {
  ajax({
    url: "http://api.duyiedu.com/api/student/findByPage",
    type: "GET",
    params: {
      appkey: appkey,
      page: nowPage,
      size: size,
    },
    success(value) {
      var res = JSON.parse(value);
      // console.log(res);
      stuList = res.data.findByPage;
      totalPage = Math.ceil(res.data.cont / size);
      randerTable(stuList);
      randerPage();
    },
  });
}

//渲染页数
function randerPage() {
  // 每次更新前先清空原有内容
  pageDom.innerHTML = "";
  for (var i = 1; i <= totalPage; i++) {
    var liTag = document.createElement("li");
    liTag.innerHTML = i;
    pageDom.appendChild(liTag);
    // console.log(nowPage + "渲染");
    if (i === nowPage) {
      liTag.classList.add("active");
    }
  }
}

// 页数跳转
pageDom.onclick = function (e) {
  var target = e.target;
  // console.log(target);
  if (target.tagName === "LI") {
    //点击切换当前页
    nowPage = Number(target.innerHTML);
    // console.log(nowPage);
    //根据当前页数获取当前页的数据
    getDataByPage();
    // 根据当前页切换页码
    randerPage();
  }
};

// 上一页
prevBtn.onclick = function () {
  if (nowPage > 1) {
    nowPage -= 1;
    getDataByPage();
    randerPage();
  }
};

// 下一页
nextBtn.onclick = function () {
  if (nowPage < totalPage) {
    nowPage += 1;
    getDataByPage();
    randerPage();
  }
};

//获取学生数据
getDataByPage();

//渲染学生列表
function randerTable(stuList) {
  listBody.innerHTML = "";
  for (var i = 0; i < stuList.length; i++) {
    var trTag = document.createElement("tr");
    listBody.appendChild(trTag);
    trTag.innerHTML =
      "<td>" +
      stuList[i].sNo +
      "</td> \
    <td>" +
      stuList[i].name +
      "</td> \
    <td>" +
      formatsex(stuList[i].sex) +
      "</td> \
    <td>" +
      formatBirth(stuList[i].birth) +
      "</td> \
    <td>" +
      stuList[i].phone +
      "</td> \
    <td>" +
      stuList[i].email +
      "</td> \
    <td>" +
      stuList[i].address +
      "</td> \
    <td>\
        <span class= 'edit' index='" +
      i +
      "'>编辑</span> \
        <span class = 'del' index='" +
      i +
      "'>删除</span> \
    </td> ";
  }
}

// console.log(stuList);

function formatsex(val) {
  return val === 1 ? "女" : "男";
}

function formatBirth(val) {
  return new Date().getFullYear() - val;
}

// 修改操作
listBody.onclick = function (e) {
  var btn = e.target;
  // 如果包含'edit'就执行
  if (btn.classList.contains("edit")) {
    dialog.style.display = "block";
    // 获取索引，点得是哪个编辑
    var index = btn.getAttribute("index");
    // 通过索引得到相应学生的表单
    var activeStu = stuList[index];
    // console.log(activeStu);
    //获取修改列表的表单
    var elems = editForm.elements;
    //通过for in 循环将学生的信息填到修改的表单；
    //如何遍历对象？ for in
    for (var prop in activeStu) {
      if (elems[prop]) {
        elems[prop].value = activeStu[prop];
      }
    }
  } else if (btn.classList.contains("del")) {
    var flag = window.confirm("确认是否删除该数据！");
    if (flag) {
      var index = btn.getAttribute("index");
      var sNo = stuList[index].sNo;
      ajax({
        url: "http://api.duyiedu.com/api/student/delBySno",
        type: "GET",
        params: {
          appkey: appkey,
          sNo: sNo,
        },
        success(val){
          console.log(val);
          var res = JSON.parse(val);
          console.log(res);
          if(res.status === "fail"){
            alert("删除错误！错误信息：" + res.msg );
          }else{
            alert(res.msg);
            location.reload();
          }
        }
      });
    }
  }
};

dialog.onclick = function () {
  this.style.display = "none";
};

editForm.onclick = function (e) {
  e.stopPropagation();
};

editBtn.onclick = function () {
  var elems = editForm.elements;
  var data = {};
  data.appkey = appkey;
  data.sNo = elems.sNo.value;
  data.name = elems.name.value;
  data.sex = elems.sex.value;
  data.birth = elems.birth.value;
  data.phone = elems.phone.value;
  data.address = elems.address.value;
  data.email = elems.email.value;

  ajax({
    url: "http://api.duyiedu.com/api/student/updateStudent",
    type: "GET",
    params: data,
    success(result) {
      // console.log(result);
      // console.log(data);
      var obj = JSON.parse(result);
      if (obj.status === "fail") {
        alert("修改失败！错误信息：" + obj.msg);
      } else {
        alert(obj.msg);
        dialog.style.display = "none";
        editForm.reset();
        location.reload();
      }
    },
  });
};
// 伟业