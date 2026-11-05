import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

describe('Todo App task lifecycle', () => {
  it('shows the exact empty state and a labeled text input initially', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Todo App' })).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Add a task')).toHaveAttribute('type', 'text');
  });

  it('adds a task by button, preserves the entered title, and clears the input', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'Write a note');
    await user.click(screen.getByTestId('add-button'));

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('Write a note');
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('adds tasks on Enter with sequential IDs in oldest-first order', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'First task{Enter}Second task{Enter}');

    const list = screen.getByTestId('todo-list');
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-testid'))).toEqual([
      'todo-item-1',
      'todo-item-2',
    ]);
    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('First task');
    expect(screen.getByTestId('todo-title-2')).toHaveTextContent('Second task');
    expect(input).toHaveValue('');
  });

  it('ignores empty and whitespace-only submissions without showing an error', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.click(screen.getByTestId('add-button'));
    await user.type(input, '   ');
    await user.click(screen.getByTestId('add-button'));
    await user.type(input, '  {Enter}');

    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('toggles only the selected task and reflects completion in checkbox and title style', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'First task{Enter}Second task{Enter}');
    await user.click(screen.getByTestId('todo-checkbox-1'));

    expect(screen.getByTestId('todo-checkbox-1')).toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'line-through' });
    expect(screen.getByTestId('todo-checkbox-2')).not.toBeChecked();
    expect(screen.getByTestId('todo-title-2')).toHaveStyle({ textDecoration: 'none' });

    await user.click(screen.getByTestId('todo-checkbox-1'));
    expect(screen.getByTestId('todo-checkbox-1')).not.toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveStyle({ textDecoration: 'none' });
  });

  it('deletes only the selected task and restores the empty state after the last deletion', async () => {
    const user = userEvent.setup();
    render(<App />);
    const input = screen.getByTestId('todo-input');

    await user.type(input, 'Keep this{Enter}Remove this{Enter}');
    await user.click(screen.getByTestId('todo-delete-2'));

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();

    await user.click(screen.getByTestId('todo-delete-1'));
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet.');
    expect(screen.queryByTestId('todo-list')).not.toBeInTheDocument();
  });
});
