// alert("hii");

let todos = JSON.parse(localStorage.getItem("myTodos")) || [];
let editId = null;
let filter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("todoList");

function display() {
    localStorage.setItem("myTodos", JSON.stringify(todos));
    list.innerHTML = "";

    let tasks = todos.filter(todo =>
        (filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed)) &&
        todo.text.toLowerCase().includes(
            document.getElementById("searchInput").value.toLowerCase()
        )
    );

    tasks.forEach(todo => {
        let li = document.createElement("li");
        li.className = "todo-item";

        let check = document.createElement("input");
        check.type = "checkbox";
        check.checked = todo.completed;

        let text = document.createElement("span");
        text.className = "todo-text";
        text.textContent = todo.text;

        let edit = document.createElement("button");
        edit.textContent = "✎";

        let del = document.createElement("button");
        del.textContent = "✕";

        check.onchange = () => {
            todo.completed = check.checked;
            display();
        };

        edit.onclick = () => {
            input.value = todo.text;
            editId = todo.id;
        };

        del.onclick = () => {
            todos = todos.filter(t => t.id !== todo.id);
            display();
        };

        li.append(check, text, edit, del);
        list.appendChild(li);
    });

    document.getElementById("emptyState").style.display =
        tasks.length ? "none" : "block";

    document.getElementById("totalCount").textContent = todos.length;
    document.getElementById("activeCount").textContent =
        todos.filter(t => !t.completed).length;
    document.getElementById("completedCount").textContent =
        todos.filter(t => t.completed).length;
}

document.getElementById("todoForm").onsubmit = function(e) {
    e.preventDefault();

    let value = input.value.trim();
    if (!value) return;

    if (editId !== null) {
        todos.find(t => t.id === editId).text = value;
        editId = null;
    } else {
        todos.push({
            id: Date.now(),
            text: value,
            completed: false
        });
    }

    input.value = "";
    display();
};

document.getElementById("searchInput").oninput = display;
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = () => {
        filter = btn.dataset.filter;

        document.querySelectorAll(".filter-btn").forEach(b =>
            b.classList.remove("active")
        );

        btn.classList.add("active");
        display();
    };
});

document.getElementById("clearCompletedBtn").onclick = () => {
    todos = todos.filter(t => !t.completed);
    display();
};

document.getElementById("todayDate").textContent =
    new Date().toDateString();

display();