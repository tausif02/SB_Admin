/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
*/

// Toggle the side navigation
window.addEventListener('DOMContentLoaded', event => {
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    // Call the functions to fetch data when the page loads
    fetchRandomCat();
    fetchCatTagsAndChart();
});

// Function to fetch a random cat image from CATAAS
function fetchRandomCat() {
    fetch('https://cataas.com/cat?json=true')
        .then(response => response.json())
        .then(data => {
            const catImage = document.getElementById('randomCatImage');
            if (catImage) {
                catImage.src = `https://cataas.com/cat/${data._id}`;
            }
        })
        .catch(error => console.error('Error fetching cat image:', error));
}

// Function to fetch tags and display a bar chart with the number of cats for each tag
function fetchCatTagsAndChart() {
    fetch('https://cataas.com/api/tags')
        .then(response => response.json())
        .then(tags => {
            const tagCounts = {};
            const fetchPromises = tags.map(tag =>
                fetch(`https://cataas.com/api/cats?tags=${tag}`)
                    .then(response => response.json())
                    .then(cats => {
                        tagCounts[tag] = cats.length;
                    })
            );

            Promise.all(fetchPromises).then(() => {
                const ctx = document.getElementById('catBarChart')?.getContext('2d');
                if (ctx) {
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: Object.keys(tagCounts),
                            datasets: [{
                                label: 'Number of Cats',
                                data: Object.values(tagCounts),
                                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching tags:', error));
}