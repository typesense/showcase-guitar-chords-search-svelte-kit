import { renderToString } from 'react-dom/server';
// @ts-expect-error package doesn't support ts type
import Chord from '@tombatossals/react-chords/lib/Chord';

export type _chordPosition = {
	frets: number[];
	fingers: number[];
	barres: number[];
	capo?: boolean;
};
export default function RenderChord(chord: _chordPosition) {
	return renderToString(
		Chord({
			chord,
			instrument: {
				strings: 6,
				fretsOnChord: 4,
				name: 'Guitar',
				keys: [],
				tunings: {
					standard: ['E', 'A', 'D', 'G', 'B', 'E']
				}
			}
		})
	);
}
