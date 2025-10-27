import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useMemo } from "react";
import { useCards } from "../hooks/useCard";
import { useScans } from "../hooks/useScan";
import { mergeScansCards, scanCardHeadCells } from "../types/scans";

export function ScansTableBody() {
  const { data: scans } = useScans();
  const { data: cards } = useCards();

  const scanCards = useMemo(() => {
    const mergedScansCards = mergeScansCards(scans ?? [], cards ?? []);
    mergedScansCards.sort(
      (a, b) => b.scanTime.getTime() - a.scanTime.getTime(),
    );
    return mergedScansCards;
  }, [scans, cards]);

  return (
    <TableBody>
      {scanCards.map(scanCard => (
        <TableRow key={scanCard.card?.id}>
          {scanCardHeadCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.padding}
            >
              <Typography>
                {headCell.convert?.(scanCard[headCell.id])}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
