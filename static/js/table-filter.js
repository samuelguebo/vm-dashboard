class TableFilter {
    
    constructor(table, filterContainer, filters, data){
        this.table = table
        this.filterContainer = filterContainer
        this.filters = filters
        this.data = data
    }
    /**
     * Generate HTML item
     * @param {*} filter 
     * @param {*} values 
     * @param {*} container 
     */
    displayFilter = (filter, values, container) => {
        // Generate Header
        let header = document.createElement('h6')
        let filterBlock = document.createElement('div')
        let valueBlock = document.createElement('div')
        filterBlock.id = filter.key
        valueBlock.className = 'values-container'
        header.innerText = filter.title
        filterBlock.appendChild(header)
        
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
                    this.filterTable(this.table, filter, value, checker.checked) 
                })
                
                // Add UI
                valueBlock.appendChild(item)
            }
        }

        // Generate HTML items for numeric values
        if(['numeric', 'date'].includes(filter.type)){
            let item = document.createElement('div')
            
            // Pick only year for date values
            if(filter.type === 'date'){
                values = values.map(val => new Date(val).getFullYear())
            }
            // Sort ascendingly
            values.sort((a, b) => a-b) 
            item.innerHTML = `
            <div class="range-container">
                <input type="range" min="${values[0]}" max="${values[values.length-1]}" value="${values[Math.floor(values.length / 2)]}" class="slider" name="${filter.key}_range">
                <output class="bubble">${values[Math.floor(values.length / 2)]}</output>
            </div>`
            
            let rangeItem = item.querySelector('input[type=range]')
            rangeItem.addEventListener("input", () => {
                item.querySelector('.bubble').innerHTML = rangeItem.value
                this.filterTable(this.table, filter, rangeItem.value) 
            })
            // Add UI
            valueBlock.appendChild(item)
        }

        // Add to main filter container
        filterBlock.appendChild(valueBlock)
        container.appendChild(filterBlock)
        
    }

    /**
     * Filter operation
     * @param {*} table 
     * @param {*} filter 
     * @param {*} value 
     * @param {*} isChecked 
     */
    filterTable = (table, filter, value, isChecked=true) => {
        if(filter.type == 'text'){
            let selectedNodes = this.filterContainer.querySelectorAll(`.${filter.key} input[type=checkbox]:checked`)
            
            // Hide all TDs by default
            table.querySelectorAll('tbody td').forEach(e => {
                if((isChecked == true) && selectedNodes.length > 0){
                    e.parentNode.style.display = 'none'
                }else if((isChecked == false) && selectedNodes.length > 0){
                    e.parentNode.style.display = 'none'   
                }else{
                    e.parentNode.style.display = ''
                }
            })

            // Display only selected values
            for (let selectedNode of selectedNodes){
                let filteredNodes = table.querySelectorAll(`tbody td[data_${filter.key}="${selectedNode.value}"]`)
                filteredNodes.forEach(e => {
                    e.parentNode.style.display = ''
                })
            }
        }

        if(['numeric', 'date'].includes(filter.type)){
            // Hide all TDs by default
            table.querySelectorAll('tbody td').forEach(e => e.parentNode.style.display = 'none')
            
            // Display only filtered rows
            let filteredNodes = table.querySelectorAll(`tbody td[data_${filter.key}`)
            filteredNodes = Array.from(filteredNodes).filter(node => parseInt(node.innerText) <= value)
            filteredNodes.forEach(e => e.parentNode.style.display = '')
        }
    }
    /**
     * Set up and display filter
     * options for the table
     */
    generateFilters = () => {
        let container = document.getElementById('data-filter')
        let groupedValues = this.getGroupedValues(true)

        for(let [key, value] of Object.entries(this.filters)){
            // Display relevant UI and bind listener events
            this.displayFilter(this.filters[key], groupedValues[key], container)
        }
    }

    /**
     * Aggregate values 
     * @param {boolean} isUnique 
     */
    getGroupedValues = (isUnique=false) => {
        let groupedValues = []
        for (let item of Object.values(this.data)){
            for(let [key, value] of Object.entries(this.filters)){
                // Initiate groupedValues key
                if(!groupedValues.hasOwnProperty(key)){
                    groupedValues[key] = []
                }
                
                // Build/update an array of unique values
                if(isUnique == true) {
                    if(groupedValues[key].indexOf(item[key]) < 0){
                        groupedValues[key].push(item[key])
                    }
                }else{
                    groupedValues[key].push(item[key])
                }
            }
        }
        return groupedValues 
    }
}