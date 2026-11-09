/* =========================================================
   城南家电维修 · 页面交互
   只做三件事：
   1) 常见问题：点开一条、其他自动收起（F-03）
   2) 表单校验：必填 + 11 位手机号（F-04）
   3) 提交处理：10 秒内不能重复提交（F-07），失败保留已填内容（F-06）
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- 1. 常见问题折叠 ---------------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));

  items.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";

      // 先把所有条目收起来，保证同一时间只展开一条
      items.forEach(function (other) {
        other.setAttribute("data-open", "false");
        var q = other.querySelector(".faq-q");
        if (q) q.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.setAttribute("data-open", "true");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------------- 2. 表单校验 ---------------- */
  var form = document.getElementById("askForm");
  if (!form) return;

  var okBox = document.getElementById("formOk");
  var submitBtn = form.querySelector('button[type="submit"]');

  // 表单提交地址：现在没接后端，留空时只在页面上显示成功提示。
  // 上线前改成你的 Formspree 地址，例如 "https://formspree.io/f/xxxxxxx"
  var FORM_ENDPOINT = "";

  function setErr(name, msg) {
    var el = form.querySelector('[data-err="' + name + '"]');
    if (el) el.textContent = msg || "";
    var input = form.querySelector("#" + name);
    if (input) {
      if (msg) {
        input.style.borderColor = "#C0392B";
      } else {
        input.style.borderColor = "";
      }
    }
  }

  function validate() {
    var name = form.querySelector("#name").value.trim();
    var phone = form.querySelector("#phone").value.trim();
    var msg = form.querySelector("#msg").value.trim();
    var firstBad = null;

    setErr("name", ""); setErr("phone", ""); setErr("msg", "");

    if (!name) { setErr("name", "写个称呼就行，方便回电话时知道找谁"); firstBad = firstBad || "name"; }
    if (!phone) { setErr("phone", "留个手机号，方便回你电话"); firstBad = firstBad || "phone"; }
    else if (!/^1[3-9]\d{9}$/.test(phone)) { setErr("phone", "手机号看起来不对，应该是 11 位数字"); firstBad = firstBad || "phone"; }
    if (!msg) { setErr("msg", "简单说一下什么情况，比如不制冷还是漏水"); firstBad = firstBad || "msg"; }

    if (firstBad) {
      var bad = form.querySelector("#" + firstBad);
      if (bad && bad.focus) bad.focus();
      return false;
    }
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;

    // 防连点：提交后按钮禁用 10 秒
    var originText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.textContent = "正在提交……";

    function finish(ok) {
      if (ok) {
        if (okBox) okBox.hidden = false;
        form.reset();
      }
      submitBtn.textContent = ok ? "已提交" : originText;
      submitBtn.style.opacity = "";
      // 10 秒后才能再次点击，防止同一条内容连点两遍
      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originText;
      }, 10000);
    }

    if (!FORM_ENDPOINT) {
      // 还没接后端：演示模式。提示语故意写清「没真的发出去」，
      // 免得哪天忘了接后端就上线，客户以为提交成功、其实什么都没收到。
      window.setTimeout(function () {
        if (okBox) okBox.textContent = "演示模式：表单还没接后端，这条信息并没有真的发出去。接上 Formspree 之后才会真的送到我手机上。";
        finish(true);
      }, 600);
      console.info("[提示] 表单未接后端，仅在页面显示成功。上线前把 main.js 里的 FORM_ENDPOINT 换成 Formspree 地址。");
      return;
    }

    var data = new FormData(form);
    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    })
      .then(function (res) { finish(res.ok); })
      .catch(function () {
        // 网络失败：不清空表单，客户不用重填（F-06）
        finish(false);
        if (okBox) {
          okBox.hidden = false;
          okBox.textContent = "网络有点问题，没提交成功。你可以直接打电话，或者稍后再点一次。";
        }
      });
  });

  /* ---------------- 底部悬浮「立即咨询」自动避让联系区 ----------------
     滑到联系/表单那一屏时把悬浮条收起来，否则会和「提交」按钮叠在一起，
     客户看着像两个按钮、还容易点错。离开联系区再放出来。 */
  var contactSection = document.querySelector("#contact");
  var fab = document.querySelector(".fab");
  if (contactSection && fab && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        fab.style.display = entry.isIntersecting ? "none" : "";
      });
    }, { threshold: 0.12 }).observe(contactSection);
  }
})();
