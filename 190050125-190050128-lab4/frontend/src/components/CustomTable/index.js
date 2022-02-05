import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useNavigate } from "react-router-dom";
// CSS
import './index.css';


export default function CustomTable(props) {
  const navigate = useNavigate();
  const options = [10, 20, 50];
  let s = parseInt(props.skip);
  let l = parseInt(props.limit);
  if (s % l !== 0 || options.indexOf(l) === -1) {
    navigate(`/matches?skip=0&limit=10`);
  }
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(parseInt(props.limit));
  React.useEffect(() => {
    setRowsPerPage(parseInt(props.limit));
  }, [props.limit]);

  if (props.rows.length === 0) {
    props.rows.push([["Loading...", ""]]);
    navigate(`/matches?skip=0&limit=${props.limit}`);
    setPage(0);
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    navigate(`/matches?skip=${newPage * rowsPerPage}&limit=${rowsPerPage}`)
  };

  const handleChangeRowsPerPage = (event) => {
    navigate(`/matches?skip=0&limit=${parseInt(event.target.value, 10)}`)
    // setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let Header = <></>
  if (props.headersEnabled === undefined || props.headersEnabled) {
    Header = <TableRow className="table-header">
      {props.header.map((heading) => (
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{heading}</TableCell>
      ))}
    </TableRow>
  }
  let Footer = <></>
  if (props.pagination) {
    Footer = <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={options}
          colSpan={props.header.length}
          count={rowsPerPage > props.rows.length ? props.rows.length + page * rowsPerPage : -1}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              'aria-label': 'rows per page',
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  }
  return (
    <TableContainer component={Paper} sx={{ marginLeft: "auto", marginRight: "auto", marginBottom: 0, overflowX: "scroll" }}>
      <Table aria-label="simple table">
        <TableBody>
          {Header}
          {props.rows.map((row) => (
            <TableRow className="table-body">
              {row.map((cell, i) => (
                <TableCell>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        {Footer}
      </Table>
    </TableContainer>
  )

}

