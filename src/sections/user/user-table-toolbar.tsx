import { useState, useCallback } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material';
import { FaRegCheckCircle } from 'react-icons/fa';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedIds: number[]; // Added to receive selected item IDs
  onDeleteRows: (ids: number[]) => void; // Added to handle deletion
};

export function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selectedIds,
  onDeleteRows,
}: UserTableToolbarProps) {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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

 const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevent parent Popover from closing
        setShowConfirmPopup(true);
    };


  const handleCancelConfirm = useCallback(() => {
    setShowConfirmPopup(false);
  }, []);

  const handleConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowConfirmPopup(true);
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setShowConfirmPopup(false);
      
      setShowSuccessMessage(true);
      setTimeout(() => {
        onDeleteRows(selectedIds);
        setShowSuccessMessage(false);
      }, 3000); // Show success message for 3 seconds
    }, 5000); // Show loader for 5 seconds
  };

  return (
    <>
      <Toolbar
        sx={{
          height: 96,
          display: 'flex',
          justifyContent: 'space-between',
          p: (theme) => theme.spacing(0, 1, 0, 3),
          ...(numSelected > 0 && {
            color: 'primary.main',
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search here..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>

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
          Are you sure you want to delete {numSelected} selected item{numSelected > 1 ? 's' : ''}?
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
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 8, padding: '4px 12px' }}
          >
            Delete
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
            color: '#1dd714',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FaRegCheckCircle style={{ marginRight: 5 }} />
          {numSelected} item{numSelected > 1 ? 's' : ''} deleted successfully
        </Typography>
      </Popover>
    </>
  );
}