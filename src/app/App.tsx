import { useState, useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { SteelSpecPage } from './pages/SteelSpecPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  const [lang, setLang] = useState<string>('en');

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <Root lang={lang} setLang={setLang} />,
          children: [
            { index: true, element: <HomePage lang={lang} /> },
            { path: 'products', element: <ProductsPage lang={lang} /> },
            { path: 'products/:slug', element: <ProductDetailPage lang={lang} /> },
            { path: 'about', element: <AboutPage lang={lang} /> },
            { path: 'steel-spec', element: <SteelSpecPage lang={lang} /> },
            { path: 'contact', element: <ContactPage lang={lang} /> },
            { path: '*', element: <HomePage lang={lang} /> },
          ],
        },
      ]),
    [lang]
  );

  return <RouterProvider router={router} />;
}
