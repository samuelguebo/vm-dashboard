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
 */
let self = window;
self.table = document.getElementById("data").querySelector("tbody");
self.tasks = {};
self.filters = {
    project_title: {
        title: "Project",
        type: "text",
        key: "project_title"
    },
    priority: {
        title: "Severity",
        type: "range",
        key: "priority"
    }, 
    created_at: {
        title: "Year",
        type: "date",
        key: "created_at"
    }
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

        if(!self.tasks.hasOwnProperty(task.id)){
            // Display data in table as a row
            addRowToTable(task);
            self.tasks[task.id] = task
        }
    }
    // Hide loading animation
    document.querySelector("#preloader").style.display = "none";
};
  
/**
 * Append row to the table
 * @param {Object} item
 */
const addRowToTable = item => {
    // build HTML rows
    let row = document.createElement("tr");
    
    row.id = item.id
    let rowHTML = "";
    // let count = table.childNodes.length + 1;
    // rowHTML += "<td><b>" + (count++) + "</b></td>"
    rowHTML += `<td>${(item.id !== false ? item.id : "")}</td>`;
    rowHTML += `<td>${item.title}</td>`;
    rowHTML += `<td data-project ="${item.project_title}">${item.project_title}</td>`;
    rowHTML += `<td>${new Date(item.created_at).getFullYear()}</td>`;
    rowHTML += `<td>${item.priority}</td>`;
    
    row.innerHTML = rowHTML;
    self.table.append(row);

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
    getTaskFromApi('/api/tasks/phabricator').then(() => initFilters())
}

/**
 * Generate HTML item
 * @param {*} filter 
 * @param {*} values 
 * @param {*} container 
 */
const displayFilter = (filter, values, container) => {
    // Generate Header
    let header = document.createElement('h6')
    header.innerText = filter.title
    container.appendChild(header)

    // Generate input checkbox for text fields
    if(filter.type === 'text'){
        for(let value of values){
            let item = document.createElement('span')
            item.classList.add('filter-item', filter.key)
            item.innerHTML = `<input type="checkbox" value="${value}">`
            item.innerHTML += ` <label value="${value}">${value}</label>`

            // Bind event listener
            let checker = item.querySelector('input[type=checkbox]')
            checker.addEventListener('change', () => {
                filterTable(self.table, filter, value, checker.checked) 
            })
            
            // Add UI
            container.appendChild(item)
        }
    }
    
}

/**
 * Filter operation
 * @param {*} table 
 * @param {*} filter 
 * @param {*} value 
 * @param {*} isChecked 
 */
const filterTable = (table, filter, value, isChecked) => {
    if(filter.type == 'text'){
        let selectedNodes = document.querySelectorAll(`#data-filter .${filter.key} input[type=checkbox]:checked`)
        
        // Hide all TDs by default
        table.querySelectorAll('tbody td').forEach(e => {
            if((isChecked == true) && selectedNodes.length > 0){
                e.parentNode.style.display = 'none'
            }else if((isChecked == false) && selectedNodes.length > 0){
                e.parentNode.style.display = 'none'   
            }else{
                e.parentNode.style.display = ''
            }
        });

        // Display only selected values
        for (selectedNode of selectedNodes){
            table.querySelectorAll(`tbody td[data-project="${selectedNode.value}"]`).forEach(e => {
                e.parentNode.style.display = ''
            });
        }
    }
}
/**
 * Set up and display filter
 * options for the table
 */
const initFilters = () => {
    let groupedValues = {}
    let container = document.getElementById('data-filter')
    for (let task of Object.values(self.tasks)){
        for(let [key, value] of Object.entries(self.filters)){
            // Initiate groupedValues key
            if(!groupedValues.hasOwnProperty(key)){
                groupedValues[key] = []
            }
            
            // Build/update an array of unique values
            if(groupedValues[key].indexOf(task[key]) < 0){
                groupedValues[key].push(task[key])
            }
        }
    } 

    for(let [key, value] of Object.entries(self.filters)){
        // Display relevant UI
        displayFilter(self.filters[key], groupedValues[key], container)
    }
}

// Run the show
init();