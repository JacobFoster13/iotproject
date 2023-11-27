const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
const database = client.db("iotProjects");
const members = database.collection('iotProjects');

app.get('/info', async (req, res) => {
    const { memberName } = req.query;
    try {
        const query = { memberName: memberName};
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
            velos: velos.slice(-5).reverse(), 
            maxVelo: maxVelo,
            avgVelo: avgVelo
        });

    } catch {
        console.log('There was a fail')
    }
})

app.get("/addVelo", async (req, res) => {
    console.log(req.query);
    const { newVelo, apiKey } = req.query;

    let result = await members.updateOne({apiKey: apiKey}, {$push: {velos: parseFloat(newVelo)}});
    console.log(result);
    if (result.modifiedCount === 1) {
        return res.json({status: "good"});
    } else {
        return res.json({status: "shit"});
    }

})

app.get("/all", async (req, res) => {
    const result = await members.find();
    let memberRes = new Array();
    for await (const doc of result) {
        let total = 0.0;
        for (i=0; i<doc.velos.length; i++) {
            total += doc.velos[i];
        }
        let avgVelo = total / doc.velos.length;
        let maxVelo = Math.max(...doc.velos);

        doc.maxVelo = maxVelo.toFixed(2);
        doc.avgVelo = avgVelo.toFixed(2);
        memberRes.push(doc);
    }

    return res.json(memberRes);
})

app.listen(8000, () => {
    console.log("Server running...")
});