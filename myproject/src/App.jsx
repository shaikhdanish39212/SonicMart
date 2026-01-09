
import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingSpinner } from './utils/performance';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { RBACProvider } from './context/RBACContext';
import { ToastProvider } from './context/ToastContext';

// Import SVG fix utility
import './utils/svgFix';
import { useSVGFix } from './hooks/useSVGFix';

// Lazy load non-critical pages for better initial bundle size
const Home = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoryProductsPage = lazy(() => import('./pages/CategoryProductsPage'));
const ProductPage = lazy(() => import('./components/ProductPage'));
const CartPage = lazy(() => import('./components/CartPage'));
const PlaceOrderPage = lazy(() => import('./pages/PlaceOrderPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const DealsPage = lazy(() => import('./pages/DealsPage'));
const InternalComponents = lazy(() => import('./pages/InternalComponents'));
const DebugInternalComponents = lazy(() => import('./pages/DebugInternalComponents'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminDashboardDebug = lazy(() => import('./components/AdminDashboardDebug'));
const AdminUsersPage = lazy(() => import('./pages/admin/UsersPage.jsx'));
const AdminProductsPage = lazy(() => import('./pages/admin/ProductsPage.jsx'));
const AdminContactsPage = lazy(() => import('./pages/admin/ContactsPage.jsx'));
const AdminCouponsPage = lazy(() => import('./pages/admin/CouponsPage.jsx'));
const ImageUploadTest = lazy(() => import('./pages/ImageUploadTest'));
const EditProductTest = lazy(() => import('./pages/EditProductTest'));
const ImageDisplayTest = lazy(() => import('./pages/ImageDisplayTest'));
const NewImageUploadTest = lazy(() => import('./pages/NewImageUploadTest'));
const AdminOrdersPage = lazy(() => import('./pages/admin/OrdersPage.jsx'));
const AdminDealsPage = lazy(() => import('./pages/admin/DealsPage.jsx'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const PermissionsPage = lazy(() => import('./pages/PermissionsPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProductComparisonPage = lazy(() => import('./pages/ProductComparisonPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
import { WishlistProvider } from './context/WishlistContext';
import { ProductComparisonProvider } from './context/ProductComparisonContext';
import { ProductCacheProvider } from './context/ProductCacheContext';
import ScrollToTop from './components/ScrollToTop';
import ScrollWrapper from './components/ScrollWrapper';

// Layout for public/user routes with Navbar and Footer
const PublicLayout = ({ children }) => {
  useEffect(() => {
    // Force scroll to top when layout mounts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [children]);

  return (
    <ScrollWrapper>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow bg-white">
          {children}
        </main>
        <Footer />
      </div>
    </ScrollWrapper>
  );
};

function App() {
  // Fix SVG attributes globally
  useSVGFix();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <RBACProvider>
            <ProductCacheProvider>
              <WishlistProvider>
                <ProductComparisonProvider>
                  <CartProvider>
                    <ErrorBoundary>
                      <ScrollToTop />
                      <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                      {/* Public Routes - with Navbar and Footer */}
                      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
                      <Route path="/products/:slug" element={<PublicLayout><ProductPage /></PublicLayout>} />
                      <Route path="/category/:categoryId" element={<PublicLayout><CategoryProductsPage /></PublicLayout>} />
                      <Route path="/product/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
                      <Route path="/component/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
                      <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
                      <Route path="/place-order" element={<PublicLayout><PlaceOrderPage /></PublicLayout>} />
                      <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmationPage /></PublicLayout>} />
                      <Route path="/categories" element={<PublicLayout><CategoriesPage /></PublicLayout>} />
                      <Route path="/deals" element={<PublicLayout><DealsPage /></PublicLayout>} />
                      <Route path="/internal-components" element={<PublicLayout><InternalComponents /></PublicLayout>} />
                      <Route path="/debug-internal-components" element={<PublicLayout><DebugInternalComponents /></PublicLayout>} />
                      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
                      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
                      <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
                      <Route path="/reset-password" element={<PublicLayout><ResetPasswordPage /></PublicLayout>} />
                      <Route path="/my-orders" element={<PublicLayout><MyOrdersPage /></PublicLayout>} />
                      <Route path="/orders" element={<PublicLayout><MyOrdersPage /></PublicLayout>} />
                      <Route path="/profile" element={<PublicLayout><ProfilePage /></PublicLayout>} />
                      <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />
                      <Route path="/compare" element={<PublicLayout><ProductComparisonPage /></PublicLayout>} />
                      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
                      <Route path="/help" element={<PublicLayout><HelpCenterPage /></PublicLayout>} />
                      <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
                      <Route path="/returns" element={<PublicLayout><ReturnsPage /></PublicLayout>} />
                      <Route path="/exchanges" element={<PublicLayout><ReturnsPage /></PublicLayout>} />
                      <Route path="/warranty" element={<PublicLayout><ReturnsPage /></PublicLayout>} />
                      <Route path="/coupons" element={<PublicLayout><CouponsPage /></PublicLayout>} />
                      <Route path="/offers" element={<PublicLayout><CouponsPage /></PublicLayout>} />
                      <Route path="/shipping" element={<PublicLayout><ShippingPage /></PublicLayout>} />
                      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
                      <Route path="/privacy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
                      <Route path="/terms-of-service" element={<PublicLayout><TermsOfServicePage /></PublicLayout>} />
                      <Route path="/terms" element={<PublicLayout><TermsOfServicePage /></PublicLayout>} />
                      <Route path="/cookies" element={<PublicLayout><CookiePolicyPage /></PublicLayout>} />
                      <Route path="/sitemap" element={<PublicLayout><SitemapPage /></PublicLayout>} />
                      <Route path="/test" element={<PublicLayout><TestPage /></PublicLayout>} />
                      <Route path="/image-upload-test" element={<PublicLayout><ImageUploadTest /></PublicLayout>} />
                      <Route path="/edit-product-test" element={<PublicLayout><EditProductTest /></PublicLayout>} />
                      <Route path="/image-display-test" element={<PublicLayout><ImageDisplayTest /></PublicLayout>} />
                      <Route path="/new-image-upload-test" element={<PublicLayout><NewImageUploadTest /></PublicLayout>} />
                      <Route path="/unauthorized" element={<PublicLayout><UnauthorizedPage /></PublicLayout>} />
                      
                      {/* Redirect route for exit-admin */}
                      <Route path="/exit-admin" element={<Navigate to="/" replace />} />
                      
                      {/* Admin Routes - NO Navbar and Footer, only AdminLayout */}
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDashboard />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/debug" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDashboardDebug />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/users" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminUsersPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminProductsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/products/new" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminProductsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/orders" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminOrdersPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/contacts" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminContactsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/coupons" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminCouponsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/deals" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDealsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/deals/new" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDealsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/deals/add" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDealsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/deals/edit/:id" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <AdminLayout>
                            <AdminDealsPage />
                          </AdminLayout>
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/permissions" element={
                        <ProtectedRoute requiredRole="admin" unauthorizedRedirect="/unauthorized">
                          <PermissionsPage />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      style: {
                        background: '#10B981',
                      },
                    },
                    error: {
                      duration: 4000,
                      style: {
                        background: '#EF4444',
                      },
                    },
                  }}
                />
              </CartProvider>
            </ProductComparisonProvider>
          </WishlistProvider>
        </ProductCacheProvider>
        </RBACProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
