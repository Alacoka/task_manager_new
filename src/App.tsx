import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Auth, googleProvider } from '../lib/firebase';

// IMPORTANTE: Ajuste este caminho consoante a pasta onde o SDK foi gerado!
// Geralmente fica na raiz do projeto ou dentro de src.
import {
  listUserTasks,
  createTask,
  toggleTask,
  deleteTask
} from '../dataconnect-generated/js/default-connector';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: any;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // 1. Gerir a Autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Carregar as tarefas sempre que o utilizador mudar
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]); // Limpa as tarefas se o utilizador fizer logout
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // --- LÓGICA DA BASE DE DADOS (Firebase Data Connect) ---

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoadingTasks(true);
    try {
      // Chama a Query que criámos no queries.gql
      const response = await listUserTasks({ userId: user.uid });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Erro ao procurar tarefas:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;

    try {
      // Chama a Mutation para criar a tarefa
      await createTask({
        title: newTaskTitle,
        userId: user.uid
      });

      setNewTaskTitle(''); // Limpa o input
      fetchTasks(); // Atualiza a lista para mostrar a nova tarefa
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    try {
      // Otimista: atualiza o ecrã primeiro para parecer mais rápido
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

      // Chama a Mutation no background
      await toggleTask({ id, completed: !currentStatus });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      fetchTasks(); // Em caso de erro, reverte para o estado da base de dados
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      // Otimista: remove do ecrã primeiro
      setTasks(tasks.filter(t => t.id !== id));

      // Chama a Mutation para apagar
      await deleteTask({ id });
    } catch (error) {
      console.error("Erro ao apagar tarefa:", error);
      fetchTasks(); // Reverte em caso de erro
    }
  };

  // --- INTERFACE (Manteve-se igual, apenas ligada às novas funções) ---

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500">A carregar o TaskFlow...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">

      {/* TELA DE LOGIN */}
      {!user ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">TaskFlow</h1>
          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Entrar com Google
          </button>
        </div>
      ) : (

        /* APLICATIVO PRINCIPAL */
        <div className="w-full max-w-3xl h-[85vh] flex flex-col gap-6">

          {/* Header */}
          <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
            <h1 className="text-2xl font-bold">TaskFlow</h1>
            <div className="flex items-center gap-4">
              <img
                src={user.photoURL || ''}
                alt="Perfil"
                className="w-8 h-8 rounded-full border border-slate-300"
              />
              <span className="font-medium hidden sm:block">
                {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-4 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </header>

          {/* Área Principal */}
          <main className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <h2 className="text-xl font-semibold mb-6">Suas Tarefas</h2>

            {/* Input de nova tarefa */}
            <form onSubmit={handleAddTask} className="flex gap-3 mb-6 shrink-0">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="O que precisa de ser feito hoje?"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Adicionar
              </button>
            </form>

            {/* Listagem */}
            <div className="flex-1 overflow-y-auto pr-2">
              {isLoadingTasks ? (
                <div className="flex justify-center py-10 text-slate-400">A carregar tarefas...</div>
              ) : tasks.length === 0 ? (
                // Ecrã vazio
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  <p>Nenhuma tarefa por aqui. Aproveite o dia!</p>
                </div>
              ) : (
                // Lista preenchida
                <ul className="space-y-3">
                  {tasks.map(task => (
                    <li
                      key={task.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all group ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id, task.completed)}
                          className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                        <span className={`text-lg transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                        title="Apagar tarefa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </main>
        </div>
      )}
    </div>
  );
}

export default App;