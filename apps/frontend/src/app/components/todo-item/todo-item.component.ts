import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-item',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li class="todo-item" [class.completed]="todo().isCompleted">
      <label class="todo-label">
        <input
          type="checkbox"
          [checked]="todo().isCompleted"
          (change)="toggle.emit(todo())"
          [attr.aria-label]="'Mark ' + todo().title + ' as ' + (todo().isCompleted ? 'incomplete' : 'complete')"
        />
        <span class="todo-title">{{ todo().title }}</span>
      </label>
      <span class="todo-date">{{ todo().createdAt | date:'short' }}</span>
      <button
        class="delete-btn"
        (click)="delete.emit(todo().id)"
        [attr.aria-label]="'Delete ' + todo().title"
      >
        ×
      </button>
    </li>
  `,
  styles: `
    .todo-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      transition: background-color 0.15s;

      &:hover {
        background-color: #f9fafb;
      }

      &.completed {
        .todo-title {
          text-decoration: line-through;
          color: #9ca3af;
        }
      }
    }

    .todo-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      cursor: pointer;
    }

    input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .todo-title {
      flex: 1;
      font-size: 1rem;
      color: #1f2937;
    }

    .todo-date {
      font-size: 0.75rem;
      color: #9ca3af;
      white-space: nowrap;
    }

    .delete-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #ef4444;
      cursor: pointer;
      padding: 0 0.25rem;
      line-height: 1;
      opacity: 0;
      transition: opacity 0.15s;

      &:hover {
        color: #dc2626;
      }

      &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    }

    .todo-item:hover .delete-btn {
      opacity: 1;
    }
  `
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggle = output<Todo>();
  delete = output<number>();
}
