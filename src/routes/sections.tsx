// import type { RouteObject } from 'react-router';
// import { lazy, Suspense } from 'react';
// import { Outlet, Navigate } from 'react-router-dom';
// import { varAlpha } from 'minimal-shared/utils';

// import Box from '@mui/material/Box';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// import { AuthLayout } from 'src/layouts/auth';
// import { DashboardLayout } from 'src/layouts/dashboard';
// import { useAuth } from 'src/sections/auth/auth'; // Adjust the import path based on your file structure

// // ----------------------------------------------------------------------

// export const DashboardPage = lazy(() => import('src/pages/dashboard'));
// export const BlogPage = lazy(() => import('src/pages/blog'));
// export const UserPage = lazy(() => import('src/pages/user'));
// export const ConferencePage = lazy(() => import('src/pages/conference'));
// export const PublicationPage = lazy(() => import('src/pages/publication'));
// export const SignInPage = lazy(() => import('src/pages/sign-in'));
// export const SignUpPage = lazy(() => import('src/pages/sign-up'));
// export const ProductsPage = lazy(() => import('src/pages/products'));
// export const Page404 = lazy(() => import('src/pages/page-not-found'));

// const renderFallback = () => (
//   <Box
//     sx={{
//       display: 'flex',
//       flex: '1 1 auto',
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}
//   >
//     <LinearProgress
//       sx={{
//         width: 1,
//         maxWidth: 320,
//         bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
//         [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
//       }}
//     />
//   </Box>
// );

// // Wrapper component to handle authentication for protected routes
// const ProtectedLayout = () => {
//   const { user } = useAuth(); // Get the user from AuthContext

//   // If not authenticated, redirect to /sign-in
//   if (!user) {
//     return <Navigate to="/sign-in" replace />;
//   }

//   // If authenticated, render the DashboardLayout with the Outlet
//   return (
//     <DashboardLayout>
//       <Suspense fallback={renderFallback()}>
//         <Outlet />
//       </Suspense>
//     </DashboardLayout>
//   );
// };

// export const routesSection: RouteObject[] = [
//   {
//     element: <ProtectedLayout />,
//     children: [
//       { index: true, element: <DashboardPage /> },
//       { path: 'user', element: <UserPage /> },
//       { path: 'conference', element: <ConferencePage /> },
//       { path: 'publication', element: <PublicationPage /> },
//       { path: 'products', element: <ProductsPage /> },
//       { path: 'blog', element: <BlogPage /> },
//     ],
//   },
//   {
//     path: 'sign-in',
//     element: (
//       <AuthLayout>
//         <SignInPage />
//       </AuthLayout>
//     ),
//   },
//   {
//     path: '404',
//     element: <Page404 />,
//   },
//   { path: '*', element: <Navigate to="/sign-in" replace /> }, // Redirect all unmatched routes to /sign-in
// ];


import type { RouteObject } from 'react-router';
import { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/auth'; // Adjust the import path based on your file structure

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ConferencePage = lazy(() => import('src/pages/conference'));
export const PublicationPage = lazy(() => import('src/pages/publication'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LogoutPage = lazy(() => import('src/pages/logout'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Wrapper component to handle authentication for protected routes
const ProtectedLayout = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an async check for the user state
    const checkAuth = async () => {
      // Wait for a brief moment to ensure AuthProvider has initialized
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  console.log('ProtectedLayout: user:', user, 'isLoading:', isLoading); // Debug log

  if (isLoading) {
    return renderFallback(); // Show loading state while checking auth
  }

  // If not authenticated, redirect to /sign-in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // If authenticated, render the DashboardLayout with the Outlet
  return (
    <DashboardLayout>
      <Suspense fallback={renderFallback()}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
};

// Wrapper component for handling 404 routes
const NotFoundWrapper = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return renderFallback();
  }

  // Define valid paths
  const validPaths = [
    '/',
    '/user',
    '/conference',
    '/publication',
    '/products',
    '/blog',
    '/sign-in',
    '/404',
    '/logout'
  ];

  // Check if the current path is valid
  const isValidPath = validPaths.includes(location.pathname);

  // If user is not authenticated and trying to access a protected route (not /sign-in or /404), redirect to /sign-in
  if (!user && !location.pathname.startsWith('/sign-in') && location.pathname !== '/404') {
    return <Navigate to="/sign-in" replace />;
  }

  // If the path is not valid, render the 404 page with the same URL
  if (!isValidPath && location.pathname !== '/404') {
    return <Page404 />;
  }

  // If the path is /404, render the 404 page
  if (location.pathname === '/404') {
    return <Page404 />;
  }

  // For any other case (shouldn't happen), render the 404 page
  return <Page404 />;
};

// Wrapper component for the sign-in route
const SignInWrapper = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return renderFallback();
  }

  // If user is authenticated, redirect to the dashboard (/)
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render the SignInPage
  return (
    <AuthLayout>
      <SignInPage />
    </AuthLayout>
  );
};

export const routesSection: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'conference', element: <ConferencePage /> },
      { path: 'publication', element: <PublicationPage /> },
      { path: 'logout', element: <LogoutPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: <SignInWrapper />, // Use the wrapper to handle redirection
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <NotFoundWrapper />,
  },
];