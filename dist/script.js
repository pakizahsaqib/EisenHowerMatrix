const input = document.getElementById("taskInput");
const addbtn = document.getElementById("add");
const prioritySelector = document.getElementById("prioritySelector");
const all = document.getElementById("all");
const urgent = document.getElementById("do");
const schedule = document.getElementById("schedule");
const delegate = document.getElementById("delegate");
const remove = document.getElementById("delete");
const completed = document.getElementById("completed");
const tasks = JSON.parse(localStorage.getItem("notes")) || [];
let editingIndex = -1; // Track the index of the task being edited
// Get the list items and target boxes
const lists = document.querySelectorAll(".list");
const quad1Box = document.getElementById("quad1");
const quad2Box = document.getElementById("quad2");
const quad3Box = document.getElementById("quad3");
const quad4Box = document.getElementById("quad4");
const quad5Box = document.getElementById("quad5");
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const b5 = document.getElementById("b5");

document.addEventListener("DOMContentLoaded", () => {
  renderNotes(); // Call renderNotes to load saved tasks on page load
});
const createNotes = (task, index) => {
  const note = document.createElement("div");
  note.classList.add(
    "drag",
    "w-full",
    "cursor-grab",
    "p-4",
    "relative",
    "mb-4",
    "flex",
    "justify-between",
    "items-center",
    "text-sm",
    "md:text-md",
    "lg:text-lg",
    "shadow-3xl",
    "bg-white"
  );
  note.draggable = true;
  const noteContent = document.createElement("p");
  noteContent.classList.add("p-2");
  noteContent.textContent = task.text;
  note.appendChild(noteContent);

  // Create controls div
  const controls = document.createElement("div");
  controls.classList.add("controls", "flex", "gap-1", "md:gap-2");

  // Create icons and append to controls
  const trashIcon = document.createElement("i");
  trashIcon.className =
    "fa-solid fa-trash cursor-pointer text-sm md:text-md lg:text-lg hover:text-blue-400";
  trashIcon.addEventListener("click", () => deleteNote(index)); // Add delete functionality
  controls.appendChild(trashIcon);

  const editIcon = document.createElement("i");
  editIcon.className =
    "fa-solid fa-pen-to-square cursor-pointer text-sm md:text-md lg:text-lg hover:text-blue-400";
  editIcon.addEventListener("click", () => editNote(index)); // Add edit functionality
  addbtn.innerText = "Add Task";
  controls.appendChild(editIcon);

  // Circle icon to mark task as completed or pending
  const circleIcon = document.createElement("i");
  circleIcon.className = `fa-circle text-sm md:text-md lg:text-lg hover:text-blue-400 cursor-pointer ${
    task.status === "pending" ? "fa-regular" : "fa-solid"
  }`;
  circleIcon.addEventListener("click", () => {
    // Toggle task status
    task.status = task.status === "pending" ? "completed" : "pending";
    // Toggle circle icon class
    circleIcon.classList.toggle("fa-regular");
    circleIcon.classList.toggle("fa-solid");
    renderNotes();
  });
  controls.appendChild(circleIcon);
  note.appendChild(controls);
  if (task.status === "pending") {
    if (task.priority === "do") {
      quad1Box.appendChild(note);
    } else if (task.priority === "schedule") {
      quad2Box.appendChild(note);
    } else if (task.priority === "delegate") {
      quad3Box.appendChild(note);
    } else {
      quad4Box.appendChild(note);
    }
  } else {
    quad5Box.appendChild(note);
  }

  note.addEventListener("dragstart", function (e) {
    selected = note; // Store the dragged item in the 'selected' variable
    console.log(selected);
  });
};
const clearNoteBody = () => {
  quad1Box.innerHTML = "";
  quad2Box.innerHTML = "";
  quad3Box.innerHTML = "";
  quad4Box.innerHTML = "";
  quad5Box.innerHTML = "";
};
function highlightButton(button) {
  [all, urgent, schedule, delegate, remove, completed].forEach((btn) => {
    btn.classList.add("shadow-md");
    btn.classList.remove("translate-y-[4px]");
  });
  button.classList.add("translate-y-[4px]");
  button.classList.add("shadow-sm");
}

all.addEventListener("click", () => {
  highlightButton(all);
  renderNotes();
  console.log("All Clicked");
  b1.classList.add("block");
  b2.classList.add("block");
  b3.classList.add("block");
  b4.classList.add("block");
  b5.classList.add("hidden");
  b1.classList.remove("hidden", "col-span-2");
  b2.classList.remove("hidden", "col-span-2");
  b3.classList.remove("hidden", "col-span-2");
  b4.classList.remove("hidden", "col-span-2");
  b5.classList.remove("block");
});
urgent.addEventListener("click", () => {
  highlightButton(urgent);
  urgentNotes();

  b1.classList.remove("hidden");
  b1.classList.add("block", "col-span-2");
  b2.classList.add("hidden");
  b3.classList.add("hidden");
  b4.classList.add("hidden");
  b5.classList.add("hidden");
});
schedule.addEventListener("click", () => {
  highlightButton(schedule);
  clearNoteBody();
  scheduleNotes();

  b2.classList.add("block", "col-span-2");
  b2.classList.remove("hidden");
  b1.classList.add("hidden");
  b3.classList.add("hidden");
  b4.classList.add("hidden");
  b5.classList.add("hidden");
});
delegate.addEventListener("click", () => {
  highlightButton(delegate);
  clearNoteBody();
  delegateNotes();
  b3.classList.add("block", "col-span-2");
  b3.classList.remove("hidden");
  b1.classList.add("hidden");
  b2.classList.add("hidden");
  b4.classList.add("hidden");
  b5.classList.add("hidden");
});
remove.addEventListener("click", () => {
  b4.classList.remove("hidden");
  b4.classList.add("block", "col-span-2");
  b1.classList.add("hidden");
  b2.classList.add("hidden");
  b3.classList.add("hidden");
  b5.classList.add("hidden");
  highlightButton(remove);
  clearNoteBody();
  ordinaryNotes();
});
completed.addEventListener("click", () => {
  b5.classList.remove("hidden");
  b5.classList.add("block");
  b1.classList.add("hidden");
  b2.classList.add("hidden");
  b3.classList.add("hidden");
  b4.classList.add("hidden");
  highlightButton(completed);
  clearNoteBody();
  completedNotes();
});

addbtn.addEventListener("click", () => {
  const taskValue = input.value.trim(); // Get input value and trim spaces
  if (taskValue !== "") {
    if (editingIndex === -1) {
      // If not editing, add new task
      const task = {
        text: taskValue,
        priority: prioritySelector.value, // Get the selected priority
        status: "pending",
      };
      tasks.push(task);
    } else {
      // If editing, update existing task
      tasks[editingIndex].text = taskValue; // Update task text
      (tasks[editingIndex].priority = prioritySelector.value),
        console.log(`Task updated: ${tasks[editingIndex].text}`);
      editingIndex = -1; // Reset editing index after saving
    }
    input.value = ""; // Clear input field
    renderNotes(); // Re-render notes
  }
  console.log("Button Pressed, new task added/updated:", tasks);
});

const urgentNotes = () => {
  clearNoteBody();
  tasks.forEach((task, index) => {
    if (task.priority === "do" && task.status === "pending") {
      createNotes(task, index);
    }
  });
};

const scheduleNotes = () => {
  clearNoteBody();
  tasks.forEach((task, index) => {
    if (task.priority === "schedule" && task.status === "pending") {
      createNotes(task, index);
    }
  });
};
const delegateNotes = () => {
  clearNoteBody();
  tasks.forEach((task, index) => {
    if (task.priority === "delegate" && task.status === "pending") {
      createNotes(task, index);
    }
  });
};
const ordinaryNotes = () => {
  // least important Notes that can be deleted
  clearNoteBody();
  tasks.forEach((task, index) => {
    if (task.priority === "delete" && task.status === "pending") {
      createNotes(task, index);
    }
  });
};
const completedNotes = () => {
  clearNoteBody();
  tasks.forEach((task, index) => {
    if (task.status === "completed") {
      createNotes(task, index);
    }
  });
};

// Function to delete a note
const deleteNote = (index) => {
  tasks.splice(index, 1); // Remove the task from the tasks array
  renderNotes(); // Re-render the notes to reflect changes
};

const editNote = (index) => {
  input.value = tasks[index].text; // Set the input field value to the task's text
  addbtn.innerText = "Update Task";
  editingIndex = index; // Set the editing index to the task being edited
};

function handleDragOver(e) {
  e.preventDefault(); // Allow drop by preventing default behavior
}

// Function to handle drop events for all boxes
function handleDrop(e) {
  e.preventDefault();
  const target = e.target.closest("#quad1, #quad2, #quad3, #quad4"); // Ensure the drop target is a valid box
  if (selected && target) {
    const taskIndex = tasks.findIndex(
      (task) => task.text === selected.textContent.trim()
    );

    if (taskIndex > -1) {
      if (target === quad1Box) {
        tasks[taskIndex].priority = "do";
      } else if (target === quad2Box) {
        tasks[taskIndex].priority = "schedule";
      } else if (target === quad3Box) {
        tasks[taskIndex].priority = "delegate";
      } else {
        tasks[taskIndex].priority = "delete";
      }
    }

    target.appendChild(selected); // Append the dragged item to the valid box
    selected = null; // Clear the selected item after drop
    renderNotes(); // Re-render notes to reflect changes
  }
}

// Attach dragover and drop event listeners to each box
[quad1Box, quad2Box, quad3Box, quad4Box].forEach((box) => {
  box.addEventListener("dragover", handleDragOver);
  box.addEventListener("drop", handleDrop);
});
const saveNotes = () => {
  localStorage.setItem("notes", JSON.stringify(tasks));
};
const renderNotes = () => {
  // Clear the previous notes to avoid duplication
  clearNoteBody();
  tasks.forEach((task, index) => {
    createNotes(task, index);
  });
  saveNotes();
};
