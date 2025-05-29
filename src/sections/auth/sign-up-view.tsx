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
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, Drawer, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FaExclamationCircle, FaRegCheckCircle } from 'react-icons/fa';
import { useRouter } from 'src/routes/hooks';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Iconify } from 'src/components/iconify';
import { postData } from 'src/services/FetchBackendServices';

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

// Styled Popovers for Success and Error Messages
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

const DrawerPaper = styled('div')({
  width: '100vw',
  maxWidth: '600px',
  height: '100%',
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

interface SignUpViewProps {
  open?: boolean;
  onClose?: () => void;
}

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

export function SignUpView({ open, onClose }: SignUpViewProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorPopupMessage, setErrorPopupMessage] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof AdminFormData, string>>>({});

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

  // Handle removing the uploaded image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, adminPic: null }));
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
      setShowConfirmDialog(true);
    }
  }, [formData]);

  // Handle confirmation cancel
  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  // Handle confirmation save
  const handleConfirmSave = useCallback(async () => {
    setShowConfirmDialog(false);
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
      <Box sx={{ mb: 3, display: 'flex', gap: 10, alignItems: 'center', flexDirection: 'row', width: '100%' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
              />
            )}
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.default' },
              }}
            >
              <CloseIcon color='error' fontSize="small" />
            </IconButton>
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
        value={formData.adminPassword} // Added value prop to ensure controlled input
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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        component: DrawerPaper,
        sx: { zIndex: 1300 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 30, color: 'success.main' }} />
          <Typography variant="h5">Admin Sign up</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      />
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

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        aria-labelledby="signup-confirm-dialog-title"
        aria-describedby="signup-confirm-dialog-description"
      >
        <DialogTitle id="signup-confirm-dialog-title">Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="signup-confirm-dialog-description">
            Are you sure you want to save the changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loader Popover */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: showLoader ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1500,
        }}
      >
        <CircularProgress color="primary" size={40} />
      </Box>

      {/* Success Message Popover */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: showSuccessMessage ? 'block' : 'none',
          zIndex: 1500,
        }}
      >
        <SuccessPopoverPaper>
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
        </SuccessPopoverPaper>
      </Box>

      {/* Error Message Popover */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: showErrorMessage ? 'block' : 'none',
          zIndex: 1500,
        }}
      >
        <ErrorPopoverPaper>
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
        </ErrorPopoverPaper>
      </Box>
    </Drawer>
  );
}