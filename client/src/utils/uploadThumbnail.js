export async function uploadThumbnail(thumbnailUrl) {
  const blob = await (await fetch(thumbnailUrl)).blob();

  const formData = new FormData();
  formData.append('thumbnail', blob, 'thumbnail.png');

  try{
    const response = await fetch('http://localhost:3001/upload-thumbnail', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    console.log('This is data.path ', data.path);

    } catch (error) {
      console.error("Error uploading file:", error);
    }
}
