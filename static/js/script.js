/**
 * MIT License
 *
 * UI interactions and calls to API
 * are handled through this file.
 *
 * @author Samuel Guebo <@samuelguebo>
 *
 */

 /**
  * Global variables
  * and settings
  */
let self = window
self.preloader = document.getElementById("preloader")
self.table = document.getElementById("data").querySelector("tbody")
self.filterContainer = document.getElementById("data-filter")
self.tasks = {}
self.filters = {
    priority: {
        title: "Severity",
        type: "numeric",
        key: "priority"
    }, 
    created_at: {
        title: "Year",
        type: "date",
        key: "created_at"
    },
    project_title: {
        title: "Project",
        type: "text",
        key: "project_title"
    },
}

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
        for(item of data) {
           
            // Pick Phab ID, otherwise generate one from the title
            item.is_completed = (item.is_completed == false) ? "Open" : "Closed" 
            
            // Discard 'Closed' tasks. Can be disabled if needed
            if(item.is_completed !== 'Closed'){
                updateUI(item)
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
    self.preloader.style.display = "block"
    
    if (typeof task !== "undefined" && typeof task.id !== false) {

        if(!self.data.hasOwnProperty(task.id)){
            // Display data in table as a row
            addRowToTable(task)
            self.data[task.id] = task
        } 
    }
    // Hide loading animation
    self.preloader.style.display = "none"
}
  
/**
 * Append row to the table
 * @param {Object} item
 */
const addRowToTable = item => {
    // build HTML rows
    let row = document.createElement("tr")
    
    row.id = item.id
    let rowHTML = ""
    rowHTML += `<td>${(item.id !== false ? item.id : "")}</td>`
    rowHTML += `<td>${item.title}</td>`
    rowHTML += `<td data_project_title="${item.project_title}">${item.project_title}</td>`
    rowHTML += `<td data_created_at="${new Date(item.created_at).getFullYear()}">${new Date(item.created_at).getFullYear()}</td>`
    rowHTML += `<td data_priority="${item.priority}">${item.priority}</td>`
    
    row.innerHTML = rowHTML
    self.table.append(row)

}

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
  .replace(/-+$/g, "")

 /**
 * Entry point of the UI interactions
 */
const init = () => {
    // Display loading animation
    window.addEventListener("load", (e) => {
        self.preloader.style.display = "block"
    })
    
    // Make API calls
    let tableFilter = new TableFilter(self.table, self.filterContainer, self.filters, self.data)
    getTaskFromApi('/api/tasks/phabricator').then(() => tableFilter.initFilters())
}

// Run the show
init()