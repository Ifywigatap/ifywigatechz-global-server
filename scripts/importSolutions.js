import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import Solutions from frontend and convert to backend format
 */
async function importSolutions() {
  try {
    const frontendPath = path.join(__dirname, '../../src/data/solutions.js');
    const content = fs.readFileSync(frontendPath, 'utf-8');

    const match = content.match(/export const solutionsData = \[([\s\S]*)\];/);
    
    if (!match) {
      console.error('❌ Could not find solutionsData array');
      process.exit(1);
    }

    let solutions;
    try {
      const jsonStr = '[' + match[1] + ']';
      solutions = eval('(' + jsonStr + ')');
    } catch (e) {
      console.error('❌ Error parsing solutions:', e.message);
      process.exit(1);
    }

    // Map solution titles to categories
    const categoryMap = {
      'Real Estate': 'Web Development',
      'Healthcare': 'Web Development',
      'E-commerce': 'E-commerce'
    };

    // Convert to backend format
    const convertedSolutions = solutions.map(sol => ({
      title: sol.title,
      slug: sol.title.toLowerCase().replace(/\s+/g, '-'),
      description: sol.desc,
      overview: sol.desc,
      category: categoryMap[sol.title] || 'Web Development',
      industry: [sol.title],
      features: [{
        title: sol.title,
        description: sol.desc,
        icon: null
      }],
      benefits: [{
        title: `Benefits of ${sol.title} Solutions`,
        description: sol.desc
      }],
      technologies: ['React', 'Node.js', 'MongoDB'],
      status: 'active'
    }));

    const outputPath = path.join(__dirname, '../data/solutions.js');
    const outputContent = `export const solutions = ${JSON.stringify(convertedSolutions, null, 2)};`;
    
    fs.writeFileSync(outputPath, outputContent);

    console.log(`✅ Successfully imported ${convertedSolutions.length} solutions!`);
    console.log(`📁 Output: server/data/solutions.js`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importSolutions();
