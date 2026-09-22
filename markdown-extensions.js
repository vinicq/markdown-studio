'use strict';
// Extends the base marked (GFM) parser with constructs from the Markdown Guide's
// extended-syntax page that marked does not implement natively: footnotes, heading
// IDs (auto-slug + {#custom-id}), definition lists, ==highlight==, ^superscript^,
// ~subscript~ and :emoji: shortcodes. Registered once via marked.use() before app.js runs.
(function () {
  const EMOJI = {
    smile:'😄',smiley:'😃',grin:'😁',laughing:'😆',satisfied:'😆',sweat_smile:'😅',rofl:'🤣',
    joy:'😂',slightly_smiling_face:'🙂',wink:'😉',blush:'😊',innocent:'😇',relaxed:'☺️',
    heart_eyes:'😍',kissing_heart:'😘',thinking:'🤔',neutral_face:'😐',expressionless:'😑',
    no_mouth:'😶',roll_eyes:'🙄',smirk:'😏',unamused:'😒',grimacing:'😬',relieved:'😌',
    pensive:'😔',confused:'😕',slightly_frowning_face:'🙁',frowning_face:'☹️',persevere:'😣',
    confounded:'😖',tired_face:'😫',weary:'😩',pleading_face:'🥺',cry:'😢',sob:'😭',
    triumph:'😤',angry:'😠',rage:'😡',flushed:'😳',hot_face:'🥵',cold_face:'🥶',
    scream:'😱',fearful:'😨',cold_sweat:'😰',astonished:'😲',sleeping:'😴',dizzy_face:'😵',
    zany_face:'🤪',nerd_face:'🤓',sunglasses:'😎',partying_face:'🥳',shushing_face:'🤫',
    zipper_mouth_face:'🤐',thumbsup:'👍','+1':'👍',thumbsdown:'👎','-1':'👎',clap:'👏',
    raised_hands:'🙌',pray:'🙏',wave:'👋',ok_hand:'👌',muscle:'💪',point_up:'☝️',
    point_down:'👇',point_left:'👈',point_right:'👉',handshake:'🤝',fist_bump:'👊',
    heart:'❤️',orange_heart:'🧡',yellow_heart:'💛',green_heart:'💚',blue_heart:'💙',
    purple_heart:'💜',black_heart:'🖤',broken_heart:'💔',two_hearts:'💕',sparkling_heart:'💖',
    heartbeat:'💓',fire:'🔥',star:'⭐',star2:'🌟',sparkles:'✨',zap:'⚡',boom:'💥',
    tada:'🎉',confetti_ball:'🎊',balloon:'🎈',gift:'🎁',trophy:'🏆',medal_sports:'🏅',
    100:'💯',warning:'⚠️',no_entry:'⛔',x:'❌',heavy_check_mark:'✔️',white_check_mark:'✅',
    question:'❓',exclamation:'❗',bulb:'💡',eyes:'👀',speech_balloon:'💬',thought_balloon:'💭',
    zzz:'💤',hourglass:'⌛',hourglass_flowing_sand:'⏳',alarm_clock:'⏰',calendar:'📅',
    pushpin:'📌',round_pushpin:'📍',link:'🔗',lock:'🔒',unlock:'🔓',key:'🔑',mag:'🔍',
    hammer:'🔨',wrench:'🔧',gear:'⚙️',package:'📦',email:'📧',memo:'📝',pencil2:'✏️',
    book:'📖',books:'📚',bookmark:'🔖',chart_with_upwards_trend:'📈',
    chart_with_downwards_trend:'📉',bar_chart:'📊',computer:'💻',iphone:'📱',camera:'📷',
    rocket:'🚀',airplane:'✈️',car:'🚗',bus:'🚌',train:'🚆',bike:'🚲',house:'🏠',
    office:'🏢',earth_americas:'🌎',sun_with_face:'🌞',cloud:'☁️',rainbow:'🌈',
    coffee:'☕',beer:'🍺',pizza:'🍕',apple:'🍎',dog:'🐶',cat:'🐱',bug:'🐛',
    checkered_flag:'🏁',recycle:'♻️',new:'🆕',free:'🆓',ok:'🆗',sos:'🆘',
    arrow_right:'➡️',arrow_left:'⬅️',arrow_up:'⬆️',arrow_down:'⬇️',construction:'🚧',
    white_flower:'💮',dizzy:'💫',anger:'💢',bomb:'💣',skull:'💀',ghost:'👻',robot:'🤖',
    partly_sunny:'⛅',snowflake:'❄️',droplet:'💧',ocean:'🌊'
  };

  const HEADING_ID_MARK = 'ID:';
  const HEADING_ID_END = '';
  const CUSTOM_ID_RE = /^(#{1,6}[ \t]+.+?)[ \t]*\{#([A-Za-z][\w-]*)\}[ \t]*$/gm;
  const FENCE_SPLIT_RE = /(^ {0,3}(?:```|~~~)[^\n]*\n[\s\S]*?\n {0,3}(?:```|~~~)[ \t]*$)/m;

  // Isolated instance (no custom hooks/extensions) used only to render already-extracted
  // inline text (footnote bodies, definition-list terms/definitions), so it never re-enters
  // the preprocess/postprocess hooks registered on the main `marked` instance below.
  const inlineMarked = new marked.Marked({ gfm: true, breaks: false });

  let usedSlugs, footnoteDefs, footnoteOrder;

  function resetState() {
    usedSlugs = new Map();
    footnoteDefs = new Map();
    footnoteOrder = [];
  }

  function uniqueId(base) {
    const n = usedSlugs.get(base) ?? -1;
    usedSlugs.set(base, n + 1);
    return n < 0 ? base : `${base}-${n + 1}`;
  }

  function slugify(text) {
    const base = text.toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
    return uniqueId(base);
  }

  function stripHeadingIds(text) {
    return text.replace(CUSTOM_ID_RE, (m, headingPart, id) => `${headingPart} ${HEADING_ID_MARK}${id}${HEADING_ID_END}`);
  }

  // ponytail: only ATX headings ({#id} at end of a `#`-line) are handled, matching the
  // syntax documented on markdownguide.org; a Setext-style variant is not supported.
  function preprocessHeadingIds(markdown) {
    const parts = markdown.split(FENCE_SPLIT_RE);
    return parts.map((part, i) => (i % 2 === 1 ? part : stripHeadingIds(part))).join('');
  }

  marked.use({
    hooks: {
      preprocess(markdown) {
        resetState();
        return preprocessHeadingIds(markdown);
      },
      postprocess(html) {
        if (!footnoteOrder.length) return html;
        const items = footnoteOrder.map(id => {
          const body = footnoteDefs.has(id) ? inlineMarked.parseInline(footnoteDefs.get(id)) : '';
          return `<li id="fn-${id}">${body} <a href="#fnref-${id}">↩︎</a></li>`;
        }).join('');
        return `${html}<section class="footnotes"><hr><ol>${items}</ol></section>`;
      }
    },
    renderer: {
      heading(token) {
        let html = this.parser.parseInline(token.tokens);
        let id = '';
        html = html.replace(new RegExp('[ \\t]?' + HEADING_ID_MARK + '([A-Za-z][\\w-]*)' + HEADING_ID_END), (m, capturedId) => {
          id = capturedId;
          return '';
        });
        const text = html.replace(/<[^>]+>/g, '');
        id = id ? uniqueId(id) : slugify(text);
        return `<h${token.depth} id="${id}">${html}</h${token.depth}>\n`;
      }
    },
    extensions: [
      {
        name: 'footnoteDef',
        level: 'block',
        start(src) { const m = /^\[\^([A-Za-z0-9_-]+)\]:/m.exec(src); return m ? m.index : undefined; },
        tokenizer(src) {
          const rule = /^\[\^([A-Za-z0-9_-]+)\]: ?([^\n]*(?:\n(?: {2,4}|\t)[^\n]*)*)\n?/;
          const match = rule.exec(src);
          if (!match) return;
          footnoteDefs.set(match[1], match[2].replace(/\n(?: {2,4}|\t)/g, ' ').trim());
          return { type: 'footnoteDef', raw: match[0] };
        },
        renderer() { return ''; }
      },
      {
        name: 'footnoteRef',
        level: 'inline',
        start(src) { const m = /\[\^[A-Za-z0-9_-]+\]/.exec(src); return m ? m.index : undefined; },
        tokenizer(src) {
          const match = /^\[\^([A-Za-z0-9_-]+)\]/.exec(src);
          if (!match) return;
          const id = match[1];
          if (footnoteOrder.indexOf(id) === -1) footnoteOrder.push(id);
          return { type: 'footnoteRef', raw: match[0], id };
        },
        renderer(token) {
          const n = footnoteOrder.indexOf(token.id) + 1;
          return `<sup id="fnref-${token.id}"><a href="#fn-${token.id}">${n}</a></sup>`;
        }
      },
      {
        name: 'defList',
        level: 'block',
        start(src) { const m = /\n[^\n:][^\n]*\n: {1,3}\S/.exec('\n' + src); return m ? Math.max(0, m.index) : undefined; },
        tokenizer(src) {
          const rule = /^([^\n:][^\n]*)\n((?:: {1,3}[^\n]+(?:\n|$))+)/;
          const match = rule.exec(src);
          if (!match) return;
          const term = match[1].trim();
          const defs = match[2].split(/\n(?=: )/).map(l => l.replace(/^: {1,3}/, '').trim()).filter(Boolean);
          return { type: 'defList', raw: match[0], term, defs };
        },
        renderer(token) {
          const dt = inlineMarked.parseInline(token.term);
          const dds = token.defs.map(d => `<dd>${inlineMarked.parseInline(d)}</dd>`).join('');
          return `<dl><dt>${dt}</dt>${dds}</dl>\n`;
        }
      },
      {
        name: 'highlight',
        level: 'inline',
        start(src) { const i = src.indexOf('=='); return i === -1 ? undefined : i; },
        tokenizer(src) {
          const match = /^==(?!\s)([\s\S]+?)(?<!\s)==(?!=)/.exec(src);
          if (!match) return;
          return { type: 'highlight', raw: match[0], text: match[1], tokens: this.lexer.inlineTokens(match[1]) };
        },
        renderer(token) { return `<mark>${this.parser.parseInline(token.tokens)}</mark>`; }
      },
      {
        name: 'superscript',
        level: 'inline',
        start(src) { const i = src.indexOf('^'); return i === -1 ? undefined : i; },
        tokenizer(src) {
          const match = /^\^(?!\^)([^\s^](?:[^^]*[^\s^])?)\^(?!\^)/.exec(src);
          if (!match) return;
          return { type: 'superscript', raw: match[0], text: match[1] };
        },
        renderer(token) { return `<sup>${token.text}</sup>`; }
      },
      {
        name: 'subscript',
        level: 'inline',
        start(src) { const m = /(?:^|[^~])~(?!~)/.exec(src); return m ? m.index + m[0].length - 1 : undefined; },
        tokenizer(src) {
          const match = /^~(?!~)([^\s~](?:[^~]*[^\s~])?)~(?!~)/.exec(src);
          if (!match) return;
          return { type: 'subscript', raw: match[0], text: match[1] };
        },
        renderer(token) { return `<sub>${token.text}</sub>`; }
      },
      {
        name: 'emoji',
        level: 'inline',
        start(src) { const m = /:[a-zA-Z0-9_+-]+:/.exec(src); return m ? m.index : undefined; },
        tokenizer(src) {
          const match = /^:([a-zA-Z0-9_+-]+):/.exec(src);
          if (!match || !EMOJI[match[1]]) return;
          return { type: 'emoji', raw: match[0], emoji: EMOJI[match[1]] };
        },
        renderer(token) { return token.emoji; }
      }
    ]
  });
})();
