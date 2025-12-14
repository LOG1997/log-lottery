import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const PORT = 3456

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// ==================== 主题 API ====================

// 获取所有主题
app.get('/api/themes', (req, res) => {
  try {
    const themes = db.prepare('SELECT * FROM themes ORDER BY created_at DESC').all()
    res.json({ success: true, data: themes })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取单个主题
app.get('/api/themes/:id', (req, res) => {
  try {
    const theme = db.prepare('SELECT * FROM themes WHERE id = ?').get(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' })
    }
    res.json({ success: true, data: theme })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 创建主题
app.post('/api/themes', (req, res) => {
  try {
    const { id, name, description } = req.body
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO themes (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, name, description || '', now, now)
    
    const theme = db.prepare('SELECT * FROM themes WHERE id = ?').get(id)
    res.json({ success: true, data: theme })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 更新主题
app.put('/api/themes/:id', (req, res) => {
  try {
    const { name, description } = req.body
    const now = new Date().toISOString()
    
    db.prepare(`
      UPDATE themes SET name = ?, description = ?, updated_at = ?
      WHERE id = ?
    `).run(name, description || '', now, req.params.id)
    
    const theme = db.prepare('SELECT * FROM themes WHERE id = ?').get(req.params.id)
    res.json({ success: true, data: theme })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 删除主题
app.delete('/api/themes/:id', (req, res) => {
  try {
    // 删除关联数据
    db.prepare('DELETE FROM person_config WHERE theme_id = ?').run(req.params.id)
    db.prepare('DELETE FROM prize_config WHERE theme_id = ?').run(req.params.id)
    db.prepare('DELETE FROM global_config WHERE theme_id = ?').run(req.params.id)
    // 删除主题
    db.prepare('DELETE FROM themes WHERE id = ?').run(req.params.id)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ==================== 人员配置 API ====================

// 获取主题的人员配置
app.get('/api/themes/:themeId/person', (req, res) => {
  try {
    const config = db.prepare('SELECT * FROM person_config WHERE theme_id = ?').get(req.params.themeId)
    if (!config) {
      return res.json({ success: true, data: null })
    }
    res.json({ success: true, data: JSON.parse(config.data) })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存主题的人员配置
app.post('/api/themes/:themeId/person', (req, res) => {
  try {
    const { themeId } = req.params
    const data = JSON.stringify(req.body)
    const now = new Date().toISOString()
    
    const existing = db.prepare('SELECT id FROM person_config WHERE theme_id = ?').get(themeId)
    
    if (existing) {
      db.prepare('UPDATE person_config SET data = ?, updated_at = ? WHERE theme_id = ?')
        .run(data, now, themeId)
    } else {
      db.prepare('INSERT INTO person_config (theme_id, data, updated_at) VALUES (?, ?, ?)')
        .run(themeId, data, now)
    }
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ==================== 奖品配置 API ====================

// 获取主题的奖品配置
app.get('/api/themes/:themeId/prize', (req, res) => {
  try {
    const config = db.prepare('SELECT * FROM prize_config WHERE theme_id = ?').get(req.params.themeId)
    if (!config) {
      return res.json({ success: true, data: null })
    }
    res.json({ success: true, data: JSON.parse(config.data) })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存主题的奖品配置
app.post('/api/themes/:themeId/prize', (req, res) => {
  try {
    const { themeId } = req.params
    const data = JSON.stringify(req.body)
    const now = new Date().toISOString()
    
    const existing = db.prepare('SELECT id FROM prize_config WHERE theme_id = ?').get(themeId)
    
    if (existing) {
      db.prepare('UPDATE prize_config SET data = ?, updated_at = ? WHERE theme_id = ?')
        .run(data, now, themeId)
    } else {
      db.prepare('INSERT INTO prize_config (theme_id, data, updated_at) VALUES (?, ?, ?)')
        .run(themeId, data, now)
    }
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ==================== 全局配置 API ====================

// 获取主题的全局配置
app.get('/api/themes/:themeId/global', (req, res) => {
  try {
    const config = db.prepare('SELECT * FROM global_config WHERE theme_id = ?').get(req.params.themeId)
    if (!config) {
      return res.json({ success: true, data: null })
    }
    res.json({ success: true, data: JSON.parse(config.data) })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存主题的全局配置
app.post('/api/themes/:themeId/global', (req, res) => {
  try {
    const { themeId } = req.params
    const data = JSON.stringify(req.body)
    const now = new Date().toISOString()
    
    const existing = db.prepare('SELECT id FROM global_config WHERE theme_id = ?').get(themeId)
    
    if (existing) {
      db.prepare('UPDATE global_config SET data = ?, updated_at = ? WHERE theme_id = ?')
        .run(data, now, themeId)
    } else {
      db.prepare('INSERT INTO global_config (theme_id, data, updated_at) VALUES (?, ?, ?)')
        .run(themeId, data, now)
    }
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🎉 Lottery Server running at http://localhost:${PORT}`)
})
