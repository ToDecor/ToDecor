# Configuration Google OAuth pour ToDecor

## Problème Actuel

Si vous voyez l'erreur **"Error 400: redirect_uri_mismatch"**, cela signifie que l'URI de redirection n'est pas correctement configuré dans Google Cloud Console.

## Solution: Configuration Google Cloud Console

### 1. Accéder à Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez ou sélectionnez un projet
3. Activez l'API Google+ (dans "APIs & Services" > "Library")

### 2. Créer des identifiants OAuth 2.0

1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Sélectionnez **Web application**

### 3. Configurer les URIs de redirection

Dans **Authorized redirect URIs**, ajoutez EXACTEMENT ces URLs:

\`\`\`
https://ouoqsnolzgmogqwijmdi.supabase.co/auth/v1/callback
\`\`\`

Pour le développement local (optionnel):
\`\`\`
http://localhost:54321/auth/v1/callback
\`\`\`

**IMPORTANT:** L'URL doit correspondre EXACTEMENT à celle de votre projet Supabase.

### 4. Récupérer les identifiants

Après la création, copiez:
- **Client ID**
- **Client Secret**

### 5. Configurer dans Supabase

1. Allez dans votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet ToDecor
3. Allez dans **Authentication** > **Providers**
4. Activez **Google**
5. Collez le **Client ID** et le **Client Secret**
6. Sauvegardez

### 6. Tester la connexion

1. Retournez sur votre site ToDecor
2. Cliquez sur "Se connecter"
3. Cliquez sur "Continuer avec Google"
4. La connexion devrait maintenant fonctionner

## Trouver l'URL de redirection de votre projet Supabase

Votre URL de redirection Supabase suit ce format:
\`\`\`
https://[VOTRE-PROJET-ID].supabase.co/auth/v1/callback
\`\`\`

Pour votre projet actuel:
\`\`\`
https://ouoqsnolzgmogqwijmdi.supabase.co/auth/v1/callback
\`\`\`

## Dépannage

### Erreur persiste après configuration

1. Vérifiez que l'URL dans Google Cloud Console est EXACTEMENT la même (pas d'espace, pas de slash final)
2. Attendez 5-10 minutes pour que les changements se propagent
3. Videz le cache de votre navigateur
4. Réessayez

### Besoin de désactiver temporairement Google OAuth

Si vous voulez désactiver Google OAuth en attendant:
1. Dans Supabase Dashboard > Authentication > Providers
2. Désactivez Google
3. OU demandez-moi de retirer le bouton du code

## Support

Si le problème persiste, vérifiez:
- Que l'API Google+ est activée
- Que les credentials OAuth sont du type "Web application"
- Que vous utilisez le bon Client ID et Client Secret dans Supabase
