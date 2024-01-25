const pool = require('../config/database')
const axios = require('axios')
const format = require('pg-format')

//update the first 10 data values and store in database
module.exports.fetchTenFromApi = async(req,res) =>{
    console.log("fetched from api 11");
    const client = await pool.connect()

    const result = await axios.get('https://api.wazirx.com/api/v2/tickers#')

    const query = `insert into %s (namee,lastt,buy,sell,volume,base_unit) values %L;`
    const nft_values = ["btcinr","xrpinr","ethinr","trxinr","eosinr","zilinr","batinr","zrxinr","reqinr","icxinr"]
    let value = {}
    let top_10_values = []
    nft_values.forEach((nft_value)=>{
        value = result.data[nft_value]

        const values =[value.name.replace("/",""),parseFloat(value.last),parseFloat(value.buy),parseFloat(value.sell),parseFloat(value.volume),value.base_unit]
        top_10_values.push(values)
    })

    const clear_table = await client.query('TRUNCATE TABLE nwfData RESTART IDENTITY CASCADE;')
    const sendTodb = await client.query(format(query,'nwfData',top_10_values))

    client.release()
    return res.status(201).json({
        message : 'data updated',
        success : true
    })
}

//fetch stored from the database
module.exports.getData = async(req,res) => {
    const client = await pool.connect()
    const data = await client.query(`select * from nwfData;`)
    console.log(1);
    client.release()
    return res.status(200).json({
        data : data,
        message : 'data fetched',
        success : true
    })
}

