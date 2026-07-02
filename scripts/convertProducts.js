import fs from 'fs';
import path from 'path';

// Read the frontend products file
const frontendPath = path.join(process.cwd(), '../src/data/products.js');
const content = fs.readFileSync(frontendPath, 'utf8');

// Extract the products array
const productsMatch = content.match(/export const products = \[([\s\S]*)\];/);
if (productsMatch) {
  const productsArray = '[' + productsMatch[1] + ']';
  
  // Parse the products
  try {
    // Use Function to safely evaluate the object literal
    const products = eval('(' + productsArray + ')');
    
    // Remove the 'id' field as MongoDB will generate _id
    const cleanProducts = products.map(p => {
      const { id, ...rest } = p;
      return {
        ...rest,
        status: rest.status || 'active'
      };
    });
    
    // Create the output file
    const output = `export const products = ${JSON.stringify(cleanProducts, null, 2)};`;
    
    const outputPath = path.join(process.cwd(), 'data/products.js');
    fs.writeFileSync(outputPath, output);
    
    console.log(`✅ Successfully converted ${cleanProducts.length} products!`);
  } catch (error) {
    console.error('Error parsing products:', error.message);
  }
} else {
  console.error('Could not find products array in frontend file');
}
