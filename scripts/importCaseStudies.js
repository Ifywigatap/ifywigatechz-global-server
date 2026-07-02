import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Import Case Studies from frontend and convert to backend format
 */
async function importCaseStudies() {
  try {
    const frontendPath = path.join(__dirname, '../../src/data/caseStudies.js');
    const content = fs.readFileSync(frontendPath, 'utf-8');

    const match = content.match(/export const caseStudies = \[([\s\S]*)\]/);
    
    if (!match) {
      console.error('❌ Could not find caseStudies array');
      process.exit(1);
    }

    let caseStudies;
    try {
      const jsonStr = '[' + match[1] + ']';
      caseStudies = eval('(' + jsonStr + ')');
    } catch (e) {
      console.error('❌ Error parsing case studies:', e.message);
      process.exit(1);
    }

    // Convert to backend format
    const convertedCaseStudies = caseStudies.map(cs => ({
      title: cs.title,
      slug: cs.slug,
      company: cs.title.split(' ').slice(0, 3).join(' '),  // Extract company from title
      industry: cs.industry,
      description: cs.problem,
      challenge: cs.problem,
      solution: cs.solution,
      results: [{
        metric: 'Impact',
        value: cs.result,
        description: cs.result
      }],
      status: 'published',
      featured: false
    }));

    const outputPath = path.join(__dirname, '../data/caseStudies.js');
    const outputContent = `export const caseStudies = ${JSON.stringify(convertedCaseStudies, null, 2)};`;
    
    fs.writeFileSync(outputPath, outputContent);

    console.log(`✅ Successfully imported ${convertedCaseStudies.length} case studies!`);
    console.log(`📁 Output: server/data/caseStudies.js`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importCaseStudies();
