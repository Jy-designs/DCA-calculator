/* English and Spanish copy for the Recurring Buys page.
   Keys follow the Lokalise Website convention (sectionname::element::title, tag recurringbuy_post).
   Headings are written in sentence case; CSS sets them in capitals.
   Spanish is a first draft for the localisation team and legal to review. */
(() => {
  const STRINGS = {
    en: {
      'meta::title': 'Recurring Buys · Venga',
      'meta::description': 'Invest a fixed amount automatically, every week or month, and build your crypto over time.',
      'nav::skip': 'Skip to content',
      'nav::euro': 'EURO', 'nav::trade': 'TRADE', 'nav::earn': 'EARN', 'nav::about': 'ABOUT', 'nav::blog': 'BLOG',
      'nav::download': 'DOWNLOAD', 'nav::language': 'Change language', 'nav::menu': 'Menu',

      'hero::header::title': 'Set up your saving plan today',
      'hero::header::subtitle': 'Invest a fixed amount automatically, every week or month, and build your crypto over time.',
      'hero::cta::button': 'Start your recurring buy',
      'hero::illustration::asset_price': 'Asset Price',
      'hero::illustration::recurring_buys': 'Recurring buys',
      'hero::illustration::order_label': 'Recurring buy order:',
      'hero::illustration::order_value': '€100 Every Monday',

      'whatis::header::title': 'What is recurring buy?',
      'whatis::header::text': 'Recurring Buys are how you do DCA (dollar-cost averaging) on Venga. You set an amount and a schedule, and we buy crypto for you each time. When prices are lower, your money buys more. When they’re higher, it buys less. Over time, your purchase price averages out across all your buys.',
      'whatis::card1::title': 'You decide which coins to invest in',
      'whatis::card1::label': 'Over 150 coins to invest in',
      'whatis::card2::title': 'You decide when to invest',
      'whatis::card2::example1': 'Buying €250 on every 3rd.',
      'whatis::card2::example2': 'Buying €1000 every other Friday',
      'whatis::card2::example3': 'Buying €500 every Monday',
      'whatis::card3::title': 'You decide how much to invest',
      'whatis::card4::title': 'One time set up, we do the rest',
      'whatis::card4::this_year': 'This year',
      'whatis::card4::this_month': 'This month',
      'whatis::card4::you_invested': 'You invested',
      'whatis::card4::your_investment': 'Your investment',
      'whatis::card4::crypto_price': 'Crypto price',
      'whatis::card5::title': 'Set up more than one recurring buy',
      'whatis::card5::upcoming_buys': 'Upcoming buys',
      'whatis::card5::see_all': 'See all',
      'whatis::frequency::weekly': 'Weekly',
      'whatis::frequency::biweekly': 'Bi-weekly',
      'whatis::frequency::monthly': 'Monthly',


      'calculator::header::title': 'Set up a recurring buy',
      'calculator::header::subtitle': 'Pick a year and see what a recurring buy started then would be worth today.',
      'calculator::cta::button': 'Start your recurring buy',
      'calculator::field::asset': 'Crypto asset',
      'calculator::field::amount': 'Amount to invest',
      'calculator::field::custom': 'Other amount',
      'calculator::field::range': 'Between €10 and €10,000',
      'calculator::field::frequency': 'Frequency',
      'calculator::field::period': 'Start year',
      'calculator::result::invested': 'Total purchase amount',
      'calculator::result::value': 'Total value',
      'calculator::result::return': 'Return',
      'calculator::tooltip::invested': 'Invested',
      'calculator::tooltip::value': 'Value',
      'calculator::state::loading': 'Loading prices…',
      'calculator::state::error': 'We couldn’t load prices right now.',
      'calculator::state::retry': 'Try again',
      'calculator::summary': '{n} buys of {amount} {frequency} in {asset} from {start}: {invested} invested, worth {value} on {end} ({ret}).',
      'calculator::disclaimer::label': 'Disclaimer:',
      'calculator::disclaimer::text': 'This is a hypothetical example based on historical weekly prices in euros. It does not include fees or spreads. Past performance is not a reliable indicator of future results. Crypto-asset prices are highly volatile and you could lose all the money you invest. This is not investment advice.',
      'calculator::source::live': 'Price data: Kraken, weekly EUR prices, updated {date}.',
      'calculator::source::snapshot': 'Price data: Kraken, weekly EUR prices, saved on {date}. Live prices are unavailable.',

      'whyitworks::header::title': 'Why it works',
      'whyitworks::card1::title': 'Set and forget',
      'whyitworks::card1::text': 'Let’s be honest, it’s super convenient to set up your strategy once, and let it execute itself automatically. You don’t have to manage it manually anymore.',
      'whyitworks::card2::title': 'Mitigate volatility',
      'whyitworks::card2::text': 'If you’re concerned about the volatility of the market, setting up a DCA can help you with it. By investing on a frequent basis, you actually average out price movements.',
      'whyitworks::card3::title': 'DCA vs one time',
      'whyitworks::card3::text': 'A one-time buy invests your money all at once, at today’s price. A Recurring Buy splits it into smaller amounts over time, so you buy at different prices along the way.',
      'whyitworks::summary::text': 'In short, DCAs make investing in crypto simpler, less stressful and more strategic.',

      'setup::header::title': 'Setting up recurring buys',
      'setup::cta::button': 'Download the app',
      'setup::step1::title': 'Select the crypto you want to buy on repeat',
      'setup::step2::title': 'Choose how often you want to buy',
      'setup::step3::title': 'Set the amount',
      'setup::step4::title': 'Choose your payment method',
      'setup::step5::title': 'Review your order with no hidden charges',
      'setup::step6::title': 'Download the Venga app and invest in crypto',
      'setup::step1::alt': 'Venga app: choose a crypto from the list',
      'setup::step2::alt': 'Venga app: choose every week, every two weeks or every month',
      'setup::step3::alt': 'Venga app: set the amount in euros',
      'setup::step4::alt': 'Venga app: choose bank card or Apple Pay',
      'setup::step5::alt': 'Venga app: review your recurring buy for BTC',
      'setup::step6::alt': 'QR code to download the Venga app on iOS or Android',

      'benefits::header::title': 'Stop worrying about that perfect moment to invest in',
      'benefits::illustration::frequency': 'Every Monday',
      'benefits::point1::text': 'Skip the price-watching. DCA spreads your buys over time. You don’t need to check charts or guess where prices are heading.',
      'benefits::point2::text': 'Every week or month, your crypto is bought for you. Once your plan is set, there’s nothing to remember.',
      'benefits::point3::text': 'Start small, with an amount that fits your budget. Even small, regular amounts can build up over time.',
      'benefits::point4::text': 'Want to stop? Cancel in a few taps. There’s no lock-in and no commitment.',

      'blog::header::title': 'Still in doubt?',
      'blog::header::subtitle': 'Our blog breaks down the basics without breaking your brain.',
      'blog::article::button': 'Read Article',
      'blog::nav::prev': 'Previous article', 'blog::nav::next': 'Next article',
      'blog::article1::title': 'The Future of Crypto in the Next 5 Years: Coins, Trends, and Predictions',
      'blog::article1::text': 'Have you woken up to your crypto holdings either soaring or crashing? And wondered what they will look like by evening, in the next two days, weeks or what crypto will look like in the next five years?',
      'blog::article2::title': 'What Are Memecoins and Why Are They So Popular?',
      'blog::article2::text': 'Memecoins started as internet jokes. Here’s what they are, why prices can swing so much, and what to know before you buy.',
      'blog::article3::title': 'The Venga app is now available in Spanish',
      'blog::article3::text': 'You can now use every part of the Venga app in Spanish. Here’s how to switch your language in a couple of taps.',

      'trust::header::title': 'Keep your mind at peace',
      'trust::header::text1': 'Venga is headquartered in Barcelona, with a strong focus on creating a secure, transparent, and compliant platform.',
      'trust::header::text2': 'We’re committed to building trust and delivering a Europe-first experience.',
      'trust::card1::title': 'Regulated in the European Union',
      'trust::card1::text': 'Approved by the CNMV in Spain, holding a MiCA license to operate as a crypto-asset service provider in Europe.',
      'trust::card1::button': 'What is MiCA and what it means for you',
      'trust::card2::title': 'Your funds and data, protected.',
      'trust::card2::text': 'Encrypted transactions, secure account verification, and custody practices designed to keep your assets safe.',
      'trust::card2::button': 'More About Us',

      'features::header::title': 'What else can you do on Venga?',
      'features::header::text': 'Invest in digital assets effortlessly. Buy crypto, manage your funds, and generate yields inside a slick and intuitive interface.',
      'features::actions::buy': 'Buy', 'features::actions::sell': 'Sell', 'features::actions::swap': 'Swap', 'features::actions::earn': 'Earn',
      'features::cta::button': 'Download the app',

      'faq::header::title': 'DCA FAQ',
      'faq::header::text': 'Here is additional information to answer some of the common questions about Recurring Orders and how to benefit from them with Venga.',
      'faq::cta::button': 'More Questions?',

      'footer::download': 'Download', 'footer::newsletter': 'Get the weekly Venga Newsletter', 'footer::email': 'Enter your email address',
      'footer::general': 'General', 'footer::about': 'About', 'footer::careers': 'Working With Us', 'footer::events': 'Events', 'footer::glossary': 'Glossary', 'footer::blog': 'Blog',
      'footer::product': 'Product', 'footer::buy': 'Buy', 'footer::sell': 'Sell', 'footer::swap': 'Swap', 'footer::bundles': 'Bundles', 'footer::recurring': 'Recurring Buys', 'footer::earn': 'Earn', 'footer::cards': 'Cards', 'footer::api': 'API for Businesses',
      'footer::legal': 'Legal', 'footer::legal_hub': 'Legal Hub', 'footer::terms': 'Terms of Service', 'footer::privacy': 'Privacy Policy', 'footer::cookies': 'Cookies Policy', 'footer::whistle_policy': 'Whistleblowing Policy', 'footer::whistle_channel': 'Whistleblowing Channel', 'footer::chain_abuse': 'Chain Abuse',
      'footer::help': 'Help', 'footer::help_center': 'Help Center', 'footer::faqs': 'FAQs',
      'footer::community': 'Join our community',
      'footer::legal_text': 'Venga Europe SL (provider of the Venga App) is registered as a Virtual Asset Service Provider and Custodian with the Bank of Spain under registration number D945.'
    },

    es: {
      'meta::title': 'Compras recurrentes · Venga',
      'meta::description': 'Invierte una cantidad fija de forma automática, cada semana o cada mes, y ve acumulando cripto con el tiempo.',
      'nav::skip': 'Saltar al contenido',
      'nav::euro': 'EURO', 'nav::trade': 'OPERAR', 'nav::earn': 'EARN', 'nav::about': 'NOSOTROS', 'nav::blog': 'BLOG',
      'nav::download': 'DESCARGAR', 'nav::language': 'Cambiar idioma', 'nav::menu': 'Menú',

      'hero::header::title': 'Crea hoy tu plan de ahorro',
      'hero::header::subtitle': 'Invierte una cantidad fija de forma automática, cada semana o cada mes, y ve acumulando cripto con el tiempo.',
      'hero::cta::button': 'Empieza tu compra recurrente',
      'hero::illustration::asset_price': 'Precio del activo',
      'hero::illustration::recurring_buys': 'Compras recurrentes',
      'hero::illustration::order_label': 'Orden de compra recurrente:',
      'hero::illustration::order_value': '100 € cada lunes',

      'whatis::header::title': '¿Qué es la compra recurrente?',
      'whatis::header::text': 'Las compras recurrentes son la forma de hacer DCA (promediar el coste de compra, del inglés «dollar-cost averaging») en Venga. Tú eliges un importe y una frecuencia, y nosotros compramos cripto por ti cada vez. Cuando los precios bajan, tu dinero compra más; cuando suben, compra menos. Con el tiempo, tu precio de compra se promedia entre todas tus compras.',
      'whatis::card1::title': 'Tú decides en qué monedas invertir',
      'whatis::card1::label': 'Más de 150 monedas para invertir',
      'whatis::card2::title': 'Tú decides cuándo invertir',
      'whatis::card2::example1': '250 € cada día 3',
      'whatis::card2::example2': '1000 € cada dos viernes',
      'whatis::card2::example3': '500 € cada lunes',
      'whatis::card3::title': 'Tú decides cuánto invertir',
      'whatis::card4::title': 'Lo configuras una vez y nosotros hacemos el resto',
      'whatis::card4::this_year': 'Este año',
      'whatis::card4::this_month': 'Este mes',
      'whatis::card4::you_invested': 'Has invertido',
      'whatis::card4::your_investment': 'Tu inversión',
      'whatis::card4::crypto_price': 'Precio de la cripto',
      'whatis::card5::title': 'Configura más de una compra recurrente',
      'whatis::card5::upcoming_buys': 'Próximas compras',
      'whatis::card5::see_all': 'Ver todas',
      'whatis::frequency::weekly': 'Semanal',
      'whatis::frequency::biweekly': 'Quincenal',
      'whatis::frequency::monthly': 'Mensual',


      'calculator::header::title': 'Configura una compra recurrente',
      'calculator::header::subtitle': 'Elige un año y descubre cuánto valdría hoy una compra recurrente que hubieras empezado entonces.',
      'calculator::cta::button': 'Empieza tu compra recurrente',
      'calculator::field::asset': 'Criptoactivo',
      'calculator::field::amount': 'Importe a invertir',
      'calculator::field::custom': 'Otro importe',
      'calculator::field::range': 'Entre 10 € y 10.000 €',
      'calculator::field::frequency': 'Frecuencia',
      'calculator::field::period': 'Año de inicio',
      'calculator::result::invested': 'Importe total invertido',
      'calculator::result::value': 'Valor total',
      'calculator::result::return': 'Rentabilidad',
      'calculator::tooltip::invested': 'Invertido',
      'calculator::tooltip::value': 'Valor',
      'calculator::state::loading': 'Cargando precios…',
      'calculator::state::error': 'No hemos podido cargar los precios.',
      'calculator::state::retry': 'Reintentar',
      'calculator::summary': '{n} compras de {amount} con frecuencia {frequency} en {asset} desde {start}: {invested} invertidos, con un valor de {value} el {end} ({ret}).',
      'calculator::disclaimer::label': 'Aviso:',
      'calculator::disclaimer::text': 'Este es un ejemplo hipotético basado en precios semanales históricos en euros. No incluye comisiones ni diferenciales. Las rentabilidades pasadas no son un indicador fiable de rentabilidades futuras. Los precios de los criptoactivos son muy volátiles y podrías perder todo el dinero que inviertas. Esto no es asesoramiento de inversión.',
      'calculator::source::live': 'Datos de precios: Kraken, precios semanales en EUR, actualizados el {date}.',
      'calculator::source::snapshot': 'Datos de precios: Kraken, precios semanales en EUR, guardados el {date}. Los precios en directo no están disponibles.',

      'whyitworks::header::title': 'Por qué funciona',
      'whyitworks::card1::title': 'Configúralo y olvídate',
      'whyitworks::card1::text': 'Seamos sinceros: es muy cómodo definir tu estrategia una vez y dejar que se ejecute sola. Ya no tienes que gestionarla manualmente.',
      'whyitworks::card2::title': 'Suaviza la volatilidad',
      'whyitworks::card2::text': 'Si te preocupa la volatilidad del mercado, un DCA puede ayudarte. Al invertir con frecuencia, promedias los movimientos del precio.',
      'whyitworks::card3::title': 'DCA o compra única',
      'whyitworks::card3::text': 'Una compra única invierte todo tu dinero de golpe, al precio de hoy. Una compra recurrente lo divide en importes más pequeños a lo largo del tiempo, así que compras a distintos precios por el camino.',
      'whyitworks::summary::text': 'En resumen, el DCA hace que invertir en cripto sea más sencillo, menos estresante y más estratégico.',

      'setup::header::title': 'Configura tus compras recurrentes',
      'setup::cta::button': 'Descarga la app',
      'setup::step1::title': 'Elige la cripto que quieres comprar de forma periódica',
      'setup::step2::title': 'Elige cada cuánto quieres comprar',
      'setup::step3::title': 'Fija el importe',
      'setup::step4::title': 'Elige tu método de pago',
      'setup::step5::title': 'Revisa tu orden, sin comisiones ocultas',
      'setup::step6::title': 'Descarga la app de Venga e invierte en cripto',
      'setup::step1::alt': 'App de Venga: elige una cripto de la lista',
      'setup::step2::alt': 'App de Venga: elige cada semana, cada dos semanas o cada mes',
      'setup::step3::alt': 'App de Venga: fija el importe en euros',
      'setup::step4::alt': 'App de Venga: elige tarjeta bancaria o Apple Pay',
      'setup::step5::alt': 'App de Venga: revisa tu compra recurrente de BTC',
      'setup::step6::alt': 'Código QR para descargar la app de Venga en iOS o Android',

      'benefits::header::title': 'Deja de preocuparte por encontrar el momento perfecto para invertir',
      'benefits::illustration::frequency': 'Cada lunes',
      'benefits::point1::text': 'Olvídate de vigilar el precio. El DCA reparte tus compras en el tiempo. No necesitas mirar gráficos ni adivinar hacia dónde va el precio.',
      'benefits::point2::text': 'Cada semana o cada mes, compramos tu cripto por ti. Una vez configurado tu plan, no tienes que acordarte de nada.',
      'benefits::point3::text': 'Empieza con poco, con un importe que encaje en tu presupuesto. Incluso importes pequeños y regulares pueden sumar con el tiempo.',
      'benefits::point4::text': '¿Quieres parar? Cancela en unos pocos toques. Sin permanencia ni compromiso.',

      'blog::header::title': '¿Aún tienes dudas?',
      'blog::header::subtitle': 'Nuestro blog te explica lo básico sin que te explote la cabeza.',
      'blog::article::button': 'Leer artículo',
      'blog::nav::prev': 'Artículo anterior', 'blog::nav::next': 'Artículo siguiente',
      'blog::article1::title': 'El futuro de las criptomonedas en los próximos 5 años: monedas, tendencias y predicciones',
      'blog::article1::text': '¿Te has levantado alguna vez y has visto que tus criptos se habían disparado o desplomado? ¿Y te has preguntado cómo estarán esta noche, dentro de dos días, de unas semanas o cómo será el mundo cripto dentro de cinco años?',
      'blog::article2::title': 'Qué son las memecoins y por qué son tan populares',
      'blog::article2::text': 'Las memecoins nacieron como bromas de internet. Te contamos qué son, por qué su precio puede variar tanto y qué debes saber antes de comprar.',
      'blog::article3::title': 'La app de Venga ya está disponible en español',
      'blog::article3::text': 'Ya puedes usar toda la app de Venga en español. Te explicamos cómo cambiar el idioma en un par de toques.',

      'trust::header::title': 'Invierte con tranquilidad',
      'trust::header::text1': 'Venga tiene su sede en Barcelona y se centra en crear una plataforma segura, transparente y que cumple la normativa.',
      'trust::header::text2': 'Nos comprometemos a generar confianza y a ofrecer una experiencia pensada primero para Europa.',
      'trust::card1::title': 'Regulados en la Unión Europea',
      'trust::card1::text': 'Autorizados por la CNMV en España, con licencia MiCA para operar como proveedor de servicios de criptoactivos en Europa.',
      'trust::card1::button': 'Qué es MiCA y qué significa para ti',
      'trust::card2::title': 'Tus fondos y tus datos, protegidos.',
      'trust::card2::text': 'Transacciones cifradas, verificación segura de la cuenta y prácticas de custodia pensadas para mantener tus activos a salvo.',
      'trust::card2::button': 'Más sobre nosotros',

      'features::header::title': '¿Qué más puedes hacer en Venga?',
      'features::header::text': 'Invierte en activos digitales sin complicaciones. Compra cripto, gestiona tus fondos y genera rendimientos desde una interfaz ágil e intuitiva.',
      'features::actions::buy': 'Comprar', 'features::actions::sell': 'Vender', 'features::actions::swap': 'Intercambiar', 'features::actions::earn': 'Earn',
      'features::cta::button': 'Descarga la app',

      'faq::header::title': 'FAQ DCA',
      'faq::header::text': 'Aquí tienes más información para resolver las preguntas más habituales sobre las órdenes recurrentes y cómo sacarles partido con Venga.',
      'faq::cta::button': '¿Más preguntas?',

      'footer::download': 'Descargar', 'footer::newsletter': 'Recibe la newsletter semanal de Venga', 'footer::email': 'Introduce tu email',
      'footer::general': 'General', 'footer::about': 'Sobre nosotros', 'footer::careers': 'Trabaja con nosotros', 'footer::events': 'Eventos', 'footer::glossary': 'Glosario', 'footer::blog': 'Blog',
      'footer::product': 'Producto', 'footer::buy': 'Comprar', 'footer::sell': 'Vender', 'footer::swap': 'Intercambiar', 'footer::bundles': 'Bundles', 'footer::recurring': 'Compras recurrentes', 'footer::earn': 'Earn', 'footer::cards': 'Tarjetas', 'footer::api': 'API para empresas',
      'footer::legal': 'Legal', 'footer::legal_hub': 'Centro legal', 'footer::terms': 'Términos del servicio', 'footer::privacy': 'Política de privacidad', 'footer::cookies': 'Política de cookies', 'footer::whistle_policy': 'Política del canal de denuncias', 'footer::whistle_channel': 'Canal de denuncias', 'footer::chain_abuse': 'Chain Abuse',
      'footer::help': 'Ayuda', 'footer::help_center': 'Centro de ayuda', 'footer::faqs': 'Preguntas frecuentes',
      'footer::community': 'Únete a nuestra comunidad',
      'footer::legal_text': 'Venga Europe SL (proveedor de la app de Venga) está registrada como proveedor de servicios de activos virtuales y custodio en el Banco de España con el número de registro D945.'
    }
  };

  /* FAQ: there are no answers in Figma. These are drafts for Product and Legal to confirm;
     the two marked [TBC] need real facts before anything goes live. */
  const FAQ = {
    en: [
      ['What is DCA in crypto?', 'DCA (dollar-cost averaging) means investing a fixed amount at regular intervals, whatever the price. Over time, your purchase price averages out across all your buys.'],
      ['Can I cancel and edit once I set it up?', 'Yes. You can edit or cancel a recurring buy from the app at any time. There’s no lock-in and no commitment.'],
      ['What are the fees?', '[TBC by Product/Legal: the fees that apply to each recurring buy, and where users see them before confirming.]'],
      ['How do recurring crypto orders work?', 'Choose a crypto, how often to buy and how much. Venga then places the buy for you on each scheduled date, using the payment method you chose.'],
      ['Why do people use Dollar Cost Averaging?', 'Because it takes away the need to time the market. Buying at regular intervals spreads your purchases across different prices, which can soften the effect of short-term swings. It doesn’t remove the risk of losing money.'],
      ['Is DCA a good strategy for crypto beginners?', 'Many beginners like DCA because it’s simple and you don’t need to watch the market. Crypto prices still move a lot and you can lose money, so only invest what you can afford to lose.'],
      ['What is the best time to set up a crypto DCA?', 'There’s no perfect moment, and that’s the idea behind DCA: you invest regularly instead of trying to guess the best time.'],
      ['How much should I invest when using DCA?', 'That depends on your own situation. Choose an amount you’re comfortable with and could afford to lose. We can’t give personal investment advice.'],
      ['Why automate my crypto investments?', 'Automation keeps your plan consistent: your buys happen on schedule, without you having to remember them or react to price moves.'],
      ['When will Venga launch recurring orders?', '[TBC by Product: launch date or availability.]']
    ],
    es: [
      ['¿Qué es el DCA en cripto?', 'DCA (promediar el coste de compra) significa invertir una cantidad fija a intervalos regulares, sea cual sea el precio. Con el tiempo, tu precio de compra se promedia entre todas tus compras.'],
      ['¿Puedo cancelarla o editarla una vez configurada?', 'Sí. Puedes editar o cancelar una compra recurrente desde la app en cualquier momento. Sin permanencia ni compromiso.'],
      ['¿Qué comisiones tiene?', '[Pendiente de Producto/Legal: las comisiones de cada compra recurrente y dónde las ve el usuario antes de confirmar.]'],
      ['¿Cómo funcionan las órdenes recurrentes de cripto?', 'Elige una cripto, cada cuánto quieres comprar y cuánto. Venga realiza la compra por ti en cada fecha programada con el método de pago que hayas elegido.'],
      ['¿Por qué se usa el DCA?', 'Porque evita tener que acertar con el momento del mercado. Comprar a intervalos regulares reparte tus compras entre distintos precios, lo que puede suavizar el efecto de las oscilaciones a corto plazo. No elimina el riesgo de perder dinero.'],
      ['¿Es el DCA una buena estrategia para principiantes en cripto?', 'Muchos principiantes eligen el DCA porque es sencillo y no hace falta vigilar el mercado. Aun así, el precio de las criptos varía mucho y puedes perder dinero, así que invierte solo lo que puedas permitirte perder.'],
      ['¿Cuál es el mejor momento para empezar un DCA en cripto?', 'No existe el momento perfecto, y esa es la idea del DCA: inviertes con regularidad en lugar de intentar adivinar cuál es el mejor momento.'],
      ['¿Cuánto debería invertir con DCA?', 'Depende de tu situación. Elige un importe con el que te sientas cómodo y que puedas permitirte perder. No podemos darte asesoramiento de inversión personalizado.'],
      ['¿Por qué automatizar mis inversiones en cripto?', 'Automatizar mantiene tu plan constante: tus compras se hacen según lo programado, sin que tengas que acordarte ni reaccionar a los movimientos del precio.'],
      ['¿Cuándo lanzará Venga las órdenes recurrentes?', '[Pendiente de Producto: fecha de lanzamiento o disponibilidad.]']
    ]
  };

  const LOCALES = { en: 'en-GB', es: 'es-ES' };
  const FLAGS = { en: 'assets/v2/flag-uk.svg', es: 'assets/v2/flag-es.svg' };
  const KEY = 'venga-lang';
  const listeners = [];

  const pick = () => {
    const q = new URLSearchParams(location.search).get('lang');
    if (q && STRINGS[q]) return q;
    try { const s = localStorage.getItem(KEY); if (s && STRINGS[s]) return s; } catch (e) {}
    return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  };

  let lang = pick();
  const t = k => (STRINGS[lang] && STRINGS[lang][k]) ?? STRINGS.en[k] ?? k;
  const money = (n, dec = 2) => new Intl.NumberFormat(LOCALES[lang], { style: 'currency', currency: 'EUR', minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);
  const percent = n => (n >= 0 ? '+' : '') + new Intl.NumberFormat(LOCALES[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n) + (lang === 'es' ? ' %' : '%');

  function renderFaq() {
    const list = document.getElementById('faq-list');
    if (!list) return;
    const open = [...list.querySelectorAll('.qa.is-open')].map(el => +el.dataset.i);
    list.innerHTML = FAQ[lang].map(([q, a], i) => `
      <div class="qa${open.includes(i) ? ' is-open' : ''}" data-i="${i}">
        <button class="qa__q" type="button" aria-expanded="${open.includes(i)}" aria-controls="qa-${i}" id="qa-q-${i}">
          <span>${q}</span><img src="assets/v2/faq-chevron.svg" width="33" height="33" alt="">
        </button>
        <div class="qa__a" id="qa-${i}" role="region" aria-labelledby="qa-q-${i}"><div><p>${a}</p></div></div>
      </div>`).join('');
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n);
      if (el.hasAttribute('data-words')) { el.dataset.text = v; } else { el.textContent = v; }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      // "attr:key;attr:key" — keys contain "::", so split on the first colon only
      el.dataset.i18nAttr.split(';').forEach(pair => { const i = pair.indexOf(':'); el.setAttribute(pair.slice(0, i), t(pair.slice(i + 1))); });
    });
    document.querySelectorAll('[data-money]').forEach(el => { el.textContent = money(+el.dataset.money, el.dataset.dec !== undefined ? +el.dataset.dec : 2); });
    renderFaq();
    const btn = document.querySelector('.lang__btn');
    if (btn) {
      btn.querySelector('.lang__code').textContent = lang.toUpperCase();
      btn.querySelector('.lang__flag').src = FLAGS[lang];
    }
    document.querySelectorAll('.lang__list [data-lang]').forEach(li => li.setAttribute('aria-selected', li.dataset.lang === lang));
    listeners.forEach(fn => fn(lang));
  }

  function set(next) {
    if (!STRINGS[next] || next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return apply();
    document.body.classList.add('is-switching');
    setTimeout(() => { apply(); requestAnimationFrame(() => document.body.classList.remove('is-switching')); }, 200);
  }

  const tf = (k, vars = {}) => t(k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? '');
  window.i18n = { get lang() { return lang; }, get locale() { return LOCALES[lang]; }, t, tf, money, percent, set, onChange: fn => listeners.push(fn), apply };
})();
