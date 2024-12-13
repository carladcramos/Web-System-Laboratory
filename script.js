// Fetch all workouts
const fetchWorkouts = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/workouts');
        const data = await response.json();
        
        if (response.ok) {
            return data;
        }
    } catch (error) {
        console.error('Error fetching workouts:', error);
    }
};

// Add exercise with fetch
async function addExercise() {
    const exercise = document.getElementById('exercise').value;
    const load = document.getElementById('load').value;
    const reps = document.getElementById('reps').value;

    if (!exercise || !load || !reps) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: exercise,
                load: Number(load),
                reps: Number(reps)
            })
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error);
        }

        const exerciseList = document.getElementById('exerciseList');
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'exercise-card';
        exerciseCard.setAttribute('data-id', json._id);
        
        const timestamp = new Date(json.createdAt).toLocaleString();

        exerciseCard.innerHTML = `
            <div class="exercise-header">s
                <h3>${json.title}</h3>
                <div class="button-group">
                    <button class="edit-btn" onclick="editExercise('${json._id}')" title="Edit exercise">
                        ✎
                    </button>
                    <button class="delete-btn" onclick="deleteExercise('${json._id}')" title="Delete exercise">
                        ×
                    </button>
                </div>
            </div>
            <div class="exercise-details">
                <p>Load (kg): ${json.load}</p>
                <p>Reps: ${json.reps}</p>
                <p class="timestamp">${timestamp}</p>
            </div>
        `;
        
        exerciseList.prepend(exerciseCard);

        // Clear input fields
        document.getElementById('exercise').value = '';
        document.getElementById('load').value = '';
        document.getElementById('reps').value = '';

    } catch (error) {
        console.error('Error adding exercise:', error);
        alert('Error adding exercise');
    }
}

// Delete exercise with fetch
async function deleteExercise(id) {
    if (confirm('Are you sure you want to delete this exercise?')) {
        try {
            const response = await fetch(`http://localhost:4000/api/workouts/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                document.querySelector(`[data-id="${id}"]`).remove();
            } else {
                throw new Error('Failed to delete exercise');
            }
        } catch (error) {
            console.error('Error deleting exercise:', error);
            alert('Error deleting exercise');
        }
    }
}

// Load existing workouts when page loads
window.addEventListener('DOMContentLoaded', async () => {
    const workouts = await fetchWorkouts();
    const exerciseList = document.getElementById('exerciseList');
    
    if (workouts) {
        workouts.forEach(workout => {
            const exerciseCard = document.createElement('div');
            exerciseCard.className = 'exercise-card';
            exerciseCard.setAttribute('data-id', workout._id);
            
            const timestamp = new Date(workout.createdAt).toLocaleString();

            exerciseCard.innerHTML = `
                <div class="exercise-header">
                    <h3>${workout.title}</h3>
                    <div class="button-group">
                        <button class="edit-btn" onclick="editExercise('${workout._id}')" title="Edit exercise">
                            ✎
                        </button>
                        <button class="delete-btn" onclick="deleteExercise('${workout._id}')" title="Delete exercise">
                            ×
                        </button>
                    </div>
                </div>
                <div class="exercise-details">
                    <p>Load (kg): ${workout.load}</p>
                    <p>Reps: ${workout.reps}</p>
                    <p class="timestamp">${timestamp}</p>
                </div>
            `;
            
            exerciseList.appendChild(exerciseCard);
        });
    }
});

// Add edit function
async function editExercise(id) {
    try {
        // First fetch the current workout data
        const response = await fetch(`http://localhost:4000/api/workouts/${id}`);
        const workout = await response.json();
        
        if (!response.ok) {
            throw new Error('Could not fetch workout');
        }

        const exerciseCard = document.querySelector(`[data-id="${id}"]`);
        
        // Create edit form with current values
        exerciseCard.innerHTML = `
            <div class="edit-form">
                <div class="input-group">
                    <label>Exercise Title:</label>
                    <input type="text" id="edit-title-${id}" value="${workout.title}">
                </div>
                <div class="input-group">
                    <label>Load (kg):</label>
                    <input type="number" id="edit-load-${id}" value="${workout.load}">
                </div>
                <div class="input-group">
                    <label>Reps:</label>
                    <input type="number" id="edit-reps-${id}" value="${workout.reps}">
                </div>
                <div class="edit-buttons">
                    <button class="save-btn" onclick="saveEdit('${id}')">Save</button>
                    <button class="cancel-btn" onclick="cancelEdit('${id}')">Cancel</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error preparing edit:', error);
        alert('Error preparing edit form');
    }
}

// Save edit function
async function saveEdit(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const load = document.getElementById(`edit-load-${id}`).value;
    const reps = document.getElementById(`edit-reps-${id}`).value;

    if (!title || !load || !reps) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/api/workouts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                load: Number(load),
                reps: Number(reps)
            })
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.error || 'Failed to update workout');
        }

        // Update the card with new data
        const exerciseCard = document.querySelector(`[data-id="${id}"]`);
        const timestamp = new Date(json.updatedAt).toLocaleString();

        exerciseCard.innerHTML = `
            <div class="exercise-header">
                <h3>${json.title}</h3>
                <div class="button-group">
                    <button class="edit-btn" onclick="editExercise('${id}')" title="Edit exercise">
                        ✎
                    </button>
                    <button class="delete-btn" onclick="deleteExercise('${id}')" title="Delete exercise">
                        ×
                    </button>
                </div>
            </div>
            <div class="exercise-details">
                <p>Load (kg): ${json.load}</p>
                <p>Reps: ${json.reps}</p>
                <p class="timestamp">${timestamp}</p>
            </div>
        `;

    } catch (error) {
        console.error('Error updating exercise:', error);
        alert('Error updating exercise');
    }
}

// Cancel edit function
async function cancelEdit(id) {
    try {
        // Fetch the current data to ensure we show the correct values
        const response = await fetch(`http://localhost:4000/api/workouts/${id}`);
        const workout = await response.json();

        if (!response.ok) {
            throw new Error('Could not fetch workout data');
        }

        const exerciseCard = document.querySelector(`[data-id="${id}"]`);
        const timestamp = new Date(workout.updatedAt).toLocaleString();

        exerciseCard.innerHTML = `
            <div class="exercise-header">
                <h3>${workout.title}</h3>
                <div class="button-group">
                    <button class="edit-btn" onclick="editExercise('${id}')" title="Edit exercise">
                        ✎
                    </button>
                    <button class="delete-btn" onclick="deleteExercise('${id}')" title="Delete exercise">
                        ×
                    </button>
                </div>
            </div>
            <div class="exercise-details">
                <p>Load (kg): ${workout.load}</p>
                <p>Reps: ${workout.reps}</p>
                <p class="timestamp">${timestamp}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error canceling edit:', error);
        alert('Error canceling edit');
    }
}