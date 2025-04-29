# 🚀 SGQ NEXT - Sistema Global de Gestão da Qualidade

O SGQ NEXT é um sistema moderno, responsivo, multilingue (Português PT, Inglês GB e Espanhol ES), que integra gestão de qualidade, dashboards analíticos, comunicação interna entre utilizadores e segurança avançada com autenticação Firebase, sendo totalmente funcional desde o primeiro acesso.

## Tecnologias Utilizadas

- **Frontend:** React, Next.js, TypeScript, TailwindCSS
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **Implantação:** Vercel
- **Versionamento:** GitHub

## Módulos Principais

- **Documentos:** Gestão de planos, procedimentos e RFIs com rastreabilidade
- **Fornecedores:** Avaliação de desempenho e contratos
- **Materiais:** Catálogo rastreável e ligação a obras
- **Checklists:** Validação de todas as fases de execução
- **Ensaios:** Controlo técnico e relatórios automáticos
- **Não Conformidades (NCs):** Gestão completa e fecho integrado
- **Auditorias:** Internas e externas com planeamento e registo
- **Relatórios:** Mensais, parciais e finais
- **Analytics:** Dashboards de KPIs com alertas inteligentes
- **Sistema de Comunicação Interna:** Mensagens e notificações entre utilizadores

## Funcionalidades Obrigatórias

- CRUD real em todos os módulos
- Uploads e downloads de documentos (PDFs, imagens, Excel)
- Visualização responsiva (PC, tablet e telemóvel)
- Suporte multilingue total
- Integração de dados cruzados entre módulos
- Segurança com JWT/Firebase Auth
- Rastreabilidade de ações e logs de atividade

## Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sgq-next.git
   cd sgq-next
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure o arquivo .env.local com suas credenciais do Firebase:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Implantação no Vercel

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no Vercel
3. Implante sua aplicação

## Melhorias Futuras

- Aplicação mobile em React Native
- Integração via API externa com ERPs
- Automatização de alertas por email
- Workflows multinível de aprovação de documentos
- Machine Learning para previsão de não conformidades

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## Licença

Este projeto está licenciado sob a licença MIT.

## Contato

Para mais informações, entre em contato através do email: [seu-email@exemplo.com](mailto:seu-email@exemplo.com) 

Projeto SGQ-Next  - Todos os direitos reservados  2025