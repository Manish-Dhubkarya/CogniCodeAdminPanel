import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';
import { FaRegCheckCircle } from 'react-icons/fa';
import { Button, CircularProgress, Stack, styled, Typography } from '@mui/material';
import { postData } from 'src/services/FetchBackendServices'; // Import the postData service

// ----------------------------------------------------------------------

export type PublicationProps = {
  publicationId: number;
  sourceTitle: string;
  citeScore: number;
  hPercentile: string;
  citations: number;
  documents: number;
  cited: number;
};

type PublicationTableRowProps = {
  row: PublicationProps;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: (data: PublicationProps) => void;
  onDeleteRow: (id: number) => void;
};

export function PublicationTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}: PublicationTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
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
    setShowConfirmPopup(true);
    setOpenPopover(null); // Close the menu popover
  };

  const handleCancelConfirm = () => {
    setShowConfirmPopup(false);
  };

  const handleConfirmDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent any unexpected event bubbling
    setShowConfirmPopup(false); // Close confirmation popup
    setShowLoader(true); // Show loader

    try {
      // Make a DELETE request to the backend using postData
      const result = await postData("publications/delete_publication", { publicationId: row.publicationId });

      // Simulate loader for at least 1 second for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.status) {
        setShowLoader(false); // Hide loader
        onDeleteRow(row.publicationId); // Notify parent to refetch data
        setShowSuccessMessage(true); // Show success message

        setTimeout(() => {
          setShowSuccessMessage(false); // Hide success message after 3 seconds
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to delete publication');
      }
    } catch (error) {
      console.error("Error deleting publication:", error);
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
        <TableCell align="left">{row.publicationId}</TableCell>
        <TableCell align="left">{row.sourceTitle}</TableCell>
        <TableCell align="center">{row.citeScore}</TableCell>
        <TableCell align="center">{row.hPercentile}</TableCell>
        <TableCell align="center">{row.citations}</TableCell>
        <TableCell align="center">{row.documents}</TableCell>
        <TableCell align="center">{row.cited}</TableCell>

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
          Are you sure you want to delete this publication?
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
            Confirm
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

      {/* Delete Success Message Popover */}
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
          Data deleted successfully
        </Typography>
      </Popover>
    </>
  );
}