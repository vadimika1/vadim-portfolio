// Яндекс Метрика. Номер счётчика — в data-id тега; пустой или незаменённый (%VITE_METRIKA_ID%) — счётчик не грузится.
// Отдельный файл, а не инлайн: CSP сайта не разрешает инлайн-скрипты.
(function () {
  var s = document.currentScript;
  var id = Number(s && s.getAttribute('data-id'));
  if (!id) return;
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = Date.now();
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id;
  document.head.appendChild(tag);
  window.ym(id, 'init', { webvisor: true, clickmap: true, accurateTrackBounce: true, trackLinks: true });
})();
