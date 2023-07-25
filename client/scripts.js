// scripts.js
const todoForm = document.getElementById('todo-form');
const todoText = document.getElementById('todo-text');
const todoImg = document.getElementById('todo-img');
const todoList = document.getElementById('todo-list');

const API_URL = 'http://localhost:5000/api/todos';

async function getTodos() {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data, "data comes in fretch")
    return data;
}


async function createTodo(todo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    });
    const data = await response.json();
    return data;
}

async function updateTodo(id, todo) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
    });
    const data = await response.json();
    return data;
}

async function deleteTodo(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

function renderTodo(todo) {
    const li = document.createElement('li');
    li.innerHTML = `
    <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
    <img src=${todo.img} style="height:200px"/>
    <button class="delete-btn" data-id="${todo._id}">Delete</button> 
  `;
    todoList.appendChild(li);
}

const updateTodofn = () => {
    console.log(
        "dslkfndfkgvsdngvkdsngk"
    )
}

async function refreshTodoList() {
    todoList.innerHTML = '';
    const todos = await getTodos();
    console.log(todos)
    todos.forEach(renderTodo);
}

todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const todo = {
        text: todoText.value,
        completed: false,
        img: todoImg.value
    };
    console.log(todo, 'goes to server')
    await createTodo(todo);
    refreshTodoList();
    todoText.value = '';
});

todoList.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('delete-btn')) {
        const id = target.getAttribute('data-id');
        const confirmDelete = confirm('Are you sure you want to delete this todo?');
        if (confirmDelete) {
            await deleteTodo(id);
            refreshTodoList();
        }
    } else {
        const li = target.closest('li');
        const id = li.querySelector('.delete-btn').getAttribute('data-id');
        const todo = {
            completed: !li.classList.contains('completed'),
        };
        await updateTodo(id, todo);
        refreshTodoList();
    }
});

refreshTodoList();
