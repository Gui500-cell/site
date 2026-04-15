import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = process.cwd();

// SERVIR FRONTEND
app.use("/site", express.static(path.join(__dirname, "../FrontEnd")));

// SERVIR ADMIN
app.use("/admin", express.static(path.join(__dirname, "../Admin")));

const FILE = "./pedidos.json";

function getData() {
  return fs.existsSync(FILE)
    ? JSON.parse(fs.readFileSync(FILE))
    : [];
}

// rotas API
app.get("/pedidos", (req, res) => {
  res.json(getData());
});

app.post("/pedidos", (req, res) => {
  const data = getData();

  const novo = {
    id: Date.now(),
    status: "recebido",
    data: new Date().toLocaleString(),
    ...req.body
  };

  data.push(novo);
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  res.json({ ok: true });
});

app.put("/pedidos/:id", (req, res) => {
  const data = getData();
  const index = data.findIndex(p => p.id == req.params.id);

  if (index !== -1) {
    data[index].status = req.body.status;
  }

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.delete("/pedidos/:id", (req, res) => {
  const data = getData();
  const novo = data.filter(p => p.id != req.params.id);

  fs.writeFileSync(FILE, JSON.stringify(novo, null, 2));
  res.json({ ok: true });
});

// rota principal
app.get("/", (req, res) => {
  res.redirect("/site/edu.html");
});

app.listen(3000, () => {
  console.log("🔥 Rodando: http://localhost:3000");
});

app.use("/imagens", express.static(path.join(__dirname, "../imagens")));
