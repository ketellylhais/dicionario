import No from "./No.js";

export class AVLtree {
    constructor() {
        this.raiz = null;
    }

    altura(no) {
        if (no === null) {
            return 0;
        }
        return no.altura;
    }

    fatorBalanceamento(no) {
        if (no === null) {
            return 0;
        }
        return this.altura(no.esquerda) - this.altura(no.direita);
    }

    rotacaoDireita(y) {
        let x = y.esquerda;
        let T2 = x.direita;

        x.direita = y;
        y.esquerda = T2;

        y.altura = Math.max(this.altura(y.esquerda), this.altura(y.direita)) + 1;
        x.altura = Math.max(this.altura(x.esquerda), this.altura(x.direita)) + 1;

        return x;
    }

    rotacaoEsquerda(x) {
        let y = x.direita;
        let T2 = y.esquerda;

        y.esquerda = x;
        x.direita = T2;

        x.altura = Math.max(this.altura(x.esquerda), this.altura(x.direita)) + 1;
        y.altura = Math.max(this.altura(y.esquerda), this.altura(y.direita)) + 1;

        return y;
    }

    inserir(no, palavra, significado) {
        if (!no) return new No(palavra, significado);

        if (palavra < no.palavra) {
            no.esquerda = this.inserir(no.esquerda, palavra, significado);
        } else if (palavra > no.palavra) {
            no.direita = this.inserir(no.direita, palavra, significado);
        } else {
            no.significado = significado;
            return no;
        }

        no.altura = 1 + Math.max(this.altura(no.esquerda), this.altura(no.direita));

        let balanceamento = this.fatorBalanceamento(no);

        if (balanceamento > 1 && palavra < no.esquerda.palavra) {
            return this.rotacaoDireita(no);
        }

        if (balanceamento < -1 && palavra > no.direita.palavra) {
            return this.rotacaoEsquerda(no);
        }

        if (balanceamento > 1 && palavra > no.esquerda.palavra) {
            no.esquerda = this.rotacaoEsquerda(no.esquerda);
            return this.rotacaoDireita(no);
        }

        if (balanceamento < -1 && palavra < no.direita.palavra) {
            no.direita = this.rotacaoDireita(no.direita);
            return this.rotacaoEsquerda(no);
        }
        return no;
    }

    inserirPalavra(palavra, significado) {
        this.raiz = this.inserir(this.raiz, palavra, significado);
    }

    buscar(no, palavra) {
        if (!no) return null;
        if (palavra === no.palavra) return no;

        return palavra < no.palavra
            ? this.buscar(no.esquerda, palavra)
            : this.buscar(no.direita, palavra);
    }

    remover(no, palavra) {
        if (!no) return no;

        if (palavra < no.palavra)
            no.esquerda = this.remover(no.esquerda, palavra);
        else if (palavra > no.palavra)
            no.direita = this.remover(no.direita, palavra);
        else {
            if (!no.esquerda || !no.direita) {
                no = no.esquerda ? no.esquerda : no.direita;
            } else {
                let temp = this.minValor(no.direita);
                no.palavra = temp.palavra;
                no.significado = temp.significado;
                no.direita = this.remover(no.direita, temp.palavra);
            }
        }

        if (!no) return no;

        no.altura = 1 + Math.max(this.altura(no.esquerda), this.altura(no.direita));
        let balance = this.fatorBalanceamento(no);

        if (balance > 1 && this.fatorBalanceamento(no.esquerda) >= 0)
            return this.rotacaoDireita(no);

        if (balance > 1 && this.fatorBalanceamento(no.esquerda) < 0) {
            no.esquerda = this.rotacaoEsquerda(no.esquerda);
            return this.rotacaoDireita(no);
        }

        if (balance < -1 && this.fatorBalanceamento(no.direita) <= 0)
            return this.rotacaoEsquerda(no);

        if (balance < -1 && this.fatorBalanceamento(no.direita) > 0) {
            no.direita = this.rotacaoDireita(no.direita);
            return this.rotacaoEsquerda(no);
        }

        return no;
    }

    minValor(no) {
        if (!no) return null;
        while (no.esquerda !== null) {
            no = no.esquerda;
        }
        return no;
    }

    emOrdem(no, resultado = []) {
        if (no) {
            this.emOrdem(no.esquerda, resultado);
            resultado.push(`${no.palavra}: ${no.significado}`);
            this.emOrdem(no.direita, resultado);
        }
        return resultado;
    }

    preOrdem(no, resultado = []) {
        if (no) {
            resultado.push(`${no.palavra}: ${no.significado}`);
            this.preOrdem(no.esquerda, resultado);
            this.preOrdem(no.direita, resultado);
        }
        return resultado;
    }

    posOrdem(no, resultado = []) {
        if (no) {
            this.posOrdem(no.esquerda, resultado);
            this.posOrdem(no.direita, resultado);
            resultado.push(`${no.palavra}: ${no.significado}`);
        }
        return resultado;
    }

    amplitude() {
        let fila = [];
        let resultado = [];

        if (this.raiz) fila.push(this.raiz);

        while (fila.length) {
            let atual = fila.shift();
            resultado.push(`${atual.palavra}: ${atual.significado}`);

            if (atual.esquerda) fila.push(atual.esquerda);
            if (atual.direita) fila.push(atual.direita);
        }

        return resultado;
    }
    amplitudeArvore() {
        if (!this.raiz) return 0;

        let fila = [this.raiz];
        let max = 0;

        while (fila.length) {
            let tamanhoNivel = fila.length;
            max = Math.max(max, tamanhoNivel);

            for (let i = 0; i < tamanhoNivel; i++) {
                let atual = fila.shift();

                if (atual.esquerda) fila.push(atual.esquerda);
                if (atual.direita) fila.push(atual.direita);
            }
        }

        return max;
    }

    profundidade(no, resultado = []) {
        if (no) {
            resultado.push(`${no.palavra}: ${no.significado}`);
            this.profundidade(no.esquerda, resultado);
            this.profundidade(no.direita, resultado);
        }
        return resultado;
    }
    profundidadeArvore(no) {
        if (!no) return 0;

        const esq = this.profundidadeArvore(no.esquerda);
        const dir = this.profundidadeArvore(no.direita);

        return Math.max(esq, dir) + 1;
    }

    buscarPalavra(palavra) {
        return this.buscar(this.raiz, palavra);
    }

    removerPalavra(palavra) {
        this.raiz = this.remover(this.raiz, palavra);
    }
}