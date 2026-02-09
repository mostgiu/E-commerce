# E-Commerce React Application - AI Coding Instructions

## Project Overview
This is a React + Vite e-commerce application using the Fake Store API (`ecommerce.routemisr.com`). The app features product browsing, shopping cart functionality, user authentication, and brand/category filtering.

**Tech Stack:**
- React 19.2 + Vite (Rolldown) with HMR
- Routing: React Router v7 with protected routes
- State Management: Redux Toolkit (ProductSlice) + Context API (TokenContext, CartContext)
- Styling: Tailwind CSS v4 + CSS Modules per component
- UI: Flowbite, react-slick carousel, react-hot-toast notifications
- Data Fetching: Axios + React Query (TanStack Query)
- Forms: Formik + Yup validation
- Icons: FontAwesome

**Build Commands:**
```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run lint      # ESLint check
npm run preview   # Preview production build
```

---

## Architecture & Critical Patterns

### Component Structure
**Folder Pattern:** `/src/components/{ComponentName}/{ComponentName}.jsx` + `{ComponentName}.module.css`
- All components use CSS modules for scoped styling (exception: `Navbar.css` is global)
- Each component is self-contained in its own folder
- Example: `src/components/Cart/Cart.jsx` + `Cart.module.css`

**Layout Hierarchy:**
- `App.jsx` → `Layout` (navbar + `<Outlet/>` + footer) → Route children
- All page routes render as children of `Layout` via React Router `<Outlet/>`
- Container padding: `container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl`

### Authentication & Protected Routes
**Dual Protection Layers:**
1. **ProtectedRoutes:** Redirects unauthenticated users to `/login` (checks `localStorage.getItem("userToken")`)
2. **ProtectedAuth:** Redirects authenticated users away from `/login` and `/register` to home

**Token Management:**
- Token stored in `localStorage.userToken`
- `TokenContext` provides `{token, setToken}` globally
- `CartContext` reads token from localStorage for API headers: `{ token: localStorage.getItem("userToken") }`

**Routing Example (from App.jsx):**
```jsx
{ path: "cart", element: <ProtectedRoutes><Cart /></ProtectedRoutes> },
{ path: "login", element: <ProtectedAuth><Login /></ProtectedAuth> },
```

### State Management (Hybrid Approach)

**Context API (Persistent Data):**
- `TokenContext`: User authentication token
- `CartContext`: Cart operations (getToCart, addToCart, removeFromCart) + counts/totals

**Redux (Product Data):**
- `ProductSlice`: counter, products[], brands[] (minimal - mostly unused)
- Store: `productRed` reducer
- Usage in components: `useSelector((state) => state.productRed)`

⚠️ **Note:** Redux setup is minimal; consider consolidating cart operations into Redux if growing.

### API Integration Pattern
**Base URL:** `https://ecommerce.routemisr.com/api/v1/`

**Headers Template (from CartContext):**
```javascript
let headers = {
  token: localStorage.getItem("userToken"),
};
```

**Error Handling:** Axios calls use `.then()/.catch()` (not async/await); errors logged as responses.
**Notifications:** `react-hot-toast` for success messages: `toast.success(message, { duration: 1000 })`

### Component Provider Nesting (main.jsx)
**Order matters for context access:**
```jsx
<TokenContextProvider>
  <ReduxProvider>
    <CartContextProvider>
      <App />
    </CartContextProvider>
  </ReduxProvider>
</TokenContextProvider>
```
TokenContext must wrap Redux → CartContext to access token for API calls.

---

## Development Workflows

### Adding a New Page
1. Create component folder: `src/components/{PageName}/{PageName}.jsx` + `.module.css`
2. Add route in `App.jsx` router config (wrap with `<ProtectedRoutes>` if auth-required)
3. Import Layout automatically provides navbar/footer via `<Outlet/>`
4. Use Tailwind for base layout, CSS Modules for component-specific styles

### Fetching Data
- Use Axios with token headers for authenticated endpoints
- Wrap queries with React Query for caching: `useQuery()` (devtools available at bottom-right in dev)
- Toast errors/success with `react-hot-toast`

### Styling Guidelines
- **Tailwind first** for layout, spacing, responsive (md:, sm: breakpoints)
- **CSS Modules** for component states, animations, or design-system consistency
- Navbar exception: Uses global `Navbar.css`

### Debugging
- React Query DevTools visible in dev mode (bottom-right corner)
- ESLint config: `eslint.config.js` (basic React + hooks rules)
- Redux DevTools available via Redux Toolkit integration

---

## Common Pitfalls & Conventions

1. **Token Access:** Always use `localStorage.getItem("userToken")` directly in Axios headers; don't rely on stale context values
2. **Cart State:** CartContext updates both `noOfCartItems` and `totalCartPrice` on each API call
3. **Route Parameters:** Use format `/:id/:categoryName` (e.g., ProductDetails route)
4. **Component Naming:** Match filename and export name (e.g., `Protectedroutes.jsx` - note lowercase 'routes')
5. **CSS Modules:** Import as `import Style from './Component.module.css'` and use `Style.className`

---

## File Reference Guide

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Router config, provider setup, entry point logic |
| `src/components/Layout/Layout.jsx` | Main wrapper with navbar + outlet + footer |
| `src/components/Context/TokenContext.jsx` | Auth token provider |
| `src/components/Context/CartContext.jsx` | Cart API methods + state |
| `src/components/Redux/ProductSlice.js` | Redux slice (minimal usage) |
| `src/components/ProtectedRoutes/Protectedroutes.jsx` | Auth guard for protected pages |
| `src/components/ProtectedAuth/ProtectedAuth.jsx` | Auth guard for login/register pages |
| `tailwind.config.js` | Tailwind customization |
| `vite.config.js` | Vite + React + Tailwind plugins |

