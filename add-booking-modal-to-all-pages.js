// add-booking-modal-to-all-pages.js
// This script adds booking modal CSS, JS, and HTML to all HTML files

const fs = require('fs');
const path = require('path');

// Files to exclude
const excludeFiles = [
    'footer.html',
    'booking-modal.html',
    'Admin/admin.html',
    'Admin/login.html',
    'Admin/create-job.html',
    'Admin/job-application.html',
    'Admin/chatbot-conversations.html'
];

// Booking modal HTML content
const bookingModalHTML = fs.readFileSync(path.join(__dirname, 'booking-modal.html'), 'utf8');

// Function to get relative path prefix
function getPathPrefix(filePath, rootDir) {
    const relativePath = path.relative(rootDir, filePath);
    const isInSubfolder = relativePath.includes(path.sep);
    return isInSubfolder ? '../' : './';
}

// Function to check if file should be processed
function shouldProcessFile(filePath) {
    return !excludeFiles.some(excluded => filePath.includes(excluded));
}

// Function to add booking modal to HTML file
function addBookingModalToFile(filePath, rootDir) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if booking modal is already added
        if (content.includes('booking-modal.css') || content.includes('id="bookingModal"')) {
            console.log(`⏭️  Skipped (already has booking modal): ${filePath}`);
            return false;
        }
        
        // Check if file has closing body tag
        if (!content.includes('</body>')) {
            console.log(`⚠️  Warning: No </body> tag found in ${filePath}`);
            return false;
        }
        
        const prefix = getPathPrefix(filePath, rootDir);
        
        // Add CSS link in <head> if not already there
        if (content.includes('</head>')) {
            const bookingCSSLink = `    <link rel="stylesheet" href="${prefix}CSS/booking-modal.css">\n`;
            content = content.replace('</head>', `${bookingCSSLink}</head>`);
        }
        
        // Add booking modal HTML and JS before </body>
        const bookingModalIncludes = `
    ${bookingModalHTML}

    <!-- Booking Modal Script -->
    <script src="${prefix}script/booking-modal.js"></script>
`;
        content = content.replace('</body>', `${bookingModalIncludes}\n</body>`);
        
        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Added booking modal to: ${filePath}`);
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
            if (!['node_modules', '.git', 'Assets', 'uploads', 'office', 'server'].includes(file)) {
                findHTMLFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Main execution
console.log('📞 Starting Booking Modal Integration...\n');

const rootDir = __dirname;
const htmlFiles = findHTMLFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files\n`);

let processed = 0;
let skipped = 0;

htmlFiles.forEach(filePath => {
    const relativePath = path.relative(rootDir, filePath);
    
    if (shouldProcessFile(relativePath)) {
        if (addBookingModalToFile(filePath, rootDir)) {
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
console.log('\n🎉 Booking modal integration complete!');
