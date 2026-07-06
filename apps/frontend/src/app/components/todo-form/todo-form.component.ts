import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="todo-form" (submit)="onSubmit($event)">
      <input
        type="text"
        class="todo-input"
        placeholder="What needs to be done?"
        [ngModel]="title()"
        name="title"
        (ngModelChange)="title.set($event)"
        aria-label="New todo title"
      />
      <button type="submit" class="add-btn" [disabled]="!title().trim()">
        Add
      </button>
    </form>
  `,
  styles: `
    .todo-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .todo-input {
      flex: 1;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      outline: none;
      transition: border-color 0.15s;

      &:focus {
        border-color: #3b82f6;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .add-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: white;
      background-color: #3b82f6;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.15s;

      &:hover:not(:disabled) {
        background-color: #2563eb;
      }

      &:disabled {
        background-color: #93c5fd;
        cursor: not-allowed;
      }

      &:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    }
  `
})
export class TodoFormComponent {
  addTodo = output<string>();
  title = signal('');

  onSubmit(event: Event): void {
    event.preventDefault();
    const trimmed = this.title().trim();
    if (trimmed) {
      this.addTodo.emit(trimmed);
      this.title.set('');
    }
  }
}
