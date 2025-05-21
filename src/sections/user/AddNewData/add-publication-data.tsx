import React, { useState, useEffect, useRef } from 'react';
import { FaRegCheckCircle } from "react-icons/fa";
import {
    Popover,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
    FormControlLabel,
    Checkbox,
    SelectChangeEvent,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface PublicationFormData {
    id: number;
    sourceTitle: string;
    citeScore: string;
    hPercentile: string;
    citations: string;
    documents: string;
    cited: string;
    status: string;
    isFeatured: boolean;
}

interface PublicationEditorPopoverProps {
    open: boolean;
    onClose: () => void;
    data: PublicationFormData | null;
    onSave: (updatedData: PublicationFormData) => void;
    anchorPosition?: { top: number; left: number };
    heading: string;
}

const initialFormData: PublicationFormData = {
    id: 0,
    sourceTitle: '',
    citeScore: '',
    hPercentile: '',
    citations: '',
    documents: '',
    cited: '',
    status: 'Published',
    isFeatured: false,
};

// Styled Confirmation Popover
const ConfirmationPopoverPaper = styled('div')({
    padding: 2,
    background: '#FFFFFF',
    borderRadius: 2,
    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
    width: '300px',
});

// Styled Success Popover
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

export const AddPublicationData: React.FC<PublicationEditorPopoverProps> = ({
    open,
    onClose,
    data,
    onSave,
    heading,
    anchorPosition = { top: window.innerHeight / 2, left: window.innerWidth / 2 },
}) => {
    const [formData, setFormData] = useState<PublicationFormData>(initialFormData);
    const [animate, setAnimate] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof PublicationFormData, boolean>>>({});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const paperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data) {
            setFormData(data);
        } else {
            setFormData(initialFormData);
        }
    }, [data, open]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: false }));
        setErrorMessage('');
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: false }));
        setErrorMessage('');
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PublicationFormData, boolean>> = {};
        let isValid = true;

        if (!formData.sourceTitle.trim()) {
            newErrors.sourceTitle = true;
            isValid = false;
        }
        if (!formData.citeScore.trim()) {
            newErrors.citeScore = true;
            isValid = false;
        }
        if (!formData.hPercentile.trim()) {
            newErrors.hPercentile = true;
            isValid = false;
        }
        if (!formData.citations || isNaN(Number(formData.citations)) || Number(formData.citations) < 0) {
            newErrors.citations = true;
            isValid = false;
        }
        if (!formData.documents || isNaN(Number(formData.documents)) || Number(formData.documents) < 0) {
            newErrors.documents = true;
            isValid = false;
        }
        if (!formData.cited || isNaN(Number(formData.cited)) || Number(formData.cited) < 0) {
            newErrors.cited = true;
            isValid = false;
        }
        if (!formData.status) {
            newErrors.status = true;
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) {
            setErrorMessage('Please fill all fields');
        }
        return isValid;
    };

    const handleSaveAttempt = () => {
        if (validateForm()) {
            setShowConfirmPopup(true);
        }
    };

    const handleConfirmSave = () => {
        setShowConfirmPopup(false);
        setShowLoader(true);

        setTimeout(() => {
            setShowLoader(false);
            onSave(formData); // Save data after loader
            setShowSuccessMessage(true);

            setTimeout(() => {
                setShowSuccessMessage(false);
                // Clear form fields after success message
                setFormData(initialFormData);
                setErrors({});
                setErrorMessage('');
            }, 3000); // Show success message for 2 seconds
        }, 5000); // Show loader for 1 second
    };

    const handleCancelConfirm = () => {
        setShowConfirmPopup(false);
    };

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (paperRef.current && !paperRef.current.contains(event.target as Node) && !animate) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 400);
        }
    };

    if (!open) return null;

    return (
        <>
            <Backdrop
                open={open}
                onClick={handleBackdropClick}
                sx={{
                    zIndex: 1200,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(12px) saturate(180%)',
                }}
            >
                <Popover
                    open={open}
                    onClose={() => {}} // Disable default close on backdrop click
                    anchorReference="anchorPosition"
                    anchorPosition={anchorPosition}
                    transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                    PaperProps={{
                        ref: paperRef,
                        onClick: (event: React.MouseEvent<HTMLDivElement>) => {
                            event.stopPropagation();
                        },
                        sx: {
                            padding: 3,
                            width: '90%',
                            maxWidth: '500px',
                            background: 'linear-gradient(to bottom, #FFFFFF, #E3F2FD)',
                            borderRadius: 2,
                            boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                            zIndex: 1300,
                            animation: animate ? 'popForward 0.4s ease-in-out' : 'none',
                            '@keyframes popForward': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.1)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        },
                    }}
                >
                    <Box component="form" noValidate autoComplete="off">
                        <Typography variant="h6" gutterBottom sx={{ color: '#0D47A1', textAlign: 'center', mb: 2 }}>
                            {heading}
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Source Title"
                                name="sourceTitle"
                                value={formData.sourceTitle}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.sourceTitle}
                                helperText={errors.sourceTitle ? 'This field is required' : ''}
                            />
                            <TextField
                                label="CiteScore"
                                name="citeScore"
                                value={formData.citeScore}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.citeScore}
                                helperText={errors.citeScore ? 'This field is required' : ''}
                            />
                            <TextField
                                label="H-Index Percentile"
                                name="hPercentile"
                                value={formData.hPercentile}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.hPercentile}
                                helperText={errors.hPercentile ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Citations"
                                name="citations"
                                value={formData.citations}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                error={!!errors.citations}
                                helperText={errors.citations ? 'Please enter a valid number' : ''}
                            />
                            <TextField
                                label="Documents"
                                name="documents"
                                value={formData.documents}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                error={!!errors.documents}
                                helperText={errors.documents ? 'Please enter a valid number' : ''}
                            />
                            <TextField
                                label="Cited Documents"
                                name="cited"
                                value={formData.cited}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="number"
                                error={!!errors.cited}
                                helperText={errors.cited ? 'Please enter a valid number' : ''}
                            />
                            <FormControl fullWidth size="small" error={!!errors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleSelectChange}
                                    label="Status"
                                >
                                    <MenuItem value="Published">Published</MenuItem>
                                    <MenuItem value="Under Review">Under Review</MenuItem>
                                    <MenuItem value="Draft">Draft</MenuItem>
                                </Select>
                                {errors.status && (
                                    <Typography variant="caption" color="error">
                                        This field is required
                                    </Typography>
                                )}
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                        name="isFeatured"
                                    />
                                }
                                label="Mark as Featured"
                            />
                            {errorMessage && (
                                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                    {errorMessage}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                <Button
                                    onClick={onClose}
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ borderRadius: 8, padding: '6px 16px' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveAttempt}
                                    variant="contained"
                                    color="primary"
                                    sx={{ borderRadius: 8, padding: '6px 16px' }}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Popover>

                {/* Confirmation Popover */}
                <Popover
                    onClick={(e) => e.stopPropagation()}
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
    color: "#1dd714",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }}
>
  <FaRegCheckCircle style={{ marginRight: 5 }} />
  Data saved successfully
</Typography>
                </Popover>
            </Backdrop>
        </>
    );
};