import type { Metadata } from 'next'
import Image from 'next/image'
import PageContainer from '@/components/PageContainer'
import { CONTENT_FRAME_CLASS, INTRO_FRAME_CLASS, SECTION_GAP } from '@/lib/layout'
import ContentCarousel from '@/components/ContentCarousel'
import { getContentByType, getAffiliations } from '@/lib/content'
import AffiliationPanel from '@/components/AffiliationPanel'

export const metadata: Metadata = {
  title: "About - Andreas Juon",
  description:
    "About Andreas Juon - Researcher in Conflict & Security | Data Analytics | Consulting",
};

export default function AboutPage() {
  const projectItems = getContentByType('project')
  const datasetItems = getContentByType('dataset')
  const { employment, education, minYear, maxYear } = getAffiliations()

  return (
    <PageContainer>
      <div className="mb-12">
        {/* Top horizontal intro frame with portrait, heading, and intro text */}
        <div className={`${INTRO_FRAME_CLASS} ${SECTION_GAP}`}>
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden">
                <Image
                  src="/images/portrait2.jpeg"
                  alt="Portrait of Andreas Juon"
                  fill
                  className="object-cover object-[50%_25%] transform scale-110 translate-y-2 -translate-x-2"
                  sizes="(max-width: 768px) 224px, 256px"
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About
              </h1>
              <ul className="list-disc pl-6 text-lg text-gray-700 mb-4">
                <li>
                  Political scientist with 9+ years work experience in conflict
                  and nationalism research
                </li>
                <li>
                  Multiple years of experience in leadership of research and
                  data projects (up to 12 employees)
                </li>
                <li>
                  Communication with diverse target audiences: funding agencies
                  (1.5 million CHF+ secured research funds), practitioners
                  (recent presentation at Austrian parliament + regular
                  workshops with conflict practitioners at University College
                  London), subject matter experts (~30 presentations at
                  international conferences and 11 published articles), students
                  (in 6 different courses), and refugees (3 years&apos; work)
                </li>
                <li>
                  Regional expertise on former Soviet Union (3 scientific
                  publications) and East Asia (studies in Sinology and Chinese,
                  12 months spent in China)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Curriculum Vitae block */}
        <div className={CONTENT_FRAME_CLASS}>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Curriculum Vitae
          </h2>
          <p className="text-gray-700 mb-4">
            You can browse my full CV below or download it as a PDF.
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <a
              href="/cv_andreas_juon.pdf"
              download
              className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              Download CV (PDF)
            </a>
            <a
              href="/cv_andreas_juon.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
            >
              Open in new tab
            </a>
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-medium text-gray-800">
              View CV inline (PDF preview)
            </summary>
            <div className="mt-4">
              <object
                data="/cv_andreas_juon.pdf"
                type="application/pdf"
                className="w-full h-[600px] max-h-[80vh] rounded-lg border border-gray-200"
              >
                <p className="text-gray-700">
                  Your browser does not support embedded PDFs. You can{" "}
                  <a
                    href="/cv_andreas_juon.pdf"
                    className="underline text-gray-900"
                  >
                    download the CV here
                  </a>
                  .
                </p>
              </object>
            </div>
          </details>
        </div>

        {/* Affiliations timeline: Employment*/}
        <div className={`${CONTENT_FRAME_CLASS} mt-3`}>
          <AffiliationPanel
            title="Employment"
            description="Formal employment affiliations over time."
            items={employment}
            minYear={minYear}
            maxYear={maxYear}
            minYearOverride={2016}
            compactTimeline
          />
        </div>

        {/* Affiliations timeline: Education */}
        <div className={`${CONTENT_FRAME_CLASS} mt-3`}>
          <AffiliationPanel
            title="Education"
            description="Educational affiliations, including degrees and programs."
            items={education}
            minYear={minYear}
            maxYear={maxYear}
            minYearOverride={2010}
          />
        </div>

        {/* Three-column section: Research, Data & Methods, Consulting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2 mt-2">
          {/* Research block */}
          <div className={INTRO_FRAME_CLASS}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Research
            </h2>
            {projectItems.length > 0 && (
              <div className="mb-4">
                <ContentCarousel items={projectItems} itemsPerView={1} />
              </div>
            )}
            <p className="text-lg text-gray-700 mb-4">
              My research examines how identity politics and institutional
              design shape violent conflict, democratic stability, and
              geopolitical risk. My ongoing work focuses on two major sources of
              instability in contemporary world politics: the management of
              identity-based conflict within states and the rise of exclusionary
              nationalism with implications for regional order and geopolitics.
            </p>
            <p className="text-lg text-gray-700">
              Across my research, I evaluate policies that are widely used to
              stabilize divided societies — such as constitutional
              power-sharing, decentralization, and multicultural governance —
              examining both their intended effects and their unintended
              consequences. This work speaks directly to core questions in
              international relations and conflict research: how domestic
              institutions affect internal security and democratic quality, how
              nationalist ideologies travel across borders, and how identity
              politics interacts with geopolitical competition.
            </p>
          </div>

          {/* Data and Methods block */}
          <div className={INTRO_FRAME_CLASS}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data and Methods
            </h2>
            {datasetItems.length > 0 && (
              <div className="mb-4">
                <ContentCarousel items={datasetItems} itemsPerView={1} />
              </div>
            )}
            <p className="text-lg text-gray-700 mb-4">
              A central contribution of my research is the development of new
              global datasets on nationalism, institutions, and conflict. These
              include data on constitutional power-sharing arrangements,
              regional autonomy, nationalist movements, administrative
              boundaries, and ethnically disaggregated public opinion. Together,
              these resources enable systematic cross-national analysis of
              political instability and security risks.
            </p>
            <p className="text-lg text-gray-700">
              Methodologically, I specialize in quantitative causal inference
              using large-N observational data, including fixed-effects designs,
              instrumental variables, and staggered difference-in-differences. I
              complement these approaches with survey analysis and case-based
              process tracing. Alongside my PhD in political science, I hold a
              second master’s degree in analytics/data science, which supports
              my work in data engineering, large-scale data integration, and
              applied statistical modeling.
            </p>
          </div>

          {/* Consulting block */}
          <div className={`${INTRO_FRAME_CLASS} md:col-span-2 lg:col-span-1`}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Consulting
            </h2>
            <div className="mb-4">
              {/* Match ContentTile total height: 16/9 image area + 15rem text block */}
              <div className="relative w-full h-[27rem]">
                <Image
                  src="/images/talks/talk_barcelona_crop.jpeg"
                  alt="Symbolic consulting illustration"
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-4">
              Beyond academia, I work with public-sector organizations, NGOs,
              and private firms that need rigorous analysis of political and
              security risk. My consulting focuses on:
            </p>
            <ul className="list-disc pl-6 text-lg text-gray-700 mb-4">
              <li>Political risk assessment and forecasting</li>
              <li>Conflict and instability analysis</li>
              <li>Institutional design and peacebuilding evaluation</li>
              <li>Regional autonomy and center–periphery relations</li>
              <li>Nationalism and geopolitical risk</li>
            </ul>
            <p className="text-lg text-gray-700">
              My work combines substantive expertise in conflict and nationalism
              with advanced data analysis and modeling skills, allowing
              organizations to make evidence-based decisions in complex
              political environments. If you are interested in collaboration,
              consulting, or invited talks, please get in touch.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
