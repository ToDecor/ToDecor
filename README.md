# ToDecor - Plateforme E-commerce Premium

Plateforme e-commerce complète pour la vente de revêtements de sols et murs en Tunisie.

## Fonctionnalités

### Client
- Catalogue de produits avec recherche et filtrage
- Pages produits avec zoom d'images (desktop et mobile)
- Panier d'achat persistant
- Processus de checkout complet
- Dashboard client avec historique de commandes
- Téléchargement de factures
- Témoignages clients dynamiques
- Animations au scroll
- Formulaire de contact

### Administrateur
- Dashboard avec statistiques en temps réel
- Gestion complète des produits (CRUD avec **upload d'images depuis appareil**)
- Gestion des commandes avec suivi de statut et génération de factures
- Gestion des messages clients
- Gestion des témoignages clients
- Paramètres du site web complets (couleurs, **logo uploadable**, contacts, réseaux sociaux, statistiques, section À propos)
- Configuration des **images de catégories uploadables depuis appareil**

## Installation

### 1. Exécuter les Scripts SQL

Dans l'ordre, exécutez ces scripts dans votre console SQL Supabase:

1. `scripts/001_create_tables.sql` - Crée toutes les tables
2. `scripts/002_seed_products.sql` - Ajoute des produits de test
3. `scripts/003_admin_policies.sql` - Configure les politiques RLS pour admin
4. **`scripts/004_fix_rls_policies.sql`** - ⚠️ IMPORTANT - Corrige l'erreur de récursion infinie dans les RLS policies
5. `scripts/005_website_settings.sql` - Ajoute la table des paramètres du site web
6. `scripts/006_fix_orders_profiles_relationship.sql` - Corrige la relation entre commandes et profils
7. **`scripts/007_comprehensive_fix.sql`** - ⚠️ IMPORTANT - Correction complète avec stats, catégories et témoignages
8. `scripts/008_add_product_reference.sql` - Ajoute le champ référence et popularité aux produits
9. **`scripts/009_add_about_settings.sql`** - Ajoute les champs de configuration pour la section À propos
10. **`scripts/010_fix_order_items_rls.sql`** - ⚠️ CRITIQUE - Permet aux clients de créer des commandes
11. **`scripts/011_setup_storage.sql`** - ⚠️ NOUVEAU - Configure Supabase Storage pour les uploads d'images
12. **`scripts/012_add_testimonial_insert_policy.sql`** - ⚠️ NOUVEAU - Permet aux clients de soumettre des témoignages

> **Important**: Les scripts 004, 007, 009, 010, 011 et **012** sont essentiels pour le bon fonctionnement du site. Le script 011 active les uploads d'images depuis les appareils et le script 012 permet aux clients de soumettre des témoignages.

### 2. Créer un Compte Admin

Consultez le fichier `ADMIN_SETUP.md` pour les instructions détaillées.

Résumé rapide:
1. Créez un compte via `/auth/sign-up`
2. Dans Supabase, mettez `is_admin = TRUE` sur votre profil
3. Connectez-vous et accédez à `/admin`

## URLs Importantes

### Frontend Public
- **Site principal**: `/`
- **Catalogue**: `/produits`
- **Connexion**: `/auth/login`
- **Inscription**: `/auth/sign-up`
- **Dashboard Client**: `/dashboard`

### Admin (nécessite is_admin=true)
- **Dashboard**: `/admin`
- **Produits**: `/admin/produits`
- **Commandes**: `/admin/commandes`
- **Factures**: `/admin/factures`
- **Messages**: `/admin/messages`
- **Témoignages**: `/admin/temoignages`
- **Galerie**: `/admin/gallery`
- **Paramètres**: `/admin/parametres`

## Personnalisation du Site

Accédez à `/admin/parametres` pour personnaliser:

### Onglet Marque
- Nom du site
- URL du logo

### Onglet Couleurs
- Couleur primaire
- Couleur secondaire
- Couleur d'accent

### Onglet Contact
- Téléphone
- Email
- Adresse

### Onglet Réseaux
- Facebook
- Instagram
- LinkedIn

### Onglet Contenu
- **Statistiques**: Nombre de clients satisfaits, années d'expérience, projets réalisés
- **Images des catégories**: Sols, Murs, Accessoires
- **Section À propos**: Titre et deux paragraphes de description personnalisables

## Technologies

- **Framework**: Next.js 16 avec App Router
- **Base de données**: Supabase (PostgreSQL)
- **Authentification**: Supabase Auth
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Animations**: Intersection Observer API
- **Langue**: Français
- **Devise**: Dinar Tunisien (DT)

## Fonctionnalités Premium

- **Upload d'images depuis appareil** pour produits, logo et catégories
- Zoom d'images produits (tactile et souris)
- Barre de recherche dans le header
- Animations au scroll sur toute la page
- Statistiques dynamiques configurables
- Témoignages clients en temps réel depuis la base de données
- Catégories avec images personnalisables
- Section À propos entièrement éditable depuis l'admin
- Produits populaires configurables
- Gestion complète du thème depuis l'admin
- Row Level Security (RLS) pour la sécurité des données
- **Supabase Storage** pour hébergement sécurisé des images

## Support

Pour toute question ou problème:
1. Consultez `ADMIN_SETUP.md` pour les questions d'administration
2. Vérifiez que tous les scripts SQL sont exécutés dans l'ordre (surtout 004, 007, 008 et 009)
3. Vérifiez les logs de la console pour les erreurs `[v0]`
4. Assurez-vous que votre compte a `is_admin = TRUE` dans la table profiles
