import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'site',
    password: '240520',
    port: 5432,
});

export default pool;