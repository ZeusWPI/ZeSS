import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCardsContext } from "../providers/dataproviders/cardsProvider";
import { useScansContext } from "../providers/dataproviders/scansProvider";
import { mergeScansCards, ScanCard, scanCardHeadCells } from "../types/scans";

export const ScansTableBody = () => {
  const { data: scans } = useScansContext();
  const { data: cards } = useCardsContext();
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
