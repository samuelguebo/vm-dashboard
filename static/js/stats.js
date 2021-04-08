class Stats {

    constructor(chartContainer, hasLegend=true){
        this.chartContainer = chartContainer
        this.hasLegend = hasLegend
    }
    /**
     * Create chart in UI
     * @param {Array of objects} list
     */
    displayChart = function (list) {
      // Stats data
      list = this.total(list);
      //console.log(list)
      let data = {
        datasets: [
          {
            data: Object.values(list),
            backgroundColor: this.randColors(20),
          },
        ],
  
        labels: Object.keys(list),
      };
      // For a pie chart
      this.chartContainer.style.display = "block";
      let ctx = this.chartContainer.getContext("2d");
      ctx.textAligh = "left";
  
      if (typeof resultChart === "undefined") {
        new Chart(ctx, {
          type: "doughnut",
          data: data,
          options: {
            cutoutPercentage: 70,
            tooltips: {
              callbacks: {
                label: function (tooltipItem, data) {
                  return (
                    data["labels"][tooltipItem["index"]] +
                    ": " +
                    data["datasets"][0]["data"][tooltipItem["index"]]
                    
                  );
                },
                
              },
            },
            legend: {
              display: this.hasLegend,
              position: "left",
            },
          },
        });
      }
      // update
      else {
        resultChart.data.labels = Object.keys(list).slice(0, 32);
        resultChart.data.datasets[0].data = Object.values(list).slice(0, 32);
  
        resultChart.update();
      }
    }
  
    /**
     * Get proportion in percentage
     *
     * @param {Object} data
     */
  
    percentile = function (data) {
      return data.reduce((item, i) => {
        if (typeof item[i] !== "undefined") {
          item[i] = Number((item[i] + (1 / data.length) * 100).toFixed(1));
        } else {
          item[i] = Number(((1 / data.length) * 100).toFixed(1));
        }
        return item;
      }, {});
    }

    /**
     * Get total count
     * @param {*} data 
     */
    total = function (data) {
        console.log(data)
        return data.reduce((item, i) => {
          if (typeof item[i] !== "undefined") {
            item[i] += 1
          } else {
            item[i] = 1
          }
          return item;
        }, {});
      }

  /**
   * Generate random colors
   * @param int size of palette
   */
  randColors = function (size) {
    let palette = ["#FF6385",
    "#36A2EB",
    "#FFCD56",
    "#F24900",
    "#FFBC20",
    "#007BFF",
    "#55BA30",
    "#FFA75B",
    "#BC2FA0",
    "#EE7600",
    "#EE4000",
    "#4EABFC",
    "#DCC7AA",
    "#E91E63",
    "#F44336",
    "#F18973",
    "#2196F3",
    "#3F51B5",
    "#4CAF50",
    "#FF9800",
    "#FFC107",
    "#9C27B0",
    "#F44336",
    "#FDFFF0",
    "#FFF8F0",
    "#FFF1F0",
    "#FFF0F8",
    "#E0FFEE",
    "#E0FFE6",
    "#FDFFF0",
    "#F7E0FF",
    "#F6FFE0",]

    let generatedPalette = []

    /**
     * Randomize without repition
     */
    for(let i= 0 ; i <= size; i++){
        let randColor = palette[Math.floor(Math.random() * size)]
        if(generatedPalette.indexOf(randColor) < 0){
            generatedPalette.push(randColor)
        }
    }

    return generatedPalette

  }
};