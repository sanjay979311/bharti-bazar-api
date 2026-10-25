// models/Location.js (Unified for City/Area/State)
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true }, // 'mumbai', 'andheri-west'
    type: { type: String, enum: ['STATE', 'CITY', 'AREA'], required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }, // Area -> City -> State
    isTopLocation: { type: Boolean, default: false }
});

LocationSchema.index({ type: 1, slug: 1 }, { unique: true });
module.exports = mongoose.model('Location', LocationSchema);