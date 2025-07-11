const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sunio fixify",
  password: "suhasjavali",
  port: 5432,
});
pool.connect(()=>{
  console.log("data base is connected");
});
module.exports = pool;
