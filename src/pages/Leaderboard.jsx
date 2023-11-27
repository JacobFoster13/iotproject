import React, { useEffect, useState } from 'react';
import {  Button, Stack } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
    const [rows, setRows] = useState([]);
    axios.defaults.baseURL = `http://${window.location.hostname}:8000`;

    const handleClick = (e) => {
        console.log(e.target.value);
    }

    const columns = [
        {
            field: 'memberName', 
            headerName: 'Name', 
            headerAlign: 'center', 
            align: 'center', 
            flex: 1,
            renderCell: (params) => 
                <Link
                    to='/info'
                    state={{
                        memberName: params.row.memberName
                    }}>
                        <Button
                            value={params.row.memberName}
                            variant='text'
                            onClick={handleClick}
                        >
                            {params.row.memberName}                    
                        </Button>
                    </Link>
                
        },
        {
            field: 'maxVelo', 
            headerName: 'Max Swing Velo', 
            headerAlign: 'center', 
            align: 'center', 
            flex: 1
        },
        {
            field: 'avgVelo', 
            headerName: 'Avg Swing Velo', 
            headerAlign: 'center', 
            align: 'center', 
            flex: 1
        }
    ]

    function getRowId(row) {
        return row.memberName;
    }

    useEffect(() => {
        axios.get('/all')
        .then((res) => {
            if (res.status === 200) {
                setRows(res.data);
            }
        })
    }, [])

  return (
    <>
        <h1>Public Leaderboard</h1>
        <DataGrid
            rows={rows}
            getRowId={getRowId}
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