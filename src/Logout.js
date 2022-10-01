
export default function logout() {
    localStorage.removeItem('token');
    if (!window.location.hash) {
        window.location = window.location + '#';
        window.location.reload();
    }
}
