import { criarRepositorioLivros, livrosExemplo } from "./src/livros.js";

const repositorio = criarRepositorioLivros(livrosExemplo);
const $ = (seletor) => document.querySelector(seletor);
const lista = $("#lista");
const formDialog = $("#form-dialog");
const excluirDialog = $("#excluir-dialog");
const form = $("#form-livro");
let idEmEdicao = null;
let idParaExcluir = null;
let temporizador;

function elemento(tag, classe, texto) {
  const item = document.createElement(tag);
  if (classe) item.className = classe;
  if (texto !== undefined) item.textContent = texto;
  return item;
}

function avisar(mensagem) {
  const toast = $("#toast");
  toast.textContent = mensagem;
  toast.classList.add("show");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => toast.classList.remove("show"), 3000);
}

function renderizar() {
  const livros = repositorio.listar();
  const busca = $("#busca").value.trim().toLocaleLowerCase("pt-BR");
  const filtro = $("#filtro").value;
  const filtrados = livros.filter((livro) => {
    const encontrado = `${livro.titulo} ${livro.autor}`.toLocaleLowerCase("pt-BR").includes(busca);
    return encontrado && (filtro === "todos" || (filtro === "lidos" ? livro.lido : !livro.lido));
  });

  $("#total-livros").textContent = livros.length;
  $("#total-lidos").textContent = livros.filter((livro) => livro.lido).length;
  $("#total-pendentes").textContent = livros.filter((livro) => !livro.lido).length;
  $("#contagem").textContent = `${filtrados.length} ${filtrados.length === 1 ? "livro" : "livros"}`;
  lista.replaceChildren();
  $("#vazio").hidden = filtrados.length > 0;

  for (const livro of filtrados) {
    const linha = elemento("article", "book-row");
    const capa = elemento("div", `book-cover cover-${livro.id % 4}`, livro.titulo.charAt(0).toUpperCase());
    capa.setAttribute("aria-hidden", "true");
    const info = elemento("div", "book-info");
    info.append(elemento("h3", "", livro.titulo));
    const detalhe = elemento("p", "", `${livro.autor}  ·  ${livro.ano}  ·  ${livro.categoria}`);
    info.append(detalhe);
    const status = elemento("span", `status ${livro.lido ? "read" : "pending"}`, livro.lido ? "Lido" : "Para ler");
    status.setAttribute("aria-label", livro.lido ? "Lido" : "Para ler");
    const acoes = elemento("div", "row-actions");
    const editar = elemento("button", "icon-button", "✎");
    editar.type = "button";
    editar.setAttribute("aria-label", `Editar ${livro.titulo}`);
    editar.addEventListener("click", () => abrirEdicao(livro.id));
    const excluir = elemento("button", "icon-button delete", "×");
    excluir.type = "button";
    excluir.setAttribute("aria-label", `Excluir ${livro.titulo}`);
    excluir.addEventListener("click", () => abrirExclusao(livro.id));
    acoes.append(editar, excluir);
    linha.append(capa, info, status, acoes);
    lista.append(linha);
  }
}

function abrirNovo() {
  idEmEdicao = null;
  form.reset();
  $("#dialog-titulo").textContent = "Adicionar livro";
  $("#salvar").textContent = "Salvar livro";
  $("#form-erro").hidden = true;
  formDialog.showModal();
  form.elements.titulo.focus();
}

function abrirEdicao(id) {
  const livro = repositorio.buscarPorId(id);
  if (!livro) return;
  idEmEdicao = id;
  for (const campo of ["titulo", "autor", "ano", "categoria"]) form.elements[campo].value = livro[campo];
  form.elements.lido.checked = livro.lido;
  $("#dialog-titulo").textContent = "Editar livro";
  $("#salvar").textContent = "Salvar alterações";
  $("#form-erro").hidden = true;
  formDialog.showModal();
  form.elements.titulo.focus();
}

function abrirExclusao(id) {
  const livro = repositorio.buscarPorId(id);
  if (!livro) return;
  idParaExcluir = id;
  $("#excluir-texto").textContent = `“${livro.titulo}” será removido do acervo.`;
  excluirDialog.showModal();
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const dados = {
    titulo: form.elements.titulo.value,
    autor: form.elements.autor.value,
    ano: form.elements.ano.value,
    categoria: form.elements.categoria.value,
    lido: form.elements.lido.checked
  };
  try {
    if (idEmEdicao === null) repositorio.criar(dados);
    else repositorio.atualizar(idEmEdicao, dados);
    formDialog.close();
    renderizar();
    avisar(idEmEdicao === null ? "Livro adicionado com sucesso." : "Livro atualizado com sucesso.");
  } catch (erro) {
    $("#form-erro").textContent = erro.message;
    $("#form-erro").hidden = false;
  }
});

$("#confirmar-exclusao").addEventListener("click", () => {
  if (repositorio.excluir(idParaExcluir)) {
    renderizar();
    avisar("Livro excluído do acervo.");
  }
  excluirDialog.close();
  idParaExcluir = null;
});
$("#novo-livro").addEventListener("click", abrirNovo);
$("#fechar-dialog").addEventListener("click", () => formDialog.close());
$("#cancelar").addEventListener("click", () => formDialog.close());
$("#cancelar-exclusao").addEventListener("click", () => excluirDialog.close());
$("#busca").addEventListener("input", renderizar);
$("#filtro").addEventListener("change", renderizar);
renderizar();
