function getCleanPublicId(filename: string): string {
  const nameWithoutExtension = filename.replace(/\.[^.]+$/, '');
  const normalizedName = nameWithoutExtension.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const cleanName = normalizedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleanName || 'image';
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
  formData.append('public_id', getCleanPublicId(file.name));
  formData.append('overwrite', 'true');
  formData.append('invalidate', 'true');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}
