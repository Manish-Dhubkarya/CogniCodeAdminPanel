import React, { useState, useEffect } from 'react';
import {
    Popover,
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Stack,
} from '@mui/material';

export interface PublicationFormData {
    id: number;
    sourceTitle: string;
    citeScore: string;
    hPercentile: string;
    citations: string;
    documents: string;
    cited: string;
    status: string; // Added for dropdown example
    isFeatured: boolean; // Added for checkbox example
}

interface PublicationEditorPopoverProps {
    open: boolean;
    onClose: () => void;
    data: PublicationFormData | null;
    onSave: (updatedData: PublicationFormData) => void;
    anchorPosition?: { top: number; left: number };
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

export const AddPublicationData: React.FC<PublicationEditorPopoverProps> = ({
    open,
    onClose,
    data,
    onSave,
    anchorPosition = { top: 20, left: window.innerWidth / 2 }, // Default to top-center
}) => {
    const [formData, setFormData] = useState<PublicationFormData>(initialFormData);

    useEffect(() => {
        if (data) {
            setFormData(data);
        } else {
            setFormData(initialFormData); // Reset if no data (e.g. for a new entry form)
        }
    }, [data, open]); // Depend on open to re-initialize if data changes while closed

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value, type } = event.target as HTMLInputElement;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name!]: (event.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name!]: value }));
        }
    };

    // const handleSelectChange = (event: any) => { // mui.com/material-ui/api/select/#props / mui.com/material-ui/api/select/#SelectChangeEvent
    //     const { name, value } = event.target;
    //     setFormData((prev) => ({ ...prev, [name!]: value as string }));
    // };


    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Popover
            open={open}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{
                sx: {
                    padding: 3,
                    width: '90%',
                    maxWidth: '500px',
                    background: 'linear-gradient(to bottom, #FFFFFF, #E3F2FD)', // White to light blue gradient
                    borderRadius: 2,
                    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                },
            }}
        >
            <Box component="form" noValidate autoComplete="off">
                <Typography variant="h6" gutterBottom sx={{ color: '#0D47A1', textAlign: 'center', marginBottom: 2 }}>
                    Add Publication Data
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Source Title"
                        name="sourceTitle"
                        value={formData.sourceTitle}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="CiteScore"
                        name="citeScore"
                        value={formData.citeScore}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                    />
                    <TextField
                        label="H-Index Percentile"
                        name="hPercentile"
                        value={formData.hPercentile}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                    />
                    <TextField
                        label="Citations"
                        name="citations"
                        value={formData.citations}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="number"
                    />
                    <TextField
                        label="Documents"
                        name="documents"
                        value={formData.documents}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="number"
                    />
                    <TextField
                        label="Cited Documents"
                        name="cited"
                        value={formData.cited}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="number"
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={onClose} variant="outlined" color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Popover>
    );
};
