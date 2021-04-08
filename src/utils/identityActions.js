import netlifyIdentity from "netlify-identity-widget";

export function loginUser() {
    console.log("NEW USER");
    console.log(netlifyIdentity);
    console.log(netlifyIdentity.currentUser());
    if (netlifyIdentity && netlifyIdentity.currentUser()) {
        console.log(netlifyIdentity);
        const {
            app_metadata, created_at, confirmed_at, email, id, user_metadata
        } = netlifyIdentity.currentUser();

        localStorage.setItem(
            "currentOpenSaucedUser",
            JSON.stringify({...app_metadata, created_at, confirmed_at, email, id, ...user_metadata})
        );
    }
}

export function logoutUser() {
    localStorage.removeItem("currentOpenSaucedUser");
}