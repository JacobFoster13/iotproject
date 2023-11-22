const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.get('/', async (req, res) => {
    try {
        const database = client.db("iotProjects");
        const members = database.collection('iotProjects');

        const query = { memberName: "Jacob Foster"};
        const member = await members.findOne(query);

        let velos = member.velos;
        let maxVelo = 0;
        let avgVelo = 0;


        for (i=0; i < velos.length; i++) {
            velos[i] = parseFloat(velos[i]);
            if (velos[i] > maxVelo) {
                maxVelo = velos[i];
            }
            avgVelo = avgVelo + velos[i];
        }

        avgVelo = avgVelo / velos.length;

        return res.json({
            memberName: member.memberName, 
            velos: velos, 
            maxVelo: maxVelo,
            avgVelo: avgVelo
        });

    } finally {
        console.log('Connected to MongoDB')
    }
})

app.listen(8000, () => {
    console.log("Server running...")
});