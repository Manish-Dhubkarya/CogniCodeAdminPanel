import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { publicationData } from 'src/_mock/_all-mock-data';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
import { useTable } from './user-view';
import { PublicationProps, PublicationTableRow } from '../publication-table-row';
import { PublicationTableHead } from '../publication-table-head';
import { AddPublicationData } from '../AddNewData/add-publication-data';

// ----------------------------------------------------------------------

export function PublicationView() {
  const table = useTable();
  const [openPopover, setOpenPopover] = useState<boolean | null>(false);
  const [filterName, setFilterName] = useState('');
  const [publicationList, setPublicationList] = useState<PublicationProps[]>(publicationData);
  // Accept newData as PublicationFormData, then add id to create PublicationProps
  const handleAddPublication = (newData: PublicationProps) => {
  const newId = publicationList.length + 1;
  const updated = [...publicationList, { ...newData, id: newId }];
  setPublicationList(updated);
};

  const dataFiltered: PublicationProps[] = applyFilter({
    inputData: publicationList,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  // console.log('dataFiltered', dataFiltered);
  


  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Publications
        </Typography>
        <Button
        onClick={()=>setOpenPopover(true)}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Publication
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PublicationTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={publicationList.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    publicationList.map((user) => user.sourceTitle)
                  )
                }
                headLabel={[
                  { id: 'sourceT', label: 'Source Title' },
                  { id: 'citeScore', label: 'Cite Score' },
                  { id: 'hPercentile', label: 'Highest Percentile' },
                  { id: 'citations', label: 'Citations 2024-25', align: 'center' },
                  { id: 'documents', label: 'Documents 2024-25' },
                  { id: 'cited', label: 'Cited' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <PublicationTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.sourceTitle)}
                      onSelectRow={() => table.onSelectRow(row.sourceTitle)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, publicationList.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={publicationList.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      {openPopover && (
  <AddPublicationData
    open={openPopover}
    onClose={() => setOpenPopover(false)}
    data={publicationList}
    onSave={(newData) => {
      handleAddPublication(newData);
      setOpenPopover(false); // Close the popover after saving
    }}
    anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
  />
)}
    </DashboardContent>
  );
}

