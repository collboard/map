import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            collboard: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'support-module': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & { name: string },
                HTMLElement
            >;
        }
    }
}
