import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { CircularProgress, Popover, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaExclamationCircle, FaRegCheckCircle } from 'react-icons/fa';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';
import { postData } from 'src/services/FetchBackendServices';
import { SignInView } from './sign-in-view';

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Styled Popovers
const ConfirmationPopoverPaper = styled('div')({
  padding: 2,
  background: '#FFFFFF',
  borderRadius: 2,
  boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
  width: '300px',
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
  adminName: string;
  adminMail: string;
  adminPhone: string;
  adminPic: File | null;
  adminPassword: string;
}

const initialFormData: AdminFormData = {
  adminName: '',
  adminMail: '',
  adminPhone: '',
  adminPic: null,
  adminPassword: '',
};

export function SignUpView() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});
  const [openSignIn, setOpenSignIn] = useState(false); // State for Sign In panel

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof AdminFormData];
      return newErrors;
    });
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, adminPic: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AdminFormData, string>> = {};
    let isValid = true;

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Name is required';
      isValid = false;
    }
    if (!formData.adminMail.trim()) {
      newErrors.adminMail = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminMail)) {
      newErrors.adminMail = 'Invalid email format';
      isValid = false;
    }
    if (!formData.adminPhone.trim()) {
      newErrors.adminPhone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.adminPhone)) {
      newErrors.adminPhone = 'Invalid phone number';
      isValid = false;
    }
    if (!formData.adminPassword.trim()) {
      newErrors.adminPassword = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      setShowConfirmPopup(true);
    }
  }, [formData]);

  // Handle confirmation cancel
  const handleCancelConfirm = () => {
    setShowConfirmPopup(false);
  };

  // Handle confirmation save
  const handleConfirmSave = useCallback(async () => {
    setShowConfirmPopup(false);
    setShowLoader(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('adminName', formData.adminName);
      formDataToSubmit.append('adminMail', formData.adminMail);
      formDataToSubmit.append('adminPhone', formData.adminPhone);
      if (formData.adminPic) {
        formDataToSubmit.append('adminPic', formData.adminPic);
      }
      formDataToSubmit.append('adminPassword', formData.adminPassword);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await postData('admin/submit_admin', formDataToSubmit);

      if (response && response.status) {
        setShowLoader(false);
        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
          setFormData(initialFormData);
          setSelectedFile(null);
          setPreviewUrl(null);
          setErrors({});
          router.push('/');
        }, 3000);
      } else {
        throw new Error(response?.message || 'No response received from server');
      }
    } catch (error) {
      setShowLoader(false);
      setErrorPopupMessage(error instanceof Error ? error.message : 'An error occurred');
      setShowErrorMessage(true);

      setTimeout(() => {
        setShowErrorMessage(false);
        setErrorPopupMessage('');
      }, 3000);
    }
  }, [formData, router]);

  // Handle Sign In link click
  const handleSignInClick = () => {
    setOpenSignIn(true);
  };

  // Handle Sign In panel close
  const handleSignInClose = () => {
    setOpenSignIn(false);
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
        name="adminName"
        label="Name"
        size="small"
        value={formData.adminName}
        onChange={handleInputChange}
        error={!!errors.adminName}
        helperText={errors.adminName}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      <TextField
        fullWidth
        name="adminMail"
        type="email"
        size="small"
        label="Email address"
        value={formData.adminMail}
        onChange={handleInputChange}
        error={!!errors.adminMail}
        helperText={errors.adminMail}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      <TextField
        fullWidth
        name="adminPhone"
        type="tel"
        size="small"
        label="Phone number"
        value={formData.adminPhone}
        onChange={handleInputChange}
        error={!!errors.adminPhone}
        helperText={errors.adminPhone}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      <Box sx={{ mb: 3, display: 'flex', gap: 7, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 1 }}
        >
          Upload Picture
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {selectedFile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
              />
            )}
          </Box>
        )}
      </Box>
      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>
      <TextField
        fullWidth
        name="adminPassword"
        size="small"
        onChange={handleInputChange}
        error={!!errors.adminPassword}
        helperText={errors.adminPassword}
        label="Password"
        type={showPassword ? 'text' : 'password'}
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
      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Submit
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
        <Typography variant="h5">Admin Sign In</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Already have an account?{' '}
          <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={handleSignInClick}>
            Sign in
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
      {/* Confirmation Popover */}
      <Popover
        open={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2.5, left: window.innerWidth / 2 }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          component: ConfirmationPopoverPaper,
          sx: { zIndex: 1400 },
        }}
      >
        <Typography variant="body1" sx={{ mb: 0, p: 1 }}>
          Are you sure you want to save the changes?
        </Typography>
        <Stack direction="row" spacing={2} padding={1} justifyContent="flex-end">
          <Button
            onClick={handleCancelConfirm}
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: 8, padding: '4px 12px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 8, padding: '4px 12px' }}
          >
            Save
          </Button>
        </Stack>
      </Popover>
      {/* Loader Popover */}
      <Popover
        open={showLoader}
        anchorReference="anchorPosition"
        anchorPosition={{ top: window.innerHeight / 2.5, left: window.innerWidth / 2 }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
        PaperProps={{
          sx: {
            zIndex: 1500,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 8,
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          },
        }}
      >
        <CircularProgress color="primary" size={40} />
      </Popover>
      {/* Success Message Popover */}
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
          Admin added successfully
        </Typography>
      </Popover>
      {/* Error Message Popover */}
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
          {errorPopupMessage || 'Failed to save data'}
        </Typography>
      </Popover>
      {/* Sign In Drawer */}
      <SignInView open={openSignIn} onClose={handleSignInClose} />
    </>
  );
}