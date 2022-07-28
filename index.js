import * as route from './util/route_factory.js';
import express from 'express';
import handlebars from 'express-handlebars';
import mysql2 from 'mysql2';

const app = express();
const port = 8081;
app.use(express.static('public'))

//Handlebars setup

app.set('view engine', 'hbs'); 
app.engine('hbs', handlebars.engine({
    layoutsDir: 'views/layouts',
    extname: 'hbs'
}))

app.get('/', route.renderAsync('main', 'index', delayedResponse));

app.listen(port, () => console.log(`App listening to port ${port}`));

async function delayedResponse() {
    await new Promise(resolve => setTimeout(resolve, 3000)); //testing delayed response, should render after 3 seconds
    return {data: 'GOODBYE'};
}

app.get('/sakila', route.renderAsync('sakila', 'index', fetchDBData))

async function fetchDBData() {
    const connection = mysql2.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'sakila_guest',
        password: 'bit',
        database: 'sakila'
    });

    const rows = await new Promise(
        (resolve, reject) => 
            connection.execute('SELECT * FROM film LIMIT ? OFFSET ?', 
                               [20, 0], 
                               (err, res) => {
                                   if(err) reject(err);
                                   resolve(res)
                               })
    );
    const titles = rows.map(row => row.title);
    return {titles: titles};
}