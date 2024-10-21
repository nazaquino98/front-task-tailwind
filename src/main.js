import "./style.css";
const $app = document.getElementById("app");
const $createTaskForm = document.getElementById("create-task");
const $tasksList = document.getElementById("tasksList");

const renderTasks = (tasks) => {
  const $container = document.createElement("div");
  // Clases de Tailwind para el contenedor de cada tarea
  $container.classList.add(
    "p-4",
    "mb-4",
    "bg-gray-800",
    "rounded-lg",
    "shadow"
  );

  const $info = document.createElement("div");
  // Clases para el contenedor de la información de la tarea
  $info.classList.add("flex", "flex-col", "space-y-2");

  const $title = document.createElement("span");
  // Estilos para el título
  $title.classList.add("text-lg", "font-semibold", "text-white");
  $title.innerText = tasks.title;

  const $description = document.createElement("span");
  // Estilos para la descripción
  $description.classList.add("text-sm", "text-gray-300");
  $description.innerText = tasks.description;

  const $status = document.createElement("span");
  // Estilos para el estado de la tarea (completado o pendiente)
  const statusClass = tasks.isComplete ? "text-green-500" : "text-yellow-500";
  $status.classList.add("text-sm", "font-medium", statusClass);
  $status.textContent = tasks.isComplete ? "Completado" : "Pendiente";

  // boton de eliminar
  const $deleteButton = document.createElement("div");
  $deleteButton.classList.add("deleteButton");
  $deleteButton.innerHTML = '<i class="fi fi-rs-trash"></i>';

  // Añadir los elementos al contenedor
  $container.appendChild($info);
  $info.appendChild($title);
  $info.appendChild($description);
  $info.appendChild($status);
  $info.appendChild($deleteButton);

  $deleteButton.addEventListener("click", async () => {
    await fetch(`http://localhost:4000/tasks/${tasks.id}`, {
      // Añadir barra antes del id
      method: "DELETE",
    })
      .then(async (res) => {
        console.log(res);
        if (res.status === 200) {
          alert("Tarea eliminada con éxito"); 
          $container.remove(); // Remover el contenedor de la tarea
        } else {
          alert("Error al eliminar la tarea");
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud:", err);
        alert("Error en la solicitud");
      });
  });

  return $container;
};

document.addEventListener("DOMContentLoaded", async () => {
  const renderAllTask = async () => {
    $tasksList.innerHTML = "";

    return fetch("http://localhost:4000/tasks")
      .then((e) => e.json())
      .then((listTasks) => {
        listTasks.forEach((task) => {
          const statusTasks = task.isComplete ? "Completado" : "Pendiente";
          $tasksList.appendChild(renderTasks(task));
        });
      });
  };

  $createTaskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const isComplete = document.getElementById("isComplete").checked;
    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        isComplete,
      }),
    }).then(async (res) => {
      console.log(res);

      if (res.status == 201) {
        alert("Tarea creada con exito");
        await renderAllTask();
      } else {
        alert("error al crear la tarea");
      }
    });

    e.target.reset();
  });

  await renderAllTask();
});