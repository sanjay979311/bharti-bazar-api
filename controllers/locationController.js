import Location from '../models/locationModel.js'; // Adjust path based on your setup
import slugify from 'slugify';

// ==========================================
// 1. CREATE: State, City, or Area
// ==========================================
export const createLocation = async (req, res) => {
    try {
        const { name, type, parentId } = req.body;

        if (!name || !type) {
            return res.status(400).json({ success: false, message: "Name and Type are required" });
        }

        const slug = slugify(name, { lower: true, trim: true });

        // Check for duplicates in the same parent
        const existing = await Location.findOne({ slug, type, parentId: parentId || null });
        if (existing) {
            return res.status(400).json({ success: false, message: "This location already exists" });
        }

        const location = new Location({
            name,
            slug,
            type, // 'STATE', 'CITY', or 'AREA'
            parentId: parentId || null
        });

        await location.save();
        res.status(201).json({ success: true, data: location });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. READ: List Locations (Filtered)
// ==========================================
export const getLocationList = async (req, res) => {
    try {
        const { type, parentId } = req.query;
        let queryObj = {};

        // Allows fetching specifically all Cities or all Areas of a City
        if (type) queryObj.type = type.toUpperCase();
        if (parentId) queryObj.parentId = parentId;

        // Use .lean() for faster read performance
        const locations = await Location.find(queryObj)
            .sort({ name: 1 })
            .populate('parentId', 'name') // Optional: shows parent name
            .lean();

        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. UPDATE: Rename or Move Location
// ==========================================
export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parentId, type } = req.body;
        
        let updateData = { name, parentId, type };

        if (name) {
            updateData.slug = slugify(name, { lower: true, trim: true });
        }

        const updatedLocation = await Location.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ success: false, message: "Location not found" });
        }

        res.status(200).json({ success: true, data: updatedLocation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. DELETE: Remove Location
// ==========================================
export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if this location has children (e.g., don't delete a city if it has areas)
        const hasChildren = await Location.findOne({ parentId: id });
        if (hasChildren) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete location because it has sub-locations (Areas/Cities). Delete them first." 
            });
        }

        const deleted = await Location.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Location not found" });
        }

        res.status(200).json({ success: true, message: "Location removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};