const db = {
    init() {
        if (!localStorage.getItem('recipes_v14')) {
            const initial = [
                { id: 1, title: "פסטה רוזה איטלקית", time: "20 דק'", ingredients: "פסטה, שמנת, רסק עגבניות, שום", method: "מבשלים פסטה. מטגנים שום עם רסק ושמנת. מערבבים הכל יחד.", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300", color: "#e67e22" },
                { id: 2, title: "סלט יווני עשיר", time: "10 דק'", ingredients: "עגבניה, מלפפון, פטה, זיתים", method: "חותכים ירקות לקוביות. מוסיפים גבינה וזיתים מעל.", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300", color: "#27ae60" },
                { id: 3, title: "שקשוקה של בוקר", time: "25 דק'", ingredients: "ביצים, עגבניות, פלפל חריף", method: "מבשלים רוטב עגבניות סמיך. מוסיפים ביצים ומכסים.", img: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=300", color: "#c0392b" },
                { id: 4, title: "פנקייק שוקולד", time: "15 דק'", ingredients: "קמח, חלב, סוכר, שוקולד", method: "מערבבים לבלילה חלקה. מטגנים במחבת משומנת.", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7444?w=300", color: "#f1c40f" },
                { id: 5, title: "אסאדו בתנור", time: "4 שעות", ingredients: "בשר אסאדו, יין אדום, תפוחי אדמה", method: "צולים בבישול איטי בתנור עד שהבשר מתפרק.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300", color: "#8e44ad" },
                { id: 6, title: "סושי סלמון", time: "50 דק'", ingredients: "אורז סושי, אצה, סלמון", method: "מניחים אורז על אצה, מוסיפים דג ומגלגלים.", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300", color: "#2c3e50" },
                { id: 7, title: "מרק בטטה", time: "40 דק'", ingredients: "בטטה, בצל, גזר, שמנת", method: "מבשלים ירקות עד ריכוך וטוחנים למרק חלק.", img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300", color: "#d35400" },
                { id: 8, title: "המבורגר ביתי", time: "30 דק'", ingredients: "בשר בקר, לחמניה, ירקות", method: "יוצרים קציצות וצולים על אש גבוהה.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300", color: "#34495e" }
            ];
            localStorage.setItem('recipes', JSON.stringify(initial));
            localStorage.setItem('users', JSON.stringify([{ user: "admin", pass: "1234" }]));
            localStorage.setItem('recipes_v14', 'true');
        }
    },
    getData(key) { return JSON.parse(localStorage.getItem(key)); },
    saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
};

const auth = {
    login() {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        const users = db.getData('users');
        const user = users.find(x => x.user === u && x.pass === p);
        if (user) { ui.showView('recipes-screen'); ui.renderRecipes(); }
        else alert("שם משתמש או סיסמה שגויים");
    },
    register() {
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;
        if (!u || !p) return alert("מלא את כל השדות");
        let users = db.getData('users');
        users.push({ user: u, pass: p });
        db.saveData('users', users);
        alert("נרשמת בהצלחה! עכשיו התחבר.");
        ui.toggleAuthMode(false);
    }
};

const ui = {
    showView(id) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
        if (id === 'settings-screen') this.populateVoiceList();
    },
    toggleAuthMode(isSignUp) {
        document.getElementById('auth-title').innerText = isSignUp ? "יצירת חשבון" : "התחברות";
        document.getElementById('login-actions').classList.toggle('hidden', isSignUp);
        document.getElementById('signup-actions').classList.toggle('hidden', !isSignUp);
    },
    updateDelayLabel(v) { document.getElementById('delay-value').innerText = v; },
    renderRecipes() {
        const container = document.getElementById('recipes-container');
        const query = document.getElementById('search').value.toLowerCase();
        const recipes = db.getData('recipes');
        container.innerHTML = recipes.filter(r => r.title.toLowerCase().includes(query)).map(r => `
            <div class="recipe-card" onclick="ui.showRecipe(${r.id})">
                <img src="${r.img}" class="recipe-thumb">
                <div>
                    <h3 style="margin:0">${r.title}</h3>
                    <small style="color:#7f8c8d"><i class="far fa-clock"></i> ${r.time}</small>
                </div>
            </div>
        `).join('');
    },
    showRecipe(id) {
        const r = db.getData('recipes').find(x => x.id === id);
        document.getElementById('recipe-title').innerText = r.title;
        document.getElementById('recipe-time-tag').innerText = r.time;
        document.getElementById('recipe-ingredients').innerText = r.ingredients;
        document.getElementById('recipe-method').innerText = r.method;
        document.getElementById('detail-header-bg').style.background = r.color;
        this.showView('detail-screen');
    },
    saveNewRecipe() {
        const title = document.getElementById('new-title').value;
        const time = document.getElementById('new-time').value;
        if (!title || !time) return alert("מלא שם וזמן");
        const recipes = db.getData('recipes');
        recipes.push({ id: Date.now(), title, time, ingredients: document.getElementById('new-ingredients').value, method: document.getElementById('new-method').value, img: "https://images.unsplash.com/photo-1495195129352-aec325a55b65?w=200", color: "#e67e22" });
        db.saveData('recipes', recipes);
        this.renderRecipes(); this.showView('recipes-screen');
    },
    populateVoiceList() {
        const select = document.getElementById('voice-select');
        const voices = window.speechSynthesis.getVoices();
        const sorted = [...voices].sort((a,b) => (a.lang.includes('he') ? -1 : 1));
        select.innerHTML = sorted.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
    }
};

const speech = {
    synth: window.speechSynthesis,
    isSpeaking: false,
    toggle() {
        if (this.isSpeaking) { this.synth.cancel(); this.isSpeaking = false; document.getElementById('speak-btn').innerHTML = '<i class="fas fa-volume-up"></i> הקרא מתכון'; }
        else {
            this.isSpeaking = true;
            document.getElementById('speak-btn').innerHTML = '<i class="fas fa-stop"></i> עצור';
            const text = "המצרכים הם: " + document.getElementById('recipe-ingredients').innerText + ". אופן ההכנה: " + document.getElementById('recipe-method').innerText;
            const lines = text.split(/[.!?\n]/).filter(l => l.trim().length > 0);
            this.speakLines(lines, 0);
        }
    },
    speakLines(lines, index) {
        if (index >= lines.length || !this.isSpeaking) { this.isSpeaking = false; document.getElementById('speak-btn').innerHTML = '<i class="fas fa-volume-up"></i> הקרא מתכון'; return; }
        const ut = new SpeechSynthesisUtterance(lines[index]);
        ut.lang = 'he-IL';
        const v = this.synth.getVoices().find(v => v.name === document.getElementById('voice-select').value);
        if (v) ut.voice = v;
        ut.onend = () => { 
            const d = parseInt(document.getElementById('delay-range').value) * 1000;
            setTimeout(() => { if(this.isSpeaking) this.speakLines(lines, index + 1); }, d); 
        };
        this.synth.speak(ut);
    }
};

db.init();
window.speechSynthesis.onvoiceschanged = () => ui.populateVoiceList();