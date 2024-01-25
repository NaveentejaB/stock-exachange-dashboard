const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tejadb',
    password: '123456',
    port: 5432,
    max: 10
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

const intializeDB = async() => {
    const client = await pool.connect()
    let queryTable = `create table if not exists nwfData(
        nft_id SERIAL primary key,
        namee character varying(55) ,
        lastt numeric ,
        buy numeric ,
        sell numeric ,
        volume numeric ,
        base_unit character varying(55) 
    );`
    await client.query(queryTable)
    console.log('table created successfully.');
    console.log('Database connected successfully')
    client.release()
}

intializeDB()
module.exports = pool


