import {
    blobToDataurl,
    centerArts,
    declareModule,
    ImageArt,
    measureImageSize,
    patternToRegExp,
    string_data_url,
    string_mime_type_with_wildcard,
} from '@collboard/modules-sdk';
import ReactDOMServer from 'react-dom/server';
import { contributors, description, license, repository, version } from '../../package.json';
import { SvgGeojsonConverter } from '../geojson/SvgGeojsonConverter';

const mimeTypes: string_mime_type_with_wildcard[] = ['image/svg', 'image/svg+xml', 'application/geo+json'];

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
            async importFile({ logger, file, boardPosition, next, willCommitArts, previewOperation }) {
                if (!mimeTypes.some((mimeType) => patternToRegExp(mimeType).test(file.type))) {
                    return next();
                }

                let fileSvg: Blob;

                if (file.type === 'application/geo+json') {
                    willCommitArts();

                    const svgGeojsonConverter = new SvgGeojsonConverter(JSON.parse(await file.text()));
                    const svgElement = (await svgGeojsonConverter.makeSvg(Math.pow(1.1, -13 /* [➿] */), false)) as any;
                    const imageString = ReactDOMServer.renderToStaticMarkup(svgElement.element);
                    fileSvg = new Blob([imageString], { type: 'image/svg+xml' });
                }
                // TODO: Test this inside Collboard engine <collboard><support-module name="@collboard/map-svg-geojson-import" version="0.11.0"></support-module></collboard>
                else if ((await file.text()).includes(`@collboard/map-svg-geojson-import`) /* <- TODO: Better */) {
                    fileSvg = file;
                } else {
                    return next();
                }

                willCommitArts();
                let imageSrc: string_data_url = await blobToDataurl(fileSvg);

                // await previewImage(imageSrc);

                const imageSize = await measureImageSize(imageSrc); // .divide(appState.transform.scale);
                const imageScaledSize = imageSize.scale(2);

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

                imageSrc = (await usercontentSystem.upload(fileSvg)).href;
                imageArt.src = imageSrc;
                imageArt.opacity = 1;

                return imageArt;
            },
        });
    },
});
