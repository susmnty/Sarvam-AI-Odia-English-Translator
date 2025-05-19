/* global google */

const MY_API_KEY = 'sk_vral3j9p_xMe3VoTEvc8kIIL3ItTIc8Sj'; // Replace with your real API key

document.getElementById('apiKeyStatus').textContent =
  MY_API_KEY === 'sk_vral3j9p_xMe3VoTEvc8kIIL3ItTIc8Sj' ? '❌' : '✔';

// Load Google Transliteration
google.load("elements", "1", {
  packages: "transliteration",
  callback: onLoad
});

function onLoad() {
  const options = {
    sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
    destinationLanguage: [google.elements.transliteration.LanguageCode.ORIYA],
    transliterationEnabled: true
  };
  const control = new google.elements.transliteration.TransliterationControl(options);
  control.makeTransliteratable(['inputText']);
}

function updateStatus(message, color = 'black') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = color;
}

async function convertToSpeech() {
  const text = document.getElementById('inputText').value.trim();
  const player = document.getElementById('audioPlayer');

  if (!text) {
    updateStatus('Please enter some text.', 'red');
    return;
  }

  updateStatus('Processing...', 'black');
  player.style.display = 'none';
  player.src = '';

  try {
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': MY_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        speaker: "vidya",
        target_language_code: "od-IN",
        inputs: [text],
        model: "bulbul:v2"
      })
    });

    const data = await response.json();
    if (data.audios && data.audios.length > 0) {
      player.src = `data:audio/wav;base64,${data.audios[0]}`;
      player.style.display = 'block';
      updateStatus('Conversion successful! Click play to listen.', 'green');
    } else {
      throw new Error('No audio data returned.');
    }
  } catch (err) {
    updateStatus('Error: ' + err.message, 'red');
  }
}

async function translateText() {
  const text = document.getElementById('inputText').value.trim();
  const targetLang = document.getElementById('targetLang').value;
  const output = document.getElementById('outputText');

  if (!text) {
    alert('Please enter some text.');
    return;
  }

  try {
    const response = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk_mjan8kkn_4HoYmK3rEoJemo7nLCIQhO9D'
      },
      body: JSON.stringify({
        text: text,
        source_lang: targetLang === 'or' ? 'en' : 'or',
        target_lang: targetLang
      })
    });

    const data = await response.json();
    console.log('API Response:', data); // <-- Check console for debug

    if (data.translated_text) {
      output.textContent = data.translated_text;
    } else {
      output.textContent = 'No translation returned.';
    }

  } catch (error) {
    console.error('Translation error:', error);
    output.textContent = 'Translation failed. Please try again.';
  }
}