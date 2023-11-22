import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set } from 'mongoose';

const Info = () => {

    axios.defaults.baseURL = `http://${window.location.hostname}:8000`;
    const [name, setName] = useState('');
    const [velos, setVelos] = useState([]);
    const [maxVelo, setMaxVelo] = useState(0);
    const [avgVelo, setAvgVelo] = useState(0);

    useEffect(() => {
        axios.get('/')
        .then((res) => {
            if (res.status === 200) {
                setName(res.data.memberName);
                setVelos(res.data.velos);
                setMaxVelo(res.data.maxVelo);
                setAvgVelo(res.data.avgVelo);
            }
        })
    }, [])

  return (
    <>
        <h1>This is the information page</h1>
        <h3>Member Name: {name}</h3>
        <h3>Velos: {velos.length}</h3>
        <h3>Max Velo: {maxVelo}</h3>
        <h3>Avg Velo: {avgVelo}</h3>
    </>
  )
}

export default Info