import { useState, useCallback } from 'react';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type PublicationProps = {
    id: number;
    sourceTitle: string;
    citeScore: string;
    hPercentile: string;
    citations: string;
    documents: string;
    cited: string;
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

    const handleDelete = () => {
        handleClosePopover();
        onDeleteRow(row.id);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

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
        </>
    );
}
