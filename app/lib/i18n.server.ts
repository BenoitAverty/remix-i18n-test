import {Backend, Language, RemixI18Next} from "remix-i18next";

const translations: { [key: string]: { [key: string]: { [key: string]: string } } } = {
    en: {
        common: {
            "welcome-msg": "Welcome to a translated remix app !",
            "generated-date-msg": "This page was rendered at {{date}}"
        },
        users: {
            "users-title": "Users",
            "users-backlink": "Go to home"
        },
        usersIndex: {
            "users-index-msg": "Please select a user or go to <1>home</1>"
        },
        userDetails: {
            "users-details-msg": "If you reverse {{name}}, you get {{reverse}}"
        }
    },
    fr: {
        common: {
            "welcome-msg": "Bienvenue sur une app Remix traduite !",
            "generated-date-msg": "Cette page a été générée à {{date}}"
        },
        users: {
            "users-title": "Utilisateurs",
            "users-backlink": "Retourner à l'accueil"
        },
        usersIndex: {
            "users-index-msg": "Merci de sélectionner un utilisateur ou retourner <1>à l'accueil</1>"
        },
        userDetails: {
            "users-details-msg": "Si on inverse {{name}}, on obtient {{reverse}}"
        }
    }
}

let backend: Backend = {
    async getTranslations(namespace, locale): Promise<Language> {
        console.log("slowly getting translations for", namespace, locale)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        console.log("done")
        return translations[locale][namespace];
    }
}

export let i18n = new RemixI18Next(backend, {
    fallbackLng: "en", // here configure your default (fallback) language
    supportedLanguages: ["en", "fr"], // here configure your supported languages
});