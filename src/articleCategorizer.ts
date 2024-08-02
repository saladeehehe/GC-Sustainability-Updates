const categories = {
    "Carbon": ["carbon emissions", "CO2", "carbon footprint", 'carbon'],
    "Water": ["water conservation", "water management", "water usage", 'Water'],
    "Energy": ["energy efficiency", "renewable energy", "energy consumption", 'energy'],
    "Material": ["materials", "resource efficiency", "recycling"],
    "Policies/Acts/Regulations": ["Agreement", "regulation", "policy", 'Act'], 
    "Singapore": ['Singapore']
};


// Function to categorize articles into multiple categories and include 'Others'
export function categorizeArticle(articleText: string): string[] {
    const assignedCategories: string[] = [];

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => articleText.includes(keyword))) {
            assignedCategories.push(category);
        }
    }

    if (assignedCategories.length === 0) {
        assignedCategories.push("Others");
    }

    return assignedCategories;
}