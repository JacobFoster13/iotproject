import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

    const handleAdd = () => {
        console.log('hello from button')
        axios.get('/addVelo', {
            params: {
                newVelo: 69.69
            }
        })
        .then((res) => {
            if (res.data.message === 'good') {
                console.log('added');
            } else {
                console.log('fuck');
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <>
        <h1>This is the information page</h1>
        <h3>Member Name: {name}</h3>
        <h3>Max Velo: {maxVelo.toFixed(2)}</h3>
        <h3>Avg Velo: {avgVelo.toFixed(2)}</h3>
        <h3>Last 5 Velos:</h3>
        <table>
            <thead></thead>
            <tbody>
                {velos.map((v, index) => (
                    <tr key={index}><td>{v.toFixed(2)}</td></tr>
                ))}
            </tbody>
        </table>
        <button onClick={handleAdd}>Add New Velo</button>
    </>
  )
}

export default Info