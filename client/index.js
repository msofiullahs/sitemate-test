// const readline = require('node:readline').createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });
const reader = require("readline-sync");
const http = require("http");

const action = reader.question('Action (create/read/update/delete): ');
const itemId = reader.question('Item ID: ');
let itemTitle = '';
let itemDescription = '';
if (action !== 'delete' && action !== 'read' ) {
    itemTitle = reader.question('Title: ');
    itemDescription = reader.question('Description: ');
}

let method = '';
switch (action) {
    case 'create':
        method = 'POST';
        break;
    case 'update':
        method = 'PUT';
        break;
    case 'delete':
        method = 'DELETE';
        break;

    default:
        method = 'GET';
        break;
}
let path = '/' + action;
if (action === 'read') {
    path = '/' + action + '?id=' + itemId;
}
let postData = {
    id: itemId,
    title: itemTitle,
    description: itemDescription
};

let options = {
    hostname: 'localhost',
    port: '3001',
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true
};
if (action !== 'read') {
    options = {
        hostname: 'localhost',
        port: '3001',
        path: path,
        method: method,
        data: postData,
        headers: {
          'Content-Type': 'application/json',
        },
        json: true
    };
}

const callApi = () => {
    let data;
  
    const request = http.request(options, (response) => {
        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');
    
        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
            data = JSON.stringify(chunk);
        });
    
        // The whole response has been received. Print out the result.
        response.on('end', () => {
            console.log(JSON.parse(data));
        });
    });
  
    // Log errors if any occur
    request.on('error', (error) => {
        console.error(error);
    });

    if (action !== 'read') {
        request.write(JSON.stringify(postData));
    }
  
    // End the request
    request.end();
};

callApi();
