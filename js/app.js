/* Green Gold Park — interactions, data, chatbot. Vanilla JS, no build step. */
(function () {
  "use strict";

  const BOOK_PHONE = "79100697700";        // WhatsApp / tel
  const BOOK_MAIL = "ggp-booking@yandex.ru";
  const IMG = "assets/img/";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ============ DATA ============ */
  const ROOMS = {
    villa: [
      { name: "Вилла на 4 гостей", view: "Сосновый бор", img: "villa-ext-2.jpg", photos: ["villa-ext-2.jpg", "interior-bed-1.jpg", "living-3.jpg", "bath.jpg"], guests: 4, week: 5000, weekend: 8000, feats: ["до 4 гостей", "Wi-Fi", "прокат инвентаря"] },
      { name: "Вилла на 6 гостей", view: "Лес и озеро", img: "villa-ext-1.jpg", photos: ["villa-ext-1.jpg", "interior-bed-2.jpg", "living-2.jpg", "dining.jpg"], guests: 6, week: 6500, weekend: 9500, feats: ["до 6 гостей", "панорамные окна", "Wi-Fi"] },
      { name: "Вилла на 6 с террасой", view: "Терраса у леса", img: "terrace.jpg", photos: ["terrace.jpg", "interior-bed-3.jpg", "living-3.jpg", "dining-2.jpg"], guests: 6, week: 7000, weekend: 9500, feats: ["до 6 гостей", "терраса", "мангал"] },
      { name: "Вилла на 8 с террасой", view: "Терраса и лес", img: "villa-ext-3.jpg", photos: ["villa-ext-3.jpg", "interior-bed-4.jpg", "living-2.jpg", "bath.jpg"], guests: 8, week: 8000, weekend: 12000, feats: ["до 8 гостей", "терраса", "для компании"] },
      { name: "Вилла на 10 гостей", view: "Большая вилла", img: "living-2.jpg", photos: ["living-2.jpg", "interior-bed-5.jpg", "interior-bed-2.jpg", "dining.jpg"], guests: 10, week: 10000, weekend: 15000, feats: ["до 10 гостей", "2 этажа", "гостиная"] },
    ],
    apart: [
      { name: "Апартаменты на 4", view: "Вид на озеро", img: "window-view.jpg", photos: ["window-view.jpg", "interior-bed-3.jpg", "living-3.jpg", "bath.jpg"], guests: 4, week: 3500, weekend: 5000, feats: ["до 4 гостей", "вид на озеро", "Wi-Fi"] },
      { name: "Апартаменты на 3", view: "Вид на лес", img: "interior-bed-3.jpg", photos: ["interior-bed-3.jpg", "living-3.jpg", "window-view.jpg"], guests: 3, week: 3000, weekend: 3500, feats: ["до 3 гостей", "вид на лес", "Wi-Fi"] },
      { name: "Апартаменты на 2", view: "Вид на лес", img: "interior-bed-1.jpg", photos: ["interior-bed-1.jpg", "bath.jpg", "forest-path.jpg"], guests: 2, week: 2500, weekend: 3000, feats: ["для пары", "уютный номер", "Wi-Fi"] },
    ],
  };

  const ACTIVITIES = [
    { name: "Русская баня", price: "от 1 900 ₽/час", img: "act-sauna.jpg", cls: "act__cell--lg" },
    { name: "Банный чан у воды", price: "от 2 500 ₽/час", img: "act-hottub.jpg", cls: "" },
    { name: "SUP-сёрфинг", price: "от 1 000 ₽/час", img: "act-relax.jpg", cls: "" },
    { name: "Прокат лодки", price: "от 500 ₽/час", img: "act-fishing.jpg", cls: "act__cell--wide" },
    { name: "Теннисный корт", price: "1 500 ₽/час", img: "act-tennis.jpg", cls: "" },
    { name: "Конные прогулки", price: "по записи", img: "lifestyle-bike.jpg", cls: "" },
  ];
  const FREE = ["Детский батут", "Настольный теннис", "Удочки", "Игра «Мафия»", "Петанк", "Бадминтон", "Детская площадка"];

  const GALLERY = [
    "hero-lake.jpg", "villa-ext-1.jpg", "living-2.jpg", "lake-golden.jpg",
    "interior-bed-2.jpg", "act-hottub.jpg", "terrace.jpg", "dining.jpg",
    "interior-bed-4.jpg", "window-view.jpg", "act-fishing.jpg", "villa-ext-3.jpg",
    "lifestyle-family.jpg", "bath.jpg", "act-tennis.jpg", "forest-path.jpg",
  ];

  const fmt = (n) => n.toLocaleString("ru-RU");

  /* ============ RENDER: ROOMS ============ */
  const guestSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';

  /* Generated schematic floor plan, varies by capacity and terrace. */
  function planSvg(r) {
    const beds = Math.max(1, Math.round(r.guests / 2));
    const terrace = r.feats.some((f) => /террас/i.test(f));
    const W = 440, H = 300, m = 14;
    const L = m, T = m, R = W - m, B = H - m;
    const divX = L + 168, midX = Math.round((divX + R) / 2);
    const livingB = T + 150;
    const bandT = terrace ? B - 60 : B;
    const e = [];
    const line = (x1, y1, x2, y2) => e.push(`<line class="pdiv" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    const txt = (x, y, t) => e.push(`<text class="pt" x="${x}" y="${y}" text-anchor="middle">${t}</text>`);
    const furn = (x, y, w, h) => e.push(`<rect class="pf" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`);

    e.push(`<rect class="pwall" x="${L}" y="${T}" width="${R - L}" height="${B - T}" rx="6"/>`);
    line(divX, T, divX, B);

    const bh = (B - T) / beds, cx = Math.round((L + divX) / 2);
    for (let i = 0; i < beds; i++) {
      const by = T + i * bh;
      if (i) line(L, by, divX, by);
      furn(L + 16, by + bh / 2 - 18, 50, 36);
      e.push(`<line class="pf" x1="${L + 16}" y1="${by + bh / 2 - 7}" x2="${L + 66}" y2="${by + bh / 2 - 7}"/>`);
      txt(cx, by + bh / 2 + 34, "Спальня");
    }

    // living
    line(divX, livingB, R, livingB);
    furn(divX + 16, livingB - 58, 30, 44);
    furn(divX + 16, livingB - 22, 86, 14);
    e.push(`<circle class="pf" cx="${divX + 120}" cy="${livingB - 40}" r="16"/>`);
    txt(Math.round((divX + R) / 2) + 18, T + 30, "Гостиная");
    // kitchen + bath
    line(midX, livingB, midX, bandT);
    furn(divX + 12, livingB + 12, 96, 16);
    txt(Math.round((divX + midX) / 2), Math.round((livingB + bandT) / 2) + 4, "Кухня");
    furn(midX + 16, livingB + 14, 40, 28);
    txt(Math.round((midX + R) / 2), Math.round((livingB + bandT) / 2) + 4, "С/у");
    // terrace band
    if (terrace) {
      line(divX, bandT, R, bandT);
      e.push(`<rect class="pterr" x="${divX + 4}" y="${bandT + 4}" width="${R - divX - 8}" height="${B - bandT - 8}" rx="4"/>`);
      txt(Math.round((divX + R) / 2), Math.round((bandT + B) / 2) + 4, "Терраса");
    }
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Планировка ${r.name}">${e.join("")}</svg>`;
  }

  function renderRooms(cat) {
    const grid = $("#roomsGrid");
    grid.innerHTML = ROOMS[cat].map((r) => {
      const total = r.photos.length + 1;
      const slides = r.photos.map((p) => `<div class="room__slide"><img src="${IMG}${p}" alt="${r.name}" loading="lazy" /></div>`).join("")
        + `<div class="room__slide room__slide--plan"><div class="room__plan">${planSvg(r)}</div></div>`;
      const dots = Array.from({ length: total }, (_, i) => `<button class="room__dot" type="button" data-i="${i}" aria-label="Слайд ${i + 1}"></button>`).join("");
      return `
      <article class="room reveal">
        <div class="room__media" data-carousel>
          <div class="room__track">${slides}</div>
          <button class="room__arrow room__arrow--prev" type="button" aria-label="Предыдущее">‹</button>
          <button class="room__arrow room__arrow--next" type="button" aria-label="Следующее">›</button>
          <span class="room__cap">${guestSvg}до ${r.guests}</span>
          <span class="room__count"></span>
          <button class="room__planbtn" type="button">Планировка</button>
          <div class="room__dots">${dots}</div>
        </div>
        <div class="room__body">
          <h3 class="room__name">${r.name}</h3>
          <div class="room__view">${r.view}</div>
          <div class="room__feats">${r.feats.map((f) => `<span>${f}</span>`).join("")}</div>
          <div class="room__foot">
            <div class="room__price"><small>будни / выходные</small><b>${fmt(r.week)} <span>– ${fmt(r.weekend)} ₽</span></b></div>
            <button class="room__book" data-book data-room="${r.name}">Выбрать</button>
          </div>
        </div>
      </article>`;
    }).join("");
    observeReveal(grid);
    bindBookButtons(grid);
    initRoomCarousels(grid);
  }

  function initRoomCarousels(scope) {
    $$(".room__media", scope).forEach((media) => {
      const track = $(".room__track", media);
      const slides = $$(".room__slide", media);
      const dots = $$(".room__dot", media);
      const count = $(".room__count", media);
      const planBtn = $(".room__planbtn", media);
      const n = slides.length, planIdx = n - 1;
      let i = 0;
      function go(idx) {
        i = (idx + n) % n;
        track.style.transform = `translateX(${-i * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle("active", di === i));
        const onPlan = i === planIdx;
        count.textContent = onPlan ? "Планировка" : `${i + 1} / ${planIdx}`;
        planBtn.textContent = onPlan ? "Фото" : "Планировка";
        planBtn.classList.toggle("is-plan", onPlan);
      }
      $(".room__arrow--prev", media).addEventListener("click", () => go(i - 1));
      $(".room__arrow--next", media).addEventListener("click", () => go(i + 1));
      dots.forEach((d, di) => d.addEventListener("click", () => go(di)));
      planBtn.addEventListener("click", () => go(i === planIdx ? 0 : planIdx));
      let sx = null;
      track.addEventListener("pointerdown", (e) => { sx = e.clientX; });
      track.addEventListener("pointerup", (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
        sx = null;
      });
      go(0);
    });
  }

  $$("#roomTabs .tab").forEach((t) => t.addEventListener("click", () => {
    $$("#roomTabs .tab").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    renderRooms(t.dataset.cat);
  }));

  /* ============ SALE: tab switch ============ */
  $$("#saleTabs .tab").forEach((t) => t.addEventListener("click", () => {
    const which = t.dataset.sale;
    $$("#saleTabs .tab").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    $$("[data-sale-panel]").forEach((p) => p.classList.toggle("is-hidden", p.dataset.salePanel !== which));
  }));

  /* ============ RENDER: ACTIVITIES ============ */
  function renderActivities() {
    const grid = $("#actGrid");
    const cells = ACTIVITIES.map((a) => `
      <div class="act__cell ${a.cls} reveal">
        <img src="${IMG}${a.img}" alt="${a.name}" loading="lazy" />
        <div class="act__meta"><h4>${a.name}</h4><p>${a.price}</p></div>
      </div>`).join("");
    const free = `
      <div class="act__free reveal">
        <h4>Бесплатно для гостей</h4>
        <p>Уже включено в проживание</p>
        <ul>${FREE.map((f) => `<li>${f}</li>`).join("")}</ul>
      </div>`;
    grid.innerHTML = cells + free;
    observeReveal(grid);
  }

  /* ============ RENDER: GALLERY ============ */
  function renderGallery() {
    const grid = $("#galleryGrid");
    grid.innerHTML = GALLERY.map((g, i) => `
      <figure data-i="${i}"><img src="${IMG}${g}" alt="Грин Голд Парк, фото ${i + 1}" loading="lazy" /></figure>`).join("");
    grid.addEventListener("click", (e) => {
      const fig = e.target.closest("figure");
      if (fig) openLightbox(+fig.dataset.i);
    });
  }

  /* ============ LIGHTBOX ============ */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbIndex = 0;
  function openLightbox(i) { lbIndex = i; lbImg.src = IMG + GALLERY[i]; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
  function closeLightbox() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); }
  function step(d) { lbIndex = (lbIndex + d + GALLERY.length) % GALLERY.length; lbImg.src = IMG + GALLERY[lbIndex]; }
  $("#lbClose").onclick = closeLightbox;
  $("#lbPrev").onclick = () => step(-1);
  $("#lbNext").onclick = () => step(1);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ============ BOOKING MODAL ============ */
  const modal = $("#bookModal");
  function fillRoomSelect(preset) {
    const sel = $("#bRoom");
    const opts = ['<option value="Подбор размещения">Не определились, нужен совет</option>']
      .concat(ROOMS.villa.map((r) => `<option>${r.name}</option>`))
      .concat(ROOMS.apart.map((r) => `<option>${r.name}</option>`));
    sel.innerHTML = opts.join("");
    if (preset) { $$("#bRoom option").forEach((o) => { if (o.value === preset) o.selected = true; }); }
  }
  function openBook(room) {
    fillRoomSelect(room);
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    setTimeout(() => $("#bName").focus(), 320);
  }
  function closeBook() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
  $("#bookClose").onclick = closeBook;
  modal.addEventListener("click", (e) => { if (e.target === modal) closeBook(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) closeBook(); });

  function bindBookButtons(root) {
    $$("[data-book]", root).forEach((b) => {
      if (b._bound) return; b._bound = true;
      b.addEventListener("click", () => openBook(b.dataset.room || ""));
    });
  }

  function bookingMessage() {
    const f = $("#bookForm");
    const g = (n) => (f.elements[n].value || "").trim();
    const lines = [
      "Здравствуйте! Заявка на бронирование в Грин Голд Парк.",
      "Имя: " + (g("name") || "-"),
      "Телефон: " + (g("phone") || "-"),
      "Размещение: " + g("room"),
      "Даты: " + (g("checkin") || "?") + " по " + (g("checkout") || "?"),
      "Гостей: " + (g("guests") || "-"),
    ];
    if (g("msg")) lines.push("Комментарий: " + g("msg"));
    return lines.join("\n");
  }
  $("#bookForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = bookingMessage();
    window.open("https://wa.me/" + BOOK_PHONE + "?text=" + encodeURIComponent(text), "_blank");
  });
  $("#bookMail").addEventListener("click", (e) => {
    e.preventDefault();
    const text = bookingMessage();
    window.location.href = "mailto:" + BOOK_MAIL + "?subject=" +
      encodeURIComponent("Заявка на бронирование") + "&body=" + encodeURIComponent(text);
  });

  /* ============ NAV + DRAWER ============ */
  const nav = $("#nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  onScrollNav();
  const drawer = $("#drawer");
  const toggleDrawer = (v) => { drawer.classList.toggle("open", v); document.body.style.overflow = v ? "hidden" : ""; };
  $("#burger").onclick = () => toggleDrawer(true);
  $("#drawerClose").onclick = () => toggleDrawer(false);
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => toggleDrawer(false)));

  /* ============ SCROLL REVEAL + HERO PARALLAX ============ */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let io;
  function observeReveal(root = document) {
    if (reduce) { $$(".reveal", root).forEach((el) => el.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver((ents) => {
      ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal", root).forEach((el) => io.observe(el));
  }

  const heroImg = $(".hero__bg img");
  let ticking = false;
  function onScroll() {
    onScrollNav();
    if (reduce || !heroImg) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) heroImg.style.transform = "translateY(" + y * 0.18 + "px)";
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* count-up stats */
  function countUp(el) {
    const target = +el.dataset.count; if (!target) return;
    if (reduce) { el.textContent = fmt(target); return; }
    const dur = 1100, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const statIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => { if (en.isIntersecting) { countUp(en.target); statIO.unobserve(en.target); } });
  }, { threshold: 0.6 });
  $$(".stat__num[data-count]").forEach((el) => statIO.observe(el));

  /* ============ CHATBOT ============ */
  const chat = $("#chat"), chatBody = $("#chatBody"), chatFab = $("#chatFab");
  let chatStarted = false;

  const KB = [
    { k: ["привет", "здрав", "добр", "хай", "ку "], a: "Здравствуйте! Я администратор Грин Голд Парка. Расскажу про размещение, цены, баню и как до нас добраться. О чём хотите узнать?" },
    { k: ["вилл", "дом", "коттедж"], a: "Виллы вмещают от 4 до 10 гостей. Есть варианты с террасой и мангалом. Будни от 5 000 ₽, выходные от 8 000 ₽ за ночь. Во всех: Wi-Fi и прокат инвентаря." },
    { k: ["апарт", "номер", "пара", "вдвоём", "вдвоем"], a: "Апартаменты на 2, 3 и 4 гостей, с видом на лес или озеро. От 2 500 ₽ за ночь. Отличный вариант для пары или небольшой семьи." },
    { k: ["бан", "парь", "сауна"], a: "Русская баня: на 4 человек от 1 900 ₽/час, на 8 человек от 2 500 ₽/час. Также есть банный чан у воды, от 2 500 ₽/час (минимум 2 часа). Затопить к вашему заезду?" },
    { k: ["чан", "купел"], a: "Банный чан на берегу: от 2 500 ₽/час, минимальное время 2 часа. Тёплая вода под открытым небом с видом на озеро." },
    { k: ["sup", "сап", "сёрф", "серф", "виндс", "доск"], a: "Прокат SUP-доски: 1 000 ₽/час. Виндсёрфинг: снаряжение 1 000 ₽/час, занятие с инструктором 2 000 ₽/час." },
    { k: ["лодк", "катан", "весл"], a: "Прокат лодки: 500 ₽/час. Можно выйти на воду и порыбачить, удочки выдаём бесплатно." },
    { k: ["теннис", "корт"], a: "Два теннисных корта с грунтовым покрытием, 1 500 ₽/час. Вечером есть освещение." },
    { k: ["лошад", "конн", "верхо"], a: "Конные прогулки доступны по предварительной записи. Подскажу детали, если оставите заявку или позвоните: +7 910 069 77 00." },
    { k: ["бесплат", "включ", "детям", "ребён", "ребен", "дет", "развлеч", "заня", "досуг"], a: "Бесплатно для гостей: детский батут и площадка, настольный теннис, удочки, петанк, бадминтон и игра «Мафия». Платно: баня, чан, SUP, лодка, теннис, конные прогулки." },
    { k: ["рыбал", "рыбу", "удочк"], a: "Рыбалка на озере, удочки выдаём бесплатно. Для выхода на воду можно взять лодку, 500 ₽/час." },
    { k: ["добра", "доехать", "дорог", "адрес", "где наход", "карт", "проезд", "москв", "тверь", "питер", "спб"], a: "Мы в Тверской области, Селижаровский район, пос. Селище, ул. Почтовая, 1А.\nОт Москвы 310 км по М-9 (около 3 часов), от Твери 200 км, от Санкт-Петербурга 650 км. На сайте есть карта и кнопка «Открыть в Яндекс.Картах»." },
    { k: ["wi", "вай", "интернет", "связь"], a: "Бесплатный Wi-Fi есть во всех виллах и апартаментах." },
    { k: ["живот", "собак", "пит", "кошк"], a: "Уточните размещение с питомцем у службы бронирования: +7 910 069 77 00, мы подскажем подходящие варианты." },
    { k: ["заезд", "выезд", "время", "минимал", "ноч", "сутк"], a: "Минимальное бронирование: 2 ночи. Бронь на 1 ночь возможна, но только через менеджера. Время заезда и выезда подскажем при подтверждении." },
    { k: ["брон", "заяв", "заброниров", "снять", "хочу", "свобод", "налич", "дат"], a: "С радостью забронируем! Нажмите «Забронировать» вверху страницы, и я открою форму. Или позвоните: +7 910 069 77 00.", action: "book" },
    { k: ["телефон", "позвон", "контакт", "связат", "почт", "email", "почта", "ватсап", "whatsapp"], a: "Бронирование: +7 910 069 77 00, ggp-booking@yandex.ru\nРесепшн: +7 910 844 60 03 (09:00–21:00). Также мы есть в WhatsApp и ВКонтакте." },
    { k: ["еда", "пита", "завтрак", "ресторан", "кухн", "готов", "мангал"], a: "В виллах и апартаментах оборудованная кухня, можно готовить самим. У вариантов с террасой есть мангал. По организации питания подскажем на ресепшн." },
    { k: ["цен", "стоит", "сколько", "прайс", "почём", "почем"], a: "Цены за ночь (будни / выходные):\nВиллы от 5 000 / 8 000 ₽ (до 4 гостей) до 10 000 / 15 000 ₽ (до 10 гостей).\nАпартаменты от 2 500 ₽ за ночь.\nМинимальное бронирование: 2 ночи. Хотите оставить заявку?", chips: true },
    { k: ["спасиб", "благодар", "класс", "отлич", "супер", "понял"], a: "Пожалуйста! Будут вопросы, я рядом. Хорошего отдыха на Селигере 🌲" },
  ];
  const CHIPS = ["Цены и размещение", "Что включено", "Про баню", "Как добраться", "Забронировать"];

  /* ===== AI assistant (free Cloudflare Worker proxy), with offline rule fallback ===== */
  // Worker endpoint. Resort facts + the AI model live server-side in bot-worker/src/index.js.
  const AI_URL = "https://ggp-bot.ikutuzov1702.workers.dev";
  const history = []; // only user/assistant turns; system prompt is added by the worker
  const BOOK_INTENT = /заброниров|бронир|оставить заявк|снять виллу|хочу.*(вилл|апарт|отдох)/i;
  const aiReady = () => /\.workers\.dev$/.test(new URL(AI_URL).host) && !/WORKER_SUBDOMAIN/.test(AI_URL);

  function botReply(text) {
    const q = " " + text.toLowerCase().replace(/ё/g, "е") + " ";
    for (const item of KB) {
      if (item.k.some((kw) => q.includes(kw.replace(/ё/g, "е")))) return item;
    }
    return { a: "Подскажу по размещению, ценам, бане, развлечениям и дороге. А по конкретным датам и бронированию лучше всего позвонить: +7 910 069 77 00 или нажать «Забронировать»." };
  }

  function addMsg(text, who) {
    const el = document.createElement("div");
    el.className = "msg msg--" + who;
    el.innerHTML = linkify(text);
    chatBody.appendChild(el);
    chatBody.scrollTop = chatBody.scrollHeight;
    return el;
  }
  function linkify(t) {
    return t
      .replace(/\n/g, "<br>")
      .replace(/(\+7[\d\s]{10,})/g, (m) => `<a href="tel:${m.replace(/\s/g, "")}">${m.trim()}</a>`)
      .replace(/([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/gi, '<a href="mailto:$1">$1</a>');
  }
  function typing() {
    const el = document.createElement("div");
    el.className = "chat__typing"; el.innerHTML = "<i></i><i></i><i></i>";
    chatBody.appendChild(el); chatBody.scrollTop = chatBody.scrollHeight;
    return el;
  }
  function ruleRespond(text, instant) {
    const t = instant ? null : typing();
    const r = botReply(text);
    const show = () => {
      if (t) t.remove();
      addMsg(r.a, "bot");
      if (r.action === "book") setTimeout(() => openBook(""), 600);
    };
    if (instant) show(); else setTimeout(show, 480 + Math.random() * 360);
  }

  function maybeOpenBook(text) {
    if (BOOK_INTENT.test(text)) setTimeout(() => openBook(""), 700);
  }

  async function respond(text) {
    if (!aiReady()) { ruleRespond(text, false); return; }
    history.push({ role: "user", content: text });
    if (history.length > 20) history.splice(0, history.length - 20); // keep last 20 turns
    const t = typing();
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const res = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      const answer = (data && typeof data.text === "string") ? data.text.trim() : "";
      t.remove();
      if (!res.ok || !answer) { history.pop(); ruleRespond(text, true); return; }
      addMsg(answer, "bot");
      history.push({ role: "assistant", content: answer });
      maybeOpenBook(text);
    } catch (err) {
      t.remove();
      history.pop();
      ruleRespond(text, true);
    }
  }

  function renderChips() {
    const wrap = $("#chatChips");
    wrap.innerHTML = CHIPS.map((c) => `<button class="chip">${c}</button>`).join("");
    $$(".chip", wrap).forEach((c) => c.addEventListener("click", () => {
      addMsg(c.textContent, "user");
      respond(c.textContent);
    }));
  }
  function startChat() {
    if (chatStarted) return; chatStarted = true;
    addMsg("Здравствуйте! Я администратор Грин Голд Парка 🌲 Помогу с выбором виллы, расскажу про цены, баню и дорогу. Спрашивайте!", "bot");
    renderChips();
  }
  function openChat() { chat.classList.add("open"); chat.setAttribute("aria-hidden", "false"); chatFab.classList.add("hidden"); startChat(); setTimeout(() => $("#chatInput").focus(), 300); }
  function closeChat() { chat.classList.remove("open"); chat.setAttribute("aria-hidden", "true"); chatFab.classList.remove("hidden"); }
  chatFab.onclick = openChat;
  $("#chatClose").onclick = closeChat;
  $("#chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#chatInput"); const v = inp.value.trim();
    if (!v) return;
    addMsg(v, "user"); inp.value = "";
    respond(v);
  });

  /* ============ INIT ============ */
  renderRooms("villa");
  renderActivities();
  renderGallery();
  observeReveal(document);
  bindBookButtons(document);
})();
