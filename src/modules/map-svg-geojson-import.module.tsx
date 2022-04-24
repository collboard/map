import {
    blobToDataUrl,
    centerArts,
    declareModule,
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
            fileImport: mimeTypes /* <- TODO: [⭕] In future no need for fileImport: mimeTypes */,
        },
    },
    async setup(systems) {
        const {
            importSystem,
            virtualArtVersioningSystem,
            usercontentSystem,
            appState,
            materialArtVersioningSystem,
            notificationSystem,
        } = await systems.request(
            'importSystem',
            'virtualArtVersioningSystem',
            'usercontentSystem',
            'appState',
            'materialArtVersioningSystem',
            'notificationSystem',
        );

        return importSystem.registerFileSupport({
            priority: 100 /* <- TODO: [⭕] In future no need for extra priority because imported file itself will tell to use <support-module name="@collboard/map-svg-geojson-import" */,
            async processFile({ logger, file, boardPosition, next, willCommitArts, previewOperation }) {
                if (!mimeTypes.some((mimeType) => patternToRegExp(mimeType).test(file.type))) {
                    return next();
                }

                // TODO: Also test for <collboard><support-module name="@collboard/map-svg-geojson-import" version="0.11.0"></support-module></collboard>

                willCommitArts();

                let imageSrc = await blobToDataUrl(file);

                // await previewImage(imageSrc);

                const imageSize = await measureImageSize(imageSrc); // .divide(appState.transform.scale);
                const imageScaledSize = imageSize.scale(1 / 3);

                logger.info('imageSize', imageSize);
                /*
                fitInside({
                    isUpscaling: false,
                    objectSize: imageSize,
                    containerSize: appState.windowSize.divide(appState.transform.scale),
                });

                const imageSizeRatio = imageSize.x / imageScaledSize.x;
                logger.info('imageSizeRatio', imageSizeRatio);
                */

                const imageArt = new ImageArt(imageSrc, 'image');
                imageArt.size = imageScaledSize;
                imageArt.opacity = 0.5;

                logger.info('Imported art', imageArt);

                centerArts({ arts: [imageArt], boardPosition });

                previewOperation.update(imageArt);

                // await forEver(/*until file doubleupload optimization*/);

                imageSrc = await usercontentSystem.upload(file);
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                return imageArt;
            },
        });
    },
});
