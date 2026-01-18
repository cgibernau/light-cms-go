# CMS Light Blog

Generador de blog estàtic minimalista amb validació robusta. Escriu en Markdown, genera HTML.

## Característiques

- Escriu posts en Markdown amb frontmatter YAML
- Sistema draft/published (els drafts no es publiquen)
- Validació automàtica de frontmatter amb errors clars
- Ordenació cronològica automàtica (més recent primer)
- HTML estàtic generat (cap servidor necessari)
- Suport per imatges locals i externes
- Sincronització automàtica: elimina posts antics quan borres arxius

## Instal·lació

```bash
npm install
```

## Ús

### Crear un post

Crea un fitxer `.md` a `content/`:

```markdown
---
title: El meu article
date: 2026-01-14
status: published
---

Contingut en **Markdown**.
```

### Generar el blog

```bash
# Genera els fitxers HTML a public/
npm run build

# Genera i obre al navegador
npm run dev
```

## Format dels posts

Cada post necessita frontmatter YAML **vàlid**:

```yaml
---
title: Títol del post       # Obligatori (text)
date: 2026-01-14           # Obligatori (format YYYY-MM-DD)
status: published          # Obligatori ("draft" o "published")
---
```

### Validació automàtica

El generador valida:
- `title`: Ha de ser text
- `date`: Format `YYYY-MM-DD` vàlid
- `status`: Només accepta "draft" o "published"

Si hi ha errors, el build falla amb missatges clars indicant què cal corregir.

### Status

- `status: published` → El post apareix al blog
- `status: draft` → El post NO apareix (útil per treballs en curs)

## Imatges

**Locals**: Posa-les a `content/images/`
```markdown
![Descripció](../images/foto.jpg)
```

**Externes**:
```markdown
![Descripció](https://exemple.com/foto.jpg)
```

## Estructura

```
cms-light-blog/
├── content/          # Posts en Markdown (.md)
│   ├── primer-post.md
│   ├── draft.md
│   └── images/      # Imatges locals
├── public/          # HTML generat (output)
│   ├── index.html
│   ├── posts/
│   └── images/
└── build.js         # Script de generació
```

**Important**: Cada cop que executes `npm run build`, la carpeta `public/` es regenera completament. Els posts eliminats de `content/` desapareixen automàticament de `public/`.

## Personalització

Edita les funcions a `build.js`:
- `generateIndex()`: Pàgina d'inici amb llista de posts
- `generatePost()`: Plantilla d'articles individuals
- `sharedStyles`: Estils CSS compartits
- `getHeader()` / `getFooter()`: Capçalera i peu de pàgina

## Dependències

- [marked](https://marked.js.org/): Conversor Markdown a HTML
- [gray-matter](https://github.com/jonschlinkert/gray-matter): Parser de frontmatter YAML

## Deploy a Vercel

1. Puja el codi a GitHub
2. Importa el projecte a [vercel.com](https://vercel.com)
3. Vercel detecta automàticament la configuració (`vercel.json`)

El blog es regenera automàticament en cada push a GitHub.

## Deploy alternatiu

`public/` conté HTML estàtic pur. Funciona a qualsevol hosting:
- **GitHub Pages**: Gratuït
- **Netlify**: Deploy automàtic
- **Servidor web**: Nginx, Apache, etc.

## Robustesa

El CMS inclou:
- ✅ Validació completa de frontmatter
- ✅ Manejo d'errors amb missatges clars
- ✅ Un post amb errors no trenca el build complet
- ✅ Verificació de carpetes i arxius
- ✅ Regeneració completa per evitar inconsistències

## Llicència

MIT
