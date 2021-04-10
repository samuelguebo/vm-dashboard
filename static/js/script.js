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
this.preloader = document.getElementById("preloader")
this.table = document.getElementById("data").querySelector("tbody")
this.filterContainer = document.getElementById("data-filter")
this.tasks = {}
this.filters = {

    created_at: {
        title: "Year",
        type: "date",
        key: "created_at"
    },
    project_title: {
        title: "Vulnerability",
        type: "text",
        key: "project_title"
    },
    priority: {
        title: "Severity",
        type: "numeric",
        key: "priority"
    }, 
}

/**
 * Collect list of tasks from
 * the Asana endpoint
 * 
 * @param {String} url
 */
const getTaskFromApi = url => {
    return fetch(url) .then((response) => response.json())
}

 /**
 * Entry point of the UI interactions
 */
const init = () => {
    // Display loading animation
    window.addEventListener("load", (e) => {

        getTaskFromApi('/api/tasks/phabricator').then((data) =>  {
            
            this.data = data
            // Make API calls
            let tableFilter = new TableFilter(this.table, this.filterContainer, this.filters, this.data)
            // Generate table and relevant filtering
            tableFilter.generateTable(true, this.data)
            tableFilter.generateFilters()

            // Display Project stats
            let groupedValues = tableFilter.getGroupedValues()
            let stats = new Stats(document.getElementById('project-chart'))
            stats.displayChart(groupedValues['project_title'])

            // Display Year stats
            stats = new Stats(document.getElementById('year-chart'))
            stats.displayChart(groupedValues['created_at'].map(i => new Date(i).getFullYear()))

        })

        // Set up scroll-to-top
        initScrollToTop(document.getElementById('back-to-top'))
        this.preloader.style.display = "block"
        
    })
    
    
}

/**
 * Implement scroll to top animation
 * for better UX
 */
const initScrollToTop = (scrollToTopBtn) => {
    document.addEventListener("scroll", handleScroll);
    function handleScroll() {
        let limit = 600; // Show button if we're 600px down
        if(document.documentElement.scrollTop > limit) {
            //show button
            scrollToTopBtn.style.display = "block";
        } else {
            //hide button
            scrollToTopBtn.style.display = "none";
        }
    }

    scrollToTopBtn.addEventListener("click", scrollToTop);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

}

// Run the show
init()