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
    storageKey: 'fitcouple-auth',
  }
})

async function getProfile(userId) {
  const { data } = await db.from('profiles').select('*').eq('id', userId).single()
  return data
}

// Attend que Supabase restaure la session via onAuthStateChange
// C'est la seule méthode fiable — getSession/getUser peuvent
// retourner null avant que le token soit restauré depuis localStorage
function requireAuth() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      window.location.replace('login.html')
    }, 5000)

    const { data: { subscription } } = db.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        if (event === 'SIGNED_OUT' || event === 'INITIAL_SESSION') {
          clearTimeout(timeout)
          subscription.unsubscribe()
          window.location.replace('login.html')
        }
        return
      }

      clearTimeout(timeout)
      subscription.unsubscribe()

      const profile = await getProfile(session.user.id)
      if (!profile) {
        await db.auth.signOut()
        window.location.replace('login.html')
        return
      }

      resolve({ user: session.user, profile })
    })
  })
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
