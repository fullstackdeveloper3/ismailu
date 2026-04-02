# RPD — Ismail Baba Kahvesi: Menu Item Detail Pages
**Requirement Prompt Document**  
**Project:** إسماعيل بابا كافيه — Digital Menu  
**Version:** 1.0  
**Date:** 2026-04-02  
**Status:** Ready for Development

---

## 1. Executive Summary

When a customer taps any item on the existing menu (`index.html`), the browser navigates to a dedicated HTML page that presents a **large photo** of the item, its full name, price(s), category label, and a back-button to return to the main menu.

The main `index.html` file **must not be structurally altered**. Only one surgical addition is permitted: a single `<script src="assets/js/item-links.js"></script>` tag injected just before `</body>` so that menu items become tappable links without touching any existing markup, style, or data.

---

## 2. Hard Constraints

| # | Constraint |
|---|---|
| C-1 | `index.html` layout, styles, and `menuData` array are **frozen** — no edits except the one script tag below. |
| C-2 | All new HTML pages live under `menu/` directory. |
| C-3 | All shared CSS lives in exactly one file: `style/menu-item.css`. Individual pages **must not** contain inline `<style>` blocks. |
| C-4 | The visual language (colors, glass effect, fonts) must match `index.html` exactly — same CSS variables, same font stack. |
| C-5 | Every page must be RTL (`dir="rtl"` + `lang="ar"`). |
| C-6 | All pages must be fully responsive (mobile-first, 320 px → 1440 px). |

---

## 3. Deliverable File Structure

```
/ (project root)
│
├── index.html                  ← FROZEN (only add 1 script tag)
├── logo.png
│
├── assets/
│   └── js/
│       └── item-links.js       ← NEW: adds click-navigation to existing items
│
├── style/
│   └── menu-item.css           ← NEW: unified stylesheet for ALL detail pages
│
├── images/
│   └── menu/
│       ├── placeholder.jpg     ← fallback image (warm coffee-shop mood)
│       ├── coffee/
│       │   ├── qahwa-baba.jpg
│       │   ├── qahwa-choco.jpg
│       │   └── ...             ← one image per item (see §6)
│       ├── cold-drinks/
│       ├── hot-drinks/
│       ├── juices/
│       ├── mojito/
│       ├── mexican/
│       ├── soft-drinks/
│       ├── crepes/
│       ├── waffles/
│       ├── pancakes/
│       ├── trifle/
│       ├── jerzat/
│       └── shisha/
│
└── menu/
    ├── coffee/
    │   ├── qahwa-baba.html
    │   ├── qahwa-choco.html
    │   └── ...
    ├── cold-drinks/
    ├── hot-drinks/
    ├── juices/
    ├── mojito/
    ├── mexican/
    ├── soft-drinks/
    ├── crepes/
    ├── waffles/
    ├── pancakes/
    ├── trifle/
    ├── jerzat/
    └── shisha/
```

> **File Naming Convention:** Arabic item name → transliterate to lowercase Latin, replace spaces with hyphens, strip special characters.  
> Example: `قهوة بابا` → `qahwa-baba`, `ايس جكليت` → `ice-choco`

---

## 4. The One Permitted Change to `index.html`

Add **exactly this one line** at the very end of `<body>`, just before `</body>`:

```html
<script src="assets/js/item-links.js"></script>
```

Nothing else in `index.html` is touched.

---

## 5. `assets/js/item-links.js` — Navigation Injection Script

### Purpose
After the existing `DOMContentLoaded` render engine has built the `<article class="menu-item">` elements, this script queries all of them and wires a click event that navigates to the correct detail page.

### Logic Specification

```
On DOMContentLoaded (with a small setTimeout to let the render engine finish):
  1. Query all elements matching: article.menu-item
  2. For each article:
     a. Find its parent <section> to read the category id (section.id)
     b. Read the item name from section > article > div.item-info > h3 (innerText)
     c. Slugify the name: lowercase, replace spaces → hyphens, remove non-alphanumeric
     d. Build the relative URL: "menu/{categoryId}/{slug}.html"
     e. Attach cursor:pointer style to the article
     f. Attach a 'click' event listener: window.location.href = url
  3. Also add a hover ripple class to each article for visual feedback
```

### Slug Function (reference implementation)

```js
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
    .map(c => map[c] ?? c)
    .join('')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}
```

---

## 6. `style/menu-item.css` — Unified Stylesheet

### 6.1 CSS Variables to Import (Must Match index.html)

```css
:root {
  --font-main:       'Cairo', 'Outfit', sans-serif;
  --brand-brown:     #381A0F;
  --brand-orange:    #F39C12;
  --brand-cream:     #FDF5E6;
  --text-primary:    #2A1108;
  --text-secondary:  #5C3A21;
  --glass-blur:      blur(25px);
  --glass-bg:        linear-gradient(135deg, rgba(253,245,230,0.85) 0%, rgba(243,156,18,0.2) 100%);
  --glass-border:    linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,156,18,0.4) 100%);
  --glass-shadow:    0 12px 30px rgba(42,17,8,0.25);
  --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 6.2 Required CSS Selectors & Behaviour

| Selector | Description |
|---|---|
| `body` | Dark `#1A0A05` background, RTL, Cairo font, full viewport |
| `.ambient-background` | Fixed full-viewport coffee background image (same as index.html), `brightness(0.6)` |
| `.back-btn` | Floating back arrow (top-right in RTL), liquid-glass pill, `←` icon, links to `../../index.html` |
| `.detail-card` | Centered card, liquid-glass style, max-width 480 px, border-radius 24 px |
| `.item-hero-image` | Full-width image inside card, aspect-ratio 4/3, object-fit cover, border-radius 20px 20px 0 0 |
| `.item-hero-image.placeholder` | Same dimensions, background gradient showing a warm coffee-shop illustration or icon |
| `.item-body` | Padding 28px, flex column, gap 16px |
| `.item-category-tag` | Small pill: background `rgba(243,156,18,0.2)`, border `1px solid var(--brand-orange)`, font-size 0.8rem |
| `.item-name` | Font-size 2rem, font-weight 900, color `var(--brand-brown)` |
| `.price-table` | Flex row, gap 16px, justify-content center |
| `.price-badge` | Flex column, background `rgba(56,26,15,0.07)`, border-radius 14px, padding 12px 20px |
| `.price-badge .label` | Font-size 0.75rem, color `var(--text-secondary)`, margin-bottom 4px |
| `.price-badge .amount` | Font-size 1.6rem, font-weight 700, color `var(--brand-orange)` |
| `.currency` | Font-size 0.9rem, font-weight 600, color `var(--text-secondary)`, appended after amount |
| `.item-divider` | Thin `1px dashed rgba(56,26,15,0.2)` horizontal rule |
| `.order-prompt` | Centered text: "تفضل بالطلب من الكاشير" in italic, text-secondary, font-size 0.95rem |
| `.logo-watermark` | Small logo at bottom center, 60px diameter, opacity 0.6 |

### 6.3 Animation Requirements

```
Page load:
  - .detail-card fades in + slides up from translateY(30px) over 0.5s ease-out

.item-hero-image:
  - On hover: scale(1.02) with overflow hidden on parent — creates subtle zoom

.back-btn:
  - On hover: translateX(-4px) — nudges left (RTL direction hint)

.price-badge:
  - On page load: stagger-in with 0.1s delay between badges
```

### 6.4 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≤ 480 px` | Card is full-width, 0 horizontal margin, border-radius only on top |
| `481–768 px` | Card centered, 24px side margins |
| `≥ 769 px` | Card max-width 480px, vertically centered in viewport |

---

## 7. Menu Item HTML Page Template

Every page in `menu/{category}/{slug}.html` follows this exact structure:

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{ITEM_NAME} — إسماعيل بابا كافيه</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

  <!-- UNIFIED STYLESHEET — path is relative from menu/{category}/ -->
  <link rel="stylesheet" href="../../style/menu-item.css">
</head>
<body>

  <!-- AMBIENT BACKGROUND (same as index.html) -->
  <div class="ambient-background"></div>

  <!-- BACK BUTTON -->
  <a href="../../index.html" class="back-btn" aria-label="العودة للقائمة">
    <span class="back-arrow">&#8592;</span>
    <span class="back-label">القائمة</span>
  </a>

  <!-- MAIN DETAIL CARD -->
  <main class="detail-wrapper">
    <article class="detail-card liquid-glass">

      <!-- ITEM PHOTO -->
      <img
        src="../../images/menu/{CATEGORY_ID}/{SLUG}.jpg"
        alt="{ITEM_NAME}"
        class="item-hero-image"
        onerror="this.src='../../images/menu/placeholder.jpg'"
      >

      <div class="item-body">

        <!-- CATEGORY TAG -->
        <span class="item-category-tag">{CATEGORY_TITLE}</span>

        <!-- ITEM NAME -->
        <h1 class="item-name">{ITEM_NAME}</h1>

        <hr class="item-divider">

        <!-- PRICE TABLE (use variant A or B below) -->

        <!-- VARIANT A: Single price -->
        <div class="price-table">
          <div class="price-badge">
            <span class="label">السعر</span>
            <span class="amount">{PRICE} <span class="currency">د.ع</span></span>
          </div>
        </div>

        <!-- VARIANT B: Small / Large price -->
        <div class="price-table">
          <div class="price-badge">
            <span class="label">صغير</span>
            <span class="amount">{SMALL_PRICE} <span class="currency">د.ع</span></span>
          </div>
          <div class="price-badge">
            <span class="label">كبير</span>
            <span class="amount">{LARGE_PRICE} <span class="currency">د.ع</span></span>
          </div>
        </div>

        <hr class="item-divider">

        <!-- FOOTER PROMPT -->
        <p class="order-prompt">تفضل بالطلب من الكاشير ☕</p>

      </div><!-- /.item-body -->

      <!-- LOGO WATERMARK -->
      <img src="../../logo.png" alt="Ismail Baba" class="logo-watermark">

    </article>
  </main>

</body>
</html>
```

> ⚠️ **Placeholders to replace per page:**  
> `{ITEM_NAME}`, `{CATEGORY_ID}`, `{CATEGORY_TITLE}`, `{SLUG}`, `{PRICE}` / `{SMALL_PRICE}` / `{LARGE_PRICE}`

---

## 8. Complete Item Inventory & Page Map

### Category: قهوة (`coffee/`)

| Item Name (AR) | Slug | Price Type | Small | Large |
|---|---|---|---|---|
| قهوة بابا | `qahwa-baba` | small/large | 2000 | 3500 |
| قهوة جكليتية | `qahwa-choco` | small/large | 2000 | 3500 |
| قهوة عربية مرة | `qahwa-arabia-murra` | small/large | 1500 | 2000 |
| قهوة عربية بالعسل | `qahwa-arabia-honey` | small/large | 1500 | 2000 |
| قهوة تركية سادة | `qahwa-turkiya-sada` | small/large | 1500 | 2000 |
| قهوة تركية بالبندق | `qahwa-turkiya-bunduq` | small/large | 2000 | 3000 |
| قهوة تركية بالفستق | `qahwa-turkiya-fustuq` | small/large | 2000 | 3000 |
| قهوة تركية بالقزوان | `qahwa-turkiya-qazwan` | small/large | 2000 | 3000 |
| قهوة تركية بالجوز | `qahwa-turkiya-jawz` | small/large | 2000 | 3000 |
| قهوة تركية بالجوز والعسل | `qahwa-turkiya-jawz-honey` | small/large | 2000 | 3000 |

### Category: مشروبات باردة (`cold-drinks/`)

| Item Name (AR) | Slug | Price Type | Small | Large |
|---|---|---|---|---|
| ايس بابا | `ice-baba` | small/large | 3000 | 4500 |
| ايس جكليت | `ice-choco` | small/large | 3000 | 4500 |
| ايس لوتس | `ice-lotus` | small/large | 3000 | 4000 |
| ايس اوريو | `ice-oreo` | small/large | 3000 | 4500 |
| ايس كابتشينو | `ice-cappuccino` | small/large | 2500 | 3500 |
| ايس بندق | `ice-bunduq` | small/large | 2500 | 3500 |
| ايس فستق حلبي | `ice-fustuq` | small/large | 2500 | 3500 |
| ايس جوز | `ice-jawz` | small/large | 2500 | 3500 |
| ايس بالجوز والعسل | `ice-jawz-honey` | small/large | 3000 | 4000 |

### Category: مشروبات ساخنة (`hot-drinks/`)

| Item Name (AR) | Slug | Price | 
|---|---|---|
| هوت لوتس | `hot-lotus` | 2500 |
| هوت اوريو | `hot-oreo` | 2500 |
| كابتشينو | `cappuccino` | 1500 |
| نسكافيه | `nescafe` | 1500 |
| حليب | `halib` | 1000 |
| حليب بالعسل | `halib-honey` | 1500 |
| جاي | `chai` | 500 |
| حامض | `hamid` | 500 |

### Category: عصائر طبيعية (`juices/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| عصير بابا | `aseer-baba` | 3000 |
| موز نوتيلا | `moz-nutella` | 3000 |
| موز لوتس | `moz-lotus` | 3000 |
| موز أوريو | `moz-oreo` | 3000 |
| موز فراولة | `moz-frawla` | 2000 |
| موز | `moz` | 2000 |
| بطيخ | `bateekh` | 2000 |
| برتقال | `burtuqal` | 2000 |
| ليمون | `lamoon` | 2000 |
| تين | `teen` | 3000 |
| ليمون نعناع | `lamoon-naanaa` | 2000 |
| برتقال ليمون | `burtuqal-lamoon` | 2000 |
| موز مكسرات والعسل | `moz-mukasarat-honey` | 4000 |

### Category: موهيتو (`mojito/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| خلطة بابا | `khlata-baba` | 2000 |
| خلطة 13 | `khlata-13` | 2000 |
| خلطة 14 | `khlata-14` | 2000 |
| بلو كوراساو | `blue-curacao` | 2000 |
| بلوبيري | `blueberry` | 2000 |
| فراولة | `frawla` | 2000 |
| ليمون نعناع | `lamoon-naanaa` | 2000 |
| توت احمر بري | `toot-ahmar` | 2000 |
| كيوي | `kiwi` | 2000 |
| كرز | `karaz` | 2000 |
| عنب | `enab` | 2000 |
| رمان | `rumman` | 2000 |
| اناناس | `ananas` | 2000 |
| خوخ | `khokh` | 2000 |
| تفاح اخضر | `tufah-akhdar` | 2000 |
| برتقال | `burtuqal` | 2000 |
| مانكو | `mango` | 2000 |
| ركي | `raki` | 2000 |
| علكة | `alika` | 2000 |
| توت مشكل | `toot-mushakkal` | 2000 |
| توت راز بيري | `razberry` | 2000 |
| زنجبيل | `zanjabil` | 2000 |

### Category: مكسيكي (`mexican/`)

*(Same item names as Mojito, price 2500 each — same slug convention)*

### Category: مشروبات غازية (`soft-drinks/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| بيبسي | `pepsi` | 500 |
| سفن | `seven-up` | 500 |
| ديو | `dew` | 500 |
| تايكر | `tiger` | 1000 |
| بيبسي+ثلج | `pepsi-ice` | 1000 |
| سفن+ثلج | `seven-up-ice` | 1000 |
| ديو+ثلج | `dew-ice` | 1000 |
| تايكر+ثلج | `tiger-ice` | 1500 |

### Category: كريب (`crepes/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| كريب بابا | `crepe-baba` | 5000 |
| كريب كلاسك | `crepe-classic` | 3000 |
| كريب فواكة | `crepe-fruits` | 4000 |
| كريب لوتس | `crepe-lotus` | 4000 |
| كريب اوريو | `crepe-oreo` | 4000 |
| كريب بستاشيو | `crepe-pistachio` | 4000 |
| كريب روله فواكة | `crepe-rolo-fruits` | 4000 |

### Category: وافل (`waffles/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| وافل بابا | `waffle-baba` | 5000 |
| وافل كلاسك | `waffle-classic` | 3000 |
| وافل فواكة | `waffle-fruits` | 4000 |
| وافل لوتس | `waffle-lotus` | 4000 |
| وافل اوريو | `waffle-oreo` | 4000 |
| وافل بستاشيو | `waffle-pistachio` | 4000 |

### Category: بان كيك (`pancakes/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| بان كيك بابا | `pancake-baba` | 5000 |
| بان كيك كلاسك | `pancake-classic` | 3000 |
| بان كيك فواكة | `pancake-fruits` | 4000 |
| بان كيك لوتس | `pancake-lotus` | 4000 |
| بان كيك اوريو | `pancake-oreo` | 4000 |
| بان كيك بستاشيو | `pancake-pistachio` | 4000 |

### Category: ترايفل (`trifle/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| ترايفل سادة | `trifle-sada` | 1500 |
| ترايفل بالفستق | `trifle-fustuq` | 2000 |
| ترايفل بالجوز | `trifle-jawz` | 2000 |

### Category: جرزات (`jerzat/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| جرزات صغير | `jerzat-small` | 2500 |
| جرزات كبير | `jerzat-large` | 5000 |

### Category: اراكيل (`shisha/`)

| Item Name (AR) | Slug | Price |
|---|---|---|
| بابا | `shisha-baba` | 5000 |
| انكليزي | `shisha-english` | 5000 |
| علج بطيخ | `shisha-watermelon` | 5000 |
| علج نعناع | `shisha-mint` | 5000 |
| تفاحتين | `shisha-double-apple` | 5000 |
| ليمون نعناع | `shisha-lemon-mint` | 5000 |
| سندي | `shisha-sandy` | 5000 |
| امزون | `shisha-amazon` | 6000 |
| سندي طبيعي | `shisha-sandy-natural` | 10000 |
| اناناس طبيعي | `shisha-ananas-natural` | 12000 |

---

## 9. Image Requirements

### 9.1 Specifications Per Image

| Property | Value |
|---|---|
| Format | JPEG or WebP |
| Dimensions | Minimum 800 × 600 px |
| Aspect Ratio | 4:3 (landscape) |
| Quality | 80–85% JPEG compression |
| Mood | Warm, coffee-shop, overhead or 45° angle shot |
| Background | Dark wood or cream fabric surfaces preferred |

### 9.2 Placeholder Image

A single `images/menu/placeholder.jpg` must exist as fallback. It should be:
- A warm, moody coffee-shop still-life
- Overlaid with the item name in Arabic if no real photo is available
- Branded with the Ismail Baba color palette (orange + brown tones)

> Developer note: All `<img>` tags use `onerror="this.src='../../images/menu/placeholder.jpg'"` so missing images degrade gracefully without broken icons.

---

## 10. Back-Button Behavior

| Trigger | Action |
|---|---|
| Click `.back-btn` | `window.location.href = '../../index.html'` |
| Browser back gesture | Native browser back — no override needed |

The back button must:
- Be **always visible** (fixed position, z-index 200)
- Not scroll with content
- Be placed **top-right** (RTL: right = start of line)
- Show both arrow icon AND label "القائمة"

---

## 11. Accessibility Requirements

- Every `<img>` has a meaningful `alt` attribute in Arabic
- `.back-btn` has `aria-label="العودة للقائمة"`
- `<main>` landmark used for page body
- Sufficient color contrast (WCAG AA minimum)
- Tappable elements minimum 44 × 44 px touch targets

---

## 12. Developer Build Notes

1. **Total HTML files to create:** ~95 pages (sum of all items in §8)
2. **Recommended approach:** Write a Node.js or Python build script that reads `menuData` from `index.html`, iterates all items, and generates the HTML files from the template in §7 automatically. This avoids 95 manual copies.
3. **CSS path depth:** All pages are two directories deep (`menu/{category}/`), so all relative paths use `../../` prefix.
4. **Logo path:** `../../logo.png`
5. **CSS path:** `../../style/menu-item.css`
6. **Script path in `index.html`:** `assets/js/item-links.js` (one directory from root)

---

## 13. Out of Scope

- Online ordering / cart functionality
- Server-side rendering or databases
- Authentication
- Any modification to `menuData` in `index.html`
- Admin panel for image upload

---

*End of RPD — Ismail Baba Kahvesi Menu Item Pages*
