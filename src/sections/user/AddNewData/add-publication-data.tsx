import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

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
    anchorPosition = { top: 20, left: window.innerWidth / 2 },
}) => {
    const [formData, setFormData] = useState<PublicationFormData>(initialFormData);

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
    };

    // ✅ Select handler
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            PaperProps={{
                sx: {
                    padding: 3,
                    width: '90%',
                    maxWidth: '500px',
                    background: 'linear-gradient(to bottom, #FFFFFF, #E3F2FD)',
                    borderRadius: 2,
                    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)',
                },
            }}
        >
            <Box component="form" noValidate autoComplete="off">
                <Typography variant="h6" gutterBottom sx={{ color: '#0D47A1', textAlign: 'center', mb: 2 }}>
                    Add Publication Data
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
                    />
                    <TextField
                        label="CiteScore"
                        name="citeScore"
                        value={formData.citeScore}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="H-Index Percentile"
                        name="hPercentile"
                        value={formData.hPercentile}
                        onChange={handleInputChange}
                        fullWidth
                        variant="outlined"
                        size="small"
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
                    />

                    <FormControl fullWidth size="small">
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
