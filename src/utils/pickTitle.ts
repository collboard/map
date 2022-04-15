export function pickTitle(...titles: string[]): string {
    titles = titles.filter((title) => title);

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
}
