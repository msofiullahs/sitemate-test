
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express ();
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.post("/create", (request, response) => {
    const files = fs.readFileSync("./data.json");
    let data = JSON.parse(files);
    const newData = request.body;
    data.push(newData);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    response.json(newData);
});

app.get("/read", (request, response) => {
    const files = fs.readFileSync("./data.json");
    const data = JSON.parse(files);
    const id = request.query.id;
    if (id !== undefined && id !== null) {
        const task = data.find(v => v.id === parseInt(id));
        if (task == undefined) {
            response.json("data not found");
        }
        response.json(task);
    } else {
        response.json(data);
    }
});

app.put("/update", (request, response) => {
    const files = fs.readFileSync("./data.json");
    const data = JSON.parse(files);
    const updatedData = request.body;
    const newData = data.filter((el) => {
        return el.id !== updatedData.id;
    });
    newData.push(updatedData);
    fs.writeFileSync("./data.json", JSON.stringify(newData));
    response.json(updatedData);
});

app.delete("/delete", (request, response) => {
    const files = fs.readFileSync("./data.json");
    const data = JSON.parse(files);
    const deletedData = request.body;
    const newData = data.filter((el) => {
        return el.id !== deletedData.id;
    });
    fs.writeFileSync("./data.json", JSON.stringify(newData));
    response.json(newData);
});
