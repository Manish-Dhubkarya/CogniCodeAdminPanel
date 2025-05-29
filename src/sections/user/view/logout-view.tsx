import { useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuth } from 'src/sections/auth/auth';
import { DashboardContent } from 'src/layouts/dashboard';
import { Box, Button, Stack, Typography } from '@mui/material';
import { LiaSignOutAltSolid } from 'react-icons/lia';

export default function LogoutView() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogoutConfirm = useCallback(() => {
    setUser(null); // Clear user from context and localStorage
    router.push('/sign-in'); // Redirect to sign-in
  }, [router, setUser]);

  const handleLogoutCancel = useCallback(() => {
    router.push('/'); // Redirect to dashboard
  }, [router]);

  return (
    <DashboardContent>
      {/* Logout title at the top */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Logout
        </Typography>
        <LiaSignOutAltSolid
            style={{
              fontSize: 48,
              color: '#d32f2f', // MUI's error.main color
            }}
          />
      </Box>

      {/* Integrated logout confirmation content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        <Stack spacing={3} alignItems="start" sx={{ width: '100%', maxWidth: 400 }}>
          {/* Confirm Logout Title */}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.primary"
          >
            Confirm Logout
          </Typography>

          {/* Message */}
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
          >
            Are you sure you want to log out?
          </Typography>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={handleLogoutCancel}
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: 8,
                padding: '8px 24px',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant="contained"
              color="error"
              autoFocus
              sx={{
                borderRadius: 8,
                padding: '8px 24px',
                textTransform: 'none',
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Box>
    </DashboardContent>
  );
}