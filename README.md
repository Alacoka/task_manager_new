# TaskFlow 🚀

O **TaskFlow** é um gestor de tarefas moderno e de alta performance, concebido para oferecer uma experiência de utilizador (UX) fluida e sem interrupções. O projeto foca-se em "Zero Latency UI", utilizando atualizações otimistas para que a interface reaja instantaneamente às ações do utilizador.

![TaskFlow Preview](./task_manager_img.png) ## 🌟 Funcionalidades

- **Autenticação com Google:** Acesso rápido e seguro utilizando Firebase Authentication.
- **Optimistic UI (Atualização Otimista):** As tarefas são adicionadas, editadas ou removidas visualmente antes mesmo da confirmação da base de dados, eliminando os tempos de espera.
- **Arquitetura Relacional:** Utiliza o novo **Firebase Data Connect** para gerir uma base de dados **PostgreSQL**, permitindo relações complexas e consultas tipadas.
- **Dark Mode Elegante:** Interface moderna com tema escuro (Zinc & Indigo) focada no conforto visual.
- **Categorização Avançada:** Organize as suas tarefas por categorias (Trabalho, Pessoal, Projetos, RPG).
- **Filtros e Prazos:** Controlo de datas de entrega e filtragem rápida por estado (Todas, Pendentes, Concluídas).

## 🛠️ Stack Tecnológica

- **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Firebase Data Connect](https://firebase.google.com/docs/data-connect) (PostgreSQL)
- **Autenticação:** [Firebase Auth](https://firebase.google.com/docs/auth)
- **Deploy:** [Vercel](https://vercel.com/) / [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+)
- Firebase CLI (`npm install -g firebase-tools`)

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/seu-utilizador/task_manager_new.git](https://github.com/seu-utilizador/task_manager_new.git)
   cd task_manager_new
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configuração do Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Ative o **Authentication** com o provedor **Google**.
   - Ative o **Data Connect** e configure a instância do **Cloud SQL (PostgreSQL)**.
   - Adicione as suas credenciais no ficheiro `src/lib/firebase.ts` (ou ficheiro `.env` correspondente).

4. **Preparar a Base de Dados:**
   ```bash
   # Para subir o schema e os conectores para a nuvem
   firebase deploy --only dataconnect
   
   # Para gerar o SDK tipado localmente
   firebase dataconnect:sdk:generate
   ```

5. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📂 Estrutura de Pastas

- `dataconnect/`: Configurações da base de dados, Schema GraphQL e Mutations.
- `src/dataconnect-generated/`: SDK gerado automaticamente pelo Firebase para chamadas tipadas.
- `src/lib/`: Configurações de inicialização do Firebase e exportação dos serviços.
- `src/App.tsx`: Lógica principal da aplicação e interface.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o ficheiro [LICENSE](LICENSE) para mais detalhes.

---
Desenvolvido com ☕ e TypeScript por [Kawã Gonçalves](https://linkedin.com/in/seu-perfil).
