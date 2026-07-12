export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height)
  );
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width * scale;
  canvas.height = bitmap.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.82);
  });
}

export async function uploadImage(file: File): Promise<string> {
  const compressed = await compressImage(file);
  const jpegName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  const uploadData = new FormData();
  uploadData.set("file", compressed, jpegName);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: uploadData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Upload failed");
  }
  const { pathname } = await response.json();
  return pathname as string;
}
