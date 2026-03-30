import { useState, useMemo, lazy, Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { Root } from './Root';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SteelSpecPage = lazy(() => import('./pages/SteelSpecPage').then(m => ({ default: m.SteelSpecPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

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
            { path: '*', element: <Suspense fallback={<PageLoader />}><HomePage lang={lang} /></Suspense> },
          ],
        },
      ]),
    [lang]
  );

  return <RouterProvider router={router} />;
}
