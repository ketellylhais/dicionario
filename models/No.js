export default class No {
    constructor(palavra, significado) {
        this.palavra = palavra;
        this.significado = significado;
        this.esquerda = null;
        this.direita = null;
        this.altura = 1;
    }
}
