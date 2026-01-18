import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Components compartits
const sharedStyles = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #fafafa;
        }
        .site-header {
            border-bottom: 3px solid #333;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }
        .site-header h1 {
            font-size: 2rem;
            margin-bottom: 0.25rem;
        }
        .site-header h1 a {
            color: #333;
            text-decoration: none;
        }
        .site-header h1 a:hover {
            color: #0066cc;
        }
        .site-header .subtitle {
            color: #666;
            font-size: 0.95rem;
        }
        .site-footer {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 0.9rem;
        }
        .site-footer a {
            color: #0066cc;
            text-decoration: none;
        }
        .site-footer a:hover {
            text-decoration: underline;
        }
`;

function getHeader(isHomePage = false) {
  if (isHomePage) {
    return `    <header class="site-header">
        <h1>El meu Blog</h1>
        <p class="subtitle">Pensaments i articles</p>
    </header>`;
  }
  return `    <header class="site-header">
        <h1><a href="../index.html">El meu Blog</a></h1>
        <p class="subtitle">Pensaments i articles</p>
    </header>`;
}

function getFooter() {
  return `    <footer class="site-footer">
        <p>Generat amb CMS Light Blog · <a href="../index.html">Inici</a></p>
    </footer>`;
}

// Funcions
function validatePost(file, data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string') {
    errors.push('title és obligatori i ha de ser text');
  }

  if (!data.date) {
    errors.push('date és obligatori');
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push(`date té format invàlid: "${data.date}" (usa YYYY-MM-DD)`);
    }
  }

  if (!data.status) {
    errors.push('status és obligatori');
  } else if (data.status !== 'draft' && data.status !== 'published') {
    errors.push(`status ha de ser "draft" o "published", no "${data.status}"`);
  }

  if (errors.length > 0) {
    throw new Error(`❌ Error a ${file}:\n  - ${errors.join('\n  - ')}`);
  }
}

function loadPosts(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  const posts = [];
  const errors = [];

  for (const file of files) {
    try {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: markdown } = matter(content);

      // Validar frontmatter
      validatePost(file, data);

      posts.push({
        title: data.title,
        date: new Date(data.date),
        status: data.status,
        slug: path.basename(file, '.md'),
        markdown,
        html: marked(markdown)
      });
    } catch (error) {
      errors.push({ file, error: error.message });
    }
  }

  // Mostrar tots els errors al final
  if (errors.length > 0) {
    console.error('\n❌ Errors trobats en els posts:\n');
    errors.forEach(({ file, error }) => {
      console.error(`📄 ${file}`);
      console.error(`   ${error}\n`);
    });
    process.exit(1);
  }

  return posts;
}

function generateIndex(posts) {
  try {
    const html = `<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>El meu Blog</title>
    <style>
${sharedStyles}
        .post-list { list-style: none; }
        .post-item {
            background: white;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .post-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
        .post-item h2 { margin-bottom: 0.5rem; }
        .post-item h2 a { color: #333; text-decoration: none; }
        .post-item h2 a:hover { color: #0066cc; }
        .post-date { color: #666; font-size: 0.9rem; }
    </style>
</head>
<body>
${getHeader(true)}

    <main>
        <ul class="post-list">
            ${posts.map(post => `
            <li class="post-item">
                <h2><a href="posts/${post.slug}.html">${post.title}</a></h2>
                <time class="post-date" datetime="${formatDateISO(post.date)}">
                    ${formatDate(post.date)}
                </time>
            </li>
            `).join('')}
        </ul>
    </main>

${getFooter()}
</body>
</html>`;

    fs.writeFileSync('public/index.html', html);
  } catch (error) {
    console.error('❌ Error generant index.html:', error.message);
    process.exit(1);
  }
}

function generatePost(post) {
  try {
    const html = `<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - El meu Blog</title>
    <style>
${sharedStyles}
        article {
            background: white;
            padding: 3rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        article h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .post-meta {
            color: #666;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        .content h1 { font-size: 2rem; margin-top: 2rem; margin-bottom: 1rem; }
        .content h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; }
        .content h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
        .content p { margin-bottom: 1rem; }
        .content ul, .content ol { margin-left: 2rem; margin-bottom: 1rem; }
        .content code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: "Monaco", monospace;
            font-size: 0.9em;
        }
        .content pre {
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 5px;
            overflow-x: auto;
            margin-bottom: 1rem;
        }
        .content pre code { background: none; padding: 0; }
        .content blockquote {
            border-left: 4px solid #0066cc;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #666;
        }
        .content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1.5rem 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
${getHeader(false)}

    <main>
        <article>
            <header>
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <time datetime="${formatDateISO(post.date)}">
                        ${formatDate(post.date)}
                    </time>
                </div>
            </header>

            <div class="content">
                ${post.html}
            </div>
        </article>
    </main>

${getFooter()}
</body>
</html>`;

    fs.writeFileSync(`public/posts/${post.slug}.html`, html);
  } catch (error) {
    console.error(`❌ Error generant ${post.slug}.html:`, error.message);
    process.exit(1);
  }
}

function formatDate(date) {
  const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
                  'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}

// Executar generació del blog
try {
  console.log('🚀 Generant blog estàtic...');

  // Verificar que existeixi la carpeta content
  if (!fs.existsSync('content')) {
    console.error('❌ Error: La carpeta "content/" no existeix');
    console.log('💡 Crea-la amb: mkdir content');
    process.exit(1);
  }

  // Llegir tots els posts
  const posts = loadPosts('content');

  if (posts.length === 0) {
    console.log('⚠️  Cap post trobat a content/');
    console.log('💡 Crea un fitxer .md a content/ per començar');
    process.exit(0);
  }

  // Filtrar només publicats
  const published = posts.filter(p => p.status === 'published');

  // Ordenar cronològicament (més recent primer)
  published.sort((a, b) => b.date - a.date);

  console.log(`✅ ${posts.length} posts trobats (${published.length} publicats, ${posts.length - published.length} drafts)`);

  if (published.length === 0) {
    console.log('⚠️  Cap post publicat. Canvia status: draft → published per publicar-los');
  }

  // Netejar i crear directoris
  if (fs.existsSync('public')) {
    fs.rmSync('public', { recursive: true });
    console.log('🧹 Netejant directori public...');
  }
  fs.mkdirSync('public', { recursive: true });
  fs.mkdirSync('public/posts', { recursive: true });

  // Copiar imatges si existeixen
  if (fs.existsSync('content/images')) {
    fs.cpSync('content/images', 'public/images', { recursive: true });
    console.log('📸 Imatges copiades');
  }

  // Generar pàgina principal
  generateIndex(published);

  // Generar pàgines individuals
  published.forEach(post => generatePost(post));

  console.log('✨ Blog generat a ./public/');
} catch (error) {
  console.error('\n❌ Error fatal durant la generació del blog:');
  console.error(error.message);
  process.exit(1);
}
