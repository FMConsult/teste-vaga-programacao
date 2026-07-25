# Typebot no Portainer

Stack pronta com base na [documentação oficial](https://docs.typebot.com/self-hosting/deploy/docker), ajustada para Portainer (rede `attachable` + variáveis no editor da stack).

## Pré-requisitos

- Servidor com Docker + Portainer
- Dois domínios (ou subdomínios) apontando para o servidor, se for usar HTTPS:
  - `typebot.seudominio.com` → builder
  - `bot.seudominio.com` → viewer
- Conta SMTP (Brevo, Mailgun, SendGrid, etc.) **ou** OAuth Google/GitHub para login

## Deploy da stack

1. No Portainer: **Stacks → Add stack**
2. Nome: `typebot`
3. Em **Web editor**, cole o conteúdo de `docker-compose.yml`
4. Em **Environment variables**, use **Advanced mode** e cole o conteúdo de `.env.example` (já com os seus valores)
5. Clique em **Deploy the stack**

### Valores mínimos a alterar

| Variável | Exemplo |
| --- | --- |
| `ENCRYPTION_SECRET` | saída de `openssl rand -base64 24` |
| `NEXTAUTH_URL` | `https://typebot.seudominio.com` |
| `NEXT_PUBLIC_VIEWER_URL` | `https://bot.seudominio.com` |
| `ADMIN_EMAIL` | seu e-mail |
| `SMTP_*` | dados do provedor SMTP |

Sem SMTP ou outro provedor de auth, a tela de login não consegue autenticar usuários.

## Portas

| Serviço | Porta padrão |
| --- | --- |
| Builder | `8080` |
| Viewer | `8081` |

O Typebot **não** faz SSL. Em produção, use reverse proxy (Traefik, Nginx Proxy Manager, Caddy, Cloudflare) na frente das portas `8080`/`8081`, com os mesmos hosts definidos em `NEXTAUTH_URL` e `NEXT_PUBLIC_VIEWER_URL`.

Labels Traefik prontas (comentadas) estão no `docker-compose.yml`.

## Após o deploy

1. Acesse o builder (`NEXTAUTH_URL`)
2. Faça login com o `ADMIN_EMAIL` (plano Unlimited)
3. Crie e publique um bot; o link público usa o `NEXT_PUBLIC_VIEWER_URL`

## Atualizar

No Portainer, na stack `typebot`:

1. **Pull and redeploy** (ou edite `TYPEBOT_VERSION` para uma tag específica)
2. Confirme que `ENCRYPTION_SECRET` e `DATABASE_URL` não mudaram — trocar a secret invalida dados criptografados

## Rede Portainer

A rede `typebot_network` está com `attachable: true` para evitar erro de DNS (`typebot-viewer` não resolve `typebot-db`) ao migrar a stack entre instâncias Portainer, conforme a [doc oficial](https://docs.typebot.com/self-hosting/deploy/docker#avoiding-network-issues-when-migrating-in-portainer).

## MinIO próprio (S3 externo)

O compose **não** sobe MinIO. Se você já tem um MinIO, só configure as variáveis `S3_*` na stack.

### 1. Preparar o bucket no MinIO

```bash
# com mc (MinIO Client), trocando o alias pelo seu
mc mb --ignore-existing myminio/typebot
mc anonymous set public myminio/typebot/public
```

CORS (necessário para upload pelo browser):

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

### 2. Variáveis na stack Portainer

| Variável | Valor |
| --- | --- |
| `S3_ACCESS_KEY` | access key do MinIO |
| `S3_SECRET_KEY` | secret key do MinIO |
| `S3_BUCKET` | `typebot` |
| `S3_ENDPOINT` | host da **API** (sem `http://`) — ex. `minio.seudominio.com` |
| `S3_PORT` | `443` (HTTPS) ou `9000` (HTTP direto) |
| `S3_SSL` | `true` ou `false` |

Exemplo HTTPS atrás de proxy:

```env
S3_ACCESS_KEY=xxxx
S3_SECRET_KEY=yyyy
S3_BUCKET=typebot
S3_ENDPOINT=minio.seudominio.com
S3_PORT=443
S3_SSL=true
```

Exemplo HTTP na porta 9000 (mesmo host / rede Docker):

```env
S3_ENDPOINT=minio
S3_PORT=9000
S3_SSL=false
```

Se o MinIO estiver em **outra stack** no mesmo Portainer e você quiser usar o hostname do container, conecte o serviço Typebot à mesma rede Docker do MinIO (ou use o IP/hostname público do MinIO).

### Erros comuns

- `InvalidEndpointError` → removeu `https://` do `S3_ENDPOINT`? Use só o hostname.
- Upload falha no browser → CORS do bucket ou `S3_ENDPOINT` apontando para o **Console** (9001) em vez da **API** (9000/443).
- Imagens não carregam no bot → prefixo `public/` precisa ser público (`mc anonymous set public ...`).

## Referências

- [Deploy com Docker](https://docs.typebot.com/self-hosting/deploy/docker)
- [Configuração / variáveis](https://docs.typebot.com/self-hosting/configuration)
- [Guia S3](https://docs.typebot.com/self-hosting/guides/s3)
- Imagens: [`baptistearno/typebot-builder`](https://hub.docker.com/r/baptistearno/typebot-builder/tags) e [`baptistearno/typebot-viewer`](https://hub.docker.com/r/baptistearno/typebot-viewer/tags)
