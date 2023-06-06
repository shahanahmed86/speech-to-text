import { useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

/** @typedef {'up'|'down'|'left'|'right'} ActionType */

const ACTIONS = {
	up: () => alert("You've triggered up event..."),
	down: () => alert("You've triggered down event..."),
	left: () => alert("You've triggered left event..."),
	right: () => alert("You've triggered right event...")
};

function SpeechComponent() {
	const {
		error,
		interimResult,
		isRecording,
		results,
		setResults,
		startSpeechToText,
		stopSpeechToText,
	} = useSpeechToText({
		continuous: true,
    useLegacyResults: false,
		// crossBrowser: true,
		// googleApiKey: import.meta.env.VITE_APP_CLOUD_API_KEY,
	});

	useEffect(() => {
    const prev = [...results];
		const ind = prev.findIndex(({ transcript: t }) => t.split(' ').some((k) => k in ACTIONS));
		if (ind < 0) return;

		/**  @type {ActionType[]} */
		const keys = prev[ind].transcript.split(' ').reverse();

		/**  @type {ActionType} */
		const key = keys.find((k) => k in ACTIONS);
		if (!key) return; // never

		ACTIONS[key]();

    prev.splice(ind, 1);
		setResults(prev);
	}, [results, setResults]);

	if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
	return (
		<div>
			<h1>Recording: {isRecording.toString()}</h1>
			<button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
				{isRecording ? 'Stop Recording' : 'Start Recording'}
			</button>
			<ul>
				{results.map((result) => (
					<li key={result.timestamp}>{result.transcript}</li>
				))}
				{interimResult && <li>{interimResult}</li>}
			</ul>
		</div>
	);
}

export default SpeechComponent;
