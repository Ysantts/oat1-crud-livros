import test from "node:test";
import assert from "node:assert/strict";
import { criarRepositorioLivros } from "../src/livros.js";

test("CRUD completo com array, IDs estáveis e cópias protegidas", () => {
  const repo = criarRepositorioLivros();
  const dados = { titulo: "Livro A", autor: "Autora", ano: 2020, categoria: "Ficção", lido: false };
  const criado = repo.criar(dados);
  assert.equal(criado.id, 1);
  assert.equal(repo.listar().length, 1);
  assert.deepEqual(repo.buscarPorId(1), criado);
  criado.titulo = "Alterado fora";
  assert.equal(repo.buscarPorId(1).titulo, "Livro A");
  const atualizado = repo.atualizar(1, { ...dados, titulo: "Livro B", lido: true });
  assert.equal(atualizado.titulo, "Livro B");
  assert.equal(atualizado.lido, true);
  assert.equal(repo.excluir(1), true);
  assert.equal(repo.buscarPorId(1), null);
  assert.equal(repo.excluir(1), false);
});

test("valida dados e IDs inexistentes", () => {
  const repo = criarRepositorioLivros();
  assert.throws(() => repo.criar({ titulo: "", autor: "A", ano: 2020, categoria: "B" }));
  assert.throws(() => repo.criar({ titulo: "A", autor: "B", ano: 1200, categoria: "C" }));
  assert.equal(repo.atualizar(999, { titulo: "A" }), null);
});
