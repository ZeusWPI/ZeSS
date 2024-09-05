import { Paper, Table, TableContainer, TablePagination } from "@mui/material";
import { ChangeEvent, MouseEvent, useMemo, useState } from "react";
import { Card } from "../types/cards";
import { TableOrder } from "../types/general";
import { CardsTableBody } from "./CardsTableBody";
import { CardsTableHead } from "./CardsTableHead";
import { CardsTableToolbar } from "./CardsTableToolbar";
import { useCards } from "../hooks/useCard";

const rowsPerPageOptions = [10, 25, 50];

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;

  return 0;
};

const getComparator = <Key extends keyof Card>(
  order: TableOrder,
  orderBy: Key,
): ((
  a: Record<Key, number | string | Date>,
  b: Record<Key, number | string | Date>,
) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = <T,>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) => {
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilized.map(el => el[0]);
};

export const CardsTable = () => {
  const { data: cards } = useCards();
  if (!cards) return null; // Can never happen

  const [order, setOrder] = useState<TableOrder>("asc");
  const [orderBy, setOrderBy] = useState<keyof Card>("serial");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleRequestSort = (
    _: MouseEvent<HTMLButtonElement>,
    property: keyof Card,
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cards.map(n => n.serial);
      setSelected(newSelected);

      return;
    }

    setSelected([]);
  };

  const handleRowClick = (
    _: MouseEvent<HTMLTableCellElement>,
    serial: string,
  ) => {
    const selectedIndex = selected.indexOf(serial);
    let newSelected: readonly string[] = [];

    switch (selectedIndex) {
      case -1:
        newSelected = newSelected.concat(selected, serial);
        break;
      case 0:
        newSelected = newSelected.concat(selected.slice(1));
        break;
      case selected.length - 1:
        newSelected = newSelected.concat(selected.slice(0, -1));
        break;
      default:
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (
    _: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => setPage(newPage);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (serial: string) => selected.includes(serial);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cards.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort<Card>(cards, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [cards, order, orderBy, page, rowsPerPage],
  );

  return (
    <Paper elevation={4} sx={{ width: "100%", mb: 2 }}>
      <CardsTableToolbar selected={selected} />
      <TableContainer>
        <Table>
          <CardsTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={cards.length}
          />
          <CardsTableBody
            rows={visibleRows}
            isRowSelected={isSelected}
            handleClick={handleRowClick}
            emptyRows={emptyRows}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={cards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
