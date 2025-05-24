import React, { useState, useEffect, useRef } from 'react';
import { FaRegCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { postData } from 'src/services/FetchBackendServices';
import {
    Popover,
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    SelectChangeEvent,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

export interface ConferenceFormData {
    publisher: string;
    conferenceName: string;
    area: string;
    subject: string;
    Lds: string;
    registrationCharges: string;
    links: string;
}

interface ConferenceEditorPopoverProps {
    open: boolean;
    onClose: () => void;
    data: ConferenceFormData | null;
    onSave: (updatedData: ConferenceFormData) => void;
    anchorPosition?: { top: number; left: number };
    heading: string;
}

const initialFormData: ConferenceFormData = {
    publisher: "",
    conferenceName: "",
    area: "",
    subject: "",
    Lds: "",
    registrationCharges: "",
    links: ""
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

export const AddConferenceData: React.FC<ConferenceEditorPopoverProps> = ({
    open,
    onClose,
    data,
    onSave,
    heading,
    anchorPosition = { top: window.innerHeight / 2, left: window.innerWidth / 2 },
}) => {
    const [formData, setFormData] = useState<ConferenceFormData>(initialFormData);
    const [animate, setAnimate] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState<string>('');
    const [errors, setErrors] = useState<Partial<Record<keyof ConferenceFormData, boolean>>>({});
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

    // const handleSelectChange = (event: SelectChangeEvent<string>) => {
    //     const { name, value } = event.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    //     setErrors((prev) => ({ ...prev, [name]: false }));
    //     setErrorMessage('');
    // };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ConferenceFormData, boolean>> = {};
        let isValid = true;

        if (!formData.conferenceName.trim()) {
            newErrors.conferenceName = true;
            isValid = false;
        }
        if (!formData.Lds.trim()) {
            newErrors.Lds = true;
            isValid = false;
        }
        if (!formData.area.trim()) {
            newErrors.area = true;
            isValid = false;
        }
        if (!formData.subject.trim()) {
            newErrors.subject = true;
            isValid = false;
        }
        if (!formData.publisher.trim()) {
            newErrors.publisher = true;
            isValid = false;
        }
        if (!formData.links.trim()) {
            newErrors.links = true;
            isValid = false;
        }
        if (!formData.registrationCharges.trim()) {
            newErrors.registrationCharges = true;
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
        console.log("Enter inside confirm Save");
        console.log("Form Data publisher before sending:", formData.publisher);

        try {
            const body={"publisher":formData.publisher, "conferenceName":formData.conferenceName, "area":formData.area, "subject":formData.subject, "lastDOfSub":formData.Lds, "registrationCharges":formData.registrationCharges, "links":formData.links}

    
            const response = await postData("conferences/submit_conference", body)

            if (response) {
                console.log("Data saved successfully:", response);
                setShowLoader(false);
                onSave(formData); // Save data after successful submission
                setShowSuccessMessage(true);

                setTimeout(() => {
                    setShowSuccessMessage(false);
                    // Clear form fields after success message
                    setFormData(initialFormData);
                    setErrors({});
                    setErrorMessage('');
                }, 3000); // Show success message for 3 seconds
            } else {
                console.error("Failed to save data:", response.message);
                throw new Error(response.message || 'Failed to save data');
            }
        } catch (error) {
            console.error("Catch Error saving data:", error);
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
                                label="Publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.publisher}
                                helperText={errors.publisher ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Conference"
                                name="conferenceName"
                                value={formData.conferenceName}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.conferenceName}
                                helperText={errors.conferenceName ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Area"
                                name="area"
                                value={formData.area}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.area}
                                helperText={errors.area ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.subject}
                                helperText={errors.subject ? 'This field is required' : ''}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name="Lds"
                                    label="Last Date of Submission"
                                    value={formData.Lds ? dayjs(formData.Lds, 'DD-MM-YYYY') : null} // Parse the stored value
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            Lds: value && dayjs(value).isValid() ? dayjs(value).format('DD-MM-YYYY') : '',
                                        }));
                                        setErrors((prev) => ({ ...prev, Lds: false }));
                                        setErrorMessage('');
                                    }}
                                    format="DD-MM-YYYY" // Explicitly set the display and input format
                                    slotProps={{
                                        textField: {
                                            name: "Lds",
                                            error: !!errors.Lds,
                                            helperText: errors.Lds ? 'This field is required' : '',
                                            size: "small",
                                            fullWidth: true,
                                            variant: "outlined",
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <TextField
                                label="Registration Charges"
                                name="registrationCharges"
                                value={formData.registrationCharges}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.registrationCharges}
                                helperText={errors.registrationCharges ? 'This field is required' : ''}
                            />
                            <TextField
                                label="Links"
                                name="links"
                                value={formData.links}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                size="small"
                                error={!!errors.links}
                                helperText={errors.links ? 'Please enter a valid number' : ''}
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
                        Data saved successfully
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