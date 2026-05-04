// ================================================
// 🔧 CONFIGURATION — Clés Supabase
// ================================================
const SUPABASE_URL  = 'https://sjhgcecaysuevtfzasls.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGdjZWNheXN1ZXZ0Znphc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTM3MTUsImV4cCI6MjA5MzQyOTcxNX0.Isw-tikrBUAMPf3JpoIEj2YHm2mGYHw3YAaiPP-ps2g'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  }
})

// ---- Helpers auth ----
async function getUser() {
  const { data: { user } } = await db.auth.getUser()
  return user
}

async function getProfile(userId) {
  const { data } = await db.from('profiles').select('*').eq('id', userId).single()
  return data
}

// Utilise getSession() (lecture du localStorage, instantané)
// plutôt que getUser() qui fait un appel réseau et peut arriver
// avant que la session soit restaurée → boucle de redirections
async function requireAuth() {
  const { data: { session } } = await db.auth.getSession()

  if (!session) {
    window.location.href = 'login.html'
    return null
  }

  const profile = await getProfile(session.user.id)
  if (!profile) {
    await db.auth.signOut()
    window.location.href = 'login.html'
    return null
  }

  return { user: session.user, profile }
}

// ---- Bristol ----
const BRISTOL_EMOJI = { 1:'🪨', 2:'🫘', 3:'🌽', 4:'🍌', 5:'🥕', 6:'💦', 7:'🌊' }
const BRISTOL_SCORE = { 1:'C', 2:'B', 3:'A', 4:'A+', 5:'A', 6:'B', 7:'D' }
const BRISTOL_DESC  = {
  1:'Dure, séparée — boire plus !',
  2:'Boudinée — un peu dure',
  3:'Craquelée — presque parfait',
  4:'Banane lisse — PARFAIT 🏆',
  5:'Morceaux mous — ok',
  6:'Mou, étalé — surveille',
  7:'Liquide — attention !'
}
const MEAL_LABELS = { petit_dej:'🌅 Petit-déj', dejeuner:'☀️ Déjeuner', diner:'🌙 Dîner', snack:'⚡ Snack' }
