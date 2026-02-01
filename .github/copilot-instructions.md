# Nàstic Store - AI Coding Agent Instructions

## Project Overview
Nàstic Store is a sports merchandise e-commerce website for Club Gimnàstic de Tarragona. It's a **client-side only application** (no backend) built with vanilla HTML, CSS, and JavaScript, using Tailwind CSS for styling. The app features a product catalog, shopping cart with localStorage persistence, search/filtering, and dark mode toggle.

## Architecture & Critical Patterns

### Frontend Structure (Vanilla Stack)
- **Single-Page App** without framework - all functionality in `script.js`
- **Tailwind CSS + Custom Styles** - [styles.css](styles.css) contains custom animations and CSS variables
- **Data Source** - Products loaded from [productos.json](productos.json) via async fetch (not dynamic; requires manual updates)
- **State Management** - Global variables (`carrito`, `productosDb`, `filtroActual`) + localStorage for persistence

### Key Color System
All colors defined as CSS variables in [styles.css](styles.css):
- `--primary: #94000c` (club burgundy/grana - used for accent, buttons)
- `--grana-accent: #ce8d92` (lighter burgundy - price text)
- `--background-dark: #121212`, `--card-dark: #1F1F1F` (dark mode)
- `--background-light: #f7f7f7` (light mode)

Dark mode toggled via `Ctrl+T` (hardcoded in `inicializarEventos()`) - applies `.dark` class to `html` element.

### Data Flow
1. Page load → `DOMContentLoaded` fires → `cargarProductos()` fetches JSON
2. Products rendered via `renderizarProductos()` (creates DOM from array)
3. User interactions (add to cart, search) update global `carrito` and localStorage
4. Dynamic elements (modals, notifications) created/destroyed in DOM

## Critical Developer Patterns

### Adding Cart Functionality
- **Add to Cart**: `agregarAlCarrito(event, productoId)` - prevents default, checks/increments quantity, saves to localStorage
- **Render Cart**: `mostrarCarrito()` - **dynamically creates modal from scratch** every time (not reused component)
- **Cart Persistence**: `localStorage.setItem('carrito', JSON.stringify(carrito))` - survives page reload

### Search & Filtering
- **Real-time Search**: Input listener on `.input[placeholder*="BUSCAR"]` triggers `filtrarProductos(termino)`
- **Filter Logic**: Case-insensitive substring match on `nombre` + `descripcion` fields
- **Categories**: Hardcoded category buttons (`equipaciones`, `entrenamiento`, `accesorios`)
- **Reset**: Empty search string re-renders all products (no visual "clear" button)

### Product Rendering
Products rendered dynamically with **hover animations** (note pattern in [script.js](script.js#L61-L77)):
```javascript
// Hover overlay with "Añadir" button - appears on group-hover:translate-y-0
// Link wraps card with `producto-detalle.html?id={id}` for future detail pages
```

### Element Selectors
- Cart modal: `.modal-carrito` (custom class added dynamically)
- Cart button: `.material-symbols-outlined` contains `shopping_bag` text (icon-based selection)
- Account button: `.material-symbols-outlined` contains `person` text
- Search input: `input[placeholder*="BUSCAR"]` (partial match)
- Product grid: `.flex.overflow-x-auto.gap-6.custom-scrollbar` (carousel) or `#productosGrid` (collection pages)

## File-Specific Knowledge

### [script.js](script.js) - Main Logic Hub
- Global state at top: `carrito`, `productosDb`, `filtroActual`
- Event binding happens in `inicializarEventos()` - NOT in HTML (no inline onclick except dynamic content)
- Product JSON fetch is async; error handling logs to console
- Modal creation pattern: create div, set innerHTML with template literals, append to body

### [productos.json](productos.json) - Product Schema
Required fields per product:
```json
{
  "id": number,
  "nombre": "string",
  "categoria": "equipaciones|entrenamiento|accesorios",
  "precio": number,
  "imagen": "string (local path or full URL)",
  "descripcion": "string",
  "tallas": ["array of sizes"],
  "stock": number,
  "nuevo": boolean
}
```
**Add/modify products here, then refresh page** - no admin UI.

### [index.html](index.html) - Main Page Structure
- Tailwind config embedded in `<script id="tailwind-config">` (not in config file)
- Custom Epilogue font from Google Fonts
- Material Symbols icons for actions (shopping_bag, person, etc.)
- Two product layouts: carousel (home) + grid (colección pages)

### [styles.css](styles.css) - Custom Styling
- Animations: `slideInUp`, `fadeIn`, `pulse-custom` (defined but usage in Tailwind classes)
- Custom scrollbar: `.custom-scrollbar` hides scrollbars (used on carousels)
- Smooth scroll: `scroll-behavior: smooth` on html

## Conventions & Gotchas

### Spanish Naming
- Function names are **Spanish** (`agregarAlCarrito`, `cargarProductos`, `eliminarDelCarrito`) - maintain this pattern
- UI text is in **Spanish** - "Añadir", "Carrito", "BUSCAR"

### Modal Pattern
Modals (cart, notifications) are **created fresh, not toggled** - always remove existing before creating new.
Click outside modal closes it via event delegation.

### localStorage Keys
- `"carrito"` - stringified array of cart items with `id`, `nombre`, `precio`, `cantidad`, etc.
- No other localStorage keys currently used

### Product Images
Mix of **local paths** (`images/camiseta-doble.jpeg`) and **external URLs** (Google Drive links) - both work via CSS `background-image`.

## Common Tasks

### Adding a Feature
1. Attach event listeners in `inicializarEventos()` (don't use inline handlers)
2. Separate concern into new function (e.g., `agregarAlFavoritos()`)
3. Update global state + localStorage if persistent
4. For UI updates: use `renderizarProductos()` pattern or create modal dynamically

### Extending Product Data
Edit [productos.json](productos.json) - add fields to schema, handle in `renderizarProductos()` template literal.

### Styling Changes
Use Tailwind utility classes in HTML/JS. For custom animations/colors, update CSS variables in [styles.css](styles.css).

## Known Limitations & Future Work
- No backend/database - static JSON only
- No payment gateway integrated
- No user authentication (login button is placeholder)
- No wishlist feature yet
- Cart persists only on same device (no cloud sync)
- See [DESARROLLO.md](DESARROLLO.md) for full roadmap

## Running Locally
```bash
# Python 3
python -m http.server 8000

# OR Node.js
npx http-server

# Then visit: http://localhost:8000
```

## Version & Contact
- **Version**: 1.0.0 (Jan 2026)
- **Team**: Nàstic Store Team
- **Club Site**: https://www.nasticdetarragona.com
