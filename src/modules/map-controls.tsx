import { declareModule, ExtraJsxPlace, makeExtrajsxModule, randomEmoji, React, styled } from '@collboard/modules-sdk';
import helloWorldButton from '../../assets/hello-world-button.png';
import helloWorldIcon from '../../assets/hello-world-icon.png';
import { contributors, description, license, repository, version } from '../../package.json';
import { getUserGeolocation } from '../utils/getUserGeolocation';

declareModule(
    makeExtrajsxModule({
        manifest: {
            name: '@collboard/map-controls',
            version,
            description,
            contributors,
            license,
            repository,
            title: { en: 'Map controls' },
            categories: ['Geography', 'Buttons'],
            icon: helloWorldIcon,
            flags: {
                isTemplate: true,
            },
        },
        place: ExtraJsxPlace.EdgeRight,
        async createExtraJsx(systems) {
            const { notificationSystem } = await systems.request('notificationSystem');
            return (
                <ButtonElement
                    onClick={async () => {
                        notificationSystem.publish({
                            type: 'info',
                            tag: `hello-world-${Date.now()}`,
                            title: 'Hello world!',
                            subtitle: `Hello from Collboard modules!`,
                            body: `Sending the ${randomEmoji()} from a module towards ${await getUserGeolocation()}!`,
                            canBeClosed: true,
                        });
                    }}
                    className="button button-primary button-vertical"
                >
                    <img alt="Hello World!" src={helloWorldButton} />
                </ButtonElement>
            );
        },
    }),
);

const ButtonElement = styled.button`
    background-color: #906090;

    img {
        display: block;
        width: 50px;
    }
`;
