import { declareModule } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, license, repository, version } from '../../package.json';
import { IGeojsonFeatureCollection } from '../interfaces/IGeojson';
import { GeojsonArt } from './map-geojson-art';

declareModule({
    manifest: {
        name: '@collboard/map-map-geojson-import-support',
        title: { en: 'GeoJson support' },
        description: { en: 'Support for importing GeoJson files' },
        categories: ['Geography', 'Education'],
        contributors,
        license,
        repository,
        version,
        supports: {
            fileImport: 'application/geo+json',
        },
    },
    async setup(systems) {
        const { importSystem, virtualArtVersioningSystem, apiClient, appState, materialArtVersioningSystem } =
            await systems.request(
                'importSystem',
                'virtualArtVersioningSystem',
                'apiClient',
                'appState',
                'materialArtVersioningSystem',
            );

        // Note: For lot of systems we are using this makeWhatever helpers. I am trying one system - ImportSystem without make helper to modules just to use this systems methods directly.
        return importSystem.registerFileSupport({
            priority: 0,
            // mimeType: 'application/geo+json',
            async importFile({ file, boardPosition, next }) {
                return next();
                // TODO: Import GeoJson and center the map
                const geojson = JSON.parse(await file.text()) as IGeojsonFeatureCollection;

                // TODO: !!! Upload to server as a file

                // console.log({ geojson });
                const geojsonArt = new GeojsonArt(geojson);

                materialArtVersioningSystem.createPrimaryOperation().newArts(geojsonArt).persist();

                return Registration.void();
                /*


                let imageSrc = await blobToDataURI(file);
                const imageScaledSize = fitInside({
                    isUpscaling: false,
                    objectSize: await (await measureImageSize(file)).divide(appState.transform.scale),
                    containerSize: appState.windowSize.divide(appState.transform.scale),
                });

                const imageArt = new ImageArt(imageSrc, 'image');
                imageArt.size = imageScaledSize;
                imageArt.opacity = 0.5;

                consolex.info('Imported art', imageArt);

                centerArts({ arts: [imageArt], boardPosition });

                // Note: creating virtual art before  real is uploaded and processed
                const imagePreview = virtualArtVersioningSystem.createPrimaryOperation().newArts(imageArt);

                // TODO: Limit here max size of images> if(imageSize.x>this.systems.appState.windowSize*transform)

                imageSrc = await apiClient.fileUpload(file);
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                materialArtVersioningSystem.createPrimaryOperation().newArts(imageArt).persist();

                imagePreview.abort();

                // TODO: Everytime when importing sth select this new art and do it DRY
                await forImmediate();
                appState.setSelection({ selected: [imageArt] });

                */
            },
        });
    },
});
