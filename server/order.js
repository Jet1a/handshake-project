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

router.put('/orderItem/:itemId', async (req, res) => {
   const { newOwner } = req.body
   const itemId = req.params.itemId
   try {
      const sql = 'UPDATE items SET user_id = ? WHERE id = ?'
      const connection = await db.getConnection()
      await connection.query(sql, [newOwner, itemId])
      connection.release()
      res.status(200).json({ message: 'Item owner updated successfully' })
   } catch (error) {
      console.error('Error updating item owner: ', error)
      res.status(500).json({ error: 'Error updating item owner' })
   }
})

router.put('/update-items', async (req, res) => {
   const { newOwner, swappedTitle } = req.body

   try {
      const sql = 'UPDATE items SET user_id = ? WHERE title = ?'
      const connection = await db.getConnection()
      await connection.query(sql, [newOwner, swappedTitle])
      connection.release()
      res.status(200).json({ message: 'Item owner updated successfully' })
   } catch (error) {
      console.error('Error updating items: ', error)
      res.status(500).json({ error: 'Error updating items' })
   }
})


router.delete('/delete-swap/:itemId', async (req, res) => {
   const itemId = req.params.itemId
   try {
      const sql = 'DELETE FROM swaps WHERE item_id = ?'
      const connection = await db.getConnection()
      await connection.query(sql, [itemId])
      connection.release()
      res.status(200).json({ message: 'Deleting swap item successfully' })
   } catch (error) {
      console.error('Error deleting item: ', error)
      res.status(500).json({ error: 'Error deleting item' })
   }
})



module.exports = router