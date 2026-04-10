import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Auth, googleProvider } from '../lib/firebase';

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
  const [isAdding, setIsAdding] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

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

    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      title: titleToSave,
      completed: false,
      category: categoryToSave,
      dueDate: dueDateToSave
    };

    setTasks(prevTasks => [tempTask, ...prevTasks]);

    setNewTaskTitle('');
    setNewTaskCategory('');
    setNewTaskDueDate('');

    try {
      const result = await createTask({
        title: titleToSave,
        userId: user.uid,
        category: categoryToSave,
        dueDate: dueDateToSave
      });

      const realId = result.data?.task_insert || tempId;

      setTasks(prevTasks => prevTasks.map(t =>
        t.id === tempId ? { ...t, id: typeof realId === 'string' ? realId : (realId as any).id || tempId } : t
      ));

    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== tempId));
    } finally {
      setIsAdding(false);
    }
  };

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
      fetchTasks(false);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
      await toggleTask({ id, completed: !currentStatus });
    } catch (error) {
      console.error("Erro ao alternar o estado da tarefa:", error);
      fetchTasks(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setTasks(tasks.filter(t => t.id !== id));
      await deleteTask({ id });
    } catch (error) {
      console.error("Erro ao apagar tarefa:", error);
      fetchTasks(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'PENDING') return !task.completed;
    if (filter === 'COMPLETED') return task.completed;
    return true;
  });

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-medium text-zinc-400">Iniciando TaskManager...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {!user ? (
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 text-center w-full max-w-sm">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">TaskManager</h1>
          <p className="text-zinc-400 mb-8 text-sm">Qual a boa pra hoje?</p>
          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-zinc-200 text-zinc-900 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg"
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
        <div className="w-full max-w-4xl h-[90vh] flex flex-col gap-6">
          {/* Header */}
          <header className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">TaskManager</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-zinc-400 font-medium hidden sm:block text-sm">
                Olá, <span className="text-zinc-200">{user.displayName?.split(' ')[0]}</span>
              </span>
              <img src={user.photoURL || ''} alt="Perfil" className="w-9 h-9 rounded-full border-2 border-zinc-700 object-cover" />
              <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-2 px-4 rounded-xl transition-colors text-sm">Sair</button>
            </div>
          </header>

          {/* Área Principal */}
          <main className="flex-1 bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800 flex flex-col overflow-hidden relative">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
              <h2 className="text-xl font-semibold text-white">Suas Tarefas</h2>
              <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Todas</button>
                <button onClick={() => setFilter('PENDING')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'PENDING' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Pendentes</button>
                <button onClick={() => setFilter('COMPLETED')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'COMPLETED' ? 'bg-zinc-800 shadow-sm text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Concluídas</button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 mb-8 shrink-0 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Qual é a próxima missão?"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-zinc-100 placeholder-zinc-500"
              />
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">Categoria</option>
                <option value="Trabalho">Trabalho</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Projetos">Projetos</option>
                <option value="RPG">RPG</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-3 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer [color-scheme:dark]"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim() || isAdding}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] whitespace-nowrap"
              >
                {isAdding ? 'Criando...' : 'Adicionar'}
              </button>
            </form>

            {/* Listagem */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingTasks && tasks.length === 0 ? (
                <div className="flex justify-center py-10 text-indigo-400 animate-pulse">A carregar os seus dados...</div>
              ) : filteredTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-lg">Tudo limpo por aqui.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {filteredTasks.map(task => (
                    <li key={task.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-2xl transition-all group ${task.completed ? 'bg-zinc-950/40 border-zinc-800/50 opacity-70' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600 hover:shadow-lg hover:shadow-black/20'}`}>

                      {editingTaskId === task.id ? (
                        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-zinc-950 border border-indigo-500/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Categoria</option>
                            <option value="Trabalho">Trabalho</option>
                            <option value="Pessoal">Pessoal</option>
                            <option value="Projetos">Projetos</option>
                            <option value="RPG">RPG</option>
                          </select>
                          <input
                            type="date"
                            value={editDueDate}
                            onChange={(e) => setEditDueDate(e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
                          />
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-emerald-500/20">Salvar</button>
                            <button onClick={cancelEditing} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-zinc-700">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id, task.completed)}
                                className="w-6 h-6 rounded-md border-zinc-600 bg-zinc-800 checked:bg-indigo-500 checked:border-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer accent-indigo-500 transition-all appearance-auto"
                              />
                            </div>

                            <div className="flex flex-col">
                              <span className={`text-lg transition-all font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                                {task.title}
                              </span>

                              {(task.category || task.dueDate) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {task.category && (
                                    <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${task.completed ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'}`}>
                                      {task.category}
                                    </span>
                                  )}
                                  {task.dueDate && (
                                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium ${task.completed ? 'bg-zinc-900 text-zinc-500 border-zinc-800' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                      {new Date(task.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 mt-4 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(task)} className="text-zinc-500 hover:text-indigo-400 p-2.5 bg-zinc-800/0 hover:bg-zinc-800 rounded-lg transition-all" title="Editar tarefa">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button onClick={() => handleDeleteTask(task.id)} className="text-zinc-500 hover:text-red-400 p-2.5 bg-zinc-800/0 hover:bg-zinc-800 rounded-lg transition-all" title="Apagar tarefa">
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