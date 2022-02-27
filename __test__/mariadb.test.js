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


describe("Test mariadb connectoin and columns", () => {
  it("db connection test", async () => {
    expect(() => { await pool.getConnection() }).not.toThrow();
  });

  it("check generate table columns", async (done) => {
    try {
      const conn = await pool.getConnection();
      await conn.query(`user `)
      done();
    } catch (error) {

      done(error);
    }
  });

  it("check uniqueGene table columns", async () => {

  });
});
