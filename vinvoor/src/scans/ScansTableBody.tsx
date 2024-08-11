import { TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Card } from "../types/cards";
import {
    mergeScansCards,
    Scan,
    ScanCard,
    scanCardHeadCells,
} from "../types/scans";

interface ScansTableBodyProps {
    scans: readonly Scan[];
    cards: readonly Card[];
}

export const ScansTableBody: FC<ScansTableBodyProps> = ({ scans, cards }) => {
    const [scanCards, setScanCards] = useState<readonly ScanCard[]>([]);

    useEffect(() => {
        const mergedScansCards = mergeScansCards(scans, cards);
        mergedScansCards.sort(
            (a, b) => b.scanTime.getTime() - a.scanTime.getTime()
        );
        setScanCards(mergedScansCards);
    }, [scans, cards]);

    return (
        <TableBody>
            {scanCards.map((scanCard, index) => (
                <TableRow key={index}>
                    {scanCardHeadCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.padding}
                        >
                            <Typography>
                                {headCell.convert &&
                                    headCell.convert(scanCard[headCell.id])}
                            </Typography>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
};
