import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import { _conference } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { conferenceData } from 'src/_mock/_all-mock-data';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from 'src/sections/user/table-no-data';
import { ConferenceTableRow } from '../conference-table-row';
import { ConferenceTableHead } from '../conference-table-head';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';

import type { ConferenceProps } from '../conference-table-row';
import { useTable } from './user-view';

// ----------------------------------------------------------------------

export function ConferenceView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: ConferenceProps[] = applyFilter({
    inputData: conferenceData,
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
          Conferences
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Conference
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
              <ConferenceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={conferenceData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    conferenceData.map((user) => user.Sno)
                  )
                }
                headLabel={[
                  { id: 'Sno', label: 'S. No' },
                  { id: 'publisher', label: 'Publisher' },
                  { id: 'conferenceName', label: 'Conference Name' },
                  { id: 'Area_Subject', label: 'Area/Subject', align: 'center' },
                  { id: 'Lds', label: 'Last date of Submission' },
                  { id: 'registrationCharges', label: 'Registration Charges' },
                  { id: 'links', label: 'Links' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <ConferenceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.Sno)}
                      onSelectRow={() => table.onSelectRow(row.Sno)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, conferenceData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={conferenceData.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

