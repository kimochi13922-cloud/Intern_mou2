const mysql = require('mysql2/promise');

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test'
    });
    
    const [rows] = await connection.execute("DESCRIBE activity_data");
    console.log(rows);
    
    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
