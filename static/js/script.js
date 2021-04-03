/**
 * MIT License
 *
 * UI interactions and calls to API
 * are handled through this file.
 *
 * @summary short description for the file
 * @author Samuel Guebo <@samuelguebo>
 *
 */

/**
 * Global variables
 */
let tasks = {};

/**
 * Collect list of tasks from
 * the Asana endpoint
 * 
 * @param {String} url
 */
const getTaskFromApi = url => {

    return fetch(url)
    .then((response) => response.json())
    .then((data) => {
        for(task of data) {
           
            // Pick Phab ID, otherwise generate one from the title
            task.is_completed = (task.is_completed == false) ? "Open" : "Closed" 
            
            // Discard 'Closed' tasks. Can be disabled if needed
            if(task.is_completed !== 'Closed'){
                updateUI(task)
            }
        }
    })
}

/**
 * Update the user interface by adding new tasks
 * to the table with their relevant details
 *
 * @param {Object} task
 */
const updateUI = task => {
    // Display loading animation
    document.querySelector("#preloader").style.display = "block";
    
    if (typeof task !== "undefined" && typeof task.id !== false) {

        if(!tasks.hasOwnProperty(task.id)){
            // Display data in table as a row
            addRowToTable(task);
            tasks[task.id] = task
        }
    }
    // Hide loading animation
    document.querySelector("#preloader").style.display = "none";
};
  
/**
 * Append row to the table
 *
 * @param {Object} item
 */
const addRowToTable = item => {
    // build HTML rows
    let table = document.getElementById("data").querySelector("tbody");
    let row = document.createElement("tr");
    
    row.id = item.html_id
    let rowHTML = "";
    // let count = table.childNodes.length + 1;
    // rowHTML += "<td><b>" + (count++) + "</b></td>"
    rowHTML += "<td>" + (item.id !== false ? item.id : "") + "</td>";
    rowHTML += "<td class = 'title'>" + item.title + "</td>";
    rowHTML += "<td class = 'project'>" + item.project.title + "</td>";
    rowHTML += "<td class = 'date'>" + item.created_at + "</td>";
    rowHTML += "<td class = 'severity'>" + item.priority + "</td>";

    
    row.innerHTML = rowHTML;
    table.append(row);

};

/**
 * Convert regular text into a dash-separated
 * series of non-special characters
 * @param {*} str 
 */
const slugify = str =>
  str
  .trim()                      // remove whitespaces at the start and end of string
  .toLowerCase()              
  .replace(/^-+/g, "")         // remove one or more dash at the start of the string
  .replace(/[^\w-]+/g, "-")    // convert any on-alphanumeric character to a dash
  .replace(/-+/g, "-")         // convert consecutive dashes to singuar one
  .replace(/-+$/g, "");

 /**
 * Entry point of the UI interactions
 */
const init = () => {
    // Display loading animation
    window.addEventListener("load", (e) => {
        document.querySelector("#preloader").style.display = "block";
    });
    
    // Make API calls
    getTaskFromApi('/api/tasks/phabricator');
}

// Run the show
init();