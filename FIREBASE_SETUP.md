# Configuração do Firebase para SGQ NEXT

Este documento descreve os passos necessários para configurar o Firebase para uso com o SGQ NEXT.

## Criando um projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao seu projeto (ex: "sgq-next")
4. Desative o Google Analytics se não precisar ou ative conforme sua preferência
5. Clique em "Criar projeto"

## Configurando o Firestore Database

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo "Iniciar no modo de produção" ou "Iniciar no modo de teste" (para desenvolvimento)
4. Selecione uma localização para seu banco de dados (idealmente, escolha uma localização próxima dos seus usuários)
5. Clique em "Ativar"

## Configurando a Autenticação

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", ative os métodos de login que desejar:
   - Email/Senha (recomendado para início)
   - Google, Facebook, etc. conforme necessário

## Configurando o Storage

1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Escolha as regras de segurança (recomendado iniciar com regras que permitam acesso apenas para usuários autenticados)
4. Selecione a mesma localização que você escolheu para o Firestore
5. Clique em "Concluir"

## Obtendo as credenciais de configuração

1. No menu lateral, clique em "Project Overview" (Visão geral do projeto)
2. Clique no ícone da web (`</>`) para adicionar um app da web
3. Registre um apelido para seu app (ex: "sgq-next-web")
4. (Opcional) Ative o Firebase Hosting
5. Clique em "Registrar app"
6. Você verá um objeto de configuração semelhante a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"
};
```

## Configurando o ambiente local

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as variáveis de ambiente baseadas nas credenciais obtidas:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxx
```

## Configurando o Vercel

Ao implantar no Vercel, você precisa configurar essas mesmas variáveis de ambiente no seu projeto:

1. No painel do Vercel, acesse seu projeto
2. Vá para a guia "Settings"
3. Clique em "Environment Variables"
4. Adicione cada uma das variáveis de ambiente listadas acima
5. Clique em "Save"

## Regras de segurança

### Firestore Rules

Exemplo básico de regras de segurança para o Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Autenticação necessária para qualquer operação
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Regras específicas para coleções
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /projetos/{projetoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.id_utilizador_responsavel == request.auth.uid);
    }
  }
}
```

### Storage Rules

Exemplo básico de regras de segurança para o Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Estrutura de coleções no Firestore

Recomendamos criar as seguintes coleções no Firestore:

- `usuarios`: Informações dos usuários
- `projetos`: Informações dos projetos
- `ensaios`: Registro de ensaios
- `rfis`: Solicitações de informação
- `nao_conformidades`: Registro de não conformidades
- `documentos`: Metadados dos documentos
- `fornecedores`: Cadastro de fornecedores
- `avaliacoes_fornecedores`: Avaliações de fornecedores
- `checklists`: Checklists de qualidade
- `itens_checklist`: Itens individuais de checklists

Cada coleção deve seguir a estrutura definida nas interfaces TypeScript do projeto. 