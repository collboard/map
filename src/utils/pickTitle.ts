export function pickTitle(...titles: string[]): string {
    // TODO: !!! Just a hack
    titles = titles.filter((title) => title !== 'Česko');
    const title = titles[0];
    if (!title) {
        return 'Untitled';
    }
    return (
        title
            .split(',')
            .map((part) => part.trim())
            .find((part) => part.endsWith('kraj')) || title
    );

    /*

    // TODO: Unused until: [🎡]

    titles = titles.filter((title) => title);

    /*
    // TODO: Unused until:
    // TODO:  [🎡] bit a hack
    if (titles.length > 1) {
        titles.shift();
    }
    * /

    if (titles.length === 0) {
        return 'Untitled';
    }

    if (titles.length === 1) {
        return titles[0];
    }

    const titlesPartitioned = titles.map((title) => title.split(',').map((part) => part.trim()));

    let i = 0;

    levels: while (true) {
        let currentTitle: null | string = null;

        for (const titlePartitioned of titlesPartitioned) {
            if (titlePartitioned[i] && currentTitle && currentTitle !== titlePartitioned[i]) {
                i++;
                continue levels;
            }

            if (titlePartitioned[i]) {
                currentTitle = titlePartitioned[i];
            }
        }

        if (currentTitle) {
            return currentTitle;
        } else {
            return 'Untitled';
        }
    }
    */
}
