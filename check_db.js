const mysql = require('mysql2/promise');

async function main() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'test'
    });
    
    console.log("Connected.");
    
    // Check max_allowed_packet
    const [rows] = await connection.execute("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log("Current max_allowed_packet:", rows[0].Value);
    
    // Try to set it higher
    await connection.execute("SET GLOBAL max_allowed_packet = 1024 * 1024 * 64");
    console.log("Set GLOBAL max_allowed_packet to 64MB");
    
    const [rows2] = await connection.execute("SHOW VARIABLES LIKE 'max_allowed_packet'");
    console.log("New max_allowed_packet (this session might still show old):", rows2[0].Value);
    
    await connection.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
