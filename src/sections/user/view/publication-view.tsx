import { useState, useCallback, useEffect } from 'react';

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
  const [editData, setEditData] = useState<PublicationProps | null>(null);
  const handleAddPublication = (newData: PublicationProps) => {
  const newId = Date.now();
  const updated = [...publicationList, { ...newData, id: newId }];
  setPublicationList(updated);
  localStorage.setItem('publications', JSON.stringify(updated.slice(publicationData.length)));
};

  const dataFiltered: PublicationProps[] = applyFilter({
    inputData: publicationList,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  // console.log('dataFiltered', dataFiltered);
  
useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem('publications') || '[]');
  if (storedData.length > 0) {
    setPublicationList([...publicationData, ...storedData]);
  } else {
    setPublicationList(publicationData);
  }
}, []);


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
  onEditRow={(data) => setEditData(data)}
  onDeleteRow={(id) => {
  const updated = publicationList.filter((item) => item.id !== id);
  setPublicationList(updated);

  // Update localStorage
  const storedOnly = updated.slice(publicationData.length); // remove mock data part
  localStorage.setItem('publications', JSON.stringify(storedOnly));
}}
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
    data={null}
    onSave={(newData) => {
      handleAddPublication(newData);
      setOpenPopover(false); // Close the popover after saving
    }}
    anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
  />
)}

{/* Edit */}
{editData && (
  <AddPublicationData
    open={!!editData}
    data={
      editData
        ? {
            ...editData,
            status: (editData as any).status ?? '',
            isFeatured: (editData as any).isFeatured ?? false,
          }
        : null
    }
    onClose={() => setEditData(null)}
onSave={(newData) => {
  const updatedList = publicationList.map((item) =>
    item.id === newData.id ? { ...newData } : item
  );
  setPublicationList(updatedList);

  // Update localStorage
  const storedOnly = updatedList.slice(publicationData.length);
  localStorage.setItem('publications', JSON.stringify(storedOnly));

  setEditData(null);
}}

    anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
  />
)}
    </DashboardContent>
  );
}

