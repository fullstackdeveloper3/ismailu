#!/usr/bin/env node
/**
 * generate-pages.js — Generates all menu item detail HTML pages
 * Run: node generate-pages.js
 */
const fs = require('fs');
const path = require('path');

// ── Category ID → directory mapping (matches item-links.js) ──
const idToDir = {
  softDrinks: 'soft-drinks',
  bancake:    'pancakes',
  travel:     'trifle'
};

// ── Slugify (identical to item-links.js) ──
function slugify(text) {
  const map = {
    'ا':'a','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
    'د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s',
    'ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q',
    'ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y',
    'ة':'a','ى':'a','أ':'a','إ':'a','آ':'a','ئ':'y','ؤ':'w',
    ' ':'-'
  };
  return text.trim()
    .split('')
    .map(c => map[c] !== undefined ? map[c] : c)
    .join('')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}

// ── Menu Data (copied from index.html — frozen, not modified) ──
const menuData = [
  {
    id: 'coffee',
    title: 'قهوة',
    items: [
      { name: 'قهوة بابا', small: '2000', large: '3500' },
      { name: 'قهوة جكليتية', small: '2000', large: '3500' },
      { name: 'قهوة عربية مرة', small: '1500', large: '2000' },
      { name: 'قهوة عربية بالعسل', small: '1500', large: '2000' },
      { name: 'قهوة تركية (سادة - وسط - حلو)', small: '1500', large: '2000' },
      { name: 'قهوة تركية بالبندق', small: '2000', large: '3000' },
      { name: 'قهوة تركية بالفستق', small: '2000', large: '3000' },
      { name: 'قهوة تركية بالقزوان', small: '2000', large: '3000' },
      { name: 'قهوة تركية بالجوز', small: '2000', large: '3000' },
      { name: 'قهوة تركية بالجوز والعسل', small: '2000', large: '3000' }
    ]
  },
  {
    id: 'cold-drinks',
    title: 'مشروبات باردة',
    items: [
      { name: 'ايس بابا', small: '3000', large: '4500' },
      { name: 'ايس جكليت', small: '3000', large: '4500' },
      { name: 'ايس لوتس', small: '3000', large: '4000' },
      { name: 'ايس اوريو', small: '3000', large: '4500' },
      { name: 'ايس كابتشينو', small: '2500', large: '3500' },
      { name: 'ايس بندق', small: '2500', large: '3500' },
      { name: 'ايس فستق حلبي', small: '2500', large: '3500' },
      { name: 'ايس جوز', small: '2500', large: '3500' },
      { name: 'ايس بالجوز والعسل', small: '3000', large: '4000' }
    ]
  },
  {
    id: 'hot-drinks',
    title: 'مشروبات ساخنة',
    items: [
      { name: 'هوت لوتس', price: '2500' },
      { name: 'هوت اوريو', price: '2500' },
      { name: 'كابتشينو', price: '1500' },
      { name: 'نسكافيه', price: '1500' },
      { name: 'حليب', price: '1000' },
      { name: 'حليب بالعسل', price: '1500' },
      { name: 'جاي', price: '500' },
      { name: 'حامض', price: '500' }
    ]
  },
  {
    id: 'juices',
    title: 'عصائر طبيعية',
    items: [
      { name: 'عصير بابا ', price: '3000' },
      { name: 'موز نوتيلا', price: '3000' },
      { name: 'موز لوتس', price: '3000' },
      { name: 'موز أريو', price: '3000' },
      { name: 'موز فراولة', price: '2000' },
      { name: 'موز ', price: '2000' },
      { name: 'بطيخ', price: '2000' },
      { name: 'برتقال', price: '2000' },
      { name: 'ليمون', price: '2000' },
      { name: 'تين', price: '3000' },
      { name: 'ليمون نعناع', price: '2000' },
      { name: 'برتقال ليمون', price: '2000' },
      { name: 'موز مكسرات والعسل', price: '4000' }
    ]
  },
  {
    id: 'mojito',
    title: 'موهيتو',
    items: [
      { name: 'خلطة بابا', price: '2000' },
      { name: 'خلطة 13', price: '2000' },
      { name: 'خلطة 14', price: '2000' },
      { name: 'بلو كوراساو', price: '2000' },
      { name: 'بلوبيري', price: '2000' },
      { name: 'فراولة', price: '2000' },
      { name: 'ليمون نعناع', price: '2000' },
      { name: 'توت احمر بري', price: '2000' },
      { name: 'كيوي', price: '2000' },
      { name: 'كرز', price: '2000' },
      { name: 'عنب', price: '2000' },
      { name: 'رمان', price: '2000' },
      { name: 'اناناس', price: '2000' },
      { name: 'خوخ', price: '2000' },
      { name: 'تفاح اخضر', price: '2000' },
      { name: 'برتقال', price: '2000' },
      { name: 'مانكو', price: '2000' },
      { name: 'ركي', price: '2000' },
      { name: 'علكة', price: '2000' },
      { name: 'توت مشكل', price: '2000' },
      { name: 'توت راز بيري', price: '2000' },
      { name: 'زنجبيل', price: '2000' }
    ]
  },
  {
    id: 'mexican',
    title: 'مكسيكي',
    items: [
      { name: 'خلطة بابا', price: '2500' },
      { name: 'خلطة 13', price: '2500' },
      { name: 'خلطة 14', price: '2500' },
      { name: 'ليمون', price: '2500' },
      { name: 'ليمون نعناع', price: '2500' },
      { name: 'بلو كوراساو', price: '2500' },
      { name: 'بلوبيري', price: '2500' },
      { name: 'فراولة', price: '2500' },
      { name: 'توت احمر بري', price: '2500' },
      { name: 'كيوي', price: '2500' },
      { name: 'كرز', price: '2500' },
      { name: 'عنب', price: '2500' },
      { name: 'رمان', price: '2500' },
      { name: 'اناناس', price: '2500' },
      { name: 'خوخ', price: '2500' },
      { name: 'تفاح اخضر', price: '2500' },
      { name: 'برتقال', price: '2500' },
      { name: 'مانكو', price: '2500' },
      { name: 'ركي', price: '2500' },
      { name: 'علكة', price: '2500' },
      { name: 'توت مشكل', price: '2500' },
      { name: 'توت راز بيري', price: '2500' },
      { name: 'زنجبيل', price: '2500' }
    ]
  },
  {
    id: 'softDrinks',
    title: 'مشروبات غازية ',
    items: [
      { name: 'بيبسي ', price: '500' },
      { name: 'سفن ', price: '500' },
      { name: 'ديو ', price: '500' },
      { name: 'تايكر  ', price: '1000' },
      { name: 'بيبسي +ثلج', price: '1000' },
      { name: 'سفن +ثلج', price: '1000' },
      { name: 'ديو +ثلج', price: '1000' },
      { name: 'تايكر +ثلج ', price: '1500' }
    ]
  },
  {
    id: 'crepes',
    title: 'كريب',
    items: [
      { name: 'كريب بابا', price: '5000' },
      { name: 'كريب كلاسك', price: '3000' },
      { name: 'كريب فواكة', price: '4000' },
      { name: 'كريب لوتس', price: '4000' },
      { name: 'كريب اوريو', price: '4000' },
      { name: 'كريب بستاشيو ', price: '4000' },
      { name: 'كريب روله فواكة', price: '4000' },
      { name: 'كريب روله بابا', price: '5000' },
      { name: 'كريب فونتشيني', price: '4000' },
      { name: 'كريب فونتشيني فواكة', price: '4000' },
      { name: 'لوتس كريب فونتشيني', price: '4000' },
      { name: 'اوريو كريب فونتشيني', price: '4000' },
      { name: 'بستاشيو كريب فونتشيني', price: '4000' }
    ]
  },
  {
    id: 'waffles',
    title: 'وافل ',
    items: [
      { name: 'وافل بابا', price: '5000' },
      { name: 'وافل كلاسك', price: '3000' },
      { name: 'وافل فواكة', price: '4000' },
      { name: 'وافل لوتس', price: '4000' },
      { name: 'وافل اوريو', price: '4000' },
      { name: 'وافل بستاشيو', price: '4000' }
    ]
  },
  {
    id: 'bancake',
    title: 'بان كيك ',
    items: [
      { name: 'بان كيك بابا', price: '5000' },
      { name: 'بان كيك كلاسك', price: '3000' },
      { name: 'بان كيك فواكة', price: '4000' },
      { name: 'بان كيك لوتس', price: '4000' },
      { name: 'بان كيك اوريو', price: '4000' },
      { name: 'بان كيك بستاشيو', price: '4000' }
    ]
  },
  {
    id: 'travel',
    title: 'ترايفل ',
    items: [
      { name: 'ترايفل سادة', price: '1500' },
      { name: 'ترايفل بالفستق', price: '2000' },
      { name: 'ترايفل بالجوز', price: '2000' }
    ]
  },
  {
    id: 'jerzat',
    title: 'جرزات ',
    items: [
      { name: 'جرزات صغير', price: '2500' },
      { name: 'جرزات كبير', price: '5000' }
    ]
  },
  {
    id: 'shisha',
    title: 'اراكيل',
    items: [
      { name: 'بابا', price: '5000' },
      { name: 'انكليزي', price: '5000' },
      { name: 'علج بطيخ', price: '5000' },
      { name: 'علج نعناع', price: '5000' },
      { name: 'تفاحتين', price: '5000' },
      { name: 'ليمون نعناع', price: '5000' },
      { name: 'سندي', price: '5000' },
      { name: 'امزون', price: '6000' },
      { name: 'سندي طبيعي ', price: '10000' },
      { name: 'اناناس طبيعي', price: '12000' }
    ]
  }
];

// ── HTML Template ──
function buildPage(item, category, dir, slug) {
  const name = item.name.trim();
  const catTitle = category.title.trim();

  let priceHTML;
  if (item.small && item.large) {
    priceHTML = `
        <div class="price-table">
          <div class="price-badge">
            <span class="label">صغير</span>
            <span class="amount">${item.small} <span class="currency">د.ع</span></span>
          </div>
          <div class="price-badge">
            <span class="label">كبير</span>
            <span class="amount">${item.large} <span class="currency">د.ع</span></span>
          </div>
        </div>`;
  } else {
    priceHTML = `
        <div class="price-table">
          <div class="price-badge">
            <span class="label">السعر</span>
            <span class="amount">${item.price} <span class="currency">د.ع</span></span>
          </div>
        </div>`;
  }

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — إسماعيل بابا كافيه</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../../style/menu-item.css">
</head>
<body>

  <div class="ambient-background"></div>

  <a href="../../index.html" class="back-btn" aria-label="العودة للقائمة">
    <span class="back-arrow">&#8592;</span>
    <span class="back-label">القائمة</span>
  </a>

  <main class="detail-wrapper">
    <article class="detail-card liquid-glass">

      <img
        src="../../images/menu/${dir}/${slug}.jpg"
        alt="${name}"
        class="item-hero-image"
        onerror="this.src='../../images/menu/placeholder.jpg'"
      >

      <div class="item-body">

        <span class="item-category-tag">${catTitle}</span>

        <h1 class="item-name">${name}</h1>

        <hr class="item-divider">
${priceHTML}

        <hr class="item-divider">

        <p class="order-prompt">تفضل بالطلب من الكاشير ☕</p>

      </div>

      <img src="../../logo.png" alt="Ismail Baba" class="logo-watermark">

    </article>
  </main>

</body>
</html>
`;
}

// ── Generate ──
const ROOT = __dirname;
let count = 0;
const slugLog = [];

menuData.forEach(category => {
  const dir = idToDir[category.id] || category.id;
  const dirPath = path.join(ROOT, 'menu', dir);

  // Ensure directory exists
  fs.mkdirSync(dirPath, { recursive: true });

  category.items.forEach(item => {
    const slug = slugify(item.name);
    const filePath = path.join(dirPath, slug + '.html');
    const html = buildPage(item, category, dir, slug);

    fs.writeFileSync(filePath, html, 'utf8');
    count++;
    slugLog.push(`${dir}/${slug}.html  ←  ${item.name.trim()}`);
  });
});

console.log(`✓ Generated ${count} detail pages:\n`);
slugLog.forEach(l => console.log('  ' + l));
