import Sanscript from '@indic-transliteration/sanscript';

const phraseReplacements: Array<[RegExp, string]> = [
	[/Sri Venkateswara Suprabhatam/gi, 'శ్రీ వేంకటేశ్వర సుప్రభాతం'],
	[/Sri Vishnu Sahasranama Stotram/gi, 'శ్రీ విష్ణు సహస్రనామ స్తోత్రం'],
	[/Sri Vishnu Sahasra Nama Stotram/gi, 'శ్రీ విష్ణు సహస్ర నామ స్తోత్రం'],
	[/Vishnu Sahasranama Stotram/gi, 'విష్ణు సహస్రనామ స్తోత్రం'],
	[/Vishnu Sahasra Nama Stotram/gi, 'విష్ణు సహస్ర నామ స్తోత్రం'],
	[/Lord Vishnu/gi, 'శ్రీ మహావిష్ణు'],
	[/Mahavishnu/gi, 'మహావిష్ణు'],
	[/Telugu Hanuman Chalisa/gi, 'తెలుగు హనుమాన్ చాలీసా'],
	[/Hanuman Chalisa Telugu Lyrics/gi, 'హనుమాన్ చాలీసా తెలుగు లిరిక్స్'],
	[/Hanuman Chalisa in Telugu/gi, 'హనుమాన్ చాలీసా తెలుగు'],
	[/Hanuman Chalisa/gi, 'హనుమాన్ చాలీసా'],
	[/Anjaneya Swamy/gi, 'ఆంజనేయ స్వామి'],
	[/Sri Rama/gi, 'శ్రీ రామ'],
	[/Sita/gi, 'సీత'],
	[/Telugu Lyrics/gi, 'తెలుగు లిరిక్స్'],
	[/Chanting Method/gi, 'పారాయణ విధానం'],
	[/Meaning/gi, 'మీనింగ్'],
	[/Benefits/gi, 'ప్రయోజనాలు'],
	[/Related/gi, 'సంబంధిత'],
	[/Daily Prayer/gi, 'రోజువారీ ప్రార్థన'],
	[/Parayana/gi, 'పారాయణ'],
	[/Lyrics/gi, 'లిరిక్స్'],
	[/Stotra/gi, 'స్తోత్రం'],
	[/Sloka/gi, 'శ్లోకం'],
	[/Doha/gi, 'దోహా'],
	[/Dhyanam/gi, 'ధ్యానం'],
	[/Dhyana/gi, 'ధ్యానం'],
	[/Chaupai/gi, 'చౌపాయి'],
	[/Telugu/gi, 'తెలుగు'],
	[/English/gi, 'ఇంగ్లీష్'],
	[/Devanagari/gi, 'దేవనాగరి'],
	[/Tamil/gi, 'తమిళ్'],
	[/Kannada/gi, 'కన్నడ'],
	[/Malayalam/gi, 'మలయాళం'],
	[/Gujarati/gi, 'గుజరాతి'],
	[/Odia/gi, 'ఒడియా'],
	[/Bengali/gi, 'బెంగాలీ'],
	[/Marathi/gi, 'మరాఠీ'],
	[/Assamese/gi, 'అస్సామీ'],
	[/Punjabi/gi, 'పంజాబీ'],
	[/Hindi/gi, 'హిందీ'],
	[/Samskritam/gi, 'సంస్కృతం'],
	[/Sanskrit/gi, 'సంస్కృతం'],
	[/Nepali/gi, 'నేపాలీ'],
	[/Sinhala/gi, 'సింహళ'],
	[/Grantha/gi, 'గ్రంథ'],
];

function prepareRomanText(text: string) {
	return text
		.replace(/ch/gi, 'c')
		.replace(/sh/gi, 'z')
		.replace(/th/gi, 't')
		.replace(/ph/gi, 'ph')
		.replace(/v/gi, 'v')
		.replace(/w/gi, 'v')
		.replace(/x/gi, 'ks')
		.replace(/q/gi, 'k')
		.replace(/f/gi, 'ph');
}

export function normalizeStotraSource(text: string) {
	return phraseReplacements.reduce(
		(normalized, [pattern, replacement]) => normalized.replace(pattern, replacement),
		text,
	);
}

export function transliterateStotraText(text: string, scheme: string) {
	const normalized = normalizeStotraSource(text);
	const withRomanRuns = normalized.replace(/[A-Za-z][A-Za-z \t'’.-]*[A-Za-z]?/g, (match) =>
		Sanscript.t(prepareRomanText(match), 'itrans', scheme),
	);

	return Sanscript.t(withRomanRuns, 'telugu', scheme);
}
