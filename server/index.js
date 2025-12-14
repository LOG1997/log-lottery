import express from 'express'
import cors from 'cors'
import db from './db.js'

const app = express()
const PORT = 3456

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// ==================== 主题 API ====================

// 获取所有主题（不返回密码）
app.get('/api/themes', (req, res) => {
  try {
    const themes = db.prepare('SELECT id, name, description, created_at, updated_at FROM themes ORDER BY created_at DESC').all()
    res.json({ success: true, data: themes })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取单个主题（不返回密码）
app.get('/api/themes/:id', (req, res) => {
  try {
    const theme = db.prepare('SELECT id, name, description, created_at, updated_at FROM themes WHERE id = ?').get(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' })
    }
    res.json({ success: true, data: theme })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 验证主题密码
app.post('/api/themes/:id/verify-password', (req, res) => {
  try {
    const { password } = req.body
    const theme = db.prepare('SELECT password FROM themes WHERE id = ?').get(req.params.id)
    
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' })
    }
    
    const isValid = theme.password === password
    res.json({ success: true, valid: isValid })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 创建主题（带密码）
app.post('/api/themes', (req, res) => {
  try {
    const { id, name, description, password } = req.body
    const now = new Date().toISOString()
    
    db.prepare(`
      INSERT INTO themes (id, name, description, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, description || '', password || '', now, now)
    
    const theme = db.prepare('SELECT id, name, description, created_at, updated_at FROM themes WHERE id = ?').get(id)
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

// 删除主题（需要验证密码）
app.delete('/api/themes/:id', (req, res) => {
  try {
    const { password } = req.body || {}
    
    // 验证密码
    const theme = db.prepare('SELECT password FROM themes WHERE id = ?').get(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'Theme not found' })
    }
    
    if (theme.password && theme.password !== password) {
      return res.status(403).json({ success: false, error: 'Invalid password' })
    }
    
    // 删除关联数据
    db.prepare('DELETE FROM person_config WHERE theme_id = ?').run(req.params.id)
    db.prepare('DELETE FROM prize_config WHERE theme_id = ?').run(req.params.id)
    db.prepare('DELETE FROM global_config WHERE theme_id = ?').run(req.params.id)
    db.prepare('DELETE FROM fingerprints WHERE theme_id = ?').run(req.params.id)
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

// ==================== 指纹 API ====================

// 检查指纹是否已存在
app.get('/api/themes/:themeId/fingerprint/:fingerprint', (req, res) => {
  try {
    const { themeId, fingerprint } = req.params
    const record = db.prepare(
      'SELECT * FROM fingerprints WHERE theme_id = ? AND fingerprint = ?'
    ).get(themeId, fingerprint)
    
    res.json({ 
      success: true, 
      exists: !!record,
      data: record || null
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 记录指纹
app.post('/api/themes/:themeId/fingerprint', (req, res) => {
  try {
    const { themeId } = req.params
    const { fingerprint, personName } = req.body
    const now = new Date().toISOString()
    
    // 检查是否已存在
    const existing = db.prepare(
      'SELECT * FROM fingerprints WHERE theme_id = ? AND fingerprint = ?'
    ).get(themeId, fingerprint)
    
    if (existing) {
      return res.json({ 
        success: false, 
        error: 'already_joined',
        message: 'You have already joined this lottery'
      })
    }
    
    // 插入新记录
    db.prepare(`
      INSERT INTO fingerprints (theme_id, fingerprint, person_name, created_at)
      VALUES (?, ?, ?, ?)
    `).run(themeId, fingerprint, personName || '', now)
    
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取主题下所有指纹
app.get('/api/themes/:themeId/fingerprints', (req, res) => {
  try {
    const fingerprints = db.prepare(
      'SELECT * FROM fingerprints WHERE theme_id = ? ORDER BY created_at DESC'
    ).all(req.params.themeId)
    res.json({ success: true, data: fingerprints })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 根据用户名删除指纹
app.delete('/api/themes/:themeId/fingerprint/by-name/:personName', (req, res) => {
  try {
    const { themeId, personName } = req.params
    db.prepare(
      'DELETE FROM fingerprints WHERE theme_id = ? AND person_name = ?'
    ).run(themeId, decodeURIComponent(personName))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🎉 Lottery Server running at http://localhost:${PORT}`)
})
