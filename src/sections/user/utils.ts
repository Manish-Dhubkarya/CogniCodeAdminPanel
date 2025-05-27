
// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: any[];
  // inputData2:ConferenceProps[];
  filterName: string;
  comparator: (a: any, b: any) => number;
};

export function applyFilter({ inputData, comparator, filterName }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  // const stabilizedThis2 = inputData2.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name && user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        // publisher table filters 
        user.publisher && user.publisher.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.citeScore && user.citeScore.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.hPercentile && user.hPercentile.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.citations && user.citations.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.documents && user.documents.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.cited && user.cited.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||

      //  conference table filters
        user.conferenceName && user.conferenceName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.area && user.area.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.subject && user.subject.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.Lds && user.Lds.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.registrationCharges && user.registrationCharges.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.links && user.links.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.sourceTitle && user.sourceTitle.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.conference && user.conference.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
