var bodyParser = require('body-parser')
// ---------------------- Express server settings ---------------------------
const express = require('express')
const app = express()
const cors = require('cors');
// const app = express();

app.use(cors());
const port = 3001
// ---------------------- Express server settings ends ---------------------------
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// ---------------------------- Postgress settings -------------------------------
const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'Abcd1234',
  port: 5432,
})
client.connect(function (err) {
  if (err) throw err;
  console.log("Database Connection Done!");
});
// ---------------------------- Postgress settings End ----------------------------


app.get('/list-data', (req, res) => {
  client.query('SELECT * FROM shoppinglist.shopping_tasks', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

app.post('/list-entry', (req, res) => {
  const { itemName, itemDescription, itemQuantity, itemStatus } = req.body
  client.query('INSERT INTO shoppinglist.shopping_tasks (item_name,item_description,item_quantity,item_status) VALUES ($1, $2,$3,$4)', [itemName, itemDescription, itemQuantity, itemStatus], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`User added with ID: ${req.body.itemName}`)
  })
})


app.delete('/delete-listitem/:id', (req, res) => {
  const id = parseInt(req.params.id)
  client.query('DELETE FROM  shoppinglist.shopping_tasks WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`User deleted successfully!`)
  })
})


app.post('/update-list/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { itemName, itemDescription, itemQuantity } = req.body
    client.query(
      'UPDATE shoppinglist.shopping_tasks SET item_name = $1, item_description = $2 ,item_quantity = $3 WHERE id = $4',
      [itemName, itemDescription, itemQuantity, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`User modified with ID: ${id}`)
      }
    )
})

app.post('/update-liststatus/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { itemStatus } = req.body
  client.query(
    'UPDATE shoppinglist.shopping_tasks SET item_status = $1 WHERE id = $2',
    [itemStatus, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User's Status modified with ID: ${id}`)
    }
  )
})


app.listen(port, () => {
  console.log(`Server is Ready. listening on port ${port}`)
})