import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, Calendar, AlertCircle, Sun, Moon } from 'lucide-react';
import Cookies from 'js-cookie';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'baixa' | 'média' | 'alta';
  dueDate: string;
  createdAt: string;
}

const CATEGORIES = [
  'Pessoal',
  'Trabalho',
  'Estudos',
  'Compras',
  'Saúde',
  'Casa',
  'Outros'
];

const PRIORITIES = {
  baixa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  média: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  alta: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Pessoal');
  const [selectedPriority, setSelectedPriority] = useState<Task['priority']>('média');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'todas' | 'pendentes' | 'concluídas'>('todas');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks and theme from cookies on component mount
  useEffect(() => {
    const savedTasks = Cookies.get('tasks');
    const savedTheme = Cookies.get('darkMode');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Save tasks to cookies whenever they change
  useEffect(() => {
    Cookies.set('tasks', JSON.stringify(tasks), { expires: 365 });
  }, [tasks]);

  // Update theme and save to cookies
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Cookies.set('darkMode', darkMode.toString(), { expires: 365 });
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'pendentes') return !task.completed;
      if (filter === 'concluídas') return task.completed;
      return true;
    })
    .filter(task => {
      if (categoryFilter === 'todas') return true;
      return task.category === categoryFilter;
    })
    .sort((a, b) => {
      // Sort by priority (alta > média > baixa)
      const priorityOrder = { alta: 3, média: 2, baixa: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by due date if both have one
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  const isTaskOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gerenciador de Tarefas</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <form onSubmit={addTask} className="mb-8 space-y-4">
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Adicionar nova tarefa..."
                className="flex-1 min-w-[300px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as Task['priority'])}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="baixa">Prioridade Baixa</option>
                <option value="média">Prioridade Média</option>
                <option value="alta">Prioridade Alta</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                <span>Adicionar</span>
              </button>
            </div>
          </form>

          <div className="flex gap-4 mb-6 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as Tarefas</option>
              <option value="pendentes">Pendentes</option>
              <option value="concluídas">Concluídas</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="todas">Todas as Categorias</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {task.completed ? (
                      <CheckCircle className="text-purple-600 dark:text-purple-400" size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'} font-medium`}>
                        {task.text}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITIES[task.priority]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                        {task.category}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} />
                        <span className={isTaskOverdue(task.dueDate) ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
                          {formatDate(task.dueDate)}
                          {isTaskOverdue(task.dueDate) && !task.completed && (
                            <span className="ml-2 inline-flex items-center">
                              <AlertCircle size={14} className="text-red-500 dark:text-red-400" />
                              <span className="ml-1">Atrasada</span>
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-4">
                    Criada em {formatDate(task.createdAt)}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Nenhuma tarefa encontrada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;