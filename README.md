# board-nest

# Device Data Sync

Pour disposer des mêmes données sur plusieurs appareils, j'ai décidé d'utiliser [Convex](https://docs.convex.dev/home). Il se base pour cela sur une base de données Firestore hébergée sur Google Cloud. Par contre c'est un beau bordel, donc il faut expliquer un peu comment c'est configuré...

# Dépendances installées

Petite liste de l'utilité de chaque paquet, comme il y en a déjà un sacré nombre :
- tailwindcss : faciliter la personnalisation CSS de nos composants en indiquant des classes CSS directement dans les balises JSX (au lieu d'utiliser des fichiers à part) via le champ `className`
- nativewind : utiliser TailwindCSS dans React Native
- realm : base de données locale (avec possibilité de synchronisation avec un serveur MongoDB) pour React Native
- react-native-get-random-values : sécurise la génération de nombres aléatoires depuis les appareils mobiles
- react-native-countdown-circle-timer : afficher et configurer des timers
- react-native-dotenv : charger des variables d'environnement depuis un fichier `.env`
- @junipero/core : outils pour faciliter la manipulation d'Object Javascript (oui c'est maintenu par Poool)

## Sous-dépendances

- eslint-config-prettier: dépendance de `@react-native/eslint-config`
- eslint-plugin-ft-flow : dépendance de `@react-native/eslint-config`
- react-native-svg : dépendance de `react-native-countdown-circle-timer`

# Ressources web

## Icônes

Icônes au format 128x128 pour être affichés dans la liste de Parties.

## Sons

Les sons doivent être au format mp3 ou wav. Ils sont stockés dans le dossier `assets/sounds`.

# Variables d'environnement

Pour que l'app fonctionne, il faut configurer les variables d'environnement suivantes dans un fichier `.env` à la racine du projet :
- `EXPO_PUBLIC_CONVEX_URL` = URL de développement pour Convex

# Déploiement

Les étapes à suivre dépendant de l'environnement dans lequel vous souhaitez déployer l'application.

## Développement

Il faut déjà avoir fait toute la [configuration locale pour développer sur Android](https://reactnative.dev/docs/set-up-your-environment).

Pour développer l'application, il faut d'abord installer les dépendances NPM :

```bash
yarn install
```

Ensuite, compilez l'application pour Android :

```bash
yarn build:android
```

Lancer un émulateur Android ou un appareil physique.

Lors du développement, on lance un serveur de développement Expo qui va nous permettre de tester l'application sur un appareil mobile ou un émulateur. On peut activer des fonctions de débogage, de rechargement à chaud, etc.

```bash
yarn start
```

> Si vous n'avez pas encore installé les dépendances NPM : `yarn install`

Appuyer sur "a" lorsque le serveur Metro est lancé pour déployer l'application sur l'émulateur/l'appareil Android.

# Tir aux troubles


# Liens utiles

- [Recherche de sons mp3](https://pixabay.com/fr/sound-effects/search/)
