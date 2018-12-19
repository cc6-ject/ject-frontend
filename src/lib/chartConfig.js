// Make chart.js config

export function getAxisConfig(yLabel) {
  return {
    yAxes: [
      {
        ticks: { beginAtZero: true },
        scaleLabel: { display: true, labelString: yLabel, fontSize: 18 }
      }
    ],
    xAxes: [
      {
        barPercentage: 0.7,
        barThickness: 15,
        stacked: false,
        gridLines: {
          display: false
        },
        ticks: { fontSize: 18 }
      }
    ]
  };
}

export function getAnnotationConfig(transparent, isLabel) {
  return {
    annotations: [
      {
        type: 'line',
        id: 'hLine',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: 40,
        borderWidth: 1,
        borderColor: `rgba(52, 73, 85, ${transparent})`,
        label: {
          enabled: isLabel,
          backgroundColor: `rgba(52, 73, 85 , 1)`,
          fontSize: 16,
          content: 'Proper Level'
        }
      }
    ]
  };
}
