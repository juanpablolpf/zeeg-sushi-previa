// Horários: cada página define HOURS (minutos desde 0h, domingo = 0) e DAYS antes deste arquivo.
(function () {
  if (typeof HOURS === "undefined") return;
  function fmt(m) { var h = Math.floor(m / 60) % 24, mm = m % 60; return h + "h" + (mm ? String(mm).padStart(2, "0") : ""); }
  function label(r) { return r.length ? r.map(function (x) { return fmt(x[0]) + " às " + fmt(x[1]); }).join(" e ") : "Fechado"; }
  var now = new Date(Date.now() - 3 * 3600 * 1000), day = now.getUTCDay(), mins = now.getUTCHours() * 60 + now.getUTCMinutes();
  var body = document.getElementById("hours-body");
  if (body) {
    var html = "";
    for (var d = 0; d < 7; d++) html += "<tr" + (d === day ? " class='today'" : "") + "><th scope='row'>" + DAYS[d] + "</th><td>" + label(HOURS[d]) + "</td></tr>";
    body.innerHTML = html;
  }
  var el = document.getElementById("status");
  if (!el) return;
  var open = HOURS[day].filter(function (r) { return mins >= r[0] && mins < r[1]; })[0];
  if (open) { el.innerHTML = "<b>Aberto agora.</b> Fecha às " + fmt(open[1]) + "."; return; }
  var later = HOURS[day].filter(function (r) { return r[0] > mins; })[0];
  if (later) { el.innerHTML = "<b>Fechado agora.</b> Abre hoje às " + fmt(later[0]) + "."; return; }
  for (var i = 1; i <= 7; i++) {
    var nd = (day + i) % 7;
    if (HOURS[nd].length) { el.innerHTML = "<b>Fechado agora.</b> Abre " + (i === 1 ? "amanhã" : DAYS[nd].toLowerCase()) + " às " + fmt(HOURS[nd][0][0]) + "."; return; }
  }
})();

// Menu no celular
(function () {
  var toggle = document.getElementById("menu-toggle"), nav = document.getElementById("nav");
  if (!toggle || !nav) return;
  function setMenu(open) { toggle.setAttribute("aria-expanded", open); toggle.textContent = open ? "Fechar" : "Menu"; nav.hidden = !open; }
  var mq = window.matchMedia("(max-width: 760px)");
  function syncMenu() { if (mq.matches) setMenu(false); else nav.hidden = false; }
  mq.addEventListener ? mq.addEventListener("change", syncMenu) : mq.addListener(syncMenu);
  syncMenu();
  toggle.addEventListener("click", function () { setMenu(nav.hidden); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a") && mq.matches) setMenu(false); });
})();

// Abas do cardápio
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab); });
    tab.addEventListener("keydown", function (e) {
      var n = e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length] : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
      if (n) { e.preventDefault(); select(n); n.focus(); }
    });
  });
})();
