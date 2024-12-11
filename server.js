import pg from 'pg';
import fs from 'fs';
import csv from 'csv-parser';

const { Client } = pg;

// Define the connection string to Supabase
const client = new Client({
  connectionString: "postgresql://postgres.jkhebdghpxssxiunsrmd:WKABUzZLsA*449r@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
});

async function createTable(headers) {
  const columns = headers.map(header => `"${header}" TEXT`).join(", ");
  const createTableQuery = `CREATE TABLE IF NOT EXISTS my_table (${columns});`;
  await client.query(createTableQuery);
}

async function insertData(row) {
  const keys = Object.keys(row).map(key => `"${key}"`).join(", ");
  const values = Object.values(row).map(value => `'${value.replace("'", "''")}'`).join(", ");
  const insertQuery = `INSERT INTO my_table (${keys}) VALUES (${values});`;
  await client.query(insertQuery);
}

async function main() {
  try {
    // Connect to the PostgreSQL client
    await client.connect();

    // Read and parse the CSV file
    const headers = [];
    const rows = [];
    fs.createReadStream("data.csv")
      .pipe(csv())
      .on("headers", (headerList) => headers.push(...headerList))
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          // Create the table based on CSV headers
          await createTable(headers);
          
          // Insert data into the table
          for (const row of rows) {
            await insertData(row);
          }
          
          console.log("Data has been successfully inserted into the database.");
        } catch (error) {
          console.error("Error inserting data:", error);
        } finally {
          await client.end();
        }
      });
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

main();
