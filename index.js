document.addEventListener('paste', async (e) => {
      // Remove e.preventDefault() to keep clipboard content
      const items = e.clipboardData.items;
      
      for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
              const blob = item.getAsFile();
              const img = new Image();
              img.src = URL.createObjectURL(blob);
              
              img.onload = () => {
                  const preview = document.getElementById('preview');
                  preview.src = img.src;
                  preview.style.display = 'block';
                  
                  const canvas = document.getElementById('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const code = jsQR(imageData.data, imageData.width, imageData.height);
                  
                  if (code) {
                      document.getElementById('qrResult').value = code.data;
                      document.getElementById('result').style.display = 'block';
                  } else {
                      alert('No QR code found in image');
                  }
              };
          }
      }
  });

  function copyToClipboard() {
      const resultInput = document.getElementById('qrResult');
      resultInput.select();
      document.execCommand('copy');
      
      // Visual feedback
      const button = document.querySelector('.btn-outline-primary');
      button.textContent = 'Copied!';
      setTimeout(() => {
          button.textContent = 'Copy';
      }, 2000);
  }
