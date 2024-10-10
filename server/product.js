const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs/promises');
const router = express.Router();
const mysql = require('mysql2/promise');
const db = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: 'admin',
   database: 'handshake',
   waitForConnections: true,
});

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'))
   },
   filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
   }
})

const upload = multer({ storage })

router.post('/add-item', upload.single('image'), async (req, res) => {
   try {
      const { title, description, owner, postType, location } = req.body
      const image = req.file

      if (!title || !description || !owner || !postType || !image || !location) {
         return res.status(400).json({ error: 'Missing required fields' })
      }

      const imgPath = `/uploads/${image.filename}`

      const ownerName = owner.replace(/\s+/g, '').toLowerCase()

      const [userRow] = await db.query('SELECT id FROM users WHERE REPLACE(LOWER(name), " ", "") = ?', [ownerName])

      if (!userRow || !userRow.length) {
         return res.status(404).json({ error: 'User not found' })
      }

      const userId = userRow[0].id

      const sql = 'INSERT INTO items (title,description,image,post_type, user_id, location) VALUES (?,?,?,?,?,?)'
      const params = [title, description, imgPath, postType, userId, location]
      await db.query(sql, params)

      res.status(200).json({ message: 'Item added successfully' })

   } catch (error) {
      console.error({ 'Error adding item': error })
      res.status(500).json({ error: 'Error adding item' })
   }
})

router.put('/edit-item/:id', upload.single('image'), async (req, res) => {
   try {
      const { id } = req.params;
      const { title, description, owner, postType, location } = req.body;
      const image = req.file;

      // Check if required fields are missing
      if (!title || !description || !owner || !postType || !location) {
         return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if image is provided and handle image update
      let imgPath = null;
      if (image) {
         imgPath = `/uploads/${image.filename}`;
      }

      const ownerName = owner.replace(/\s+/g, '').toLowerCase();

      const [userRow] = await db.query('SELECT id FROM users WHERE REPLACE(LOWER(name), " ", "") = ?', [ownerName]);

      if (!userRow || !userRow.length) {
         return res.status(404).json({ error: 'User not found' });
      }

      const userId = userRow[0].id;

      // Construct SQL query for update
      let sql = 'UPDATE items SET title=?, description=?, post_type=?, user_id=?, location=?';
      const params = [title, description, postType, userId, location];

      // Append image update to SQL query if image is provided
      if (imgPath) {
         sql += ', image=?';
         params.push(imgPath);
      }

      sql += ' WHERE id=?';
      params.push(id);

      await db.query(sql, params);

      res.status(200).json({ message: 'Item updated successfully' });

   } catch (error) {
      console.error('Error editing item:', error);
      res.status(500).json({ error: 'Error editing item' });
   }
});

router.get('/uploads/:id', async (req, res) => {
   const imgName = req.params.id;
   const imgPath = path.join(__dirname, 'uploads', imgName);
   try {
      const image = await fs.readFile(imgPath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(image, 'binary');
   } catch (error) {
      console.error('Error reading image: ', error);
      res.status(404).json({ error: 'Image not found' });
   }
});

router.get('/items', async (req, res) => {
   const userId = req.query.userId;
   const { excludeUserId } = req.query
   try {
      let sql = "SELECT items.*, users.name as owner_name FROM items JOIN users ON items.user_id = users.id"
      const params = []
      if (userId) {
         sql += " WHERE items.user_id = ?"
      }
      if (excludeUserId) {
         sql += ` WHERE user_id <> ${excludeUserId}`
      }
      const connection = await db.getConnection()
      const [results] = await connection.query(sql, userId ? [userId] : [])
      connection.release()
      return res.json(results)
   } catch (error) {
      console.error('Error fetching items: ', error)
      res.status(500).json({ error: 'Error fetching items' })
   }
})

router.get('/items/:itemId', async (req, res) => {
   const itemId = req.params.itemId
   try {
      let sql = "SELECT items.*, users.name as owner_name FROM items JOIN users ON items.user_id = users.id"
      if (itemId) {
         sql += " WHERE items.id = ?"
      }
      const connection = await db.getConnection()
      const [results] = await connection.query(sql, itemId ? [itemId] : [])
      connection.release()
      return res.json(results)
   } catch (error) {
      console.error('Error fetching items: ', error)
      res.status(500).json({ error: 'Error fetching items' })
   }
})

router.delete('/delete-item/:id', async (req, res) => {
   const itemId = req.params.id;
   try {
      const connection = await db.getConnection()
      const [itemResults] = await connection.query('SELECT image FROM items WHERE id = ?', [itemId])
      if (itemResults.length > 0) {
         const imagePath = itemResults[0].image_path

         const sql = "DELETE FROM items WHERE id = ?"
         const [deleteResults] = await connection.query(sql, [itemId])

         if (deleteResults.affectedRows > 0) {
            if (imagePath) {
               const fullImagePath = path.join(__dirname, imagePath)
               try {
                  await fs.unlink(fullImagePath)
                  console.log('Deleted image file:', fullImagePath);
               } catch (fileError) {
                  console.error('Error deleting image file:', fileError);
               }
            }
            connection.release()
            res.status(200).json({ message: 'Deleted Succesfully' })
         }
         else {
            connection.release()
            res.status(404).json({ error: 'Blog not found' })
         }
      }
   } catch (error) {
      console.error('Error deleting blog: ', error);
      res.status(500).json({ error: 'Error deleting blog' });
   }
})

router.get('/user-items/:userId', async (req, res) => {
   const userId = req.params.userId
   try {
      const sql = 'SELECT id, title FROM items WHERE user_id = ?'
      const connection = await db.getConnection()
      const [results] = await connection.query(sql, [userId])
      connection.release()
      return res.json(results)
   } catch (error) {
      console.error('Error fetching user items: ', error)
      res.status(500).json({ error: 'Error fetching user items' })
   }
})

router.post('/swaps', async (req, res) => {
   const { item_id, swap_with_item_id } = req.body
   try {
      const sql = 'INSERT INTO swaps (item_id, swap_with_item_id) VALUES (?,?)'
      const connection = await db.getConnection()
      await connection.query(sql, [item_id, swap_with_item_id])
      connection.release()
      res.status(200).json({ message: 'Swap request created successfully' })
   } catch (error) {
      console.error('Error creating swap request: ', error)
      res.status(500).json({ error: 'Error creating swap request' })
   }
})

router.get('/swapped-items', async (req, res) => {
   try {
      const sql = `
         SELECT
            items.*,
            users.name as owner,
            swapped_items.title as swapped_with_title
         FROM swaps
         JOIN items ON swaps.item_id = items.id
         JOIN users ON items.user_id = users.id
         JOIN items as swapped_items ON swaps.swap_with_item_id = swapped_items.id
      `
      const connection = await db.getConnection()
      const [results] = await connection.query(sql)
      connection.release()
      return res.json(results)
   } catch (error) {

   }
})

router.get('/check-swap/:id', async (req, res) => {
   const itemId = req.params.id
   try {
      const sql = 'SELECT COUNT(*) AS count FROM swaps WHERE item_id = ?'
      const [results] = await db.query(sql, [itemId])
      const exists = results[0].count > 0;
      res.json({ exists })
   } catch (error) {
      console.error('Error checking swap: ', error)
      res.status(500).json({ error: 'Error checking swap' })
   }
})

module.exports = router