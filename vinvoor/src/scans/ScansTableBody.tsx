import type { ScanCard } from "../types/scans";
import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCards } from "../hooks/useCard";
import { useScans } from "../hooks/useScan";
import { mergeScansCards, scanCardHeadCells } from "../types/scans";

export function ScansTableBody() {
  const { data: scans } = useScans();
  const { data: cards } = useCards();

  const [scanCards, setScanCards] = useState<readonly ScanCard[]>([]);

  useEffect(() => {
    const mergedScansCards = mergeScansCards(scans ?? [], cards ?? []);
    mergedScansCards.sort(
      (a, b) => b.scanTime.getTime() - a.scanTime.getTime(),
    );
    setScanCards(mergedScansCards);
  }, [scans, cards]);

  if (!scans || !cards)
    return null; // Can never happen

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
