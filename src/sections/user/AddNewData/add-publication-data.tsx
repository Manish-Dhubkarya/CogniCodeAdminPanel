import React, { useState, useEffect, useRef } from 'react';
import { FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";
import {
    Popover,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    Backdrop,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { postData } from 'src/services/FetchBackendServices';

import { styled } from '@mui/material/styles';

export interface PublicationFormData {
    publicationId?: number | null; // Maps to conferenceId
    sourceTitle: string; // Maps to publisher
    citeScore: string; // Maps to conferenceName
    hPercentile: string; // Maps to area
    citations: string; // Maps to subject
    documents: string; // Maps to Lds
    cited: string; // Maps to registrationCharges
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
    publicationId: null,
    sourceTitle: '',
    citeScore: '',
    hPercentile: '',
    citations: '',
    documents: '',
    cited: '',
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

// Styled Error Popover
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
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState<string>('');
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
        if (!formData.citations.trim()) {
            newErrors.citations = true;
            isValid = false;
        }
        if (!formData.documents.trim()) {
            newErrors.documents = true;
            isValid = false;
        }
        if (!formData.cited.trim()) {
            newErrors.cited = true;
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) {
            setErrorMessage('Please fill all fields');
        }
        return isValid;
    };

    const handleSaveAttempt = async () => {
        if (validateForm()) {
            setShowConfirmPopup(true);
        }
    };

    const handleConfirmSave = async () => {
        setShowConfirmPopup(false);
        setShowLoader(true);
        console.log("Form Data before sending:", formData);

        try {
            const body = {
                publicationId: formData.publicationId,
                sourceTitle: formData.sourceTitle,
                citeScore: formData.citeScore,
                highestPercentile: formData.hPercentile,
                citations: formData.citations,
                documents: formData.documents,
                cited: formData.cited,
            };

            // Determine the endpoint based on whether we're adding or editing
            const endpoint = formData.publicationId
                ? "publications/update_publication"
                : "publications/submit_publication";

            const response = await postData(endpoint, body);

            // Ensure loader is visible for at least 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (response && response.status) {
                console.log("Data saved/updated successfully:", response);
                setShowLoader(false);
                onSave(formData); // Notify parent to refetch data
                setShowSuccessMessage(true);

                setTimeout(() => {
                    setShowSuccessMessage(false);
                    // Clear form fields after success message
                    setFormData(initialFormData);
                    setErrors({});
                    setErrorMessage('');
                }, 3000); // Show success message for 3 seconds
            } else {
                throw new Error(response?.message || 'No response received from server');
            }
        } catch (error) {
            console.error("Error saving/updating data:", error);
            setShowLoader(false);
            setErrorPopupMessage(error instanceof Error ? error.message : 'An error occurred');
            setShowErrorMessage(true);

            setTimeout(() => {
                setShowErrorMessage(false);
                setErrorPopupMessage('');
            }, 3000); // Show error message for 3 seconds
        }
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
                    onClose={() => { }} // Disable default close on backdrop click
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
                                label="Cite Score"
                                name="citeScore"
                                value={formData.citeScore}
                                onChange={handleInputChange}
                                fullWidth
                                type='number'
                                variant="outlined"
                                size="small"
                                error={!!errors.citeScore}
                                helperText={errors.citeScore ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Highest Percentile"
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
                                type='number'
                                variant="outlined"
                                size="small"
                                error={!!errors.citations}
                                helperText={errors.citations ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Documents"
                                name="documents"
                                value={formData.documents}
                                onChange={handleInputChange}
                                fullWidth
                                type='number'
                                variant="outlined"
                                size="small"
                                error={!!errors.documents}
                                helperText={errors.documents ? 'This field is required' : ''}
                                ></TextField>
                            <TextField
                                label="Cited"
                                name="cited"
                                value={formData.cited}
                                onChange={handleInputChange}
                                fullWidth
                                type='number'
                                variant="outlined"
                                size="small"
                                error={!!errors.cited}
                                helperText={errors.cited ? 'This field is required' : ''}
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
                <Dialog
        open={showConfirmPopup}
        onClick={(e) => e.stopPropagation()}
        onClose={() => setShowConfirmPopup(false)}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-dialog-description">
Are you sure you want to save the changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="error" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
                    onClose={() => { }} // Disable manual closing; handled by timer
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
                        {formData.publicationId ? 'Data updated successfully' : 'Data added successfully'}
                    </Typography>
                </Popover>

                {/* Error Message Popover */}
                <Popover
                    open={showErrorMessage}
                    onClose={() => { }} // Disable manual closing; handled by timer
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
                            color: "#D32F2F",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <FaExclamationCircle style={{ marginRight: 5 }} />
                        {errorPopupMessage || 'Failed to save data'}
                    </Typography>
                </Popover>
            </Backdrop>
        </>
    );
};