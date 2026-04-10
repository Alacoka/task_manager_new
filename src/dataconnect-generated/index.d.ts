import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  userId: string;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface ListUserTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    completed: boolean;
    createdAt: TimestampString;
  } & Task_Key)[];
}

export interface ListUserTasksVariables {
  userId: string;
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface ToggleTaskData {
  task_update?: Task_Key | null;
}

export interface ToggleTaskVariables {
  id: UUIDString;
  completed: boolean;
}

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface ToggleTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ToggleTaskVariables): MutationRef<ToggleTaskData, ToggleTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ToggleTaskVariables): MutationRef<ToggleTaskData, ToggleTaskVariables>;
  operationName: string;
}
export const toggleTaskRef: ToggleTaskRef;

export function toggleTask(vars: ToggleTaskVariables): MutationPromise<ToggleTaskData, ToggleTaskVariables>;
export function toggleTask(dc: DataConnect, vars: ToggleTaskVariables): MutationPromise<ToggleTaskData, ToggleTaskVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface ListUserTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserTasksVariables): QueryRef<ListUserTasksData, ListUserTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserTasksVariables): QueryRef<ListUserTasksData, ListUserTasksVariables>;
  operationName: string;
}
export const listUserTasksRef: ListUserTasksRef;

export function listUserTasks(vars: ListUserTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, ListUserTasksVariables>;
export function listUserTasks(dc: DataConnect, vars: ListUserTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, ListUserTasksVariables>;

