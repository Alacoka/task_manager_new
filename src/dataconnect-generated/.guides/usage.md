# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateTask, useToggleTask, useDeleteTask, useListUserTasks } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateTask(createTaskVars);

const { data, isPending, isSuccess, isError, error } = useToggleTask(toggleTaskVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTask(deleteTaskVars);

const { data, isPending, isSuccess, isError, error } = useListUserTasks(listUserTasksVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createTask, toggleTask, deleteTask, listUserTasks } from '@dataconnect/generated';


// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation ToggleTask:  For variables, look at type ToggleTaskVars in ../index.d.ts
const { data } = await ToggleTask(dataConnect, toggleTaskVars);

// Operation DeleteTask:  For variables, look at type DeleteTaskVars in ../index.d.ts
const { data } = await DeleteTask(dataConnect, deleteTaskVars);

// Operation ListUserTasks:  For variables, look at type ListUserTasksVars in ../index.d.ts
const { data } = await ListUserTasks(dataConnect, listUserTasksVars);


```