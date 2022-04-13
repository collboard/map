export function capitalizeFirstLetter(word: string): string;
export function capitalizeFirstLetter(word: null): null;
export function capitalizeFirstLetter(word: string | null): string | null {
    if (word === null) {
        return null;
    } else {
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
    }
}
