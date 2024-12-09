let theName;

document.getElementById("enter-button").onclick = () => {
  theName = document.querySelector("#name").value;

  if (!theName) {
    let error = document.getElementById("error");
    error.textContent = "Please enter your name";
    error.style.display = "flex";
    error.style.color = "red";
  } else {
    let error = document.getElementById("error");
    error.style.display = "none";
    document.getElementById("name-entry").style.display = "none";
    document.getElementById("app").style.display = "none";
    displayTasks()
    document.getElementById("nav-content").style.display = "flex";
    document.getElementById("username").textContent = theName;

    //

    const viewTask = document.createElement("button");
    viewTask.textContent = "View Tasks";
    viewTask.classList.add("viewTask");
    viewTask.onclick = () => displayTasks();
    viewTask.style.display = "none"; 
    document.body.appendChild(viewTask);

    const addTask = document.createElement("button");
    addTask.textContent = "Add Task";
    addTask.classList.add("addTask");
    addTask.onclick = () => showTaskInput();
    addTask.style.display = "flex"; // Initially hidden
    document.body.appendChild(addTask);

    // Initialize local storage for the user if it doesn't exist
    if (!localStorage.getItem(theName)) {
      localStorage.setItem(theName, JSON.stringify([]));
    }
  }
};

// Logout Function
const logoutButtons = document.getElementsByClassName("logout-button");

for (let button of logoutButtons) {
  button.onclick = () => {
    window.location.reload();
  };
}

// Task Input Function
document.getElementById("add-task").onclick = () => {
  const taskTitle = document.getElementById("task-title").value;
  const taskDetails = document.getElementById("task-details").value;
  const taskTitleError = document.getElementById("taskTerror");
  const taskDetailsError = document.getElementById("taskDerror");

  if (!taskTitle) {
    taskTitleError.textContent = "Please enter a task title";
    taskTitleError.style.display = "flex";
    taskTitleError.style.color = "red";
    taskTitleError.style.marginTop = "-20px";
    return;
  } else {
    taskTitleError.style.display = "none";
  }

  if (!taskDetails) {
    taskDetailsError.textContent = "Please enter task details";
    taskDetailsError.style.display = "flex";
    taskDetailsError.style.color = "red";
    taskDetailsError.style.marginTop = "-20px";
    return;
  } else {
    taskDetailsError.style.display = "none";
  }

  const task = {
    title: taskTitle,
    details: taskDetails,
  };

  const message = "Task Added!";

  let tasks = JSON.parse(localStorage.getItem(theName)) || [];
  tasks.push(task);
  localStorage.setItem(theName, JSON.stringify(tasks));

  document.getElementById("task-title").value = "";
  document.getElementById("task-details").value = "";

  showNotification(task, message, true);
};

// Notification handler Function
const showNotification = (task, message, showDetailsButton = false) => {
  const notification = document.createElement("div");
  notification.classList.add("notification");

  const notificationHeader = document.createElement("h5");
  notificationHeader.textContent = message;
  notificationHeader.classList.add("notifHeader");

  const notificationText = document.createElement("p");
  notificationText.textContent = `${task.title}`;
  notificationText.classList.add("notifText");

  notification.appendChild(notificationHeader);
  notification.appendChild(notificationText);

  if (showDetailsButton) {
    const viewButton = document.createElement("button");
    viewButton.textContent = "View Details";
    viewButton.classList.add("viewButton");
    viewButton.onclick = () => displayTasks();
    notification.appendChild(viewButton); // Append here inside the if block
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// Function to display taska
const displayTasks = () => {
  const viewTaskButton = document.querySelector(".viewTask");
  const addTaskButton = document.querySelector(".addTask");

  if (viewTaskButton) viewTaskButton.style.display = "none";
  if (addTaskButton) addTaskButton.style.display = "flex";

  document.getElementById("app").style.display = "none";
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";
  document.getElementById("task-list").parentNode.style.display = "flex";

  const tasks = JSON.parse(localStorage.getItem(theName)) || [];

  if (tasks.length === 0) {
    taskList.innerHTML = `<div class="nolistdiv">
      <h3 class="nolist">No tasks found for You! </br> Click On "Add Task" to add your Task</h3>
    </div>`;
  } else {
    tasks.forEach((task, index) => {
      const listItem = document.createElement("div");
      listItem.className = "task-item";
      listItem.draggable = true; // Enable dragging
      listItem.setAttribute("data-index", index);

      listItem.style.textDecoration = task.completed ? "line-through" : "none";
      listItem.style.opacity = task.completed ? "0.6" : "1";

      // Task content
      const completeIcon = task.completed
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.5 13.833L6 17.5l1.024-1.073M16.5 6.5l-6.063 6.352m-2.937.981L11 17.5l10.5-11" color="currentColor"/></svg>` // Double green tick
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`; // Single tick icon

      listItem.innerHTML = `
      <div class="task-container">
          <div class="task-text">
            <h3>${task.title}</h3>
            <p>${task.details}</p>
          </div>
       <div class="task-icons">
          <button class="complete-btn" onclick="toggleTaskCompletion(${index})">
            ${completeIcon}
          </button>
          <button class="edit-btn" onclick="editTask(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m14.06 9.02l.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"/></svg>
          </button>
          <button class="delete-btn" onclick="deleteTask(${index})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
          </button>
       </div>
      </div>
      `;
      taskList.appendChild(listItem);

      // Drag and Drop Event Handlers
      listItem.addEventListener("dragstart", handleDragStart);
      listItem.addEventListener("dragover", handleDragOver);
      listItem.addEventListener("drop", handleDrop);
      listItem.addEventListener("dragend", handleDragEnd);
    });
  }
};

// Drag and Drop Handlers
let draggedIndex;
const handleDragStart = (e) => {
  draggedIndex = +e.target.getAttribute("data-index");
  e.target.style.opacity = "0.5";
};

const handleDragOver = (e) => {
  e.preventDefault(); // Necessary to allow dropping
  e.dataTransfer.dropEffect = "move";
};

const handleDrop = (e) => {
  e.preventDefault();
  const targetIndex = +e.target
    .closest(".task-item")
    .getAttribute("data-index");

  if (draggedIndex !== undefined && targetIndex !== undefined) {
    let tasks = JSON.parse(localStorage.getItem(theName)) || [];
    const [draggedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, draggedTask);

    // Update local storage with the new task order
    localStorage.setItem(theName, JSON.stringify(tasks));

    // Refresh the task display
    displayTasks();
  }
};

const handleDragEnd = (e) => {
  e.target.style.opacity = "1";
};


// Toggle Task Completion
const toggleTaskCompletion = (index) => {
  let tasks = JSON.parse(localStorage.getItem(theName)) || [];

  // Toggle the completed status
  tasks[index].completed = !tasks[index].completed;

  // Save updated tasks to local storage
  localStorage.setItem(theName, JSON.stringify(tasks));

  // Refresh the task display
  displayTasks();

  // Show notification
  const message = tasks[index].completed ? "Task Completed!" : "Task Unmarked";
  showNotification(tasks[index], message, false);
};

// Function to Show Add Task Button
const showTaskInput = () => {
  const viewTaskButton = document.querySelector(".viewTask");
  const addTaskButton = document.querySelector(".addTask");

  if (viewTaskButton) viewTaskButton.style.display = "flex";
  if (addTaskButton) addTaskButton.style.display = "none";

  document.getElementById("app").style.display = "flex";
  document.getElementById("task-list").parentNode.style.display = "none";
};

// Edit Task Function
const editTask = (index) => {
  // Get the task from local storage
  let tasks = JSON.parse(localStorage.getItem(theName)) || [];
  const taskToEdit = tasks[index];

  // Pre-fill the form with existing data
  document.getElementById("task-title").value = taskToEdit.title;
  document.getElementById("task-details").value = taskToEdit.details;

  // Show the Task-edit form
  const viewTaskButton = document.querySelector(".viewTask");
  const addTaskButton = document.querySelector(".addTask");

  if (viewTaskButton) viewTaskButton.style.display = "none";
  if (addTaskButton) addTaskButton.style.display = "none";
  document.getElementById("app").style.display = "flex";
  document.getElementById("add-task").style.display = "none";
  document.getElementById("task-list").parentNode.style.display = "none";

  //create a new button in the task edit form
  const saveButton = document.createElement("button");
  saveButton.textContent = "Update Task";
  saveButton.className = "updateTask";

  //Add the update button to the task edit form
  document.getElementById("app").appendChild(saveButton);

  // Save the updated task
  saveButton.onclick = () => {
    const updatedTitle = document.getElementById("task-title").value;
    const updatedDetails = document.getElementById("task-details").value;
    const taskTitleError = document.getElementById("taskTerror");
    const taskDetailsError = document.getElementById("taskDerror");

    if (!updatedTitle) {
      taskTitleError.textContent = "Please enter task title";
      taskTitleError.style.display = "flex";
      taskTitleError.style.color = "red";
      taskTitleError.style.marginTop = "-20px";
      return;
    } else {
      taskTitleError.style.display = "none";
    }

    if (!updatedDetails) {
      taskDetailsError.textContent = "Please enter task details";
      taskDetailsError.style.display = "flex";
      taskDetailsError.style.color = "red";
      taskDetailsError.style.marginTop = "-20px";
      return;
    } else {
      taskDetailsError.style.display = "none";
    }

    // Update the task in the tasks array
    tasks[index] = {
      title: updatedTitle,
      details: updatedDetails,
    };

    // Save the updated tasks array back to local sto
    localStorage.setItem(theName, JSON.stringify(tasks));

    // clear form fields
    document.getElementById("task-title").value = "";
    document.getElementById("task-details").value = "";

    // Display the tasks
    displayTasks();

    // Remove the Update button
    saveButton.remove();

    const message = "Task Updated!";

    showNotification(tasks[index], message, false);
  };
};

// Delete Task Function
const deleteTask = (index) => {
  // Question Pop up function
  const question = document.createElement("div");
  question.className = "question";
  question.innerHTML = `
        <p>Are you sure you want to delete this Task?</p>

        <div class="question-btn">
        <button id="yesButton">Yes</button>
        <button id="noButton">No</button>      
        </div>

    `;

  document.body.appendChild(question);

  // Yes Button Event Listener
 document.getElementById("yesButton").onclick = () => {
   // Get the tasks from local storage
   let tasks = JSON.parse(localStorage.getItem(theName)) || [];

   // Store the task to be deleted
   const taskToDelete = tasks[index];

   // Remove the task from the tasks array
   tasks.splice(index, 1);

   // Save the updated tasks array back to local storage
   localStorage.setItem(theName, JSON.stringify(tasks));

   // Display Notification
   const message = "Task Deleted!";
   showNotification(taskToDelete, message, false);

   // Display the tasks
   displayTasks();

   // Remove the question pop-up
   document.body.removeChild(question);
 };


  // No Button Event Listener
  document.getElementById("noButton").onclick = () => {
    // Remove the question pop up
    document.body.removeChild(question);
  };
};


