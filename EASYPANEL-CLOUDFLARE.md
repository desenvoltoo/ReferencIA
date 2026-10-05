# EasyPanel + Cloudflare Tunnel

Este projeto pode ser publicado como uma composição com dois serviços:

- `web`: Nginx servindo o site na porta interna 80.
- `cloudflared`: conector de saída para o Cloudflare Tunnel.

O token do túnel é fornecido pelo EasyPanel como variável secreta. Ele não fica no GitHub.

## 1. Preparar o domínio no Cloudflare

1. Entre no painel do Cloudflare e adicione `referencia.tech`.
2. Confira os registros importados antes de alterar os nameservers. Preserve os registros MX, SPF, DKIM e demais registros usados pelo e-mail.
3. O Cloudflare exibirá dois nameservers.
4. No provedor do domínio, a Locaweb, abra a área de gerenciamento do domínio e substitua os nameservers atuais pelos dois nameservers exibidos pelo Cloudflare.
5. Aguarde a ativação do domínio no Cloudflare.

Depois da troca, os registros públicos do domínio serão administrados no Cloudflare. Não crie um registro A apontando para o IP do servidor para este projeto.

## 2. Criar o túnel

No Cloudflare:

1. Abra **Networking > Tunnels**.
2. Selecione **Create Tunnel**.
3. Nomeie o túnel como `referencia-tech-easypanel`.
4. Escolha **Docker**.
5. Copie o token exibido no comando de instalação. O token começa normalmente com `eyJ` e deve ser tratado como senha.

## 3. Publicar no EasyPanel

Crie um serviço do tipo **Compose**:

| Campo | Valor |
| --- | --- |
| Fonte | GitHub |
| Repositório | `desenvoltoo/ReferencIA` |
| Branch | `main` |
| Build Path | `/` |
| Arquivo Compose | `docker-compose.yml` |

Antes do Deploy, adicione a variável secreta:

| Nome | Valor |
| --- | --- |
| `TUNNEL_TOKEN` | token copiado no Cloudflare |

Clique em **Deploy**. O serviço `web` deve ficar saudável e o serviço `cloudflared` deve mostrar no log que registrou a conexão do túnel.

O Compose usa `http://web:80` como origem interna. Por isso, não é necessário publicar a porta 80 do site diretamente na Internet.

## 4. Publicar o domínio no túnel

No túnel `referencia-tech-easypanel`, abra **Routes > Add route > Published application** e crie:

| Hostname | Service URL |
| --- | --- |
| `referencia.tech` | `http://web:80` |
| `www.referencia.tech` | `http://web:80` |

Se o Cloudflare oferecer a criação automática do DNS, aceite. Os dois hostnames devem apontar para o túnel; não para o IP do servidor.

## 5. Conferir

No EasyPanel:

- `web`: running/healthy.
- `cloudflared`: running, com conexão registrada.
- Não é necessário adicionar domínio público ao serviço `web`; o acesso público entra pelo túnel.

Depois da propagação, teste:

```sh
curl -I https://referencia.tech
curl -I https://www.referencia.tech
```

Se o site abrir pelo domínio temporário do EasyPanel, mas não pelo domínio próprio, confira primeiro os nameservers no Cloudflare e depois os registros das rotas publicadas.

## Alternativa com um App do EasyPanel

Se preferir criar o site como serviço **App**, use o `Dockerfile` existente, porta interna `80`, e crie o `cloudflared` como outro serviço. Nesse caso, o conector precisa alcançar o serviço do site por um endereço interno acessível ao mesmo projeto. A composição deste repositório já deixa essa comunicação pronta usando `http://web:80`.

Referências oficiais:

- Cloudflare Tunnel: https://developers.cloudflare.com/tunnel/get-started/
- Nameservers Cloudflare: https://developers.cloudflare.com/dns/nameservers/update-nameservers/
- EasyPanel App/Compose: https://easypanel.io/docs/services/app
