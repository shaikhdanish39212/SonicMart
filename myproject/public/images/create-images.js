const fs = require('fs');
const { createCanvas } = require('canvas');

// Create a simple placeholder image
function createPlaceholderImage(filename, category) {
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 400, 300);
    
    // Border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 360, 260);
    
    // Text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(category.replace(/([A-Z])/g, ' $1').trim(), 200, 130);
    ctx.fillText('Product Image', 200, 150);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Arial';
    ctx.fillText('Loading...', 200, 170);
    
    // Icon placeholder
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(200, 200, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filename, buffer);
}

// Create essential images that the backend needs
const essentialImages = [
    // Microphones
    { file: 'Microphone1.png', category: 'Microphone' },
    { file: 'Microphone1.1.png', category: 'Microphone' },
    { file: 'Microphone1.2.png', category: 'Microphone' },
    { file: 'Microphone1.3.png', category: 'Microphone' },
    
    // DJ Speakers  
    { file: 'DJSpeaker1.png', category: 'DJ Speaker' },
    { file: 'DJSpeaker1.1.png', category: 'DJ Speaker' },
    { file: 'DJSpeaker1.2.png', category: 'DJ Speaker' },
    { file: 'DJSpeaker1.3.png', category: 'DJ Speaker' },
    
    // Headphones
    { file: 'HeadPhones1.png', category: 'Headphones' },
    { file: 'HeadPhones1.1.png', category: 'Headphones' },
    { file: 'HeadPhones1.2.png', category: 'Headphones' },
    { file: 'HeadPhones1.3.png', category: 'Headphones' },
    
    // Guitars
    { file: 'GuitarsBasses1.png', category: 'Guitar' },
    { file: 'GuitarsBasses1.1.png', category: 'Guitar' },
    { file: 'GuitarsBasses1.2.png', category: 'Guitar' },
    { file: 'GuitarsBasses1.3.png', category: 'Guitar' },
];

let created = 0;
essentialImages.forEach(img => {
    try {
        createPlaceholderImage(img.file, img.category);
        created++;
        console.log(`Created ${img.file}`);
    } catch (error) {
        console.error(`Failed to create ${img.file}:`, error.message);
    }
});

console.log(`Successfully created ${created} images`);
