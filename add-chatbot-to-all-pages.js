// add-chatbot-to-all-pages.js
// This script adds chatbot CSS and JS to all HTML files in the project

const fs = require('fs');
const path = require('path');

// Files to exclude
const excludeFiles = [
    'footer.html',
    'Admin/admin.html',
    'Admin/login.html',
    'Admin/create-job.html',
    'Admin/job-application.html',
    'Admin/chatbot-conversations.html'
];

// Function to get chatbot includes with correct relative path
function getChatbotIncludes(filePath, rootDir) {
    const relativePath = path.relative(rootDir, filePath);
    const isInSubfolder = relativePath.includes(path.sep);
    const prefix = isInSubfolder ? '../' : './';
    
    return `
    <!-- Chatbot -->
    <link rel="stylesheet" href="${prefix}CSS/chatbot.css">
    <script src="${prefix}script/chatbot.js"></script>
`;
}

// Function to check if file should be processed
function shouldProcessFile(filePath) {
    return !excludeFiles.some(excluded => filePath.includes(excluded));
}

// Function to add chatbot to HTML file
function addChatbotToFile(filePath, rootDir) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if chatbot is already added
        if (content.includes('chatbot.css') || content.includes('chatbot.js')) {
            console.log(`⏭️  Skipped (already has chatbot): ${filePath}`);
            return false;
        }
        
        // Check if file has closing body tag
        if (!content.includes('</body>')) {
            console.log(`⚠️  Warning: No </body> tag found in ${filePath}`);
            return false;
        }
        
        // Get chatbot includes with correct path
        const chatbotIncludes = getChatbotIncludes(filePath, rootDir);
        
        // Add chatbot includes before </body>
        content = content.replace('</body>', `${chatbotIncludes}\n</body>`);
        
        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Added chatbot to: ${filePath}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Function to find all HTML files
function findHTMLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip certain directories
            if (!['node_modules', '.git', 'Assets', 'uploads', 'office'].includes(file)) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Main execution
console.log('🤖 Starting Chatbot Integration...\n');

const rootDir = __dirname;
const htmlFiles = findHTMLFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files\n`);

let processed = 0;
let skipped = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath);
    
    if (shouldProcessFile(relativePath)) {
        if (addChatbotToFile(filePath, rootDir)) {
            processed++;
        } else {
            skipped++;
        }
    } else {
        console.log(`⏭️  Excluded: ${relativePath}`);
        skipped++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Processed: ${processed} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
console.log(`📊 Total: ${htmlFiles.length} files`);
console.log('='.repeat(50));
console.log('\n🎉 Chatbot integration complete!');
