const color = {
    "Todo": "bg-slate-600 rounded-md px-3 py-1 text-xs text-white bg-slate-600",
    "In Progress": "bg-slate-600 rounded-md px-3 py-1 text-xs text-white bg-sky-500",
    "Done": "bg-slate-600 rounded-md px-3 py-1 text-xs text-white bg-emerald-600",
    "Expired": "bg-slate-600 rounded-md px-3 py-1 text-xs text-white bg-rose-500",
}

const addTaskTodo = document.getElementById("add-task-todo")
const todoTask = document.getElementById("todo-task")


addTaskTodo.addEventListener("click", (e) => {
    addTaskTodo.classList.add("hidden")
    todoTask.classList.remove("hidden")
    todoTask.focus()
})

todoTask.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
        addTaskTodo.classList.remove("hidden")
        todoTask.classList.add("hidden")
    }

    if (e.code === "Enter") {
        addTodo(e.target.value, "Todo")
        e.target.value = ""
        addTaskTodo.classList.remove("hidden")
        todoTask.classList.add("hidden")
    }
})


function allowDrop(e) {
    e.preventDefault();
}

function drag(e, data) {
    localStorage.setItem("text", e.target.id)
    localStorage.setItem("todo", data.id)
}

function drop(e, status) {
    e.preventDefault();
    const data = localStorage.getItem("text");
    const todo = localStorage.getItem("todo");
    e.target.appendChild(document.getElementById(data));
    const todoStatus = document.getElementById(data).children[1]
    updateTodo(todo, status, todoStatus)
}

function updateTodo(todo, status, todoStatus) {
    axios.put(`/edit/${todo}`, {
        status
    })
        .then((res) => {
            const data = res.data.todo
            todoStatus.innerText = data.status
            todoStatus.classList = color[data.status.trim()]
            localStorage.clear()
        })
}

function addTodo(value, status) {
    const payload = {
        "task": value,
        "status": status
    }
    const todoWrapper = document.getElementById("todo-wrapper")
    axios.post('/add', payload)
        .then((res) => {
            const randomNum = "draggable-" + Math.ceil(Math.random() * 10000)
            event.target.id = randomNum
            const element = `
                <div class="bg-white rounded-md p-5 m-3 mb-5 cursor-pointer" id=${randomNum} draggable="true">
                    <p class="mb-3">${res.data.todo.task}</p>
                    <span class="bg-slate-600 rounded-md px-3 py-1 text-xs text-white" id="todo-status">
                        ${res.data.todo.status}
                    </span>
                </div>
            `
            todoWrapper.insertAdjacentHTML('beforeend', element)
            const getElement = document.getElementById(randomNum)
            getElement.addEventListener("dragstart", (e) => {
                drag(e, res.data.todo)
            })
        })
}