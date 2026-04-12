# Vela — Color Palette

All colors use Tailwind v4 built-in scales. No custom hex tokens, no Nuxt UI.

---

## Primary — `stone`

Warm neutral. Used for backgrounds, text, borders, and buttons.

| Token | Usage |
|---|---|
| `stone-50` | Page background |
| `stone-100` | Card / surface background |
| `stone-200` | Borders, dividers |
| `stone-400` | Placeholder text |
| `stone-500` | Muted / secondary text |
| `stone-700` | Hover states |
| `stone-900` | Primary text, buttons |
| `stone-950` | Dark headings, wordmark |

---

## Accent — `amber`

Warm highlight. Used for badges, sale tags, and accent elements.

| Token | Usage |
|---|---|
| `amber-50` | Badge background |
| `amber-100` | Subtle highlight |
| `amber-400` | Accent icons |
| `amber-600` | Accent text, labels |
| `amber-700` | Hover on accent elements |

---

## Success — `emerald`

Used for free shipping banners, stock confirmations, and positive feedback.

| Token | Usage |
|---|---|
| `emerald-50` | Success background |
| `emerald-600` | Success text |
| `emerald-700` | Success dark / hover |

---

## Danger — `red`

Used for out of stock, error states, and destructive actions.

| Token | Usage |
|---|---|
| `red-50` | Error background |
| `red-500` | Error text / icon |
| `red-700` | Error hover |

---

## Quick reference

```html
<!-- Backgrounds -->
<div class="bg-stone-50">Page</div>
<div class="bg-stone-100">Card</div>

<!-- Text -->
<p class="text-stone-900">Primary text</p>
<p class="text-stone-500">Muted text</p>

<!-- Buttons -->
<button class="bg-stone-900 text-white hover:bg-stone-700">Add to cart</button>
<button class="border border-stone-200 text-stone-900 hover:border-stone-900">View details</button>

<!-- Badges -->
<span class="bg-amber-50 text-amber-600">Sale</span>
<span class="bg-stone-900 text-white">New</span>

<!-- Feedback -->
<div class="bg-emerald-50 text-emerald-700">Free shipping applied</div>
<div class="bg-red-50 text-red-500">Out of stock</div>
```
