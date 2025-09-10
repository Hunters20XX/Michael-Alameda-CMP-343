 // script.js
 // Section 1: TODOs
 // TODO: Register submissions from the user on the form.
 // TODO: Determine the value of the data submitted and add it to a JavaScript array calle
 // TODO: Call the render function to update the table with the new tasks.

 // script.js
 // Section 2: App State Variables
 let tasks = []

 const taskForm = document.getElementById("taskForm")
 const taskTable = document.getElementById("taskTable")

 // Function to mark a task as complete
 function markTaskComplete(button) {
    const row = button.closest('tr');
    row.style.textDecoration = 'line-through'; // Example of marking as complete
 }
 
 // Function to remove a task
 function removeTask(button) {
    const row = button.closest('tr');
    row.remove(); // Remove the row from the DOM
 }

 // Section 4: Functions and Event Listeners
 // Function to handle form submissions
 function handleSubmission(event) {
    event.preventDefault();
    // TODO: Get form input values
    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDeadline = document.getElementById('taskDeadline').value;
    // TODO: Validate input fields
    if (!taskName|| !taskDeadline) {
           alert('Task name and deadline are required!');
           return;
       }
       // TODO: Update the tasks array
    tasks.push({ name: taskName, description: taskDescription, deadline: taskDeadline });
       // TODO: Call the render function
       render();
    }
    // Function to render tasks in the table
    function render() {
       // TODO: Use array methods to create a new table row of data for each item in the arr
       taskTable.innerHTML = tasks.map(task => `
           <tr>
               <td>${task.name}</td>
               <td>${task.description}</td>
               <td>${task.deadline}</td>
               <td><button onclick="markTaskComplete(this)">Complete</button></td>
               <td><button onclick="removeTask(this)">Remove</button></td>
           </tr>
       `).join('');
    }
    // Function to initialize the table
    function init() {
       taskTable.innerHTML = ''; // Clear the table
       tasks = []; // Reset the tasks array
       render(); // Call the render function
    }
    // Event listener for form submission
    taskForm.addEventListener('submit', handleSubmission);
    // Call the init function to set up the initial state of the app
    init();