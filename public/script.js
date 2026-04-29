import { AVLtree } from "../models/avl.js";

const arvore = new AVLtree();

// 📥 carregar do arquivo

async function carregar() {
    const res = await fetch("/carregar");
    const texto = await res.text();

    if (!texto) return;

    arvore.raiz = null;

    texto.split("\n").forEach(linha => {
        if (!linha) return;

        const partes = linha.split(":");
        if (partes.length < 2) return;

        const p = partes[0].trim();
        const s = partes.slice(1).join(":").trim();

        if (p && s) {
            arvore.inserirPalavra(p, s);
        }
    });

    render();
}

window.carregarArquivo = function () {
    const input = document.getElementById("arquivo");
    const file = input.files[0];

    if (!file) {
        alert("Selecione um arquivo");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const texto = e.target.result;

        texto.split("\n").forEach(linha => {
            if (!linha) return;

            const partes = linha.split(":");
            if (partes.length < 2) return;

            const p = partes[0].trim();
            const s = partes.slice(1).join(":").trim();

            if (p && s) {
                arvore.inserirPalavra(p, s);
            }
        });

        render();
    };

    reader.readAsText(file);
};

// ➕ inserir / editar
window.inserir = function () {
    const p = document.getElementById("palavra").value.trim();
    const s = document.getElementById("significado").value.trim();

    if (!p || !s) {
        alert("Preencha palavra e significado");
        return;
    }

    arvore.inserirPalavra(p, s);

    // limpar inputs
    document.getElementById("palavra").value = "";
    document.getElementById("significado").value = "";

    render();
};

// ❌ remover
window.remover = function () {
    const p = document.getElementById("palavra").value.trim();

    if (!p) {
        alert("Digite a palavra para remover");
        return;
    }

    arvore.removerPalavra(p);
    render();
};

// 🔍 buscar
window.buscar = function () {
    const p = document.getElementById("busca").value.trim();
    const res = arvore.buscarPalavra(p);

    document.getElementById("resultado").innerText =
        res ? res.significado : "Não encontrado";
};

// mostrar dicionário (em ordem)
function render() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    arvore.emOrdem(arvore.raiz).forEach(item => {
        const p = document.createElement("p");
        p.textContent = item;
        lista.appendChild(p);
    });
}

// 📊 percursos
window.mostrarEmOrdem = () => mostrar(arvore.emOrdem(arvore.raiz));
window.mostrarPreOrdem = () => mostrar(arvore.preOrdem(arvore.raiz));
window.mostrarPosOrdem = () => mostrar(arvore.posOrdem(arvore.raiz));
window.mostrarAmplitude = () => mostrar(arvore.amplitude());
window.mostrarProfundidade = () => mostrar(arvore.profundidade(arvore.raiz));

function mostrar(lista) {
    const div = document.getElementById("lista");
    div.innerHTML = "";

    lista.forEach(item => {
        const p = document.createElement("p");
        p.textContent = item;
        div.appendChild(p);
    });
}

window.mostrarAltura = function () {
    const valor = arvore.profundidadeArvore(arvore.raiz);
    document.getElementById("resultado").innerText = "Altura da árvore: " + valor;
};

window.mostrarLargura = function () {
    const valor = arvore.amplitudeArvore();
    document.getElementById("resultado").innerText = "Largura da árvore: " + valor;
};

// 💾 salvar
window.salvar = async function () {
    const texto = arvore.emOrdem(arvore.raiz).join("\n");

    await fetch("/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
    });

    alert("Salvo!");
};

carregar();
