// app.js

// Base URL for the API requests
const baseUrl = 'https://todo-backend-epqj.onrender.com/api/todos';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Function to fetch and display all todos
async function fetchTodos() {
  try {
    const response = await fetch(baseUrl);
    const todos = await response.json();
    
    // Clear the current list
    todoList.innerHTML = '';

    // Iterate through todos and create list items
    todos.forEach(todo => {
      const listItem = createTodoItem(todo);
      todoList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

// Function to create a list item for a todo
function createTodoItem(todo) {
  const listItem = document.createElement('li');
  listItem.className = 'todo-item';
  if (todo.completed) {
    listItem.classList.add('completed');
  }

  // Todo title display
  const span = document.createElement('span');
  span.textContent = todo.title;
  listItem.appendChild(span);

  // Checkbox for marking as completed
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.addEventListener('change', () => updateTodoStatus(todo._id, checkbox.checked));
  listItem.appendChild(checkbox);

  // Delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteTodoItem(todo._id));
  listItem.appendChild(deleteButton);

  return listItem;
}

// Function to add a new todo
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTodo = {
    title: todoInput.value,
    completed: false
  };

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodo)
    });

    if (response.ok) {
      todoInput.value = ''; // Clear input field
      fetchTodos(); // Refresh the todo list
    }
  } catch (error) {
    console.error('Error adding new todo:', error);
  }
});

// Function to update the completion status of a todo
async function updateTodoStatus(id, completed) {
  try {
    await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });

    fetchTodos(); // Refresh the todo list
  } catch (error) {
    console.error('Error updating todo status:', error);
  }
}

// Function to delete a todo item
async function deleteTodoItem(id) {
  try {
    await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });

    fetchTodos(); // Refresh the todo list
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

// Fetch and display todos when the page loads
document.addEventListener('DOMContentLoaded', fetchTodos);
