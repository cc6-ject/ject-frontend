// Make chart.js config

export function getAxisConfig(isPhone) {
  const fontSize = isPhone ? 10 : 18;
  const barThickness = isPhone ? 10 : 15;
  const maxTicksLimit = isPhone ? 10 : 30;
  return {
    yAxes: [
      {
        ticks: { beginAtZero: true, fontSize },
        scaleLabel: { display: false }
      }
    ],
    xAxes: [
      {
        barPercentage: 0.7,
        barThickness,
        stacked: false,
        gridLines: {
          display: false
        },
        ticks: {
          fontSize,
          autoSkip: true,
          maxTicksLimit,
          maxRotation: 0,
          minRotation: 0
        }
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
