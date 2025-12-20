// Supabase Auth Helper - Creates the ONE supabase client
// This runs FIRST and makes supabase available globally

const SUPABASE_URL = 'https://bjjpfvlcwarloxigoytl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqanBmdmxjd2FybG94aWdveXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODgyNjcsImV4cCI6MjA4MTY2NDI2N30.cIVZG4D3-SK0qJp_TgcVBO848negG6bXRCSuHk5Motk';

// Create supabase client ONCE and store on window object
if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Use the global client
const supabase = window.supabaseClient;

// Check if user is authenticated
async function requireAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    
    return session;
}

// Get current user data
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Get user's subscription tier
function getUserTier(user) {
    if (!user) return 'free';
    return user.user_metadata?.tier || 'free';
}

// Sign out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    }
}

// Fetch with authentication token
async function fetchWithAuth(url, options = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = 'login.html';
    }
});