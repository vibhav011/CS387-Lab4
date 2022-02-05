import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
// CSS
import './index.css';


export default function CustomTable2(props) {
  let Header = <></>
  if (props.header !== undefined) {
    Header = <TableRow className="table-header">
      {props.header.map((heading) => (
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>{heading}</TableCell>
      ))}
    </TableRow>
  }
  
  return (
    <TableContainer component={Paper} sx={{ marginLeft: "auto", marginRight: "auto", overflowX: "scroll" }}>
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
      </Table>
    </TableContainer>
  )

}

