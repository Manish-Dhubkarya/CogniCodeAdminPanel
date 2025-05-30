import type { IconButtonProps } from '@mui/material/IconButton';
import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter, usePathname } from 'src/routes/hooks';
import { useAuth } from 'src/sections/auth/auth'; // Ensure this points to auth.tsx
import { serverURL } from 'src/services/FetchBackendServices';

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountPopover({ data = [], sx, ...other }: AccountPopoverProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State for the confirmation dialog

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleSignIn = useCallback(() => {
    handleClosePopover();
    router.push('/sign-in');
  }, [handleClosePopover, router]);

  const handleLogoutRequest = useCallback(() => {
    setOpenDialog(true); // Open the confirmation dialog
  }, [handleClosePopover]);

  const handleLogoutConfirm = useCallback(() => {
    setOpenDialog(false); // Close the dialog
    setUser(null); // Clear user from context and localStorage
    router.push('/sign-in'); // Redirect to sign-in
  }, [router, setUser]);

  const handleLogoutCancel = useCallback(() => {
    setOpenDialog(false); // Close the dialog without logging out
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        <Avatar
          src={user?.photoURL ? `${serverURL}/images/${user.photoURL}` : undefined}
          alt={user?.displayName || 'User'}
          sx={{ width: 1, height: 1 }}
        >
          {user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        {user ? (
          <>
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="subtitle2" noWrap>
                {user.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user.email}
              </Typography>
              {user.phone && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user.phone}
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuList
              disablePadding
              sx={{
                p: 1,
                gap: 0.5,
                display: 'flex',
                flexDirection: 'column',
                [`& .${menuItemClasses.root}`]: {
                  px: 1,
                  gap: 2,
                  borderRadius: 0.75,
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  [`&.${menuItemClasses.selected}`]: {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightSemiBold',
                  },
                },
              }}
            >
              {data.map((option) => (
                <MenuItem
                  key={option.label}
                  selected={option.href === pathname}
                  onClick={() => handleClickItem(option.href)}
                >
                  {option.icon}
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                color="error"
                size="medium"
                variant="text"
                onClick={handleLogoutRequest} // Show confirmation dialog instead of immediate logout
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Not signed in
            </Typography>
            <Button
              fullWidth
              color="primary"
              size="medium"
              variant="contained"
              onClick={handleSignIn}
              sx={{ mt: 1 }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Popover>

      {/* Confirmation Dialog for Logout */}
      <Dialog
        open={openDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-confirm-dialog-title"
        aria-describedby="logout-confirm-dialog-description"
      >
        <DialogTitle id="logout-confirm-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-confirm-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}