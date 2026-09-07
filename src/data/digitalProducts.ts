import type { DigitalProduct } from '../types';

/**
 * Digital products.
 *
 * `url: null` means the asset is not yet provisioned. The UI renders a
 * disabled row with an explanation rather than an anchor to "#" — the previous
 * build shipped seven files all pointing at "#", so paying customers clicked
 * "Download" and the page just jumped to the top (AUDIT.md §C3).
 *
 * In production these are replaced at request time with signed, expiring URLs
 * issued only after a server-side entitlement check.
 */
export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    kind: 'product',
    id: 'swipe-file',
    slug: 'copywriting-swipe-file',
    title: 'Copywriting Swipe File',
    title_am: 'የጽሑፍ አጻጻፍ ናሙና ስብስብ',
    category: 'Templates',
    category_am: 'አብነቶች',
    summary: '180 headlines, hooks and calls to action you can adapt today.',
    summary_am: 'ዛሬውኑ ልታስተካክሏቸው የምትችሏቸው 180 ርዕሶች፣ መሳቢያዎች እና የተግባር ጥሪዎች።',
    description:
      'A categorised library of lines that work, pulled from campaigns across retail, services and hospitality. Each entry notes why it works so you are adapting the pattern, not copying the words.',
    description_am:
      'በችርቻሮ፣ በአገልግሎት እና በእንግዳ አቀባበል ዘርፎች ካሉ ዘመቻዎች የተሰበሰቡ የሚሠሩ መስመሮች በምድብ የተደራጀ ቤተ-መጻሕፍት። እያንዳንዱ ግቤት ለምን እንደሚሠራ ይገልጻል፤ ስለዚህ ቃላቱን ሳይሆን ዘይቤውን ታስተካክላላችሁ።',
    price: 49,
    originalPrice: 79,
    thumbnail:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=75',
    status: 'published',
    publishedAt: '2025-04-01',
    highlights: [
      '180 lines across 12 categories',
      'A note on why each one works',
      'Editable Google Docs version included',
    ],
    highlights_am: [
      'በ12 ምድቦች የተከፋፈሉ 180 መስመሮች',
      'እያንዳንዱ ለምን እንደሚሠራ ማብራሪያ',
      'ሊስተካከል የሚችል የGoogle Docs ቅጂ ተካትቷል',
    ],
    files: [
      { id: 'sf-1', name: 'Swipe-File.pdf', size: '2.1 MB', type: 'PDF', url: null },
      { id: 'sf-2', name: 'Headline-Patterns.pdf', size: '1.4 MB', type: 'PDF', url: null },
      { id: 'sf-3', name: 'Editable-Templates.docx', size: '0.8 MB', type: 'Word', url: null },
    ],
  },
  {
    kind: 'product',
    id: 'strategy-guide',
    slug: 'marketing-strategy-guide',
    title: 'Marketing Strategy Guide',
    title_am: 'የግብይት ስትራቴጂ መመሪያ',
    category: 'Guides',
    category_am: 'መመሪያዎች',
    summary: 'A 64-page workbook that ends with your plan written down.',
    summary_am: 'በመጨረሻ ዕቅዳችሁ ተጽፎ የሚያልቅ የ64 ገጽ የሥራ መጽሐፍ።',
    description:
      'Not a book you read — a workbook you fill in. Eleven exercises take you from "we should probably do marketing" to a one-page plan with owners, budgets and dates.',
    description_am:
      'የሚነበብ መጽሐፍ አይደለም — የምትሞሉት የሥራ መጽሐፍ ነው። አሥራ አንድ ልምምዶች "ምናልባት ግብይት ማድረግ አለብን" ከሚለው ወደ ኃላፊዎች፣ በጀቶች እና ቀኖች ያሉት የአንድ ገጽ ዕቅድ ያደርሷችኋል።',
    price: 89,
    thumbnail:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=75',
    status: 'published',
    publishedAt: '2025-02-20',
    highlights: [
      '11 fill-in exercises',
      'Budget calculator included',
      'Worked example from a real Addis retailer',
    ],
    highlights_am: [
      '11 የሚሞሉ ልምምዶች',
      'የበጀት ማስያ ተካትቷል',
      'ከእውነተኛ የአዲስ አበባ ችርቻሮ ነጋዴ የተወሰደ የተሠራ ምሳሌ',
    ],
    files: [
      { id: 'sg-1', name: 'Strategy-Guide.pdf', size: '8.1 MB', type: 'PDF', url: null },
      { id: 'sg-2', name: 'Budget-Calculator.xlsx', size: '1.1 MB', type: 'Excel', url: null },
    ],
  },
  {
    kind: 'product',
    id: 'content-calendar',
    slug: 'social-content-calendar',
    title: 'Social Content Calendar',
    title_am: 'የማኅበራዊ ይዘት የቀን መቁጠሪያ',
    category: 'Templates',
    category_am: 'አብነቶች',
    summary: 'A year of post ideas, pre-scheduled around Ethiopian holidays.',
    summary_am: 'በኢትዮጵያ በዓላት ዙሪያ አስቀድሞ የተያዘ የአንድ ዓመት የልጥፍ ሐሳቦች።',
    description:
      'A spreadsheet with 365 prompts already placed on the calendar, built around the Ethiopian holiday and business cycle rather than a generic Western one.',
    description_am:
      'በአጠቃላይ የምዕራባውያን ዑደት ሳይሆን በኢትዮጵያ የበዓል እና የንግድ ዑደት ዙሪያ የተገነባ፣ 365 ሐሳቦች አስቀድመው በቀን መቁጠሪያ ላይ የተቀመጡበት የተመን ሉህ።',
    price: 39,
    thumbnail:
      'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=75',
    status: 'published',
    publishedAt: '2025-05-25',
    highlights: [
      '365 prompts, already dated',
      'Built around Ethiopian holidays',
      'Google Sheets and Excel versions',
    ],
    highlights_am: [
      '365 ሐሳቦች፣ አስቀድሞ በቀን የተያዙ',
      'በኢትዮጵያ በዓላት ዙሪያ የተገነባ',
      'የGoogle Sheets እና Excel ቅጂዎች',
    ],
    files: [
      {
        id: 'cc-1',
        name: 'Content-Calendar.xlsx',
        size: '2.5 MB',
        type: 'Excel',
        url: null,
      },
    ],
  },
  {
    kind: 'product',
    id: 'email-pack',
    slug: 'email-template-pack',
    title: 'Email Template Pack',
    title_am: 'የኢሜይል አብነት ጥቅል',
    category: 'Templates',
    category_am: 'አብነቶች',
    summary: '24 emails: welcome sequences, launches, win-backs and receipts.',
    summary_am: '24 ኢሜይሎች፡ የእንኳን ደህና መጣችሁ ተከታታዮች፣ ማስጀመሪያዎች፣ መልሶ ማግኛዎች እና ደረሰኞች።',
    description:
      'Every email you need for the first year, written in plain language and tested on Ethiopian audiences. Copy, adjust the name of your business, send.',
    description_am:
      'ለመጀመሪያው ዓመት የሚያስፈልጓችሁ ሁሉም ኢሜይሎች፣ በቀላል ቋንቋ ተጽፈው በኢትዮጵያ ታዳሚዎች ላይ ተፈትነዋል። ቅዱ፣ የንግዳችሁን ስም አስተካክሉ፣ ላኩ።',
    price: 59,
    originalPrice: 89,
    thumbnail:
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=1200&q=75',
    status: 'published',
    publishedAt: '2025-06-05',
    highlights: ['24 ready-to-send emails', 'Amharic and English versions', 'Subject line variants'],
    highlights_am: ['24 ለመላክ ዝግጁ ኢሜይሎች', 'የአማርኛ እና የእንግሊዝኛ ቅጂዎች', 'የርዕስ መስመር አማራጮች'],
    files: [
      { id: 'ep-1', name: 'Email-Templates.zip', size: '12.4 MB', type: 'ZIP Archive', url: null },
    ],
  },
];
