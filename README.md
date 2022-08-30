<p align="center">
  <img src="./icon.svg" width="200" align="center" alt="Redux-reflect" style="max-width: 100%;" />
  <br/>
  <p align="center">
       🧙‍♂️ Create isolated components with redux to avoid unnecessary re-renders
  </p>
</p>

# Redux-reflect

- convenient version of the description of components with state
- lifecycle methods available
- various types of rendering are possible

## Installation

- pnpm

```bash
pnpm install redux-reflect
```

- yarn

```bash
yarn add redux-reflect
```

## Api

### General conception

- `selector` - is needed to select the necessary data from the state

To work properly `selector` you must wrap your application in `redux-provider` 

### bindView

```tsx
import { choiceThemeAction } from '~/features/theme'
 
const CheckoutTheme = bindView({
  view: Button,
  selector: (state) => ({ theme: state.theme.currentTheme }),
  bind: ({ theme }) => ({
    label: theme
  }),
  lifecycle: {
    onMounted: () => toast.show('Beautiful theme!')
  }
})
```

- `view` - here you can pass the component you want to use
- `bind` - takes a function to which it passes the data you selected from the selector, where you can transform it into the structure you want
- `lifecycle` - contains an life cycle object where you can subscribe to the want event component

Life cycle options

```ts
export interface Lifecycle {
  onMounted: LifecycleCallback;
  onUnMounted: LifecycleCallback;
  onBeforeMounted: LifecycleCallback;
}
```

### split view

```tsx
const Content = splitView({
  selector: (state: StateGeneric) => state.tasks,
  match: {
    empty: (tasks) => tasks.length === 0,
    started: (tasks) => tasks.length > 0,
  },
  cases: {
    empty: () => <div>pls, create a new task 🧙</div>,
    started: () => <div>started paint tasks!</div>,
  },
  otherwise: () => <div>It didn't turn out well.</div>,
});
```

or short version

```tsx
const Content = splitView({
  selector: (state: StateGeneric) => state.tasks,
  match: (tasks) => (tasks.length > 0 ? 'started' : 'empty'),
  cases: {
    empty: Empty,
    started: Paint,
  },
  otherwise: () => <span>Oh snap..</span>,
});
```

or multi select

```tsx
const Content = bindView({
  selector: (state: StateGeneric) => ({
    loading: state.loading,
    tasks: state.tasks,
  }),
  match: {
    loading: ({ loading }) => loading,
    empty: ({ tasks }) => tasks.length === 0,
    page: ({ loading, tasks }) => !loading && tasks.length > 0,
  },
  cases: {
    page: HomePage,
    loading: Loader,
    empty: EmptyState,
  },
  otherwise: () => <span>Oh snap..</span>,
});
```

- `match` - accept function or shape form.
- `cases` - accept react components
- `otherwise` - will be called when more than one option is wrong

### list

```tsx
const TaskList = mapList({
  selector: (state: State) => state.tasks,
  keyMap: (task) => task.id,
  item: ({ id, title }) => (
    <Container>
      <Tag>tag: {id}</Tag>
      <Typography>{title}</Typography>
    </Container>
  ),
  empty: () => <Empty>list is empty</Empty>,
});
```

or

```tsx
const TaskList = mapList({
  selector: (state: State) => state.tasks,
  item: ({ id, title, text }) => {
    return (
      <span>
        tag: {id}, title: {title} text: {text}
      </span>
    );
  },
  empty: () => <div>hey, list is scratch</div>,
});
```

- `item` - component to render
- `keyMap` - you can pass optional custom function for select need key, otherwise will use index
- `empty` - the passed component will be shown when the list is empty

### TODO
- [ ] Add examples with `redux` and `redux-toolkit`
- [ ] Fix typing `mapList` and `splitView` when passed match function
- [ ] Complete readme
- [ ] Release first version
- [ ] CI/CD