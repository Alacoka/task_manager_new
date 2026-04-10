import { CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, ToggleTaskData, ToggleTaskVariables, DeleteTaskData, DeleteTaskVariables, ListUserTasksData, ListUserTasksVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useToggleTask(options?: useDataConnectMutationOptions<ToggleTaskData, FirebaseError, ToggleTaskVariables>): UseDataConnectMutationResult<ToggleTaskData, ToggleTaskVariables>;
export function useToggleTask(dc: DataConnect, options?: useDataConnectMutationOptions<ToggleTaskData, FirebaseError, ToggleTaskVariables>): UseDataConnectMutationResult<ToggleTaskData, ToggleTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useListUserTasks(vars: ListUserTasksVariables, options?: useDataConnectQueryOptions<ListUserTasksData>): UseDataConnectQueryResult<ListUserTasksData, ListUserTasksVariables>;
export function useListUserTasks(dc: DataConnect, vars: ListUserTasksVariables, options?: useDataConnectQueryOptions<ListUserTasksData>): UseDataConnectQueryResult<ListUserTasksData, ListUserTasksVariables>;
