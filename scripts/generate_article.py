#!/usr/bin/env python3
"""
TRAFFY Blog Article Generator
Автоматическая генерация статей + обновление RSS и Sitemap
"""

import os
import json
import random
import requests
from datetime import datetime
from pathlib import Path

# Конфигурация
BASE_DIR = Path(__file__).parent.parent
ARTICLES_DIR = BASE_DIR / "articles"
ARTICLES_JSON = ARTICLES_DIR / "articles.json"
RSS_FILE = BASE_DIR / "rss.xml"
SITEMAP_FILE = BASE_DIR / "sitemap.xml"
SITE_URL = "https://traffy.ai"

# Темы для генерации
TOPICS = [
    {
        "category": "telegram-ads",
        "topics": [
            "Как настроить таргетинг в Telegram Ads для максимальной конверсии",
            "Ошибки новичков в Telegram Ads и как их избежать",
            "Сколько стоит реклама в Telegram Ads: актуальные цены",
            "Telegram Ads vs посевы: что выбрать для продвижения",
            "Как писать эффективные креативы для Telegram Ads",
            "Анализ конкурентов в Telegram Ads: пошаговый гайд",
            "Ретаргетинг в Telegram: возможности и ограничения",
            "Как масштабировать рекламу в Telegram без потери ROI",
            "Модерация в Telegram Ads: как пройти с первого раза",
            "Лучшие ниши для рекламы в Telegram Ads"
        ]
    },
    {
        "category": "mini-apps",
        "topics": [
            "Топ-10 прибыльных ниш для Telegram Mini Apps в 2025",
            "Как интегрировать рекламу в Mini App: полный гайд",
            "TON Connect в Mini Apps: монетизация через криптовалюту",
            "UX-дизайн для Mini Apps: лучшие практики",
            "Как увеличить retention в Telegram Mini App",
            "Rewarded Video vs Banner: что приносит больше дохода",
            "Аналитика в Mini Apps: какие метрики отслеживать",
            "Как пройти модерацию Telegram для Mini App",
            "Tap-to-earn игры: как создать и монетизировать",
            "Mini Apps vs обычные приложения: плюсы и минусы"
        ]
    },
    {
        "category": "traffic",
        "topics": [
            "Где искать качественный трафик для Telegram в 2025",
            "Сравнение рекламных сетей для Telegram: кто лучше",
            "Как отличить ботовый трафик от реального",
            "Арбитраж трафика в Telegram: с чего начать",
            "Воронки продаж в Telegram: от трафика до покупки",
            "Как снизить стоимость подписчика в 2 раза",
            "Вирусные механики для органического роста канала",
            "Партнёрские программы в Telegram: обзор лучших",
            "Инфлюенс-маркетинг в Telegram: полный гайд",
            "Кросс-промо в Telegram: как договариваться"
        ]
    },
    {
        "category": "cases",
        "topics": [
            "Кейс: запуск NFT-проекта через Mini Apps",
            "Как мы привлекли 100К подписчиков за месяц",
            "Кейс: монетизация игрового Mini App на $50K/месяц",
            "Продвижение DeFi-проекта в Telegram: кейс",
            "Кейс: e-commerce бот с конверсией 15%",
            "Как мы снизили CPA в 3 раза для крипто-проекта",
            "Кейс: запуск SaaS-продукта через Telegram",
            "Продвижение образовательного канала: кейс",
            "Кейс: вирусный рост канала с 0 до 500К",
            "ROI 500%: кейс рекламы в Mini Apps"
        ]
    },
    {
        "category": "guides",
        "topics": [
            "Полный гайд по TON для маркетологов",
            "Как создать Telegram-бота с нуля: пошаговая инструкция",
            "Гайд по аналитике Telegram-канала",
            "Как работать с инфлюенсерами в Telegram",
            "Контент-план для Telegram-канала: шаблон и примеры",
            "Гайд по автоматизации в Telegram",
            "Как проводить A/B тесты в Telegram рекламе",
            "Юридические аспекты рекламы в Telegram",
            "Telegram Premium: что даёт для бизнеса",
            "Безопасность Telegram-канала: защита от взлома"
        ]
    }
]


def generate_with_grok(topic: str, category: str) -> dict:
    """Генерация через xAI Grok API"""
    api_key = os.environ.get("XAI_API_KEY")
    
    if not api_key:
        print("⚠️ XAI_API_KEY не найден, используем fallback")
        return generate_fallback_article(topic, category)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    system_prompt = """Ты - эксперт по рекламе в Telegram. Пиши на русском.
ВАЖНО: Ответ ТОЛЬКО валидный JSON!
{"title": "Заголовок", "excerpt": "Описание 150-200 символов", "readTime": "X мин", "content": "<h2>...</h2><p>...</p>"}"""

    user_prompt = f"""Напиши SEO-статью: "{topic}"
Категория: {category}. Объём: 800-1200 слов.
Структура: введение, 3-4 раздела с h2, советы, заключение.
ТОЛЬКО JSON без markdown!"""

    try:
        response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers=headers,
            json={
                "model": "grok-beta",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 4000
            },
            timeout=120
        )
        response.raise_for_status()
        
        content = response.json()["choices"][0]["message"]["content"].strip()
        
        # Очистка от markdown
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        content = content.strip()
        
        return json.loads(content)
        
    except Exception as e:
        print(f"⚠️ API Error: {e}")
        return generate_fallback_article(topic, category)


def generate_fallback_article(topic: str, category: str) -> dict:
    """Статья-заглушка"""
    labels = {
        "telegram-ads": "Telegram Ads",
        "mini-apps": "Mini Apps", 
        "traffic": "трафике",
        "cases": "кейсах",
        "guides": "гайдах"
    }
    cat = labels.get(category, 'Telegram')
    
    return {
        "title": topic,
        "excerpt": f"Подробная статья о {cat}. Разбираем ключевые аспекты, делимся советами и примерами от TRAFFY.",
        "readTime": f"{random.randint(5, 12)} мин",
        "content": f"""<h2>Введение</h2>
<p>В этой статье разберём тему: <strong>{topic}</strong>. Вы узнаете стратегии, советы и примеры от экспертов TRAFFY.</p>

<h2>Почему это важно в 2025</h2>
<p>Telegram — одна из самых быстрорастущих платформ. 900+ миллионов пользователей активно взаимодействуют с каналами, ботами и Mini Apps.</p>

<h2>Основные стратегии</h2>
<ul>
<li><strong>Определите ЦА</strong> — чётко понимайте, кого привлекаете</li>
<li><strong>Качественный контент</strong> — основа органического роста</li>
<li><strong>Тестируйте</strong> — A/B тесты помогут найти лучшее решение</li>
<li><strong>Анализируйте</strong> — без данных нет оптимизации</li>
</ul>

<h2>Советы от TRAFFY</h2>
<p>Начните с малого бюджета, тестируйте 2 недели, затем масштабируйте успешное.</p>

<blockquote><p>«Ключ к успеху — понимание аудитории и постоянное тестирование!» — TRAFFY</p></blockquote>

<h2>Заключение</h2>
<p>Нужна помощь? Обращайтесь к TRAFFY — поможем достичь целей!</p>"""
    }


def transliterate(text: str) -> str:
    """Транслитерация"""
    tr = {'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'}
    result = text.lower()
    for ru, en in tr.items():
        result = result.replace(ru, en)
    return ''.join(c if c.isalnum() or c == ' ' else '' for c in result)


def generate_id(title: str) -> str:
    """Генерация ID"""
    slug = '-'.join(transliterate(title).split())[:40]
    return f"{slug}-{datetime.now().strftime('%Y%m%d-%H%M')}"


def load_articles() -> list:
    if ARTICLES_JSON.exists():
        return json.load(open(ARTICLES_JSON, 'r', encoding='utf-8'))
    return []


def save_articles(articles: list):
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)
    json.dump(articles, open(ARTICLES_JSON, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)


def update_rss(articles: list):
    """Обновление RSS-фида"""
    now = datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0300")
    
    items = ""
    for article in articles[:20]:  # Последние 20 статей
        pub_date = datetime.strptime(article['date'], "%Y-%m-%d").strftime("%a, %d %b %Y 12:00:00 +0300")
        items += f"""
    <item>
      <title>{article['title']}</title>
      <link>{SITE_URL}/article.html?id={article['id']}</link>
      <description>{article['excerpt']}</description>
      <pubDate>{pub_date}</pubDate>
      <guid>{SITE_URL}/article.html?id={article['id']}</guid>
      <category>{article['category']}</category>
    </item>"""
    
    rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TRAFFY Blog — Реклама в Telegram</title>
    <link>{SITE_URL}</link>
    <description>Статьи о рекламе в Telegram, Mini Apps, Telegram Ads и маркетинге</description>
    <language>ru</language>
    <lastBuildDate>{now}</lastBuildDate>
    <atom:link href="{SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>{SITE_URL}/photo_2025-12-11%2014.39.43.jpeg</url>
      <title>TRAFFY</title>
      <link>{SITE_URL}</link>
    </image>{items}
  </channel>
</rss>"""
    
    with open(RSS_FILE, 'w', encoding='utf-8') as f:
        f.write(rss)
    print("📡 RSS обновлён")


def update_sitemap(articles: list):
    """Обновление Sitemap"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    urls = f"""  <url>
    <loc>{SITE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{SITE_URL}/blog.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>"""
    
    for article in articles:
        urls += f"""
  <url>
    <loc>{SITE_URL}/article.html?id={article['id']}</loc>
    <lastmod>{article['date']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>"""
    
    with open(SITEMAP_FILE, 'w', encoding='utf-8') as f:
        f.write(sitemap)
    print("🗺️ Sitemap обновлён")


def get_topic(existing: list) -> tuple:
    """Выбор темы"""
    used = {a['title'].lower() for a in existing}
    all_topics = [(c['category'], t) for c in TOPICS for t in c['topics']]
    random.shuffle(all_topics)
    
    for cat, topic in all_topics:
        if topic.lower() not in used:
            return cat, topic
    
    cat, topic = random.choice(all_topics)
    return cat, f"{topic} — {datetime.now().year}"


def main():
    print("🦋 TRAFFY Article Generator")
    print("=" * 40)
    
    articles = load_articles()
    print(f"📚 Статей: {len(articles)}")
    
    category, topic = get_topic(articles)
    print(f"📝 Тема: {topic}")
    
    print("🤖 Генерация...")
    content = generate_with_grok(topic, category)
    
    article_id = generate_id(content['title'])
    new_article = {
        "id": article_id,
        "title": content['title'],
        "excerpt": content['excerpt'],
        "category": category,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "readTime": content.get('readTime', '7 мин'),
        "content": f"{article_id}.html"
    }
    
    # Сохраняем HTML
    with open(ARTICLES_DIR / f"{article_id}.html", 'w', encoding='utf-8') as f:
        f.write(content.get('content', ''))
    
    articles.insert(0, new_article)
    save_articles(articles)
    
    # Обновляем RSS и Sitemap
    update_rss(articles)
    update_sitemap(articles)
    
    print(f"✅ Создано: {new_article['title']}")


if __name__ == "__main__":
    main()
