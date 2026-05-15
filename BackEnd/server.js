import express from "express";
import cors from "cors";
import path from "path";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = process.cwd();

// SERVIR FRONTEND
app.use("/site", express.static(path.join(__dirname, "../FrontEnd")));

// SERVIR ADMIN
app.use("/admin", express.static(path.join(__dirname, "../Admin")));

// SERVIR IMAGENS
app.use("/imagens", express.static(path.join(__dirname, "../imagens")));

// =====================
// ROTAS API COM BANCO
// =====================

// GET pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pedidos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar pedidos" });
  }
});

// POST pedido
app.post("/pedidos", async (req, res) => {
  try {
    const { nome, tipo, sabor, dataevento } = req.body;

    if (!dataevento) {
      return res.status(400).json({ erro: "Data do evento é obrigatória" });
    }

    const hoje = new Date();
    const dataEscolhida = new Date(dataevento);

    const diff = (dataEscolhida - hoje) / (1000 * 60 * 60 * 24);

    if (diff < 3) {
      return res.status(400).json({
        erro: "Pedidos devem ter no mínimo 3 dias de antecedência"
      });
    }

    await pool.query(
      `INSERT INTO pedidos (status, data, nome, tipo, sabor, dataevento)
       VALUES ($1, NOW(), $2, $3, $4, $5)`,
      ["recebido", nome, tipo, sabor, dataevento]
    );

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  }
});

// UPDATE status
app.put("/pedidos/:id", async (req, res) => {
  try {
    await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2",
      [req.body.status, req.params.id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar pedido" });
  }
});

// DELETE pedido
app.delete("/pedidos/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM pedidos WHERE id = $1",
      [req.params.id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao deletar pedido" });
  }
});

// rota principal
app.get("/", (req, res) => {
  res.redirect("/site/edu.html");
});

app.listen(3000, () => {
  console.log("🔥 Rodando: http://localhost:3000");
});