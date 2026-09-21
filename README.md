# OAT 1 — CRUD de livros com arrays

**Curso:** Sistemas de Informação  
**Disciplina:** Desenvolvimento de APIs  
**Professor:** Pedro Borges

Projeto de biblioteca com operações **Create, Read, Update e Delete**. Os dados são armazenados em um **array em memória**. O módulo `src/livros.js` contém as funções reutilizáveis por uma API e pela interface.

## Executar

Requer Node.js 18 ou superior. No terminal, dentro da pasta do projeto:

```bash
node server.js
```

Abra `http://localhost:3000`. Para conferir a lógica, execute `node --test`.

## API

| Operação | Método | Rota |
| --- | --- | --- |
| Listar livros | GET | `/api/livros` |
| Consultar livro | GET | `/api/livros/:id` |
| Cadastrar livro | POST | `/api/livros` |
| Atualizar livro | PUT | `/api/livros/:id` |
| Excluir livro | DELETE | `/api/livros/:id` |

Corpo de exemplo para POST e PUT:

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "ano": 1899,
  "categoria": "Romance",
  "lido": true
}
```

## GitHub Pages

O GitHub Pages hospeda a interface estática. Nela, as operações usam o mesmo módulo de CRUD com um array no navegador. O servidor Node.js fornece os endpoints da API quando executado localmente. Como o armazenamento é somente em memória, os dados voltam aos exemplos iniciais ao atualizar a página ou reiniciar o servidor.
