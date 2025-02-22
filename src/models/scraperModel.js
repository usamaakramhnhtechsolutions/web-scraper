import mongoose from "mongoose";

const ScrapedDataSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    logo: { type: String },
    links: [{
        url: String,
        title: String,
        description: String,
        logo: String
    }],
}, { timestamps: true });

const ScrapedData = mongoose.models.ScrapedData || mongoose.model("ScrapedData", ScrapedDataSchema);
export default ScrapedData;
