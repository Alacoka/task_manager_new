# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserTasks*](#listusertasks)
- [**Mutations**](#mutations)
  - [*CreateTask*](#createtask)
  - [*ToggleTask*](#toggletask)
  - [*DeleteTask*](#deletetask)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserTasks
You can execute the `ListUserTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserTasks(vars: ListUserTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, ListUserTasksVariables>;

interface ListUserTasksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserTasksVariables): QueryRef<ListUserTasksData, ListUserTasksVariables>;
}
export const listUserTasksRef: ListUserTasksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserTasks(dc: DataConnect, vars: ListUserTasksVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, ListUserTasksVariables>;

interface ListUserTasksRef {
  ...
  (dc: DataConnect, vars: ListUserTasksVariables): QueryRef<ListUserTasksData, ListUserTasksVariables>;
}
export const listUserTasksRef: ListUserTasksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserTasksRef:
```typescript
const name = listUserTasksRef.operationName;
console.log(name);
```

### Variables
The `ListUserTasks` query requires an argument of type `ListUserTasksVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserTasksVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `ListUserTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserTasksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    completed: boolean;
    createdAt: TimestampString;
  } & Task_Key)[];
}
```
### Using `ListUserTasks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserTasks, ListUserTasksVariables } from '@dataconnect/generated';

// The `ListUserTasks` query requires an argument of type `ListUserTasksVariables`:
const listUserTasksVars: ListUserTasksVariables = {
  userId: ..., 
};

// Call the `listUserTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserTasks(listUserTasksVars);
// Variables can be defined inline as well.
const { data } = await listUserTasks({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserTasks(dataConnect, listUserTasksVars);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listUserTasks(listUserTasksVars).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListUserTasks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserTasksRef, ListUserTasksVariables } from '@dataconnect/generated';

// The `ListUserTasks` query requires an argument of type `ListUserTasksVariables`:
const listUserTasksVars: ListUserTasksVariables = {
  userId: ..., 
};

// Call the `listUserTasksRef()` function to get a reference to the query.
const ref = listUserTasksRef(listUserTasksVars);
// Variables can be defined inline as well.
const ref = listUserTasksRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserTasksRef(dataConnect, listUserTasksVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
console.log(name);
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  title: string;
  userId: string;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  userId: ..., 
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  userId: ..., 
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

## ToggleTask
You can execute the `ToggleTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
toggleTask(vars: ToggleTaskVariables): MutationPromise<ToggleTaskData, ToggleTaskVariables>;

interface ToggleTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ToggleTaskVariables): MutationRef<ToggleTaskData, ToggleTaskVariables>;
}
export const toggleTaskRef: ToggleTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
toggleTask(dc: DataConnect, vars: ToggleTaskVariables): MutationPromise<ToggleTaskData, ToggleTaskVariables>;

interface ToggleTaskRef {
  ...
  (dc: DataConnect, vars: ToggleTaskVariables): MutationRef<ToggleTaskData, ToggleTaskVariables>;
}
export const toggleTaskRef: ToggleTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the toggleTaskRef:
```typescript
const name = toggleTaskRef.operationName;
console.log(name);
```

### Variables
The `ToggleTask` mutation requires an argument of type `ToggleTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ToggleTaskVariables {
  id: UUIDString;
  completed: boolean;
}
```
### Return Type
Recall that executing the `ToggleTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ToggleTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ToggleTaskData {
  task_update?: Task_Key | null;
}
```
### Using `ToggleTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, toggleTask, ToggleTaskVariables } from '@dataconnect/generated';

// The `ToggleTask` mutation requires an argument of type `ToggleTaskVariables`:
const toggleTaskVars: ToggleTaskVariables = {
  id: ..., 
  completed: ..., 
};

// Call the `toggleTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await toggleTask(toggleTaskVars);
// Variables can be defined inline as well.
const { data } = await toggleTask({ id: ..., completed: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await toggleTask(dataConnect, toggleTaskVars);

console.log(data.task_update);

// Or, you can use the `Promise` API.
toggleTask(toggleTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

### Using `ToggleTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, toggleTaskRef, ToggleTaskVariables } from '@dataconnect/generated';

// The `ToggleTask` mutation requires an argument of type `ToggleTaskVariables`:
const toggleTaskVars: ToggleTaskVariables = {
  id: ..., 
  completed: ..., 
};

// Call the `toggleTaskRef()` function to get a reference to the mutation.
const ref = toggleTaskRef(toggleTaskVars);
// Variables can be defined inline as well.
const ref = toggleTaskRef({ id: ..., completed: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = toggleTaskRef(dataConnect, toggleTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_update);
});
```

## DeleteTask
You can execute the `DeleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskRef:
```typescript
const name = deleteTaskRef.operationName;
console.log(name);
```

### Variables
The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}
```
### Using `DeleteTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTask, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTask(deleteTaskVars);
// Variables can be defined inline as well.
const { data } = await deleteTask({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTask(dataConnect, deleteTaskVars);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
deleteTask(deleteTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

### Using `DeleteTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskRef, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTaskRef()` function to get a reference to the mutation.
const ref = deleteTaskRef(deleteTaskVars);
// Variables can be defined inline as well.
const ref = deleteTaskRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskRef(dataConnect, deleteTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_delete);
});
```

