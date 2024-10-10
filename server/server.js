const express = require('express')
const path = require('path')
const multer = require('multer')
const mysql = require('mysql2/promise')
const cors = require('cors')
const fs = require('fs/promises')

const app = express()

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "uploads"))
   },
   filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)

   }
})

const upload = multer({ storage })

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json())

const port = 5000

const db = mysql.createPool({
   host: 'localhost',
   user: 'root',
   password: 'admin',
   database: 'handshake',
   waitForConnections: true,
})

const itemRoutes = require('./product')
const orderRoutes = require('./order')

app.use(itemRoutes)
app.use(orderRoutes)

app.get('/uploads/:id', async (req, res) => {
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

app.get('/blogs', async (req, res) => {
   try {
      const sql = "SELECT * FROM blogs"
      const connection = await db.getConnection()
      const [results] = await connection.query(sql)
      connection.release()
      return res.json(results)
   } catch (error) {
      console.error('Error uploading file: ', error)
      res.status(500).json({ error: 'Error uploading file' })
   }
})
app.put('/create-post/:id', upload.single('image'), async (req, res) => {
   handlePost(req, res)
})
app.post('/create-post', upload.single('image'), async (req, res) => {
   handlePost(req, res)
});

const handlePost = async (req, res) => {
   try {
      const { title, description } = req.body;
      const image = req.file;
      let imgPath = '';

      if (!title || !description) {
         return res.status(400).json({ error: 'Missing required fields' });
      }

      if (image) {
         imgPath = `/uploads/${image.filename}`;
      }

      const connection = await db.getConnection();

      if (req.params.id) {
         // Update existing post
         let sql = "UPDATE blogs SET title=?, description=?";
         const params = [title, description];

         if (image) {
            sql += ", image_path=?";
            params.push(imgPath);
         }

         sql += " WHERE id=?";
         params.push(req.params.id);

         await connection.query(sql, params);
      } else {
         // Create new post

         const sql = "INSERT INTO blogs (title, description, image_path) VALUES (?, ?, ?)";
         await connection.execute(sql, [title, description, imgPath]);
      }

      connection.release();

      res.status(200).json({ message: 'Post saved successfully' });
   } catch (error) {
      console.error('Error creating/updating post: ', error);
      res.status(500).json({ error: 'Error creating/updating post' });
   }
};

app.get('/blogs/:id', async (req, res) => {
   const postId = req.params.id;
   try {
      const sql = "SELECT title, description, image_path FROM blogs WHERE id = ?"
      const connection = await db.getConnection()
      const [results] = await connection.query(sql, [postId])
      connection.release()
      if (results.length > 0) {
         return res.json(results[0])
      } else {
         res.status(404).json({ error: 'Blog not found' })
      }
   } catch (error) {
      console.error('Error fetching blog: ', error);
      res.status(500).json({ error: 'Error fetching blog' });
   }
})

app.delete('/delete/:id', async (req, res) => {
   const postId = req.params.id;
   try {
      const connection = await db.getConnection()
      const [blogResults] = await connection.query('SELECT image_path FROM blogs WHERE id = ?', [postId])
      if (blogResults.length > 0) {
         const imagePath = blogResults[0].image_path

         const sql = "DELETE FROM blogs WHERE id = ?"
         const [deleteResults] = await connection.query(sql, [postId])

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


app.listen(port, () => {
   console.log("Listening on port " + port)
})