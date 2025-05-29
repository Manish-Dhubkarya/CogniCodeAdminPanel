import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { FaRegCheckCircle } from 'react-icons/fa';
import { Iconify } from 'src/components/iconify';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography, styled } from '@mui/material';
import { postData } from 'src/services/FetchBackendServices';

// ----------------------------------------------------------------------

export type ConferenceProps = {
  conferenceID: number;
  publisher: string;
  conferenceName: string;
  area: string;
  subject: string;
  lastDOfSub: string;
  registrationCharges: string;
  links: string;
};

type ConferenceTableRowProps = {
  row: ConferenceProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: (data: ConferenceProps) => void;
  onDeleteRow: (id: number) => void;
};

export function ConferenceTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: ConferenceTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
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

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = () => {
    handleClosePopover();
    onEditRow(row);
  };

  const handleDelete = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation(); // Prevent parent Popover from closing
    setShowConfirmDialog(true); // Open the confirmation dialog
    setOpenPopover(null); // Close the menu popover
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent any unexpected event bubbling
    setShowConfirmDialog(false); // Close confirmation dialog
    setShowLoader(true); // Show loader

    try {
      // Make a DELETE request to the backend using postData
      const result = await postData("conferences/delete_conference", { conferenceId: row.conferenceID });

      // Simulate loader for at least 1 second for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.status) {
        setShowLoader(false); // Hide loader
        onDeleteRow(row.conferenceID); // Notify parent to refetch data
        setShowSuccessMessage(true); // Show success message

        setTimeout(() => {
          setShowSuccessMessage(false); // Hide success message after 3 seconds
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to delete conference');
      }
    } catch (error) {
      console.error("Error deleting conference:", error);
      setShowLoader(false); // Hide loader on error
      setShowSuccessMessage(false); // Ensure success message is not shown
      // Optionally, show an error message to the user
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          {row.conferenceID}
        </TableCell>
        <TableCell>{row.publisher}</TableCell>
        <TableCell>{row.conferenceName}</TableCell>
        <TableCell>
          {row.area}/{row.subject}
        </TableCell>
        <TableCell>{row.lastDOfSub}</TableCell>
        <TableCell>{row.registrationCharges}</TableCell>
        <TableCell>{row.links}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Menu Popover */}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

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
            Are you sure you want to delete this conference?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
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

      {/* Delete Success Message Overlay */}
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
            Data deleted successfully
          </Typography>
        </SuccessPopoverPaper>
      </Box>
    </>
  );
}