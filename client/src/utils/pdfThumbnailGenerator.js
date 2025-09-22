import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?worker';

export async function generatePDFThumbnail(file, scale = 0.5) {
  const fileData = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: fileData });
  const pdf = await loadingTask.promise;

  const page = await pdf.getPage(1); // Get the first page

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;

  // Convert canvas to data URL (image)
  const thumbnailUrl = canvas.toDataURL('image/png');

  return thumbnailUrl; // You can use this in <img src={thumbnailUrl} />
}
