# Guide de Configuration Admin - ToDecor

## 1. Accès au Dashboard Admin

Le dashboard admin est accessible à l'URL suivante:
\`\`\`
https://votre-site.vercel.app/admin
\`\`\`

## 2. Exécution des Scripts SQL (IMPORTANT)

Avant de créer votre compte admin, vous devez exécuter les scripts SQL dans cet ordre exact:

1. **scripts/001_create_tables.sql** - Crée toutes les tables et RLS policies de base
2. **scripts/002_seed_products.sql** - Ajoute des produits d'exemple
3. **scripts/003_admin_policies.sql** - Ajoute les policies admin initiales
4. **scripts/004_fix_rls_policies.sql** - ⚠️ CRITIQUE - Corrige l'erreur de récursion infinie

> **Note**: Le script 004 est essentiel pour éviter l'erreur "infinite recursion detected in policy for relation profiles". Il crée une fonction `is_admin()` qui empêche les boucles circulaires dans les RLS policies.

## 3. Création d'un Compte Administrateur

### Étape 1: Créer un compte utilisateur

1. Allez sur la page d'inscription: `/auth/sign-up`
2. Créez un compte avec votre email et mot de passe
3. Vérifiez votre email (un email de confirmation sera envoyé)

### Étape 2: Promouvoir le compte en administrateur

Vous devez vous connecter à votre base de données Supabase et promouvoir manuellement votre compte en administrateur.

#### Via l'interface Supabase:

1. Allez sur [https://supabase.com](https://supabase.com)
2. Ouvrez votre projet ToDecor
3. Cliquez sur "Table Editor" dans le menu de gauche
4. Sélectionnez la table `profiles`
5. Trouvez votre profil (utilisez votre email pour le chercher)
6. Modifiez la colonne `is_admin` et mettez la valeur à `TRUE`
7. Cliquez sur "Save"

#### Via SQL Editor:

1. Allez sur [https://supabase.com](https://supabase.com)
2. Ouvrez votre projet ToDecor
3. Cliquez sur "SQL Editor" dans le menu de gauche
4. Exécutez cette requête SQL (remplacez `votre-email@exemple.com` par votre email):

\`\`\`sql
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'votre-email@exemple.com'
);
\`\`\`

### Étape 3: Se connecter au dashboard

1. Retournez sur votre site
2. Allez sur `/auth/login`
3. Connectez-vous avec vos identifiants
4. Accédez au dashboard admin: `/admin`

## 4. Fonctionnalités du Dashboard Admin

### Gestion des Produits (`/admin/produits`)
- Créer de nouveaux produits
- Modifier les produits existants
- Supprimer des produits
- Gérer le stock

### Gestion des Commandes (`/admin/commandes`)
- Voir toutes les commandes
- Changer le statut des commandes (en attente → confirmée → en cours → livrée)
- Voir les détails de chaque commande

### Gestion des Factures (`/admin/factures`)
- Consulter toutes les factures générées
- Télécharger les factures

### Messages Clients (`/admin/messages`)
- Voir tous les messages de contact
- Marquer les messages comme lus
- Supprimer les messages

### Paramètres du Site (`/admin/parametres`)
- **Marque**: Modifier le nom du site et l'URL du logo
- **Couleurs**: Personnaliser la palette de couleurs (primaire, secondaire, accent)
- **Contact**: Mettre à jour le téléphone, l'email et l'adresse
- **Réseaux Sociaux**: Ajouter les liens Facebook, Instagram, LinkedIn

> **Note**: Les modifications des paramètres sont appliquées immédiatement sur tout le site web.

## 5. Sécurité

- Tous les accès admin sont protégés par authentification
- Les règles RLS (Row Level Security) de Supabase empêchent les accès non autorisés
- Seuls les utilisateurs avec `is_admin = TRUE` peuvent accéder au dashboard admin

## 6. Dépannage

### Erreur "infinite recursion detected"
- **Symptôme**: Erreur 500 lors de l'accès à `/dashboard` ou `/admin`
- **Cause**: Les RLS policies admin créent une boucle circulaire
- **Solution**: Exécutez le script `scripts/004_fix_rls_policies.sql` dans l'éditeur SQL Supabase
- Ce script crée une fonction `public.is_admin()` avec `SECURITY DEFINER` qui empêche la récursion

### Je ne peux pas accéder au dashboard admin malgré is_admin = TRUE
- **Vérifiez les logs de debug**: Ouvrez la console de votre navigateur (F12) et regardez les messages `[v0]`
- **Déconnectez-vous complètement**: Allez sur `/auth/logout` puis reconnectez-vous
- **Vérifiez dans Supabase**: Exécutez `SELECT id, email, is_admin FROM profiles;` pour confirmer que is_admin est TRUE
- **Exécutez le script 004**: Assurez-vous que `scripts/004_fix_rls_policies.sql` a bien été exécuté

### Les modifications ne s'appliquent pas
- Vérifiez que tous les scripts SQL ont bien été exécutés dans l'ordre
- Assurez-vous que les politiques RLS sont actives

### Erreurs de permissions
- Vérifiez que le script `003_admin_policies.sql` a bien été exécuté dans Supabase
- Assurez-vous que le script `004_fix_rls_policies.sql` a été exécuté après le script 003

## 7. Configuration OAuth Google (Optionnel)

Si vous souhaitez activer l'authentification Google pour vos clients :

### Étape 1: Configuration dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez "Google+ API"
4. Allez dans "Credentials" → "Create Credentials" → "OAuth client ID"
5. Sélectionnez "Web application"
6. Ajoutez les URLs autorisées :
   - **Authorized JavaScript origins**: `https://votre-domaine.com`
   - **Authorized redirect URIs**: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Étape 2: Configuration dans Supabase

1. Allez dans votre Dashboard Supabase
2. Cliquez sur "Authentication" → "Providers"
3. Trouvez "Google" dans la liste des providers
4. Activez Google
5. Copiez le **Client ID** et **Client Secret** depuis Google Cloud Console
6. Collez-les dans les champs correspondants dans Supabase
7. Cliquez sur "Save"

### Étape 3: Testez la connexion

1. Allez sur `/auth/login` ou `/auth/sign-up`
2. Cliquez sur "Continuer avec Google"
3. Vous serez redirigé vers Google pour autoriser l'accès
4. Après autorisation, vous serez redirigé vers votre application (dashboard)

> **Note**: L'authentification Google crée automatiquement un profil utilisateur dans votre base de données. Les utilisateurs OAuth ont accès aux mêmes fonctionnalités que les utilisateurs email/password.

### URLs de callback importantes:
- **Production**: `https://votre-domaine.com/auth/callback`
- **Development**: Le callback est géré automatiquement via `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
