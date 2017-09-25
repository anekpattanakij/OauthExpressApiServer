
module.exports = {

    createDatabase: (dynamodb) => new Promise((resolve, reject) => {        
        var params = {
            TableName: "Movies",
            KeySchema: [
                { AttributeName: "year", KeyType: "HASH" },  //Partition key
                { AttributeName: "title", KeyType: "RANGE" }  //Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: "year", AttributeType: "N" },
                { AttributeName: "title", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 10
            }
        };

        dynamodb.createTable(params, function (err, data) {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                reject('database not new created this time');
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                resolve('new database created');
            }
        });
    })
}
