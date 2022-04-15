// write unit test for isNumeric function

import { pickTitle } from './pickTitle';

describe('picking of title', () => {
    it('should return Untitled', () => {
        expect(pickTitle()).toBe('Untitled');
        expect(pickTitle('')).toBe('Untitled');
    });

    it('should return given title', () => {
        expect(pickTitle('Aaaaa')).toBe('Aaaaa');
        expect(pickTitle('Aaaaa', 'Aaaaa')).toBe('Aaaaa');
    });

    it('should return first matching part', () => {
        expect(
            pickTitle(
                'Bystřice pod Hostýnem, okres Kroměříž, Zlínský kraj, Střední Morava, 76861, Česko',
                'Chropyně, okres Kroměříž, Zlínský kraj, Střední Morava, 76811, Česko',
                'Holešov, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Hulín, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Koryčany, okres Kroměříž, Zlínský kraj, Střední Morava, 76805, Česko',
                'Kroměříž, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Morkovice-Slížany, okres Kroměříž, Zlínský kraj, Střední Morava, 76833, Česko',
                'Bojkovice, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68771, Česko',
                'Hluk, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68725, Česko',
                'Kunovice, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68604, Česko',
                'Uherské Hradiště, okres Uherské Hradiště, Zlínský kraj, Střední Morava, Česko',
                'Uherský Brod, okres Uherské Hradiště, Zlínský kraj, Střední Morava, Česko',
                'Uherský Ostroh, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68724, Česko',
                'Karolinka, okres Vsetín, Zlínský kraj, Střední Morava, 75605, Česko',
                'Kelč, okres Vsetín, Zlínský kraj, Střední Morava, 75643, Česko',
                'Rožnov pod Radhoštěm, okres Vsetín, Zlínský kraj, Střední Morava, Česko',
                'Valašské Meziříčí, okres Vsetín, Zlínský kraj, Střední Morava, 75701, Česko',
                'Vsetín, okres Vsetín, Zlínský kraj, Střední Morava, Česko',
                'Brumov-Bylnice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Fryšták, okres Zlín, Zlínský kraj, Střední Morava, 76316, Česko',
                'Luhačovice, okres Zlín, Zlínský kraj, Střední Morava, 76326, Česko',
                'Napajedla, okres Zlín, Zlínský kraj, Střední Morava, 76361, Česko',
                'Otrokovice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Slavičín, okres Zlín, Zlínský kraj, Střední Morava, 76321, Česko',
                'Slušovice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Valašské Klobouky, okres Zlín, Zlínský kraj, Střední Morava, 76601, Česko',
                'Vizovice, okres Zlín, Zlínský kraj, Střední Morava, 76312, Česko',
                'Zlín, okres Zlín, Zlínský kraj, Střední Morava, Česko',
            ),
        ).toBe('Zlínský kraj');
    });

    it('should return last matching part', () => {
        expect(
            pickTitle(
                'Bystřice pod Hostýnem, okres Kroměříž, Zlínský kraj, Střední Morava, 76861, Česko',
                'Chropyně, okres Kroměříž, Zlínský kraj, Střední Morava, 76811, Česko',
                'Holešov, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Hulín, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Koryčany, okres Kroměříž, Zlínský kraj, Střední Morava, 76805, Česko',
                'Kroměříž, okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Morkovice-Slížany, okres Kroměříž, Zlínský kraj, Střední Morava, 76833, Česko',
                'okres Kroměříž, Zlínský kraj, Střední Morava, Česko',
                'Bojkovice, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68771, Česko',
                'Hluk, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68725, Česko',
                'Kunovice, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68604, Česko',
                'okres Uherské Hradiště, Zlínský kraj, Střední Morava, Česko',
                'Staré Město, Hlavní město Praha, Praha, Česko',
                'Uherské Hradiště, okres Uherské Hradiště, Zlínský kraj, Střední Morava, Česko',
                'Uherský Brod, okres Uherské Hradiště, Zlínský kraj, Střední Morava, Česko',
                'Uherský Ostroh, okres Uherské Hradiště, Zlínský kraj, Střední Morava, 68724, Česko',
                'Karolinka, okres Vsetín, Zlínský kraj, Střední Morava, 75605, Česko',
                'Kelč, okres Vsetín, Zlínský kraj, Střední Morava, 75643, Česko',
                'okres Vsetín, Zlínský kraj, Střední Morava, Česko',
                'Rožnov pod Radhoštěm, okres Vsetín, Zlínský kraj, Střední Morava, Česko',
                'Valašské Meziříčí, okres Vsetín, Zlínský kraj, Střední Morava, 75701, Česko',
                'Vsetín, okres Vsetín, Zlínský kraj, Střední Morava, Česko',
                'Zubří, okres Žďár nad Sázavou, Kraj Vysočina, Jihovýchod, Česko',
                'Brumov-Bylnice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Fryšták, okres Zlín, Zlínský kraj, Střední Morava, 76316, Česko',
                'Luhačovice, okres Zlín, Zlínský kraj, Střední Morava, 76326, Česko',
                'Napajedla, okres Zlín, Zlínský kraj, Střední Morava, 76361, Česko',
                'okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Otrokovice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Slavičín, okres Zlín, Zlínský kraj, Střední Morava, 76321, Česko',
                'Slušovice, okres Zlín, Zlínský kraj, Střední Morava, Česko',
                'Valašské Klobouky, okres Zlín, Zlínský kraj, Střední Morava, 76601, Česko',
                'Vizovice, okres Zlín, Zlínský kraj, Střední Morava, 76312, Česko',
                'Zlín, okres Zlín, Zlínský kraj, Střední Morava, Česko',
            ),
        ).toBe('Česko');
    });
});
