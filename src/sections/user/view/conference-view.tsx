// import { useState, useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// // import { _conference } from 'src/_mock';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { conferenceData } from 'src/_mock/_all-mock-data';
// import { Iconify } from 'src/components/iconify';
// import { Scrollbar } from 'src/components/scrollbar';

// import { TableNoData } from 'src/sections/user/table-no-data';
// import { ConferenceTableRow } from '../conference-table-row';
// import { ConferenceTableHead } from '../conference-table-head';
// import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
// import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';

// import type { ConferenceProps } from '../conference-table-row';
// import { useTable } from './user-view';

// // ----------------------------------------------------------------------

// export function ConferenceView() {
//   const table = useTable();

//   const [filterName, setFilterName] = useState('');

//   const dataFiltered: ConferenceProps[] = applyFilter({
//     inputData: conferenceData,
//     comparator: getComparator(table.order, table.orderBy),
//     filterName,
//   });
//   // console.log('dataFiltered', dataFiltered);



//   const notFound = !dataFiltered.length && !!filterName;

//   return (
//     <DashboardContent>
//       <Box
//         sx={{
//           mb: 5,
//           display: 'flex',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h4" sx={{ flexGrow: 1 }}>
//           Conferences
//         </Typography>
//         <Button
//           variant="contained"
//           color="inherit"
//           startIcon={<Iconify icon="mingcute:add-line" />}
//         >
//           New Conference
//         </Button>
//       </Box>

//       <Card>
//         {/* {/* numSelected: number;
//           filterName: string;
//           onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
//           selectedIds: number[]; // Added to receive selected item IDs
//           onDeleteRows: (ids: number[]) => void; */} 
//         <UserTableToolbar
//           numSelected={table.selected.length}
//           filterName={filterName}
//           onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
//             setFilterName(event.target.value);
//             table.onResetPage();
//           }}
//           selectedIds={table.selected.map(Number)}
//           onDeleteRows={(ids: number[]) => {
//             // Implement your delete logic here, or call a handler if available
//             // Example: table.onDeleteRows(ids);
//             // For now, just log the ids
//             console.log('Delete rows:', ids);
//           }}
//         />
//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 800 }}>
//               <ConferenceTableHead
//                 order={table.order}
//                 orderBy={table.orderBy}
//                 rowCount={conferenceData.length}
//                 numSelected={table.selected.length}
//                 onSort={table.onSort}
//                 onSelectAllRows={(checked) =>
//                   table.onSelectAllRows(
//                     checked,
//                     conferenceData.map((user) => user.Sno)
//                   )
//                 }
//                 headLabel={[
//                   { id: 'Sno', label: 'S. No' },
//                   { id: 'publisher', label: 'Publisher' },
//                   { id: 'conferenceName', label: 'Conference Name' },
//                   { id: 'Area_Subject', label: 'Area/Subject', align: 'center' },
//                   { id: 'Lds', label: 'Last date of Submission' },
//                   { id: 'registrationCharges', label: 'Registration Charges' },
//                   { id: 'links', label: 'Links' },
//                 ]}
//               />
//               <TableBody>
//                 {dataFiltered
//                   .slice(
//                     table.page * table.rowsPerPage,
//                     table.page * table.rowsPerPage + table.rowsPerPage
//                   )
//                   .map((row) => (
//                     <ConferenceTableRow
//                       key={row.id}
//                       row={row}
//                       selected={table.selected.includes(row.Sno)}
//                       onSelectRow={() => table.onSelectRow(row.Sno)}
//                     />
//                   ))}

//                 <TableEmptyRows
//                   height={68}
//                   emptyRows={emptyRows(table.page, table.rowsPerPage, conferenceData.length)}
//                 />

//                 {notFound && <TableNoData searchQuery={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           component="div"
//           page={table.page}
//           count={conferenceData.length}
//           rowsPerPage={table.rowsPerPage}
//           onPageChange={table.onChangePage}
//           rowsPerPageOptions={[5, 10, 25]}
//           onRowsPerPageChange={table.onChangeRowsPerPage}
//         />
//       </Card>
//     </DashboardContent>
//   );
// }


// New

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { DashboardContent } from 'src/layouts/dashboard';
import { conferenceData } from 'src/_mock/_all-mock-data';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
import { useTable } from './user-view';
import { ConferenceProps, ConferenceTableRow } from '../conference-table-row';
import { AddConferenceData } from '../AddNewData/add-conference-data';
import { ConferenceTableHead } from '../conference-table-head';

// ----------------------------------------------------------------------

export function ConferenceView() {
  const table = useTable();
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [filterName, setFilterName] = useState('');
  const [conferenceList, setConferenceList] = useState<ConferenceProps[]>(conferenceData);
  const [editData, setEditData] = useState<ConferenceProps | null>(null);

  const handleAddConference = (newData: any) => {
    const newId = Date.now();
    // Convert numeric fields to strings to match PublicationProps
    const formattedData = {
      ...newData,
      publisher: String(newData.publisher),
      conference: String(newData.conference),
      areaSub: String(newData.areaSub),
      Lsd: String(newData.Lsd),
      regCharges: String(newData.regCharges),
      links: String(newData.links),
      id: newId,
    };
    const updated = [...conferenceList, formattedData];
    setConferenceList(updated);
    localStorage.setItem('conferences', JSON.stringify(updated.slice(conferenceData.length)));
    setOpenPopover(false); // Close popover after saving
  };

  const handleDeleteRows = (ids: number[]) => {
    const updated = conferenceList.filter((item) => !ids.includes(item.id));
    setConferenceList(updated);
    table.onSelectAllRows(false, []); // Clear selected rows
    localStorage.setItem('conferences', JSON.stringify(updated.slice(conferenceData.length)));
  };

  const dataFiltered: ConferenceProps[] = applyFilter({
    inputData: conferenceList,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('conferences') || '[]');
    if (storedData.length > 0) {
      setConferenceList([...conferenceData, ...storedData]);
    } else {
      setConferenceList(conferenceData);
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
          Conference
        </Typography>
        <Button
          onClick={() => setOpenPopover(true)}
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
          selectedIds={table.selected.map(
            (Sno) =>
              conferenceList.find((item) => item.Sno === Sno)?.id
          ).filter((id): id is number => typeof id === 'number')} // Pass selected row IDs as numbers
          onDeleteRows={handleDeleteRows} // Pass bulk delete handler
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
                      selected={table.selected.includes(row.Sno)} // Use ID instead of sourceTitle
                      onSelectRow={() => table.onSelectRow(row.Sno)} // Use ID instead of sourceTitle
                      onEditRow={(data) => setEditData(data)}
                      onDeleteRow={(id: number) => {
                        const updated = conferenceList.filter((item) => item.id !== id);
                        setConferenceList(updated);
                        table.onSelectAllRows(
                          false,
                          table.selected.filter((selectedId) => selectedId !== String(id))
                        ); // Update selected
                        localStorage.setItem(
                          'conferences',
                          JSON.stringify(updated.slice(conferenceData.length))
                        );
                      }}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, conferenceList.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={conferenceList.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      {openPopover && (
        <AddConferenceData
          heading="Add New Conference"
          open={openPopover}
          onClose={() => setOpenPopover(false)}
          data={null}
          onSave={handleAddConference}
          anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
        />
      )}

      {editData && (
        <AddConferenceData
          heading="Edit Conference"
          open={!!editData}
          data={
            editData
              ? {
                ...editData,
                publisher: String(editData.publisher),
                conferenceName: String(editData.conferenceName),
                areaSub: String(editData.areaSub),
                Lds: String(editData.Lds),
                registrationCharges: String(editData.registrationCharges),
                links: String(editData.links),
              }
              : null
          }
          onClose={() => setEditData(null)}
          onSave={(newData) => {
            const updatedList = conferenceList.map((item) =>
              item.id === newData.id
                ? {
                    ...item,
                    ...newData,
                    publisher: String(newData.publisher),
                    conferenceName: String(newData.conferenceName),
                    areaSub: String(newData.areaSub),
                    Lds: String(newData.Lds),
                    registrationCharges: String(newData.registrationCharges),
                    Sno: item.Sno ?? String(item.id), // Ensure Sno is present
                  }
                : item
            ) as ConferenceProps[];
            setConferenceList(updatedList);
            localStorage.setItem(
              'conferences',
              JSON.stringify(updatedList.slice(conferenceData.length))
            );
            setEditData(null);
          }}
          anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
        />
      )}
    </DashboardContent>
  );
}

