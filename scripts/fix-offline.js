import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const destDir = 'D:/Web THCS Đồng Tân';

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

try {
  if (fs.existsSync(destDir)) {
    // Copy dist/index.html to root index.html of D:\Web THCS Đồng Tân
    fs.copyFileSync(path.join(distDir, 'index.html'), path.join(destDir, 'index.html'));
    
    // Copy entire dist directory contents to D:\Web THCS Đồng Tân\dist
    copyFolderRecursiveSync(distDir, path.join(destDir, 'dist'));
    
    console.log('✅ Successfully updated D:\\Web THCS Đồng Tân build files for 100% stable localhost & web access!');
  }
} catch (err) {
  console.error('Lỗi khi copy build files:', err);
}
