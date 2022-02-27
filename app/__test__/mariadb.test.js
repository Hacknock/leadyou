const mariadb = require("mariadb");
const env = process.env;

// *** MariaDB connection information *** //
const pool = mariadb.createPool({
  host: env.HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  connectionLimit: env.CON_LIMIT,
  waitForConnections: true,
  multipleStatements: true,
});

afterAll(() => {
  pool.end();
});

describe("Test mariadb connectoin and columns", () => {
  it("db connection test", async () => {
    try {
      await pool.getConnection()
    } catch (error) {
      expect(error).toBeNull();
      console.error(error);
    }
  });

  it("check generate table columns", async () => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(`show columns from ${env.MYSQL_DATABASE}.generate`)
      expect(result.length).toBe(3);
    } catch (error) {
      expect(error).toBeNull();
      console.error(error);
    }
  });

  it("check uniqueGene table columns", async () => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(`show columns from ${env.MYSQL_DATABASE}.uniqueGene`)
      expect(result.length).toBe(4);
    } catch (error) {
      expect(error).toBeNull()
      console.error(error);
    }
  });
});
