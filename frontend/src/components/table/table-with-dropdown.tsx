import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Channel } from "@/services/api/types/channel";

interface SubDataRow {
  id: string | number;
  vehicleName: string;
  location: string;
}

interface TableWithDropdownProps {
  data: Channel[];
  subData: SubDataRow[];
}

const TableWithDropdown: React.FC<TableWithDropdownProps> = ({
  data,
  subData,
}) => {
  const [openRows, setOpenRows] = useState<Set<string | number>>(new Set());

  const handleToggle = (id: string | number) => {
    setOpenRows((prev) => {
      const newOpenRows = new Set(prev);
      if (newOpenRows.has(id)) {
        newOpenRows.delete(id);
      } else {
        newOpenRows.add(id);
      }
      return newOpenRows;
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#121212" }}>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Vehicles Linked</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((channel) => (
            <React.Fragment key={channel.id}>
              <TableRow>
                <TableCell>
                  <span onClick={() => handleToggle(channel.id)}>
                    {openRows.has(channel.id) ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </span>
                </TableCell>
                <TableCell>{channel.name}</TableCell>
                <TableCell>{channel.vehiclesCount}</TableCell>
                <TableCell style={{ width: 200 }}>
                  {new Date(channel.createdAt || "").toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={4} style={{ padding: 0 }}>
                  <Collapse in={openRows.has(channel.id)}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Vehicle Name</TableCell>
                          <TableCell>Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subData.map((subRow) => (
                          <TableRow key={subRow.id}>
                            <TableCell>{subRow.vehicleName}</TableCell>
                            <TableCell>{subRow.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableWithDropdown;
