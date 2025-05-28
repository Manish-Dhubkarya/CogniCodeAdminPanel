import 'src/global.css';

import { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import { usePathname, useRouter } from 'src/routes/hooks'; // Import useRouter

import { ThemeProvider } from 'src/theme/theme-provider';
import { AuthProvider } from './sections/auth/auth';
import { Iconify } from 'src/components/iconify';
import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  console.log('App rendering - Wrapping children with AuthProvider and ThemeProvider');

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/Manish-Dhubkarya/CogniCodeAdminPanel"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'grey.800',
      }}
    >
      <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
    </Fab>
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        {githubButton()}
      </ThemeProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}