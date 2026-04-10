import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Auth, googleProvider } from '../lib/firebase';

// IMPORTANTE: Confirme o caminho de importação abaixo!
import {
  listUserTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask
} from '@dataconnect/generated';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string | null;
  category?: string | null;
}

type FilterType = 'ALL' | 'PENDING' | 'COMPLETED';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Estados para a nova tarefa
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Estados para a edição de tarefa
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Estado para os filtros
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(Auth, googleProvider);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(Auth);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const fetchTasks = async (showLoading = true) => {
    if (!user) return;

    // Só mostra o ecrã de carregamento se for o carregamento inicial
    if (showLoading) setIsLoadingTasks(true);

    try {
      const response = await listUserTasks({ userId: user.uid });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Erro ao procurar tarefas:", error);
    } finally {
      if (showLoading) setIsLoadingTasks(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user || isAdding) return;

    setIsAdding(true);

    const titleToSave = newTaskTitle;
    const categoryToSave = newTaskCategory || null;
    const dueDateToSave = newTaskDueDate || null;

    // Guardamos o ID temporário numa variável para o podermos encontrar depois
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      title: titleToSave,
      completed: false,
      category: categoryToSave,
      dueDate: dueDateToSave
    };

    // 1. Atualização Otimista
    setTasks(prevTasks => [tempTask, ...prevTasks]);

    setNewTaskTitle('');
    setNewTaskCategory('');
    setNewTaskDueDate('');

    try {
      // 2. Envia para a base de dados e guarda a resposta
      const result = await createTask({
        title: titleToSave,
        userId: user.uid,
        category: categoryToSave,
        dueDate: dueDateToSave
      });

      // 3. Em vez de fazer "fetchTasks", vamos apenas procurar a tarefa 
      // temporária na nossa lista e atualizar o seu ID para o ID real!
      // O Data Connect geralmente devolve o ID gerado dentro de result.data
      const realId = result.data?.task_insert || tempId;

      setTasks(prevTasks => prevTasks.map(t =>
        t.id === tempId ? { ...t, id: typeof realId === 'string' ? realId : (realId as any).id || tempId } : t
      ));

    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      // Se deu um erro real na nuvem, removemos a tarefa fantasma do ecrã
      setTasks(prevTasks => prevTasks.filter(t => t.id !== tempId));
    } finally {
      setIsAdding(false);
    }
  };

  // --- Funções de Edição ---
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category || '');
    setEditDueDate(task.dueDate || '');
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const saveEdit = async () => {
    if (!editingTaskId || !editTitle.trim()) return;

    try {
      // Atualização otimista
      setTasks(tasks.map(t =>
        t.id === editingTaskId
          ? { ...t, title: editTitle, category: editCategory || null, dueDate: editDueDate || null }
          : t
      ));

      await updateTask({
        id: editingTaskId,
        title: editTitle,
        category: editCategory || null,
        dueDate: editDueDate || null
      });

      setEditingTaskId(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      fetchTasks(); // Reverte em caso de erro
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      await toggleTask({ id, completed: !currentStatus });
    } catch (error) {
      console.error("Erro ao alternar o estado da tarefa:", error);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setTasks(tasks.filter(t => t.id !== id));
      await deleteTask({ id });
    } catch (error) {
      console.error("Erro ao apagar tarefa:", error);
      fetchTasks();
    }
  };

  // Filtragem das tarefas antes de as apresentar
  const filteredTasks = tasks.filter(task => {
    if (filter === 'PENDING') return !task.completed;
    if (filter === 'COMPLETED') return task.completed;
    return true; // 'ALL'
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500">A carregar o TaskFlow...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
      {!user ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">TaskFlow</h1>
          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {/* Ícone Google */}
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
        <div className="w-full max-w-4xl h-[90vh] flex flex-col gap-6">
          {/* Header */}
          <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 shrink-0">
            <h1 className="text-2xl font-bold">TaskFlow</h1>
            <div className="flex items-center gap-4">
              <img src={user.photoURL || ''} alt="Perfil" className="w-8 h-8 rounded-full border border-slate-300" />
              <span className="font-medium hidden sm:block">{user.displayName}</span>
              <button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 px-4 rounded-lg transition-colors">Sair</button>
            </div>
          </header>

          {/* Área Principal */}
          <main className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">

            {/* Secção Superior: Título e Filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
              <h2 className="text-xl font-semibold">Suas Tarefas</h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Todas</button>
                <button onClick={() => setFilter('PENDING')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'PENDING' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Pendentes</button>
                <button onClick={() => setFilter('COMPLETED')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'COMPLETED' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Concluídas</button>
              </div>
            </div>

            {/* Formulário de nova tarefa */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="O que precisa de ser feito?"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Sem categoria</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Projetos">Projetos</option>
                <option value="RPG">RPG</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Adicionar
              </button>
            </form>

            {/* Listagem */}
            <div className="flex-1 overflow-y-auto pr-2">
              {isLoadingTasks ? (
                <div className="flex justify-center py-10 text-slate-400">A carregar tarefas...</div>
              ) : filteredTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  <p>Nenhuma tarefa encontrada.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredTasks.map(task => (
                    <li key={task.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg transition-all group ${task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}>

                      {editingTaskId === task.id ? (
                        /* MODO DE EDIÇÃO */
                        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-white border border-slate-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          >
                            <option value="">Sem categoria</option>
                            <option value="Trabalho">Trabalho</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Projetos">Projetos</option>
                            <option value="RPG">RPG</option>
                          </select>
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium text-sm transition-colors">Guardar</button>
                            <button onClick={cancelEditing} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded font-medium text-sm transition-colors">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        /* MODO DE VISUALIZAÇÃO */
                        <>
                          <div className="flex items-center gap-4 flex-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTask(task.id, task.completed)}
                              className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                            />
                            <div className="flex flex-col">
                              <span className={`text-lg transition-all font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {task.title}
                              </span>

                              {/* Apresentação das Tags (Categoria e Data) */}
                              {(task.category || task.dueDate) && (
                                <div className="flex flex-wrap gap-2 mt-1.5">
                                  {task.category && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${task.completed ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                      {task.category}
                                    </span>
                                  )}
                                  {task.dueDate && (
                                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${task.completed ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                      {new Date(task.dueDate).toLocaleDateString('pt-PT')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ações: Editar e Apagar */}
                          <div className="flex items-center gap-1 mt-3 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(task)} className="text-slate-400 hover:text-blue-500 p-2 transition-colors" title="Editar tarefa">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors" title="Apagar tarefa">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </div>
                        </>
                      )}
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