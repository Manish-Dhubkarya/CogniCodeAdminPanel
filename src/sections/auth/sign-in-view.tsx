import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Iconify } from 'src/components/iconify';
import { FaExclamationCircle, FaRegCheckCircle } from 'react-icons/fa';
import { CircularProgress, Divider, Link, Popover } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { postData } from 'src/services/FetchBackendServices';
import { SignUpView } from './sign-up-view';
import { useAuth } from './auth';

// Styled Components
const LoaderPopoverPaper = styled('div')({
  padding: 16,
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 8,
  boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
  width: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const SuccessPopoverPaper = styled('div')({
  padding: 16,
  background: '#FFFFFF',
  borderRadius: 8,
  boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
  width: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#4CAF50',
});

const ErrorPopoverPaper = styled('div')({
  padding: 16,
  background: '#FFFFFF',
  borderRadius: 8,
  boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
  width: '300px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#D32F2F',
});

// Admin Form Data Interface
export interface AdminFormData {
  adminIdentifier: string; // Combined field for admin name or email
  adminPassword: string;
}

const initialFormData: AdminFormData = {
  adminIdentifier: '',
  adminPassword: '',
};

export function SignInView() {
  const [formData, setFormData] = useState<AdminFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [backendMessage, setBackendMessage] = useState<string>('');
  const router = useRouter();
  const { setUser } = useAuth();
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof AdminFormData];
      return newErrors;
    });
    setBackendMessage(''); // Clear backend message on input change
  };

  // Validate form data
  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof AdminFormData, string>> = {};
    let isValid = true;

    if (!formData.adminIdentifier.trim()) {
      newErrors.adminIdentifier = 'Admin name or email is required';
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminIdentifier) && // Check if it's not a valid email
      formData.adminIdentifier.length < 3 // Check if admin name is too short
    ) {
      newErrors.adminIdentifier = 'Admin name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.adminPassword.trim()) {
      newErrors.adminPassword = 'Password is required';
      isValid = false;
    } else if (formData.adminPassword.length < 8) {
      newErrors.adminPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const isValid = await validateForm();
    if (isValid) {
      setShowLoader(true);
      setBackendMessage('Details checking...');

      try {
        const [response] = await Promise.all([
          postData('admin/check_admin_signin', {
            adminName: formData.adminIdentifier,
            adminPassword: formData.adminPassword,
          }),
          new Promise((resolve) => setTimeout(resolve, 1000)), // Minimum loader duration
        ]);

        setShowLoader(false);

        if (response && response.status) {
          // Update context with matched admin's details
          setUser({
            displayName: response.data.adminName,
            email: response.data.adminMail,
            phone: response.data.adminPhone || '',
            photoURL: response.data.adminPic ? response.data.adminPic : '/default-avatar.webp',
          });

          setBackendMessage(response.message || 'Admin signed in successfully');
          setShowSuccessMessage(true);

          setTimeout(() => {
            setShowSuccessMessage(false);
            setFormData(initialFormData);
            setErrors({});
            setBackendMessage('');
            router.push('/');
          }, 3000);
        } else {
          setBackendMessage('Invalid Emailid/Mobileno/Password');
          setShowErrorMessage(true);

          setTimeout(() => {
            setShowErrorMessage(false);
            setBackendMessage('');
          }, 3000);
        }
      } catch (error) {
        setShowLoader(false);
        setBackendMessage(error instanceof Error ? error.message : 'An error occurred during sign-in');
        setShowErrorMessage(true);

        setTimeout(() => {
          setShowErrorMessage(false);
          setBackendMessage('');
        }, 3000);
      }
    }
  }, [formData, router, setUser]);

  // Handle Sign Up link click
  const handleSignUpClick = () => {
    setOpenSignUp(true);
  };

  // Handle Sign Up panel close
  const handleSignUpClose = () => {
    setOpenSignUp(false);
  };

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="adminIdentifier"
        label="Admin Name or Email"
        size="small"
        value={formData.adminIdentifier}
        onChange={handleInputChange}
        error={!!errors.adminIdentifier}
        helperText={errors.adminIdentifier}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      <TextField
        fullWidth
        name="adminPassword"
        size="small"
        onChange={handleInputChange}
        error={!!errors.adminPassword}
        helperText={errors.adminPassword}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={formData.adminPassword}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />
      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>
      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">Admin Sign in</Typography>
          <VerifiedUserIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don't have an account?{' '}
          <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={handleSignUpClick}>
            Sign up
          </Link>
        </Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box>
      <Popover
        open={showLoader}
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2.5, left: window.innerWidth / 2 }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          component: LoaderPopoverPaper,
          sx: { zIndex: 1500 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress color="primary" size={40} />
          <Typography variant="body1">{backendMessage || 'Details checking...'}</Typography>
        </Box>
      </Popover>
      <Popover
        open={showSuccessMessage}
        onClose={() => {}} // Disable manual closing; handled by timer
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2.5, left: window.innerWidth / 2 }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          component: SuccessPopoverPaper,
          sx: { zIndex: 1500 },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: '#4CAF50',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaRegCheckCircle style={{ marginRight: 5 }} />
          {backendMessage || 'Admin signed in successfully'}
        </Typography>
      </Popover>
      <Popover
        open={showErrorMessage}
        onClose={() => {}} // Disable manual closing; handled by timer
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2.5, left: window.innerWidth / 2 }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          component: ErrorPopoverPaper,
          sx: { zIndex: 1500 },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: '#D32F2F',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaExclamationCircle style={{ marginRight: 5 }} />
          {backendMessage}
        </Typography>
      </Popover>
      <SignUpView open={openSignUp} onClose={handleSignUpClose} />
    </>
  );
}
