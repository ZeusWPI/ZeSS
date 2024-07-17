import { TableBody, TableCell, Typography } from "@mui/material";
import { TableRow } from "mdi-material-ui";
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
        setScanCards(mergeScansCards(scans, cards));
    }, [scans, cards]);

    return (
        <TableBody>
            {scanCards.map((scanCard) => (
                <TableRow key={scanCard.scanTime.toString()}>
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
