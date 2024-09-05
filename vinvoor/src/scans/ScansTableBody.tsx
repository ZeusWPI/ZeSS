import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { mergeScansCards, ScanCard, scanCardHeadCells } from "../types/scans";
import { useCards } from "../hooks/useCard";
import { useScans } from "../hooks/useScan";

export const ScansTableBody = () => {
  const { data: scans } = useScans();
  const { data: cards } = useCards();
  if (!scans || !cards) return null; // Can never happen

  const [scanCards, setScanCards] = useState<readonly ScanCard[]>([]);

  useEffect(() => {
    const mergedScansCards = mergeScansCards(scans, cards);
    mergedScansCards.sort(
      (a, b) => b.scanTime.getTime() - a.scanTime.getTime(),
    );
    setScanCards(mergedScansCards);
  }, [scans, cards]);

  return (
    <TableBody>
      {scanCards.map((scanCard, index) => (
        <TableRow key={index}>
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
};
