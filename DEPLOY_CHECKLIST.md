# ✅ Checklist de Deploy - Railway.com

## 📋 Antes de Fazer Deploy

### **1. Verificar Código Local**
- [ ] Todos os arquivos commitados
- [ ] Código testado localmente (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] Banco inicializa corretamente (`npm run db:setup`)

### **2. Verificar Arquivos de Configuração**
- [ ] `railway.toml` existe e está correto
- [ ] `.railwayignore` existe
- [ ] `.gitignore` inclui `exata.db*`
- [ ] `package.json` tem scripts corretos

### **3. GitHub**
- [ ] Repositório criado no GitHub
- [ ] Código enviado (`git push origin main`)
- [ ] Repositório é público ou você tem Railway Pro (para privados)

---

## 🚂 No Railway Dashboard

### **4. Criar Projeto**
- [ ] Login em railway.com com GitHub
- [ ] Criar novo projeto
- [ ] Conectar repositório GitHub
- [ ] Railway inicia deploy automático

### **5. Configurar Volume (CRÍTICO)**
- [ ] Criar volume `exata-db` (1GB mínimo)
- [ ] Montar volume em `/app/data` no serviço
- [ ] Verificar que volume está conectado

### **6. Verificar Deploy**
- [ ] Build completou sem erros
- [ ] Logs mostram: `✅ Database connection established`
- [ ] Logs mostram: `✅ Database schema initialized`
- [ ] Aplicação está rodando

### **7. Testar Aplicação**
- [ ] URL gerada e acessível
- [ ] Login funciona
- [ ] Dados persistem após refresh
- [ ] Banco não é perdido após redeploy

---

## 🔄 Após Primeiro Deploy

### **8. Validações Finais**
- [ ] Fazer um deploy de teste (push pequeno)
- [ ] Verificar que dados não foram perdidos
- [ ] Confirmar que volume está funcionando
- [ ] Monitorar logs por 24h

### **9. Configurações Opcionais**
- [ ] Domínio customizado (se necessário)
- [ ] Variáveis de ambiente adicionais
- [ ] Configurar backup (recomendado)

---

## ⚠️ Problemas Comuns

Se algo der errado:

1. **Dados perdidos?** → Verificar se volume está montado
2. **Build falha?** → Verificar logs, testar `npm run build` localmente
3. **App não inicia?** → Verificar logs, especialmente `db:setup:railway`
4. **Erro de conexão?** → Verificar path do banco nos logs

---

## ✅ Tudo Pronto!

Se todos os itens acima estão marcados, seu sistema está pronto para produção! 🎉

**Próximos passos:**
- Monitorar uso e custos
- Configurar backup automático
- Considerar migração para PostgreSQL quando escalar

---

**Data:** Janeiro 2026
**Status:** ✅ Sistema pronto para deploy

