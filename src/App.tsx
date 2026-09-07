import { useState, useEffect } from 'react';
import { Page, Course, DigitalProduct, BundleItem, PurchaseRecord } from './types';

import { COURSES, FREE_COURSES } from './data/courses';
import { DIGITAL_PRODUCTS } from './data/digitalProducts';
import { BUNDLES } from './data/bundles';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SignInModal } from './components/SignInModal';
import { ConsultationModal } from './components/ConsultationModal';
import { ThemeProvider } from './utils/ThemeContext';

import { HomePage } from './pages/HomePage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { DigitalProductPage } from './pages/DigitalProductPage';
import { BundlePage } from './pages/BundlePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { CoursePlayerPage } from './pages/CoursePlayerPage';
import { CertificatePage } from './pages/CertificatePage';
import { ResourceAccessPage } from './pages/ResourceAccessPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  // ────────────────────────────────────────────────────────────
  // MODAL STATES
  // ────────────────────────────────────────────────────────────
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // ────────────────────────────────────────────────────────────
  // PERSISTENT STATE (MOCKING BACKEND DATABASE)
  // ────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('awraq_isLoggedIn');
    return saved ? JSON.parse(saved) : false;
  });

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('awraq_purchaseHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('awraq_purchasedCourseIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchasedDigitalProductIds, setPurchasedDigitalProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('awraq_purchasedDigitalProductIds');
    return saved ? JSON.parse(saved) : [];
  });

  const [progressData, setProgressData] = useState<
    Record<string, { completedLessons: string[]; lastLessonId?: string }>
  >(() => {
    const saved = localStorage.getItem('awraq_progressData');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeDigitalProduct, setActiveDigitalProduct] = useState<DigitalProduct | null>(null);
  const [activeBundle, setActiveBundle] = useState<BundleItem | null>(null);

  // ────────────────────────────────────────────────────────────
  // PERSIST STATE CHANGES
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('awraq_isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('awraq_purchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  useEffect(() => {
    localStorage.setItem('awraq_purchasedCourseIds', JSON.stringify(purchasedCourseIds));
  }, [purchasedCourseIds]);

  useEffect(() => {
    localStorage.setItem('awraq_purchasedDigitalProductIds', JSON.stringify(purchasedDigitalProductIds));
  }, [purchasedDigitalProductIds]);

  useEffect(() => {
    localStorage.setItem('awraq_progressData', JSON.stringify(progressData));
  }, [progressData]);

  // ────────────────────────────────────────────────────────────
  // VIEW STATE: Only expose private entitlements if logged in
  // ────────────────────────────────────────────────────────────
  const activePurchaseHistory = isLoggedIn ? purchaseHistory : [];
  const activePurchasedCourseIds = isLoggedIn ? purchasedCourseIds : [];
  const activePurchasedDigitalIds = isLoggedIn ? purchasedDigitalProductIds : [];
  const activeProgressData = isLoggedIn ? progressData : {};

  const appRoutes: Page[] = [
    'course-detail',
    'digital-product',
    'bundle-detail',
    'resource-access',
    'checkout',
    'dashboard',
    'learn',
    'certificate',
  ];

  // ────────────────────────────────────────────────────────────
  // HTML5 HISTORY API INTEGRATION
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    window.history.replaceState(
      {
        page: currentPage,
        courseId: activeCourse?.id,
        productId: activeDigitalProduct?.id,
        bundleId: activeBundle?.id,
      },
      ''
    );

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);

        if (event.state.courseId) {
          const c =
            COURSES.find((c) => c.id === event.state.courseId) ||
            FREE_COURSES.find((c) => c.id === event.state.courseId);
          setActiveCourse(c || null);
        } else {
          setActiveCourse(null);
        }

        if (event.state.productId) {
          const p = DIGITAL_PRODUCTS.find((p) => p.id === event.state.productId);
          setActiveDigitalProduct(p || null);
        } else {
          setActiveDigitalProduct(null);
        }

        if (event.state.bundleId) {
          const b = BUNDLES.find((b) => b.id === event.state.bundleId);
          setActiveBundle(b || null);
        } else {
          setActiveBundle(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ────────────────────────────────────────────────────────────
  // ROUTE PROTECTION (PREVENTS BACK-BUTTON EXPLOIT AFTER LOGOUT)
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !isLoggedIn &&
      ['dashboard', 'certificate', 'checkout', 'resource-access', 'learn'].includes(currentPage) &&
      !activeCourse?.isFree
    ) {
      window.history.replaceState(
        { page: 'home', courseId: null, productId: null, bundleId: null },
        ''
      );
      setCurrentPage('home');
      setActiveCourse(null);
      setActiveDigitalProduct(null);
      setActiveBundle(null);
    }
  }, [isLoggedIn, currentPage, activeCourse]);

  // ────────────────────────────────────────────────────────────
  // CLOSE MODALS ON PAGE CHANGE (better UX)
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsConsultationOpen(false);
    setIsSignInOpen(false);
  }, [currentPage]);

  // ────────────────────────────────────────────────────────────
  // NAVIGATION HELPERS
  // ────────────────────────────────────────────────────────────
  const performNavigation = (
    page: Page,
    course: Course | null = activeCourse,
    product: DigitalProduct | null = activeDigitalProduct,
    bundle: BundleItem | null = activeBundle
  ) => {
    if (course !== activeCourse) setActiveCourse(course);
    if (product !== activeDigitalProduct) setActiveDigitalProduct(product);
    if (bundle !== activeBundle) setActiveBundle(bundle);

    setCurrentPage(page);

    window.history.pushState(
      {
        page,
        courseId: course?.id || null,
        productId: product?.id || null,
        bundleId: bundle?.id || null,
      },
      ''
    );
  };

  const handleNavigate = (page: Page) => {
    if (appRoutes.includes(page)) {
      performNavigation(page, activeCourse, activeDigitalProduct, activeBundle);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      performNavigation('home', null, null, null);
    }
  };

  const handleOpenItemDetail = (
    item: any,
    type: 'course' | 'digital' | 'bundle' | 'resource'
  ) => {
    const resolvedType = type === 'resource' ? 'digital' : type;
    let newPage: Page = 'home';
    let c = null,
      p = null,
      b = null;

    if (resolvedType === 'course') {
      c = item as Course;
      newPage = 'course-detail';
    } else if (resolvedType === 'digital') {
      p = item as DigitalProduct;
      newPage = activePurchaseHistory.some((rec) => rec.itemId === item.id)
        ? 'resource-access'
        : 'digital-product';
    } else if (resolvedType === 'bundle') {
      b = item as BundleItem;
      newPage = 'bundle-detail';
    }

    performNavigation(newPage, c, p, b);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ────────────────────────────────────────────────────────────
  // ENROLL / PURCHASE HANDLERS
  // ────────────────────────────────────────────────────────────
  const handleEnrollClick = () => {
    if (activeCourse?.isFree) {
      if (!purchasedCourseIds.includes(activeCourse.id)) {
        setPurchasedCourseIds((prev) => [...prev, activeCourse.id]);
      }
      if (!progressData[activeCourse.id]) {
        setProgressData((prev) => ({
          ...prev,
          [activeCourse.id]: { completedLessons: [], lastLessonId: undefined },
        }));
      }
      performNavigation('learn', activeCourse, activeDigitalProduct, activeBundle);
      return;
    }

    if (isLoggedIn) {
      performNavigation('checkout', activeCourse, activeDigitalProduct, activeBundle);
    } else {
      setIsSignInOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    if (['course-detail', 'digital-product', 'bundle-detail'].includes(currentPage)) {
      performNavigation('checkout', activeCourse, activeDigitalProduct, activeBundle);
    } else {
      performNavigation('dashboard', null, null, null);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    performNavigation('home', null, null, null);
  };

  const handleCompletePurchase = (itemId: string, type: 'course' | 'digital' | 'bundle') => {
    const now = new Date().toISOString();
    const orderId = `ORD-${Math.floor(Math.random() * 100000)}`;
    const newRecords: PurchaseRecord[] = [];

    if (type === 'bundle' && activeBundle) {
      newRecords.push({
        id: orderId,
        itemId: activeBundle.id,
        itemTitle: activeBundle.title,
        type: 'bundle',
        purchaseDate: now,
        pricePaid: activeBundle.price,
        status: 'Completed',
      });

      activeBundle.includedCourseIds.forEach((cId) => {
        if (!purchasedCourseIds.includes(cId)) {
          setPurchasedCourseIds((p) => [...p, cId]);
          setProgressData((prev) => ({
            ...prev,
            [cId]: { completedLessons: [], lastLessonId: undefined },
          }));
        }
        if (!purchaseHistory.some((p) => p.itemId === cId)) {
          const cInfo =
            COURSES.find((c) => c.id === cId) || FREE_COURSES.find((c) => c.id === cId);
          newRecords.push({
            id: `${orderId}-C-${cId.slice(-4)}`,
            itemId: cId,
            itemTitle: cInfo?.title || 'Included Course',
            type: 'course',
            purchaseDate: now,
            pricePaid: 0,
            status: 'Completed',
          });
        }
      });

      activeBundle.includedDigitalProductIds.forEach((dpId) => {
        if (!purchasedDigitalProductIds.includes(dpId)) {
          setPurchasedDigitalProductIds((p) => [...p, dpId]);
        }
        if (!purchaseHistory.some((p) => p.itemId === dpId)) {
          const dpInfo = DIGITAL_PRODUCTS.find((dp) => dp.id === dpId);
          newRecords.push({
            id: `${orderId}-D-${dpId.slice(-4)}`,
            itemId: dpId,
            itemTitle: dpInfo?.title || 'Included Resource',
            type: 'digital',
            purchaseDate: now,
            pricePaid: 0,
            status: 'Completed',
          });
        }
      });

      setActiveBundle(null);
      setPurchaseHistory((prev) => [...prev, ...newRecords]);
      performNavigation('dashboard', null, null, null);
    } else {
      const itemInfo = type === 'course' ? activeCourse : activeDigitalProduct;
      if (!itemInfo) return;

      if (!purchaseHistory.some((p) => p.itemId === itemId)) {
        newRecords.push({
          id: orderId,
          itemId,
          itemTitle: itemInfo.title,
          type,
          purchaseDate: now,
          pricePaid: itemInfo.price,
          status: 'Completed',
        });
        setPurchaseHistory((prev) => [...prev, ...newRecords]);

        if (type === 'course') {
          if (!purchasedCourseIds.includes(itemId)) {
            setPurchasedCourseIds((p) => [...p, itemId]);
          }
          setProgressData((prev) => ({
            ...prev,
            [itemId]: { completedLessons: [], lastLessonId: undefined },
          }));
        } else if (type === 'digital') {
          if (!purchasedDigitalProductIds.includes(itemId)) {
            setPurchasedDigitalProductIds((p) => [...p, itemId]);
          }
        }
      }

      if (type === 'digital') {
        performNavigation('resource-access', activeCourse, activeDigitalProduct, activeBundle);
      } else {
        performNavigation('dashboard', null, null, null);
      }
    }
  };

  const activeCheckoutItem = activeBundle || activeCourse || activeDigitalProduct;

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-brand-primary-light)]">
      {!['learn', 'certificate'].includes(currentPage) && (
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1 flex flex-col">
        {currentPage === 'home' || !appRoutes.includes(currentPage) ? (
          <HomePage
            onNavigate={handleNavigate}
            onOpenConsultation={() => setIsConsultationOpen(true)}
            onOpenSignIn={() => setIsSignInOpen(true)}
            onOpenItemDetail={handleOpenItemDetail}
            isLoggedIn={isLoggedIn}
            purchaseHistory={activePurchaseHistory}
            progressData={activeProgressData}
          />
        ) : null}

        {currentPage === 'course-detail' && activeCourse && (
          <CourseDetailPage
            course={activeCourse}
            isOwned={activePurchaseHistory.some((p) => p.itemId === activeCourse.id)}
            progress={activeProgressData[activeCourse.id]}
            onNavigate={handleNavigate}
            onEnroll={handleEnrollClick}
          />
        )}

        {currentPage === 'digital-product' && activeDigitalProduct && (
          <DigitalProductPage
            product={activeDigitalProduct}
            isOwned={activePurchaseHistory.some((p) => p.itemId === activeDigitalProduct.id)}
            onNavigate={handleNavigate}
            onBuy={handleEnrollClick}
            onAccess={() =>
              performNavigation(
                'resource-access',
                activeCourse,
                activeDigitalProduct,
                activeBundle
              )
            }
          />
        )}

        {currentPage === 'bundle-detail' && activeBundle && (
          <BundlePage
            bundle={activeBundle}
            allCourses={COURSES}
            allDigitalProducts={DIGITAL_PRODUCTS}
            isOwned={activePurchaseHistory.some((p) => p.itemId === activeBundle.id)}
            onNavigate={handleNavigate}
            onBuy={handleEnrollClick}
          />
        )}

        {currentPage === 'checkout' && activeCheckoutItem && (
          <CheckoutPage
            item={activeCheckoutItem}
            onNavigate={handleNavigate}
            onCompletePurchase={handleCompletePurchase}
          />
        )}

        {currentPage === 'resource-access' && activeDigitalProduct && (
          <ResourceAccessPage
            product={activeDigitalProduct}
            isOwned={activePurchaseHistory.some((p) => p.itemId === activeDigitalProduct.id)}
            purchaseDate={
              activePurchaseHistory.find((p) => p.itemId === activeDigitalProduct.id)?.purchaseDate
            }
            onNavigate={handleNavigate}
            onBuy={handleEnrollClick}
          />
        )}

        {currentPage === 'dashboard' && (
          <StudentDashboard
            purchaseHistory={activePurchaseHistory}
            progressData={activeProgressData}
            onNavigate={handleNavigate}
            onStartLearning={(course) => performNavigation('learn', course, null, null)}
            onViewCertificate={(course) => performNavigation('certificate', course, null, null)}
            onExploreCourse={(course) => performNavigation('course-detail', course, null, null)}
            onAccessResource={(product) => performNavigation('resource-access', null, product, null)}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'learn' && activeCourse && (
          <CoursePlayerPage
            course={activeCourse}
            progress={activeProgressData[activeCourse.id] || { completedLessons: [] }}
            onUpdateProgress={(id, cl, ll) =>
              setProgressData((p) => ({
                ...p,
                [id]: { completedLessons: cl, lastLessonId: ll },
              }))
            }
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'certificate' && activeCourse && (
          <CertificatePage course={activeCourse} onNavigate={handleNavigate} />
        )}
      </main>

      {!['learn', 'certificate'].includes(currentPage) && (
        <Footer
          onNavigate={handleNavigate}
          onOpenConsultation={() => setIsConsultationOpen(true)}
        />
      )}

      {/* ──────────────────────────────────────────────────────
          GLOBAL MODALS
      ────────────────────────────────────────────────────── */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
    </ThemeProvider>
  );
}