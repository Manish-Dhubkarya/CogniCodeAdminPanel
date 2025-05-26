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
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';
import { useTable } from './user-view';
import { ConferenceTableRow } from '../conference-table-row';
import { AddConferenceData } from '../AddNewData/add-conference-data';
import { ConferenceTableHead } from '../conference-table-head';
import { getData, postData } from 'src/services/FetchBackendServices';

// Define the interface for conference data based on the backend response
interface ConferenceProps {
  conferenceID: number;
  publisher: string;
  conferenceName: string;
  area: string;
  subject: string;
  lastDOfSub: string;
  registrationCharges: string;
  links: string;
}

// ----------------------------------------------------------------------

export function ConferenceView() {
  const table = useTable();
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [filterName, setFilterName] = useState('');
  const [conferenceList, setConferenceList] = useState<ConferenceProps[]>([]);
  const [editData, setEditData] = useState<ConferenceProps | null>(null);

  // Fetch all conferences from the backend
  const fetchAllConferences = async () => {
    try {
      const response = await getData("conferences/display_all_conferences");
      if (response && response.data) {
        // Map the response data to match the ConferenceProps interface
        const formattedData = response.data.map((item: any) => ({
          conferenceID: item.conferenceId, // Match backend field name
          publisher: String(item.publisher),
          conferenceName: String(item.conferenceName),
          area: String(item.area),
          subject: String(item.subject),
          lastDOfSub: String(item.lastDOfSub),
          registrationCharges: String(item.registrationCharges),
          links: String(item.links),
        }));
        setConferenceList(formattedData);
      } else {
        console.error("No data received from the backend");
        setConferenceList([]);
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      setConferenceList([]);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllConferences();
  }, []);

  // Handle adding a new conference
  const handleAddConference = async (newData: any) => {
    try {
      await fetchAllConferences();
    } catch (error) {
      console.error("Error after adding conference:", error);
      await fetchAllConferences(); // Refetch to ensure consistency
    }
  };

  // Handle deleting rows (bulk deletion)
  const handleDeleteRows = async (ids: number[]) => {
    try {
      for (const id of ids) {
        const result = await postData("conferences/delete_conference", { conferenceId: id });
        if (!result.status) {
          throw new Error(result.message || `Failed to delete conference ID ${id}`);
        }
      }
      await fetchAllConferences();
      table.onSelectAllRows(false, []); // Clear selected rows
    } catch (error) {
      console.error("Error deleting conferences:", error);
      await fetchAllConferences();
    }
  };

  // Filter and sort data
  const dataFiltered: ConferenceProps[] = applyFilter({
    inputData: conferenceList,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

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
          selectedIds={table.selected.map(Number)} // Use selected IDs
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
                    conferenceList.map((row) => String(row.conferenceID))
                  )
                }
                headLabel={[
                  { id: 'conferenceID', label: 'Conference ID' },
                  { id: 'publisher', label: 'Publisher' },
                  { id: 'conferenceName', label: 'Conference Name' },
                  { id: 'area_subject', label: 'Area/Subject', align: 'center' },
                  { id: 'lastDOfSub', label: 'Last Date of Submission' },
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
                      key={row.conferenceID}
                      row={row}
                      selected={table.selected.includes(String(row.conferenceID))}
                      onSelectRow={() => table.onSelectRow(String(row.conferenceID))}
                      onEditRow={(data) => setEditData(data)}
                      onDeleteRow={(id: number) => {
                        fetchAllConferences();
                        table.onSelectAllRows(
                          false,
                          table.selected.filter((selectedId) => selectedId !== String(id))
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
                  conferenceId: editData.conferenceID,
                  publisher: String(editData.publisher),
                  conferenceName: String(editData.conferenceName),
                  area: String(editData.area),
                  subject: String(editData.subject),
                  Lds: String(editData.lastDOfSub),
                  registrationCharges: String(editData.registrationCharges),
                  links: String(editData.links),
                }
              : null
          }
          onClose={() => setEditData(null)}
          onSave={(newData) => {
            fetchAllConferences();
          }}
          anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
        />
      )}
    </DashboardContent>
  );
}