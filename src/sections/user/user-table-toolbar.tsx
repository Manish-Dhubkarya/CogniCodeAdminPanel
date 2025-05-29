import { useState, useCallback } from 'react';

import { FaRegCheckCircle } from 'react-icons/fa';
import { styled } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Changed to Dialog
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    event.stopPropagation(); // Prevent any unexpected event bubbling
    setShowConfirmDialog(true);
  };

  const handleCancelConfirm = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  const handleConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowConfirmDialog(false); // Close the dialog
    setShowLoader(true); // Show loader

    setTimeout(() => {
      setShowLoader(false); // Hide loader
      setShowSuccessMessage(true); // Show success message

      setTimeout(() => {
        onDeleteRows(selectedIds); // Notify parent to delete rows
        setShowSuccessMessage(false); // Hide success message
      }, 1500); // Show success message for 1.5 seconds
    }, 1000); // Show loader for 1 second (reduced from 5 seconds for better UX)
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

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        aria-labelledby="delete-confirm-dialog-title"
        aria-describedby="delete-confirm-dialog-description"
      >
        <DialogTitle id="delete-confirm-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirm-dialog-description">
            Are you sure you want to delete {numSelected} selected item{numSelected > 1 ? 's' : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loader Overlay */}
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

      {/* Success Message Overlay */}
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
        </SuccessPopoverPaper>
      </Box>
    </>
  );
}