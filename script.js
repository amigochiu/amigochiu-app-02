/* Data Constants */
const LANGUAGES = [
    { code: 'zh-TW', name: '繁體中文 (台灣)', voiceCode: 'zh-TW' },
    { code: 'en-US', name: 'English', voiceCode: 'en-US' },
    { code: 'ja-JP', name: '日本語 (日本)', voiceCode: 'ja-JP' },
    { code: 'ko-KR', name: '한국어 (韓國)', voiceCode: 'ko-KR' },
    { code: 'es-ES', name: 'Español (西班牙)', voiceCode: 'es-ES' },
    { code: 'fr-FR', name: 'Français (法國)', voiceCode: 'fr-FR' },
    { code: 'de-DE', name: 'Deutsch (德國)', voiceCode: 'de-DE' },
    { code: 'th-TH', name: 'ไทย (泰國)', voiceCode: 'th-TH' },
    { code: 'vi-VN', name: 'Tiếng Việt (越南)', voiceCode: 'vi-VN' },
];

const SOURCE_UI_TEXTS = {
    'zh-TW': { label: '你的內容', placeholder: '請輸入文字...', listening: '正在聆聽...', speak: '請說話...' },
    'en-US': { label: 'Your Text', placeholder: 'Enter text...', listening: 'Listening...', speak: 'Speak now...' },
    'ja-JP': { label: '入力内容', placeholder: 'テキストを入力...', listening: '聞き取り中...', speak: 'お話しください...' },
    'ko-KR': { label: '입력 내용', placeholder: '텍스트 입력...', listening: '듣고 있어요...', speak: '말씀하세요...' },
    'es-ES': { label: 'Tu texto', placeholder: 'Ingresa texto...', listening: 'Escuchando...', speak: 'Habla ahora...' },
    'fr-FR': { label: 'Votre texte', placeholder: 'Saisir du texte...', listening: 'Écoute...', speak: 'Parlez maintenant...' },
    'de-DE': { label: 'Ihr Text', placeholder: 'Text eingeben...', listening: 'Zuhören...', speak: 'Bitte sprechen...' },
    'th-TH': { label: 'ข้อความของคุณ', placeholder: 'ป้อนข้อความ...', listening: 'กำลังฟัง...', speak: 'พูดได้เลย...' },
    'vi-VN': { label: 'Nội dung', placeholder: 'Nhập văn bản...', listening: 'Đang nghe...', speak: 'Hãy nói...' },
};

const TARGET_UI_TEXTS = {
    'zh-TW': { waiting: '等待翻譯...', hint: '翻譯結果將顯示於此', loading: '正在翻譯給對方...', title: '給對方的訊息' },
    'en-US': { waiting: 'Waiting for translation...', hint: 'Translation will appear here', loading: 'Translating...', title: 'Message for you' },
    'ja-JP': { waiting: '翻訳を待っています...', hint: 'ここに翻訳結果が表示されます', loading: '翻訳中...', title: 'あなたへのメッセージ' },
    'ko-KR': { waiting: '번역 대기 중...', hint: '번역 결과가 여기에 표시됩니다', loading: '번역 중...', title: '당신을 위한 메시지' },
    'es-ES': { waiting: 'Esperando traducción...', hint: 'La traducción aparecerá aquí', loading: 'Traduciendo...', title: 'Mensaje para ti' },
    'fr-FR': { waiting: 'En attente de traduction...', hint: 'La traduction apparaîtra ici', loading: 'Traduction en cours...', title: 'Message pour vous' },
    'de-DE': { waiting: 'Warten auf Übersetzung...', hint: 'Die Übersetzung wird hier angezeigt', loading: 'Übersetzen...', title: 'Nachricht für Sie' },
    'th-TH': { waiting: 'รอการแปล...', hint: 'ผลลัพธ์การแปลจะแสดงที่นี่', loading: 'กำลังแปล...', title: 'ข้อความสำหรับคุณ' },
    'vi-VN': { waiting: 'Đang chờ dịch...', hint: 'Kết quả dịch sẽ xuất hiện ở đây', loading: 'Đang dịch...', title: 'Tin nhắn cho bạn' },
};

const THEMES = [
    { id: 'candy', name: '夢幻糖果', color: '#e879f9' },
    { id: 'summer', name: '熱情夏日', color: '#fb923c' },
    { id: 'ocean', name: '清新海洋', color: '#22d3ee' },
    { id: 'forest', name: '森之秘境', color: '#10b981' },
];

/* State Management */
let state = {
    sourceLang: 'zh-TW',
    targetLang: 'ja-JP',
    inputText: '',
    translatedText: '',
    isLoading: false,
    isListening: false,
    isSpeaking: false,
    theme: 'candy'
};

/* DOM Elements */
const els = {};

/* Init */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Elements
    const getEl = (id) => document.getElementById(id);
    const elementsId = [
        'source-lang', 'target-lang', 'swap-btn', 'theme-btn', 'theme-menu', 'theme-list',
        'input-text', 'clear-btn', 'play-btn', 'trans-btn', 'mic-btn',
        'result-container', 'waiting-state', 'loading-state', 'success-state',
        'translated-text', 'target-waiting', 'target-hint', 'target-loading', 'target-title',
        'input-label-text', 'input-label-badge', 'input-card', 'toast'
    ];
    elementsId.forEach(id => els[id] = getEl(id));

    // 2. Initialize Data
    initLanguages();
    initThemes();

    // 3. Bind Events
    bindEvents();

    // 4. Icons
    lucide.createIcons();

    // 5. Setup Speech Rec
    setupSpeechRecognition();

    updateUI();
});

// ... (existing code) ...

/* PWA Service Worker Registration */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Error:', err));
    });
}


function initLanguages() {
    const createOptions = (select) => {
        LANGUAGES.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang.code;
            opt.textContent = lang.name;
            select.appendChild(opt);
        });
    };
    createOptions(els['source-lang']);
    createOptions(els['target-lang']);

    els['source-lang'].value = state.sourceLang;
    els['target-lang'].value = state.targetLang;
}

function initThemes() {
    els['theme-list'].innerHTML = '';
    THEMES.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'theme-option';
        if (state.theme === t.id) btn.classList.add('active');

        btn.innerHTML = `
            <div class="theme-dot" style="background: ${t.color}"></div>
            <span>${t.name}</span>
        `;

        btn.onclick = () => setTheme(t.id);
        els['theme-list'].appendChild(btn);
    });
}

function bindEvents() {
    els['source-lang'].onchange = (e) => {
        state.sourceLang = e.target.value;
        updateUI();
    };

    els['target-lang'].onchange = (e) => {
        state.targetLang = e.target.value;
        updateUI();
    };

    els['swap-btn'].onclick = () => {
        [state.sourceLang, state.targetLang] = [state.targetLang, state.sourceLang];
        els['source-lang'].value = state.sourceLang;
        els['target-lang'].value = state.targetLang;

        // Swap Text
        if (state.translatedText) {
            state.inputText = state.translatedText;
            state.translatedText = ''; // Clear result to re-translate or just show as input
            els['input-text'].value = state.inputText;
        }
        updateUI();
    };

    els['theme-btn'].onclick = (e) => {
        e.stopPropagation(); // prevent body click closing it immediately
        els['theme-menu'].classList.toggle('hidden');
    };

    document.body.onclick = () => {
        els['theme-menu'].classList.add('hidden');
    }

    els['input-text'].oninput = (e) => {
        state.inputText = e.target.value;
        updateUI();
    };

    els['clear-btn'].onclick = () => {
        state.inputText = '';
        state.translatedText = '';
        els['input-text'].value = '';
        updateUI();
        window.speechSynthesis.cancel();
    };

    els['trans-btn'].onclick = handleTranslate;

    els['play-btn'].onclick = () => handleSpeak(state.translatedText, state.targetLang);

    els['mic-btn'].onclick = toggleListening;
}

function setTheme(id) {
    document.body.className = `theme-${id}`;
    state.theme = id;
    initThemes(); // update active state
}

function showToast(msg) {
    els['toast'].textContent = msg;
    els['toast'].classList.remove('hidden');
    setTimeout(() => {
        els['toast'].classList.add('hidden');
    }, 3000);
}

/* Logic */
function updateUI() {
    const sourceUI = SOURCE_UI_TEXTS[state.sourceLang] || SOURCE_UI_TEXTS['en-US'];
    const targetUI = TARGET_UI_TEXTS[state.targetLang] || TARGET_UI_TEXTS['en-US'];

    // 1. Labels
    els['target-title'].textContent = targetUI.title;
    els['target-waiting'].textContent = targetUI.waiting;
    els['target-hint'].textContent = targetUI.hint;
    els['target-loading'].textContent = targetUI.loading;

    // 2. Input State
    if (state.isListening) {
        els['input-label-text'].textContent = sourceUI.listening;
        els['input-text'].placeholder = sourceUI.speak;
        els['input-card'].classList.add('listening');
        els['mic-btn'].classList.add('active');
        // change icon to stop? handled by style mainly
    } else {
        els['input-label-text'].textContent = sourceUI.label;
        els['input-text'].placeholder = sourceUI.placeholder;
        els['input-card'].classList.remove('listening');
        els['mic-btn'].classList.remove('active');
    }

    // 3. Result State
    if (state.isLoading) {
        setResultState('loading');
    } else if (state.translatedText) {
        setResultState('success');
        els['translated-text'].textContent = state.translatedText;
    } else {
        setResultState('waiting');
    }

    // 4. Buttons
    els['trans-btn'].disabled = !state.inputText || state.isLoading;
    els['play-btn'].disabled = !state.translatedText || state.isLoading;
    els['clear-btn'].classList.toggle('hidden', !state.inputText);

    // Re-render mic icon if needed based on state, but lucide.createIcons is static
    // We can switch innerHTML of svg, but simpler to just toggle class/style
    const micIcon = els['mic-btn'].querySelector('i') || els['mic-btn'].querySelector('svg');
    if (state.isListening && micIcon) {
        // micIcon.setAttribute('data-lucide', 'stop-circle'); // lucide dynamic replace is tricky without re-run
        // Simplest: just keep mic icon but animate it.
    }
}

function setResultState(s) {
    els['waiting-state'].classList.add('hidden');
    els['loading-state'].classList.add('hidden');
    els['success-state'].classList.add('hidden');

    if (s === 'waiting') els['waiting-state'].classList.remove('hidden');
    if (s === 'loading') els['loading-state'].classList.remove('hidden');
    if (s === 'success') els['success-state'].classList.remove('hidden');
}

/* API */
async function handleTranslate() {
    if (!state.inputText.trim()) return;

    state.isLoading = true;
    state.translatedText = '';
    updateUI();

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(state.inputText)}&langpair=${state.sourceLang}|${state.targetLang}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.responseStatus === 200) {
            state.translatedText = data.responseData.translatedText;
        } else {
            showToast('翻譯服務忙碌中，請稍後再試。');
            console.error(data);
        }
    } catch (e) {
        showToast('連線錯誤，請檢查網路。');
        console.error(e);
    } finally {
        state.isLoading = false;
        updateUI();
    }
}

/* Speech TTS */
function handleSpeak(text, lang) {
    if (!text) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;

    // Optional: visual feedback
    els['play-btn'].innerHTML = `<i data-lucide="loader-2" class="spin"></i> <span>播放</span>`;
    lucide.createIcons();

    u.onend = () => {
        resetPlayBtn();
    };
    u.onerror = () => {
        resetPlayBtn();
    };

    window.speechSynthesis.speak(u);
}

function resetPlayBtn() {
    els['play-btn'].innerHTML = `<i data-lucide="volume-2"></i> <span>播放</span>`;
    lucide.createIcons();
}

/* Speech STT */
let recognition = null;

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                }
            }
            if (final) {
                state.inputText = final;
                els['input-text'].value = final;
                // Auto translate? maybe not
                updateUI();
            }
        };

        recognition.onend = () => {
            state.isListening = false;
            updateUI();
        };

        recognition.onerror = (e) => {
            console.error(e);
            state.isListening = false;
            updateUI();
            if (e.error === 'not-allowed') showToast('請允許麥克風權限');
        };

    }
}

function toggleListening() {
    if (!recognition) {
        showToast('您的瀏覽器不支援語音輸入');
        return;
    }

    if (state.isListening) {
        recognition.stop();
        state.isListening = false;
    } else {
        recognition.lang = state.sourceLang;
        try {
            recognition.start();
            state.isListening = true;
        } catch (e) { console.error(e); }
    }
    updateUI();
}
