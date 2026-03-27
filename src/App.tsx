import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

/* ── 路由级代码分割 ──
 * 只有 Header/Footer 进入主 bundle，页面组件按需加载
 * 工地 4G 场景下显著减少首屏 JS 体积
 */
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const ProductsPage = lazy(() => import('@/pages/ProductsPage').then(m => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const SteelSpecPage = lazy(() => import('@/pages/SteelSpecPage').then(m => ({ default: m.SteelSpecPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })))

/* ── 路由切换时自动滚回顶部 ──
 * 扫码用户从产品列表点进 PDP 再返回时，不会停在页面中间
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* ── Suspense 加载占位 ──
 * 工地 4G 慢速场景下，给用户一个视觉反馈
 */
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-bih-yellow border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-wider text-bih-gray-400">Loading…</p>
      </div>
    </div>
  )
}

/**
 * BIH 主应用入口
 * 路由结构：
 *   / — 主页
 *   /products — 产品列表 + 兼容性筛选器
 *   /products/:slug — 产品详情页 (PDP)
 *   /about — 烟台制造叙事
 *   /steel-spec — Q355 技术对标
 */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/steel-spec" element={<SteelSpecPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
