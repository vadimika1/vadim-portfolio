// Обои рабочего стола: зелёный холм под синим небом, как привыкли видеть XP. Не оригинальная «Безмятежность»
// (она принадлежит Microsoft), а фото Adrien Olichon с Unsplash по лицензии Unsplash — см. CREDITS.md.

export function Wallpaper() {
  return (
    <img
      className="wallpaper"
      src="/img/wallpaper.webp"
      srcSet="/img/wallpaper-1600.webp 1600w, /img/wallpaper.webp 2560w"
      sizes="100vw"
      alt=""
      decoding="async"
      fetchPriority="high"
    />
  );
}
