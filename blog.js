// ===== Blog Functionality =====

document.addEventListener('DOMContentLoaded', () => {
    initBlog();
    initCategories();
    initNewsletter();
});

let allArticles = [];
let displayedCount = 0;
const ARTICLES_PER_PAGE = 9;
let currentCategory = 'all';

// ===== Initialize Blog =====
async function initBlog() {
    try {
        const response = await fetch('articles/articles.json');
        if (!response.ok) throw new Error('Articles not found');
        
        allArticles = await response.json();
        // Sort by date (newest first)
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        displayArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        showNoArticles();
    }
}

// ===== Display Articles =====
function displayArticles(append = false) {
    const grid = document.getElementById('blog-grid');
    const loadMoreBtn = document.getElementById('load-more');
    
    // Filter by category
    let filtered = currentCategory === 'all' 
        ? allArticles 
        : allArticles.filter(a => a.category === currentCategory);
    
    if (!append) {
        displayedCount = 0;
        grid.innerHTML = '';
    }
    
    const toShow = filtered.slice(displayedCount, displayedCount + ARTICLES_PER_PAGE);
    
    if (toShow.length === 0 && displayedCount === 0) {
        showNoArticles();
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    toShow.forEach((article, index) => {
        const card = createArticleCard(article, displayedCount === 0 && index === 0);
        grid.appendChild(card);
    });
    
    displayedCount += toShow.length;
    
    // Show/hide load more button
    if (displayedCount < filtered.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
    
    // Animate cards
    animateCards();
}

// ===== Create Article Card =====
function createArticleCard(article, featured = false) {
    const card = document.createElement('article');
    card.className = `article-card${featured ? ' featured' : ''} animate-element`;
    card.dataset.category = article.category;
    
    const categoryLabels = {
        'telegram-ads': 'Telegram Ads',
        'mini-apps': 'Mini Apps',
        'traffic': 'Трафик',
        'cases': 'Кейсы',
        'guides': 'Гайды'
    };
    
    const categoryIcons = {
        'telegram-ads': '📢',
        'mini-apps': '📱',
        'traffic': '📊',
        'cases': '💼',
        'guides': '📚'
    };
    
    card.innerHTML = `
        <div class="article-image-placeholder">
            ${categoryIcons[article.category] || '📝'}
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-category">${categoryLabels[article.category] || article.category}</span>
                <span class="article-date">${formatDate(article.date)}</span>
            </div>
            <h2 class="article-title">
                <a href="article.html?id=${article.id}">${article.title}</a>
            </h2>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-footer">
                <span class="article-read-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    ${article.readTime || '5 мин'}
                </span>
                <a href="article.html?id=${article.id}" class="article-link">
                    Читать
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </div>
    `;
    
    return card;
}

// ===== Format Date =====
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// ===== Show No Articles =====
function showNoArticles() {
    const grid = document.getElementById('blog-grid');
    grid.innerHTML = `
        <div class="no-articles">
            <div class="no-articles-icon">📝</div>
            <h3>Статьи скоро появятся</h3>
            <p>Мы готовим интересные материалы о рекламе в Telegram</p>
        </div>
    `;
}

// ===== Categories Filter =====
function initCategories() {
    const buttons = document.querySelectorAll('.category-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter articles
            currentCategory = btn.dataset.category;
            displayArticles();
        });
    });
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayArticles(true);
        });
    }
}

// ===== Newsletter Form =====
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button');
            const email = form.querySelector('input').value;
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Отправляем...';
            btn.disabled = true;
            
            // Simulate submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            btn.innerHTML = '✓ Подписано!';
            btn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            form.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    }
}

// ===== Animate Cards =====
function animateCards() {
    const cards = document.querySelectorAll('.article-card.animate-element:not(.animate-in)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
}

