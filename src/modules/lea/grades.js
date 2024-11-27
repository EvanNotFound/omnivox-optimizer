// grades.js

import '../../lea/grades.styl';
import Chart from 'chart.js/auto';

/**
 * Function to optimize the grades list and enhance the UI
 */
export function optimizeGradesList() {
    console.log('Optimizing grades list...');

    const gradesTable = document.querySelector('.tableau-notes');
    if (!gradesTable) {
        console.log('No grades table found');
        return;
    }

    // Remove the "Assessment marks summary" text
    const assessmentTitle = document.querySelector('.titrePageLea');
    if (assessmentTitle && assessmentTitle.textContent.includes('Assessment marks summary')) {
        assessmentTitle.remove();
    }

    // Wrap the grades table in a container for styling
    const gradesPageContainer = document.createElement('div');
    gradesPageContainer.className = 'grades-page';

    // Move the grades table into the container
    gradesTable.parentNode.insertBefore(gradesPageContainer, gradesTable);
    gradesPageContainer.appendChild(gradesTable);

    // Extract grades data
    const courseNames = [];
    const yourAverages = [];
    const classAverages = [];

    const rows = gradesTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        // Identify rows that contain course data
        if (cells.length >= 6 && cells[2].querySelector('a')) {
            // Extract course name from the third cell
            const courseCell = cells[2];
            const courseLink = courseCell.querySelector('a');
            const courseName = courseLink ? courseLink.textContent.trim() : 'Unknown Course';

            // Extract your grade from the fourth cell
            const yourGradeCell = cells[3];
            let yourAverage = null;

            const gradeFonts = yourGradeCell.querySelectorAll('font');
            if (gradeFonts.length > 0) {
                const gradeText = gradeFonts[0].textContent.trim();
                const percentageText = gradeFonts[1]?.textContent.trim();
                if (gradeText && gradeText !== '-') {
                    const gradeMatch = gradeText.match(/([\d.]+)\/([\d.]+)/);
                    if (gradeMatch) {
                        const obtained = parseFloat(gradeMatch[1]);
                        const total = parseFloat(gradeMatch[2]);
                        yourAverage = ((obtained / total) * 100).toFixed(2);
                    }
                } else if (percentageText && percentageText !== '-') {
                    const percentageMatch = percentageText.match(/(\d+)%/);
                    yourAverage = percentageMatch ? parseFloat(percentageMatch[1]) : null;
                }
            }

            // Extract class average from the fifth cell
            const classAverageCell = cells[4];
            let classAverage = null;

            const classAverageFonts = classAverageCell.querySelectorAll('font');
            if (classAverageFonts.length > 0) {
                // Try to find the percentage text in the fonts
                for (let i = 0; i < classAverageFonts.length; i++) {
                    const classAvgText = classAverageFonts[i]?.textContent.trim();
                    const classAvgMatch = classAvgText.match(/(\d+)%/);
                    if (classAvgMatch) {
                        classAverage = parseFloat(classAvgMatch[1]);
                        break;
                    }
                }
            }

            // Only include courses with grades in the chart
            if (yourAverage !== null) {
                courseNames.push(courseName);
                yourAverages.push(parseFloat(yourAverage));
                classAverages.push(classAverage !== null ? classAverage : null);
            }
        }
    });

    if (courseNames.length === 0) {
        console.log('No grade data extracted');
        return;
    }

    injectChart(courseNames, yourAverages, classAverages, gradesPageContainer);
}

/**
 * Function to create a combined bar chart
 */
function createBarChart(ctx, courseNames, yourAverages, classAverages) {
    const datasets = [
        {
            label: 'Your Average (%)',
            data: yourAverages,
            backgroundColor: 'rgba(66, 133, 244, 0.8)',
            borderColor: 'rgba(66, 133, 244, 1)',
            borderWidth: 1,
            borderRadius: 5,
        }
    ];

    // Include class averages only if they are available
    if (classAverages.some(avg => avg !== null)) {
        datasets.push({
            label: 'Class Average (%)',
            data: classAverages,
            backgroundColor: 'rgba(52, 168, 83, 0.8)',
            borderColor: 'rgba(52, 168, 83, 1)',
            borderWidth: 1,
            borderRadius: 5,
        });
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courseNames,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        },
                        color: '#333'
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `${context.dataset.label}: ${value !== null ? value + '%' : 'N/A'}`;
                        }
                    },
                    bodyFont: {
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                        size: 12
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#e0e0e0'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        color: '#333',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

/**
 * Function to inject the chart into the DOM
 */
function injectChart(courseNames, yourAverages, classAverages, container) {
    console.log('Injecting chart into the DOM...');

    // Remove existing chart if present
    const existingChartContainer = container.querySelector('.grades-chart-container');
    if (existingChartContainer) {
        existingChartContainer.remove();
    }

    // Create a container for the chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'grades-chart-container';

    // Create a canvas element for Chart.js
    const canvas = document.createElement('canvas');
    canvas.id = 'gradesChart';
    chartContainer.appendChild(canvas);

    // Insert the chart container after the grades table
    container.appendChild(chartContainer);

    // Create the chart
    const ctx = canvas.getContext('2d');
    createBarChart(ctx, courseNames, yourAverages, classAverages);
}
