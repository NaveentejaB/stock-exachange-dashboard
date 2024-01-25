//handling toggle button
let toggle_box = document.querySelector(".toggle_box")

toggle_box.addEventListener('change',() => {
    let circle = document.querySelector(".circle_tg")
    let checkbox = document.getElementById("checkbox")
    let table_rows = document.querySelectorAll('.table_row')
    let best_trade_txt_div = document.querySelector('.time_val_best_trade')
    let middle_navbar_buttons = document.querySelectorAll('.drd')

    // dark theme
    if(checkbox.checked){
        circle.style.transform = "translateX(-28px)"
        toggle_box.style.background = '#f8f9fa'
        toggle_box.style.boxShadow = '0 0 2px #ddd'
        document.querySelector('body').style.background = '#fff'
        best_trade_txt_div.querySelector('.big_txt_best_trade').style.color = '#0c0f48'
        middle_navbar_buttons.forEach((each_btn)=>{
            each_btn.style.background = '#f8f9fa'
            each_btn.style.color = '#0c0f48'
        })
        table_rows.forEach((table_row)=>{
            table_row.style.background = '#f8f9fa'
            table_row.querySelector('#id_idx').style.color = '#0e2a6d'
            table_row.querySelector('#id_name').style.color = '#0e2a6d'
            table_row.querySelector('#id_last_trade_pri').style.color = '#0e2a6d'
            table_row.querySelector('#id_buy_and_sell').style.color = '#0e2a6d'
            table_row.querySelectorAll('td').forEach((row_ele)=>{
                row_ele.style.fontSize = '20px'
            })
        })
        document.getElementById('progress').style.background = '#fff'
    }else{
        // light theme
        circle.style.transform = "translateX(0px)"
        toggle_box.style.background = '#2e3241'
        toggle_box.style.boxShadow = 'none'
        document.querySelector('body').style.background = '#191d28'
        best_trade_txt_div.querySelector('.big_txt_best_trade').style.color = '#fff'
        middle_navbar_buttons.forEach((each_btn)=>{
            each_btn.style.background = '#2e3241'
            each_btn.style.color = '#fff'
        })
        table_rows.forEach((table_row)=>{
            table_row.style.background = '#2e3241'
            table_row.querySelector('#id_idx').style.color = '#fff'
            table_row.querySelector('#id_name').style.color = '#fff'
            table_row.querySelector('#id_last_trade_pri').style.color = '#fff'
            table_row.querySelector('#id_buy_and_sell').style.color = '#fff'
            if(window.innerWidth <= 820){
                table_row.querySelectorAll('td').forEach((row_ele)=>{
                    row_ele.style.fontSize = '20px'
                })
            }else{
                table_row.querySelectorAll('td').forEach((row_ele)=>{
                    row_ele.style.fontSize = '25px'
                })
            }
        })
        document.getElementById('progress').style.background = '#191d28'
    }
}) 

//update the data in frontend
const update_in_frontend = async(data) => {
    try{
        console.log("updated in frontend");
        let rows_container = document.getElementById('rows_parent')
        rows_container.innerHTML = ''
        let each_row = document.getElementById('id_each_row')
        each_row.style.display = 'table-row'
        //cloning the rows and updating with the values
        data.forEach((each_data)=>{
            var clone_each_row = each_row.cloneNode(true)
            console.log(each_data.nft_id)
            clone_each_row.querySelector('#id_idx').textContent = each_data.nft_id
            clone_each_row.querySelector('#id_name').textContent =  each_data.namee
            clone_each_row.querySelector('#id_last_trade_pri').textContent ="₹"+each_data.lastt
            clone_each_row.querySelector('#id_buy_and_sell').textContent = "₹"+each_data.buy+" / ₹"+each_data.sell
            const diff_perct = (((each_data.sell-each_data.buy)/each_data.buy)*100).toFixed(3)
            let color = (diff_perct >= 0) ? "green" : "red"
            clone_each_row.querySelector('#id_diff').textContent = diff_perct+"%"
            clone_each_row.querySelector('#id_diff').style.color = color
            const saving = ((each_data.sell-each_data.buy)*each_data.volume).toFixed(3)
            const indicator = (diff_perct >= 0) ? "▲ " : "▼ "
            clone_each_row.querySelector('#id_savings').textContent = indicator+"₹"+saving
            clone_each_row.querySelector('#id_savings').style.color = color
            rows_container.appendChild(clone_each_row)
        })
        each_row.style.display = 'none'
    }catch(err){
        console.log('Error processing request :', err )
    }
}



//fetching data from database to frontned
const fetch_data_from_database = async() => {
    try{
        const response = await fetch('http://localhost:3000/data',{
            method : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        })
        const result = await response.json()
        console.log(result.data)
        if(result.success === false){
            console.log('Error processing request :', result.message )
        }else{
            //update the data in frontend
            update_in_frontend(result.data.rows)
        }
    }catch(err){
        console.log('Error processing request :', err )
    }
}


//fetching data from API to database every 60 seconds
const fetch_data_from_api_to_database = async()=>{
    try{
        const response = await fetch('http://localhost:3000/',{
            method : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        })
        const result = await response.json()
        if(!result.success){
            console.log('Error processing request :', result.message )
        }else{
            //update the data in frontend
            console.log("fetched data from data base");
            fetch_data_from_database()
        }
    }catch(err){
        console.log('Error processing request :', err )
    }
}

// function that runs the timer in navbar
const timer_runer = () => {
    const progressElement = document.getElementById('progress')
    const circleElement = document.getElementById('circle')
    const maxValue = 60
    let counter = maxValue
    setInterval(()=>{
        const percentage = (counter / maxValue) * 100
        circleElement.style.background = `conic-gradient(
            #3dc6c1 0%,
            #3dc6c1 ${percentage}%,
            #fff ${percentage}%,
            #fff 100%
        )`
        progressElement.innerText = counter
        if (counter === 0) {
            //updating the data from api to the database
            fetch_data_from_api_to_database()
            counter = maxValue
        } else {
            counter--
        }
    }, 1000)
}

document.addEventListener('DOMContentLoaded', fetch_data_from_database())
document.addEventListener('DOMContentLoaded',timer_runer())