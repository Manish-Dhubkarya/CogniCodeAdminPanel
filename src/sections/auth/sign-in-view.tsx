import { useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { Iconify } from 'src/components/iconify';

interface SignInViewProps {
  open: boolean;
  onClose: () => void;
}

interface SignInFormData {
  emailOrPhone: string;
  password: string;
}

const initialFormData: SignInFormData = {
  emailOrPhone: '',
  password: '',
};

// Styled Drawer Paper
const DrawerPaper = styled('div')({
  width: '50vw',
  maxWidth: '600px',
  height: '100%',
  padding: '24px',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export function SignInView({ open, onClose }: SignInViewProps) {
  const [formData, setFormData] = useState<SignInFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});

  // Handle input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof SignInFormData];
      return newErrors;
    });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignInFormData, string>> = {};
    let isValid = true;

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone) &&
      !/^\+?\d{10,15}$/.test(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone = 'Invalid email or phone number';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      // Placeholder for backend submission logic
      console.log('Sign In submitted:', formData);
      // Reset form and close drawer
      setFormData(initialFormData);
      setErrors({});
      onClose();
    }
  }, [formData, onClose]);

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
        <Typography variant="h6">Sign In</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        name="emailOrPhone"
        label="Email or Phone"
        size="small"
        value={formData.emailOrPhone}
        onChange={handleInputChange}
        error={!!errors.emailOrPhone}
        helperText={errors.emailOrPhone}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        size="small"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        sx={{ mb: 3 }}
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
      />
      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Sign In
      </Button>
    </Drawer>
  );
}