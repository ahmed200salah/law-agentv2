import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Starting deployment to Vercel...');

// Check if dist folder exists
if (!fs.existsSync('./dist')) {
  console.log('📦 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('✅ Build completed successfully!');
console.log('📁 dist/ folder is ready for deployment');

console.log('\n📋 Next steps:');
console.log('1. Go to https://vercel.com');
console.log('2. Click "Import Project"');
console.log('3. Connect your GitHub repository');
console.log('4. Vercel will auto-detect your settings');
console.log('5. Or drag & drop the dist/ folder to deploy manually');

console.log('\n🔧 Vercel Configuration:');
console.log('- Framework: Vite');
console.log('- Build Command: npm run build');
console.log('- Output Directory: dist');
console.log('- Install Command: npm install');

console.log('\n✨ Your app is ready to deploy!');