/** Cria um CRUD reutilizável cuja estrutura de armazenamento é um array. */
export function criarRepositorioLivros(dadosIniciais = []) {
  let livros = dadosIniciais.map((livro) => ({ ...livro }));
  let proximoId = Math.max(0, ...livros.map((livro) => Number(livro.id) || 0)) + 1;

  function validar(dados) {
    const titulo = String(dados?.titulo ?? "").trim();
    const autor = String(dados?.autor ?? "").trim();
    const ano = Number(dados?.ano);
    const categoria = String(dados?.categoria ?? "").trim();
    const lido = Boolean(dados?.lido);

    if (!titulo || !autor || !categoria) {
      throw new Error("Preencha título, autor e categoria.");
    }
    if (!Number.isInteger(ano) || ano < 1450 || ano > new Date().getFullYear() + 1) {
      throw new Error("Informe um ano válido.");
    }
    return { titulo, autor, ano, categoria, lido };
  }

  // R — Read
  function listar() {
    return livros.map((livro) => ({ ...livro }));
  }

  function buscarPorId(id) {
    const livro = livros.find((item) => item.id === Number(id));
    return livro ? { ...livro } : null;
  }

  // C — Create
  function criar(dados) {
    const livro = { id: proximoId++, ...validar(dados) };
    livros.push(livro);
    return { ...livro };
  }

  // U — Update
  function atualizar(id, dados) {
    const indice = livros.findIndex((item) => item.id === Number(id));
    if (indice === -1) return null;
    const livro = { id: livros[indice].id, ...validar(dados) };
    livros[indice] = livro;
    return { ...livro };
  }

  // D — Delete
  function excluir(id) {
    const indice = livros.findIndex((item) => item.id === Number(id));
    if (indice === -1) return false;
    livros.splice(indice, 1);
    return true;
  }

  return { listar, buscarPorId, criar, atualizar, excluir };
}

export const livrosExemplo = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, categoria: "Romance", lido: true },
  { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, categoria: "Literatura brasileira", lido: false },
  { id: 3, titulo: "A Hora da Estrela", autor: "Clarice Lispector", ano: 1977, categoria: "Ficção", lido: true }
];
