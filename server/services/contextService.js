const Resume = require('../models/Resume');

// Service to manage user context (resume data)
exports.getContext = async (userId) => {
    try {
        // Get the most recent resume
        const resume = await Resume.findOne({ user: userId }).sort({ uploadedAt: -1 });

        if (!resume || !resume.parsed) {
            return null;
        }

        return formatContext(resume);
    } catch (err) {
        console.error('Error fetching context:', err);
        return null;
    }
};

// Format parsed resume data into a system prompt friendly string
const formatContext = (resumeModel) => {
    if (!resumeModel) return '';

    const data = resumeModel.parsed || {};
    const rawText = resumeModel.rawText || '';

    const { personalInfo, skills, experience, projects, education } = data;

    let context = `Candidate Name: ${personalInfo?.name || 'Unknown'}\n`;

    if (Array.isArray(skills) && skills.length > 0) {
        const allSkills = skills
            .filter(s => s && Array.isArray(s.items)) // Filter out invalid entries
            .map(s => s.items.join(', '))
            .join(', ');
        context += `Skills: ${allSkills}\n`;
    }

    if (Array.isArray(experience) && experience.length > 0) {
        context += `Experience:\n`;
        experience.forEach(exp => {
            if (!exp) return;
            context += `- ${exp.role || 'Role'} at ${exp.company || 'Company'} (${exp.startDate || ''} - ${exp.endDate || 'Present'})\n`;
            if (exp.description) context += `  ${exp.description.substring(0, 150)}...\n`;
        });
    }

    if (Array.isArray(projects) && projects.length > 0) {
        context += `Projects:\n`;
        projects.forEach(proj => {
            if (!proj) return;
            context += `- ${proj.name || 'Project'}: ${proj.description || ''}\n`;
        });
    }

    if (Array.isArray(education) && education.length > 0) {
        context += `Education:\n`;
        education.forEach(edu => {
            if (!edu) return;
            context += `- ${edu.degree || 'Degree'} in ${edu.field || 'Field'} from ${edu.school || 'School'}\n`;
        });
    }

    if (rawText) {
        // Truncate raw text to avoid hitting token limits (approx 3000 chars should be enough for most resumes)
        const truncatedRaw = rawText.substring(0, 4000);
        context += `\n--- Full Resume Content ---\n${truncatedRaw}\n---------------------------\n`;
    }

    return context;
};
