import React from 'react';
import {  Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';

const Leaderboard = () => {
    const columns = [
        {field: 'rank', headerName: 'Rank', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'name', headerName: 'Name', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'maxVelo', headerName: 'Max Swing Velo', headerAlign: 'center', align: 'center', flex: 1},
        {field: 'avgVelo', headerName: 'Avg Swing Velo', headerAlign: 'center', align: 'center', flex: 1}
    ]

    const rows = [
        {id: 1, rank: 1, name: 'Jacob Foster', maxVelo: 75.66, avgVelo: 71.19}
    ]
  return (
    <>
    <h1>Public Leaderboard</h1>
    <DataGrid
        rows={rows}
        columns={columns}
        slots={{
            noRowsOverlay: () => (
                <Stack height='100%' alignItems='center' justifyContent='center'>
                    No Other Users
                </Stack>
            )
        }}
    />
    </>
  )
}

export default Leaderboard