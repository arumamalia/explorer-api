const Pool = require('pg').Pool
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'dbPostgresLia',
    port: 5432,
})

const getFolders = (req, res) => {
    pool.query('SELECT * FROM explorer_test.folders WHERE parent_id IS NULL', (error, results) => {
      if (error) {
        throw error
      }
          
      res.status(200).json(results.rows)
    })
}

const detailFolder = (req, res) => {
  const folderId = req.params.id;
  const search = req.query.search;

  let query = `SELECT * FROM explorer_test.folders WHERE parent_id = '${folderId}'`;
  if (search) {
    query += ' AND name ILIKE \'%' + search + '%\'';
  }  
  
  pool.query(query, (error, a) => {
    if (error) {
      throw error;
    }    
    
    const folders = a.rows;    

    pool.query(`SELECT * FROM explorer_test.folders WHERE id = '${folderId}'`, (error, b) => {
      if (error) {
        throw error;
      }  

      const detail = b.rows[0];

      res.status(200).json({
        folders,
        detail
      });
    });
  });
};

const addFolder = (req, res) => {
  const body = req.body;
  const id = body.id;
  let path = body.path;
  const splitPath = path.split(', ');
  const parent_id = splitPath.slice(-1);
  path += `, ${id}`;

  pool.query(`INSERT INTO explorer_test.folders (id, name, parent_id, path, is_updated) VALUES ('${body.id}', '${body.name}', '${parent_id}', '${path}', 0)`, (error, results) => {
    
    if (error) {
      throw error
    }
        
    res.status(200).json(results.rows)
  })
}

const renameFolder = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const name = body.name;
  
  pool.query(`UPDATE explorer_test.folders SET name = '${name}', is_updated = 1 WHERE id ='${id}'`, (error, results) => {
    if (error) {
      throw error
    }
        
    res.status(200).json(results.rows)
  })
}

const addressBar = (req, res) => {
  const path = req.body.path;  
  const arrPath = path.split(', ');
  const paramPath = arrPath.join("','");  
  
  pool.query(`SELECT id, name, parent_id, path, length(path) AS length_path FROM explorer_test.folders WHERE id IN ('${paramPath}') ORDER BY length_path ASC`, (error, results) => {
    if (error) {
      throw error
    }

    const data = results.rows;
    const arrRoute = data.map((e) => ({'id': e.id, 'name': e.name}));
        
    res.status(200).json(arrRoute)
  })
}

module.exports = {
  getFolders,
  detailFolder,
  addFolder,
  renameFolder,
  addressBar
}