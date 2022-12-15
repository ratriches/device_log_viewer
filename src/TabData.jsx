
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import './Item.css'
import { maxWidth } from '@mui/system';



function syntaxHighlight(json, exp = false) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ret = json
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      },
    );
    if (exp) {
      return ret
        .replace(/[{]/g, '{<br>')
        .replace(/[}]$/, '<br>}')
        .replace(/['\t']/g, '&nbsp;')
        .replace(/[,]/g, ',<br>');
    }
    return ret;
}

function Row(props) {
  const { row, fname } = props;
  const [open, setOpen] = React.useState(false);
  const [expand, setExpand] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 30, padding: 0 }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ padding: 0 }} component="th" scope="row">
          {row.date}
        </TableCell>
        <TableCell sx={{ padding: 0 }}>{`${fname[row.nf]} : ${
          row?.ln >= 0 ? row.ln : '---'
        }`}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ padding: 0 }} colSpan={12} width={100}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <span>
                <IconButton
                  sx={{ /* width: 50, */ padding: 0 }}
                  aria-label="expand data"
                  size="small"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                </IconButton>
                {row.type}
              </span>
              <p
                style={{ margin: 0, overflow: 'auto', maxHeight: '20em' }}
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(JSON.stringify(row.ldata, undefined, '\t'), expand),
                }}
              ></p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function TabData(props) {
  const { data } = props;

  // console.log('TabData', data);
  if (!data?.data || data.data.length <= 0) return null;
  if (!data?.fname || data.fname.length <= 0) return null;
  return (
    <TableContainer component={Paper} /* sx={{ maxHeight: 440 }} */>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 30, padding: 0 }} />
            <TableCell sx={{ padding: 0 }}>Date/Time</TableCell>
            <TableCell sx={{ padding: 0}}>File : Line</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((row, i) => (
            <Row key={`row${i}`} row={row} fname={data.fname} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
