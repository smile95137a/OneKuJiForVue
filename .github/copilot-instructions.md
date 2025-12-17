# Copilot Instructions for OneKuJi Vue Project

## Project Overview

OneKuJi (再來一抽) is a **Taiwan-based online lottery/gacha e-commerce platform** built with Vue 3, TypeScript, Vite, and Pinia. The platform supports multiple product types: 一番賞 (Ichiban Kuji), 扭蛋 (Gacha), and 盲盒 (Blind Box).

## Architecture

### Dual API System
The app connects to **two separate backends**:
- **Frontend API** (`VITE_BASE_API_URL` - port 8081): User-facing operations via `src/services/frontend/FrontAPI.ts`
- **Backend API** (`VITE_BASE_API_URL2` - port 8080): Admin operations via `src/services/backend/BackendAPI.ts`

Both use Axios with JWT Bearer token interceptors. Tokens are stored differently:
- Frontend: `ftoken` / `fuser` keys in localStorage
- Admin: `atoken` / `auser` keys in localStorage

### State Management (Pinia Stores)
```
src/stores/
├── authStore.ts      # Frontend user authentication
├── adminStore.ts     # Admin authentication
├── cartStore.ts      # Shopping cart state
├── dialogStore.ts    # Global dialog management (composable pattern)
├── loadingStore.ts   # Loading mask state
├── userstore.ts      # User profile data
└── slidebarStore.ts  # UI sidebar state
```

### Route Guards
Routes use meta flags for authentication:
- `requiresAuth: true` → Frontend user login required (redirects to `/login`)
- `requiresAdminAuth: true` → Admin login required (redirects to `/admin-login`)

## Key Conventions

### Service Layer Pattern
Services are split by domain under `src/services/{frontend|backend}/`:
```typescript
// Example: src/services/frontend/productService.ts
import { api } from './FrontAPI';
const basePath = '/product';

export const getProductById = async (id: number): Promise<ApiResponse<IProduct>> => {
  const response = await api.get(`${basePath}/query/${id}`);
  return response.data;
};
```

### Dialog System (Composable Pattern)
Dialogs use hooks in `src/hook/` that return reactive state. The `dialogStore` aggregates all dialog hooks:
```typescript
// Opening a dialog
const dialogStore = useDialogStore();
await dialogStore.openConfirmDialog({ customClass: 'custom' }, { count: 5, total: 100, ... });
```

### TypeScript Interfaces
All data models are defined in `src/interfaces/`:
- `product.ts` - ProductReq, ProductRes, ProductStatus, ProductType, PrizeCategory enums
- `order.ts` - Order-related types
- `user.ts` / `Member.ts` - User data structures

### Product Types (Critical Enum)
```typescript
enum ProductType {
  PRIZE = 'PRIZE',        // 一番賞
  GACHA = 'GACHA',        // 扭蛋
  BLIND_BOX = 'BLIND_BOX', // 盲盒
  CUSTMER_PRIZE = 'CUSTMER_PRIZE', // 客製化抽獎
}
```

### Styling
- Global styles: `src/assets/styles/main.scss`
- Admin styles: `src/assets/styles/admin.scss`
- Uses Element Plus components
- FontAwesome icons loaded globally

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to /dist
npm run preview  # Preview production build
```

### Deployment
- `deploy.bat` - Deploy to AWS S3 bucket `onekuji` (ap-northeast-1)
- Vercel config exists (`vercel.json`) for SPA routing

## Environment Variables
Required in `.env`:
```
VITE_BASE_API_URL=http://localhost:8081     # Frontend API
VITE_BASE_API_URL2=http://localhost:8080/api # Admin API
VITE_BASE_API_URL3=...                       # Image CDN
VITE_PAYMENT_GATEWAY_URL=...                 # GoMyPay gateway
VITE_AFTEE_API_URL=...                       # AFTEE payment
```

## Component Organization
- `src/components/common/` - Reusable UI (dialogs, cards, tables)
- `src/components/Frontend/` - Customer-facing components
- `src/components/Backend/` - Admin panel components
- `src/components/layout/` - Header, Footer, Sidebar

## Important Files
- `src/router/index.ts` - All routes with auth guards
- `src/utils/Localstorage.ts` - Typed localStorage helpers (`loadState`, `saveState`)
- `src/config/appEnv.ts` - Runtime environment config object
- `src/data/taiwanCities.ts` - Taiwan address data for shipping
