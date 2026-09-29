# ReferencIA Tech

Site institucional reconstruído a partir de https://referencia.tech/, com o conteúdo das páginas, identidade azul e verde-lima, logotipo, ícones, imagens e banners originais da marca. HTML, CSS e JavaScript, sem dependências de execução e sem banco de dados próprio.

## Páginas

- Início, soluções, sobre nós e contato.
- Agente IA, WhatsApp Robot, URA Inteligente, LeadLab Growth, Treinamento Especializado e Solução Completa.
- Política de Privacidade e página 404.
- Rota anterior `/solucoes-inteligentes-para-gestao-educacional/` preservada, com canonical apontando para `/solucoes/`.

## Publicar pelo GitHub Pages

No repositório `desenvoltoo/ReferencIA`:

1. Abra **Settings → Pages**.
2. Em **Source**, selecione **Deploy from a branch**.
3. Selecione a branch **main** e a pasta **/(root)**. Salve.
4. Aguarde a publicação e abra o endereço exibido pelo GitHub.

Os arquivos do site ficam na raiz do repositório. Não existe etapa de instalação ou compilação. A pasta `assets` reúne estilos, JavaScript, imagens e a fonte local. O arquivo `.nojekyll` mantém a publicação estática.

Documentação: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Domínio referencia.tech

O domínio e o DNS devem ser configurados após validar a versão hospedada. As URLs canônicas, o sitemap e os metadados já utilizam `https://referencia.tech/`. Antes da migração, mantenha funcionando o site atual e os registros de e-mail. Os links e arquivos usam caminhos relativos para funcionar também no endereço do projeto no GitHub Pages.

A imagem de compartilhamento já existente foi preservada no caminho `wp-content/uploads/2025/11/Diferenciais-6.jpg`, evitando perda desse recurso quando o domínio for migrado.

## Executar localmente

Na raiz deste repositório:

```sh
python3 -m http.server 8080
```

Abra http://localhost:8080. Também pode publicar os mesmos arquivos em uma hospedagem que aceite sites estáticos.

## Editar

- Conteúdo: `index.html` e `index.html` de cada pasta de página.
- Aparência e adaptação para celular: `assets/site.css`.
- Menu e formulário: `assets/site.js`.
- Contatos: WhatsApp (11) 95688-5611, telefone (11) 2091-0243 e contato@referencia.tech.
- Atualize `sitemap.xml` ao adicionar ou remover páginas.
- As fontes Bricolage Grotesque, Poppins, Work Sans e Syne são locais e acompanham suas licenças SIL OFL em `assets/`. A biblioteca particles.js acompanha a licença MIT.

## Formulário e planilha

A integração pública encontrada no site original foi preservada: SheetDB, aba `Formulário Site - Home`. São enviados `nome`, `email`, `celular`, `regiao` e `data_envio`, com data no fuso de São Paulo.

Há validação dos campos, solicitação explícita de contato, bloqueio de envio duplo durante a requisição, limite de espera e confirmação apenas quando o serviço retorna uma linha criada. Em caso de erro ou resposta não confirmada, os dados permanecem preenchidos e o WhatsApp é oferecido como alternativa.

A publicação não altera a conta SheetDB nem as permissões da planilha. A integração precisa continuar ativa nessa conta. Não foi enviado um lead real durante a implementação; confirme um envio autorizado na planilha antes da migração do domínio. Nenhuma chave privada deve ser adicionada aos arquivos públicos do site.

## Verificações desta versão

Sintaxe JavaScript, referências locais de páginas e recursos, âncoras, IDs e hierarquia de título principal. Os arquivos de imagem e fonte foram conferidos. O código contém estilos para celular, menu acessível por teclado e respeito à preferência de movimento reduzido. A aparência final em dispositivos e o recebimento real do formulário devem ser conferidos na versão hospedada.

## Identidade visual

O fundo animado de partículas e conexões, os módulos azuis e a imagem de benefícios retomam a referência original. A logo oficial é servida localmente, com suas cores originais e sem filtros que apaguem o símbolo. A animação respeita a preferência de movimento reduzido e pausa quando fica fora da tela.

## Revisão de conteúdo e navegação

- Sobre nós: origem, desafios, ecossistema, compromisso, cinco diferenciais, quatro públicos atendidos e chamada final.
- Soluções: as cinco apresentações completas, com imagens, recursos e benefícios.
- Páginas de serviços: banners originais para computador e celular, motivos para contratar e todos os recursos incluídos.
- “Ver mais detalhes”, em Sobre nós, desce até a seção `#sobre`. “Contratar Solução” desce até `#contratar`, no final de cada serviço. A chamada final segue para o formulário de contato.
- Menu Soluções com as cinco páginas, navegação por teclado e fechamento por Escape.

## Fundo animado

`assets/background.js` inicializa o particles.js local em cada banner de abertura (início, sobre nós, soluções, pacote e serviços). O canvas acompanha as dimensões do banner, inclusive após carregamento das fontes e rotação do celular. As partículas verde-lima e conexões brancas ficam atrás do conteúdo; a rede reage ao ponteiro sem bloquear links. Com movimento reduzido, ela permanece visível e estática; fora da tela, a animação pausa.

A reação ao mouse funciona também em janelas estreitas e prévias laterais: partículas próximas se afastam do cursor e suas conexões são redesenhadas. Toques não acionam a repulsão, e a preferência de movimento reduzido continua sendo respeitada.
