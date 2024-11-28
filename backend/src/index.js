const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');




const app = express();




const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Saep',
  password: 'senai',
  port: 5432,
});




app.use(cors());
app.use(express.json());




// Endpoints para tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});




app.get('/tarefas/:id_tarefa', async (req, res) => {
  const { id_tarefa } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tarefas WHERE id_tarefa = $1', [id_tarefa]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar tarefa' });
  }
});




app.post('/tarefas', async (req, res) => {
  const { descricao, setor, prioridade, data_cadastro, status, fk_id_usuario } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tarefas (descricao, setor, prioridade, data_cadastro, status, fk_id_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [descricao, setor, prioridade, data_cadastro, status, fk_id_usuario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar tarefa' });
  }
});




app.put('/tarefas/:id_tarefa', async (req, res) => {
  const { id_tarefa } = req.params;
  const { descricao, setor, prioridade, data_cadastro, status, fk_id_usuario } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tarefas SET descricao = $1, setor = $2, prioridade = $3, data_cadastro = $4, status = $5, fk_id_usuario = $6 WHERE id_tarefa = $7 RETURNING *',
      [descricao, setor, prioridade, data_cadastro, status, fk_id_usuario, id_tarefa]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});




app.delete('/tarefas/:id_tarefa', async (req, res) => {
  const { id_tarefa } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id_tarefa = $1 RETURNING *', [id_tarefa]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});




// Endpoints para usuário
app.post('/usuario', async (req, res) => {
  const { nome, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao adicionar usuário' });
  }
});




app.get('/usuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});




app.get('/usuario/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id_usuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});




app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
