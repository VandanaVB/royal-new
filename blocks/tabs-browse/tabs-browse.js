/**
 * Motorcycle catalog — ordered flat list of all bikes across categories.
 * Arrows cycle through ALL bikes; category tab auto-switches.
 */
const CATEGORIES = ['Cruiser', 'Adventure', 'Roadster', 'Pure Sport', 'Heritage'];

const ALL_BIKES = [
  // Cruiser
  {
    name: 'Meteor 350', category: 'Cruiser', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/meteor-350-black-home.webp', url: '/in/en/motorcycles/meteor/', configUrl: 'https://makeityours.royalenfield.com/configurator/meteor-350', testRideId: 'VMT81FL',
  },
  {
    name: 'Super Meteor 650', category: 'Cruiser', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/super-meteor-650.webp', url: '/in/en/motorcycles/super-meteor-650/', configUrl: 'https://makeityours.royalenfield.com/configurator/super-meteor-650', testRideId: 'VSM81JQ',
  },
  // Adventure
  {
    name: 'Scram 440', category: 'Adventure', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/header/scram-440-new-motorcycle.webp', url: '/in/en/motorcycles/scram-440/', configUrl: 'https://makeityours.royalenfield.com/configurator/scram-440', testRideId: 'VSC81EH',
  },
  {
    name: 'Himalayan 450', category: 'Adventure', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/himalayan-450.webp', url: '/in/en/motorcycles/new-himalayan/', configUrl: 'https://makeityours.royalenfield.com/configurator/himalayan-450', testRideId: 'VHL81GH',
  },
  {
    name: 'Bear 650', category: 'Adventure', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/bear-650.webp', url: '/in/en/motorcycles/bear-650/', configUrl: 'https://makeityours.royalenfield.com/configurator/bear-650', testRideId: 'VBR81KD',
  },
  // Roadster
  {
    name: 'Hunter 350', category: 'Roadster', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/hunter-350.webp', url: '/in/en/motorcycles/hunter-350/', configUrl: 'https://makeityours.royalenfield.com/configurator/hunter-350', testRideId: 'VHT81CF',
  },
  {
    name: 'Guerrilla 450', category: 'Roadster', img: 'https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/guerrilla-450/new/home/motorcycle-home-red.webp', url: '/in/en/motorcycles/guerrilla-450/', configUrl: 'https://makeityours.royalenfield.com/configurator/guerrilla-450', testRideId: 'VGR81LD',
  },
  {
    name: 'Shotgun 650', category: 'Roadster', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/shotgun-650.webp', url: '/in/en/motorcycles/shotgun-650/', configUrl: 'https://makeityours.royalenfield.com/configurator/shotgun-650', testRideId: 'VSG81HK',
  },
  // Pure Sport
  {
    name: 'Interceptor 650', category: 'Pure Sport', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/interceptor.webp', url: '/in/en/motorcycles/interceptor/', configUrl: 'https://makeityours.royalenfield.com/configurator/interceptor-650', testRideId: 'VIN81BF',
  },
  {
    name: 'Continental GT 650', category: 'Pure Sport', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/continental-gt-650.webp', url: '/in/en/motorcycles/continental-gt/', configUrl: 'https://makeityours.royalenfield.com/configurator/continental-gt-650', testRideId: 'VCG81AF',
  },
  // Heritage
  {
    name: 'Goan Classic 350', category: 'Heritage', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/goan-classic-350.webp', url: '/in/en/motorcycles/goan-classic-350/', configUrl: 'https://makeityours.royalenfield.com/configurator/goan-350', testRideId: 'VGCL81JB',
  },
  {
    name: 'Classic 350', category: 'Heritage', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/classic-350.webp', url: '/in/en/motorcycles/classic-350/', configUrl: 'https://makeityours.royalenfield.com/configurator/classic-350', testRideId: 'VCL81DF',
  },
  {
    name: 'Bullet 350', category: 'Heritage', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/bullet-350.webp', url: '/in/en/motorcycles/bullet-350/', configUrl: 'https://makeityours.royalenfield.com/configurator/bullet-350', testRideId: 'VBT81EF',
  },
  {
    name: 'Classic 650', category: 'Heritage', img: 'https://www.royalenfield.com/content/dam/royal-enfield-revamp/motorcycles/home/webp/classic-650.webp', url: '/in/en/motorcycles/classic-650/', configUrl: 'https://makeityours.royalenfield.com/configurator/classic-650', testRideId: 'VCL681IF',
  },
];

const ARROW_SVG = 'https://www.royalenfield.com/content/dam/core-components-examples/Vector.svg';

export default async function decorate(block) {
  // Clear authored content — we build everything dynamically
  block.innerHTML = '';

  // ── Heading ──
  const heading = document.createElement('h2');
  heading.className = 'tabs-browse-heading';
  heading.textContent = 'Motorcycles';
  block.appendChild(heading);

  // ── Category tabs (no ARIA tab panels — single shared view) ──
  const tabRow = document.createElement('div');
  tabRow.className = 'tb-cat-tabs';

  // Clone last category before first so left side isn't empty on load
  const catLeadClone = document.createElement('div');
  catLeadClone.className = 'tb-cat-clone';
  catLeadClone.textContent = CATEGORIES[CATEGORIES.length - 1];
  tabRow.appendChild(catLeadClone);

  const catBtns = CATEGORIES.map((cat) => {
    const btn = document.createElement('button');
    btn.className = 'tb-cat-btn';
    btn.type = 'button';
    btn.textContent = cat;
    btn.dataset.category = cat;
    tabRow.appendChild(btn);
    return btn;
  });

  // Clone first category after last so right side isn't empty at end
  const catTrailClone = document.createElement('div');
  catTrailClone.className = 'tb-cat-clone';
  const [firstCat] = CATEGORIES;
  catTrailClone.textContent = firstCat;
  tabRow.appendChild(catTrailClone);
  block.appendChild(tabRow);

  // ── Separator line with bracket highlight ──
  const separator = document.createElement('div');
  separator.className = 'tb-separator';
  const bracket = document.createElement('div');
  bracket.className = 'tb-bracket';
  separator.appendChild(bracket);
  block.appendChild(separator);

  // ── Bike name row: prev arrow + names + next arrow ──
  const nameNav = document.createElement('div');
  nameNav.className = 'tb-name-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'tb-name-arrow tb-name-prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous bike');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'tb-name-arrow tb-name-next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next bike');

  const nameTrack = document.createElement('div');
  nameTrack.className = 'tb-name-track';

  // Clone last bike name before first so left side shows context
  const nameLeadClone = document.createElement('div');
  nameLeadClone.className = 'tb-name-clone';
  nameLeadClone.textContent = ALL_BIKES[ALL_BIKES.length - 1].name;
  nameTrack.appendChild(nameLeadClone);

  const nameBtns = ALL_BIKES.map((bike, i) => {
    const btn = document.createElement('button');
    btn.className = 'tb-name-btn';
    btn.type = 'button';
    btn.textContent = bike.name;
    btn.dataset.index = i;
    nameTrack.appendChild(btn);
    return btn;
  });

  // Clone first bike name after last so right side shows context
  const nameTrailClone = document.createElement('div');
  nameTrailClone.className = 'tb-name-clone';
  nameTrailClone.textContent = ALL_BIKES[0].name;
  nameTrack.appendChild(nameTrailClone);

  nameNav.appendChild(prevBtn);
  nameNav.appendChild(nameTrack);
  nameNav.appendChild(nextBtn);
  block.appendChild(nameNav);

  // ── Bike image ──
  const imgWrap = document.createElement('div');
  imgWrap.className = 'tb-bike-img';
  const img = document.createElement('img');
  img.loading = 'lazy';
  imgWrap.appendChild(img);
  block.appendChild(imgWrap);

  // ── CTAs ──
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'tb-bike-ctas';

  const knowMore = document.createElement('a');
  knowMore.className = 'tb-cta-know';
  knowMore.textContent = 'Know More';

  const configure = document.createElement('a');
  configure.className = 'tb-cta-configure';
  configure.textContent = 'CONFIGURE NOW';

  const testRide = document.createElement('a');
  testRide.className = 'tb-cta-testride';

  ctaWrap.appendChild(knowMore);
  ctaWrap.appendChild(configure);
  ctaWrap.appendChild(testRide);
  block.appendChild(ctaWrap);

  // ── State ──
  let currentIdx = 0;

  const goToBike = (idx) => {
    let target = idx;
    if (target < 0) target = ALL_BIKES.length - 1;
    if (target >= ALL_BIKES.length) target = 0;
    currentIdx = target;

    const bike = ALL_BIKES[currentIdx];

    // Update category tabs
    const activeCatIdx = CATEGORIES.indexOf(bike.category);
    catBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === activeCatIdx);
    });
    // Scroll category tabs so active is centered
    // Spacer at start = 33.33% of clientWidth, so scrollLeft = index * itemWidth
    const catItemW = catBtns[0]?.offsetWidth || tabRow.clientWidth / 3;
    tabRow.scrollTo({ left: activeCatIdx * catItemW, behavior: 'smooth' });

    // Update name buttons
    nameBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === currentIdx);
    });

    // Scroll name track so active is centered
    const nameItemW = nameBtns[0]?.offsetWidth || nameTrack.clientWidth / 3;
    nameTrack.scrollTo({ left: currentIdx * nameItemW, behavior: 'smooth' });

    // Update image
    img.src = bike.img;
    img.alt = bike.name;

    // Update CTAs
    knowMore.href = bike.url;
    configure.href = bike.configUrl;
    testRide.href = `/in/en/forms/book-a-test-ride?modelId=${bike.testRideId}`;
    testRide.innerHTML = `BOOK A TEST RIDE <img src="${ARROW_SVG}" alt="" class="tb-cta-arrow">`;
  };

  // ── Event listeners ──
  prevBtn.addEventListener('click', () => goToBike(currentIdx - 1));
  nextBtn.addEventListener('click', () => goToBike(currentIdx + 1));

  nameBtns.forEach((btn) => {
    btn.addEventListener('click', () => goToBike(Number(btn.dataset.index)));
  });

  // Category tab click → jump to first bike of that category
  catBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const firstIdx = ALL_BIKES.findIndex((b) => b.category === btn.dataset.category);
      if (firstIdx >= 0) goToBike(firstIdx);
    });
  });

  // Initialize to first bike
  goToBike(0);
}
