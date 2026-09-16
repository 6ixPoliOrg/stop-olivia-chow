import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import heroImage from "@/assets/olivia-chow-hero.jpg";
import taxImage from "@/assets/issue-tax.jpg";
import vacantImage from "@/assets/issue-vacant-home.jpg";
import gridlockImage from "@/assets/issue-gridlock.jpg";
import policeImage from "@/assets/issue-police.jpg";
import housingImage from "@/assets/issue-housing.jpg";
import encampmentImage from "@/assets/issue-encampment.jpg";
import binsImage from "@/assets/issue-bins.jpg";
import squareImage from "@/assets/issue-square.jpg";
import scienceImage from "@/assets/issue-science-centre.jpg";
import cityHallImage from "@/assets/issue-city-hall.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stop Olivia Chow | Toronto Election 2026" },
      { name: "description", content: "An independent Toronto residents’ campaign reviewing Mayor Olivia Chow’s record, with sources." },
      { property: "og:title", content: "Stop Olivia Chow | Toronto Election 2026" },
      { property: "og:description", content: "The record of Mayor Olivia Chow’s three years, in plain language, with sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const rawHtml = `
<a class="skip" href="#record">Skip to the record</a>

<!-- Red banner, same device as the reference sites, but stating what this actually is. -->
<div class="banner" role="note">Stop Chow is an independent residents’ campaign in Toronto. It is not affiliated with the City of Toronto or with any candidate.</div>

<header class="site-head">
  <div class="wrap bar">
    <a class="wordmark" href="#top"><span class="stop">Stop</span><span>Olivia Chow</span></a>
    <button class="menu-btn" type="button" aria-controls="menu" aria-expanded="false" id="menuOpen">
      <span class="lines" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span>
    </button>
  </div>
</header>

<div class="menu" id="menu" aria-hidden="true">
  <div class="top">
    <span class="wordmark"><span class="stop">Stop</span><span>Olivia Chow</span></span>
    <button class="close" type="button" id="menuClose">Close</button>
  </div>
  <nav aria-label="Site">
    <a href="#front">The case</a>
    <a href="#record">The record</a>
    <a href="#sources">Sources</a>
    <a href="#join" class="red">Join the coalition</a>
  </nav>
  <p class="fine">Municipal election: October 26, 2026. City of Toronto.</p>
</div>

<main id="top">

<!-- ====================== HERO ====================== -->
<section class="hero" aria-labelledby="heroTitle">
  <figure class="photo"><img src="__heroImage__" alt="Olivia Chow in downtown Toronto at night" fetchpriority="high"></figure>
  <div class="wrap">
    <h1 class="display lockup" id="heroTitle"><span class="y">Toronto is</span><span class="y">falling</span><span class="r">apart</span></h1>
    <p class="sub">Mayor Olivia Chow, one year into the job, on the state of the city she runs. Two years and a 19% property-tax increase later, the list of what does not work in Toronto is longer, not shorter.</p>
  </div>
</section>

<!-- ====================== FRONT PAGE COPY ====================== -->
<section class="front" id="front" aria-labelledby="frontTitle">
  <div class="wrap">
    <h2 class="kicker" id="frontTitle">The case</h2>
    <p class="lede">The mayor is the CEO of the city. The job is basic: keep taxes fair, keep the streets moving, keep people housed and safe, and keep the promises you made to get the job. Olivia Chow has had three budgets and three years. On each of those tests, Toronto is worse off or no better.</p>
    <p>Property taxes are up about 19% across her three budgets, after she promised a “modest” increase. Then, in the election year, the increase dropped to 2.2%, propped up by roughly $550 million drawn from reserves.</p>
    <p>Traffic is worse. Almost nine in ten residents call gridlock serious, and seven in ten say the City manages road work badly. Her answer, three years in, was to hire a chief congestion officer.</p>
    <p>Homebuilding fell to a 30-year low. The number of people without a home doubled between 2021 and 2024. Tents stayed in parks beside playgrounds, and neighbourhoods learned where the next shelter would go after the site was chosen.</p>
    <p>When she got things wrong, the pattern repeated: announce, get caught, apologize, move on. The Vacant Home Tax sent bills to more than 167,000 homes, the vast majority of them lived in. Her first police budget was reversed within weeks. Her missed October 7 vigil came with three different excuses.</p>
    <p>Her supporters point to a fare freeze, a highway upload, and a credit-rating bump. Residents point to the bins, the buses, the tents, and the tax bill.</p>
    <p>After three years, the question is not whether Olivia Chow deserves credit for trying.</p>
    <p><strong>It is whether Toronto can afford four more years of the same.</strong></p>

    <div class="verdict">
      <p class="display">Toronto deserves a mayor who does the basics.<br><span class="r">She has not earned four more years.</span></p>
    </div>

    <div class="ctas">
      <a class="btn btn-red" href="#record">See the record <span class="arrow">&rarr;</span></a>
      <a class="btn btn-ghost" href="#join">Join the coalition</a>
    </div>

    <p class="note"><span class="flag">Note</span><span>This is a concerned citizen website. Every claim links to its source. Always check the sources at the bottom.</span></p>
  </div>
</section>

<!-- ====================== THE RECORD ====================== -->
<section id="record" aria-labelledby="recordTitle">
  <div class="wrap record-head">
    <p class="kicker">Three years as mayor</p>
    <h2 class="display" id="recordTitle">The record</h2>
    <p>Ten issues. Each one has what happened, why it matters, and a plain-language version. Sources are linked in each section and listed in full at the bottom of the page.</p>
  </div>

  <!-- 1 -->
  <article class="issue wrap" id="issue-1">
    <figure class="photo"><img src="__taxImage__" alt="Property tax bill and calculator on a Toronto kitchen table" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">01 <em>/ 10</em></span><span class="kicker topic">Taxes and spending</span></div>
    <h2 class="display">She promised “modest.” Your property tax is up 19%.</h2>
    <h3>What happened</h3>
    <p>In May 2023, asked how much taxes would rise if she won, Olivia Chow said: “It would be modest in terms of increase because affordability is something big in my platform.”</p>
    <p>Her first budget raised residential property tax 9.5%, the largest increase since amalgamation, about $338 on an average home. Her second raised it another 6.9%. Her third, in the election year, came in at 2.2%.</p>

    <div class="taxstrip" role="img" aria-label="Residential property tax increases by budget year. 2023: 7.0%, passed under John Tory, not counted. 2024: 9.5%, largest since amalgamation. 2025: 6.9%. 2026: 2.2%, election year.">
      <div class="row tory"><span class="yr">2023</span><span class="track"><span class="bar" style="--v:70"></span><span class="pct">7.0%</span></span><span class="tag">John Tory’s budget. Not counted.</span></div>
      <div class="row"><span class="yr">2024</span><span class="track"><span class="bar" style="--v:95"></span><span class="pct">9.5%</span></span><span class="tag">Largest since amalgamation</span></div>
      <div class="row"><span class="yr">2025</span><span class="track"><span class="bar" style="--v:69"></span><span class="pct">6.9%</span></span></div>
      <div class="row"><span class="yr">2026</span><span class="track"><span class="bar" style="--v:22"></span><span class="pct">2.2%</span></span><span class="tag">Election year</span></div>
      <p class="cap">Combined residential municipal increase, including the 1.5% City Building Fund levy. Source: City of Toronto budget releases.</p>
    </div>

    <p>Across the three budgets she has passed, the increase is about 19%. That figure leaves out the 7% increase in 2023. That one was John Tory’s budget, not hers.</p>
    <p>The 2026 budget leaned on roughly $550 million from City reserves to hold the rate down. The City’s operating budget grew from $16.2 billion to $18.9 billion over the same three years.</p>
    <p>On September 4, 2026, she pledged to keep future increases “at or around” inflation. Councillor Brad Bradford’s response: she promised modest before, and “voters have every reason not to take her word for it this time either.”</p>

    <div class="vs">
      <div class="claim"><span class="lbl">The claim</span><p>A “modest” increase.</p></div>
      <div class="rec"><span class="lbl">The record</span><p>9.5%, then 6.9%, then 2.2% in the election year. About 19% in three budgets.</p></div>
    </div>

    <h3>Why it matters</h3>
    <p>Toronto’s housing costs already push families out. A mayor who says “modest” and then delivers the biggest increase in a generation has broken the one promise everyone heard. Easing off only in the election year, with money from reserves, invites an obvious question about what comes after October 26.</p>
    <div class="simple"><h3>The simple version</h3><p>She said small. She delivered the biggest increase since amalgamation, then another big one, then went quiet in the election year. Your bill did not go quiet.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://toronto.citynews.ca/2023/05/29/olivia-chow-toronto-mayoral-election/" target="_blank" rel="noopener">CityNews, May 29, 2023</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/news/city-of-toronto-2024-budget-now-final-protects-core-services-and-invests-in-affordable-housing-transit-and-community-safety/" target="_blank" rel="noopener">City of Toronto budget releases, 2024 to 2026</a><span class="sep">&middot;</span><a href="https://www.thestar.com/news/gta/is-mayor-olivia-chow-raiding-torontos-reserves-in-the-2026-budget/article_0384e1af-5271-449f-ac82-41ced86b1cc0.html" target="_blank" rel="noopener">Toronto Star on reserves</a><span class="sep">&middot;</span><a href="https://toronto.citynews.ca/2026/09/04/toronto-mayor-chows-property-tax-pledge-criticized/" target="_blank" rel="noopener">CityNews, September 4, 2026</a><span class="sep">&middot;</span><a href="https://torontolife.com/city/fact-checking-the-new-anti-olivia-chow-attack-ads/" target="_blank" rel="noopener">Toronto Life fact-check</a></p>
  </article>

  <!-- 2 -->
  <article class="issue wrap" id="issue-2">
    <figure class="photo"><img src="__vacantImage__" alt="A lived-in Toronto home at dusk" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">02 <em>/ 10</em></span><span class="kicker topic">Vacant Home Tax</span></div>
    <h2 class="display">She tripled a tax. Then 167,000 homes were billed as vacant. Most were not.</h2>
    <h3>What happened</h3>
    <p>In October 2023, Council under Mayor Chow raised the Vacant Home Tax from 1% to 3% of a home’s assessed value. The tax itself was created in 2021, before she took office. The rate hike was hers.</p>
    <p>In March 2024, after the declaration deadline, the City deemed more than 167,000 homes vacant. The year before, about 11,000 owners had paid the tax. Most of the 167,000 were people living in their own homes who had missed a form or hit a problem with the process.</p>
    <p>Bills went out anyway. Within a month, about 108,000 of them had been reversed. Chow told Council: “How could anyone justify pressing the ‘send’ button on 165,000 bills?” She also said “the person that designed the program is no longer with the city.” Staff told Council nobody had been fired.</p>
    <p>A motion to scrap the tax lost 5 to 18. Council voted 23 to 1 to keep it and fix it. The tax was budgeted to bring in $55 million in 2024. It finished the year about $3 million in the red.</p>
    <h3>Why it matters</h3>
    <p>Sending a tax bill to more than a hundred thousand people who did nothing wrong is not a paperwork glitch. It is what happens when a program is tripled in size before anyone checks whether it works. Bradford put it plainly: “When you’re the mayor, you run this ship.”</p>
    <div class="simple"><h3>The simple version</h3><p>She made the tax three times bigger. The City then billed more than a hundred thousand people for homes they were living in, and the program lost money.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.cbc.ca/news/canada/toronto/toronto-vacant-home-tax-increase-1.6991918" target="_blank" rel="noopener">CBC News, October 12, 2023</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/legdocs/mmis/2024/cc/bgrd/backgroundfile-244913.pdf" target="_blank" rel="noopener">City staff report, April 2024</a><span class="sep">&middot;</span><a href="https://www.cp24.com/news/2024/04/18/toronto-city-council-votes-to-keep-vacant-home-tax-amid-calls-to-scrap-the-program-after-fiasco/" target="_blank" rel="noopener">CP24, April 18, 2024</a><span class="sep">&middot;</span><a href="https://secure.toronto.ca/council/agenda-item.do?item=2024.CC17.1" target="_blank" rel="noopener">Council item 2024.CC17.1</a></p>
  </article>

  <!-- 3 -->
  <article class="issue wrap" id="issue-3">
    <figure class="photo"><img src="__gridlockImage__" alt="Traffic congestion on Toronto’s Gardiner Expressway" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">03 <em>/ 10</em></span><span class="kicker topic">Congestion</span></div>
    <h2 class="display">88% say gridlock is serious. 72% say the City runs road work badly.</h2>
    <h3>What happened</h3>
    <p>In May 2026, Liaison Strategies asked Torontonians about traffic. 88% said congestion is a serious problem where they live. 71% said it got worse in the past year. 72% said the City does a poor job coordinating road work. The pollster’s read: “People are not just saying there are too many cars. They are saying the system is badly managed.”</p>
    <p>The mayor’s response, three years in: quadruple traffic agents to 100, budget about $299 million for a congestion plan, and in January 2026 hire the city’s first chief congestion officer. A University of Toronto transportation professor noted that creating the job “places the blame for congestion squarely on mismanagement.”</p>
    <p>Through the same period, she spent political capital fighting the province to keep bike lanes on Bloor, Yonge and University while construction lane closures multiplied.</p>

    <div class="vs">
      <div class="claim"><span class="lbl">The claim</span><p>100 traffic agents, a $299 million plan, and a chief congestion officer.</p></div>
      <div class="rec"><span class="lbl">The record</span><p>71% say traffic got worse in the last year. 72% say the City manages road work poorly.</p></div>
    </div>

    <h3>Why it matters</h3>
    <p>Time stuck in traffic is a tax nobody voted on. Contractors closing lanes for months with no coordination is a City Hall problem, not a weather problem. Hiring someone to be in charge of it in year three is an admission.</p>
    <div class="simple"><h3>The simple version</h3><p>Everyone knows traffic got worse. Her fix was to hire a traffic boss in the last year of her term.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://press.liaisonstrategies.ca/toronto-chow-50-bradford-37-traffic-frustration-dominates-city-mood/" target="_blank" rel="noopener">Liaison Strategies, May 14, 2026</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/news/canada/toronto/toronto-quadrupling-number-of-traffic-agents-100-total-1.7426857" target="_blank" rel="noopener">CBC News on traffic agents</a><span class="sep">&middot;</span><a href="https://toronto.citynews.ca/2026/01/09/toronto-traffic-czar-chief-congestion-officer/" target="_blank" rel="noopener">CityNews, January 9, 2026</a></p>
  </article>

  <!-- 4 -->
  <article class="issue wrap" id="issue-4">
    <figure class="photo"><img src="__policeImage__" alt="Police cruiser outside a downtown Toronto division" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">04 <em>/ 10</em></span><span class="kicker topic">Policing and safety</span></div>
    <h2 class="display">She offered police $12.6 million less. The Chief went public. She folded.</h2>
    <h3>What happened</h3>
    <p>In February 2024, the Toronto Police Service asked for about $20 million more on a budget of nearly $1.2 billion. The mayor’s draft offered $7.4 million, $12.6 million short. Chief Myron Demkiw told the Budget Committee that anything less than the full request “will present an unacceptable risk.” Priority calls were waiting an average of 22 minutes, against a 6-minute standard.</p>
    <p>Chow insisted police were getting “millions of dollars more” and that “there’s no cuts.” On February 13, she reversed and backed the full request.</p>
    <p>In 2026 she approved a further $93.8 million increase for police and defended it during a corruption probe in which seven serving Toronto officers were charged. She has been attacked from the right for the first move and from the left for the second.</p>
    <p>Public confidence did not follow the reversal. One year in, 52% disapproved of her performance on crime. In August 2025, 41% of residents said they did not feel safe on the TTC. </p>

    <div class="vs">
      <div class="claim"><span class="lbl">The claim</span><p>Major crime is down.</p></div>
      <div class="rec"><span class="lbl">The record</span><p>Down from a 2023 peak, with some indicators still above the mid-2010s. In 2024, priority calls waited 22 minutes. Four in ten still do not feel safe on the TTC.</p></div>
    </div>

    <h3>Why it matters</h3>
    <p>Response times and the feeling of safety on a subway platform are the basics. A mayor who has to be talked out of her own police budget by the Chief, in public, in her first budget, is a mayor who did not know where the floor was.</p>
    <div class="simple"><h3>The simple version</h3><p>Emergency calls were waiting 22 minutes. Her first instinct was to give police less than they asked for. She backed down only after the Chief went public.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.cbc.ca/news/canada/toronto/toronto-police-budget-fight-1.7094937" target="_blank" rel="noopener">CBC News, January 28, 2024</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/news/canada/toronto/chow-council-police-budget-hike-1.7113986" target="_blank" rel="noopener">CBC News, February 13, 2024</a><span class="sep">&middot;</span><a href="https://www.thestar.com/news/gta/mayor-olivia-chow-reverses-course-on-police-funding-request/article_d051ccf0-caa6-11ee-98cf-93304ba6188e.html" target="_blank" rel="noopener">Toronto Star</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/news/canada/toronto/toronto-police-budget-9.7047573" target="_blank" rel="noopener">CBC News, January 15, 2026</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/legdocs/mmis/2026/bu/bgrd/backgroundfile-261624.pdf" target="_blank" rel="noopener">TPS 2026 budget presentation</a></p>
  </article>

  <!-- 5 -->
  <article class="issue wrap" id="issue-5">
    <figure class="photo"><img src="__housingImage__" alt="Stalled condominium construction site in Toronto" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">05 <em>/ 10</em></span><span class="kicker topic">Housing</span></div>
    <h2 class="display">She ran as the housing mayor. Homebuilding fell to a 30-year low.</h2>
    <h3>What happened</h3>
    <p>In September 2025, CMHC reported Toronto was on pace for its lowest annual housing starts in 30 years, with homebuilding per person at its lowest since 1996. Condo starts had dropped 60%.</p>
    <p>It got worse. In the first half of 2026, the City of Toronto started 156 condominium units. The decade average is about 7,000 a year.</p>
    <p>The City reports almost 30,000 rent-controlled homes “approved” between 2020 and 2024. In the same window, 2,511 net new affordable rental homes were completed. The City’s own progress report says starts and completions “are not keeping pace with the rate of approvals.” In 2026, staff flagged 26 city-backed affordable projects at risk of losing their incentives because construction never started.</p>
    <p>Builders warned for years that Toronto’s development charges, well over $100,000 per home, were killing projects. The mayor froze indexing in 2025 and cut charges 40 to 60% in June 2026, backfilled by $1.5 billion in federal and provincial money. Relief arrived after the collapse, not before it.</p>
    <p>Interest rates, construction costs and investor demand share the blame. But she campaigned on housing. She owns the result.</p>

    <div class="vs">
      <div class="claim"><span class="lbl">The claim</span><p>Nearly 30,000 rent-controlled homes approved.</p></div>
      <div class="rec"><span class="lbl">The record</span><p>2,511 affordable homes completed over five years. 156 condo starts in the first half of 2026.</p></div>
    </div>

    <h3>Why it matters</h3>
    <p>An approval is a piece of paper. A home is a set of keys. 82% of Torontonians now agree the city has “lost control of the housing situation.”  That is not a number a housing mayor gets to walk away from.</p>
    <div class="simple"><h3>The simple version</h3><p>She counts approvals. Families count keys. Almost nothing got built, and the fee cuts came after the crash.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/slowdown-toronto-vancouver-leave-national-housing-starts-flat-first-half-2025" target="_blank" rel="noopener">CMHC, September 9, 2025</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/wp-content/uploads/2025/11/978e-HousingTO2024-2025ProgressReport.pdf" target="_blank" rel="noopener">HousingTO 2024–2025 Progress Report</a><span class="sep">&middot;</span><a href="https://storeys.com/cmhc-fall-housing-report-2026/" target="_blank" rel="noopener">Storeys, September 14, 2026</a><span class="sep">&middot;</span><a href="https://www.thestar.com/news/gta/26-affordable-housing-projects-set-to-lose-city-benefits-due-to-delayed-or-stalled-construction/article_98823602-f629-47a3-8663-4754a0e50fc7.html" target="_blank" rel="noopener">Toronto Star on stalled projects</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/news/city-of-toronto-secures-1-5-billion-in-canada-ontario-partnership-to-build-funding-to-support-housing-and-reduce-development-charges/" target="_blank" rel="noopener">City of Toronto, June 23, 2026</a></p>
  </article>

  <!-- 6 -->
  <article class="issue wrap" id="issue-6">
    <figure class="photo"><img src="__encampmentImage__" alt="Unoccupied tents in a downtown Toronto park" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">06 <em>/ 10</em></span><span class="kicker topic">Homelessness and encampments</span></div>
    <h2 class="display">Homelessness doubled. The tents stayed. Neighbours were told last.</h2>
    <h3>What happened</h3>
    <p>The City’s street count found about 7,300 people homeless in April 2021. In October 2024 the count was 15,418. Emergency shelter services cost close to $700 million in 2025, and the system still ran at capacity, with around 200 single adults a night turned away and an average of 685 families waiting. </p>
    <p>Encampments became fixtures. At Clarence Square, residents documented fires, an assault, harassment, human waste and propane tanks. They asked for the park to be cleared. The Deputy Mayor said no. In November 2024, the mayor turned down the province’s offer to help clear encampments: “You take them out of a park, they go into the TTC subway system.”</p>
    <p>In November 2025, Councillor Bradford moved to clear any encampment within 200 metres of a school, daycare or playground within 48 hours. Council under the mayor amended it down and capped shelter offers at three. The City’s own Housing Rights Advisory Committee then called even that version a “retrogression” in housing rights. She satisfied neither side.</p>
    <p>On shelter sites, the City picks first and talks after. Residents near 66 Third Street in Etobicoke, a proposed site close to two schools and a seniors’ residence, were told by staff that the process was “focused on engagement, not on consultation of new shelter locations.”</p>
    <p>The October 2025 count fell 21%, to 12,196. Part of that was fewer refugee claimants arriving, a federal decision. The shelter system was still full.</p>
    <h3>Why it matters</h3>
    <p>Nobody thinks homelessness has one cause or one fix. But a parent walking a child past a tent by the swings, and a street told the shelter is coming whether they like it or not, are both looking at a City Hall that stopped listening.</p>
    <div class="simple"><h3>The simple version</h3><p>Twice as many people on the street. Close to $700 million a year on shelters. Tents beside playgrounds. And neighbourhoods told where the shelter goes after it has been decided.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.toronto.ca/news/city-of-toronto-releases-findings-of-2024-street-needs-assessment-homelessness-survey/" target="_blank" rel="noopener">City of Toronto Street Needs Assessment, July 2025</a><span class="sep">&middot;</span><a href="https://toronto.citynews.ca/2024/10/23/toronto-clarence-park-encampment-ausma-malik/" target="_blank" rel="noopener">CityNews, October 23, 2024</a><span class="sep">&middot;</span><a href="https://toronto.citynews.ca/2024/11/07/toronto-mayor-rejects-using-notwithstanding-clause-to-clear-encampments/" target="_blank" rel="noopener">CityNews, November 7, 2024</a><span class="sep">&middot;</span><a href="https://secure.toronto.ca/council/agenda-item.do?item=2025.MM34.4" target="_blank" rel="noopener">Council item 2025.MM34.4</a><span class="sep">&middot;</span><a href="https://www.cp24.com/news/2025/03/04/this-parking-lot-is-not-the-solution-etobicoke-residents-push-back-against-shelter-plan/" target="_blank" rel="noopener">CP24, March 4, 2025</a></p>
  </article>

  <!-- 7 -->
  <article class="issue wrap" id="issue-7">
    <figure class="photo"><img src="__binsImage__" alt="Overflowing street litter bin in downtown Toronto" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">07 <em>/ 10</em></span><span class="kicker topic">The basics</span></div>
    <h2 class="display">Taxes up 19%. Bins still full. Her word for it: “falling apart.”</h2>
    <h3>What happened</h3>
    <p>One year into the job, asked what was hardest, the mayor said: “The toughest is looking at all the things falling apart. City Hall, subway stations.” She meant the neglect she inherited. Three budgets and a 19% tax increase later, residents are asking what changed.</p>
    <p>Street litter bins overflowed so reliably that in 2026 the mayor herself asked Council to tear up the approach and “end the persistent problem of broken and overflowing litter bins.” Slow snow clearing in the winter of 2025 was a documented citywide complaint.</p>
    <p>The Auditor General found that 17 of 18 Toronto Water state-of-good-repair projects between 2020 and 2025 missed their completion dates.</p>
    <p>On the TTC, fares were frozen and service hours added. But in January 2025 only 10 of 179 surface routes met the 90% on-time target in rush hour. Asked what would get them back on transit, riders put reliable service first and lower fares far down the list.</p>
    <p>The City’s own survey says 69% of residents rate quality of life as good. That leaves 31% of a city of three million who do not.</p>

    <div class="vs">
      <div class="claim"><span class="lbl">The claim</span><p>Fares frozen. The most TTC service in a decade.</p></div>
      <div class="rec"><span class="lbl">The record</span><p>10 of 179 surface routes on time in rush hour. Riders say reliability, not fares, is the problem.</p></div>
    </div>

    <h3>Why it matters</h3>
    <p>A tax increase is a contract. Pay more, get a city that works. Overflowing bins, buses that bunch and a mayor describing her own city as “falling apart” is the other side of that contract not being met.</p>
    <div class="simple"><h3>The simple version</h3><p>You pay 19% more. The bins are still full, the buses still bunch, and the mayor’s own word for the city was “falling apart.”</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://toronto.citynews.ca/2024/07/12/olivia-chow-toronto-mayor-one-year-transit-traffic-affordable-housing-gardiner/" target="_blank" rel="noopener">CityNews, July 12, 2024</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/news/canada/toronto/toronto-sidewalk-litter-bins-9.7113647" target="_blank" rel="noopener">CBC News on litter bins</a><span class="sep">&middot;</span><a href="https://www.torontoauditor.ca/report/4646/" target="_blank" rel="noopener">Auditor General, October 2025</a><span class="sep">&middot;</span><a href="https://www.cp24.com/local/toronto/2025/01/23/only-10-ttc-surface-routes-are-meeting-the-goal-for-on-time-performance-and-bunching-may-be-to-blame-report/" target="_blank" rel="noopener">CP24, January 23, 2025</a><span class="sep">&middot;</span><a href="https://press.liaisonstrategies.ca/toronto-chow-50-bradford-39-voters-resist-tax-hikes/" target="_blank" rel="noopener">Liaison Strategies, September 9, 2026</a><span class="sep">&middot;</span><a href="https://www.toronto.ca/legdocs/mmis/2025/ex/bgrd/backgroundfile-258711.pdf" target="_blank" rel="noopener">Ipsos for the City of Toronto, 2025</a></p>
  </article>

  <!-- 8 -->
  <article class="issue wrap" id="issue-8">
    <figure class="photo"><img src="__squareImage__" alt="Public square at Yonge and Dundas in Toronto" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">08 <em>/ 10</em></span><span class="kicker topic">Sankofa Square</span></div>
    <h2 class="display">She seconded a name change that 71% of Toronto did not want.</h2>
    <h3>What happened</h3>
    <p>In December 2023, Council voted to rename Yonge-Dundas Square as Sankofa Square. The motion came from Councillor Chris Moise. Mayor Chow seconded it. The Toronto Star reported she personally attended the review meeting and steered the compromise to rename the square rather than the whole street.</p>
    <p>A Liaison poll a month later found 71% of Torontonians disapproved of the new name. Downtown, where the square sits, 69% disapproved.</p>
    <p>The City budgeted $335,000 for signage and rebranding, drawn from Section 37 developer contributions. The square’s board warned the full job could run to about $860,000. Section 37 money is still public money. It could have gone to a park, a community centre, or the bins.</p>
    <h3>Why it matters</h3>
    <p>Three months into a term that opened with a $1.8 billion budget gap the City had to close, the mayor’s name went on a motion to rename a square most of the city wanted left alone. It is a small item with a big message about priorities.</p>
    <div class="simple"><h3>The simple version</h3><p>Seven in ten people said no. She backed it anyway, and money that could have gone to the neighbourhood went to new signs.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://secure.toronto.ca/council/agenda-item.do?item=2023.MM13.29" target="_blank" rel="noopener">Council item 2023.MM13.29</a><span class="sep">&middot;</span><a href="https://www.thestar.com/how-olivia-chow-intervened-to-change-course-on-renaming-dundas-street/article_8de4dcee-a0f9-11ee-a8ae-6b684a60c7b2.html" target="_blank" rel="noopener">Toronto Star, December 2023</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/news/canada/toronto/yonge-dundas-square-renaming-costs-funding-1.7231976" target="_blank" rel="noopener">CBC News on costs</a><span class="sep">&middot;</span><a href="https://press.liaisonstrategies.ca/torontonians-dont-want-sankofa-trudeau-troubles-continue-in-suburbs/" target="_blank" rel="noopener">Liaison Strategies, January 2024</a></p>
  </article>

  <!-- 9 -->
  <article class="issue wrap" id="issue-9">
    <figure class="photo"><img src="__scienceImage__" alt="Closed entrance of the Ontario Science Centre" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">09 <em>/ 10</em></span><span class="kicker topic">Ontario Place and the Science Centre</span></div>
    <h2 class="display">She promised to fight Ford’s waterfront plan. Then she signed it away.</h2>
    <h3>What happened</h3>
    <p>In the 2023 campaign, Olivia Chow promised to fight the Therme spa at Ontario Place, to fight the relocation of the Ontario Science Centre, and to stop the rebuild of the eastern Gardiner.</p>
    <p>On November 27, 2023, she signed a “New Deal” with Premier Doug Ford. The province took over the Gardiner Expressway and the Don Valley Parkway and committed about $1.2 billion in operating support over three years. In return, the City “accepts Ontario’s authority” to proceed with Ontario Place and to move the Science Centre. The Gardiner rebuild went ahead.</p>
    <p>The advocates who had campaigned beside her called it “breaking campaign promises” and “selling out.” In June 2024, the province closed the Science Centre, citing repair costs. The mayor said the New Deal’s promise of science programming had been “fairly vague” and that talks on it had never happened.</p>
    <p>The highway upload is worth billions to the City. It is also the largest single thing she has done as mayor, and she paid for it with the promise that got her elected.</p>
    <h3>Why it matters</h3>
    <p>This is not a left or right issue. It is whether a promise made to win an election means anything the week after. If she would trade away her signature campaign commitment inside five months, what does “at or around inflation” mean now?</p>
    <div class="simple"><h3>The simple version</h3><p>She ran against Ford’s waterfront plan. Five months in, she traded it away. Then the Science Centre closed.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.theglobeandmail.com/canada/article-historic-deal-on-torontos-finances-will-see-province-take-over-two/" target="_blank" rel="noopener">Globe and Mail, November 27, 2023</a><span class="sep">&middot;</span><a href="https://news.ontario.ca/en/release/1003888/ontario-and-toronto-reach-a-new-deal" target="_blank" rel="noopener">Government of Ontario news release</a><span class="sep">&middot;</span><a href="https://toronto.citynews.ca/2023/11/28/advocates-say-ontario-place-deal-between-province-toronto-falls-short/" target="_blank" rel="noopener">CityNews, November 28, 2023</a><span class="sep">&middot;</span><a href="https://www.cbc.ca/amp/1.7040823" target="_blank" rel="noopener">CBC News</a></p>
  </article>

  <!-- 10 -->
  <article class="issue wrap" id="issue-10">
    <figure class="photo"><img src="__cityHallImage__" alt="Toronto City Hall and Nathan Phillips Square at night" loading="lazy" width="1200" height="800"></figure>
    <div class="meta"><span class="num">10 <em>/ 10</em></span><span class="kicker topic">Trust and showing up</span></div>
    <h2 class="display">She skipped the October 7 vigil. The excuses kept changing.</h2>
    <h3>What happened</h3>
    <p>On October 7, 2024, about 20,000 people gathered for the first-anniversary vigil for the victims of the Hamas attack on Israel. Premier Ford came. John Tory came. City councillors came. The mayor of Toronto did not.</p>
    <p>Her explanations moved. First, a long meeting about a bike lane had left her “exhausted.” Then, “my office did not get the email.” Then, “miscommunication.” Then an apology. CIJA called her statements “embarrassing exercises in avoiding accountability.” A Toronto Sun freedom-of-information request later showed at least two emails about the vigil had reached her inbox.</p>
    <p>It fit a pattern. In May 2024 she skipped the Israel Independence Day flag-raising at City Hall, calling it “a bit divisive.” In November 2025, at an event closed to media and left off her public itinerary, she referred to “the genocide in Gaza.” CIJA called the remark “reckless, divisive, and dangerous.” B’nai Brith asked the Integrity Commissioner to investigate. Complaints were filed with the Human Rights Tribunal. Those are filings, not findings, and none had been decided as of this writing.</p>
    <p>In June 2026, at the Pride parade, a supporter called for a “Free Palestine.” The mayor answered, on video: “Yes. Free Palestine.” In September 2026 she declined a mayoral forum on antisemitism that her two main opponents attended. John Tory called that “a big mistake.”</p>
    <h3>Why it matters</h3>
    <p>A mayor represents everyone, including communities she disagrees with and communities that are frightened. Toronto’s Jewish community asked for one thing three years running: show up. The record is a missed vigil, a skipped flag-raising, a remark she will not retract, and a forum she would not attend.</p>
    <div class="simple"><h3>The simple version</h3><p>Twenty thousand people gathered to mourn. The mayor did not come, and her reasons changed three times. Two years later she would not come to the debate about it either.</p></div>
    <p class="source"><span class="lbl">Source:</span><a href="https://www.cija.ca/taking_zero_accountability_mayor_chow_instead_blames_denies_deflects_on_why_she_let_down_the_jewish_community_on_october_7" target="_blank" rel="noopener">CIJA, October 9, 2024</a><span class="sep">&middot;</span><a href="https://www.cp24.com/politics/toronto-city-hall/2024/10/09/i-should-have-been-there-toronto-mayor-says-she-regrets-not-being-at-oct-7-vigil/" target="_blank" rel="noopener">CP24, October 9, 2024</a><span class="sep">&middot;</span><a href="https://torontosun.com/news/local-news/mayor-chow-got-emails-about-oct-7-vigil-documents-show" target="_blank" rel="noopener">Toronto Sun FOI</a><span class="sep">&middot;</span><a href="https://nationalpost.com/news/toronto/olivia-chow-flag-raising-israel-independence-day" target="_blank" rel="noopener">National Post, May 2024</a><span class="sep">&middot;</span><a href="https://thecjn.ca/news/jewish-groups-blast-toronto-mayor-olivia-chows-genocide-in-gaza-remarks/" target="_blank" rel="noopener">Canadian Jewish News, November 2025</a><span class="sep">&middot;</span><a href="https://torontosun.com/news/local-news/olivia-chow-playing-politics-pride-parade" target="_blank" rel="noopener">Toronto Sun, June 2026</a><span class="sep">&middot;</span><a href="https://www.cp24.com/video/2026/09/08/a-big-mistake-tory-on-chow-not-attending-mayoral-debate-on-anti-semitism/" target="_blank" rel="noopener">CP24, September 8, 2026</a></p>
  </article>
</section>

<!-- ====================== STOP BAND ====================== -->
<section class="stop-band" aria-labelledby="stopTitle">
  <div class="wrap">
    <p class="kicker">Want a mayor who does the job?</p>
    <h2 class="display" id="stopTitle"><span class="y">On October 26,</span><span class="r">vote her out.</span></h2>
    <p>If you are paying more and getting less, you are not alone. Join the coalition. Share the record. Tell your neighbours. Show up in October.</p>
    <a class="btn btn-red" href="#join">I’m in <span class="arrow">&rarr;</span></a>
  </div>
</section>

<!-- ====================== JOIN ====================== -->
<section class="join" id="join" aria-labelledby="joinTitle">
  <div class="wrap">
    <p class="kicker">Join the coalition</p>
    <h2 class="display" id="joinTitle">Help us finish this.</h2>
    <p>Leave your name and how to reach you. Tell us what you have seen in your neighbourhood. We will use this list to keep residents informed and organized through election day.</p>

    <form id="joinForm" novalidate>
      <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required></div>
      <div class="field"><label for="f-hood">Neighbourhood, ward or postal code</label><input id="f-hood" name="neighbourhood" type="text" autocomplete="postal-code"></div>
      <div class="field"><label for="f-story">Optional: What have you seen?</label><textarea id="f-story" name="story"></textarea></div>
      <label class="check"><input type="checkbox" name="updates"><span>I want updates about the October 26, 2026 election.</span></label>
      <label class="check"><input type="checkbox" name="ack" required><span>I understand this is a political campaign, not a City of Toronto website.</span></label>
      <div style="margin-top:1.25rem"><button class="btn btn-red" type="submit">Join the coalition <span class="arrow">&rarr;</span></button></div>
      <p class="form-msg ok" id="msgOk" role="status">You’re in. We’ll be in touch. Tell one neighbour before you close this tab.</p>
      <p class="form-msg err" id="msgErr" role="alert">That didn’t send. Check your email address and try again.</p>
    </form>
  </div>
</section>

<!-- ====================== FOOTER ====================== -->
<footer class="foot" id="sources">
  <div class="wrap">
    <span class="wordmark"><span class="stop">Stop</span><span>Olivia Chow</span></span>
    <p>Stop Chow is an independent residents’ campaign in Toronto. It is not affiliated with the City of Toronto or with any candidate.</p>
    <p>This page is political advocacy. It summarizes City of Toronto budgets and Council records, Auditor General and CMHC reports, published polling, and reporting from established news organizations. Where it quotes the mayor, the words are hers and the source is linked. Complaints to a tribunal or to the Integrity Commissioner are filings, not findings, unless the page says otherwise. Property-tax figures count the three budgets passed under Mayor Chow (2024, 2025 and 2026), not the 2023 budget passed under John Tory.</p>
    <p> If the campaign registers as a third-party advertiser under the Municipal Elections Act, add the required identification here (name, municipality of registration, contact).</p>

    <h4>Sources</h4>

    <h5>01. Taxes and spending</h5>
    <ol>
      <li><a href="https://toronto.citynews.ca/2023/05/29/olivia-chow-toronto-mayoral-election/" target="_blank" rel="noopener">CityNews, May 29, 2023: Chow on a “modest” increase</a></li>
      <li><a href="https://www.toronto.ca/news/city-of-toronto-2024-budget-now-final-protects-core-services-and-invests-in-affordable-housing-transit-and-community-safety/" target="_blank" rel="noopener">City of Toronto, 2024 budget release</a></li>
      <li><a href="https://www.toronto.ca/news/city-of-torontos-2025-budget-now-final-prioritizes-affordability-transportation-safety-and-community-services/" target="_blank" rel="noopener">City of Toronto, 2025 budget release</a></li>
      <li><a href="https://www.toronto.ca/news/city-of-torontos-2026-budget-now-final-focuses-on-affordability-service-stability-and-financial-sustainability/" target="_blank" rel="noopener">City of Toronto, 2026 budget release</a></li>
      <li><a href="https://www.theglobeandmail.com/canada/article-toronto-passes-budget-with-95-per-cent-tax-hike-additional-police/" target="_blank" rel="noopener">Globe and Mail, February 2024: Council passes 9.5% increase</a></li>
      <li><a href="https://www.thestar.com/news/gta/is-mayor-olivia-chow-raiding-torontos-reserves-in-the-2026-budget/article_0384e1af-5271-449f-ac82-41ced86b1cc0.html" target="_blank" rel="noopener">Toronto Star: reserves in the 2026 budget</a></li>
      <li><a href="https://toronto.citynews.ca/2026/09/04/toronto-mayor-chows-property-tax-pledge-criticized/" target="_blank" rel="noopener">CityNews, September 4, 2026: tax pledge criticized</a></li>
      <li><a href="https://torontolife.com/city/fact-checking-the-new-anti-olivia-chow-attack-ads/" target="_blank" rel="noopener">Toronto Life: fact-checking the 25% claim</a></li>
    </ol>

    <h5>02. Vacant Home Tax</h5>
    <ol>
      <li><a href="https://www.cbc.ca/news/canada/toronto/toronto-vacant-home-tax-increase-1.6991918" target="_blank" rel="noopener">CBC News, October 12, 2023: rate raised to 3%</a></li>
      <li><a href="https://www.toronto.ca/legdocs/mmis/2024/cc/bgrd/backgroundfile-244913.pdf" target="_blank" rel="noopener">City of Toronto staff report, April 2024</a></li>
      <li><a href="https://www.cp24.com/news/2024/04/18/toronto-city-council-votes-to-keep-vacant-home-tax-amid-calls-to-scrap-the-program-after-fiasco/" target="_blank" rel="noopener">CP24, April 18, 2024</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/vacant-home-tax-complaints-homeowners-city-toronto-1.7163891" target="_blank" rel="noopener">CBC News: homeowner complaints</a></li>
      <li><a href="https://secure.toronto.ca/council/agenda-item.do?item=2024.CC17.1" target="_blank" rel="noopener">Council item 2024.CC17.1</a></li>
    </ol>

    <h5>03. Congestion</h5>
    <ol>
      <li><a href="https://press.liaisonstrategies.ca/toronto-chow-50-bradford-37-traffic-frustration-dominates-city-mood/" target="_blank" rel="noopener">Liaison Strategies, May 14, 2026</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/toronto-quadrupling-number-of-traffic-agents-100-total-1.7426857" target="_blank" rel="noopener">CBC News: traffic agents quadrupled</a></li>
      <li><a href="https://toronto.citynews.ca/2026/01/09/toronto-traffic-czar-chief-congestion-officer/" target="_blank" rel="noopener">CityNews, January 9, 2026: chief congestion officer</a></li>
    </ol>

    <h5>04. Policing and safety</h5>
    <ol>
      <li><a href="https://www.cbc.ca/news/canada/toronto/toronto-police-budget-fight-1.7094937" target="_blank" rel="noopener">CBC News, January 28, 2024: police budget fight</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/chow-council-police-budget-hike-1.7113986" target="_blank" rel="noopener">CBC News, February 13, 2024: reversal</a></li>
      <li><a href="https://www.thestar.com/news/gta/mayor-olivia-chow-reverses-course-on-police-funding-request/article_d051ccf0-caa6-11ee-98cf-93304ba6188e.html" target="_blank" rel="noopener">Toronto Star: mayor reverses course</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/toronto-police-budget-9.7047573" target="_blank" rel="noopener">CBC News, January 15, 2026: 2026 police budget</a></li>
      <li><a href="https://www.thestar.com/news/gta/city-hall/olivia-chow-defends-94-million-increase-in-toronto-police-budget-amid-corruption-scandal/article_bb7eab28-f463-4bd0-a25b-9cb6e496e245.html" target="_blank" rel="noopener">Toronto Star: $94 million increase defended</a></li>
      <li><a href="https://www.toronto.ca/legdocs/mmis/2026/bu/bgrd/backgroundfile-261624.pdf" target="_blank" rel="noopener">Toronto Police Service 2026 budget presentation</a></li>
      <li>Liaison Strategies, July 2024, one-year approval on crime </li>
      <li>Ipsos for the Toronto Star, August 2025, TTC safety and housing </li>
    </ol>

    <h5>05. Housing</h5>
    <ol>
      <li><a href="https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/slowdown-toronto-vancouver-leave-national-housing-starts-flat-first-half-2025" target="_blank" rel="noopener">CMHC, September 9, 2025</a></li>
      <li><a href="https://www.toronto.ca/wp-content/uploads/2025/11/978e-HousingTO2024-2025ProgressReport.pdf" target="_blank" rel="noopener">HousingTO 2024–2025 Progress Report</a></li>
      <li><a href="https://storeys.com/cmhc-fall-housing-report-2026/" target="_blank" rel="noopener">Storeys, September 14, 2026: CMHC fall report</a></li>
      <li><a href="https://www.thestar.com/news/gta/26-affordable-housing-projects-set-to-lose-city-benefits-due-to-delayed-or-stalled-construction/article_98823602-f629-47a3-8663-4754a0e50fc7.html" target="_blank" rel="noopener">Toronto Star: 26 stalled affordable projects</a></li>
      <li><a href="https://www.theglobeandmail.com/canada/article-delays-fees-still-throttling-ontario-housing-starts-report-says/" target="_blank" rel="noopener">Globe and Mail, September 25, 2024: fees and delays</a></li>
      <li><a href="https://www.toronto.ca/news/city-of-toronto-secures-1-5-billion-in-canada-ontario-partnership-to-build-funding-to-support-housing-and-reduce-development-charges/" target="_blank" rel="noopener">City of Toronto, June 23, 2026: development charge reductions</a></li>
    </ol>

    <h5>06. Homelessness and encampments</h5>
    <ol>
      <li><a href="https://www.toronto.ca/news/city-of-toronto-releases-findings-of-2024-street-needs-assessment-homelessness-survey/" target="_blank" rel="noopener">City of Toronto, 2024 Street Needs Assessment</a></li>
      <li><a href="https://www.toronto.ca/wp-content/uploads/2026/04/9042-2024-2025-SNA-Key-Highlights.pdf" target="_blank" rel="noopener">City of Toronto, 2024–2025 SNA key highlights</a></li>
      <li><a href="https://toronto.citynews.ca/2024/10/23/toronto-clarence-park-encampment-ausma-malik/" target="_blank" rel="noopener">CityNews, October 23, 2024: Clarence Square</a></li>
      <li><a href="https://toronto.citynews.ca/2024/11/07/toronto-mayor-rejects-using-notwithstanding-clause-to-clear-encampments/" target="_blank" rel="noopener">CityNews, November 7, 2024</a></li>
      <li><a href="https://torontosun.com/news/local-news/brad-bradford-wants-encampments-cleared-out-48-hours-after-being-reported" target="_blank" rel="noopener">Toronto Sun, November 7, 2025: Bradford motion</a></li>
      <li><a href="https://secure.toronto.ca/council/agenda-item.do?item=2025.MM34.4" target="_blank" rel="noopener">Council item 2025.MM34.4</a></li>
      <li><a href="https://secure.toronto.ca/council/agenda-item.do?item=2025.HS8.11" target="_blank" rel="noopener">Housing Rights Advisory Committee, item 2025.HS8.11</a></li>
      <li><a href="https://www.cp24.com/news/2025/03/04/this-parking-lot-is-not-the-solution-etobicoke-residents-push-back-against-shelter-plan/" target="_blank" rel="noopener">CP24, March 4, 2025: 66 Third Street</a></li>
      <li>City of Toronto, Shelter and Support Services 2025 budget notes </li>
    </ol>

    <h5>07. The basics</h5>
    <ol>
      <li><a href="https://toronto.citynews.ca/2024/07/12/olivia-chow-toronto-mayor-one-year-transit-traffic-affordable-housing-gardiner/" target="_blank" rel="noopener">CityNews, July 12, 2024: one-year interview</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/toronto-sidewalk-litter-bins-9.7113647" target="_blank" rel="noopener">CBC News: litter bins</a></li>
      <li><a href="https://www.torontoauditor.ca/report/4646/" target="_blank" rel="noopener">Auditor General, October 2025: Toronto Water contract management</a></li>
      <li><a href="https://www.cp24.com/local/toronto/2025/01/23/only-10-ttc-surface-routes-are-meeting-the-goal-for-on-time-performance-and-bunching-may-be-to-blame-report/" target="_blank" rel="noopener">CP24, January 23, 2025: TTC on-time performance</a></li>
      <li><a href="https://www.ttc.ca/news/2025/January/TTC-2025-budget-freezes-fares" target="_blank" rel="noopener">TTC 2025 budget: fares frozen</a></li>
      <li><a href="https://press.liaisonstrategies.ca/toronto-chow-50-bradford-39-voters-resist-tax-hikes/" target="_blank" rel="noopener">Liaison Strategies, September 9, 2026</a></li>
      <li><a href="https://www.toronto.ca/legdocs/mmis/2025/ex/bgrd/backgroundfile-258711.pdf" target="_blank" rel="noopener">Ipsos for the City of Toronto, 2025: quality of life</a></li>
    </ol>

    <h5>08. Sankofa Square</h5>
    <ol>
      <li><a href="https://secure.toronto.ca/council/agenda-item.do?item=2023.MM13.29" target="_blank" rel="noopener">Council item 2023.MM13.29</a></li>
      <li><a href="https://www.thestar.com/how-olivia-chow-intervened-to-change-course-on-renaming-dundas-street/article_8de4dcee-a0f9-11ee-a8ae-6b684a60c7b2.html" target="_blank" rel="noopener">Toronto Star, December 2023: how Chow intervened</a></li>
      <li><a href="https://www.cbc.ca/news/canada/toronto/yonge-dundas-square-renaming-costs-funding-1.7231976" target="_blank" rel="noopener">CBC News: renaming costs</a></li>
      <li><a href="https://press.liaisonstrategies.ca/torontonians-dont-want-sankofa-trudeau-troubles-continue-in-suburbs/" target="_blank" rel="noopener">Liaison Strategies, January 2024</a></li>
    </ol>

    <h5>09. Ontario Place and the Science Centre</h5>
    <ol>
      <li><a href="https://www.theglobeandmail.com/canada/article-historic-deal-on-torontos-finances-will-see-province-take-over-two/" target="_blank" rel="noopener">Globe and Mail, November 27, 2023</a></li>
      <li><a href="https://news.ontario.ca/en/release/1003888/ontario-and-toronto-reach-a-new-deal" target="_blank" rel="noopener">Government of Ontario: Ontario and Toronto reach a New Deal</a></li>
      <li><a href="https://toronto.citynews.ca/2023/11/28/advocates-say-ontario-place-deal-between-province-toronto-falls-short/" target="_blank" rel="noopener">CityNews, November 28, 2023</a></li>
      <li><a href="https://www.cbc.ca/amp/1.7040823" target="_blank" rel="noopener">CBC News</a></li>
    </ol>

    <h5>10. Trust and showing up</h5>
    <ol>
      <li><a href="https://www.cija.ca/taking_zero_accountability_mayor_chow_instead_blames_denies_deflects_on_why_she_let_down_the_jewish_community_on_october_7" target="_blank" rel="noopener">CIJA statement, October 9, 2024</a></li>
      <li><a href="https://www.cp24.com/politics/toronto-city-hall/2024/10/09/i-should-have-been-there-toronto-mayor-says-she-regrets-not-being-at-oct-7-vigil/" target="_blank" rel="noopener">CP24, October 9, 2024</a></li>
      <li><a href="https://torontosun.com/news/local-news/mayor-chow-got-emails-about-oct-7-vigil-documents-show" target="_blank" rel="noopener">Toronto Sun, December 2024: FOI on vigil emails</a></li>
      <li><a href="https://nationalpost.com/news/toronto/olivia-chow-flag-raising-israel-independence-day" target="_blank" rel="noopener">National Post, May 2024: flag-raising</a></li>
      <li><a href="https://nationalpost.com/news/canada/genocide-in-gaza-jewish-groups-call-for-olivia-chow-to-apologize-resign-for-anti-israel-remarks" target="_blank" rel="noopener">National Post, November 2025</a></li>
      <li><a href="https://thecjn.ca/news/jewish-groups-blast-toronto-mayor-olivia-chows-genocide-in-gaza-remarks/" target="_blank" rel="noopener">Canadian Jewish News, November 2025</a></li>
      <li><a href="https://bnaibrith.ca/bnai-brith-canada-urges-toronto-to-investigate-mayors-conduct/" target="_blank" rel="noopener">B’nai Brith Canada: request to the Integrity Commissioner</a></li>
      <li><a href="https://torontosun.com/news/local-news/olivia-chow-playing-politics-pride-parade" target="_blank" rel="noopener">Toronto Sun, June 2026: Pride parade</a></li>
      <li><a href="https://thecjn.ca/news/torontos-election-forum-on-antisemitism-proceeds-without-mayor-olivia-chow/" target="_blank" rel="noopener">Canadian Jewish News, September 2026: antisemitism forum</a></li>
      <li><a href="https://www.cp24.com/video/2026/09/08/a-big-mistake-tory-on-chow-not-attending-mayoral-debate-on-anti-semitism/" target="_blank" rel="noopener">CP24, September 8, 2026: John Tory</a></li>
    </ol>

    <p class="date">Municipal election: <span>October 26, 2026.</span></p>
  </div>
</footer>

</main>

<carnival-mascot
  costume="purple"
  section-selector="main section, main article"
  point-selector="a.btn, button"
  size="230"
  mobile-size="150"
  position="bottom-right"
  avoid-selector="#sources"
  asset-base="/carnival-dancer-widget/assets/"
  label="Carnival dancer mascot">
</carnival-mascot>

`;

const pageHtml = rawHtml
  .replace("__heroImage__", heroImage)
  .replace("__taxImage__", taxImage)
  .replace("__vacantImage__", vacantImage)
  .replace("__gridlockImage__", gridlockImage)
  .replace("__policeImage__", policeImage)
  .replace("__housingImage__", housingImage)
  .replace("__encampmentImage__", encampmentImage)
  .replace("__binsImage__", binsImage)
  .replace("__squareImage__", squareImage)
  .replace("__scienceImage__", scienceImage)
  .replace("__cityHallImage__", cityHallImage);

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "ok" | "error">("idle");

  useEffect(() => {
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existing) {
        if (existing.dataset["loaded"] === "true") resolve();
        else {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(), { once: true });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.addEventListener("load", () => {
        script.dataset["loaded"] = "true";
        resolve();
      }, { once: true });
      script.addEventListener("error", () => reject(), { once: true });
      document.body.appendChild(script);
    });

    void loadScript("/carnival-dancer-widget/dancer.js")
      .then(() => loadScript("/carnival-dancer-widget/mascot.js"));
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const open = document.getElementById("menuOpen");
    const close = document.getElementById("menuClose");
    const menu = document.getElementById("menu");
    const links = menu?.querySelectorAll("a");
    const show = () => setMenuOpen(true);
    const hide = () => setMenuOpen(false);
    open?.addEventListener("click", show);
    close?.addEventListener("click", hide);
    links?.forEach((link) => link.addEventListener("click", hide));
    return () => {
      open?.removeEventListener("click", show);
      close?.removeEventListener("click", hide);
      links?.forEach((link) => link.removeEventListener("click", hide));
    };
  }, []);

  useEffect(() => {
    const menu = document.getElementById("menu");
    const open = document.getElementById("menuOpen");
    menu?.classList.toggle("open", menuOpen);
    menu?.setAttribute("aria-hidden", menuOpen ? "false" : "true");
    open?.setAttribute("aria-expanded", menuOpen ? "true" : "false");
    if (menuOpen) document.getElementById("menuClose")?.focus();
  }, [menuOpen]);

  useEffect(() => {
    const form = document.getElementById("joinForm") as HTMLFormElement | null;
    const submit = (event: Event) => {
      event.preventDefault();
      if (!form) return;
      const data = new FormData(form);
      const email = String(data.get("email") ?? "").trim();
      const name = String(data.get("name") ?? "").trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && Boolean(name) && data.get("ack") === "on";
      setFormState(valid ? "ok" : "error");
      if (valid) form.reset();
    };
    form?.addEventListener("submit", submit);
    return () => form?.removeEventListener("submit", submit);
  }, []);

  useEffect(() => {
    document.getElementById("msgOk")?.classList.toggle("show", formState === "ok");
    document.getElementById("msgErr")?.classList.toggle("show", formState === "error");
  }, [formState]);

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
