import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { criarRepositorioLivros, livrosExemplo } from "./src/livros.js";

const raiz = resolve(fileURLToPath(new URL(".", import.meta.url)));
const repositorio = criarRepositorioLivros(livrosExemplo);
const tipos = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

function responder(res, status, dados) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dados));
}

async function lerJson(req) {
  let corpo = "";
  for await (const parte of req) {
    corpo += parte;
    if (corpo.length > 100_000) throw new Error("Dados enviados são muito grandes.");
  }
  try { return JSON.parse(corpo); }
  catch { throw new Error("Envie um JSON válido."); }
}

const servidor = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const rota = url.pathname;
    const match = /^\/api\/livros\/(\d+)$/.exec(rota);

    if (rota === "/api/livros" && req.method === "GET") return responder(res, 200, repositorio.listar());
    if (rota === "/api/livros" && req.method === "POST") return responder(res, 201, repositorio.criar(await lerJson(req)));
    if (match && req.method === "GET") {
      const livro = repositorio.buscarPorId(match[1]);
      return responder(res, livro ? 200 : 404, livro ?? { erro: "Livro não encontrado." });
    }
    if (match && req.method === "PUT") {
      const livro = repositorio.atualizar(match[1], await lerJson(req));
      return responder(res, livro ? 200 : 404, livro ?? { erro: "Livro não encontrado." });
    }
    if (match && req.method === "DELETE") {
      const excluido = repositorio.excluir(match[1]);
      return responder(res, excluido ? 200 : 404, excluido ? { mensagem: "Livro excluído." } : { erro: "Livro não encontrado." });
    }
    if (rota.startsWith("/api/")) return responder(res, 404, { erro: "Rota não encontrada." });

    const caminho = rota === "/" ? "/index.html" : decodeURIComponent(rota);
    const arquivo = resolve(raiz, "." + caminho);
    const relativo = relative(raiz, arquivo);
    if (relativo.startsWith("..") || resolve(raiz, relativo) !== arquivo) return responder(res, 403, { erro: "Acesso negado." });
    const conteudo = await readFile(arquivo);
    res.writeHead(200, { "Content-Type": `${tipos[extname(arquivo)] ?? "application/octet-stream"}; charset=utf-8` });
    res.end(conteudo);
  } catch (erro) {
    responder(res, erro.code === "ENOENT" ? 404 : 400, { erro: erro.code === "ENOENT" ? "Arquivo não encontrado." : erro.message });
  }
});

const porta = Number(process.env.PORT) || 3000;
servidor.listen(porta, () => console.log(`Servidor em http://localhost:${porta}`));
