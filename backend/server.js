import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// resolver caminho correto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminho = path.join(__dirname, "../dicionario.txt");

// middlewares
app.use(express.json());
app.use(express.static("public"));
app.use("/models", express.static("models"));

// carregar
app.get("/carregar", (req, res) => {
    try {
        const dados = fs.readFileSync(caminho, "utf-8");
        res.send(dados);
    } catch {
        res.send("");
    }
});

// salvar
app.post("/salvar", (req, res) => {
    fs.writeFileSync(caminho, req.body.texto);
    res.send("Salvo!");
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});