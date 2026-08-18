import { db } from './src/db/index.js';
import { products, productGroups } from './src/db/schema.js';

async function run() {
  const groups = await db.select().from(productGroups);
  console.log('GROUPS:');
  console.log(JSON.stringify(groups, null, 2));
  
  const prods = await db.select().from(products);
  console.log('PRODUCTS:');
  console.log(JSON.stringify(prods, null, 2));
  
  process.exit(0);
}
run();
