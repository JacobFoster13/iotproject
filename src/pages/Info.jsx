import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Info = () => {
    let { state } = useLocation();

    axios.defaults.baseURL = `http://${window.location.hostname}:8000`;
    const [name, setName] = useState('');
    const [velos, setVelos] = useState([]);
    const [maxVelo, setMaxVelo] = useState(0);
    const [avgVelo, setAvgVelo] = useState(0);

    useEffect(() => {
        if ( state !==  null) {
            axios.get('/info', {
                params: {
                    memberName: state.memberName
                }
            })
            .then((res) => {
                if (res.status === 200) {
                    setName(res.data.memberName);
                    setVelos(res.data.velos);
                    setMaxVelo(res.data.maxVelo);
                    setAvgVelo(res.data.avgVelo);
                }
            })
        }
    }, [])

  return (
    <>
        <div style={{margin: '1%'}}>
            <h1>{name}'s Stats</h1>
            <h3>Max Swing Velocity: {maxVelo.toFixed(2)} mph</h3>
            <h3>Avg Velocity: {avgVelo.toFixed(2)} mph</h3>
            <h3>Last 5 Swing Velocities:</h3>
            <table style={{}}>
                <thead></thead>
                <tbody>
                    {velos.map((v, index) => (
                        <tr key={index} style={{marginBottom: '.5%'}}>
                            <td>{v.toFixed(2)} mph  </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default Info