import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue visual indicators', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Fixed test date: February 3, 2026
      jest.setSystemTime(new Date('2026-02-03T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should apply overdue class when todo has past due date and is incomplete', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-01', completed: 0 };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
    });

    it('should not apply overdue class when todo is completed despite past due date', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: '2026-02-01', completed: 1 };
      const { container } = render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
      expect(card).toHaveClass('completed');
    });

    it('should not apply overdue class when todo is due today', () => {
      const todayTodo = { ...mockTodo, dueDate: '2026-02-03', completed: 0 };
      const { container } = render(<TodoCard todo={todayTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should not apply overdue class when todo has future due date', () => {
      const futureTodo = { ...mockTodo, dueDate: '2026-02-10', completed: 0 };
      const { container } = render(<TodoCard todo={futureTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should not apply overdue class when todo has no due date', () => {
      const noDueDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      const { container } = render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);
      
      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
    });

    it('should remove overdue class when overdue todo is marked complete', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-02-01', completed: 0 };
      const { container, rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);
      
      let card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
      
      // Simulate marking as complete
      const completedTodo = { ...overdueTodo, completed: 1 };
      rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
      
      card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
      expect(card).toHaveClass('completed');
    });

    it('should add overdue class when completed overdue todo is marked incomplete', () => {
      const completedOverdueTodo = { ...mockTodo, dueDate: '2026-02-01', completed: 1 };
      const { container, rerender } = render(<TodoCard todo={completedOverdueTodo} {...mockHandlers} isLoading={false} />);
      
      let card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('overdue');
      expect(card).toHaveClass('completed');
      
      // Simulate marking as incomplete
      const incompleteTodo = { ...completedOverdueTodo, completed: 0 };
      rerender(<TodoCard todo={incompleteTodo} {...mockHandlers} isLoading={false} />);
      
      card = container.querySelector('.todo-card');
      expect(card).toHaveClass('overdue');
      expect(card).not.toHaveClass('completed');
    });
  });
});
