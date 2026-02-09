# 🏗️ Arquitetura Completa de Branches, Commits e Merges

Guia definitivo de padronização Git para desenvolvimento profissional.

---

## 📐 1. ARQUITETURA DE BRANCHES (Estrutura Hierárquica)

```
┌─────────────────────────────────────────────────────────────┐
│                         PRODUÇÃO                            │
│  main ●──────●──────────────────●─────────────────────●    │
│       └──┐           ┌──────────┘                     │    │
└──────────┼───────────┼────────────────────────────────┼────┘
           │           │                                │
┌──────────┼───────────┼────────────────────────────────┼────┐
│          │  INTEGRAÇÃO                                │    │
│  develop ●──●──●──●──●──●──●──●──●──●──●──●──●──●──●──●    │
│             │  │  │     │  │  │  │  │  │  │              │
└─────────────┼──┼──┼─────┼──┼──┼──┼──┼──┼──┼──────────────┘
              │  │  │     │  │  │  │  │  │  │
┌─────────────┼──┼──┼─────┼──┼──┼──┼──┼──┼──┼──────────────┐
│ DESENVOLVIMENTO                                            │
│ feature/login          ●──●──●──●─┘  │  │  │  │  │        │
│ feature/dashboard         ●──●──●────┘  │  │  │  │        │
│ feature/api-users            ●──●──●────┘  │  │  │        │
│ hotfix/critical-bug                   ●──●─┘  │  │        │
│ feature/payment                              ●──●─┘        │
└────────────────────────────────────────────────────────────┘
```

### **Regras de Ouro**

| Branch | Origem | Destino | Quando Criar | Quando Deletar |
|:-------|:-------|:--------|:-------------|:---------------|
| `main` | - | - | Início do projeto | Nunca |
| `develop` | `main` | - | Início do projeto | Nunca |
| `feature/*` | `develop` | `develop` | Nova funcionalidade | Após merge aprovado |
| `hotfix/*` | `main` | `main` + `develop` | Bug crítico em produção | Após merge em ambas |

---

## 🏷️ 2. TIPOS DE COMMITS (Conventional Commits)

### **Tabela de Tipos**

| Tipo | Emoji | Quando Usar | Exemplo |
|:-----|:------|:------------|:--------|
| `feat` | ✨ | Nova funcionalidade | `feat: adiciona sistema de login` |
| `fix` | 🐛 | Correção de bug | `fix: corrige validação de email` |
| `docs` | 📝 | Documentação | `docs: atualiza README com instruções` |
| `style` | 💄 | Formatação/CSS | `style: ajusta espaçamento do header` |
| `refactor` | ♻️ | Melhoria de código | `refactor: simplifica lógica de autenticação` |
| `perf` | ⚡ | Performance | `perf: otimiza query do banco de dados` |
| `test` | ✅ | Testes | `test: adiciona testes unitários para UserService` |
| `chore` | 🔧 | Infraestrutura | `chore: atualiza dependências do Maven` |
| `build` | 📦 | Build/Deploy | `build: configura Dockerfile para produção` |
| `ci` | 👷 | CI/CD | `ci: adiciona GitHub Actions para testes` |
| `revert` | ⏪ | Reverter commit | `revert: desfaz commit abc123` |

### **Anatomia de um Commit Perfeito**

```bash
tipo(escopo): descrição curta em minúsculas

Corpo opcional explicando o PORQUÊ da mudança
e não o QUE foi mudado (isso está no código).

Rodapé opcional para issues:
Closes #123
```

**Exemplos Reais:**

```bash
# Simples
git commit -m "feat: adiciona endpoint de cadastro de usuários"

# Completo
git commit -m "fix: corrige vazamento de memória no processamento de imagens

O método anterior não liberava os recursos após o processamento,
causando OOM em ambientes com alto volume de requisições.

Solução: implementa try-with-resources e garbage collection manual.

Closes #456"
```

---

## 🔄 3. FLUXO COMPLETO DE TRABALHO

### **A. Iniciando uma Feature**

```bash
# 1. Atualiza develop
git checkout develop
git pull origin develop

# 2. Cria nova branch
git checkout -b feature/sistema-pagamento

# 3. Trabalha normalmente
# ... edita arquivos ...

# 4. Verifica alterações
git status
git diff

# 5. Adiciona arquivos
git add src/main/java/PaymentService.java
# ou
git add .

# 6. Commit seguindo o padrão
git commit -m "feat: implementa integração com gateway de pagamento"

# 7. Envia para o repositório remoto
git push origin feature/sistema-pagamento
```

### **B. Comparando Alterações (Diff)**

```bash
# Comparar sua branch com develop
git diff develop

# Comparar arquivos específicos
git diff develop -- src/main/java/UserController.java

# Ver diferenças de forma visual (resumida)
git diff --stat develop

# Ver apenas nomes de arquivos alterados
git diff --name-only develop

# Comparar último commit com o atual
git diff HEAD~1

# Ver diferenças já adicionadas (staged)
git diff --cached
```

**Saída do `git diff --stat`:**

```
 src/main/java/PaymentService.java     | 145 +++++++++++++++++
 src/main/resources/application.yml    |   8 +-
 pom.xml                               |  12 ++
 README.md                             |  23 ++-
 4 files changed, 182 insertions(+), 6 deletions(-)
```

### **C. Merge Local (Teste antes do PR)**

```bash
# 1. Volta para develop
git checkout develop

# 2. Atualiza develop
git pull origin develop

# 3. Faz merge local para testar
git merge feature/sistema-pagamento

# 4. Se houver conflitos, resolve e commita
git status  # Mostra arquivos em conflito
# ... resolve conflitos manualmente ...
git add .
git commit -m "merge: integra feature/sistema-pagamento em develop"

# 5. Testa a aplicação
./mvnw spring-boot:run

# 6. Se tudo ok, envia
git push origin develop
```

### **D. Merge via Pull Request (GitHub)**

```bash
# 1. Após push da feature, vai ao GitHub
# 2. Clica em "Compare & pull request"
# 3. Preenche:

Título: feat: implementa sistema de pagamento
Base: develop ← compare: feature/sistema-pagamento

Descrição:
## 📋 Descrição
Implementa integração com Stripe e PagSeguro

## ✅ Checklist
- [x] Código segue padrões do projeto
- [x] Testes unitários adicionados
- [x] Documentação atualizada
- [x] Sem logs de debug

## 🔗 Issues Relacionadas
Closes #78

# 4. Solicita revisores
# 5. Aguarda aprovação
# 6. Clica em "Merge pull request"
# 7. Deleta a branch remota
```

---

## ⚔️ 4. RESOLUÇÃO DE CONFLITOS

### **Cenário: Dois devs alteraram o mesmo arquivo**

```bash
# Durante o merge, Git exibe:
Auto-merging src/main/java/UserService.java
CONFLICT (content): Merge conflict in src/main/java/UserService.java
Automatic merge failed; fix conflicts and then commit the result.
```

**Arquivo com Conflito:**

```java
public class UserService {
    
<<<<<<< HEAD (sua branch)
    public User findUser(String email) {
        return userRepository.findByEmail(email);
    }
=======
    public User getUser(String email) {
        return userRepo.findByEmailAddress(email);
    }
>>>>>>> feature/user-refactor (branch sendo mergeada)
    
}
```

**Resolução:**

```java
// Escolhe a melhor implementação ou combina
public class UserService {
    
    public User findUser(String email) {
        return userRepository.findByEmailAddress(email);
    }
    
}
```

**Finalização:**

```bash
git add src/main/java/UserService.java
git commit -m "merge: resolve conflito em UserService"
git push origin develop
```

---

## 🔥 5. HOTFIX (Correção Urgente)

```bash
# 1. Cria hotfix direto da main
git checkout main
git pull origin main
git checkout -b hotfix/corrige-falha-login

# 2. Corrige o problema
# ... edita código ...

# 3. Commit
git add .
git commit -m "fix: corrige validação que quebrava login de usuários legados"

# 4. Merge em MAIN
git checkout main
git merge hotfix/corrige-falha-login
git push origin main

# 5. Merge em DEVELOP (para não perder a correção)
git checkout develop
git merge hotfix/corrige-falha-login
git push origin develop

# 6. Deleta branch
git branch -d hotfix/corrige-falha-login
git push origin --delete hotfix/corrige-falha-login

# 7. Cria tag de versão
git tag -a v1.2.1 -m "Hotfix: corrige falha de login"
git push origin v1.2.1
```

---

## 📊 6. COMANDOS DE VISUALIZAÇÃO

```bash
# Histórico visual de branches
git log --oneline --graph --all --decorate

# Últimos 10 commits
git log -10 --pretty=format:"%h - %an, %ar : %s"

# Commits de uma branch específica
git log feature/sistema-pagamento

# Quem alterou cada linha de um arquivo
git blame src/main/java/UserService.java

# Buscar commit por mensagem
git log --grep="login"

# Ver alterações de um commit específico
git show abc1234
```

---

## 🎯 7. BOAS PRÁTICAS

### ✅ **Fazer**

- Commitar frequentemente (pequenas unidades)
- Testar localmente antes do push
- Revisar `git diff` antes do commit
- Usar mensagens descritivas
- Criar branch para cada feature
- Deletar branches após merge

### ❌ **Evitar**

- Commitar direto na `main` ou `develop`
- Mensagens genéricas: "ajustes", "WIP", "test"
- Commits gigantes com 50+ arquivos
- Deixar branches abandonadas
- Fazer merge sem testar
- Commitar arquivos `.env`, `node_modules`, `target/`

---

## 🆘 8. COMANDOS DE EMERGÊNCIA

```bash
# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1

# Desfazer alterações de um arquivo
git checkout -- arquivo.java

# Limpar arquivos não rastreados
git clean -fd

# Voltar arquivo para versão de outra branch
git checkout develop -- src/config/app.properties

# Ver quem está em qual branch
git branch -vv
```

---

## 🔄 9. PULL REQUESTS (PR)

### **Criando um PR Profissional**

1. Acesse o GitHub e navegue até sua branch
2. Clique em "Compare & pull request"
3. **Título**: Use o mesmo padrão de commit (`feat: descrição`)
4. **Descrição**: Explique o que foi feito e por quê
5. Adicione revisores e labels apropriadas

### **Template de PR**

```markdown
## 📋 Descrição
[Descreva resumidamente o que foi implementado]

## 🎯 Motivação
[Por que essa mudança é necessária?]

## 🔄 Tipo de Mudança
- [ ] Nova funcionalidade (feat)
- [ ] Correção de bug (fix)
- [ ] Refatoração (refactor)
- [ ] Documentação (docs)
- [ ] Outros: _____

## ✅ Checklist do Desenvolvedor
- [ ] Código segue os padrões do projeto
- [ ] Não há conflitos com `develop`
- [ ] Testes passam localmente
- [ ] Documentação atualizada (se necessário)
- [ ] Sem logs de debug ou código comentado
- [ ] Variáveis e métodos com nomes descritivos

## 🧪 Como Testar
1. [Passo a passo para testar as mudanças]
2. [Cenários de teste importantes]

## 📸 Screenshots (se aplicável)
[Cole imagens de telas alteradas]

## 🔗 Issues Relacionadas
Closes #[número]
Refs #[número]
```

### **Checklist do Revisor**

- [ ] Código está legível e bem estruturado
- [ ] Lógica de negócio faz sentido
- [ ] Não há duplicação de código
- [ ] Tratamento de erros adequado
- [ ] Segurança (sem senhas hardcoded, SQL injection, etc)
- [ ] Performance (queries otimizadas, loops eficientes)
- [ ] Testes cobrem casos críticos
- [ ] Documentação suficiente

---

## 🏷️ 10. VERSIONAMENTO SEMÂNTICO

### **Formato de Versões**

```
v{MAJOR}.{MINOR}.{PATCH}

Exemplo: v2.3.1
```

- **MAJOR**: Mudanças incompatíveis na API (breaking changes)
- **MINOR**: Nova funcionalidade (compatível com versão anterior)
- **PATCH**: Correções de bugs

### **Comandos de Versionamento**

```bash
# Ver versão atual
git describe --tags

# Criar tag de release
git tag -a v1.0.0 -m "Release: sistema de autenticação completo"
git push origin v1.0.0

# Listar todas as tags
git tag -l

# Deletar tag (se necessário)
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### **Quando Incrementar Cada Número**

```bash
# MAJOR (v2.0.0): Breaking changes
- Remoção de endpoints da API
- Mudança de estrutura de banco incompatível
- Remoção de funcionalidades

# MINOR (v1.3.0): Novas features
- Novo módulo de relatórios
- Nova integração com serviço externo
- Novas funcionalidades sem quebrar compatibilidade

# PATCH (v1.2.5): Bug fixes
- Correção de validação
- Fix de performance
- Ajustes de segurança
```

---

## 🛡️ 11. PROTEÇÃO DE BRANCHES

### **Configurações Recomendadas no GitHub**

**Para `main`:**
- ✅ Require pull request reviews (mínimo 1 aprovação)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ✅ Require linear history
- ✅ Do not allow bypassing the above settings

**Para `develop`:**
- ✅ Require pull request reviews (mínimo 1 aprovação)
- ✅ Require status checks to pass
- ✅ Require linear history

### **Como Configurar**

1. Vá em **Settings** → **Branches**
2. Clique em **Add rule**
3. Em **Branch name pattern** digite: `main` ou `develop`
4. Marque as opções acima
5. Clique em **Create** ou **Save changes**

---

## 🚀 12. ALIASES GIT ÚTEIS

Adicione ao arquivo `~/.gitconfig`:

```ini
[alias]
    # Atalhos básicos
    st = status
    co = checkout
    br = branch
    ci = commit
    
    # Logs visuais
    lg = log --oneline --graph --all --decorate
    last = log -1 HEAD --stat
    
    # Operações úteis
    unstage = reset HEAD --
    undo = reset --soft HEAD~1
    amend = commit --amend --no-edit
    
    # Branches
    branches = branch -a
    remotes = remote -v
    
    # Diferenças
    df = diff
    dfs = diff --staged
    
    # Limpeza
    cleanup = !git branch --merged | grep -v '\\*\\|main\\|develop' | xargs -n 1 git branch -d
```

**Como usar:**

```bash
# Ao invés de: git status
git st

# Ao invés de: git log --oneline --graph --all --decorate
git lg

# Deletar branches já mergeadas
git cleanup
```

---

## 📚 13. GLOSSÁRIO DE TERMOS

| Termo | Significado |
|:------|:------------|
| **Branch** | Ramificação independente do código |
| **Commit** | Snapshot/fotografia do código em um momento |
| **Merge** | Unir duas branches |
| **Pull Request (PR)** | Solicitação de merge via interface web |
| **Rebase** | Reorganizar commits de uma branch |
| **Cherry-pick** | Copiar commit específico de outra branch |
| **Stash** | Salvar alterações temporariamente sem commit |
| **Tag** | Marcar ponto específico no histórico (versão) |
| **HEAD** | Ponteiro para o commit atual |
| **Origin** | Nome padrão do repositório remoto |
| **Upstream** | Repositório original (em forks) |

---

## 🔧 14. AUTOMAÇÃO COM GIT HOOKS

### **Pre-commit Hook (Validação antes de commitar)**

Crie o arquivo `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Valida formato de mensagem de commit
commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")
pattern="^(feat|fix|docs|style|refactor|test|chore|build|ci|revert|perf)(\(.+\))?: .+"

if ! [[ $commit_msg =~ $pattern ]]; then
  echo "❌ Mensagem de commit inválida!"
  echo ""
  echo "Formato correto:"
  echo "  tipo: descrição"
  echo ""
  echo "Exemplos:"
  echo "  feat: adiciona login com Google"
  echo "  fix: corrige validação de CPF"
  exit 1
fi

# Verifica se há console.log no código Java
if git diff --cached --name-only | grep -E '\.java$' > /dev/null; then
  if git diff --cached | grep -E 'System\.out\.println|\.printStackTrace' > /dev/null; then
    echo "⚠️  Aviso: Encontrado System.out.println no código"
    echo "Remova logs de debug antes do commit"
    exit 1
  fi
fi

echo "✅ Commit aprovado!"
```

**Tornar executável:**

```bash
chmod +x .git/hooks/pre-commit
```

---

## 📖 15. CENÁRIOS PRÁTICOS

### **Cenário 1: Trabalhando em Equipe**

```bash
# Você: trabalhando na feature/login
git checkout -b feature/login
# ... trabalha por 2 horas ...
git add .
git commit -m "feat: implementa tela de login"
git push origin feature/login

# Colega: trabalha na feature/dashboard
git checkout -b feature/dashboard
# ... trabalha ...
git commit -m "feat: cria dashboard administrativo"
git push origin feature/dashboard

# Ambos fazem PR para develop
# Após aprovação, ambas são mergeadas
# Vocês atualizam suas branches locais:

git checkout develop
git pull origin develop  # Agora tem login E dashboard
```

### **Cenário 2: Bug em Produção**

```bash
# 1. Cliente reporta erro crítico em produção
# 2. Cria hotfix
git checkout main
git checkout -b hotfix/corrige-calculo-desconto

# 3. Corrige
# ... edita código ...
git commit -m "fix: corrige cálculo de desconto em produtos"

# 4. Testa localmente
./mvnw test

# 5. Merge direto em main (produção)
git checkout main
git merge hotfix/corrige-calculo-desconto
git push origin main

# 6. Atualiza develop também
git checkout develop
git merge hotfix/corrige-calculo-desconto
git push origin develop

# 7. Tag de versão
git tag -a v1.2.1 -m "Hotfix: calculo de desconto"
git push origin v1.2.1
```

### **Cenário 3: Desfazendo Erro**

```bash
# Commitou arquivo errado
git reset --soft HEAD~1  # Desfaz commit, mantém alterações
git reset HEAD arquivo-errado.java  # Remove do staging
git commit -m "feat: adiciona autenticação JWT"

# Já fez push e precisa desfazer
git revert abc1234  # Cria novo commit que desfaz o abc1234
git push origin develop

# Alterou arquivo que não deveria
git checkout -- arquivo.java  # Descarta alterações locais
```

---

## 🎓 16. DICAS PROFISSIONAIS

### **1. Commits Atômicos**
Cada commit deve ser uma unidade lógica completa:
- ✅ BOM: "feat: adiciona validação de email"
- ❌ RUIM: "vários ajustes e correções"

### **2. Revise Antes de Commitar**
```bash
git diff  # O que mudou?
git status  # Quais arquivos?
git add -p  # Adiciona pedaços específicos
```

### **3. Use .gitignore desde o Início**
Evita commitar arquivos desnecessários:
```bash
echo "target/" >> .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: adiciona gitignore"
```

### **4. Sempre Puxe Antes de Mergear**
```bash
git checkout develop
git pull origin develop  # SEMPRE faça isso antes de merge
git merge feature/sua-branch
```

### **5. Escreva Pensando em Quem Vai Revisar**
- Commits claros = revisão rápida
- Código limpo = menos perguntas
- Testes incluídos = confiança

---

## ✅ CONCLUSÃO

Este guia cobre:
- ✅ Arquitetura de branches (Git Flow)
- ✅ Padrões de commit (Conventional Commits)
- ✅ Fluxo de trabalho completo
- ✅ Comparação e merge
- ✅ Resolução de conflitos
- ✅ Versionamento semântico
- ✅ Pull Requests profissionais
- ✅ Proteção de branches
- ✅ Automação e hooks
- ✅ Cenários práticos

**Mantenha este documento sempre atualizado e compartilhe com a equipe!**

---

**Criado por:** Equipe de Desenvolvimento  
**Última atualização:** 2026-02-09  
**Versão:** 1.0.0
