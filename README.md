# 💪 FitCouple — Anna & Nico

Site web installable sur iPhone et Samsung. Zéro framework, zéro build, juste des fichiers HTML.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.html` | Dashboard principal |
| `login.html` | Connexion / Inscription |
| `repas.html` | Calendrier des repas |
| `sport.html` | Défis sport |
| `caca.html` | Journal Bristol 💩 |
| `objectifs.html` | Objectifs & Streaks |
| `style.css` | Tout le CSS |
| `config.js` | ⚠️ Tes clés Supabase ici |
| `schema.sql` | À coller dans Supabase |

---

## 🚀 Mise en ligne en 3 étapes

### 1. Supabase (base de données)

1. Va sur [supabase.com](https://supabase.com) → **New Project**
2. Attends 2 min que le projet crée
3. Va dans **SQL Editor** → colle le contenu de `schema.sql` → **Run**
4. Va dans **Project Settings** → **API** → copie :
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public key** → la longue clé `eyJ...`

### 2. Colle tes clés dans config.js

Ouvre `config.js` et remplace les 2 lignes :
```js
const SUPABASE_URL  = 'https://VOTRE_PROJECT_ID.supabase.co'
const SUPABASE_ANON = 'VOTRE_ANON_KEY'
```

### 3. Vercel (hébergement gratuit)

**Option A — Drag & Drop (le plus simple) :**
1. Va sur [vercel.com](https://vercel.com) → crée un compte
2. Depuis le dashboard → **Add New** → **Project**
3. Clique sur **"Deploy from template"** ou glisse-dépose le dossier
4. Tu obtiens une URL genre `fitcouple-xxx.vercel.app`

**Option B — Via GitHub :**
1. Crée un repo GitHub, upload les fichiers
2. Connecte le repo à Vercel → Deploy automatique

### 4. Auth Supabase

Dans Supabase → **Authentication** → **URL Configuration** :
- **Site URL** : ton URL Vercel
- **Redirect URLs** : ton URL Vercel + `/**`

---

## 👤 Créer vos comptes

1. Va sur ton URL Vercel
2. Anna s'inscrit → prénom `Anna`, code couple : `anna-et-nico`
3. Nico s'inscrit → prénom `Nico`, code couple : `anna-et-nico` (le même !)
4. Vérifier les emails → se connecter

---

## 📱 Installer comme une vraie app

**iPhone (Safari) :** Partager → "Sur l'écran d'accueil"
**Samsung (Chrome) :** Menu ⋮ → "Ajouter à l'écran d'accueil"
