import { Paper, Table, TableContainer } from "@mui/material";
import { useState } from "react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import { Card, convertCardJSON } from "../types/cards";
import { convertScanJSON, Scan } from "../types/scans";
import { ScansTableBody } from "./ScansBody";
import { ScansTableHead } from "./ScansTableHead";

export const Scans = () => {
    const [scans, setScans] = useState<readonly Scan[]>([]);
    const [cards, setCards] = useState<readonly Card[]>([]);
    const { loading: loadingScans } = useFetch<readonly Scan[]>(
        "scans",
        setScans,
        convertScanJSON
    );
    const { loading: loadingCards } = useFetch<readonly Card[]>(
        "cards",
        setCards,
        convertCardJSON
    );

    return (
        <LoadingSkeleton loading={loadingScans && loadingCards}>
            <Paper elevation={4}>
                <TableContainer>
                    <Table>
                        <ScansTableHead />
                        <ScansTableBody scans={scans} cards={cards} />
                    </Table>
                </TableContainer>
            </Paper>
        </LoadingSkeleton>
    );
};
