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
    let conn;
    try {
      conn = await pool.getConnection();
    } catch (err) {
      expect(err).toBeNull();
      console.error(err);
    } finally {
      if (conn) conn.end();
    }
  });

  it("check generated table columns", async () => {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(
        `show columns from ${env.MYSQL_DATABASE}.generated`
      );
      expect(result.length).toBe(4);
    } catch (err) {
      expect(err).toBeNull();
      console.error(err);
    } finally {
      if (conn) conn.end();
    }
  });
});
