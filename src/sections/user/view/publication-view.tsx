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
import { getData, postData } from 'src/services/FetchBackendServices';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from 'src/sections/user/table-no-data';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { UserTableToolbar } from 'src/sections/user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/sections/user/utils';

import { useTable } from './user-view';
import { PublicationTableRow } from '../publication-table-row';
import { PublicationTableHead } from '../publication-table-head';
import { AddPublicationData } from '../AddNewData/add-publication-data';


// Define the interface for publication data based on the backend publication response
interface PublicationProps {
  publicationId: number;
  sourceTitle: string; // Maps to publisher
  citeScore: number;
  hPercentile: string; // Maps to area
  citations: number; // Maps to subject
  documents: number; // Maps to lastDOfSub
  cited: number; // Maps to registrationCharges
}

// ----------------------------------------------------------------------

export function PublicationView() {
  const table = useTable();
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const [filterName, setFilterName] = useState('');
  const [publicationList, setPublicationList] = useState<PublicationProps[]>([]);
  const [editData, setEditData] = useState<PublicationProps | null>(null);

  // Fetch all publications from the backend
  const fetchAllPublications = async () => {
    try {
      const response = await getData("publications/display_all_publications");
      if (response && response.data) {
        // Map the response data to match the PublicationProps interface
        const formattedData = response.data.map((item: any) => ({
          publicationId: item.publicationId,
          sourceTitle: String(item.sourceTitle),
          citeScore: Number(item.citeScore),
          hPercentile: String(item.highestPercentile),
          citations: Number(item.citations),
          documents: Number(item.documents),
          cited: Number(item.cited),
        }));
        setPublicationList(formattedData);
      } else {
        console.error("No data received from the backend");
        setPublicationList([]);
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
      setPublicationList([]);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAllPublications();
  }, []);

  // Handle adding or updating a publication
  const handleAddPublication = async (newData: any) => {
    try {
      await fetchAllPublications();
    } catch (error) {
      console.error("Error after adding/updating publication:", error);
      await fetchAllPublications(); // Refetch to ensure consistency
    }
  };

  // Handle deleting rows (bulk deletion)
  const handleDeleteRows = async (ids: number[]) => {
    try {
      for (const id of ids) {
        const result = await postData("publications/delete_publication", { publicationId: id });
        if (!result.status) {
          throw new Error(result.message || `Failed to delete publication ID ${id}`);
        }
      }
      await fetchAllPublications();
      table.onSelectAllRows(false, []); // Clear selected rows
    } catch (error) {
      console.error("Error deleting publications:", error);
      await fetchAllPublications();
    }
  };

  // Filter and sort data
  const dataFiltered: PublicationProps[] = applyFilter({
    inputData: publicationList,
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
          Publications
        </Typography>
        <Button
          onClick={() => setOpenPopover(true)}
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
          selectedIds={table.selected.map(Number)} // Use selected IDs
          onDeleteRows={handleDeleteRows} // Pass bulk delete handler
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
                    publicationList.map((row) => String(row.publicationId))
                  )
                }
                headLabel={[
                  { id: 'id', label: 'Publication ID' },
                  { id: 'sourceTitle', label: 'Source Title' },
                  { id: 'citeScore', label: 'Cite Score' },
                  { id: 'hPercentile', label: 'Highest Percentile', align: 'center' },
                  { id: 'citations', label: 'Citations' },
                  { id: 'documents', label: 'Documents' },
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
                      key={row.publicationId}
                      row={row}
                      selected={table.selected.includes(String(row.publicationId))}
                      onSelectRow={() => table.onSelectRow(String(row.publicationId))}
                      onEditRow={(data) => setEditData(data)}
                      onDeleteRow={(id: number) => {
                        fetchAllPublications();
                        table.onSelectAllRows(
                          false,
                          table.selected.filter((selectedId) => selectedId !== String(id))
                        );
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
          heading="Add New Publication"
          open={openPopover}
          onClose={() => setOpenPopover(false)}
          data={null}
          onSave={handleAddPublication}
          anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
        />
      )}

      {editData && (
        <AddPublicationData
          heading="Edit Publication"
          open={!!editData}
          data={
            editData
              ? {
                  publicationId: editData.publicationId,
                  sourceTitle: String(editData.sourceTitle),
                  citeScore: String(editData.citeScore),
                  hPercentile: String(editData.hPercentile),
                  citations: String(editData.citations),
                  documents: String(editData.documents),
                  cited: String(editData.cited),
                }
              : null
          }
          onClose={() => setEditData(null)}
          onSave={handleAddPublication}
          anchorPosition={{ top: 100, left: window.innerWidth / 2 }}
        />
      )}
    </DashboardContent>
  );
}