import { Component, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItemComponent, TodoFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="todo-container">
      <header class="header">
        <h1>Todos</h1>
        <div class="controls">
          <div class="filter-group" role="group" aria-label="Filter todos">
            @for (filter of filters; track filter.value) {
              <button
                class="filter-btn"
                [class.active]="activeFilter() === filter.value"
                [attr.aria-pressed]="activeFilter() === filter.value"
                (click)="setFilter(filter.value)"
              >
                {{ filter.label }}
              </button>
            }
          </div>
          @if (totalCount() > 0) {
            <span class="count">{{ activeCount() }} item{{ activeCount() === 1 ? '' : 's' }} left</span>
          }
        </div>
      </header>

      <app-todo-form (addTodo)="addTodo($event)" />

      @if (todos().length === 0) {
        <div class="empty-state">
          <p>No todos yet. Add one above!</p>
        </div>
      } @else {
        <ul class="todo-list" aria-label="Todo list">
          @for (todo of filteredTodos(); track todo.id) {
            <app-todo-item
              [todo]="todo"
              (toggle)="toggleTodo($event)"
              (delete)="deleteTodo($event)"
            />
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .todo-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .header {
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 300;
      color: #1f2937;
      margin-bottom: 1rem;
      text-align: center;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .filter-group {
      display: flex;
      gap: 0.5rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        color: #374151;
        border-color: #d1d5db;
      }

      &.active {
        color: #3b82f6;
        border-color: #3b82f6;
        background-color: #eff6ff;
      }

      &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    }

    .count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #9ca3af;

      p {
        font-size: 1.125rem;
      }
    }

    .todo-list {
      list-style: none;
      padding: 0;
      margin: 0;
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }
  `
})
export class TodoListComponent implements OnInit {
  private readonly todoService = inject(TodoService);

  todos = signal<Todo[]>([]);
  activeFilter = signal<FilterType>('all');

  filters = [
    { label: 'All', value: 'all' as FilterType },
    { label: 'Active', value: 'active' as FilterType },
    { label: 'Completed', value: 'completed' as FilterType }
  ];

  filteredTodos = computed(() => {
    const filter = this.activeFilter();
    const allTodos = this.todos();

    switch (filter) {
      case 'active':
        return allTodos.filter(t => !t.isCompleted);
      case 'completed':
        return allTodos.filter(t => t.isCompleted);
      default:
        return allTodos;
    }
  });

  totalCount = computed(() => this.todos().length);
  activeCount = computed(() => this.todos().filter(t => !t.isCompleted).length);

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => this.todos.set(todos),
      error: (err) => console.error('Failed to load todos:', err)
    });
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  addTodo(title: string): void {
    this.todoService.createTodo(title).subscribe({
      next: (todo) => this.todos.update(todos => [todo, ...todos]),
      error: (err) => console.error('Failed to create todo:', err)
    });
  }

  toggleTodo(todo: Todo): void {
    this.todoService.updateTodo(todo.id, { isCompleted: !todo.isCompleted }).subscribe({
      next: () => {
        this.todos.update(todos =>
          todos.map(t => t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t)
        );
      },
      error: (err) => console.error('Failed to update todo:', err)
    });
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
      },
      error: (err) => console.error('Failed to delete todo:', err)
    });
  }
}
