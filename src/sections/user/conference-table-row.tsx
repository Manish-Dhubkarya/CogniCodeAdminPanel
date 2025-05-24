import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
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

// ----------------------------------------------------------------------

export type ConferenceProps = {
  id: number;
  Sno: string;
  publisher: string;
  conferenceName: string;
  area: string;
  subject: string;
  Lds: string;
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

  const handleConfirmDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent any unexpected event bubbling
    setShowConfirmPopup(true);
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      onDeleteRow(row.id);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Show success message for 3 seconds
    }, 5000); // Show loader for 5 seconds
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{row.publisher}</TableCell>
        <TableCell>{row.conferenceName}</TableCell>
        <TableCell>{row.area}/{row.subject}</TableCell>
        <TableCell>{row.Lds}</TableCell>
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
          Are you sure you want to delete the changes?
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

      {/* Delete Message Popover */}
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