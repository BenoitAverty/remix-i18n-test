import {Language} from "../remix-i18next";

const translations: { [key: string]: { [key: string]: { [key: string]: string } } } = {
    en: {
        common: {
            "welcome-msg": "Welcome to a translated remix app !",
            "generated-date-msg": "This page was rendered at {{date}}"
        },
        users: {
            "users-title": "Users",
            "users-backlink": "Go to <1>home</1>."
        },
        usersIndex: {
            "users-index-msg": "Please select a user or go to <1>home</1>"
        },
        userDetails: {
            "users-details-msg": "If you reverse {{name}}, you get {{reverse}}"
        },
        fake: {
            "fake": "fake"
        }
    },
    fr: {
        common: {
            "welcome-msg": "Bienvenue sur une app Remix traduite !",
            "generated-date-msg": "Cette page a été générée à {{date}}"
        },
        users: {
            "users-title": "Utilisateurs",
            "users-backlink": "Retourner à <1>l'accueil</1>."
        },
        usersIndex: {
            "users-index-msg": "Merci de sélectionner un utilisateur ou retourner <1>à l'accueil</1>"
        },
        userDetails: {
            "users-details-msg": "Si on inverse {{name}}, on obtient {{reverse}}"
        },
        fake: {
            "fake": "faux"
        }
    }
}

export const backend = {
    getTranslations(language: string, namespace: string): Promise<Language> {
        return new Promise(resolve => {
            console.log("slowly getting translations for", language, namespace)
            setTimeout(() => {
                console.log("done")
                resolve(translations[language][namespace]);
            }, 3000);  
        })
    }
} 
    
    