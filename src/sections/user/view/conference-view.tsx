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
    const formattedData = {
      ...newData,
      publisher: String(newData.publisher),
      conferenceName: String(newData.conferenceName),
      area: String(newData.area),
      subject: String(newData.subject),
      Lds: String(newData.Lds),
      registrationCharges: String(newData.registrationCharges),
      links: String(newData.links),
      id: newId,
      Sno: String(newId), // Ensure Sno is set for new rows
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
      // Ensure stored data has Sno
      const formattedStoredData = storedData.map((item: any) => ({
        ...item,
        Sno: item.Sno ?? String(item.id), // Fallback to id if Sno is missing
      }));
      setConferenceList([...conferenceData, ...formattedStoredData]);
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
          Conferences
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
          selectedIds={table.selected.map(Number)} // Directly use selected IDs
          onDeleteRows={handleDeleteRows} // Pass bulk delete handler
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <ConferenceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={conferenceList.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    conferenceList.map((row) => String(row.id)) // Use id for selection
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
                      selected={table.selected.includes(String(row.id))} // Use id for selection
                      onSelectRow={() => table.onSelectRow(String(row.id))} // Use id for selection
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
                  area: String(editData.area),
                  subject: String(editData.subject),
                  Lds: String(editData.Lds),
                  registrationCharges: String(editData.registrationCharges),
                  links: String(editData.links),
                }
              : null
          }
          onClose={() => setEditData(null)}
          onSave={(newData) => {
            const updatedList = conferenceList.map((item) =>
              // use publisher because id gives error
              item.publisher === newData.publisher
                ? {
                    ...item,
                    ...newData,
                    publisher: String(newData.publisher),
                    conferenceName: String(newData.conferenceName),
                    area: String(newData.area),
                    subject: String(newData.subject),
                    Lds: String(newData.Lds),
                    registrationCharges: String(newData.registrationCharges),
                    links: String(newData.links),
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