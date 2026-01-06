# 🚂 Guia de Deploy no Railway.com - Sistema Exata

## 📋 Pré-requisitos

- ✅ Conta no [Railway.com](https://railway.com) (gratuita)
- ✅ Conta no GitHub
- ✅ Repositório do projeto no GitHub
- ✅ Código commitado e enviado para o GitHub

---

## 🚀 Passo a Passo Completo

### **1. Preparar o Repositório GitHub**

```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Preparar para deploy no Railway"

# Push para GitHub
git push origin main
```

**Certifique-se de que o `.gitignore` inclui:**
- `exata.db`
- `exata.db-wal`
- `exata.db-shm`
- `.env`

---

### **2. Criar Projeto no Railway**

1. Acesse [railway.com](https://railway.com)
2. Clique em **"Login"** → **"Login with GitHub"**
3. Autorize o Railway a acessar seu GitHub
4. No dashboard, clique em **"New Project"**
5. Selecione **"Deploy from GitHub repo"**
6. Escolha o repositório **exata**
7. Railway começará a fazer deploy automaticamente

---

### **3. Configurar Volume para SQLite**

⚠️ **IMPORTANTE:** Sem o volume, os dados serão perdidos a cada deploy!

#### **Criar Volume:**

1. No projeto Railway, clique em **"New"** → **"Volume"**
2. Configure:
   - **Name:** `exata-db`
   - **Size:** `1 GB` (mínimo)
3. Clique em **"Create"**

#### **Conectar Volume ao Serviço:**

1. Clique no seu serviço (geralmente nomeado como seu repo)
2. Vá em **"Settings"** → **"Volumes"**
3. Clique em **"Attach Volume"**
4. Selecione `exata-db`
5. Configure:
   - **Mount Path:** `/app/data`
6. Clique em **"Attach"**

---

### **4. Configurar Variáveis de Ambiente (Opcional)**

O Railway detecta automaticamente, mas você pode definir:

1. No serviço, vá em **"Variables"**
2. Adicione se necessário:
   ```
   NODE_ENV=production
   ```

**Nota:** O `RAILWAY_VOLUME_MOUNT_PATH` é definido automaticamente pelo Railway quando o volume está montado.

---

### **5. Verificar Deploy**

1. Aguarde o build terminar (pode levar 2-5 minutos na primeira vez)
2. Railway irá:
   - ✅ Instalar dependências (`npm install`)
   - ✅ Fazer build (`npm run build`)
   - ✅ Executar `db:setup:railway` (criar banco)
   - ✅ Iniciar aplicação (`npm run start`)

3. Verifique os logs:
   - Clique em **"Deployments"** → Último deploy → **"View Logs"**
   - Procure por:
     ```
     ✅ Database connection established with optimizations: /app/data/exata.db
     ✅ Database schema initialized
     🎉 Database setup completed successfully!
     ```

---

### **6. Obter URL da Aplicação**

1. No serviço, vá em **"Settings"** → **"Networking"**
2. Clique em **"Generate Domain"** (se ainda não tiver)
3. Copie a URL (ex: `https://exata-production.up.railway.app`)
4. A aplicação estará acessível nesta URL!

---

## 🔧 Configurações Automáticas

O sistema já está configurado com:

### **railway.toml**
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm install && npm run build"

[deploy]
startCommand = "npm run start"

[service]
mountPath = "/app/data"
```

### **lib/db/client.ts**
- ✅ Detecta ambiente de produção
- ✅ Usa `/app/data` em produção (volume)
- ✅ Cria diretório automaticamente se não existir
- ✅ Mantém compatibilidade com desenvolvimento local

### **package.json**
- ✅ `postbuild`: Inicializa banco após build
- ✅ `start`: Garante banco inicializado antes de iniciar

---

## 📊 Monitoramento

### **Ver Logs em Tempo Real:**

```bash
# Via Railway Dashboard
1. Serviço → Deployments → View Logs

# Via CLI (se instalar)
railway logs
```

### **Verificar Status do Banco:**

Os logs devem mostrar:
```
✅ Database connection established with optimizations: /app/data/exata.db
✅ Read connection pool initialized (5 connections)
✅ Database schema initialized
```

---

## 🔄 Atualizações Futuras

### **Deploy Automático (CI/CD):**

O Railway faz deploy automático quando você faz push para o GitHub:

```bash
# Desenvolver localmente
git add .
git commit -m "Nova feature"
git push origin main

# Railway detecta e faz deploy automaticamente! 🚀
```

### **Revert Deploy:**

Se algo der errado:

1. Vá em **"Deployments"**
2. Selecione um deploy anterior
3. Clique em **"Redeploy"**

---

## ⚠️ Problemas Comuns e Soluções

### **❌ Erro: "Database file not found"**

**Causa:** Volume não está montado ou path incorreto.

**Solução:**
1. Verifique se o volume está montado em `/app/data`
2. Verifique os logs para o path correto
3. Certifique-se que `RAILWAY_VOLUME_MOUNT_PATH` está definido

---

### **❌ Erro: "Cannot create directory"**

**Causa:** Permissões no volume.

**Solução:**
1. O código já cria o diretório automaticamente
2. Se persistir, verifique permissões do volume
3. Railway geralmente resolve isso automaticamente

---

### **❌ Dados perdidos após deploy**

**Causa:** Volume não está configurado ou montado incorretamente.

**Solução:**
1. ✅ Certifique-se que o volume existe
2. ✅ Verifique que está montado em `/app/data`
3. ✅ Verifique logs para confirmar path: `/app/data/exata.db`

---

### **❌ Build falha**

**Causa:** Dependências ou erros de compilação.

**Solução:**
1. Verifique logs do build
2. Teste localmente: `npm run build`
3. Certifique-se que `tsx` está nas dependências

---

### **❌ Aplicação não inicia**

**Causa:** Banco não inicializou ou erro no start.

**Solução:**
1. Verifique logs completos
2. Certifique-se que `db:setup:railway` rodou com sucesso
3. Verifique se o volume está acessível

---

## 💰 Custos

### **Plano Gratuito:**
- ✅ $5 crédito/mês
- ✅ Volume 1GB: ~$0.25/mês
- ✅ Aplicação: ~$0-5/mês (depende do uso)
- ✅ **Total: $0.25-5/mês (coberto pelo crédito!)**

### **Hobby ($5/mês):**
- ✅ $5 crédito + $5 de uso
- ✅ Volume incluído
- ✅ Melhor para produção pequena

---

## 🔐 Backup do Banco de Dados

### **Download Manual:**

1. Conecte via Railway CLI:
```bash
railway connect
```

2. Baixe o arquivo:
```bash
railway run cp /app/data/exata.db ./backup-$(date +%Y%m%d).db
```

### **Backup Automático (Recomendado):**

Configure um cron job ou script para:
- Fazer backup diário do volume
- Enviar para S3/Google Drive
- Manter últimas 7 versões

---

## 📈 Escalabilidade

### **Limitações do SQLite no Railway:**

- ⚠️ **1 instância por volume** (não escala horizontalmente)
- ⚠️ **Performance decai** com muitos usuários simultâneos (>100)
- ⚠️ **Backup manual** necessário

### **Quando Migrar para PostgreSQL:**

Considere migrar se:
- ✅ Múltiplos usuários simultâneos (>50)
- ✅ Dados > 10GB
- ✅ Precisa escalar horizontalmente
- ✅ Backup automático essencial

**O PostgreSQL é GRATUITO no Railway!**

---

## ✅ Checklist Final

Antes de considerar deploy completo, verifique:

- [ ] Código commitado no GitHub
- [ ] Volume `exata-db` criado (1GB)
- [ ] Volume montado em `/app/data`
- [ ] Build completou com sucesso
- [ ] Logs mostram banco inicializado
- [ ] Aplicação acessível via URL
- [ ] Dados persistem após restart

---

## 🎉 Parabéns!

Seu sistema está rodando no Railway! 🚂

**Próximos Passos:**
- ✅ Configurar domínio customizado (opcional)
- ✅ Configurar backup automático
- ✅ Monitorar uso e custos
- ✅ Considerar migração para PostgreSQL quando escalar

---

## 📚 Referências

- [Railway Documentation](https://docs.railway.com)
- [Railway Volumes Guide](https://docs.railway.com/storage/volumes)
- [Next.js on Railway](https://docs.railway.com/guides/nextjs)
- [SQLite Best Practices](https://www.sqlite.org/faq.html)

---

## 🆘 Suporte

Se precisar de ajuda:
1. Verifique os logs no Railway Dashboard
2. Consulte a documentação do Railway
3. Verifique issues no GitHub do projeto

**Última atualização:** Janeiro 2026

