import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { PasswordGate } from "@/components/PasswordGate";
import { MascotDialogue } from "@/components/MascotDialogue";
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
      { title: "Stop Olivia Chow" },
      {
        name: "description",
        content: "Three years as mayor. Here is what she promised, and what Toronto got.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Stop Olivia Chow" },
      { property: "og:description", content: "The mayor’s record, with sources." },
    ],
  }),
  component: Index,
});

type Theme = "yellow" | "purple" | "paper";
type Source = { label: string; url: string };

type Claim = {
  n: number;
  theme: Theme;
  topic: string;
  navLabel: string;
  headline: string;
  lede: string;
  image: string;
  alt: string;
  device: ReactNode;
  sources: Source[];
  happened: string[];
  why: string;
  simple: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const CLAIMS: Claim[] = [
  {
    n: 1,
    theme: "yellow",
    topic: "Taxes and spending",
    navLabel: "Property tax",
    headline: "She promised “modest.” Your property tax is up 19%.",
    lede: "In May 2023, asked how much taxes would rise if she won, Olivia Chow said: “It would be modest.” Her first budget raised residential property tax 9.5%, the largest increase since amalgamation. Then 6.9%. Then, in the election year, 2.2%.",
    image: taxImage,
    alt: "Property tax bill on a kitchen table",
    device: (
      <div className="d-bars">
        <span className="yr muted">2023</span>
        <div className="bar-line">
          <div className="bar dashed" style={{ width: "73%" }} />
          <span className="val">7.0%</span>
          <span className="note">Tory’s budget</span>
        </div>
        <span className="yr">2024</span>
        <div className="bar-line">
          <div className="bar" style={{ width: "86%" }} />
          <span className="val">9.5%</span>
        </div>
        <span className="yr">2025</span>
        <div className="bar-line">
          <div className="bar" style={{ width: "62%" }} />
          <span className="val">6.9%</span>
        </div>
        <span className="yr">2026</span>
        <div className="bar-line">
          <div className="bar" style={{ width: "20%" }} />
          <span className="val">2.2%</span>
          <span className="note">Election year</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "CityNews, May 29, 2023",
        url: "https://toronto.citynews.ca/2023/05/29/olivia-chow-toronto-mayoral-election/",
      },
      {
        label: "City of Toronto budget releases, 2024–2026",
        url: "https://www.toronto.ca/news/city-of-toronto-2024-budget-now-final-protects-core-services-and-invests-in-affordable-housing-transit-and-community-safety/",
      },
      {
        label: "Toronto Star on reserves",
        url: "https://www.thestar.com/news/gta/is-mayor-olivia-chow-raiding-torontos-reserves-in-the-2026-budget/article_0384e1af-5271-449f-ac82-41ced86b1cc0.html",
      },
      {
        label: "Toronto Life fact-check",
        url: "https://torontolife.com/city/fact-checking-the-new-anti-olivia-chow-attack-ads/",
      },
    ],
    happened: [
      "The 2026 budget leaned on roughly $550 million from City reserves to hold the rate down. The operating budget grew from $16.2 billion to $18.9 billion over the same three years.",
      "On September 4, 2026, she pledged to keep future increases “at or around” inflation.",
    ],
    why: "A mayor who says “modest” and then delivers the biggest increase in a generation has broken the one promise everyone heard.",
    simple:
      "She said small. She delivered the biggest increase since amalgamation, then went quiet in the election year. Your bill did not go quiet.",
  },
  {
    n: 2,
    theme: "purple",
    topic: "Vacant Home Tax",
    navLabel: "Vacant Home Tax",
    headline: "She tripled a tax. Then 167,000 homes were billed as vacant. Most were not.",
    lede: "In October 2023, Council under Mayor Chow raised the Vacant Home Tax from 1% to 3% of assessed value. Months later, the City deemed more than 167,000 homes vacant. Most were people living in their own homes who had missed a form.",
    image: vacantImage,
    alt: "Lit house at dusk with a full mailbox",
    device: (
      <div className="d-cells three">
        <div>
          <span className="big">11,000</span>
          <span className="cap">Owners who paid the tax the year before</span>
        </div>
        <div>
          <span className="big hi">167,000</span>
          <span className="cap">Homes deemed vacant in March 2024</span>
        </div>
        <div>
          <span className="big">108,000</span>
          <span className="cap">Bills reversed within a month</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "CBC News, October 12, 2023",
        url: "https://www.cbc.ca/news/canada/toronto/toronto-vacant-home-tax-increase-1.6991918",
      },
      {
        label: "City staff report, April 2024",
        url: "https://www.toronto.ca/legdocs/mmis/2024/cc/bgrd/backgroundfile-244913.pdf",
      },
      {
        label: "CP24, April 18, 2024",
        url: "https://www.cp24.com/news/2024/04/18/toronto-city-council-votes-to-keep-vacant-home-tax-amid-calls-to-scrap-the-program-after-fiasco/",
      },
      {
        label: "Council item 2024.CC17.1",
        url: "https://secure.toronto.ca/council/agenda-item.do?item=2024.CC17.1",
      },
    ],
    happened: [
      "Chow told Council: “How could anyone justify pressing the ‘send’ button on 165,000 bills?” She said the program’s designer was no longer with the City. Staff told Council nobody had been fired.",
      "A motion to scrap the tax lost 5 to 18. Budgeted to bring in $55 million in 2024, it finished the year about $3 million in the red.",
    ],
    why: "Billing more than a hundred thousand people who did nothing wrong is not a paperwork glitch. It is what happens when a program is tripled before anyone checks whether it works.",
    simple:
      "She made the tax three times bigger. The City billed more than a hundred thousand people for homes they lived in, and the program lost money.",
  },
  {
    n: 3,
    theme: "paper",
    topic: "Congestion",
    navLabel: "Gridlock",
    headline: "Traffic got worse. Her fix: a traffic boss, in year three.",
    lede: "In May 2026, Liaison Strategies asked Torontonians about traffic. The pollster’s read: “People are not just saying there are too many cars. They are saying the system is badly managed.” In January 2026, the mayor hired the city’s first chief congestion officer.",
    image: gridlockImage,
    alt: "Gardiner Expressway gridlock toward the CN Tower",
    device: (
      <div className="d-stats">
        <div>
          <span className="big">88%</span>
          <span className="cap">Say congestion is serious where they live</span>
        </div>
        <div>
          <span className="big">71%</span>
          <span className="cap">Say it got worse in the past year</span>
        </div>
        <div>
          <span className="big">72%</span>
          <span className="cap">Say the City coordinates road work poorly</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "Liaison Strategies, May 14, 2026",
        url: "https://press.liaisonstrategies.ca/toronto-chow-50-bradford-37-traffic-frustration-dominates-city-mood/",
      },
      {
        label: "CBC News on traffic agents",
        url: "https://www.cbc.ca/news/canada/toronto/toronto-quadrupling-number-of-traffic-agents-100-total-1.7426857",
      },
      {
        label: "CityNews, January 9, 2026",
        url: "https://toronto.citynews.ca/2026/01/09/toronto-traffic-czar-chief-congestion-officer/",
      },
    ],
    happened: [
      "Three years in, the plan was to quadruple traffic agents to 100 and budget about $299 million for congestion. A U of T transportation professor said the new job “places the blame for congestion squarely on mismanagement.”",
      "Over the same period, she fought the province to keep bike lanes on Bloor, Yonge and University while construction lane closures multiplied.",
    ],
    why: "Time stuck in traffic is a tax nobody voted on. Hiring someone to be in charge of it in year three is an admission.",
    simple:
      "Everyone knows traffic got worse. Her fix was to hire a traffic boss in the last year of her term.",
  },
  {
    n: 4,
    theme: "yellow",
    topic: "Policing and safety",
    navLabel: "Police budget",
    headline: "She offered police $12.6 million less. The Chief went public. She folded.",
    lede: "In February 2024, priority calls were waiting an average of 22 minutes against a 6-minute standard. Police asked for about $20 million more. Her draft offered $7.4 million.",
    image: policeImage,
    alt: "Toronto police cruiser outside police headquarters",
    device: (
      <ol className="d-steps">
        <li>
          <span className="dot">1</span>
          <strong>She cut the ask</strong>
          <span className="txt">“There’s no cuts,” she said. The draft was $12.6M short.</span>
        </li>
        <li>
          <span className="dot">2</span>
          <strong>The Chief warned</strong>
          <span className="txt">Less would “present an unacceptable risk.”</span>
        </li>
        <li className="end">
          <span className="dot">3</span>
          <strong>She reversed</strong>
          <span className="txt">On February 13, she backed the full request.</span>
        </li>
      </ol>
    ),
    sources: [
      {
        label: "CBC News, January 28, 2024",
        url: "https://www.cbc.ca/news/canada/toronto/toronto-police-budget-fight-1.7094937",
      },
      {
        label: "CBC News, February 13, 2024",
        url: "https://www.cbc.ca/news/canada/toronto/chow-council-police-budget-hike-1.7113986",
      },
      {
        label: "Toronto Star",
        url: "https://www.thestar.com/news/gta/mayor-olivia-chow-reverses-course-on-police-funding-request/article_d051ccf0-caa6-11ee-98cf-93304ba6188e.html",
      },
      {
        label: "TPS 2026 budget presentation",
        url: "https://www.toronto.ca/legdocs/mmis/2026/bu/bgrd/backgroundfile-261624.pdf",
      },
    ],
    happened: [
      "In 2026 she approved a further $93.8 million increase for police, and defended it during a corruption probe in which seven serving officers were charged.",
      "Confidence did not follow. One year in, 52% disapproved of her performance on crime. In August 2025, 41% said they did not feel safe on the TTC.",
    ],
    why: "A mayor who has to be talked out of her own police budget by the Chief, in public, did not know where the floor was.",
    simple:
      "Emergency calls were waiting 22 minutes. Her first instinct was to give police less than they asked for. She backed down only after the Chief went public.",
  },
  {
    n: 5,
    theme: "purple",
    topic: "Housing",
    navLabel: "Housing",
    headline: "She ran as the housing mayor. Homebuilding fell to a 30-year low.",
    lede: "In September 2025, CMHC reported Toronto on pace for its lowest housing starts in 30 years. In the first half of 2026, the City started 156 condominium units. The decade average is about 7,000 a year.",
    image: housingImage,
    alt: "Stalled concrete building frame with a crane",
    device: (
      <div className="d-versus">
        <div className="claim-side">
          <span className="k">The claim</span>
          <span className="big">30,000</span>
          <span className="cap">Rent-controlled homes “approved,” 2020–2024</span>
        </div>
        <div className="rec">
          <span className="k">The record</span>
          <span className="big">2,511</span>
          <span className="cap">Net new affordable rentals actually completed</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "CMHC, September 9, 2025",
        url: "https://www.cmhc-schl.gc.ca/media-newsroom/news-releases/2025/slowdown-toronto-vancouver-leave-national-housing-starts-flat-first-half-2025",
      },
      {
        label: "HousingTO 2024–2025 Progress Report",
        url: "https://www.toronto.ca/wp-content/uploads/2025/11/978e-HousingTO2024-2025ProgressReport.pdf",
      },
      {
        label: "Storeys, September 14, 2026",
        url: "https://storeys.com/cmhc-fall-housing-report-2026/",
      },
      {
        label: "City of Toronto, June 23, 2026",
        url: "https://www.toronto.ca/news/city-of-toronto-secures-1-5-billion-in-canada-ontario-partnership-to-build-funding-to-support-housing-and-reduce-development-charges/",
      },
    ],
    happened: [
      "Builders warned for years that development charges, well over $100,000 per home, were killing projects. The mayor froze indexing in 2025 and cut charges 40 to 60% in June 2026. Relief arrived after the collapse, not before it.",
      "In 2026, staff flagged 26 city-backed affordable projects at risk of losing their incentives because construction never started.",
    ],
    why: "An approval is a piece of paper. A home is a set of keys. 82% of Torontonians now agree the city has “lost control of the housing situation.”",
    simple:
      "She counts approvals. Families count keys. Almost nothing got built, and the fee cuts came after the crash.",
  },
  {
    n: 6,
    theme: "paper",
    topic: "Homelessness and encampments",
    navLabel: "Homelessness",
    headline: "Homelessness doubled. The tents stayed. Neighbours were told last.",
    lede: "Emergency shelters cost close to $700 million in 2025 and still ran at capacity. About 200 single adults a night were turned away. Encampments became fixtures beside playgrounds.",
    image: encampmentImage,
    alt: "Tents in a downtown park near a playground",
    device: (
      <div className="d-arrow">
        <div>
          <span className="big">7,300</span>
          <span className="when">April 2021</span>
        </div>
        <span className="arrow" aria-hidden="true">
          →
        </span>
        <div>
          <span className="big hi">15,418</span>
          <span className="when">October 2024</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "Street Needs Assessment, July 2025",
        url: "https://www.toronto.ca/news/city-of-toronto-releases-findings-of-2024-street-needs-assessment-homelessness-survey/",
      },
      {
        label: "CityNews, October 23, 2024",
        url: "https://toronto.citynews.ca/2024/10/23/toronto-clarence-park-encampment-ausma-malik/",
      },
      {
        label: "CityNews, November 7, 2024",
        url: "https://toronto.citynews.ca/2024/11/07/toronto-mayor-rejects-using-notwithstanding-clause-to-clear-encampments/",
      },
      {
        label: "Council item 2025.MM34.4",
        url: "https://secure.toronto.ca/council/agenda-item.do?item=2025.MM34.4",
      },
    ],
    happened: [
      "At Clarence Square, residents documented fires, an assault and propane tanks, and asked for the park to be cleared. In November 2024, the mayor turned down the province’s offer to help clear encampments.",
      "Near 66 Third Street in Etobicoke, next to two schools and a seniors’ residence, residents were told the process was “focused on engagement, not on consultation” of new shelter sites.",
      "The October 2025 count fell 21%, to 12,196, partly because fewer refugee claimants arrived. The shelter system was still full.",
    ],
    why: "A parent walking a child past a tent by the swings, and a street told the shelter is coming either way, are both looking at a City Hall that stopped listening.",
    simple:
      "Twice as many people on the street. Close to $700 million a year on shelters. Tents beside playgrounds. Neighbourhoods told after it’s decided.",
  },
  {
    n: 7,
    theme: "yellow",
    topic: "The basics",
    navLabel: "The basics",
    headline: "Taxes up 19%. Bins still full. Buses still late.",
    lede: "Litter bins overflowed so reliably that in 2026 the mayor asked Council to “end the persistent problem of broken and overflowing litter bins.” The Auditor General found 17 of 18 Toronto Water repair projects missed their dates.",
    image: binsImage,
    alt: "Overflowing litter bin beside a streetcar",
    device: (
      <div className="d-callout">
        <span className="big">
          10<small> / 179</small>
        </span>
        <span className="cap">
          Surface routes that met the 90% on-time target in rush hour, January 2025. Riders say
          reliability, not fares, is the problem.
        </span>
      </div>
    ),
    sources: [
      {
        label: "CityNews, July 12, 2024",
        url: "https://toronto.citynews.ca/2024/07/12/olivia-chow-toronto-mayor-one-year-transit-traffic-affordable-housing-gardiner/",
      },
      {
        label: "CBC News on litter bins",
        url: "https://www.cbc.ca/news/canada/toronto/toronto-sidewalk-litter-bins-9.7113647",
      },
      { label: "Auditor General, October 2025", url: "https://www.torontoauditor.ca/report/4646/" },
      {
        label: "CP24, January 23, 2025",
        url: "https://www.cp24.com/local/toronto/2025/01/23/only-10-ttc-surface-routes-are-meeting-the-goal-for-on-time-performance-and-bunching-may-be-to-blame-report/",
      },
    ],
    happened: [
      "Fares were frozen and service hours added, yet riders asked what would bring them back put reliable service first and lower fares far down the list. Slow snow clearing in winter 2025 was a documented citywide complaint.",
      "The City’s own survey says 69% rate quality of life as good. That leaves 31% of a city of three million who do not.",
    ],
    why: "A tax increase is a contract: pay more, get a city that works. Overflowing bins and bunching buses are that contract not being met.",
    simple:
      "You pay 19% more. The bins are still full, the buses still bunch, and the mayor’s own word for the city was “falling apart.”",
  },
  {
    n: 8,
    theme: "purple",
    topic: "Sankofa Square",
    navLabel: "Sankofa Square",
    headline: "She seconded a name change that 71% of Toronto did not want.",
    lede: "In December 2023, Council voted to rename Yonge-Dundas Square as Sankofa Square. Mayor Chow seconded the motion and, per the Toronto Star, steered the compromise herself. The term had opened with a $1.8 billion budget gap.",
    image: squareImage,
    alt: "Crowds at Yonge-Dundas Square",
    device: (
      <div className="d-cells two">
        <div>
          <span className="big hi">71%</span>
          <span className="cap">Of Torontonians disapproved, a month later</span>
        </div>
        <div>
          <span className="big">$335K</span>
          <span className="cap">Budgeted for signs. The board warned $860K.</span>
        </div>
      </div>
    ),
    sources: [
      {
        label: "Council item 2023.MM13.29",
        url: "https://secure.toronto.ca/council/agenda-item.do?item=2023.MM13.29",
      },
      {
        label: "Toronto Star, December 2023",
        url: "https://www.thestar.com/how-olivia-chow-intervened-to-change-course-on-renaming-dundas-street/article_8de4dcee-a0f9-11ee-a8ae-6b684a60c7b2.html",
      },
      {
        label: "CBC News on costs",
        url: "https://www.cbc.ca/news/canada/toronto/yonge-dundas-square-renaming-costs-funding-1.7231976",
      },
      {
        label: "Liaison Strategies, January 2024",
        url: "https://press.liaisonstrategies.ca/torontonians-dont-want-sankofa-trudeau-troubles-continue-in-suburbs/",
      },
    ],
    happened: [
      "Downtown, where the square sits, 69% disapproved. The signage money came from Section 37 developer contributions. That is still public money that could have gone to a park, a community centre, or the bins.",
    ],
    why: "A small item with a big message about priorities.",
    simple:
      "Seven in ten people said no. She backed it anyway, and money that could have gone to the neighbourhood went to new signs.",
  },
  {
    n: 9,
    theme: "paper",
    topic: "Ontario Place and the Science Centre",
    navLabel: "Waterfront deal",
    headline: "She promised to fight Ford’s waterfront plan. Then she signed it away.",
    lede: "The highway upload is worth billions to the City. It is also the largest thing she has done as mayor, and she paid for it with the promise that got her elected.",
    image: scienceImage,
    alt: "Closed Ontario Science Centre",
    device: (
      <ol className="d-steps">
        <li>
          <span className="when">2023 campaign</span>
          <strong>Promised</strong>
          <span className="txt">
            Fight the Therme spa, the Science Centre move, and the Gardiner rebuild.
          </span>
        </li>
        <li>
          <span className="when">Nov 27, 2023</span>
          <strong>Signed</strong>
          <span className="txt">A “New Deal” that “accepts Ontario’s authority” on all three.</span>
        </li>
        <li className="end purple">
          <span className="when">June 2024</span>
          <strong>Closed</strong>
          <span className="txt">The province shut the Science Centre, citing repair costs.</span>
        </li>
      </ol>
    ),
    sources: [
      {
        label: "Globe and Mail, November 27, 2023",
        url: "https://www.theglobeandmail.com/canada/article-historic-deal-on-torontos-finances-will-see-province-take-over-two/",
      },
      {
        label: "Government of Ontario release",
        url: "https://news.ontario.ca/en/release/1003888/ontario-and-toronto-reach-a-new-deal",
      },
      {
        label: "CityNews, November 28, 2023",
        url: "https://toronto.citynews.ca/2023/11/28/advocates-say-ontario-place-deal-between-province-toronto-falls-short/",
      },
      { label: "CBC News", url: "https://www.cbc.ca/amp/1.7040823" },
    ],
    happened: [
      "The province took over the Gardiner and the Don Valley Parkway and committed about $1.2 billion in operating support over three years. Advocates who campaigned beside her called it “selling out.”",
      "After the closure, the mayor said the deal’s promise of science programming had been “fairly vague” and that talks on it had never happened.",
    ],
    why: "If she would trade away her signature commitment inside five months, what does “at or around inflation” mean now?",
    simple:
      "She ran against Ford’s waterfront plan. Five months in, she traded it away. Then the Science Centre closed.",
  },
  {
    n: 10,
    theme: "yellow",
    topic: "Trust and showing up",
    navLabel: "October 7 vigil",
    headline: "She skipped the October 7 vigil. The excuses kept changing.",
    lede: "On October 7, 2024, about 20,000 people gathered for the first-anniversary vigil for victims of the Hamas attack on Israel. Premier Ford came. John Tory came. The mayor of Toronto did not.",
    image: cityHallImage,
    alt: "Toronto City Hall at night",
    device: (
      <div className="d-chips">
        <div className="k">Her explanations, in order</div>
        <div className="row">
          <span className="chip">“Exhausted”</span>
          <span className="arr" aria-hidden="true">
            →
          </span>
          <span className="chip">“My office did not get the email”</span>
          <span className="arr" aria-hidden="true">
            →
          </span>
          <span className="chip">“Miscommunication”</span>
          <span className="arr" aria-hidden="true">
            →
          </span>
          <span className="chip end">An apology</span>
        </div>
        <p>
          A Toronto Sun FOI request later showed at least two emails about the vigil had reached her
          inbox.
        </p>
      </div>
    ),
    sources: [
      {
        label: "CIJA, October 9, 2024",
        url: "https://www.cija.ca/taking_zero_accountability_mayor_chow_instead_blames_denies_deflects_on_why_she_let_down_the_jewish_community_on_october_7",
      },
      {
        label: "CP24, October 9, 2024",
        url: "https://www.cp24.com/politics/toronto-city-hall/2024/10/09/i-should-have-been-there-toronto-mayor-says-she-regrets-not-being-at-oct-7-vigil/",
      },
      {
        label: "Toronto Sun FOI",
        url: "https://torontosun.com/news/local-news/mayor-chow-got-emails-about-oct-7-vigil-documents-show",
      },
      {
        label: "National Post, May 2024",
        url: "https://nationalpost.com/news/toronto/olivia-chow-flag-raising-israel-independence-day",
      },
      {
        label: "CP24, September 8, 2026",
        url: "https://www.cp24.com/video/2026/09/08/a-big-mistake-tory-on-chow-not-attending-mayoral-debate-on-anti-semitism/",
      },
    ],
    happened: [
      "In May 2024 she skipped the Israel Independence Day flag-raising at City Hall, calling it “a bit divisive.” In November 2025, at an event closed to media, she referred to “the genocide in Gaza.” Complaints were filed; none had been decided as of this writing.",
      "In September 2026 she declined a mayoral forum on antisemitism that her two main opponents attended. John Tory called that “a big mistake.”",
    ],
    why: "A mayor represents everyone, including communities that are frightened. Toronto’s Jewish community asked for one thing three years running: show up.",
    simple:
      "Twenty thousand people gathered to mourn. The mayor did not come, and her reasons kept changing. Two years later she would not come to the forum about it either.",
  },
];

const PULL_QUOTES: Record<number, { quote: string; cite: string; wide?: boolean }> = {
  3: {
    quote: "“How could anyone justify pressing the ‘send’ button on 165,000 bills?”",
    cite: "Olivia Chow, on her own tax · April 2024",
  },
  6: {
    quote: "“The toughest is looking at all the things falling apart.”",
    cite: "Olivia Chow, one year into the job · July 2024",
  },
  9: {
    quote:
      "“She promised modest before. Voters have every reason not to take her word for it this time either.”",
    cite: "Councillor Brad Bradford · September 2026",
    wide: true,
  },
};

const SCOREBOARD = [
  { n: 1, num: "19%", desc: "Property-tax increase across her three budgets", go: "01 · Taxes" },
  {
    n: 2,
    num: "167K",
    desc: "Homes billed as vacant. Most were lived in.",
    go: "02 · Vacant Home Tax",
  },
  {
    n: 3,
    num: "88%",
    desc: "Say gridlock is a serious problem where they live",
    go: "03 · Congestion",
  },
  { n: 6, num: "2×", desc: "People without a home, 2021 to 2024", go: "06 · Homelessness" },
];

const SEEN = [
  "Tax bill",
  "Traffic",
  "Full bins",
  "Tents",
  "Late buses",
  "Stalled builds",
  "Shelter siting",
  "Safety",
];

function pageUrl(hash = "") {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}${hash}`;
}

/** Share / Post / Email for one claim (or the whole record when no claim is given). */
function useShare() {
  const [note, setNote] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const flash = (msg: string) => {
    setNote(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(null), 2500);
  };
  const share = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelled */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {
      flash("Copy failed");
    }
  };
  const post = (title: string, url: string) => {
    const intent = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };
  const email = (title: string, url: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`;
  };
  return { note, share, post, email };
}

function ClaimRow({
  claim,
  open,
  onToggle,
}: {
  claim: Claim;
  open: boolean;
  onToggle: () => void;
}) {
  const { note, share, post, email } = useShare();
  const id = `claim-${claim.n}`;
  const url = () => pageUrl(`#${id}`);
  const flip = claim.n % 2 === 0;
  return (
    <section
      id={id}
      data-claim={claim.n}
      data-mascot={`issue-${claim.n}`}
      className={`claim t-${claim.theme}${flip ? " flip" : ""}`}
      aria-labelledby={`${id}-title`}
    >
      {/* Old shared links used #issue-N for the same claims. */}
      <span className="legacy-anchor" id={`issue-${claim.n}`} aria-hidden="true" />
      <div className="claim-photo">
        <img src={claim.image} alt={claim.alt} loading="lazy" decoding="async" />
      </div>
      <div className="claim-copy">
        <div className="claim-meta">
          <span className="badge">{pad(claim.n)} / 10</span>
          <span>{claim.topic}</span>
        </div>
        <h2 id={`${id}-title`}>{claim.headline}</h2>
        <p className="claim-lede">{claim.lede}</p>
        {claim.device}
        <p className="sources">
          <strong>SOURCES</strong>
          {claim.sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
        <div className="claim-actions">
          <button
            type="button"
            className="more-btn"
            aria-expanded={open}
            aria-controls={`${id}-more`}
            onClick={onToggle}
          >
            {open ? "Close the full record −" : "Read the full record +"}
          </button>
          <div className="share-row">
            <button type="button" onClick={() => share(claim.headline, url())}>
              Share
            </button>
            <button type="button" onClick={() => post(claim.headline, url())}>
              Post
            </button>
            <button type="button" onClick={() => email(claim.headline, url())}>
              Email
            </button>
            {note && (
              <span className="share-note" role="status">
                {note}
              </span>
            )}
          </div>
        </div>
        {open && (
          <div className="full-record" id={`${id}-more`}>
            <div className="sub">— What happened</div>
            {claim.happened.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="sub">— Why it matters</div>
            <p>{claim.why}</p>
            <div className="simple">
              <div className="sub">The simple version</div>
              {claim.simple}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Nav({ active }: { active: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menuOpen]);

  return (
    <nav className="nav" aria-label="Site">
      <div className="nav-bar">
        <a className="wordmark" href="#top">
          <span className="stop">Stop</span>
          <span>Olivia Chow</span>
        </a>
        <div className="menu-wrap" ref={wrapRef}>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="record-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            The Record <span className="caret">{menuOpen ? "▲" : "▼"}</span>
          </button>
          {menuOpen && (
            <div className="menu-panel" id="record-menu">
              {CLAIMS.map((c) => (
                <a key={c.n} href={`#claim-${c.n}`} onClick={() => setMenuOpen(false)}>
                  <span>{pad(c.n)}</span>
                  <span>{c.navLabel}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="ticks">
          {CLAIMS.map((c) => (
            <a
              key={c.n}
              href={`#claim-${c.n}`}
              title={c.navLabel}
              className={c.n === active ? "on" : c.n < active ? "past" : undefined}
              aria-current={c.n === active ? "location" : undefined}
            >
              {pad(c.n)}
            </a>
          ))}
        </div>
        <span className="nav-spacer" />
        <a className="nav-join" href="#join">
          Join us
        </a>
      </div>
    </nav>
  );
}

function Join() {
  const [seen, setSeen] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const { note, share } = useShare();
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: connect to the campaign's sign-up service. Nothing is transmitted yet.
    setSent(true);
  };
  return (
    <section className="join" id="join" data-mascot="join" aria-labelledby="joinTitle">
      <div className="inner">
        <div className="join-copy">
          <div className="label">Join the coalition</div>
          <h2 id="joinTitle">Help us finish this.</h2>
          <p className="lede">
            If you are paying more and getting less, you are not alone. Share the record. Tell your
            neighbours. Show up in October.
          </p>
          <div className="seen">
            <div className="k">What have you seen in your neighbourhood?</div>
            <div className="seen-chips">
              {SEEN.map((label) => {
                const on = seen.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setSeen((s) => (on ? s.filter((x) => x !== label) : [...s, label]))
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {sent ? (
          <div className="joined" role="status">
            <div className="big">You’re in.</div>
            <p>Thanks for joining. Next step: send the record to three neighbours.</p>
            <div className="acts">
              <button
                type="button"
                onClick={() => share("Stop Olivia Chow: the record", pageUrl("#record"))}
              >
                Share the record
              </button>
              <button type="button" className="ghost" onClick={() => setSent(false)}>
                Back
              </button>
              {note && <span className="share-note">{note}</span>}
            </div>
          </div>
        ) : (
          <form className="join-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="join-first">
              First name
            </label>
            <input
              id="join-first"
              name="firstName"
              autoComplete="given-name"
              required
              placeholder="First name"
            />
            <div className="pair">
              <label className="sr-only" htmlFor="join-email">
                Email address
              </label>
              <input
                id="join-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
              />
              <label className="sr-only" htmlFor="join-postal">
                Postal code
              </label>
              <input
                id="join-postal"
                name="postalCode"
                autoComplete="postal-code"
                placeholder="Postal code"
              />
            </div>
            <label className="sr-only" htmlFor="join-mobile">
              Mobile number (optional)
            </label>
            <input
              id="join-mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              placeholder="Mobile number (optional)"
            />
            <p>
              We will use this list to keep residents informed and organized through election day.
              We never share your details. Text STOP to opt out.
            </p>
            <button type="submit">Join us</button>
          </form>
        )}
      </div>
    </section>
  );
}

const BASE = import.meta.env.BASE_URL;

// The dancer is a custom element from public/carnival-dancer-widget; it picks its
// dialogue from the nearest [data-mascot] section (see src/lib/mascot-lines.ts).
const MASCOT_ATTRS: Record<string, string> = {
  costume: "purple",
  "section-selector": "[data-mascot]",
  "dismiss-days": "0",
  "point-selector": "a.btn, button",
  size: "230",
  "mobile-size": "150",
  position: "bottom-right",
  "avoid-selector": "#sources",
  "asset-base": `${BASE}carnival-dancer-widget/assets/`,
  label: "Carnival dancer mascot",
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
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
    script.addEventListener(
      "load",
      () => {
        script.dataset["loaded"] = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(), { once: true });
    document.body.appendChild(script);
  });
}

// The element is created once on <body>, outside React's tree. Re-inserting it
// (e.g. via innerHTML on a re-render) replays her entrance and orphans the
// dialogue listeners in MascotDialogue.
function Mascot() {
  useEffect(() => {
    let mascot = document.querySelector("carnival-mascot");
    if (!mascot) {
      mascot = document.createElement("carnival-mascot");
      for (const [name, value] of Object.entries(MASCOT_ATTRS)) mascot.setAttribute(name, value);
      document.body.appendChild(mascot);
    }
    void loadScript(`${BASE}carnival-dancer-widget/dancer.js`).then(() =>
      loadScript(`${BASE}carnival-dancer-widget/mascot.js`),
    );
  }, []);
  return <MascotDialogue />;
}

function Page() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset["claim"]));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-claim]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="page">
      <a className="skip" href="#record">
        Skip to the record
      </a>
      <div className="disclaimer" role="note">
        An independent residents’ campaign in Toronto. Not affiliated with the City of Toronto or
        any candidate.
      </div>
      <Nav active={active} />

      <main>
        <header id="top" className="hero" data-mascot="home">
          <div className="hero-copy">
            <div className="label">Three years as mayor</div>
            <h1>
              <span>Toronto is</span>
              <span>falling</span>
              <span className="r">apart.</span>
            </h1>
            <p className="hero-sub">
              Three budgets. A 19% property-tax increase. Here is what she promised, and what
              Toronto got.
            </p>
            <div className="btn-row">
              <a className="btn btn-red" href="#join">
                Join the coalition
              </a>
              <a className="btn btn-outline" href="#record">
                Read the record ↓
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src={heroImage}
              alt="Olivia Chow on a rainy Toronto street at dusk"
              fetchPriority="high"
            />
          </div>
        </header>

        <section
          id="record"
          className="scoreboard"
          data-mascot="record"
          aria-labelledby="recordTitle"
        >
          <div className="inner">
            <div className="scoreboard-head">
              <div>
                <div className="label">The case</div>
                <h2 id="recordTitle">The record</h2>
              </div>
              <p className="lede">
                The mayor’s job is basic: keep taxes fair, keep streets moving, keep people housed
                and safe, and keep your promises. Ten issues follow. On each one, Toronto is worse
                off or no better.
              </p>
            </div>
            <div className="tiles">
              {SCOREBOARD.map((t) => (
                <a key={t.n} className="tile" href={`#claim-${t.n}`}>
                  <span className="num">{t.num}</span>
                  <span className="desc">{t.desc}</span>
                  <span className="go">{t.go} →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {CLAIMS.map((claim) => {
          const pq = PULL_QUOTES[claim.n];
          return (
            <div key={claim.n} style={{ display: "contents" }}>
              <ClaimRow
                claim={claim}
                open={!!open[claim.n]}
                onToggle={() => setOpen((o) => ({ ...o, [claim.n]: !o[claim.n] }))}
              />
              {pq && (
                <figure className={`pullquote${pq.wide ? " wide" : ""}`}>
                  <blockquote>{pq.quote}</blockquote>
                  <figcaption>{pq.cite}</figcaption>
                </figure>
              )}
            </div>
          );
        })}

        <section className="vote" data-mascot="cta" aria-labelledby="voteTitle">
          <div className="inner">
            <div className="label">Want a mayor who does the job?</div>
            <h2 id="voteTitle">
              <span>On October 26,</span>
              <span className="ink">vote her out.</span>
            </h2>
            <a className="btn btn-ink" href="#join">
              I’m in →
            </a>
          </div>
        </section>

        <Join />
      </main>

      <footer className="foot" data-mascot="footer">
        <div className="inner">
          <div className="foot-top">
            <div className="foot-id">An independent residents’ campaign</div>
            <div className="foot-links">
              <a href="#record">The record</a>
              <a href="#sources">All sources</a>
              {/* TODO: link to the privacy policy once it exists. */}
              <a href="#">Privacy policy</a>
            </div>
          </div>
          <p className="foot-note">
            Not affiliated with the City of Toronto or any candidate. Every claim links to its
            source.
          </p>
          <details className="foot-sources" id="sources">
            <summary>All sources</summary>
            <div className="cols">
              {CLAIMS.map((c) => (
                <div key={c.n}>
                  <h3>
                    {pad(c.n)} · {c.navLabel}
                  </h3>
                  <ul>
                    {c.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </footer>
    </div>
  );
}

function Index() {
  return (
    <PasswordGate>
      <Page />
      <Mascot />
    </PasswordGate>
  );
}
