// base url m4 byt8yr
var BASE_URL = "https://todos.routemisr.com";
var form = document.getElementById('form');
var todoInput = document.getElementById('todo');
var apiKey = null;
var envoke = document.getElementById("envoke");
// h7t eltodos fi array fadi
var todos = [];
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = todoInput.value;

    // Ensure apiKey is defined before adding todos
    if (apiKey) {
        addToDos(title);
    } else {
        console.error('API key is not available.');
        // Handle the situation where apiKey is not available
    }
});


if (localStorage.getItem("apiKey")) {
    apiKey = JSON.parse(localStorage.getItem("apiKey"));
    // lw hwa zbon adem ha5d mno elapiKey 34an arg3 el todos
    getToDos(apiKey);

} else {
    getApiKey();
}
// get api key lw awl mra
async function getApiKey() {
    try {
        var res = await fetch(`${BASE_URL}/api/v1/getApiKey`);//object
        // 3mlt if condition 34an lw el network m4 ahsan haga w rg3li error
        if (!res.ok) {
            throw new Error("Failed to get apikey" + res.status);
        }
        var data = await res.json(); //34an ast2bl eldata w di data ha2e2ya
        // lw el apikey m4 s7 !==success
        if (data.message == 'success') {
            localStorage.setItem("apiKey", JSON.stringify(data.apiKey));
        } else {
            throw new Error(JSON.stringify(data));
        }
    } catch (err) {
        console.log(err);
    }


}
// function to get todos list
async function getToDos(key) {
    try {
        var res = await fetch(`${BASE_URL}/api/v1/todos/${key}`);
        var data = await res.json();
        todos = data.todos;
        displayToDos(todos);
       
    }
    catch (error) {
        console.log(error);
    }
}
// function to add todos
async function addToDos(title) {
    try {
        var res = await fetch(`${BASE_URL}/api/v1/todos`, { method: 'post',body: JSON.stringify({ "title": title, "apiKey": apiKey  }) ,headers: {'Content-Type': 'application/json' } });
        var data = await res.json(); //34an ast2bl eldata w di data ha2e2ya
            getToDos(apiKey);
            localStorage.setItem("todos",todos);

    } catch (err) {
        console.log(err);
    }
}
// Array of object(todos)
function displayToDos(data) {
    var string = '';
    for (var i = 0; i < data.length; i++) {
        string += `
                <tr data-id=${data[i]._id}>
                    <td>${data[i].title}</td>
                    <td><input ${data[i].completed && 'checked disabled'} type="checkbox" name="${'todo-' + i}" id="${'todo-' + i}"></td>
                    <td onclick="deleteToDos('${data[i]._id}')"><i id="envoke" class="fas fa-trash text-danger pointer"></i> </td>
                </tr>
        `
    }
    document.getElementById('data').innerHTML = string;
    localStorage.setItem("todos",todos);
}

async function deleteToDos(i) {
    try {
        var res = await fetch(`${BASE_URL}/api/v1/todos`, { method: 'DELETE',body: JSON.stringify({"todoId": i}), headers: { 'Content-Type': 'application/json' } })
        var data = await res.json();
        if (data.message === "success") {
            todos.splice(i, 1);;
            displayToDos(todos);
            localStorage.setItem("todos",todos);
        }
    }
    catch (error) {
        console.log(error);
    }
    };
