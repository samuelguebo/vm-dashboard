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
let phabricatorURI = ""

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
            // Convenient sanitization
            task.title = task.title.replace(/\[Maniphest\] \[.*\] T\d+: /, "")

            // Pick Phab ID, otherwise generate one from the title
            task.html_id = (task.id !== false ? task.id : slugify(task.title))
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

        if(!tasks.hasOwnProperty(task.html_id)){
            // Display data in table as a row
            addRowToTable(task);
            tasks[task.html_id] = task
        }else {
            // Update UI based on difference btween old and newer data
            updateRowToTable(tasks[task.html_id], task);
        }

        // Remove Phab completed tasks
        removePhabricatorOrphan(task);

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
    rowHTML += "<td class = 'is_completed'>" + item.is_completed + "</td>";
    rowHTML += "<td class = 'column'>" + item.column + "</td>";
    rowHTML += "<td class = 'column'>";
        rowHTML += "<a href='#' class='link asana btn btn-light btn-sm'></a> ";
        rowHTML += "<a href='#' class='link phabricator btn btn-light btn-sm'></a>";
    rowHTML += "</td>";
    
    row.innerHTML = rowHTML;
    table.append(row);

    // insert relevant link
    activateLink(item)
};

/**
 * Update exisint row and hilight
 * any data discrepancy
 *
 * @param {Object} a, old data
 * @param {Object} b, new data
 */
const updateRowToTable = (a, b) => {
    // build HTML rows
    let discrepancies = []
    let table = document.getElementById("data").querySelector("tbody");
    let row = table.querySelector(`#${a.html_id}`)

    // find discrepancies
    for (let key of Object.keys(a)) {
        if(a[key] !== b[key]){
            
            // discard "created_at" and "link"
            if(!['created_at', 'link'].includes(key))
                discrepancies.push(key)
        }
    }
    
    // highlight discrepancies in table row
    for (let selector of discrepancies){
        // console.log(`${a.html_id} has conflicting ${selector}`)
        if('undefined' !== row.querySelector(`.${selector}`)){
            row.querySelector(`.${selector}`).classList.add('different')
        }
    }

    // Display relevant task URL
    activateLink(b)
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
   * Display relevant hyperlinked icon
   * for Phabricator or Asana link.
   * @param {*} task 
   */
const activateLink = task => {
    row = document.getElementById(task.html_id)
    link_type = task.link.includes("asana") ? "asana" : "phabricator"
    row.querySelector(`a.${link_type}`).href = task.link
    row.querySelector(`a.${link_type}`).classList.add('active')

    /**
     * Display Phabricator link when ticket number is set
     */ 
    if(!(task.id === false)
        && !row.querySelector(`a.phabricator`).classList.contains('active')){
            row.querySelector(`a.phabricator`).href = `${phabricatorURI}/${task.id}`
            row.querySelector(`a.phabricator`).classList.add('active')   
        }
}

/**
 * Get Phabricator URL from
 * the API info endpoint
 */
const getPhabricatorURL = () => {
    fetch('/api/info').then(data => data.json())
    .then(info => {
        phabricatorURI = info['phabricator_url']
    })
}

/**
 * Make sure tasks in Phab:Completed column don't appear
 * unless they differ from the Asana task
 */
const removePhabricatorOrphan = task => {
    row = document.getElementById(task.html_id)
    if(task.link.includes("phabricator") && task.column == 'Completed') {
        if(!row.querySelector(`a.asana`).classList.contains('active')){
            row.classList.add('uneeded')
        }
    }
}

 /**
 * Entry point of the UI interactions
 */
const init = () => {
    // Display loading animation
    window.addEventListener("load", (e) => {
        document.querySelector("#preloader").style.display = "block";
    });
    
    // Make API calls
    getTaskFromApi('/api/tasks/asana');
    getTaskFromApi('/api/tasks/phabricator');
}

// Run the show
getPhabricatorURL()
init();