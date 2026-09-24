import sharp from 'sharp';
// test-results/blender-map.png -> base64 JPEG для просмотра
const b = await sharp('test-results/blender-map.png').resize({ width: 480 }).jpeg({ quality: 40 }).toBuffer();
console.log('LEN=' + b.length);
console.log(b.toString('base64'));
