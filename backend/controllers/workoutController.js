const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// Get all workouts
const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({}).sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get a single workout
const getWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findById(id);

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

// Create a new workout
const createWorkout = async (req, res) => {
    const { title, load, reps } = req.body;

    try {
        const workout = await Workout.create({ title, load, reps });
        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a workout
const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findOneAndDelete({ _id: id });

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

// Update a workout
const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    const workout = await Workout.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true } // Return the updated document
    );

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};

module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout,
};
