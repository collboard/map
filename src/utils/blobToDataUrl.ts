/**
 * TODO: Naming blobToDataURI vs. blobToDataUri
 *
 * @collboard-modules-sdk
 */

export function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', async (event) => {
            const dataUri = event.target!.result as string;
            resolve(dataUri);
        });
        reader.readAsDataURL(blob);
    });
}
