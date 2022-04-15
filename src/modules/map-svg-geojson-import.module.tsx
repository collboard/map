import {
    blobToDataUrl,
    centerArts,
    declareModule,
    fitInside,
    ImageArt,
    measureImageSize,
    patternToRegExp,
    string_mime_type_with_wildcard,
} from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';

const mimeTypes: string_mime_type_with_wildcard[] = ['image/svg', 'image/svg+xml'];

declareModule({
    manifest: {
        name: '@collboard/map-svg-geojson-import',
        contributors,
        description,
        license,
        repository,
        version,
        flags: {
            isHidden: true /* <- TODO: (File) support modules should be always hidden*/,
        },
        supports: {
            fileImport: mimeTypes,
        },
    },
    async setup(systems) {
        const {
            importSystem,
            virtualArtVersioningSystem,
            apiClient,
            appState,
            materialArtVersioningSystem,
            notificationSystem,
        } = await systems.request(
            'importSystem',
            'virtualArtVersioningSystem',
            'apiClient',
            'appState',
            'materialArtVersioningSystem',
            'notificationSystem',
        );

        return importSystem.registerFileSupport({
            priority: 100 /* <- TODO: !!! In future no need for extra priority because imported file itself will tell to use <support-module name="@collboard/map-svg-geojson-import" */,
            async processFile({ logger, file, boardPosition, next, willCommitArts, previewOperation }) {
                if (!mimeTypes.some((mimeType) => patternToRegExp(mimeType).test(file.type))) {
                    return next();
                }

                // TODO: Also test for <collboard><support-module name="@collboard/map-svg-geojson-import" version="0.11.0"></support-module></collboard>

                alert('Wohohohoho');

                willCommitArts();

                let imageSrc = await blobToDataUrl(file);

                // await previewImage(imageSrc);

                const imageScaledSize = fitInside({
                    isUpscaling: false,
                    objectSize: await (await measureImageSize(imageSrc)).divide(appState.transform.scale),
                    containerSize: appState.windowSize.divide(appState.transform.scale),
                });

                const imageArt = new ImageArt(imageSrc, 'image');
                imageArt.size = imageScaledSize;
                imageArt.opacity = 0.5;

                logger.info('Imported art', imageArt);

                centerArts({ arts: [imageArt], boardPosition });

                previewOperation.update(imageArt);

                // TODO: Limit here max size of images> if(imageSize.x>this.systems.appState.windowSize*transform)

                imageSrc = await apiClient.fileUpload(file);
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                return imageArt;
            },
        });
    },
});
