export interface FaqItem {
  id: string;
  question: string;
  question_am: string;
  answer: string;
  answer_am: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'experience',
    question: 'Do I need any experience to start?',
    question_am: 'ለመጀመር ልምድ ያስፈልገኛል?',
    answer:
      'No. Start with the free Digital Marketing Foundations course — it assumes you know nothing and takes under an hour. If the words still feel unfamiliar after that, book a free 15-minute call and we will point you at the right starting place.',
    answer_am:
      'አያስፈልግም። በነጻው የዲጂታል ግብይት መሠረቶች ኮርስ ጀምሩ — ምንም እንደማታውቁ ወስዶ ከአንድ ሰዓት በታች ይወስዳል። ከዚያ በኋላም ቃላቱ እንግዳ ከሆኑባችሁ የ15 ደቂቃ ነጻ ጥሪ ያዙ፤ ትክክለኛውን መነሻ እናሳያችኋለን።',
  },
  {
    id: 'language',
    question: 'Are the courses available in Amharic?',
    question_am: 'ኮርሶቹ በአማርኛ ይገኛሉ?',
    answer:
      'Yes. Every page, course title, lesson and email is available in both Amharic and English. Use the language switcher in the top bar — your choice is remembered on this device.',
    answer_am:
      'አዎ። እያንዳንዱ ገጽ፣ የኮርስ ርዕስ፣ ትምህርት እና ኢሜይል በአማርኛም በእንግሊዝኛም ይገኛል። በላይኛው አሞሌ ላይ ያለውን የቋንቋ መቀየሪያ ተጠቀሙ — ምርጫችሁ በዚህ መሣሪያ ላይ ይታወሳል።',
  },
  {
    id: 'payment',
    question: 'How can I pay?',
    question_am: 'እንዴት መክፈል እችላለሁ?',
    answer:
      'Telebirr, CBE Birr, or any Ethiopian bank card through Chapa. You will get a receipt by email immediately, and your course unlocks as soon as the payment confirms.',
    answer_am:
      'በቴሌብር፣ በCBE ብር፣ ወይም በChapa በኩል በማንኛውም የኢትዮጵያ ባንክ ካርድ። ወዲያውኑ በኢሜይል ደረሰኝ ይደርሳችኋል፤ ክፍያው እንደተረጋገጠም ኮርሳችሁ ይከፈታል።',
  },
  {
    id: 'access',
    question: 'How long do I keep access?',
    question_am: 'ለምን ያህል ጊዜ ተደራሽነት አለኝ?',
    answer:
      'Forever. Paid courses include lifetime access and every future update to that course at no extra cost. Downloadable resources are yours to keep.',
    answer_am:
      'ለዘላለም። የሚከፈልባቸው ኮርሶች የዕድሜ ልክ ተደራሽነትን እና ለዚያ ኮርስ የሚደረጉ ሁሉንም የወደፊት ዝማኔዎች ያለተጨማሪ ክፍያ ያካትታሉ። የሚወርዱ ግብዓቶች የእናንተው ናቸው።',
  },
  {
    id: 'refund',
    question: 'What if the course is not right for me?',
    question_am: 'ኮርሱ ለእኔ የማይመች ከሆነስ?',
    answer:
      'Email us within 14 days of purchase and we will refund you in full, no questions asked, as long as you have completed less than half the lessons. Read the full terms on our refund policy page.',
    answer_am:
      'ከግዢ በኋላ በ14 ቀናት ውስጥ ኢሜይል ላኩልን፤ ከትምህርቶቹ ግማሽ በታች እስከጨረሳችሁ ድረስ ያለምንም ጥያቄ ሙሉ ገንዘባችሁን እንመልሳለን። ሙሉ ውሉን በተመላሽ ገንዘብ ፖሊሲ ገጻችን ላይ አንብቡ።',
  },
  {
    id: 'consultation',
    question: 'What happens in a 1-on-1 consultation?',
    question_am: 'በአንድ ለአንድ ምክክር ላይ ምን ይሆናል?',
    answer:
      'A 60-minute video call where we look at your actual business — your site, your ads, your numbers — and leave you with a written list of what to change first. You get the recording and the notes afterwards.',
    answer_am:
      'የ60 ደቂቃ የቪዲዮ ጥሪ ሲሆን የእናንተን ትክክለኛ ንግድ — ድረ-ገጻችሁን፣ ማስታወቂያዎቻችሁን፣ ቁጥሮቻችሁን — እንመለከትና መጀመሪያ ምን መቀየር እንዳለበት የተጻፈ ዝርዝር እንሰጣችኋለን። ቀረጻውንና ማስታወሻውን በኋላ ታገኛላችሁ።',
  },
  {
    id: 'certificate',
    question: 'Do I get a certificate?',
    question_am: 'የምስክር ወረቀት አገኛለሁ?',
    answer:
      'Yes, for every paid course you finish. Each certificate has a unique ID and a public verification link, so an employer can confirm it is real. You can download it as a PDF or add it to LinkedIn in one click.',
    answer_am:
      'አዎ፣ ለምትጨርሱት ለእያንዳንዱ የሚከፈልበት ኮርስ። እያንዳንዱ የምስክር ወረቀት ልዩ መለያ እና ይፋዊ የማረጋገጫ አገናኝ አለው፤ ስለዚህ ቀጣሪ እውነተኛ መሆኑን ማረጋገጥ ይችላል። እንደ PDF ማውረድ ወይም በአንድ ጠቅታ ወደ LinkedIn ማከል ትችላላችሁ።',
  },
];
