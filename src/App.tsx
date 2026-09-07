import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout, FocusLayout, MarketingLayout, ScrollAndFocusManager } from './components/layouts';
import { RequireAuth, RequireCourseAccess } from './components/guards';
import { StoreProvider } from './store/StoreProvider';
import { ThemeProvider } from './theme/ThemeProvider';
import { ToastProvider } from './components/ui/Toast';
import { RouteFallback } from './pages/RouteFallback';

/**
 * Routing.
 *
 * The previous app had no router at all — navigation was `useState<Page>` plus
 * manual history.pushState, so every course, every checkout and every
 * dashboard shared a single URL. Nothing could be linked, shared, bookmarked,
 * indexed or refreshed (AUDIT.md §C7).
 *
 * Every page below is code-split. The old build shipped one 529 kB chunk, so a
 * visitor reading the homepage also downloaded the course player, the
 * certificate renderer and the checkout.
 */

const HomePage = lazy(() => import('./pages/HomePage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const BundleDetailPage = lazy(() => import('./pages/BundleDetailPage'));
const FreeSessionsPage = lazy(() => import('./pages/FreeSessionsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PlayerPage = lazy(() => import('./pages/PlayerPage'));
const CertificatePage = lazy(() => import('./pages/CertificatePage'));
const LibraryItemPage = lazy(() => import('./pages/LibraryItemPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StoreProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollAndFocusManager />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Marketing — fixed-dark brand surface */}
                  <Route element={<MarketingLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="free" element={<FreeSessionsPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="consultation" element={<ConsultationPage />} />
                  </Route>

                  {/* App — themed surfaces */}
                  <Route element={<AppLayout />}>
                    <Route path="courses" element={<CatalogPage mode="courses" />} />
                    <Route path="courses/:slug" element={<CourseDetailPage />} />
                    <Route path="resources" element={<CatalogPage mode="resources" />} />
                    <Route path="resources/:slug" element={<ProductDetailPage />} />
                    <Route path="bundles/:slug" element={<BundleDetailPage />} />
                    <Route path="signin" element={<SignInPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="legal/:document" element={<LegalPage />} />

                    <Route
                      path="checkout"
                      element={
                        <RequireAuth>
                          <CheckoutPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="dashboard"
                      element={
                        <RequireAuth>
                          <DashboardPage />
                        </RequireAuth>
                      }
                    />
                    <Route
                      path="library/:slug"
                      element={
                        <RequireAuth>
                          <LibraryItemPage />
                        </RequireAuth>
                      }
                    />
                  </Route>

                  {/* Immersive — no site chrome */}
                  <Route element={<FocusLayout />}>
                    <Route
                      path="learn/:slug"
                      element={
                        <RequireCourseAccess>
                          <PlayerPage />
                        </RequireCourseAccess>
                      }
                    />
                    <Route
                      path="learn/:slug/:lessonId"
                      element={
                        <RequireCourseAccess>
                          <PlayerPage />
                        </RequireCourseAccess>
                      }
                    />
                    <Route
                      path="certificate/:slug"
                      element={
                        <RequireAuth>
                          <CertificatePage />
                        </RequireAuth>
                      }
                    />
                  </Route>

                  {/* 404 — a real page, not a silent redirect to home */}
                  <Route element={<AppLayout />}>
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </StoreProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
