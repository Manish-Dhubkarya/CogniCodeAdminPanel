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
};

export function PublicationTableRow({ row, selected, onSelectRow }: PublicationTableRowProps) {
    const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenPopover(event.currentTarget);
    }, []);

    const handleClosePopover = useCallback(() => {
        setOpenPopover(null);
    }, []);

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
                </TableCell>

                <TableCell align='left'>
                   {row.sourceTitle}
                </TableCell>
                <TableCell align='center'>{row.citeScore} </TableCell>
                <TableCell align='center'>{row.hPercentile}</TableCell>
                <TableCell align='center'>{row.citations}</TableCell>
                <TableCell align='center'>{row.documents}</TableCell>
                <TableCell align='center'>{row.cited}</TableCell>
                {/* <TableCell>
          <Label color={(row.id === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}

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
                    <MenuItem onClick={handleClosePopover}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                    </MenuItem>

                    <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </Popover>
        </>
    );
}
