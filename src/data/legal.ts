/**
 * Legal documents.
 *
 * The previous build linked Terms and Privacy to `href="#"` while taking
 * payments and advertising a 14-day guarantee with no policy behind it
 * (AUDIT.md §H6).
 *
 * ⚠️  NOT LEGAL ADVICE. This is a plain-language skeleton covering the points
 * a digital-goods seller in Ethiopia has to address. Have a lawyer review it
 * against Proclamation 813/2013 (Trade Competition and Consumers Protection)
 * and the Personal Data Protection Proclamation before you launch, and update
 * `updatedAt` whenever the text changes.
 */

export type LegalSlug = 'terms' | 'privacy' | 'refunds';

export interface LegalSection {
  heading: string;
  heading_am?: string;
  paragraphs: string[];
  paragraphs_am?: string[];
}

export interface LegalDocument {
  id: LegalSlug;
  /** ISO date of the last substantive change. */
  updatedAt: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<LegalSlug, LegalDocument> = {
  terms: {
    id: 'terms',
    updatedAt: '2026-01-15',
    sections: [
      {
        heading: 'Who we are',
        heading_am: 'እኛ ማን ነን',
        paragraphs: [
          'Awraq is a digital marketing education service operating from Addis Ababa, Ethiopia. When these terms say "we" or "us" they mean Awraq; "you" means the person using the site or buying from it.',
          'You can reach us at hello@awraq.et for anything on this page.',
        ],
        paragraphs_am: [
          'አውራቅ ከአዲስ አበባ፣ ኢትዮጵያ የሚሠራ የዲጂታል ግብይት ትምህርት አገልግሎት ነው። በእነዚህ ውሎች ውስጥ "እኛ" ማለት አውራቅ ማለት ሲሆን "እርስዎ" ማለት ጣቢያውን የሚጠቀም ወይም ከእሱ የሚገዛ ሰው ማለት ነው።',
          'በዚህ ገጽ ላይ ስላለው ማንኛውም ነገር በhello@awraq.et ሊያገኙን ይችላሉ።',
        ],
      },
      {
        heading: 'Your account',
        heading_am: 'የእርስዎ መለያ',
        paragraphs: [
          'You need an account to buy a course or download a resource. Free courses and recorded sessions do not require one.',
          'Keep your password to yourself. Course access is for one person — sharing your login or redistributing course files ends your access without a refund.',
        ],
        paragraphs_am: [
          'ኮርስ ለመግዛት ወይም መርጃ ለማውረድ መለያ ያስፈልግዎታል። ነጻ ኮርሶች እና የተቀረጹ ክፍለ ጊዜዎች መለያ አይጠይቁም።',
          'የይለፍ ቃልዎን ለራስዎ ይያዙ። የኮርስ መዳረሻ ለአንድ ሰው ብቻ ነው — መግቢያዎን ማጋራት ወይም የኮርስ ፋይሎችን ማሰራጨት መዳረሻዎን ያለተመላሽ ገንዘብ ያቋርጣል።',
        ],
      },
      {
        heading: 'What you are buying',
        heading_am: 'የሚገዙት ምንድን ነው',
        paragraphs: [
          'When you buy a course you get lifetime access to its lessons and downloadable files through your Awraq account, including any updates we publish to that course.',
          'You may use the templates and worksheets in your own business, including for clients. You may not resell them, publish them, or present them as your own product.',
          'Marketing results depend on your market, your offer and your effort. We teach method; we do not promise revenue.',
        ],
        paragraphs_am: [
          'ኮርስ ሲገዙ በአውራቅ መለያዎ በኩል ለትምህርቶቹ እና ሊወርዱ ለሚችሉ ፋይሎች የዕድሜ ልክ መዳረሻ ያገኛሉ፤ ለዚያ ኮርስ የምናወጣቸውን ማሻሻያዎች ጨምሮ።',
          'አብነቶቹንና የሥራ ወረቀቶቹን በራስዎ ንግድ ውስጥ፣ ለደንበኞችም ጭምር መጠቀም ይችላሉ። ነገር ግን እንደገና መሸጥ፣ ማሳተም ወይም እንደራስዎ ምርት ማቅረብ አይችሉም።',
          'የግብይት ውጤቶች በገበያዎ፣ በአቅርቦትዎ እና በጥረትዎ ላይ ይወሰናሉ። እኛ ዘዴ እናስተምራለን፤ ገቢ ቃል አንገባም።',
        ],
      },
      {
        heading: 'Payment',
        heading_am: 'ክፍያ',
        paragraphs: [
          'Prices are shown in Ethiopian Birr and include any applicable tax. We accept Telebirr, CBE Birr and bank cards through Chapa.',
          'Access is granted once the payment provider confirms the payment. If a payment is confirmed but access has not appeared within an hour, email hello@awraq.et with your order reference.',
        ],
        paragraphs_am: [
          'ዋጋዎች በኢትዮጵያ ብር የሚታዩ ሲሆን ተፈጻሚ የሚሆነውን ግብር ያካትታሉ። ቴሌብር፣ CBE ብር እና በChapa በኩል የባንክ ካርዶችን እንቀበላለን።',
          'ክፍያው በአቅራቢው ከተረጋገጠ በኋላ መዳረሻ ይሰጣል። ክፍያ ተረጋግጦ በአንድ ሰዓት ውስጥ መዳረሻ ካልታየ የትዕዛዝ ማጣቀሻዎን በመያዝ ወደ hello@awraq.et ይላኩልን።',
        ],
      },
      {
        heading: 'Changes and availability',
        heading_am: 'ለውጦች እና አገልግሎት',
        paragraphs: [
          'We may add, update or retire courses. If we retire a course you have bought, you keep access to the version you paid for and can download its files.',
          'We aim to keep the site available but cannot guarantee uninterrupted service.',
        ],
        paragraphs_am: [
          'ኮርሶችን ልንጨምር፣ ልናሻሽል ወይም ልናቋርጥ እንችላለን። የገዙትን ኮርስ ካቋረጥን፣ ለከፈሉበት ስሪት መዳረሻዎ ይቀጥላል፤ ፋይሎቹንም ማውረድ ይችላሉ።',
          'ጣቢያው ሁልጊዜ እንዲገኝ እንጥራለን፤ ሆኖም ያልተቋረጠ አገልግሎት ዋስትና መስጠት አንችልም።',
        ],
      },
    ],
  },

  privacy: {
    id: 'privacy',
    updatedAt: '2026-01-15',
    sections: [
      {
        heading: 'What we collect',
        heading_am: 'የምንሰበስበው መረጃ',
        paragraphs: [
          'Account details you give us: your name, email address, and the phone number used for a Telebirr or CBE Birr payment.',
          'Learning activity: which lessons you have completed and the notes you write. Notes are yours and are never read for marketing.',
          'Basic technical data: page views and error reports, used to fix problems and decide what to build next.',
        ],
        paragraphs_am: [
          'የሚሰጡን የመለያ መረጃ፦ ስምዎ፣ የኢሜይል አድራሻዎ እና ለቴሌብር ወይም CBE ብር ክፍያ የተጠቀሙበት ስልክ ቁጥር።',
          'የመማር እንቅስቃሴ፦ የጨረሷቸው ትምህርቶች እና የሚጽፏቸው ማስታወሻዎች። ማስታወሻዎቹ የእርስዎ ናቸው፤ ለግብይት ዓላማ በጭራሽ አይነበቡም።',
          'መሠረታዊ ቴክኒካዊ መረጃ፦ የገጽ እይታዎች እና የስህተት ሪፖርቶች፤ ችግሮችን ለመፍታት እና ቀጥሎ ምን እንደምንሠራ ለመወሰን ይጠቅማሉ።',
        ],
      },
      {
        heading: 'What we do not do',
        heading_am: 'የማናደርገው',
        paragraphs: [
          'We do not sell your data. We do not share it with advertisers.',
          'We never see or store your card number or mobile-money PIN — those go directly to the payment provider.',
        ],
        paragraphs_am: [
          'መረጃዎን አንሸጥም። ለማስታወቂያ ሰጪዎችም አናጋራም።',
          'የካርድ ቁጥርዎን ወይም የሞባይል ገንዘብ ፒንዎን በጭራሽ አናይም፤ አናከማችም — በቀጥታ ወደ ክፍያ አቅራቢው ይሄዳሉ።',
        ],
      },
      {
        heading: 'Your choices',
        heading_am: 'የእርስዎ ምርጫዎች',
        paragraphs: [
          'You can ask for a copy of your data, correct it, or ask us to delete your account by emailing hello@awraq.et. We respond within 30 days.',
          'Deleting your account removes your profile and notes. We keep payment records for as long as tax law requires.',
        ],
        paragraphs_am: [
          'የመረጃዎን ቅጂ መጠየቅ፣ ማስተካከል ወይም መለያዎን እንድናጠፋ በhello@awraq.et መጠየቅ ይችላሉ። በ30 ቀናት ውስጥ ምላሽ እንሰጣለን።',
          'መለያዎን ማጥፋት መገለጫዎን እና ማስታወሻዎችዎን ያስወግዳል። የክፍያ መዝገቦችን የግብር ሕግ በሚጠይቀው ጊዜ ልክ እንይዛለን።',
        ],
      },
    ],
  },

  refunds: {
    id: 'refunds',
    updatedAt: '2026-01-15',
    sections: [
      {
        heading: 'The short version',
        heading_am: 'በአጭሩ',
        paragraphs: [
          'If a paid course is not what you expected, email hello@awraq.et within 14 days of buying it and we will refund you in full.',
          'You do not need to justify the request. "It was not right for me" is enough.',
        ],
        paragraphs_am: [
          'የተከፈለበት ኮርስ የጠበቁት ካልሆነ፣ ከገዙበት ቀን ጀምሮ በ14 ቀናት ውስጥ ወደ hello@awraq.et ይላኩልን፤ ሙሉ ገንዘብዎን እንመልሳለን።',
          'ጥያቄውን ማስረዳት አያስፈልግዎትም። "ለእኔ አልሆነልኝም" ማለት በቂ ነው።',
        ],
      },
      {
        heading: 'The details',
        heading_am: 'ዝርዝሮቹ',
        paragraphs: [
          'Include the email address you used and your order reference. Refunds go back to the method you paid with and usually clear within 5 working days.',
          'Downloadable resources are refundable within 14 days as long as the files have not been downloaded. Once a file is on your computer we cannot take it back, so please read the file list before buying.',
          'Consultation calls can be rescheduled or cancelled for a full refund up to 24 hours before the booked time.',
          'We may decline a refund where an account has downloaded every file in a bundle or completed a full course — but we will always talk to you first.',
        ],
        paragraphs_am: [
          'የተጠቀሙበትን የኢሜይል አድራሻ እና የትዕዛዝ ማጣቀሻዎን ያካትቱ። ተመላሽ ገንዘብ በከፈሉበት ዘዴ የሚመለስ ሲሆን አብዛኛውን ጊዜ በ5 የሥራ ቀናት ውስጥ ይጠናቀቃል።',
          'ሊወርዱ የሚችሉ መርጃዎች ፋይሎቹ እስካልወረዱ ድረስ በ14 ቀናት ውስጥ ተመላሽ ይደረጋሉ። ፋይል አንዴ ኮምፒውተርዎ ላይ ከገባ መመለስ አንችልም፤ ስለዚህ ከመግዛትዎ በፊት የፋይል ዝርዝሩን ያንብቡ።',
          'የምክር ጥሪዎች ከተያዘው ሰዓት 24 ሰዓት በፊት እስከሆነ ድረስ ሊዘዋወሩ ወይም ተሰርዘው ሙሉ ገንዘብ ሊመለስ ይችላል።',
          'አንድ መለያ በጥቅል ውስጥ ያሉትን ሁሉንም ፋይሎች ካወረደ ወይም ሙሉ ኮርስ ከጨረሰ ተመላሽ ገንዘብን ልንከለክል እንችላለን — ሆኖም ሁልጊዜ አስቀድመን እናነጋግርዎታለን።',
        ],
      },
    ],
  },
};
