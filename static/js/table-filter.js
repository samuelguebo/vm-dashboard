class TableFilter {
	TYPE_TEXT = 'text';
	TYPE_NUMERIC = 'numeric';
	TYPE_DATE = 'date';
	FILTER_STATUS = false;

	constructor(table, filterContainer, filters, data) {
		this.table = table;
		this.filterContainer = filterContainer;
		this.filters = filters;
		this.data = data;
	}

	/**
     * Generate HTML item
     * @param {*} filter 
     * @param {*} values 
     * @param {*} container 
     * @returns {void}
     */
	displayFilter = (filter, values, container) => {
		// Generate Header
		let header = document.createElement('h6');
		let filterBlock = document.createElement('div');
		let valueBlock = document.createElement('div');
		filterBlock.id = filter.key;
		valueBlock.className = 'values-container';
		header.innerText = filter.title;
		filterBlock.appendChild(header);

		// Generate input checkbox for text fields
		if ([ this.TYPE_TEXT ].includes(filter.type)) {
			for (let value of values) {
				let item = document.createElement('span');
				item.classList.add('filter-item', filter.key);
				item.innerHTML = `<input type="checkbox" value="${value}">`;
				item.innerHTML += ` <label value="${value}">${value}</label>`;

				// Bind event listener
				let checker = item.querySelector('input[type=checkbox]');
				checker.addEventListener('change', () => {
					this.handleFilter(filter, checker, checker.checked);
				});

				// Add UI
				valueBlock.appendChild(item);
			}
		}

		// Generate HTML items for numeric values
		if ([ this.TYPE_NUMERIC, this.TYPE_DATE ].includes(filter.type)) {
			let item = document.createElement('div');

			// Pick only year for date values
			if (filter.type === this.TYPE_DATE) {
				values = values.map((val) => new Date(val).getFullYear());
			}
			// Sort ascendingly
			values.sort((a, b) => a - b);
			item.innerHTML = `
            <div class="range-container">
                <input type="range" min="${values[0]}" max="${values[values.length - 1]}" value="${values[
				values.length - 1
			]}" class="slider" name="${filter.key}_range">
                <output class="bubble">${values[values.length - 1]}</output>
            </div>`;

			let rangeItem = item.querySelector('input[type=range]');
			rangeItem.addEventListener('input', () => {
				item.querySelector('.bubble').innerHTML = rangeItem.value;
				this.handleFilter(filter, rangeItem);
			});
			// Add UI
			valueBlock.appendChild(item);
		}

		// Add to main filter container
		filterBlock.appendChild(valueBlock);
		container.appendChild(filterBlock);
	};

	/**
     * Perform filtering operation
     * on a range of HTML rows
     * @param {*} table 
     * @param {*} filter 
     * @param {*} inputNode 
     * @returns {void}
     */
	handleFilter = (filter, inputNode) => {
		// Deal with filter of type checkbox
		let filterValues = this.getFilterValues();
		let filteredData = [];

		// Proceed with the actual filtering
		for (let item of this.data) {
			// Use a counter to determine whether row should be displayed
			let verificationCounter = 0;
			for (let filterKey of Object.keys(filterValues)) {
				if (this.filters[filterKey].type == this.TYPE_DATE) {
					// Convert date
					if (new Date(item[filterKey]).getFullYear() <= parseInt(filterValues[filterKey])) {
						verificationCounter += 1;
					}
				} else if (this.filters[filterKey].type == this.TYPE_NUMERIC) {
					if (parseInt(item[filterKey]) <= parseInt(filterValues[filterKey])) {
						verificationCounter += 1;
					}
				} else if (this.filters[filterKey].type == this.TYPE_TEXT) {
					if (filterValues[filterKey].includes(String(item[filterKey]))) {
						verificationCounter += 1;
					}
				}
			}

			if (verificationCounter == Object.keys(filterValues).length) {
				filteredData.push(item);
			}
		}

		// Regenerate the rows
		this.FILTER_STATUS = true;
		this.generateTable(true, filteredData);
	};

	/**
     * Populate table with rows
     * and reset it if needed
     * @param {Boolean} reset 
     * @param {Objet} data 
     */
	generateTable = (reset = true, data) => {
		// Reset table rows when generating
		if (reset) {
			this.table.innerHTML = '';
		}

		for (let item of data) {
			if (item.is_completed !== true) {
				this.updateUI(item);
			}
		}
	};

	/**
     * Update the user interface by adding new tasks
     * to the table with their relevant details
     *
     * @param {Object} task
     */
	updateUI = (task) => {
		// Display loading animation
		self.preloader.style.display = 'block';

		if (typeof task !== 'undefined' && typeof task.id !== false) {
			if (this.FILTER_STATUS) {
				this.addRowToTable(task);
			} else if (!self.data.hasOwnProperty(task.id)) {
				// Display data in table as a row
				this.addRowToTable(task);
				self.data[task.id] = task;
			}
		}

		self.preloader.style.display = 'none';
	};

	/**
     * Append row to the table
     * @param {Object} item
     */
	addRowToTable = (item) => {
		// build HTML rows
		let row = document.createElement('tr');

		row.id = item.id;
		let rowHTML = '';
		rowHTML += `<td><a href="${item.link}">${item.title}</a></td>`;
		rowHTML += `<td data_project_title="${item.project_title}"><a href="${item.project_link}">${item.project_title}</a></td>`;
		rowHTML += `<td data_created_at="${new Date(item.created_at).getFullYear()}">${new Date(
			item.created_at
		).getFullYear()}</td>`;
		rowHTML += `<td data_priority="${item.priority}">${item.priority}</td>`;

		row.innerHTML = rowHTML;
		self.table.append(row);
	};

	/**
     * Set up and display filter
     * options for the table
     * @returns {void}
     */
	generateFilters = () => {
		let container = document.getElementById('data-filter');
		let groupedValues = this.getGroupedValues(true);

		for (let [ key, value ] of Object.entries(this.filters)) {
			// Display relevant UI and bind listener events
			this.displayFilter(this.filters[key], groupedValues[key], container);
		}
	};

	/**
     * Aggregate values 
     * @param {boolean} isUnique 
     */
	getGroupedValues = (isUnique = false) => {
		let groupedValues = [];
		for (let item of Object.values(this.data)) {
			for (let [ key, value ] of Object.entries(this.filters)) {
				// Initiate groupedValues key
				if (!groupedValues.hasOwnProperty(key)) {
					groupedValues[key] = [];
				}

				// Build/update an array of unique values
				if (isUnique == true) {
					if (groupedValues[key].indexOf(item[key]) < 0) {
						groupedValues[key].push(item[key]);
					}
				} else {
					groupedValues[key].push(item[key]);
				}
			}
		}
		return groupedValues;
	};

	/**
     * Gather a summary of the filters their values
     * and indicate if if none of them is selected
     */
	getFilterValues = () => {
		let values = {};
		for (let filter of Object.values(this.filters)) {
			if (!Object(values).hasOwnProperty(filter.key)) {
				values[filter.key] = [];
			}

			let filterValues = [];
			let inputType = filter.type == this.TYPE_TEXT ? 'checkbox' : 'range';
			filterValues = Array.from(this.filterContainer.querySelectorAll(`#${filter.key} input[type=${inputType}]`));

			values[filter.key] = filterValues.filter((input) => input.checked).map((input) => input.value);

			if (values[filter.key].length < 1) {
				values[filter.key] = filterValues.map((input) => input.value);
			}
		}

		return values;
	};
}
