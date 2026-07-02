import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script imports products from the frontend products.js file
 * and includes ALL fields including images
 */

async function importProductsWithImages() {
  try {
    // Read the frontend products.js file
    const frontendPath = path.join(__dirname, '../../src/data/products.js');
    const content = fs.readFileSync(frontendPath, 'utf-8');

    // Extract the products array using regex
    const match = content.match(/export const products = \[([\s\S]*)\];/);
    
    if (!match) {
      console.error('❌ Could not find products array in frontend file');
      process.exit(1);
    }

    // Parse the products array
    let products;
    try {
      // Wrap in array brackets and parse as JSON
      const jsonStr = '[' + match[1] + ']';
      products = eval('(' + jsonStr + ')');
    } catch (e) {
      console.error('Error parsing products:', e.message);
      process.exit(1);
    }

    // Remove the frontend 'id' field and add default status
    products = products.map(product => {
      const { id, ...productWithoutId } = product;
      return {
        ...productWithoutId,
        status: 'active'
      };
    });

    // Write to server/data/products.js with all fields preserved
    const outputPath = path.join(__dirname, '../data/products.js');
    const outputContent = `export const products = ${JSON.stringify(products, null, 2)};`;
    
    fs.writeFileSync(outputPath, outputContent);

    console.log(`✅ Successfully imported ${products.length} products with images!`);
    console.log(`📁 Output: server/data/products.js`);

    // Display sample to verify images are included
    if (products.length > 0) {
      console.log('\n📋 Sample product:');
      console.log(JSON.stringify(products[0], null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing products:', error);
    process.exit(1);
  }
}

importProductsWithImages();
