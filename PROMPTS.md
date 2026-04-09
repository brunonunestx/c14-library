# Prompts

- estou fazendo um projeto de gerenciamento de livrarias para cadastro de livros, registro de emprestimo e devolucao. Crie um docker compose para rodar um banco postgres e configure o prisma para integrar com esse db
- a config do prisma deve ser via prisma.config.ts
- crie na root um arquivo .md e va registrando os prompts que eu for te passando, 1 por linha
- crie duas pastas dentro de apps/api/src, uma chama providers, onde registraremos os modulos provedores (singleton do banco, servico de cache) e uma pasta resources, onde construiremos os modulos internos do projeto (livros, emprestimos e membros). Crie um arquivo index dentro de casa que exporte o array de providers e de resources, que conterao os modulos exportados
- configure o modulo book, com conroller, module, service e repository. Conrtoller recebe as reqs e toda a regra de negocio fica dentro da service. O repository contemplara a comunicacao com o banco
- configure um swagger na api
