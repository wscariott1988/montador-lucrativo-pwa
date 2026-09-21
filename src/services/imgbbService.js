const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

export function getImgBbKey() {
  return String(import.meta.env.VITE_IMGBB_API_KEY ?? '').trim();
}

export function hasImgBbKey() {
  return getImgBbKey() !== '';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'));
    reader.readAsDataURL(file);
  });
}

// Redimensiona e comprime a imagem em um canvas (max 1280px, JPEG 0.8),
// devolvendo a string base64 sem prefixo (formato exigido pela API da ImgBB).
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, width, height);
        context.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY).split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Arquivo de imagem inválido.'));
    img.src = URL.createObjectURL(file);
  });
}

// Faz o upload de um arquivo de imagem para a API publica/gratuita da ImgBB
// e devolve a URL publica. Precisa de VITE_IMGBB_API_KEY no .env.local.
export async function uploadImageToImgBB(file) {
  const key = getImgBbKey();
  if (!key) {
    const error = new Error('Chave da ImgBB (VITE_IMGBB_API_KEY) não configurada.');
    error.code = 'imgbb-not-configured';
    throw error;
  }

  const base64 = await compressImage(file);
  const body = new FormData();
  body.append('key', key);
  body.append('image', base64);

  const response = await fetch(IMGBB_UPLOAD_URL, { method: 'POST', body });
  const json = await response.json();
  if (!response.ok || !json?.success) {
    const error = new Error(
      json?.error?.message || json?.status_text || 'A ImgBB não aceitou a imagem.'
    );
    error.code = 'imgbb-upload-failed';
    throw error;
  }

  return json.data?.url ?? json.data?.display_url ?? '';
}