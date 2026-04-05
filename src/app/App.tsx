import { useState, useMemo, lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { Root } from './Root';

// Auto-reload once when a lazy chunk fails to fetch (stale deployment cache).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(() =>
    factory().catch((err: unknown) => {
      const key = 'chunk-reload-attempted';
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
      }
      return Promise.reject(err);
    })
  );
}

const HomePage          = lazyWithRetry(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage      = lazyWithRetry(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazyWithRetry(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const AboutPage         = lazyWithRetry(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SteelSpecPage     = lazyWithRetry(() => import('./pages/SteelSpecPage').then(m => ({ default: m.SteelSpecPage })));
const ContactPage       = lazyWithRetry(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const QuoteBuilderPage  = lazyWithRetry(() => import('./pages/QuoteBuilderPage').then(m => ({ default: m.QuoteBuilderPage })));
const CartPage          = lazyWithRetry(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage      = lazyWithRetry(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage  = lazyWithRetry(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const CompatibilityPage = lazyWithRetry(() => import('./pages/CompatibilityPage').then(m => ({ default: m.CompatibilityPage })));
const FactoryPage       = lazyWithRetry(() => import('./pages/FactoryPage').then(m => ({ default: m.FactoryPage })));
const BrandLandingPage      = lazyWithRetry(() => import('./pages/BrandLandingPage').then(m => ({ default: m.BrandLandingPage })));
const IntelDashboardPage    = lazyWithRetry(() => import('./pages/IntelDashboardPage').then(m => ({ default: m.IntelDashboardPage })));
const InventoryPage         = lazyWithRetry(() => import('./pages/InventoryPage').then(m => ({ default: m.InventoryPage })));

const PageLoader = () => <div style={{ minHeight: '60vh', backgroundColor: '#111' }} />;

export default function App() {
  const [lang, setLang] = useState<string>('en');

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <Root lang={lang} setLang={setLang} />,
          children: [
            { index: true, element: <Suspense fallback={<PageLoader />}><HomePage lang={lang} /></Suspense> },
            { path: 'products', element: <Suspense fallback={<PageLoader />}><ProductsPage lang={lang} /></Suspense> },
            { path: 'products/:slug', element: <Suspense fallback={<PageLoader />}><ProductDetailPage lang={lang} /></Suspense> },
            { path: 'about', element: <Suspense fallback={<PageLoader />}><AboutPage lang={lang} /></Suspense> },
            { path: 'steel-spec', element: <Suspense fallback={<PageLoader />}><SteelSpecPage lang={lang} /></Suspense> },
            { path: 'contact', element: <Suspense fallback={<PageLoader />}><ContactPage lang={lang} /></Suspense> },
            { path: 'compatibility',  element: <Suspense fallback={<PageLoader />}><CompatibilityPage lang={lang} /></Suspense> },
            { path: 'quote-builder',  element: <Suspense fallback={<PageLoader />}><QuoteBuilderPage /></Suspense> },
            { path: 'cart',           element: <Suspense fallback={<PageLoader />}><CartPage /></Suspense> },
            { path: 'checkout',       element: <Suspense fallback={<PageLoader />}><CheckoutPage /></Suspense> },
            { path: 'order/success',  element: <Suspense fallback={<PageLoader />}><OrderSuccessPage /></Suspense> },
            { path: 'factory',       element: <Suspense fallback={<PageLoader />}><FactoryPage lang={lang} /></Suspense> },
            { path: 'excavator-attachments/:brandSlug', element: <Suspense fallback={<PageLoader />}><BrandLandingPage /></Suspense> },
            { path: 'intel', element: <Suspense fallback={<PageLoader />}><IntelDashboardPage /></Suspense> },
            { path: 'inventory', element: <Suspense fallback={<PageLoader />}><InventoryPage /></Suspense> },
            { path: '*', element: <Suspense fallback={<PageLoader />}><HomePage lang={lang} /></Suspense> },
          ],
        },
      ]),
    [lang]
  );

  return <RouterProvider router={router} />;
}
