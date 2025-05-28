import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { varAlpha } from 'minimal-shared/utils';
import { useEffect, useState } from 'react';
import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';

import { OverviewAnalyticsView as DashboardView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function Page() {

  
 const isAuth = localStorage.getItem('auth_user');

useEffect(() => {
  if (!isAuth) {
    window.location.href = '/sign-in';
  } 
}, []);




  return (
    <>
      <title>{`${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
      />
      <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />

      <DashboardView />
    </>
  );
}
